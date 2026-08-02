const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
import { CustomerSyncService } from './customerSyncService.js'
import { RecoveryCaseService } from './recoveryCaseService.js'
import { StripeAccount, RecoveryCases } from '../models/index.js'
import Stripe from 'stripe'
import { logError } from '../services/loggerService.js'


export const importFailedInvoices = async ({ stripeAccount }) => {

    console.log('history syncs status: ' + stripeAccount.id)
    if (stripeAccount.history_sync_status === 'processing') {
        return
    }

    await stripeAccount.update({
        history_sync_status: 'processing',
        history_sync_started_at: new Date(),
        history_sync_error: null
    })
    let hasMore = true
    let lastId = null
    const stripeAccountId = stripeAccount.stripe_account_id

    let imported = 0
    let skipped = 0

    try {
        while (hasMore) {
            let invoiceList = await getInvoicesPage(stripeAccountId, { startingAfter: lastId })

            for (const invoice of invoiceList.data) {
                // console.log({
                //     invoice: invoice.id,
                //     status: invoice.status,
                //     attempts: invoice.attempt_count,
                //     customer: invoice.customer,
                //     date: new Date(invoice.created * 1000)
                // })

                const existingCase = await RecoveryCases.findOne({
                    where: {
                        stripe_invoice_id: invoice.id
                    }
                })


                // create new recovery case

                if (shouldImportInvoice(invoice)) {
                    const nextActionAt = calculateInitialRecoveryDate(invoice)

                    if (!nextActionAt) {
                        skipped++
                        continue
                    }

                    if (existingCase) {
                        // update existing record
                        if ('paused' === existingCase.status) {
                            await existingCase.update({
                                status: 'active',
                                updated_at: new Date()
                            })
                        }
                        continue
                    }

                    imported++

                    // console.log('importing: ' + invoice.id)
                    const customer = await CustomerSyncService.resolveCustomerFromInvoice({
                        invoice,
                        stripeAccount,
                        lastPaymentFailedAt: new Date(invoice.created * 1000),
                        eventId: null,
                        eventTime: new Date(invoice.created * 1000),
                        createSnapshot: false
                    })

                    if (!customer) {
                        return
                    }

                    await RecoveryCaseService.upsertFromInvoice({
                        stripeAccount,
                        stripeAccountUuid: stripeAccount.id,
                        customerRecordId: customer.id,
                        failureCode: null,
                        failureMessage: null,
                        invoice,
                        eventTime: new Date(invoice.created * 1000),
                        sourceEventId: null,
                        nextActionAt: nextActionAt,
                        invoiceCreatedAt: new Date(invoice.created * 1000),
                        historyImportedAt: new Date()
                    })
                } else {
                    skipped++
                }

            }

            if (!invoiceList.hasMore) {
                hasMore = false
            } else {
                lastId = invoiceList.lastId
            }
        }

        await stripeAccount.update({
            history_sync_status: 'complete',
            initial_sync_complete: true,
            history_sync_completed_at: new Date()
        })

        return {
            imported,
            skipped
        }

    } catch (err) {
        await logError({
            source: "historySyncService.importFailedInvoices()",
            message: 'History sync failed',
            stripeAccountUuid: stripeAccount?.id ?? null,
            error: err,
            metadata: {}
        })

        await stripeAccount.update({
            history_sync_status: 'failed',
            history_sync_error: err.message,
            history_sync_completed_at: new Date()
        })

        throw err
    }
}

function calculateInitialRecoveryDate(invoice) {
    const failedAt = new Date(invoice.created * 1000)

    const ageDays = (Date.now() - failedAt.getTime()) / (1000 * 60 * 60 * 24)

    if (ageDays <= 1) {
        return new Date(Date.now() + 5 * 60 * 1000)
    }

    if (ageDays <= 7) {
        return new Date()
    }

    return null
}

// stripe invoice pagination, using limit and startingAfter using id of last item
async function getInvoicesPage(connectedAccountId, { limit = 100, startingAfter = null, status = 'open' } = {}) {
    try {
        const params = { limit, status }

        if (startingAfter) {
            params.starting_after = startingAfter;
        }

        const response = await stripe.invoices.list(
            params,
            { stripeAccount: connectedAccountId }
        )

        return {
            data: response.data,
            hasMore: response.has_more,
            lastId: response.data.length > 0 ? response.data[response.data.length - 1].id : null
        }

    } catch (err) {
        await logError({
            source: "historySyncService.getInvoicesPage()",
            message: 'Error fetching paginated invoices',
            stripeAccountUuid: connectedAccountId ?? null,
            error: err,
            metadata: {}
        })
        
        throw err
    }
}

function shouldImportInvoice(invoice) {
    return (
        invoice.amount_due > 0 &&
        invoice.attempt_count > 0 &&
        ['open', 'past_due'].includes(invoice.status)
    )
}


export const HistorySyncService = {
    importFailedInvoices
}