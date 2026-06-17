import { verifyJWT } from '../../middleware/verifyJWT.js'
import express from 'express'
const router = express.Router();
import {
    getDashboardOverview, getDashboardRecoveries, getDashboardCustomers,
    getDashboardAnalytics, getDashboardRecoveryDetail,
    getRecoveryCaseTimeline, getDashboardRecentRecoveries,
    getDashboardSystemStatus, getDashboardAtRiskCustomers,
    getTopOpportunities, retryRecoveryNow

} from '../../controllers/dashboardController.js'


// import { sendRecoveryEmail } from '../../services/emailServices.js'

// import { recoveryProcessor } from '../../jobs/recoveryProcessor.js'

router.use(verifyJWT)


// router.route('/')
//     .get(handleDashboard)

router.route('/overview')
    .get(getDashboardOverview)


router.route('/recoveries')
    .get(getDashboardRecoveries)

router.route('/recoveries/:id')
    .get(getDashboardRecoveryDetail)

router.route('/recoveries/:id/retry')
    .post(retryRecoveryNow)

router.route('/recentrecoveries')
    .get(getDashboardRecentRecoveries)

router.route('/customers')
    .get(getDashboardCustomers)

router.route('/customers/at-risk')
    .get(getDashboardAtRiskCustomers)

router.route('/analytics')
    .get(getDashboardAnalytics)

router.route('/recover-case/:id/timeline')
    .get(getRecoveryCaseTimeline)

router.route('/systemstatus')
    .get(getDashboardSystemStatus)

router.route('/customers/topopportunities')
    .get(getTopOpportunities)



// router.post('/test-recovery-email', async (req, res) => {
//     console.log('here')
//     await recoveryProcessor()

//     res.json({
//         success: true
//     })
// })

export { router }
