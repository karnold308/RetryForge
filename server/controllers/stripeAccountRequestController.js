import jwt from "jsonwebtoken"

export function createStripeState(userId) {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: "10m" }
    )
}

const handleStripeConnection = ("/api/stripe/connect", (req, res) => {

    const authHeader = req.headers.authorization
    const token = authHeader.split(' ')[1]

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.userId = decoded.userId

    const userId = req.userId

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
})


export { handleStripeConnection }