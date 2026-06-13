import express from 'express'
const router = express.Router();
import {
    getDashboardOverview, getDashboardRecoveries, getDashboardCustomers,
    getDashboardAnalytics, getDashboardRecoveryDetail
} from '../../controllers/dashboardController.js'
import { verifyJWT } from '../../middleware/verifyJWT.js'

// import { sendRecoveryEmail } from '../../services/emailServices.js'

// import { recoveryProcessor } from '../../jobs/recoveryProcessor.js'

router.use(verifyJWT)


// router.route('/')
//     .get(handleDashboard)

router.route('/overview')
    .get(getDashboardOverview)


router.route('/recoveries')
    .get(getDashboardRecoveries)

router.route('/customers')
    .get(getDashboardCustomers)

router.route('/analytics')
    .get(getDashboardAnalytics)

router.route('/recoveries/:id')
    .get(getDashboardRecoveryDetail)

// router.post('/test-recovery-email', async (req, res) => {
//     console.log('here')
//     await recoveryProcessor()

//     res.json({
//         success: true
//     })
// })

export { router }
