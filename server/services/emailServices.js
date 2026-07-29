import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

export const sendRecoveryEmail = async ({
    to,
    hostedInvoiceUrl,
    amountDue,
    emailNumber
}) => {

    let emailHeader = ''
    let emailBodyText = ''
    console.log('start sendRecoveryEmail')
    // console.log('to: ' + to)

    switch (emailNumber) {
        case 1:
            emailHeader = 'Payment Failed'
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

    return await resend.emails.send({
        from: 'RetryForge <recoveries@notifications.retryforge.com>',
        to,
        subject: 'Payment issue with your Stripe subscription',
        html: `
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html>
                <head></head>
                <body>
                    <h2>${emailHeader}</h2>
                    <p>
                        We were unable to process your recent payment.
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
                            Pay Invoice
                        </a>
                    </p>
                </body>

            </html>
        `
    })
}



export const sendEmailVerification = async ({
    to,
    verifyEmailUrl
}) => {

    return await resend.emails.send({
        from: 'RetryForge <welcome@notifications.retryforge.com>',
        to,
        subject: 'Verify your email',
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
                </body>
            </html>
        `
    })
}



export const sendForgotPasswordEmail = async ({
    to,
    passwordResetUrl
}) => {

    return await resend.emails.send({
        from: 'RetryForge <password-reset@notifications.retryforge.com>',
        to,
        subject: 'Reset your RetryForge password',
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
                </body>
            </html>
        `
    })
}
