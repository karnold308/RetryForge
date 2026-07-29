 import express from 'express'
const router = express.Router()
import { handleAccountRefresh} from '../../controllers/stripeRefreshController.js'

router.post('/', handleAccountRefresh)

export { router }
