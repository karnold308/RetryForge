 import express from 'express'
const router = express.Router()
import { handleVerifyEmail} from '../controllers/verifyEmailController.js'

router.get('/', handleVerifyEmail)

export { router }