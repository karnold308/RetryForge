import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'


const handleLogin = asyncHandler(async (req, res) => {
    const { email, pwd } = req.body
    if (!email || !pwd) return res.status(400).json({ 'message': 'Email and password are required.' })

    // find user
    const foundUser = await User.findOne({ where: { email: email } })

    if (!foundUser) return res.sendStatus(401) // unauthorized

    // evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password_hash)

    if (match) {
        if (!foundUser.email_verified) {
            return res.status(403).json({
                success: false,
                code: "EMAIL_NOT_VERIFIED",
                message:
                    "Please verify your email before signing in."
            })
        }

        const roles = Object.values(foundUser.roles).filter(Boolean)

        // create JWTs, access and refresh 
        const accessToken = jwt.sign(
            {
                "userId": foundUser.id,
                "email": foundUser.email,
                "roles": roles
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' } // TODO: make this longer in prod, maybe 15 minutes
        )

        const refreshToken = jwt.sign(
            {
                "userId": foundUser.id,
                "email": foundUser.email,
                "roles": foundUser.roles
            },
            process.env.REFRESH_TOKEN_SECRET,
            // { expiresIn: '1d' }
            { expiresIn: '1d' } // TODO make longer
        )
        // saving refreshToken with current user
        foundUser.refresh_token = refreshToken

        const result = await foundUser.save()

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        }) // one day. could be longer if needed or wanted

        res.json({ roles, accessToken })

    } else {
        res.sendStatus(401)
    }
})

const handleRefresh = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })
    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })
            const foundUser = await User.findOne({ where: { email: decoded.email, refresh_token: refreshToken } })

            if (!foundUser) return res.status(401).json({ messsage: "Unauthorized" })

            // console.log("roles: " + foundUser.roles)
            const accessToken = jwt.sign({
                "userId": foundUser.id,
                "email": foundUser.email,
                "roles": foundUser.roles
            },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' } // TODO make longer
            )
            // console.log('acctoken: ' + accessToken)
            res.json({ userId: foundUser.id, email: foundUser.email, roles: foundUser.roles, accessToken })
        })
    )
}


const handleLogout = async (req, res) => {
    // const cookies = req.cookies
    // if (!cookies?.jwt) return res.sendStatus(204) // no content
    // res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    // res.json({ message: "Cookie cleared" })

    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) // no content
    const refreshToken = cookies.jwt

    // is refresh token in db
    const foundUser = await User.findOne({ where: { refresh_token: refreshToken } })

    if (!foundUser) {
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'None',
            secure: true
        })
        return res.sendStatus(204) // no content
    }

    // delete refresh token in db
    foundUser.refresh_token = ''
    const result = await foundUser.save()
    // console.log(result)

    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: true
    })

    res.sendStatus(204)
}


export { handleLogin, handleRefresh, handleLogout }
