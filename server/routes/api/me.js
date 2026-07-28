import express from 'express'
import { getMe, handleChangePassword } from '../../controllers/meController.js'

const router = express.Router()

router.get('/', getMe)

router.post('/change-password', handleChangePassword)

export { router }