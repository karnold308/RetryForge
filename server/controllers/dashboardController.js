
import { RecoveryCases, StripeAccountCustomers, StripeAccount } from '../models/index.js'
import asyncHandler from 'express-async-handler'
import { Sequelize } from 'sequelize'


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

        const recoveredRevenueResult =
            await RecoveryCases.sum(
                'amount_due',
                {
                    where: {
                        user_id: userId,
                        status: 'recovered'
                    }
                }
            )

        const atRiskCustomers =
            await RecoveryCases.count({
                distinct: true,
                col: 'stripe_customer_id',
                where: {
                    user_id: userId,
                    status: 'active'
                }
            })

        const revenueAtRisk =
            await RecoveryCases.sum(
                'amount_due',
                {
                    where: {
                        user_id: userId,
                        status: 'active'
                    }
                }
            )

        const totalCases =
            failedPayments + recoveredCases

        const recoveryRate =
            totalCases > 0
                ? ((recoveredCases / totalCases) * 100)
                : 0

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

        const customers =
            await StripeAccountCustomers.findAll({
                where: {
                    stripe_account_uuid: stripeAccount.id
                },
                order: [
                    ['last_payment_failed_at', 'DESC']
                ]
            })

        const rows = await Promise.all(
            customers.map(async customer => {

                const recoveryCases =
                    await RecoveryCases.findAll({
                        where: {
                            stripe_customer_id: customer.stripe_customer_id,
                            stripe_account_uuid: stripeAccount.id
                        }
                    })

                const totalAtRisk =
                    recoveryCases.reduce(
                        (sum, rc) =>
                            rc.status === 'active'
                                ? sum + rc.amount_due
                                : sum, 0
                    )

                const recoveredRevenue =
                    recoveryCases.reduce(
                        (sum, rc) =>
                            rc.status === 'recovered'
                                ? sum + rc.amount_due
                                : sum, 0
                    )

                return {
                    id: customer.id,
                    stripeCustomerId: customer.stripe_customer_id,
                    email: customer.email,
                    name: customer.name,
                    phone: customer.phone,
                    activeFailures:
                        recoveryCases.filter(
                            r => r.status === 'active'
                        ).length,
                    recoveredInvoices:
                        recoveryCases.filter(
                            r => r.status === 'recovered'
                        ).length,
                    totalAtRisk,
                    recoveredRevenue,
                    lastFailedAt:
                        customer.last_payment_failed_at
                }
            })
        )

        res.json(rows)


        // const userId = req.userId

        // const customers = await RecoveryCases.findAll({
        //     where: {
        //         user_id: userId
        //     },
        //     attributes: [
        //         'stripe_customer_id',
        //         [Sequelize.fn('SUM', Sequelize.col('amount_due')), 'total_failed_amount'],
        //         [Sequelize.fn('MAX', Sequelize.col('failure_message')), 'last_failure_reason'],
        //         [Sequelize.fn('MAX', Sequelize.col('last_failed_event_at')), 'last_failed_at'],
        //         [Sequelize.fn('COUNT', Sequelize.col('id')), 'failure_count'],
        //         [Sequelize.fn('MAX', Sequelize.col('status')), 'status']
        //     ],
        //     group: ['stripe_customer_id'],
        //     raw: true
        // })

        // const enriched = await Promise.all(
        //     customers.map(async (c) => {
        //         const customerInfo = await StripeAccountCustomers.findOne({
        //             where: {
        //                 stripe_customer_id: c.stripe_customer_id,
        //                 user_id: userId
        //             },
        //             attributes: ['email', 'name', 'phone']
        //         })

        //         return {
        //             stripeCustomerId: c.stripe_customer_id,
        //             name: customerInfo?.name || customerInfo?.email || c.stripe_customer_id,
        //             email: customerInfo?.email || null,
        //             phone: customerInfo?.phone || null,
        //             totalFailedAmount: Number(c.total_failed_amount || 0),
        //             lastFailureReason: c.last_failure_reason,
        //             lastFailedAt: c.last_failed_at,
        //             failureCount: Number(c.failure_count || 0),
        //             status: c.status
        //         }
        //     })
        // )

        // return res.json(enriched)

    } catch (err) {
        console.error("getCustomers error:", err)
        return res.status(500).json({ error: "Failed to fetch customers" })
    }
})


export { getDashboard, getDashboardOverview, getDashboardRecoveries, getDashboardCustomers }
