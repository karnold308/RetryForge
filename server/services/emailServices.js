import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)
import { logError } from '../services/loggerService.js'

export const sendRecoveryEmail = async ({
    to,
    hostedInvoiceUrl,
    amountDue,
    emailNumber
}) => {

    let emailHeader = ''
    let emailBodyText = ''

    switch (emailNumber) {
        case 1:
            emailHeader = 'Payment attempt unsuccessful'
            break
        case 2:
            emailHeader = 'Reminder'
            emailBodyText = 'We tried charging your card again today, but it still did not go through.'
            break
        case 3:
            emailHeader = 'Final reminder'
            emailBodyText = 'We made another attempt, but your payment still could not be processed.'
            break
        case 4:
            emailHeader = 'Subscription may be interrupted'
            emailBodyText = 'This was our final automatic attempt. Please update your payment method to avoid interruption.'
            break
        default:
            emailHeader = 'Payment issue'
    }



    // console.log('email header: ' + emailHeader)

    try {
        return await resend.emails.send({
            from: 'RetryForge <recoveries@notifications.retryforge.com>',
            to,
            subject: 'Action needed for your subscription payment',
            replyTo: 'support@retryforge.com',
            html: `
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html>
                <head></head>
                <body>
                    <h2>${emailHeader}</h2>
                    <p>
                        We were unable to process your recent payment. Please make sure there is a default payment method.
                    </p>
                    <p>
                        ${emailBodyText}
                    <p>
                        Amount Due:
                        <strong>$${amountDue}</strong>
                    </p>
                    <p>Update your payment method:</p>
                    <p>
                        <a href="${hostedInvoiceUrl}">
                            Review payment details
                        </a>
                    </p>
                    <hr>
                    <p>
                        This email was sent by RetryForge on behalf of your subscription provider.
                    </p>
                    <p>
                        RetryForge helps businesses recover failed subscription payments.
                    </p>
                </body>

            </html>
        `
        })

    } catch (err) {
        await logError({
            source: "emailServices.sendRecoveryEmail()",
            message: "Error sending recovery email",
            error: err,
            metadata: { emailTo: to, emailNumber: emailNumber, hostedInvoiceUrl: hostedInvoiceUrl }
        })

        throw err
    }
}



export const sendEmailVerification = async ({
    to,
    verifyEmailUrl
}) => {


    // console.log('in sendEmailVerification******************* verifyEmailUrl: ' + verifyEmailUrl)
    try {
        return await resend.emails.send({
            from: 'RetryForge <welcome@notifications.retryforge.com>',
            to,
            subject: 'Verify your email',
            replyTo: 'support@retryforge.com',
            html: `
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html>
                <head></head>
                <body>
                    <h2>Welcome to RetryForge!</h2>
                    <p>
                        Click below to verify your email.
                    </p>
                    <p>
                        <a href="${verifyEmailUrl}">
                            Verify Email
                        </a>
                    </p>
                    <p>
                        This link expires in 24 hours.
                    </p>
                    <hr>
                    <p>
                        RetryForge helps businesses recover failed subscription payments.
                    </p>
                </body>
            </html>
        `
        })
    } catch (err) {
        await logError({
            source: "emailServices.sendEmailVerification()",
            message: "Error sending email verification email",
            error: err,
            metadata: { emailTo: to, verifyEmailUrl: verifyEmailUrl }
        })

        throw err
    }
}



export const sendForgotPasswordEmail = async ({
    to,
    passwordResetUrl
}) => {

    try {
        return await resend.emails.send({
            from: 'RetryForge <password-reset@notifications.retryforge.com>',
            to,
            subject: 'Reset your RetryForge password',
            replyTo: 'support@retryforge.com',
            html: `
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html>
                <head></head>
                <body>
                    <h3>You've requested to reset your password</h3>
                    <p>
                        Click below to reset your password.
                    </p>
                    <p>
                        <a href="${passwordResetUrl}">
                            Reset password
                        </a>
                    </p>
                    <p>
                        This link expires in 1 hour.
                    </p>
                    <hr>
                    <p>
                    RetryForge helps businesses recover failed subscription payments.
                    </p>
                </body>
            </html>
        `
        })
    } catch (err) {
        await logError({
            source: "emailServices.sendForgotPasswordEmail()",
            message: "Error sending forgot password email",
            error: err,
            metadata: { emailTo: to, passwordResetUrl: passwordResetUrl }
        })

        throw err
    }
}
