
import Stripe from 'stripe'


export const retryStripePayment = async ({
    stripeAccountId,
    paymentIntentId
}) => {

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        stripeAccount: stripeAccountId
    })

    try {
        // const intent = await stripe.paymentIntents.confirm(paymentIntentId, {
        //     off_session: true
        // })

        const invoice = await stripe.invoices.pay(
            paymentIntentId, undefined,
            {
                stripeAccount: stripeAccountId
            }
        )

        console.log('invoice 1: ' + invoice)

        return {
            success: true,
            // intent
            invoice
        }

    } catch (err) {
        return {
            success: false,
            error: err?.raw?.message || err.message
        }
    }
}