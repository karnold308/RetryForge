
import Stripe from 'stripe'


export const retryStripePayment = async ({
    stripeAccountId,
    paymentIntentId
}) => {

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        stripeAccount: stripeAccountId
    })

    try {
        const intent = await stripe.paymentIntents.confirm(paymentIntentId, {
            off_session: true
        })

        return {
            success: true,
            intent
        }

    } catch (err) {
        return {
            success: false,
            error: err?.raw?.message || err.message
        }
    }
}