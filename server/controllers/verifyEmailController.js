
import { User } from '../models/index.js'
import { sendEmailVerification } from '../services/emailServices.js'
import crypto from 'crypto'

const frontEndUrl = process.env.FRONT_END_URL

const handleVerifyEmail = async (req, res) => {
    const token = req.query.token

    const incomingHash = crypto.createHash("sha256").update(token).digest("hex")
    const user = await User.findOne({
        where: {
            email_verification_token: incomingHash
        }
    })

    if (!user) {
        return res.redirect(`${frontEndUrl}/login?verified=invalid`)
    }

    // this scenario shouldn't really happen
    if (user.email_verified) {
        return res.redirect(`${frontEndUrl}/login?verified=already`)
    }

    if (user.email_verification_expires < new Date()) {
        return res.redirect(`${frontEndUrl}/resend-verification`)
    }

    await user.update({
        email_verified: true,
        email_verification_token: null,
        email_verification_expires: null
    })

    return res.redirect(`${frontEndUrl}/login?verified=success`)
}

// look up user from email in request, verify user, 
// create and save new token and expiration date, send new email, return message
const handleResendVerificationEmail = async (req, res) => {
    const email = req.body.email

    const user = await User.findOne({
        where: {
            email: email
        }
    })

    if (!user) {
        return res.status(200).json({
            success: true,
            message:
                "If an account exists, we've sent another verification email."
        })
    }

    if (user.email_verified) {
        return res.status(200).json({
            alreadyVerified: true,
            message: "Email is already verified."
        })
    }

    const token = crypto.randomBytes(32).toString("hex")
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex")

    await user.update({
        email_verification_token: tokenHash,
        email_verification_expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        updated_at: new Date()
    })

    try {
        await sendEmailVerification({
            to: email,
            verifyEmailUrl: `${process.env.BACKEND_URL}/verify-email?token=${token}`
        })

        res.status(201).json({ success: true, message: 'If an account exists, we\'ve sent another verification email.' })
    } catch (err) {
        return res.status(500).json({success: false, message: 'There was an issue sending the verification email. Please try again. Email support if the issue continues.'})
    }

}


export { handleVerifyEmail, handleResendVerificationEmail }