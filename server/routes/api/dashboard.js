import express from 'express'
const router = express.Router();
import { getDashboardOverview, getDashboardRecoveries, getDashboardCustomers } from '../../controllers/dashboardController.js'
import { verifyJWT } from '../../middleware/verifyJWT.js';

router.use(verifyJWT)


// router.route('/')
//     .get(handleDashboard)

router.route('/overview')
    .get(getDashboardOverview)


router.route('/recoveries')
    .get(getDashboardRecoveries)

router.route('/customers')
    .get(getDashboardCustomers)
    

export { router }