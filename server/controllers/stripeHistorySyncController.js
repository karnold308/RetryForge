import { HistorySyncService } from '../services/historySyncService.js'
import { StripeAccount } from '../models/index.js'


const handleHistorySync = async (req, res) => {
    try {
        const userId = req.userId

        const stripeAccount = await StripeAccount.findOne({
            where: { user_id: req.userId }
        })

        HistorySyncService.importFailedInvoices({
            stripeAccount
        }).catch(err => {
            console.error("History sync failed", err)
        })

        return res.status(202).json({
            message: "History sync started."
        })

    } catch (err) {
        console.error(err)

        return res.status(500).json({
            message: "Unable to start history sync."
        })
    }
}

const skipHistorySync = async (req, res) => {
    try {
        const userId = req.userId

        const stripeAccount = await StripeAccount.findOne({
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
        console.error(err)

        return res.status(500).json({
            message: "Unable to skip history sync."
        })
    }

}

export { handleHistorySync, skipHistorySync }