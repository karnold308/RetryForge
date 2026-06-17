import Stripe from 'stripe'
import {
    RecoveryCases, StripeAccountCustomers,
    StripeAccount, RecoveryStrategyStats,
    WebhookEvents, CronJobAudit,
    RecoveryCommunications
} from '../models/index.js'
import asyncHandler from 'express-async-handler'
import { Sequelize, Op, fn, col } from 'sequelize'
import { retryStripePayment } from '../services/stripeRetryService.js'
const { v4: uuid } = await import('uuid')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const getDashboard = asyncHandler(async (req, res) => {
    console.log('in getDashboard')
    // const dashboard = await Dashboard.find().select('-password').lean()

    // if (!dashboard) {
    // return res.status(400).json({message: 'no dashboard items found' })
    // }

    // res.json(dashboard)
    res.json({ message: "made it to dashboard!" })
})


const getDashboardOverview = asyncHandler(async (req, res) => {
    try {
        const userId = req.userId

        const activeRecoveries = await RecoveryCases.count({
            where: {
                user_id: userId, status: 'active'
            }
        })


        const recoveredCases = await RecoveryCases.count({
            where: { user_id: userId, status: 'recovered' }
        })

        const recoveredRevenueResult = await RecoveryCases.sum(
            'amount_due',
            {
                where: { user_id: userId, status: 'recovered' }
            })

        const atRiskCustomers = await RecoveryCases.count({
            distinct: true,
            col: 'stripe_customer_id',
            where: { user_id: userId, status: 'active' }
        })

        const revenueAtRisk = await RecoveryCases.sum(
            'amount_due',
            {
                where: { user_id: userId, status: 'active' }
            })

        const totalRecoveryCases = activeRecoveries + recoveredCases

        const recoveryRate = totalRecoveryCases > 0 ? ((recoveredCases / totalRecoveryCases) * 100) : 0

        const averageRecoveryTimeResult =
            await RecoveryStrategyStats.findOne({
                attributes: [
                    [
                        fn('AVG', col('recovery_speed_hours')),
                        'avgSpeed'
                    ]
                ],
                include: [{
                    model: RecoveryCases,
                    as: 'recoveryCases',
                    attributes: [],
                    where: {
                        user_id: userId
                    }
                }],
                raw: true
            })

        const averageRecoveryTime = Number(averageRecoveryTimeResult?.avgSpeed || 0).toFixed(1)

        const retryForgeAutoRecoveries = await RecoveryCases.count({
            where: { user_id: userId, status: 'recovered', recovery_source: 'retryforge_auto' }
        })

        const retryForgeManualRecoveries = await RecoveryCases.count({
            where: { user_id: userId, status: 'recovered', recovery_source: 'retryforge_manual' }
        })

        const stripeRecoveries = await RecoveryCases.count({
            where: { user_id: userId, status: 'recovered', recovery_source: 'stripe_smart_retry' }
        })

        const manualRecoveries = await RecoveryCases.count({
            where: { user_id: userId, status: 'recovered', recovery_source: 'manual' }
        })



        const totalRecovered = retryForgeAutoRecoveries + retryForgeManualRecoveries + stripeRecoveries + manualRecoveries
        const retryForgeAutoPercent = totalRecovered > 0 ? Number(((retryForgeAutoRecoveries / totalRecovered) * 100).toFixed(1)) : 0
        const retryForgeManualPercent = totalRecovered > 0 ? Number(((retryForgeManualRecoveries / totalRecovered) * 100).toFixed(1)) : 0
        const stripePercent = totalRecovered > 0 ? Number(((stripeRecoveries / totalRecovered) * 100).toFixed(1)) : 0
        const manualPercent = totalRecovered > 0 ? Number(((manualRecoveries / totalRecovered) * 100).toFixed(1)) : 0

        const retryForgeAutoRevenue = await RecoveryCases.sum(
            'amount_recovered', { where: { user_id: userId, recovery_source: 'retryforge_auto', status: 'recovered' } })

        const retryForgeManualRevenue = await RecoveryCases.sum(
            'amount_recovered', { where: { user_id: userId, recovery_source: 'retryforge_manual', status: 'recovered' } })

        const stripeRevenue = await RecoveryCases.sum(
            'amount_recovered', { where: { user_id: userId, recovery_source: 'stripe_smart_retry', status: 'recovered' } })


        const manualRevenue = await RecoveryCases.sum(
            'amount_recovered', { where: { user_id: userId, recovery_source: 'manual', status: 'recovered' } })


        return res.json({
            totalRecoveryCases,
            activeRecoveries,
            recoveredRevenue: (recoveredRevenueResult || 0),
            atRiskCustomers,
            recoveryRate,
            revenueAtRisk,
            averageRecoveryTime,
            retryForgeAutoRevenue,
            retryForgeManualRevenue,
            stripeRevenue,
            manualRevenue,
            retryForgeAutoPercent,
            retryForgeManualPercent,
            stripePercent,
            manualPercent
        })

    } catch (err) {
        console.error(err)

        return res.status(500).json({
            error: 'Failed to load overview'
        })
    }
})


