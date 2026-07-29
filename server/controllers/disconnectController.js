import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
import { User, StripeAccount, RecoveryCases } from '../models/index.js'

const clientId = process.env.STRIPE_CLIENT_ID
const frontEndUrl = process.env.NODE_ENV === 'production' ?
    process.env.retryforge_DATABASE_URL : process.env.FRONT_END_URL

const handleAccountDisconnection = async (req, res) => {

    try {
        const userId = req.userId

        const user = await User.findByPk(userId, {
            include: {
                model: StripeAccount,
                as: 'stripeAccount'
            }
        })

        const stripeAccount = user?.stripeAccount

        if (!stripeAccount || !stripeAccount.connected) {
            return res.status(400).json({
                message: "No connected Stripe account."
            })
        }

        const response = await stripe.oauth.deauthorize({
            client_id: clientId,
            stripe_user_id: stripeAccount.stripe_account_id,
        })

        await stripeAccount.update({
            connected: false,
            disconnected_at: new Date(),
            stripe_account_id: null,
            access_token_encrypted: null,
            refresh_token_encrypted: null,
            stripe_email: null,
            charges_enabled: false,
            payouts_enabled: false
        })

        await RecoveryCases.update(
            {
                status: "cancelled",
                next_action_at: null,
                updated_at: new Date()
            },
            {
                where: {
                    stripe_account_uuid: stripeAccount.id,
                    status: "active"
                }
            }
        )

        return res.status(200).json({
            success: true
        })

    } catch (err) {
        console.error(err)
        return res.status(500).json({
            message: "Failed to disconnect Stripe"
        })
    }

}



export { handleAccountDisconnection }