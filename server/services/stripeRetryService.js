
import Stripe from 'stripe'


export const retryStripePayment = async ({
    stripeAccountId,
    invoiceId
}) => {

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        stripeAccount: stripeAccountId
    })

    // console.log('start retryStripePayment')

    try {
        // const intent = await stripe.paymentIntents.confirm(paymentIntentId, {
        //     off_session: true
        // })

        const invoice = await stripe.invoices.pay(
            invoiceId, undefined,
            {
                stripeAccount: stripeAccountId
            }
        )

        // console.log('invoice 1: ' + invoice)

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