import { SysConfig, User } from "../models/index.js"
import asyncHandler from 'express-async-handler'
import { logError } from '../services/loggerService.js'

const handleSysConfig = asyncHandler(async (req, res) => {
    let userId

    try {
        userId = req.userId

        const configs = await SysConfig.findAll()

        return res.status(200).json(configs)
        
    } catch (err) {
        await logError({
            source: "sysConfigController.handleSysConfig()",
            message: 'Error fetching sys configs for admin page',
            error: err,
            userId: userId ?? null,
            metadata: {}
        })
    }

})


export { handleSysConfig }
