import express from 'express'
const router = express.Router()
import { verifyCron } from '../../middleware/verifyCron.js'
import { handleRecoveryProcessor } from '../../controllers/jobsController.js'

router.get('/recovery-processor', verifyCron, handleRecoveryProcessor)

export { router }