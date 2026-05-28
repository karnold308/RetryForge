 import express from 'express';
const router = express.Router();
import { handleStripeConnection } from '../../controllers/stripeAccountRequestController.js';

router.get('/', handleStripeConnection);

export { router };