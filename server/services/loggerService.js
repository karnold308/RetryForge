import Stripe from "stripe"
import { ApplicationLogs, User, StripeAccount } from "../models/index.js"
const { v4: uuid } = await import('uuid')

export async function logError({
    source,
    message,
    error,
    userId = null,
    stripeAccountUuid = null,
    metadata = {}
}) {

    try {
        await ApplicationLogs.create({
            id: uuid(),
            level: "error",
            source,
            message,
            user_id: userId,
            stripe_account_uuid: stripeAccountUuid,
            metadata: {
                ...metadata,
                error: error?.message,
                errors: error?.errors,
                parentError: error?.parent,
                stack: error?.stack
            }
        })

    } catch (err) {
        console.error("Logging failed", err)
    }
}