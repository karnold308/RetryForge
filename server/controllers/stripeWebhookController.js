import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
import { WebhookEvents } from '../models/index.js'
const { v4: uuid } = await import('uuid')
import { StripeWebhookService } from '../services/stripeWebhookService.js'
import asyncHandler from 'express-async-handler'
import { logError } from '../services/loggerService.js'

// const clientId = process.env.STRIPE_CLIENT_ID
// const frontEndUrl = process.env.NODE_ENV === 'production' ?
//     process.env.retryforge_DATABASE_URL : process.env.FRONT_END_URL


const trackedEvents = [
    'invoice.payment_failed',
    'payment_intent.payment_failed',
    'invoice.paid',
    'charge.failed',
    'customer.subscription.created',
    'invoice.created',
    'invoice.finalized',
    'customer.created',
    'customer.updated'
]


const handleStripeWebhook = asyncHandler(async (req, res) => {
    const sig = req.headers["stripe-signature"]
    let processingSucceeded = false

    let event
    let webhookEvent = null

    if (!sig) {
        return res.status(400).send("Missing Stripe signature")
    }

    try {
        event = stripe.webhooks.constructEvent(
            req.body, sig, process.env.STRIPE_WEBHOOK_SECRET
        )
    } catch (err) {
        await logError({
            source: "stripeWebhookController.handleStripeWebhook()",
            message: 'Webhook signature verification failed',
            error: err,
            metadata: {}
        })

        return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    // console.log("Stripe event received:", event.type)

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

        if (webhookEvent?.processed_at) {
            console.log("Already fully processed:", event.id)
            return res.json({ received: true })
        }
    }

    const ctx = StripeWebhookService.createCtx(webhookEvent)

    console.log('event type: ' + event.type)

    try {
        switch (event.type) {
            case "invoice.payment_failed":
                await StripeWebhookService.handleInvoicePaymentFailed(event, ctx)
                break
            case 'payment_intent.payment_failed':
                await StripeWebhookService.handlePaymentIntentPaymentFailed(event, ctx)
                break
            case 'charge.failed':
                await StripeWebhookService.handleChargeFailed(event, ctx)
                break
            case "invoice.paid":
                await StripeWebhookService.handleInvoicePaid(event, ctx)
                break
            case "customer.subscription.created":
                await StripeWebhookService.handleSubscriptionCreated(event, ctx)
                break
            case "invoice.created":
                await StripeWebhookService.handleInvoiceCreated(event, ctx)
                break
            case "invoice.finalized": 
                await StripeWebhookService.handleInvoiceFinalized(event, ctx)
                break
            case "customer.updated":
                await StripeWebhookService.hanldeCustomerUpdated(event, ctx)
                break
            case "customer.created":
                await StripeWebhookService.handleCustomerCreated(event, ctx)
                break

            default:
                // console.log(`Unhandled event type: ${event.type}`)
        }

        processingSucceeded = true

        return res.json({ received: true })


    } catch (err) {
        await logError({
            source: "stripeWebhookController.handleStripeWebhook()",
            message: 'Webhook handler failed',
            error: err,
            metadata: {}
        })
        
        if (webhookEvent) {
            await ctx.safeUpdateWebhook({
                processing_error: err.message
            })
        }

        return res.status(500).json({ error: "Webhook handler failed" })
    } finally {
        if (processingSucceeded && webhookEvent) {
            await ctx.safeUpdateWebhook({
                processed: true,
                processed_at: new Date(),
                processing_error: null
            })
        }
    }
})

export { handleStripeWebhook }
