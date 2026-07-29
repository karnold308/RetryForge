
// import cron from 'node-cron'
import { Op } from 'sequelize'
import { sendRecoveryEmail } from '../services/emailServices.js'
import { retryStripePayment } from '../services/stripeRetryService.js'

import {
    RecoveryCases, StripeAccountCustomers,
    RecoveryCommunications, StripeAccount,
    CronJobAudit,
    WebhookEvents
} from '../models/index.js'

const { v4: uuid } = await import('uuid')

const STRIPE_RETRY_BUFFER_HOURS = 1

// cron.schedule(
//     '*/15 * * * *',
//     recoveryProcessor
// )

// const CADENCE_HOURS = {
//     1: 0,
//     2: 24,
//     3: 72,
//     4: 168
// }

// const RECOVERY_ACTIONS = {
//     1: { email: true, stripeRetry: false },
//     2: { email: true, stripeRetry: true },
//     3: { email: true, stripeRetry: true },
//     4: { email: true, stripeRetry: false }
// }

// const RECOVERY_PLAN = {
//     1: {
//         delayHours: 0,
//         email: true,
//         stripeRetry: false
//     },
//     2: {
//         delayHours: 24,
//         email: true,
//         stripeRetry: true
//     },
//     3: {
//         delayHours: 72,
//         email: true,
//         stripeRetry: true
//     },
//     4: {
//         delayHours: 168,
//         email: true,
//         stripeRetry: false
//     }
// }

const RECOVERY_PLAN = {
    1: {
        delayHours: 0,
        shouldRetry: false,
        shouldEmail: true,
        emailNumber: 1
    },
    2: {
        delayHours: 24,
        shouldRetry: true,
        shouldEmail: true,
        emailNumber: 2
    },
    3: {
        delayHours: 72,
        shouldRetry: true,
        shouldEmail: true,
        emailNumber: 3
    },
    4: {
        delayHours: 168,
        shouldRetry: true,
        shouldEmail: true,
        emailNumber: 4
    }
}

function hoursSince(date) {
    return (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60)
}

