const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
import { CustomerSyncService } from './customerSyncService.js'
import { RecoveryCaseService } from './recoveryCaseService.js'
import { StripeAccount } from '../models/index.js'
import Stripe from 'stripe'


export const importFailedInvoices = async ({ stripeAccount }) => {

    console.log('history syncs status: ' + stripeAccount.id)
    if (stripeAccount.history_sync_status === 'processing') {
        return
    }

    console.log('starting importFailedInvoices')

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
                if (shouldImportInvoice(invoice)) {
                    const nextActionAt = calculateInitialRecoveryDate(invoice)

                    if (!nextActionAt) {
                        skipped++
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
        console.error("History sync failed:", err)
        await stripeAccount.update({
            history_sync_status: 'failed',
            history_sync_error: err.message,
            history_sync_completed_at: new Date()
        })

        throw err
    }
}

function calculateInitialRecoveryDate(invoice) {
    console.log('calc init rec date')
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

    } catch (error) {
        console.error('Error fetching paginated invoices:', error.message);
        throw error
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