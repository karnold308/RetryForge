const { v4: uuid } = await import('uuid')
import Stripe from 'stripe'
import { StripeAccountCustomers, StripeCustomerSnapshots, User } from '../models/index.js'
import { logError } from '../services/loggerService.js'

export const resolveCustomerFromInvoice = async ({
    invoice,
    stripeAccount,
    lastPaymentFailedAt,
    eventId,
    eventTime,
    createSnapshot
}) => {
    // get customer info from event
    let custEmail = invoice.customer_email ?? null
    let custName = invoice?.customer_name ?? null
    let custPhone = invoice?.customer_phone ?? null
    let customer = null

    try {

        const user = await User.findOne({
            where: { id: stripeAccount.user_id }
        })

        if (!user) {
            return
        }

        if (!custEmail) {
            let connectedStripe

            // check for tester account
            if (user.roles.includes(5555)) {
                connectedStripe = new Stripe(
                    process.env.STRIPE_SECRET_KEY_TEST, { stripeAccount: stripeAccount.stripe_account_id })
            } else {
                connectedStripe = new Stripe(
                    process.env.STRIPE_SECRET_KEY, { stripeAccount: stripeAccount.stripe_account_id })
            }
            customer = await connectedStripe.customers.retrieve(invoice.customer)
            if (!customer.deleted) {
                custEmail = customer.email
                custName = customer.name
                custPhone = customer.phone
            }
        }

        const [stripeCustomer, created] = await StripeAccountCustomers.findOrCreate({
            where: {
                stripe_customer_id: invoice.customer,
                stripe_account_uuid: stripeAccount.id
            },
            defaults: {
                id: uuid(),
                stripe_customer_id: invoice.customer,
                email: custEmail,
                name: custName ?? null,
                phone: custPhone ?? null,
                user_id: stripeAccount.user_id ?? null,
                stripe_account_uuid: stripeAccount.id,
                last_payment_failed_at: lastPaymentFailedAt ?? null,
                last_invoice_id: invoice.id,
                metadata: customer?.metadata ?? null,
                created_at: new Date(),
                updated_at: new Date()

            }
        })

        if (!created) {
            await stripeCustomer.update({
                email: custEmail,
                name: custName,
                phone: custPhone,
                last_payment_failed_at: lastPaymentFailedAt,
                last_invoice_id: invoice.id
            })
        }

        if (createSnapshot) {


            let customerAction
            if (created) {
                customerAction = 'customer.created'
            } else {
                customerAction = 'customer.updated'
            }

            await StripeCustomerSnapshots.create({
                id: uuid(),
                stripe_account_uuid: stripeAccount.id,
                stripe_customer_id: invoice.customer,
                email: custEmail,
                name: custName,
                phone: custPhone,
                metadata: customer?.metadata ?? null,
                source_event_id: eventId ?? null,
                event_type: customerAction,
                created_at: eventTime
            })
        }

        return stripeCustomer

    } catch (err) {
        await logError({
            source: "customerSyncService.resolveCustomerFromInvoice",
            message: "Issue resolving customer ",
            error: err,
            stripeAccountUuid: stripeAccount?.id ?? null,
            metaData: { customerEmail: custEmail, eventId: eventId }
        })

        return null

    }
}


export const CustomerSyncService = {
    resolveCustomerFromInvoice
}