export async function recoveryProcessor() {
    console.log('in recoveryProcessor')
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


    console.log('num of active cases: ' + activeCases.length)


    for (const recoveryCase of activeCases) {
        console.log('recoveryCase id: ' + recoveryCase.id)
        if (null === recoveryCase.failure_message) {
            // for each recovery case, look up webhook events for that customer and get 
            // failure_code, failure_message....
            const events = await WebhookEvents.findAll({
                where: {
                    stripe_customer_id: recoveryCase.stripe_customer_id,
                    stripe_account_uuid: recoveryCase.stripe_account_uuid
                },
                order: [['received_at', 'DESC']],
                limit: 20
            })

            for (const event of events) {
                let failureMessage = recoveryCase.failure_message
                let failureCode = recoveryCase.failure_code
                let networkDeclineCode = recoveryCase.network_decline_code
                let paymentMethodType = recoveryCase.payment_method_type
                let declineCode = recoveryCase.decline_code
                let paymentIntentId = recoveryCase.stripe_payment_intent_id

                if (null !== event.failure_message) {
                    failureMessage = event.failure_message
                }
                if (null !== event.failure_code) {
                    failureCode = event.failure_code
                }
                if (null !== event.network_decline_code) {
                    networkDeclineCode = event.network_decline_code
                }
                if (null !== event.payment_method_type) {
                    paymentMethodType = event.payment_method_type
                }
                if (null !== event.decline_code) {
                    declineCode = event.decline_code
                }

                if (null !== event.stripe_payment_intent_id) {
                    paymentIntentId = event.stripe_payment_intent_id
                }

                if (null !== failureMessage) {
                    await recoveryCase.update({
                        failure_message: failureMessage,
                        failure_code: failureCode,
                        network_decline_code: networkDeclineCode,
                        decline_code: declineCode,
                        payment_method_type: paymentMethodType,
                        stripe_payment_intent_id: paymentIntentId,
                    })
                }
            }
        }


        // todo: use in future
        // const score = getRecoveryUrgencyScore(recoveryCase)

        // replaced this decision with step and getnextrecoverystep()
        // const decision = await shouldSendNextEmail(recoveryCase)

        let completedSuccessfully = false
        let emailSucceeded = false
        let retrySucceeded = false
        const step = await getNextRecoveryStep(recoveryCase)

        if (recoveryCase.stripe_next_payment_at) {
            const stripeRetry = new Date(recoveryCase.stripe_next_payment_at)
            const SIXTY_MINUTES = 60 * 60 * 1000
            const retryBufferHours = STRIPE_RETRY_BUFFER_HOURS * SIXTY_MINUTES

            if (stripeRetry.getTime() - Date.now() <= retryBufferHours && stripeRetry > new Date()) {
                console.log("Stripe retry imminent. Skipping RetryForge.")
                await recoveryCase.update({
                    next_action_at: new Date(Date.now() + retryBufferHours)
                })

                continue
            }
        }

        let retryAttemptSuccessful = false
        try {
            console.log('step: ' + JSON.stringify(step))
            if (step.complete) {
                console.log('continuing because complete is true')
                await recoveryCase.update({
                    next_action_at: null
                })
                continue
            }

            if (!step.isDue) {
                console.log('continuing because isDue is false')
                continue
            }

            // todo: use in future
            // const decision = getNextStep(score)

            // if (!decision.send) continue

            // if (!decision) continue

            // 1. stripe action decision
            // replaced action with step variable
            // const action = RECOVERY_ACTIONS[emailNumber]

            // console.log('action: ' + JSON.stringify(action))
            if (step.shouldRetry) {

                // if (action?.stripeRetry) {
                console.log('going to do an automatic retryforge retry')

                if (!recoveryCase.stripe_invoice_id) {
                    console.log("No inoice Id — skipping retry")
                    continue
                }

                const stripeAccount = await StripeAccount.findByPk(
                    recoveryCase.stripe_account_uuid
                )

                const result = await retryStripePayment({
                    stripeAccountId: stripeAccount.stripe_account_id,
                    invoiceId: recoveryCase.stripe_invoice_id
                })

                retrySucceeded = true

                await recoveryCase.increment({
                    retry_count: 1,
                    attempt_count: 1,
                    recovery_attempt_count: 1
                })

                if (result.success) {
                    retryAttemptSuccessful = true
                }


                await RecoveryCommunications.create({
                    id: uuid(),
                    recovery_case_uuid: recoveryCase.id,
                    type: 'stripe_retry',
                    step: step.step,
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

            // 2. decide if should email
            if (step.shouldEmail && !retryAttemptSuccessful) {
                const customer = await StripeAccountCustomers.findOne({
                    where: {
                        stripe_customer_id: recoveryCase.stripe_customer_id,
                        stripe_account_uuid: recoveryCase.stripe_account_uuid
                    }
                })

                if (!customer?.email) {
                    console.log(`Recovery ${recoveryCase.id} skipped because customer has no email`)
                    continue
                }

                // const emailNumber = decision.step
                // const emailNumber = decision.nextStep
                const emailNumber = step.emailNumber

                console.log('email number: ' + emailNumber)


                //1. send email
                const result = await sendRecoveryEmail({
                    to: customer.email,
                    hostedInvoiceUrl: recoveryCase.hosted_invoice_url,
                    amountDue: recoveryCase.amount_due / 100,
                    emailNumber
                })
                // console.log("Resend result:", result)

                emailSucceeded = true

                await recoveryCase.increment(
                    'recovery_email_sent_count'
                )

                await recoveryCase.update({
                    last_recovery_email_sent_at: new Date(),
                    last_notified_at: new Date()
                })

                if (1 === emailNumber) {
                    await recoveryCase.update({
                        first_notified_at: new Date(),
                    })
                }

                await RecoveryCommunications.create({
                    id: uuid(),
                    recovery_case_uuid: recoveryCase.id,
                    type: 'email',
                    step: emailNumber,
                    status: 'sent',
                    recipient: customer.email,
                    provider_id: result?.id ?? null,
                    sent_at: new Date()
                })

                // update case summary after email sent
                await recoveryCase.update({
                    last_email_step: emailNumber,
                    last_contacted_at: new Date()
                })
            }

            completedSuccessfully = true

        } catch (err) {
            console.log('retry successful: ' + retrySucceeded + ' :::: email successful: ' + emailSucceeded)
            console.error("failure:", err)
            throw err
        }

        console.log('retry successful: ' + retrySucceeded + ' :::: email successful: ' + emailSucceeded)

        if (completedSuccessfully) {
            await recoveryCase.update({
                next_action_at: calculateNextAction(recoveryCase, step.step),
                workflow_step: step.step
            })
        }
    }
}

// function calculateNextAction(recoveryCase, currentStep) {
//     const nextStep = currentStep + 1
//     if (!RECOVERY_PLAN[nextStep]) {
//         return null
//     }
//     let stripeNextPaymentAt = recoveryCase?.stripe_next_payment_at

//     if (stripeNextPaymentAt) {
//         stripeNextPaymentAt = new Date(stripeNextPaymentAt)
//     } else {
//         stripeNextPaymentAt = new Date()
//     }

//     // let nextAction = new Date()
//     // nextAction.setHours(nextAction.getHours() + RECOVERY_PLAN[nextStep].delayHours)

//     const earliestRetry = new Date(Date.now() + RECOVERY_PLAN[nextStep].delayHours * 3600000)

//     return stripeNextPaymentAt > earliestRetry
//         ? stripeNextPaymentAt
//         : earliestRetry

//     // return nextActionAt
// }

function calculateNextAction(recoveryCase, currentStep) {
    const nextStep = currentStep + 1

    // workflow finished
    if (!RECOVERY_PLAN[nextStep]) {
        return null
    }

    const nextAction = new Date()
    nextAction.setHours(
        nextAction.getHours() + RECOVERY_PLAN[nextStep].delayHours
    )

    return nextAction
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

// function getNextStep(score) {
//     if (score < 5) return { send: false }
//     if (score < 10) return { send: true, step: 1 }
//     if (score < 15) return { send: true, step: 2 }
//     if (score < 25) return { send: true, step: 3 }
//     return { send: true, step: 4 }
// }


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

// removed in favor of getNextRecoveryStep()
// async function shouldSendNextEmail(recoveryCase) {
//     const lastEmail = await RecoveryCommunications.findOne({
//         where: {
//             recovery_case_uuid: recoveryCase.id,
//             type: 'email',
//             status: 'sent'
//         },
//         order: [['step', 'DESC'], ['sent_at', 'DESC']]
//     })

//     // No emails sent yet → send step 1
//     if (!lastEmail) return { shouldSend: true, nextStep: 1 }

//     const nextStep = lastEmail.step + 1

//     console.log('in shouldsendNext, nextStep: ' + nextStep)

//     // stop condition
//     if (nextStep > 4) {
//         console.log('nextStep greater than 4')
//         return { shouldSend: false }
//     }

//     const hours = hoursSince(lastEmail.sent_at)
//     const requiredDelay = CADENCE_HOURS[nextStep]

//     if (hours >= requiredDelay) {
//         return { shouldSend: true, nextStep }
//     }

//     return { shouldSend: false }


// }
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


// async function getNextRecoveryStep(recoveryCase) {

//     if (recoveryCase.next_action_at > new Date()) {
//         return {
//             isDue: false
//         }
//     }

//     const lastEmail = await RecoveryCommunications.findOne({
//         where: {
//             recovery_case_uuid: recoveryCase.id,
//             type: 'email',
//             status: 'sent'
//         },
//         order: [['step', 'DESC']]
//     })

//     // no emails sent before
//     if (!lastEmail) {
//         return {
//             isDue: true,
//             step: 1,
//             ...RECOVERY_PLAN[1]
//         }
//     }

//     const nextStep = Number(lastEmail.step) + 1

//     console.log('nextStep: ' + nextStep)

//     // workflow done
//     if (!RECOVERY_PLAN[nextStep]) {
//         return {
//             complete: true
//         }
//     }

//     // const hoursElapsed = hoursSince(lastEmail.sent_at)

//     // if (hoursElapsed < RECOVERY_PLAN[nextStep].delayHours) {
//     //     return {
//     //         isDue: false,
//     //         complete: false,
//     //         step: nextStep,
//     //         hoursRemaining: RECOVERY_PLAN[nextStep].delayHours - hoursElapsed
//     //     }
//     // }

//     return {
//         isDue: true,
//         step: nextStep,
//         ...RECOVERY_PLAN[nextStep]
//     }
// }

async function getNextRecoveryStep(recoveryCase) {

    // no emails sent yet
    const currentStep = recoveryCase.workflow_step ?? 0

    const nextStep = Number(currentStep) + 1

    console.log('nextStep: ' + nextStep)
    const plan = RECOVERY_PLAN[nextStep]

    // workflow complete
    if (!plan) {
        return {
            isDue: false,
            complete: true
        }
    }

    return {
        isDue: true,
        complete: false,
        step: nextStep,
        ...plan
    }

}
