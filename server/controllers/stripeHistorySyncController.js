import { HistorySyncService } from '../services/historySyncService.js'
import { StripeAccount } from '../models/index.js'
import asyncHandler from 'express-async-handler'
import { logError } from '../services/loggerService.js'


const handleHistorySync = asyncHandler(async (req, res) => {
    let userId
    let stripeAccount
    
    try {
        userId = req.userId

        stripeAccount = await StripeAccount.findOne({
            where: { user_id: req.userId }
        })

        HistorySyncService.importFailedInvoices({
            stripeAccount
        }).catch(err => {
            logError({
                source: "stripeHistorySyncController.handleHistorySync()",
                message: 'History sync failed',
                error: err,
                userId: userId ?? null,
                stripeAccountUuid: stripeAccount?.id ?? null,
                metadata: {}
            })
        })

        return res.status(202).json({
            message: "History sync started."
        })

    } catch (err) {
        await logError({
            source: "stripeHistorySyncController.handleHistorySync()",
            message: 'Unable to start history sync',
            error: err,
            userId: userId ?? null,
            stripeAccountUuid: stripeAccount?.id ?? null,
            metadata: {}
        })

        return res.status(500).json({
            message: "Unable to start history sync."
        })
    }
})

const skipHistorySync = asyncHandler(async (req, res) => {
    let userId
    let stripeAccount

    try {
        userId = req.userId

        stripeAccount = await StripeAccount.findOne({
            where: { user_id: req.userId }
        })

        await stripeAccount.update({
            history_sync_status: 'skipped',
            initial_sync_complete: true,
            history_sync_completed_at: new Date(),
            updated_at: new Date()
        })

        return res.status(202).json({
            message: "History sync skipped"
        })

    } catch (err) {
        await logError({
            source: "stripeHistorySyncController.skipHistorySync()",
            message: 'Unable to skip history sync',
            error: err,
            userId: userId ?? null,
            stripeAccountUuid: stripeAccount?.id ?? null,
            metadata: {}
        })

        return res.status(500).json({
            message: "Unable to skip history sync."
        })
    }

})

export { handleHistorySync, skipHistorySync }