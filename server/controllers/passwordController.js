import { User } from '../models/index.js'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import { sendForgotPasswordEmail } from '../services/emailServices.js'

const frontEndUrl = process.env.FRONT_END_URL

const handleResetPassword = async (req, res) => {
    const { token, password } = req.body

    if (!token || !password) {
        return res.status(400).json({
            success: false,
            code: "INVALID_REQUEST",
            message: "Token and password are required."
        })
    }

    const incomingHash = crypto.createHash("sha256").update(token).digest("hex")

    const user = await User.findOne({
        where: {
            password_reset_token: incomingHash
        }
    })

    if (!user) {
        return res.status(400).json({
            success: false,
            code: "RESET_TOKEN_INVALID",
            message: "This password reset link is invalid."
        })
    }

    if (user.password_reset_expires < new Date()) {
        return res.status(400).json({
            success: false,
            code: "RESET_TOKEN_EXPIRED",
            message: "This password reset link has expired."
        })
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash)

    if (passwordMatches) {
        return res.status(400).json({
            success: false,
            code: "PASSWORD_SAME_AS_CURRENT",
            message: "Please choose a different password."
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await user.update({
        password_hash: hashedPassword,
        password_reset_token: null,
        password_reset_expires: null,
        refresh_token: null,
        updated_at: new Date()
    })

    return res.status(200).json({
        success: true,
        message: "Password updated successfully."
    })

}


const handleForgotPassword = async (req, res) => {
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
                "If an account exists, we've sent password reset instructions."
        })
    }

    const token = crypto.randomBytes(32).toString("hex")
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex")

    await user.update({
        password_reset_token: tokenHash,
        password_reset_expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
        updated_at: new Date()
    })

    try {
        const result = await sendForgotPasswordEmail({
            to: email,
            passwordResetUrl: `${frontEndUrl}/reset-password?token=${token}`
        })

        res.status(201).json({ success: true, message: 'If an account exists, we\'ve sent password reset instructions.' })
    } catch (err) {
        console.log('error: ' + err)
        return res.status(500).json({ success: false, message: 'There was an issue sending the password reset instructions email. Please try again. Email support if the issue continues.' })
    }
}


export { handleResetPassword, handleForgotPassword }