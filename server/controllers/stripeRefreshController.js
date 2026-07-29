import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
import { User, StripeAccount } from '../models/index.js'

const clientId = process.env.STRIPE_CLIENT_ID


const handleAccountRefresh = async (req, res) => {

    try {
        const userId = req.userId

        const user = await User.findByPk(userId, {
            include: {
                model: StripeAccount,
                as: 'stripeAccount'
            }
        })

        const stripeAccount = user?.stripeAccount

        const account = await stripe.accounts.retrieve(
            stripeAccount.stripe_account_id
        )

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
        console.error(err)
        return res.status(500).json({
            message: "Failed to refresh Stripe"
        })
    }

}

export { handleAccountRefresh }
