const { v4: uuid } = await import('uuid')
import { StripeAccountCustomers, StripeCustomerSnapshots } from '../models/index.js'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
import Stripe from 'stripe'

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

    if (!custEmail) {
        const connectedStripe = new Stripe(
            process.env.STRIPE_SECRET_KEY, { stripeAccount: stripeAccount.stripe_account_id })
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

}


export const CustomerSyncService = {
    resolveCustomerFromInvoice
}