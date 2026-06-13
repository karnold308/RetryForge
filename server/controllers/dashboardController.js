
import { RecoveryCases, StripeAccountCustomers, StripeAccount } from '../models/index.js'
import asyncHandler from 'express-async-handler'
import { Sequelize, Op, fn, col } from 'sequelize'


const getDashboard = asyncHandler(async (req, res) => {
    console.log('in getDashboard')
    // const dashboard = await Dashboard.find().select('-password').lean();

    // if (!dashboard) {
    // return res.status(400).json({message: 'no dashboard items found' })
    // }

    // res.json(dashboard);
    res.json({ message: "made it to dashboard!" })
})


const getDashboardOverview = asyncHandler(async (req, res) => {
    try {
        const userId = req.userId

        const failedPayments = await RecoveryCases.count({
            where: {
                user_id: userId,
                status: 'active'
            }
        })

        const recoveredCases = await RecoveryCases.count({
            where: {
                user_id: userId,
                status: 'recovered'
            }
        })

        const recoveredRevenueResult = await RecoveryCases.sum(
            'amount_due',
            {
                where: {
                    user_id: userId,
                    status: 'recovered'
                }
            })

        const atRiskCustomers = await RecoveryCases.count({
            distinct: true,
            col: 'stripe_customer_id',
            where: {
                user_id: userId,
                status: 'active'
            }
        })

        const revenueAtRisk = await RecoveryCases.sum(
            'amount_due',
            {
                where: {
                    user_id: userId,
                    status: 'active'
                }
            })

        const totalCases = failedPayments + recoveredCases

        const recoveryRate = totalCases > 0 ? ((recoveredCases / totalCases) * 100) : 0

        return res.json({
            failedPayments,
            recoveredRevenue:
                (recoveredRevenueResult || 0),
            atRiskCustomers,
            recoveryRate,
            revenueAtRisk
        })

    } catch (err) {
        console.error(err)

        return res.status(500).json({
            error: 'Failed to load overview'
        })
    }
})


const getDashboardRecoveries = asyncHandler(async (req, res) => {
    try {
        const userId = req.userId

        const cases = await RecoveryCases.findAll({
            where: {
                user_id: userId
            },
            include: [
                {
                    model: StripeAccountCustomers,
                    required: false,
                    attributes: ["email", "name"]
                }
            ],
            order: [["last_failed_event_at", "DESC"]]
        })


        const formatted = cases.map(c => ({
            id: c.id,
            customer:
                c.StripeAccountCustomer?.email ||
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
            order: [
                ['last_payment_failed_at', 'DESC']
            ]
        })

        const rows = await Promise.all(customers.map(async customer => {

            const recoveryCases = await RecoveryCases.findAll({
                where: {
                    stripe_customer_id: customer.stripe_customer_id,
                    stripe_account_uuid: stripeAccount.id
                }
            })

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
        )

        res.json(rows)

    } catch (err) {
        console.error("getCustomers error:", err)
        return res.status(500).json({ error: "Failed to fetch customers" })
    }
})

const getDashboardAnalytics = asyncHandler(async (req, res) => {
    const userId = req.userId

    try {
        const totalFailures = await RecoveryCases.count({
            where: {
                user_id: userId
            }
        })

        const activeRecoveries = await RecoveryCases.count({
            where: {
                user_id: userId,
                status: 'active'
            }
        })

        const recoveredCases = await RecoveryCases.count({
            where: {
                user_id: userId,
                status: 'recovered'
            }
        })

        const recoveredRevenue = await RecoveryCases.sum(
            'amount_due',
            {
                where: {
                    user_id: userId,
                    status: 'recovered'
                }
            })

        const revenueAtRisk = await RecoveryCases.sum(
            'amount_due',
            {
                where: {
                    user_id: userId,
                    status: 'active'
                }
            })

        const failureReasons = await RecoveryCases.findAll({
            where: {
                user_id: userId
            },
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

        const recoveryRate = totalFailures > 0 ? Number(
            (
                recoveredCases /
                totalFailures
            ) * 100
        ).toFixed(1)
            : 0

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
                    stripe_customer_id:
                        recoveryCase.stripe_customer_id,
                    stripe_account_uuid:
                        recoveryCase.stripe_account_uuid
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
export {
    getDashboard, getDashboardOverview, getDashboardRecoveries,
    getDashboardCustomers, getDashboardAnalytics, getDashboardRecoveryDetail
}
