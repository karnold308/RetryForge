import express from 'express'
const router = express.Router()
import { handleAdminLogs } from '../../controllers/adminLogsController.js'

router.get('/', handleAdminLogs)

export { router }
