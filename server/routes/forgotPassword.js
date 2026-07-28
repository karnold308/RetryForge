 import express from 'express'
const router = express.Router()
import { handleForgotPassword } from '../controllers/passwordController.js'

router.post('/', handleForgotPassword)

export { router }