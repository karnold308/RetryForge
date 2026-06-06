
import { User, StripeAccount } from '../models/index.js'

const getMe = async (req, res) => {
    try {
        const userId = req.userId

        const user = await User.findByPk(userId, {
            include: [
                {
                    model: StripeAccount,
                    as: 'stripeAccount'
                }
            ]
        });

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        const stripeAccount = await StripeAccount.findOne({
            where: {
                user_id: userId
            }
        })

        return res.json({
            user: {
                id: user.id,
                email: user.email,
                company: user.company,
                roles: user.roles
            },

            stripe: {
                connected: !!user.stripeAccount?.connected,
                stripeAccountId: user.stripeAccount?.stripe_account_id ?? null,
                chargesEnabled: user.stripeAccount?.charges_enabled ?? false,
                detailsSubmitted: user.stripeAccount?.details_submitted ?? false,
                payoutsEnabled: user.stripeAccount?.payments_enabled ?? false,
                country: user.stripeAccount?.country ?? '',
                stripeEmail: user.stripeAccount?.stripe_email ?? '',
            }
        });

    } catch (err) {
        console.error(err)

        return res.status(500).json({
            message: 'Server error'
        })
    }
}

export { getMe }