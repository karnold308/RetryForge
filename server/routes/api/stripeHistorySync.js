 import express from 'express'
const router = express.Router()
import { handleHistorySync, skipHistorySync } from '../../controllers/stripeHistorySyncController.js'

router.post('/', handleHistorySync)

router.post('/skip', skipHistorySync)

export { router }
