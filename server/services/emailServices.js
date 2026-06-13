import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY)


export const sendRecoveryEmail = async ({
    to,
    hostedInvoiceUrl,
    amountDue,
    emailNumber
}) => {

    let emailHeader = ''

    switch (emailNumber) {
        case 1:
            emailHeader = 'Payment Failed'
            break
        case 2:
            emailHeader = 'Reminder'
            break
        case 3:
            emailHeader = 'Final reminder'
            break
        case 4:
            emailHeader = 'Subscription may be interrupted'
            break
        default:
            emailHeader = 'Payment issue'
    }

    return await resend.emails.send({
        from: 'RetryForge <recoveries@retryforge.com>',
        to,
        subject: 'Payment issue with your subscription',
        html: `
            <h2>${emailHeader}</h2>
            <p>
                We were unable to process your recent payment.
            </p>
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
        `
    })
}