
import Stripe from 'stripe'
import { logError } from '../services/loggerService.js'
import StripeAccount from '../models/StripeAccount.js'
import { User } from '../models/index.js'


export const retryStripePayment = async ({
    stripeAccountId,
    invoiceId
}) => {

    const stripeAccount = await StripeAccount.findOne({
        where: { stripe_account_id: stripeAccountId }
    })

    const user = await User.findOne({
        where: { id: stripeAccount.user_id }
    })

    if (!user) {
        return
    }

    let stripe

    // check for tester account
    if (user.roles.includes(5555)) {
        stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST, {
            stripeAccount: stripeAccountId
        })
    } else {
        stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            stripeAccount: stripeAccountId
        })
    }

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
            stripeAccountUuid: stripeAccount?.id ?? null,
            error: err,
            userId: user.id ?? null,
            metadata: { stripeAccountId: stripeAccountId, invoiceId: invoiceId }
        })

        return {
            success: false,
            error: err?.raw?.message || err.message
        }
    }
}