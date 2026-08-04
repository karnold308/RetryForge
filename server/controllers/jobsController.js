import { recoveryProcessor } from '../jobs/recoveryProcessor.js'
import asyncHandler from 'express-async-handler'

const handleRecoveryProcessor = asyncHandler(async (req, res) => {

    try {
        await recoveryProcessor()

        return res.status(200).json({
            success: true
        })
    } catch (err) {
        console.log('error in recovery processor job: ' + err)
        return res.status(400).json({
            success: false,
            message: err.message
        })

    }




})

export { handleRecoveryProcessor }