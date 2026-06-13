import {
    StripeAccountCustomers, StripeAccount,
    RecoveryCases, WebhookEvents,
    StripeCustomerSnapshots, RecoveryCommunications,
    RecoveryStrategyStats
}
    from "../models/index.js"
import Stripe from 'stripe'
import { Op } from 'sequelize'
const { v4: uuid } = await import('uuid')


const createCtx = (webhookEvent) => ({
    webhookEvent,

    safeUpdateWebhook: async (data) => {
        if (!webhookEvent) return null

        return webhookEvent.update({
            ...data,
            updated_at: new Date()
        })
    }
})


const ensureStripeCustomer = async (stripeCustomerId, stripeAccountId = null, userId = null) => {
    if (!stripeCustomerId) return null

    const [customer] = await StripeAccountCustomers.findOrCreate({
        where: {
            stripe_customer_id: stripeCustomerId
        },
        defaults: {
            id: uuid(),
            ...(stripeAccountId ? { stripe_account_uuid: stripeAccountId } : {}),
            ...(userId ? { user_id: userId } : {})
        }
    })


    // if we learn account later, backfill it
    if (!customer.stripe_account_uuid && stripeAccountId) {
        await customer.update({
            stripe_account_uuid: stripeAccountId
        })
    }

    return customer
}


const resolveStripeContext = async (event, customerId, ctx) => {
    const externalAccountId =
        event.account ||
        event.data.object?.on_behalf_of ||
        event.data.object?.metadata?.stripe_account_id ||
        null

    let stripeAccount = null

    if (externalAccountId) {
        stripeAccount = await StripeAccount.findOne({
            where: {
                [Op.or]: [
                    { stripe_account_id: externalAccountId }
                ]
            }
        })

    }


    const customerRecord = customerId
        ? await ensureStripeCustomer(
            customerId,
            stripeAccount?.id,
            stripeAccount?.user_id
        )
        : null

    const stripeAccountUuid =
        stripeAccount?.id ||
        customerRecord?.stripe_account_uuid ||
        null

    if (!stripeAccount && stripeAccountUuid) {
        stripeAccount = await StripeAccount.findOne({
            where: {
                id: stripeAccountUuid
            }
        })
    }

    const userId = stripeAccount?.user_id ?? null

    await ctx.safeUpdateWebhook({
        stripe_account_uuid: stripeAccountUuid,
        stripe_customer_id: customerId ?? null
    })

    return {
        stripeAccountUuid,
        stripeAccount,
        customerRecord,
        userId,
        // customerId,
        externalAccountId
    }
}

const isNewerEvent = (existingTime, newTime) => {
    return !existingTime || existingTime < newTime
}

const handlePaymentIntentPaymentFailed = async (event, ctx) => {
    console.log("event paymentintent paymentfailed")
    const paymentIntent = event.data.object
    const eventTime = new Date(event.created * 1000)

    const { stripeAccount } = await resolveStripeContext(event, paymentIntent.customer, ctx)

    const invoiceId = paymentIntent.invoice ||
        paymentIntent.latest_charge?.invoice ||
        paymentIntent.metadata?.invoice_id ||
        null

    if (!invoiceId) {
        console.log({
            event: event.type,
            step: "invoice not on payment intent",
            status: "payment intent not linked to invoice",
            customer: paymentIntent.customer
        })

        return

    }
    await ctx.safeUpdateWebhook({
        stripe_invoice_id: invoiceId,
    })



    if (!stripeAccount) {
        console.log({
            event: event.type,
            step: "stripe account lookup",
            status: "internal stripe account not found",
            customer: paymentIntent.customer
        })

        // update webhook_events with data we have from event before exiting
        await ctx.safeUpdateWebhook({
            stripe_customer_id: paymentIntent?.customer ?? null,
        })

        return
    }

    await RecoveryCases.update(
        {
            failure_code:
                paymentIntent.last_payment_error?.decline_code ??
                paymentIntent.last_payment_error?.code,
            failure_message: paymentIntent.last_payment_error?.message,
            last_event_created_at: eventTime,
            last_payment_attempt_at: new Date(event.created * 1000),
            stripe_payment_intent_id: paymentIntent.id
        },
        {
            where: {
                stripe_invoice_id: invoiceId,
                [Op.or]: [
                    { last_event_created_at: null },
                    { last_event_created_at: { [Op.lt]: eventTime } }
                ]
            }
        }
    )
}

