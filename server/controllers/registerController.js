import User from '../models/User.js'
import crypto from 'crypto'
import { sendRecoveryEmail, sendEmailVerification } from '../services/emailServices.js'


const bcrypt = await import('bcrypt')
const { v4: uuid } = await import('uuid')



const handleNewUser = async (req, res) => {
    const { company, pwd, email } = req.body

    // console.log("handleNewUser start")
    if (!email || !pwd) return res.status(400).json({
        message: 'Email and password are required.',
        data: {
            company: company,
            email: email,
            pwd: pwd,
        }
    })

    // check for duplicate emails in db
    const duplicate = await User.findOne({ where: { email: email } })

    if (duplicate) return res.sendStatus(409) //conflict

    try {
        const token = crypto.randomBytes(32).toString("hex")
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex")
        //encrypt password
        const hashedPwd = await bcrypt.hash(pwd, 10)

        console.log('about to call sendemailverif')
        // send verification email
        // handleSendVerificationEmail(email, process.env.BACKEND_URL, tokenHash)
        const result = sendEmailVerification({
            to: email,
            verifyEmailUrl: `${process.env.BACKEND_URL}/verify-email?token=${token}`
        })

        console.log('sendemailverf result: ' + result)

        // create and store new user
        const newUser = await User.create({
            id: uuid(),
            email: email,
            company: company,
            password_hash: hashedPwd,
            email_verification_token: tokenHash,
            email_verification_expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        })

        // console.log(newUser)
        // console.log("handleNewUser end")
        res.status(201).json({ success: true, message: `New user: '${email}' created. Please check your email.` })
    } catch (err) {
        console.log('email verif error message: ' + err.message)
        res.status(500).json({ 'message': err.message })
    }
}

// function handleSendVerificationEmail(to, backendUrlHost, tokenHash) {
//     const result = sendEmailVerification({
//         to,
//         verifyEmailUrl: `${backendUrlHost}/verify-email?token=${tokenHash}`
//     })
// }


export { handleNewUser }