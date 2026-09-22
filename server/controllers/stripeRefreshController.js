import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const stripeTestAcct = new Stripe(process.env.STRIPE_SECRET_KEY_TEST)
import { User, StripeAccount } from '../models/index.js'
import asyncHandler from 'express-async-handler'
const clientId = process.env.STRIPE_CLIENT_ID
import { logError } from '../services/loggerService.js'


const handleAccountRefresh = asyncHandler(async (req, res) => {

    let userId
    let stripeAccount
    try {
        userId = req.userId

        const user = await User.findByPk(userId, {
            include: {
                model: StripeAccount,
                as: 'stripeAccount'
            }
        })

        stripeAccount = user?.stripeAccount

        let account
        // check for tester account
        if (user.roles.includes(5555)) {
            account = await stripeTestAcct.accounts.retrieve(
                stripeAccount.stripe_account_id
            )
        } else {
            account = await stripe.accounts.retrieve(
                stripeAccount.stripe_account_id
            )
        }


        await stripeAccount.update({
            charges_enabled: account.charges_enabled,
            payouts_enabled: account.payouts_enabled,
            details_submitted: account.details_submitted,
            stripe_email: account.email,
            country: account.country
        })

        return res.status(200).json({
            success: true
        })

    } catch (err) {
        await logError({
            source: "stripeRefreshContrller.handleAccountRefresh()",
            message: 'Issue when refreshing account details',
            stripeAccountUuid: stripeAccount?.id ?? null,
            error: err,
            userId: userId ?? null,
            metadata: {}
        })

        return res.status(500).json({
            message: "Failed to refresh Stripe"
        })
    }

})

export { handleAccountRefresh }
