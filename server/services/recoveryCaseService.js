const { v4: uuid } = await import('uuid')
import { RecoveryCases } from '../models/index.js'
import { logError } from '../services/loggerService.js'

// todo: add invoice parameters instead of entire invoice
const upsertFromInvoice = async ({
    stripeAccount,
    stripeAccountUuid,
    customerRecordId,
    failureCode,
    failureMessage,
    invoice,
    eventTime,
    sourceEventId,
    nextActionAt,
    invoiceCreatedAt,
    historyImportedAt
}) => {

    const subscriptionId =
        invoice?.lines?.data?.[0]?.parent?.subscription_item_details?.subscription ||
        invoice?.subscription ||
        null

    
    try {


        const [recoveryCase, created] = await RecoveryCases.findOrCreate({
            where: {
                stripe_invoice_id: invoice.id
            },
            defaults: {
                id: uuid(),
                user_id: stripeAccount.user_id,
                stripe_account_uuid: stripeAccountUuid,
                stripe_customer_id: invoice.customer,
                stripe_customer_uuid: customerRecordId,
                stripe_subscription_id: subscriptionId,
                stripe_invoice_id: invoice.id,
                amount_due: invoice.amount_due,
                currency: invoice.currency,
                stripe_payment_intent_id: invoice.payment_intent,
                attempt_count: invoice.attempt_count,
                stripe_next_payment_at: invoice?.next_payment_attempt ? new Date(invoice?.next_payment_attempt * 1000) : null,
                failure_code: failureCode,
                failure_message: failureMessage,
                source_event_id: sourceEventId,
                next_action_at: nextActionAt,
                status: 'active',
                last_failed_event_at: eventTime,
                last_payment_attempt_at: eventTime,
                invoice_created_at: invoiceCreatedAt,
                recovery_attempt_count: 0,
                hosted_invoice_url: invoice.hosted_invoice_url,
                history_imported_at: historyImportedAt
            }
        })
        console.log('recoveryCaseService recoveryId: ' + recoveryCase?.id)

        if (!created) {
            // coming from webhook if historyImportedAt = null
            if (null === historyImportedAt) {
                await recoveryCase.update({
                    amount_due: invoice.amount_due,
                    hosted_invoice_url: invoice.hosted_invoice_url,
                    last_event_created_at: eventTime,
                    last_failed_event_at: eventTime,
                    last_payment_attempt_at: eventTime,
                    stripe_subscription_id: subscriptionId,
                    source_event_id: sourceEventId,
                    failure_code: failureCode,
                    failure_message: failureMessage,
                    currency: invoice.currency,
                    next_action_at: invoice?.next_payment_attempt ? new Date(invoice?.next_payment_attempt * 1000) : null,
                    stripe_next_payment_at: invoice?.next_payment_attempt ? new Date(invoice?.next_payment_attempt * 1000) : null,
                    updated_at: new Date()
                })
            } else {
                // coming from history sync
                await recoveryCase.update({
                    amount_due: invoice.amount_due,
                    hosted_invoice_url: invoice.hosted_invoice_url,
                    last_event_created_at: eventTime,
                    stripe_subscription_id: subscriptionId,
                    failure_code: failureCode,
                    failure_message: failureMessage,
                    currency: invoice.currency,
                    history_imported_at: historyImportedAt,
                    stripe_next_payment_at: invoice?.next_payment_attempt ? new Date(invoice?.next_payment_attempt * 1000) : null,
                    updated_at: new Date()
                })
            }
        }

        return { recoveryCase, created }

    } catch (err) {
        await logError({
            source: "recoveryCaseService.upsertFromInvoice()",
            message: "Error creating/updating recovery case",
            error: err,
            metadata: { stripeAccountId: stripeAccount?.id ?? null, invoiceId: invoice?.id,
                historyImportedAt: historyImportedAt, sourceEventId: sourceEventId
             }
        })

        return null
    }
}



export const RecoveryCaseService = {
    upsertFromInvoice
}