const getDashboardRecoveries = asyncHandler(async (req, res) => {
    console.log('start getrecoveries')
    try {
        const userId = req.userId

        const cases = await RecoveryCases.findAll({
            where: {
                user_id: userId
            },
            include: [
                {
                    model: StripeAccountCustomers,
                    as: "stripeAccountCustomer",
                    required: false,
                    attributes: ["email", "name"]
                }
            ],
            order: [["last_failed_event_at", "DESC"]]
        })

        const formatted = cases.map(c => ({
            id: c.id,
            customer:
                c.stripeAccountCustomer?.email ||
                c.stripe_customer_id,
            amount: c.amount_due,
            failureReason: c.failure_message || c.failure_code,
            attempts: c.attempt_count,
            status: c.status,
            failedDate: c.last_failed_event_at,
            hostedInvoiceUrl: c.hosted_invoice_url
        }))

        res.json(formatted)
    } catch (err) {

    }
})

const getDashboardCustomers = asyncHandler(async (req, res) => {
    try {

        const stripeAccount = await StripeAccount.findOne({
            where: {
                user_id: req.userId
            }
        })

        if (!stripeAccount) {
            return res.json([])
        }

        const customers = await StripeAccountCustomers.findAll({
            where: {
                stripe_account_uuid: stripeAccount.id
            },
            include: [{
                model: RecoveryCases,
                as: 'recoveryCases',
                required: false
            }],
            order: [
                ['last_payment_failed_at', 'DESC']
            ]
        })

        // const rows = await Promise.all(customers.map(async customer => {
        const rows = customers.map(customer => {
            // const recoveryCases = await RecoveryCases.findAll({
            //     where: {
            //         stripe_customer_id: customer.stripe_customer_id,
            //         stripe_account_uuid: stripeAccount.id
            //     }
            // })

            const recoveryCases = customer.recoveryCases || []

            const totalAtRisk = recoveryCases.reduce(
                (sum, rc) =>
                    rc.status === 'active'
                        ? sum + rc.amount_due
                        : sum, 0)

            const recoveredRevenue = recoveryCases.reduce(
                (sum, rc) =>
                    rc.status === 'recovered'
                        ? sum + rc.amount_due
                        : sum, 0)

            return {
                id: customer.id,
                stripeCustomerId: customer.stripe_customer_id,
                email: customer.email,
                name: customer.name,
                phone: customer.phone,
                activeFailures: recoveryCases.filter(r => r.status === 'active').length,
                recoveredInvoices: recoveryCases.filter(r => r.status === 'recovered').length,
                totalAtRisk,
                recoveredRevenue,
                lastFailedAt: customer.last_payment_failed_at
            }
        })


        res.json(rows)

    } catch (err) {
        console.error("getCustomers error:", err)
        return res.status(500).json({ error: "Failed to fetch customers" })
    }
})

