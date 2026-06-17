
import cron from 'node-cron'
import { Op } from 'sequelize'
import { sendRecoveryEmail } from '../services/emailServices.js'
import { retryStripePayment } from './stripeRetryService.js'

import {
    RecoveryCases, StripeAccountCustomers,
    RecoveryCommunications, StripeAccount,
    CronJobAudit
} from '../models/index.js'

const { v4: uuid } = await import('uuid')

cron.schedule(
    '*/15 * * * *',
    recoveryProcessor
)

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
    await CronJobAudit.create({
        id: uuid(),
        created_at: new Date()
    })

    const activeCases = await RecoveryCases.findAll({
        where: {
            status: 'active',
            next_action_at: {
                [Op.lte]: new Date()
            }
        }
    })


    for (const recoveryCase of activeCases) {
        // todo: use in future
        // const score = getRecoveryUrgencyScore(recoveryCase)
        const decision = await shouldSendNextEmail(recoveryCase)

        // todo: use in future
        // const decision = getNextStep(score)

        // if (!decision.send) continue

        // if (!decision) continue
        if (!decision.shouldSend) {
            await recoveryCase.update({
                next_action_at: null
            })
            continue
        }
        const customer = await StripeAccountCustomers.findOne({
            where: {
                stripe_customer_id: recoveryCase.stripe_customer_id,
                stripe_account_uuid: recoveryCase.stripe_account_uuid
            }
        })

        if (!customer?.email) continue

        // const emailNumber = decision.step
        const emailNumber = decision.nextStep

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

        const nextAction = new Date()

        nextAction.setHours(
            nextAction.getHours() + CADENCE_HOURS[emailNumber + 1]
        )

        await recoveryCase.update({
            next_action_at: nextAction
        })

        // update case summary after email sent
        await recoveryCase.update({
            last_email_step: emailNumber,
            last_contacted_at: new Date()
        })

        // 2. stripe action decision
        const action = RECOVERY_ACTIONS[emailNumber]

        if (action?.stripeRetry) {

            if (!recoveryCase.stripe_payment_intent_id) {
                console.log("No paymentIntentId — skipping retry")
                continue
            }

            const stripeAccount = await StripeAccount.findByPk(
                recoveryCase.stripe_account_uuid
            )

            const result = await retryStripePayment({
                stripeAccountId: stripeAccount.stripe_account_id,
                paymentIntentId: recoveryCase.stripe_payment_intent_id
            })

            await recoveryCase.increment(
                'retry_count'
            )

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

            // update case summary after charge retry
            await recoveryCase.update({
                last_retry_attempt_at: new Date(),
                last_retry_status: result.success ? 'success' : 'failed'
            })
        }
    }

}



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

    // engagement signals
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
// async function shouldSendEmail(recoveryCase) {
//     // const sent = recoveryCase.recovery_email_sent_count

//     // const activeCases = await RecoveryCases.findAll({
//     //     where: { status: 'active' }
//     // })

//     if (sent === 1 && hours >= 24) {
//         return true
//     }

//     if (sent === 2 && hours >= 72) {
//         return true
//     }

//     if (sent === 3 && hours >= 168) {
//         return true
//     }

//     if (recoveryCase.recovery_email_sent_count >= 4) {
//         return false
//     }

//     return false
// }

async function shouldSendNextEmail(recoveryCase) {
    const lastEmail = await RecoveryCommunications.findOne({
        where: {
            recovery_case_id: recoveryCase.id,
            type: 'email',
            status: 'sent'
        },
        order: [['step', 'DESC'], ['sent_at', 'DESC']]
    })

    // No emails sent yet → send step 1
    if (!lastEmail) return { shouldSend: true, nextStep: 1 }

    const nextStep = lastEmail.step + 1

    // stop condition
    if (nextStep > 4) {
        return { shouldSend: false }
    }

    const hours = hoursSince(lastEmail.sent_at)
    const requiredDelay = CADENCE_HOURS[nextStep]

    if (hours >= requiredDelay) {
        return { shouldSend: true, nextStep }
    }

    return { shouldSend: false }


}
// function shouldSendNextEmail(recoveryCase) {
//     const sent = recoveryCase.recovery_email_sent_count

//     if (sent >= 4) {
//         return false
//     }

//     if (sent === 0) {
//         return true
//     }

//     if (!recoveryCase.last_recovery_email_sent_at) {
//         return true
//     }

//     const hours = hoursSince(recoveryCase.last_recovery_email_sent_at)

//     if (sent === 1 && hours >= 24) {
//         return true
//     }

//     if (sent === 2 && hours >= 72) {
//         return true
//     }

//     if (sent === 3 && hours >= 168) {
//         return true
//     }

//     return false
// }


