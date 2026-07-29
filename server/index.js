const dotenv = await import('dotenv')
dotenv.default.config()
import express from 'express'
const app = express()
const path = import('path')
import cors from 'cors'
import { errorHandler } from './middleware/errorHandler.js'
import { logger } from './middleware/logEvents.js'
import { corsOptions } from'./config/corsOptions.js'
import { credentials } from './middleware/credentials.js'
import { pool } from './config/dbConn.js'
import cookieParser from 'cookie-parser'
import dns from 'node:dns'

dns.setServers(['8.8.8.8', '8.8.4.4'])


import { router as register } from './routes/register.js'
import { router as auth } from './routes/auth.js'
import { router as connect } from './routes/api/connect.js'
import { router as disconnect } from './routes/api/disconnect.js'
import { router as dashboard } from './routes/api/dashboard.js'
import { router as stripeAccountRequest } from './routes/api/stripeAccountRequest.js'
import { router as meRoute } from './routes/api/me.js'
import { router as stripeRefresh } from './routes/api/stripeRefresh.js'
import { router as stripeWebhook } from './routes/api/stripeWebhook.js'
import { router as stripeHistorySync } from './routes/api/stripeHistorySync.js'
import { router as verifyEmail } from './routes/verifyEmail.js'
import { router as resendVerificationEmail } from './routes/resendVerificationEmail.js'
import { router as forgotPassword } from './routes/forgotPassword.js'
import { router as resetPassword } from './routes/resetPassword.js'
import { router as jobsProcessor } from './routes/api/jobsProcessor.js'


import { verifyJWT } from './middleware/verifyJWT.js'

const PORT = process.env.PORT || 3500



// custom middleware logger
app.use(logger)

// handle options credentials check - before CORS
// and fetch cookies credentials reqiurement
app.use(credentials)

// cross origin resource sharing
app.use(cors(corsOptions))

// built-in middleware to handle urlencoded data,
// in other words, form-data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }))

// app.get("/env-test", (req, res) => {
//     res.json({
//         hasResendKey: !!process.env.RESEND_API_KEY,
//         nodeEnv: process.env.NODE_ENV,
//         backendUrl: !!process.env.BACKEND_URL,
//     });
// });

app.use('/api/stripe', stripeWebhook)

// built-in middleware for json
app.use(express.json())
// middleware for cookies
app.use(cookieParser())
// serve static files
// app.use(express.static(path.join(__dirname, '/public')))
// routes
// works like waterfall, everything after each line uses
// what was setup above it
// app.use('/', import('./routes/root'))
app.use('/register', register)
app.use('/auth', auth)
app.use('/connect/callback', connect)
app.use('/verify-email', verifyEmail)
app.use('/resend-verification', resendVerificationEmail)
app.use('/forgot-password', forgotPassword)
app.use('/reset-password', resetPassword)
app.use('/api/jobs', jobsProcessor)


// dont want JWT on register or auth
app.use(verifyJWT)

app.use('/api/stripe/connect', stripeAccountRequest)
app.use('/api/dashboard', dashboard)
app.use('/api/me', meRoute)
app.use('/api/stripe/disconnect', disconnect)
app.use('/api/stripe/refresh', stripeRefresh)
app.use('/api/stripe/historySync', stripeHistorySync)


// app.use('/employees', import('./routes/api/employees'))
// Regex no longer works like this in Express 5
// app.get('^/$|/index(.html)?', (req, res) => {
/* app.get('/', (req, res) => {
    // res.sendFile('./views/index.html', { root: __dirname })
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
})
app.get('/new-page.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'))
})
app.get('/old-page.html', (req, res) => {
    res.redirect(301, '/new-page.html') // 302 by default, need 301
})
 */
/* 
 
// chain route handlers
const one = (req, res, next) => {
    console.log('one')
    next()
}
const two = (req, res, next) => {
    console.log('two')
    next()
}
const three = (req, res, next) => {
    console.log('three')
    res.send('finished')
}
app.get('/chain', [one, two,three])
 
 */
// app.use('/')
/* app.all('{*splat}', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json( {error: "404 page not found" })
    } else {
        res.type('txt').send("404 not found")
    }
}) 
    */

app.use(errorHandler)

pool.connect()
    .then(() => {
        console.log('Connected to postgresql DB')
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

    }).catch((err) => {
        console.log(err)
        console.log("can't connect to db")
    })


export default app