const getDashboardAtRiskCustomers = asyncHandler(async (req, res) => {
    try {
        const userId = req.userId

        const customers = await StripeAccountCustomers.findAll({
            where: {
                user_id: userId
            },
            include: [{
                model: RecoveryCases,
                as: "recoveryCases",
                attributes: [
                    "amount_due",
                    "last_failed_event_at"
                ],
                where: {
                    status: "active"
                },
                required: true
            }],
            order: [
                [{ model: RecoveryCases, as: 'recoveryCases' }, 'last_failed_event_at', 'DESC']
            ]
        })

        const result = customers.map(c => {
            const totalAtRisk = c.recoveryCases.reduce((sum, r) => sum + Number(r.amount_due), 0)

            return {
                id: c.id,
                email: c.email,
                name: c.name,
                activeFailures: c.recoveryCases.length,
                totalAtRisk,
                lastFailedAt: c.recoveryCases[0]?.last_failed_event_at ?? null
            }
        })

        res.json(result)

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to fetch at-risk customers" })
    }
})

const getDashboardAnalytics = asyncHandler(async (req, res) => {
    const userId = req.userId

    try {
        const totalFailures = await RecoveryCases.count({
            where: { user_id: userId }
        })

        const activeRecoveries = await RecoveryCases.count({
            where: {
                user_id: userId, status: 'active'
            }
        })

        const recoveredCases = await RecoveryCases.count({
            where: {
                user_id: userId, status: 'recovered'
            }
        })

        const recoveredRevenue = await RecoveryCases.sum(
            'amount_due',
            {
                where: { user_id: userId, status: 'recovered' }
            })

        const revenueAtRisk = await RecoveryCases.sum(
            'amount_due',
            {
                where: { user_id: userId, status: 'active' }
            })

        const failureReasons = await RecoveryCases.findAll({
            where: { user_id: userId },
            attributes: [
                'failure_code',
                [
                    fn('COUNT', col('failure_code')),
                    'count'
                ]
            ],
            group: ['failure_code'],
            order: [
                [fn('COUNT', col('failure_code')), 'DESC']
            ]
        })

        const recoveryRate = totalFailures > 0 ?
            Number((recoveredCases / totalFailures) * 100).toFixed(1) : 0

        return res.json({
            totalFailures,
            activeRecoveries,
            recoveredCases,
            recoveredRevenue: (recoveredRevenue || 0),
            revenueAtRisk: (revenueAtRisk || 0),
            recoveryRate,
            failureReasons
        })

    } catch (err) {
        console.error(err)

        return res
            .status(500)
            .json({
                message:
                    'Failed to load analytics'
            })
    }
})


const getDashboardRecoveryDetail = asyncHandler(async (req, res) => {
    try {
        const recoveryCase =
            await RecoveryCases.findOne({
                where: {
                    id: req.params.id
                }
            })

        if (!recoveryCase) {
            return res.sendStatus(404)
                .json({
                    message:
                        'Cannot find recovery detail for: ' + req.params.id
                })
        }

        const customer =
            await StripeAccountCustomers.findOne({
                where: {
                    stripe_customer_id: recoveryCase.stripe_customer_id, stripe_account_uuid: recoveryCase.stripe_account_uuid
                }
            })

        return res.json({
            id: recoveryCase.id,
            customerName: customer?.name,
            customerEmail: customer?.email,
            customerPhone: customer?.phone,
            amount: recoveryCase.amount_due,
            status: recoveryCase.status,
            failureCode: recoveryCase.failure_code,
            failureMessage: recoveryCase.failure_message,
            invoiceId: recoveryCase.stripe_invoice_id,
            subscriptionId: recoveryCase.stripe_subscription_id,
            attemptCount: recoveryCase.attempt_count,
            recoveryEmailsSent: recoveryCase.recovery_email_sent_count,
            invoiceCreatedAt: recoveryCase.invoice_created_at,
            failedAt: recoveryCase.last_failed_event_at,
            recoveredAt: recoveryCase.recovered_at,
            hostedInvoiceUrl: recoveryCase.hosted_invoice_url
        })

    } catch (err) {
        console.error(err)

        return res
            .status(500)
            .json({
                message:
                    'Failed to load recovery detail for: ' + req.params.id
            })
    }
})

