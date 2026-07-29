import express from 'express'
const router = express.Router()
import { handleAccountDisconnection } from '../../controllers/disconnectController.js'

router.post('/', handleAccountDisconnection)

export { router }
