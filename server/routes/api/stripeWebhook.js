import express from 'express'
const router = express.Router()
import { handleStripeWebhook } from '../../controllers/stripeWebhookController.js'

router.post('/webhook',
    express.raw({ type: "application/json" }),
    handleStripeWebhook)

export { router }

