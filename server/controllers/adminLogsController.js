import { ApplicationLogs, User, StripeAccount } from "../models/index.js"
import asyncHandler from 'express-async-handler'
import { logError } from '../services/loggerService.js'

const handleAdminLogs = asyncHandler(async (req, res) => {
    let userId
    try {
        userId = req.userId

        const logs = await ApplicationLogs.findAll({
            // todo: make more verbose logging by adding 'warn' types to log db
            // where: {
            //     level: "error"
            // },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["email"]
                },
                {
                    model: StripeAccount,
                    as: "stripeAccount",
                    attributes: ["stripe_account_id"]
                }
            ],
            order: [["created_at", "DESC"]],
            limit: 100
        })

        return res.status(200).json(logs)
    } catch (err) {
        await logError({
            source: "adminLogsController.handleAdminLogs()",
            message: 'Error fetching logs for admin page',
            error: err,
            userId: userId ?? null,
            metadata: {}
        })

        return res.status(500).json({
            message: "Unable to retrieve logs."
        })
    }

})


export { handleAdminLogs }