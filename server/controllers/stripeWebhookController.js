import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
import { User, StripeAccount, RecoveryCases, WebhookEvents, StripeAccountCustomers } from '../models/index.js'
const { v4: uuid } = await import('uuid')


const clientId = process.env.STRIPE_CLIENT_ID
const frontEndUrl = process.env.NODE_ENV === 'production' ?
    process.env.retryforge_DATABASE_URL : process.env.FRONT_END_URL


const trackedEvents = [
    'invoice.payment_failed',
    'payment_intent.payment_failed',
    'invoice.paid',
    'charge.failed'
]



const handleStripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"]
    let processingSucceeded = false

    let event
    let webhookEvent = null


    const handleInvoicePaymentFailed = async (event) => {
        console.log("event invoice.paymentfailed")
        if (!event.account) {
            console.log("Skipping non-connect event")
            return res.json({ received: true })
        }
        const invoice = event.data.object

        const stripeAccount = await StripeAccount.findOne({
            where: {
                stripe_account_id: event.account
            }
        })

        if (!stripeAccount) {
            console.error(
                `No StripeAccount found for ${event.account}`
            )

            return res.json({ received: true })
        }

        // get customer info from event
        let custEmail = invoice.customer_email || null
        let custName = null
        let custPhone = null

        // const connectedStripe = new Stripe(
        //     process.env.STRIPE_SECRET_KEY,
        //     { stripeAccount: stripeAccount.stripe_account_id }
        // )

        // if (null === custEmail) {
        //     const customer = await connectedStripe.customers.retrieve(invoice.customer)
        //     custEmail = customer.email
        //     custName = customer?.name || null
        //     custPhone = customer?.phone || null
        // }

        const [customer, customerCreated] =
            await StripeAccountCustomers.findOrCreate({
                where: {
                    stripe_customer_id: invoice.customer,
                    stripe_account_uuid: stripeAccount.id
                },
                defaults: {
                    id: uuid(),
                    user_id: stripeAccount.user_id
                }
            })

        await customer.update({
            email: custEmail,
            name: custName,
            phone: custPhone,
            last_payment_failed_at: new Date(event.created * 1000),
            last_invoice_id: invoice.id
        })

        const recoveryCaseId = uuid()

        // update webhook_events with internal stripe account uuid, and other info
        await webhookEvent.update({
            stripe_account_uuid: stripeAccount.id,
            stripe_invoice_id: invoice.id,
            related_recovery_case_id: recoveryCaseId,
            stripe_customer_id: invoice.customer,
        })

        const failureFromCharge = await WebhookEvents.findOne({
            where: {
                event_type: 'charge.failed',
                stripe_customer_id: invoice.customer,
                stripe_account_uuid: stripeAccount.id
            },
            order: [
                ['processed_at', 'DESC']
            ]
        })

        const [recoveryCase, created] = await RecoveryCases.findOrCreate({
            where: {
                stripe_invoice_id: invoice.id
            },
            defaults: {
                id: recoveryCaseId,
                user_id: stripeAccount.user_id,
                stripe_account_uuid: stripeAccount.id,
                stripe_customer_id: invoice.customer,
                stripe_subscription_id: invoice.subscription,
                stripe_invoice_id: invoice.id,
                amount_due: invoice.amount_due,
                currency: invoice.currency,
                attempt_count: invoice.attempt_count,
                failure_code: failureFromCharge?.failure_code ?? null,
                failure_message: failureFromCharge?.failure_message ?? null,
                source_event_id: event.id,
                status: 'active',
                last_failed_event_at: new Date(event.created * 1000),
                invoice_created_at: new Date(invoice.created * 1000),
                last_charge_attempt_at: failureFromCharge?.charge_created_at ?? null,
                recovery_attempt_count: 0,
                hosted_invoice_url: invoice.hosted_invoice_url,
            }
        })



        if (created) {
            console.log(
                `Created recovery case for invoice ${invoice.id}`
            )
        } else {
            console.log(
                `Updated recovery case for invoice ${invoice.id}`
            )
            await recoveryCase.update({
                attempt_count: invoice.attempt_count,
                amount_due: invoice.amount_due,
                hosted_invoice_url: invoice.hosted_invoice_url
            })
        }
    }

    const handlePaymentIntentPaymentFailed = async (event) => {
        console.log("event paymentintent.paymentfailed")
        const paymentIntent = event.data.object

        // get stripe account Id from stripe someway somehow
        const stripeAccountId =
            event.account ||
            paymentIntent.on_behalf_of ||
            paymentIntent.metadata?.stripe_account_id ||
            null

        // use that stripe account id to get internal stripe account
        const stripeAccount = await StripeAccount.findOne({
            where: {
                stripe_account_id: stripeAccountId
            }
        })

        // use internal stripe account to set webhook_events stripe account uuid
        if (stripeAccount) {
            await webhookEvent.update({
                stripe_account_uuid: stripeAccount.id,
                stripe_customer_id: paymentIntent.customer
            })
        } else {
            // else use the id from stripe so there's at least something in the field
            await webhookEvent.update({
                stripe_account_uuid: stripeAccountId,
                stripe_customer_id: paymentIntent.customer
            })
        }

        // get customer info from event
        let custEmail = paymentIntent.receipt_email || null
        let custName = null
        let custPhone = null

        // const connectedStripe = new Stripe(
        //     process.env.STRIPE_SECRET_KEY,
        //     { stripeAccount: stripeAccount.stripe_account_id }
        // )

        // if (null === custEmail) {
        //     const customer = await connectedStripe.customers.retrieve(paymentIntent.customer)
        //     custEmail = customer.email
        //     custName = customer?.name
        //     custPhone = customer?.phone || null
        // }


        const [customer, customerCreated] =
            await StripeAccountCustomers.findOrCreate({
                where: {
                    stripe_customer_id: paymentIntent.customer,
                    stripe_account_uuid: stripeAccount.id
                },
                defaults: {
                    id: uuid(),
                    user_id: stripeAccount.user_id
                }
            })

        await customer.update({
            email: custEmail,
            name: custName,
            phone: custPhone,
            last_payment_failed_at: new Date(event.created * 1000),
            last_invoice_id: paymentIntent.id
        })


        const invoiceId =
            event.data.object.invoice ||
            event.data.object.invoice_id

        if (!invoiceId) {
            console.log("Charge not linked to invoice, skipping recovery case from payment_intent.payment_failed.")
            return
        }

        await RecoveryCases.update(
            {
                failure_code:
                    paymentIntent.last_payment_error?.decline_code ??
                    paymentIntent.last_payment_error?.code,

                failure_message:
                    paymentIntent.last_payment_error?.message
            },
            {
                where: {
                    stripe_invoice_id: invoiceId
                }
            }
        )
    }

    const handleChargeFailed = async (event) => {
        console.log("event charge.failed")
        const charge = event.data.object

        
        if (!event.account) {
            console.log("Skipping non-connect event")
            return res.json({ received: true })
        }

        const stripeAccount = await StripeAccount.findOne({
            where: { stripe_account_id: event.account }
        })

        if (!stripeAccount) return res.json({ received: true })

        await webhookEvent.update({
            stripe_account_uuid: stripeAccount.id,
            failure_code: charge.failure_code ?? null,
            failure_message: charge.failure_message ?? null,
            charge_created_at: new Date(charge.created * 1000),
            stripe_customer_id: charge.customer
        })

        const invoiceId =
            event.data.object.invoice ||
            event.data.object.invoice_id

        if (!invoiceId) {
            console.log("Charge not linked to invoice, skipping recovery case from charge.failed.")
            return
        }

        await RecoveryCases.update(
            {
                failure_code: charge.failure_code,
                failure_message: charge.failure_message,
                last_payment_attempt_at: new Date(event.created * 1000)
            },
            {
                where: { stripe_invoice_id: invoiceId }
            }
        )
    }

    const handleInvoicePaid = async (event) => {
        console.log("✅ event Invoice paid successfully")

        const invoice = event.data.object

        await RecoveryCases.update(
            {
                status: 'recovered',
                recovered_at: new Date(invoice.status_transitions.paid_at * 1000)
            },
            {
                where: {
                    stripe_invoice_id: invoice.id,
                    status: 'active'
                }
            }
        )
    }



    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        )


    } catch (err) {
        console.error("❌ Webhook signature verification failed:", err.message)
        return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    console.log("📩 Stripe event received:", event.type)

    if (trackedEvents.includes(event.type)) {

        const [eventRecord, created] =
            await WebhookEvents.findOrCreate({
                where: {
                    stripe_event_id: event.id
                },
                defaults: {
                    id: uuid(),
                    stripe_event_id: event.id,
                    event_type: event.type,
                    raw_payload: event
                }
            })

        webhookEvent = eventRecord

        if (!created && webhookEvent.processed) {

            console.log(
                `Skipping processed event ${event.id}`
            )

            return res.json({ received: true })
        }
    }

    try {
        switch (event.type) {
            case "invoice.payment_failed": {
                await handleInvoicePaymentFailed(event)
                break
            }

            case 'payment_intent.payment_failed': {
                await handlePaymentIntentPaymentFailed(event)
                break
            }
            case 'charge.failed': {
                await handleChargeFailed(event)
                break
            }

            case "invoice.paid": {
                await handleInvoicePaid(event)
                break
            }

            default:
                console.log(`Unhandled event type: ${event.type}`)
        }

        processingSucceeded = true

        return res.json({ received: true })


    } catch (err) {
        console.error("Webhook handler error:", err)
        if (webhookEvent) {
            await webhookEvent.update({
                processing_error: err.message
            })
        }

        throw err

        return res.status(500).json({ error: "Webhook handler failed" })
    } finally {
        if (processingSucceeded && webhookEvent) {
            await webhookEvent.update({
                processed: true,
                processed_at: new Date()
            })
        }
    }




}

export { handleStripeWebhook }
