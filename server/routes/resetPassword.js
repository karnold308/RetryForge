 import express from 'express'
const router = express.Router()
import { handleResetPassword } from '../controllers/passwordController.js'

router.post('/', handleResetPassword)

export { router }