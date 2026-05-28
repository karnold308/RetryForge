import express from 'express'
const router = express.Router();
import { getDashboard } from '../controllers/dashboardController.js'
import { verifyJWT } from '../middleware/verifyJWT.js';

router.use(verifyJWT)


router.route('/')
    .get(getDashboard)



export { router }