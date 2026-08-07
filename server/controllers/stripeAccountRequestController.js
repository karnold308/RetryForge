import jwt from "jsonwebtoken"
import { logError } from '../services/loggerService.js'

export function createStripeState(userId) {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    )
}

const handleStripeConnection = ("/api/stripe/connect", (req, res) => {

    const authHeader = req.headers.authorization
    const token = authHeader.split(' ')[1]

    let userId

    try {
        
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.userId = decoded.userId

        userId = req.userId
        const state = createStripeState(userId)

        const stripeUrl =
            `https://connect.stripe.com/oauth/authorize` +
            `?response_type=code` +
            `&client_id=${process.env.STRIPE_CLIENT_ID}` +
            `&scope=read_write` +
            `&redirect_uri=${process.env.BACKEND_URL}${process.env.STRIPE_REDIRECT_URI}` +
            `&state=${state}`

        res.json({
            url: stripeUrl
        })
    } catch (err) {
        // console.log(userId)
        logError({
            source: "stripeAccountRequestController.handleStripeConnection()",
            message: 'Failed to take user to connect stripe page',
            error: err,
            userId: userId ?? null,
            metadata: {}
        })

        res.json({
            url: '/connect/error'
        })
    }
})


export { handleStripeConnection }