const handleChargeFailed = async (event, ctx) => {
    console.log("event charge failed")
    const charge = event.data.object
    const eventTime = new Date(event.created * 1000)

    const {
        stripeAccount,
        stripeAccountUuid
    } = await resolveStripeContext(event, charge.customer, ctx)


    const invoiceId =
        charge.invoice ||
        charge.metadata?.invoice_id ||
        charge.payment_intent?.invoice ||
        null



    const customerRecord = await ensureStripeCustomer(charge.customer,
        stripeAccount?.id,
        stripeAccount?.user_id)

    await customerRecord.update({
        stripe_account_uuid: stripeAccountUuid,
        last_failure_code: charge.failure_code,
        last_failure_message: charge.failure_message,
        last_payment_failed_at: new Date(charge.created * 1000)
    })



    if (!stripeAccount) {
        console.log({
            event: event.type,
            step: 'account lookup',
            reason: "no stripe account found at all",
            customer: charge?.customer
        })

        // update webhook_events with data that is known from the event before exiting
        await ctx.safeUpdateWebhook({
            stripe_invoice_id: invoiceId,
            failure_code: charge.failure_code ?? null,
            failure_message: charge.failure_message ?? null,
            charge_created_at: new Date(charge.created * 1000),
            stripe_customer_id: charge?.customer ?? null,
        })

        return
    }

    if (!invoiceId) {
        console.log({
            event: event.type,
            step: 'charge.failed',
            reason: "charge not linked to invoice",
            customer: charge?.customer
        })

        await ctx.safeUpdateWebhook({
            stripe_invoice_id: invoiceId,
            failure_code: charge.failure_code ?? null,
            failure_message: charge.failure_message ?? null,
            charge_created_at: new Date(charge.created * 1000),
        })

        return
    }

    await ctx.safeUpdateWebhook({
        stripe_invoice_id: invoiceId,
        failure_code: charge.failure_code ?? null,
        failure_message: charge.failure_message ?? null,
        charge_created_at: new Date(charge.created * 1000),
    })

    await RecoveryCases.update(
        {
            failure_code: charge.failure_code,
            failure_message: charge.failure_message,
            last_event_created_at: eventTime,
            last_payment_attempt_at: new Date(event.created * 1000)
        },
        {
            where: {
                stripe_invoice_id: invoiceId,
                [Op.or]: [
                    { last_event_created_at: null },
                    { last_event_created_at: { [Op.lt]: eventTime } }
                ]
            }
        }
    )
}

const handleInvoicePaid = async (event, ctx) => {
    console.log("event Invoice paid successfully")
    const invoice = event.data.object
    const eventTime = new Date(event.created * 1000)

    const recoveryCase = await RecoveryCases.findOne({
        where: {
            stripe_invoice_id: invoice.id,
            status: 'active'
        }
    })

    const recentRetry = await RecoveryCommunications.findOne({
        where: {
            recovery_case_id: recoveryCase.id,
            type: 'stripe_retry',
            created_at: {
                [Op.gte]: new Date(Date.now() - 1000 * 60 * 60 * 24) // last 24h
            }
        },
        order: [['created_at', 'DESC']]
    })

    let source 


    // todo: use this eventually:
    // recovery_source: 'retryforge' | 'stripe_smart_retry' | 'manual' | 'unknown'

    if (recentRetry) {
        source = 'retryforge'
    } else {
        source = 'stripe_smart_retry'
    }

    await RecoveryCases.update(
        {
            status: 'recovered',
            recovered_at: invoice.status_transitions?.paid_at
                ? new Date(invoice.status_transitions.paid_at * 1000)
                : eventTime,
            amount_recovered: invoice.amount_paid,
            last_event_created_at: eventTime,
            recovery_source: source
        },
        {
            where: {
                stripe_invoice_id: invoice.id,
                status: 'active',
                [Op.or]: [
                    { last_event_created_at: null },
                    { last_event_created_at: { [Op.lt]: eventTime } }
                ]
            }
        }
    )

    const speed = (Date.now() - new Date(recoveryCase.created_at).getTime()) / (1000 * 60 * 60)

    await RecoveryStrategyStats.create({
        id: uuid(),
        recovery_case_uuid: recoveryCase.id,
        email_step_used: recoveryCase.recovery_email_sent_count,
        recovery_speed_hours: speed,
        amount: invoice.amount_paid
    })


    await ctx.safeUpdateWebhook({
        stripe_invoice_id: invoice.id,
        stripe_customer_id: invoice.customer,
    })
}


