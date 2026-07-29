import { User, StripeAccount } from '../models/index.js'
import Stripe from 'stripe'
import jwt from 'jsonwebtoken'
import { encrypt } from '../utils/encryption.js'

const ALGORITHM = 'aes-256-gcm'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const { v4: uuid } = await import('uuid')
const frontEndUrl = process.env.NODE_ENV === 'production' ?
    process.env.retryforge_DATABASE_URL : process.env.FRONT_END_URL

import { HistorySyncService } from '../services/historySyncService.js'

const handleNewAccountConnection = async (req, res) => {
    try {
        const acctCode = req.query.code

        if (!acctCode) {
            return res.redirect(frontEndUrl)

        }

        const decoded = jwt.verify(
            req.query.state,
            process.env.JWT_SECRET
        )

        const userId = decoded.userId

        if (undefined === acctCode) {
            res.redirect(frontEndUrl)
        }

        const tokenResponse = await stripe.oauth.token({
            grant_type: 'authorization_code',
            code: `${acctCode}`,
        })

        const stripeAccountId = await stripe.accounts.retrieve(
            tokenResponse.stripe_user_id
        )

        const encryptedAccessToken = encrypt(
            tokenResponse.access_token
        )

        const encryptedRefreshToken = encrypt(
            tokenResponse.refresh_token
        )

        let stripeAccount = await StripeAccount.findOne({
            where: {
                stripe_account_id: tokenResponse.stripe_user_id
            }
        })

        if (stripeAccount) {
            await stripeAccount.update({
                stripe_account_id: tokenResponse.stripe_user_id,
                access_token_encrypted: encryptedAccessToken,
                refresh_token_encrypted: encryptedRefreshToken,
                scope: tokenResponse.scope,
                connected: Boolean(tokenResponse.stripe_user_id),
                charges_enabled: stripeAccountId.charges_enabled,
                details_submitted: stripeAccountId.details_submitted,
                payouts_enabled: stripeAccountId.payouts_enabled,
                country: stripeAccountId.country,
                disconneted_at: null,
                history_sync_status: 'queued',
                stripe_email: stripeAccountId.email,
                account_type: stripeAccountId.type,
                updated_at: new Date()
            })
        } else {
            stripeAccount = await StripeAccount.create({
                id: uuid(),
                user_id: userId,
                stripe_account_id: tokenResponse.stripe_user_id,
                access_token_encrypted: encryptedAccessToken,
                refresh_token_encrypted: encryptedRefreshToken,
                scope: tokenResponse.scope,
                connected: Boolean(tokenResponse.stripe_user_id),
                charges_enabled: stripeAccountId.charges_enabled,
                details_submitted: stripeAccountId.details_submitted,
                payouts_enabled: stripeAccountId.payouts_enabled,
                country: stripeAccountId.country,
                disconneted_at: null,
                history_sync_status: 'queued',
                stripe_email: stripeAccountId.email,
                account_type: stripeAccountId.type,
                updated_at: new Date()
            })
        }

        HistorySyncService.importFailedInvoices({
            stripeAccount
        }).catch(err => {
            console.error("Background sync failed", err)
        })


        return res.redirect(`${frontEndUrl}/dashboard`)

    } catch (err) {
        console.error(err)
        // TODO: make this front end page
        return res.redirect(`${frontEndUrl}/connect/error`)
    }
}



export { handleNewAccountConnection }
