import express from 'express'
const router = express.Router()
import { handleSysConfig } from '../../controllers/sysConfigController.js'

router.get('/', handleSysConfig)

export { router }