const handleInvoicePaymentFailed = async (event, ctx) => {
    console.log("event invoice payment failed")
    const eventTime = new Date(event.created * 1000)
    const invoice = event.data.object

    const {
        stripeAccount,
        stripeAccountUuid,
        userId,
        customerRecord
    } = await resolveStripeContext(event, invoice.customer, ctx)

    if (!stripeAccount) {
        console.log({
            event: event.type,
            step: "account lookup",
            status: "no account found",
            customer: invoice.customer
        })

        // update webhook_events with data we have from event before exiting
        await ctx.safeUpdateWebhook({
            stripe_invoice_id: invoice.id,
            stripe_customer_id: invoice.customer,
        })

        return
    }

    // get customer info from event
    let custEmail = invoice.customer_email || null
    let custName = null
    let custPhone = null

    if (!custEmail) {
        const connectedStripe = new Stripe(
            process.env.STRIPE_SECRET_KEY, { stripeAccount: stripeAccount.stripe_account_id })
        const customer = await connectedStripe.customers.retrieve(invoice.customer)
        if (!customer.deleted) {
            custEmail = customer.email
            custName = customer.name
            custPhone = customer.phone
        }
    }

    if (customerRecord) {
        await customerRecord.update({
            email: custEmail,
            name: custName,
            phone: custPhone,
            last_payment_failed_at: new Date(event.created * 1000),
            last_invoice_id: invoice.id
        })
    }


    // not sure what is the issue with this. and then using it later in findorcreate()
    const recoveryCaseId = uuid()

    // update webhook_events with internal stripe account uuid, and other info
    await ctx.safeUpdateWebhook({
        stripe_account_uuid: stripeAccountUuid,
        stripe_invoice_id: invoice.id,
        related_recovery_case_id: recoveryCaseId,
        stripe_customer_id: invoice.customer,
    })


    // get failure_code and failure_message from webhook_events
    // const failureFromCharge = await WebhookEvents.findOne({
    //     where: {
    //         event_type: 'charge.failed',
    //     },
    //     order: [
    //         ['charge_created_at', 'DESC']
    //     ]
    // })

    const subscriptionId =
        invoice.subscription ||
        invoice.lines?.data?.[0]?.subscription ||
        null

    const [recoveryCase, created] = await RecoveryCases.findOrCreate({
        where: {
            stripe_invoice_id: invoice.id
        },
        defaults: {
            id: recoveryCaseId,
            user_id: stripeAccount.user_id,
            stripe_account_uuid: stripeAccountUuid,
            stripe_customer_id: invoice.customer,
            stripe_subscription_id: subscriptionId,
            stripe_invoice_id: invoice.id,
            amount_due: invoice.amount_due,
            currency: invoice.currency,
            stripe_payment_intent_id: invoice.payment_intent,
            attempt_count: invoice.attempt_count,
            failure_code: customerRecord?.last_failure_code ?? null,
            failure_message: customerRecord?.last_failure_code ?? null,
            source_event_id: event.id,
            status: 'active',
            last_failed_event_at: eventTime,
            last_payment_attempt_at: eventTime,
            invoice_created_at: new Date(invoice.created * 1000),
            recovery_attempt_count: 0,
            hosted_invoice_url: invoice.hosted_invoice_url,
        }
    })

    if (created) {
        console.log(`Created recovery case for invoice ${invoice.id}`)
    } else {
        console.log(`Updated recovery case for invoice ${invoice.id}`)
        await recoveryCase.update({
            attempt_count: invoice.attempt_count,
            amount_due: invoice.amount_due,
            hosted_invoice_url: invoice.hosted_invoice_url,
            last_event_created_at: eventTime,
            last_failed_event_at: eventTime,
            last_payment_attempt_at: eventTime,
            stripe_subscription_id: subscriptionId,
            currency: invoice.currency
        })

        await ctx.safeUpdateWebhook({
            related_recovery_case_id: recoveryCase.id,
            stripe_invoice_id: invoice.id,
        })
    }
}

