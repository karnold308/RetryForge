import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
import { User, StripeAccount, RecoveryCases } from '../models/index.js'
import asyncHandler from 'express-async-handler'
import { logError } from '../services/loggerService.js'

const clientId = process.env.STRIPE_CLIENT_ID

const handleAccountDisconnection = asyncHandler(async (req, res) => {

    let userId 
    try {
        userId = req.userId

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

        // removed before mvp, as disconneccting/deauthorizing an account usually prevents
        // it from being reconnected due to v2 OAUTH rules by Stripe
        // const response = await stripe.oauth.deauthorize({
        //     client_id: clientId,
        //     stripe_user_id: stripeAccount.stripe_account_id,
        // })

        await stripeAccount.update({
            connected: false,
            disconnected_at: new Date()
        })

        await RecoveryCases.update(
            {
                status: "paused",
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
        await logError({
            source: "disconnectController.handleAccountDisconnection()",
            message: 'Failed to disconnect Stripe',
            error: err,
            userId: userId ?? null,
            metadata: {}
        })

        return res.status(500).json({
            message: "Failed to disconnect Stripe"
        })
    }

})



export { handleAccountDisconnection }