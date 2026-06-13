
import cron from 'node-cron'
import { sendRecoveryEmail } from '../services/emailServices.js'
import { Op } from 'sequelize'
import { RecoveryCases, StripeAccountCustomers, RecoveryActions, RecoveryCommunications } from '../models/index.js'
import { retryStripePayment } from './stripeRetryService.js'

const { v4: uuid } = await import('uuid')

const CADENCE_HOURS = {
    1: 0,
    2: 24,
    3: 72,
    4: 168
}

const RECOVERY_ACTIONS = {
    1: { email: true, stripeRetry: false },
    2: { email: true, stripeRetry: true },
    3: { email: true, stripeRetry: true },
    4: { email: true, stripeRetry: false }
}

function hoursSince(date) {
    return (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60)
}

export async function recoveryProcessor() {
    const activeCases = await RecoveryCases.findAll({
        where: {
            status: 'active'
        }
    })


    for (const recoveryCase of activeCases) {
        const score = getRecoveryUrgencyScore(recoveryCase)
        // const decision = await shouldSendNextEmail(recoveryCase)
        const decision = getNextStep(score)

        // if (!decision.shouldSend) continue
        if (!decision.send) continue

        const customer = await StripeAccountCustomers.findOne({
            where: {
                stripe_customer_id: recoveryCase.stripe_customer_id,
                stripe_account_uuid: recoveryCase.stripe_account_uuid
            }
        })

        if (!customer?.email) continue

        // const emailNumber = decision.nextStep
        const emailNumber = decision.step

        //1. send email
        const result = await sendRecoveryEmail({
            to: customer.email,
            hostedInvoiceUrl: recoveryCase.hosted_invoice_url,
            amountDue: recoveryCase.amount_due / 100,
            emailNumber
        })

        await recoveryCase.increment(
            'recovery_email_sent_count'
        )

        await RecoveryCommunications.create({
            id: uuid(),
            recovery_case_id: recoveryCase.id,
            type: 'email',
            step: emailNumber,
            status: 'sent',
            recipient: customer.email,
            provider_id: result?.id ?? null,
            sent_at: new Date()
        })

        // optional: update case summary (NOT counters)
        await recoveryCase.update({
            last_email_step: emailNumber,
            last_contacted_at: new Date()
        })

        // 2. stripe action decision
        const action = RECOVERY_ACTIONS[step]

        if (action?.stripeRetry) {

            if (!recoveryCase.stripe_payment_intent_id) {
                console.log("No paymentIntentId — skipping retry")
                continue
            }

            const result = await retryStripePayment({
                stripeAccountId: recoveryCase.stripe_account_uuid,
                paymentIntentId: recoveryCase.stripe_payment_intent_id
            })

            await RecoveryCommunications.create({
                id: uuid(),
                recovery_case_id: recoveryCase.id,
                type: 'stripe_retry',
                step,
                status: result.success ? 'success' : 'failed',
                provider_id: result.intent?.id ?? null,
                sent_at: new Date(),
                metadata: { error: result.error ?? null }
            })
        }
    }

    // for (const recoveryCase of activeCases) {
    //     if (!(await shouldSendNextEmail(recoveryCase))) {
    //         continue
    //     }

    //     const customer = await StripeAccountCustomers.findOne({
    //         where: {
    //             stripe_customer_id: recoveryCase.stripe_customer_id,
    //             stripe_account_uuid: recoveryCase.stripe_account_uuid
    //         }
    //     })

    //     if (!customer?.email) {
    //         continue
    //     }

    //     // const emailNumber = recoveryCase.recovery_email_sent_count + 1

    //     const lastEmail = await RecoveryActions.findOne({
    //         where: {
    //             recovery_case_id: recoveryCase.id,
    //             action_type: 'recovery_email_sent'
    //         },
    //         order: [['created_at', 'DESC']]
    //     })

    //     const emailNumber = lastEmail
    //         ? lastEmail.details.emailNumber + 1
    //         : 1

    //     await sendRecoveryEmail({
    //         to: customer.email,
    //         hostedInvoiceUrl: recoveryCase.hosted_invoice_url,
    //         amountDue: recoveryCase.amount_due / 100,
    //         emailNumber: emailNumber
    //     })

    //     await recoveryCase.increment(
    //         'recovery_email_sent_count'
    //     )

    //     await recoveryCase.update({
    //         last_recovery_email_sent_at: new Date()
    //     })

    //     await RecoveryActions.create({
    //         id: uuid(),
    //         recovery_case_id: recoveryCase.id,
    //         action_type: 'recovery_email_sent',
    //         details: {
    //             emailNumber: emailNumber,
    //             recipient: customer.email
    //         }
    //     })

    // }

}

cron.schedule(
    '*/15 * * * *',
    recoveryProcessor
)

function getRecoveryUrgencyScore(recoveryCase) {

    let score = 0

    // time decay
    const hours = hoursSince(recoveryCase.last_payment_attempt_at)

    if (hours > 1) score += 2
    if (hours > 6) score += 3
    if (hours > 24) score += 5
    if (hours > 72) score += 8

    // behavior signals
    if (recoveryCase.amount_due > 10000) score += 2
    if (recoveryCase.recovery_email_sent_count === 0) score += 3

    // engagement signals (future)
    if (recoveryCase.last_customer_activity_at) score -= 5

    return score
}

function getNextStep(score) {
    if (score < 5) return { send: false }
    if (score < 10) return { send: true, step: 1 }
    if (score < 15) return { send: true, step: 2 }
    if (score < 25) return { send: true, step: 3 }
    return { send: true, step: 4 }
}


// cadence logic
async function shouldSendEmail(recoveryCase) {
    // const sent = recoveryCase.recovery_email_sent_count

    const activeCases = await RecoveryCases.findAll({
        where: { status: 'active' }
    })

    // if (sent === 0) {
    //     return true
    // }

    // if (!recoveryCase.last_recovery_email_sent_at) {
    //     return true
    // }

    // const hours = hoursSince(recoveryCase.last_recovery_email_sent_at)

    if (sent === 1 && hours >= 24) {
        return true
    }

    if (sent === 2 && hours >= 72) {
        return true
    }

    if (sent === 3 && hours >= 168) {
        return true
    }

    if (recoveryCase.recovery_email_sent_count >= 4) {
        return false
    }

    return false
}


// async function shouldSendNextEmail(recoveryCase) {
//     const lastEmail = await RecoveryCommunications.findOne({
//         where: {
//             recovery_case_id: recoveryCase.id,
//             type: 'email',
//             status: 'sent'
//         },
//         order: [['step', 'DESC'], ['sent_at', 'DESC']]
//     })

//     // No emails sent yet → send step 1
//     if (!lastEmail) return { shouldSend: true, nextStep: 1 }

//     const nextStep = lastEmail.step + 1

//     // stop condition
//     if (nextStep > 4) {
//         return { shouldSend: false }
//     }

//     const hours = hoursSince(lastEmail.sent_at)
//     const requiredDelay = CADENCE_HOURS[nextStep]

//     if (hours >= requiredDelay) {
//         return { shouldSend: true, nextStep }
//     }

//     return { shouldSend: false }
// }