const getDashboardRecentRecoveries = asyncHandler(async (req, res) => {
    try {
        const userId = req.userId

        const cases = await RecoveryCases.findAll({
            where: {
                user_id: userId, status: 'recovered'
            },
            include: [
                {
                    model: StripeAccountCustomers,
                    as: "stripeAccountCustomer",
                    required: false,
                    attributes: ["email", "name"]
                }
            ],
            order: [["recovered_at", "DESC"]],
            limit: 10
        })

        const formatted = cases.map(c => ({
            id: c.id,
            customer: c.stripeAccountCustomer?.email || c.stripe_customer_id,
            amount: c.amount_due,
            source: c.recovery_source,
            failureReason: c.failure_message,
            attempts: c.attempt_count,
            recoveredAt: c.recovered_at
        }))

        res.json(formatted)

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to fetch recent recoveries" })
    }


})


const getRecoveryCaseTimeline = asyncHandler(async (req, res) => {
    try {
        // TODO:
        // const caseData = ...

        // const webhooks = await WebhookEvents.findAll(...)
        // const actions = await RecoveryActions.findAll(...)
        // const comms = await RecoveryCommunications.findAll(...)

        // return combineAndSort()

    } catch (err) {

    }
})

const getDashboardSystemStatus = asyncHandler(async (req, res) => {
    try {

        const stripeAccount = await StripeAccount.findOne({
            where: { user_id: req.userId }
        })

        const webhookEvent = await WebhookEvents.findOne({
            order: [["received_at", "DESC"]]
        })

        // TODO - figure out how to evaluate this
        const webhookHealthy = true

        const scheduler = await CronJobAudit.findOne({
            order: [["created_at", "DESC"]]
        })

        const schedulerHealthy = false
        if (scheduler) {
            const hourInMilliseconds = 60 * 60 * 1000
            const difference = Date.now() - scheduler.getTime()

            schedulerHealthy = difference >= 0 && difference <= hourInMilliseconds
        }

        res.json({
            stripeConnected: stripeAccount.connected,
            webhookHealthy,
            lastWebhookAt: webhookEvent?.received_at,
            schedulerHealthy,
            lastJobRun: scheduler?.created_at ?? null,
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to fetch system status" })
    }
})


const getTopOpportunities = asyncHandler(async (req, res) => {
    const userId = req.userId

    const customers = await StripeAccountCustomers.findAll({
        where: { user_id: userId },
        include: [{
            model: RecoveryCases,
            as: "recoveryCases",
            attributes: [
                "id",
                "amount_due",
                "last_failed_event_at",
                "attempt_count"
            ],
            where: { status: "active" },
            required: true
        }]
    })

    const now = Date.now()

    const scored = customers.map(c => {
        const activeFailures = c.recoveryCases.length

        const sortedCases = c.recoveryCases.sort(
            (a, b) => b.amount_due - a.amount_due
        )

        const topCase = sortedCases[0]

        const totalAtRisk = c.recoveryCases.reduce(
            (sum, r) => sum + Number(r.amount_due), 0)

        const mostRecent = Math.max(
            ...c.recoveryCases.map(r =>
                new Date(r.last_failed_event_at).getTime()
            )
        )

        const hoursSinceFailure = (now - mostRecent) / (1000 * 60 * 60)

        let recencyMultiplier = 0.7
        if (hoursSinceFailure < 24) recencyMultiplier = 1.5
        else if (hoursSinceFailure < 72) recencyMultiplier = 1.2
        else if (hoursSinceFailure < 168) recencyMultiplier = 1.0

        const attemptAvg = c.recoveryCases.reduce((s, r) => s + r.attempt_count, 0) / activeFailures

        let attemptMultiplier = 1.0;
        if (attemptAvg >= 5) attemptMultiplier = 0.6;
        else if (attemptAvg >= 3) attemptMultiplier = 0.8;

        const score = totalAtRisk * (1 + activeFailures * 0.25) * recencyMultiplier * attemptMultiplier

        return {
            id: c.id,
            email: c.email,
            name: c.name,
            totalAtRisk,
            activeFailures,
            lastFailedAt: new Date(mostRecent),
            score,
            topCaseId: topCase.id
        }
    })

    const sorted = scored.sort((a, b) => b.score - a.score).slice(0, 5)

    res.json(sorted)
})

const retryRecoveryNow = asyncHandler(async (req, res) => {
    const userId = req.userId
    const recoveryId = req.params.id

    const recoveryCase = await RecoveryCases.findOne({
        where: {
            id: recoveryId,
            user_id: userId,
            status: 'active'
        }
    })

    if (!recoveryCase) {
        return res.status(404).json({ error: 'Recovery case not found' })
    }

    const stripeAccount = await StripeAccount.findOne({
        where: { user_id: userId }
    })

    if (!stripeAccount) {
        return res.status(400).json({ error: 'Stripe not connected' })
    }



    if (recoveryCase.last_retry_attempt_at &&
        Date.now() - recoveryCase.last_retry_attempt_at < 30000) {
        return res.status(400).json({ success: false, accepted: false, message: 'Retry already in progress' })
    }

    try {

        await recoveryCase.update({
            last_retry_attempt_at: new Date(),
        })

        // OPTION 1: retry invoice payment
        // const invoice = await stripe.invoices.pay(
        //     recovery.stripe_invoice_id, { stripeAccount: stripeAccount.stripe_account_id }
        // )

        const invoiceBefore = await stripe.invoices.retrieve(recoveryCase.stripe_invoice_id, undefined, {
            stripeAccount: stripeAccount.stripe_account_id
        })

        if (invoiceBefore.status === "paid") {
            return res.json({
                success: false,
                accepted: false,
                message: "Invoice already paid"
            })
        }

        if (invoiceBefore.status !== "open") {
            return res.json({
                success: false,
                accepted: false,
                message: `Invoice not open: ${invoiceBefore.status}`
            })
        }

        const result = await retryStripePayment({
            stripeAccountId: stripeAccount.stripe_account_id,
            paymentIntentId: recoveryCase.stripe_invoice_id
        })

        const invoice = await stripe.invoices.retrieve(recoveryCase.stripe_invoice_id, undefined, {
            stripeAccount: stripeAccount.stripe_account_id
        })
        const paymentIntent =
            typeof invoice.payment_intent === "string"
                ? await stripe.paymentIntents.retrieve(invoice.payment_intent)
                : invoice.payment_intent

        const paymentStatus = paymentIntent?.status

        await recoveryCase.increment('retry_count')
        console.log('about to set to rf manual')
        await recoveryCase.update({
            last_retry_attempt_at: new Date(),
            last_retry_status: result.success ? 'success' : 'failed',
            recovery_source: 'retryforge_manual'
        })
        console.log('done setting to rf manual')

        await RecoveryCommunications.create({
            id: uuid(),
            recovery_case_uuid: recoveryCase.id,
            type: 'stripe_retry_manual',
            step: null,
            status: result.success ? 'success' : 'failed',
            provider_id: result.intent?.id ?? null,
            sent_at: new Date(),
            metadata: { error: result.error ?? null }
        })

        if (invoice.status !== "paid") {
            return res.json({
                success: false,
                accepted: false,
                message: `Invoice status is ${invoice.status}`
            })
        }

        return res.json({
            success: false,
            accepted: true,
            invoiceStatus: invoice.status,
            paymentIntentStatus: paymentIntent?.status
        })

    } catch (err) {
        console.error(err)

        return res.status(500).json({
            error: 'Manual Stripe retry failed',
            message: err.message
        })
    }
})


export {
    getDashboard, getDashboardOverview,
    getDashboardRecoveries, getDashboardCustomers,
    getDashboardAnalytics, getDashboardRecoveryDetail,
    getRecoveryCaseTimeline, getDashboardRecentRecoveries,
    getDashboardSystemStatus, getDashboardAtRiskCustomers,
    getTopOpportunities, retryRecoveryNow
}
