
import Stripe from 'stripe'
import { logError } from '../services/loggerService.js'


export const retryStripePayment = async ({
    stripeAccountId,
    invoiceId
}) => {

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        stripeAccount: stripeAccountId
    })

    try {
        const invoice = await stripe.invoices.pay(
            invoiceId, undefined,
            {
                stripeAccount: stripeAccountId
            }
        )

        return {
            success: true,
            invoice
        }

    } catch (err) {
        await logError({
            source: "stripeRetryService.retryStripePayment()",
            message: "Error retrying stripe invoice",
            error: err,
            metadata: {stripeAccountId: stripeAccountId, invoiceId: invoiceId }
        })
        
        return {
            success: false,
            error: err?.raw?.message || err.message
        }
    }
}