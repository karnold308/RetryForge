import { recoveryProcessor } from '../jobs/recoveryProcessor.js'

const handleRecoveryProcessor = async (req, res) => {

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




}

export { handleRecoveryProcessor }