const handleSubscriptionCreated = async (event, ctx) => {
    const subscription = event.data.object


    const {
        customerRecord,
        externalAccountId
    } = await resolveStripeContext(event, subscription.customer, ctx)

    if (!customerRecord || !externalAccountId) return

    if (!customerRecord.stripe_account_uuid) {
        const account = await StripeAccount.findOne({
            where: { stripe_account_id: externalAccountId }
        })

        if (account) {
            await customerRecord.update({
                stripe_account_uuid: account.id
            })
        }
    }
}


const handleInvoiceCreated = async (event, ctx) => {
    const invoice = event.data.object
    const customerId = invoice.customer

    if (!customerId) return

    await resolveStripeContext(event, invoice.customer, ctx)

    await ctx.safeUpdateWebhook({
        stripe_invoice_id: invoice.id,
        invoice_stage: 'created',
    })
}

const handleInvoiceFinalized = async (event, ctx) => {
    const invoice = event.data.object

    const {
        stripeAccount,
        stripeAccountUuid,
        userId
    } = await resolveStripeContext(event, invoice.customer, ctx)

    const subscriptionId =
        invoice.subscription ||
        invoice.lines?.data?.[0]?.subscription ||
        null


    await ctx.safeUpdateWebhook({
        stripe_invoice_id: invoice.id,
        invoice_stage: 'finalized',
        stripe_customer_id: invoice.customer,
    })

    if (!stripeAccount) return

    await RecoveryCases.findOrCreate({
        where: { stripe_invoice_id: invoice.id },
        defaults: {
            id: uuid(),
            user_id: stripeAccount.user_id,
            stripe_account_uuid: stripeAccountUuid,
            stripe_customer_id: invoice.customer,
            stripe_subscription_id: subscriptionId,
            stripe_invoice_id: invoice.id,
            attempt_count: invoice.attempt_count,
            amount_due: invoice.amount_due,
            currency: invoice.currency,
            status: 'active',
            invoice_created_at: new Date(invoice.created * 1000),
            last_failed_event_at: null,
            last_payment_attempt_at: null
        }
    })
}

const hanldeCustomerUpdated = async (event, ctx) => {
    const customer = event.data.object
    const eventTime = new Date(event.created * 1000)

    const {
        stripeAccountUuid
    } = await resolveStripeContext(event, customer.id, ctx)

    const customerRecord = await ensureStripeCustomer(
        customer.id,
        stripeAccountUuid,
        null
    )

    if (!customerRecord) return

    await StripeCustomerSnapshots.create({
        id: uuid(),
        stripe_customer_id: customer.id,
        stripe_account_uuid: stripeAccountUuid,
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
        metadata: customer.metadata ?? null,
        source_event_id: event.id,
        event_type: 'customer.updated',
        created_at: new Date(event.created * 1000)
    })

    await ctx.safeUpdateWebhook({
        stripe_customer_id: customer.id,
        stripe_account_uuid: stripeAccountUuid,
    })
}

const handleCustomerCreated = async (event, ctx) => {
    const customer = event.data.object
    const eventTime = new Date(event.created * 1000)

    const {
        stripeAccount,
        stripeAccountUuid,
        userId
    } = await resolveStripeContext(event, customer.id, ctx)

    const customerRecord = await ensureStripeCustomer(
        customer.id,
        stripeAccountUuid,
        userId
    )

    if (!customerRecord) return

    await customerRecord.update({
        created_at_stripe: new Date(customer.created * 1000),
        email: customer.email,
        name: customer.name,
        phone: customer.phone
    })

    await StripeCustomerSnapshots.create({
        id: uuid(),
        stripe_customer_id: customer.id,
        stripe_account_uuid: stripeAccountUuid,
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
        metadata: customer.metadata ?? null,
        source_event_id: event.id,
        event_type: 'customer.created',
        created_at: new Date(event.created * 1000)
    })

    await ctx.safeUpdateWebhook({
        stripe_customer_id: customer.id,
        stripe_account_uuid: stripeAccountUuid,
    })
}

export const StripeWebhookService = {
    createCtx, handleInvoicePaymentFailed, handleChargeFailed,
    handleInvoicePaid, handlePaymentIntentPaymentFailed,
    handleSubscriptionCreated, handleInvoiceCreated,
    handleInvoiceFinalized, handleCustomerCreated,
    hanldeCustomerUpdated
}
