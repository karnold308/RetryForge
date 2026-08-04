
import { User, StripeAccount } from '../models/index.js'
import bcrypt from 'bcrypt'
import asyncHandler from 'express-async-handler'
import { logError } from '../services/loggerService.js'

const getMe = asyncHandler(async(req, res) => {
    let userId
    try {
        userId = req.userId

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
                historySyncStatus: user.stripeAccount?.history_sync_status ?? '',
                historySyncStartedAt: user.stripeAccount?.history_sync_started_at ?? null,
                historySyncCompletedAt: user.stripeAccount?.history_sync_completed_at ?? null,
                historySyncError: user.stripeAccount?.history_sync_error ?? '',
                initialSyncComplete: user.stripeAccount?.initialSyncComplete ?? false
            }
        });

    } catch (err) {
        await logError({
            source: "meController.getMe()",
            message: 'Server error',
            error: err,
            userId: userId ?? null,
            metadata: {}
        })

        return res.status(500).json({
            message: 'Server error'
        })
    }
})

const handleChangePassword = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { currentPassword, newPassword } = req.body

    const user = await User.findByPk(userId)

    if (!user) return res.sendStatus(401)

    try {


        if (currentPassword === newPassword) {
            return res.status(400).json({
                success: false,
                code: "SAME_PASSWORD",
                message: "Your current and new password are the same."
            })
        }

        // evaluate password
        const match = await bcrypt.compare(currentPassword, user.password_hash)

        // current password is incorrect
        if (!match) {
            return res.status(400).json({
                success: false,
                code: "CURRENT_PASSWORD_WRONG",
                message: "Your existing password is incorrect."
            })
        }

        // hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        // update user record
        await user.update({
            refresh_token: null,
            password_hash: hashedPassword,
            updated_at: new Date()
        })

        return res.status(200).json({
            success: true,
            message: "Password updated successfully."
        })
    } catch (err) {
        await logError({
            source: "meController.handleChangePassword()",
            message: 'Issue when changing password',
            error: err,
            userId: userId ?? null,
            metadata: {}
        })

        return res.status(500).json({
            message: 'Server error'
        })
    }

})

export { getMe, handleChangePassword }