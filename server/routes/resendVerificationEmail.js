 import express from 'express'
const router = express.Router()
import { handleResendVerificationEmail} from '../controllers/verifyEmailController.js'

router.post('/', handleResendVerificationEmail)

export { router }