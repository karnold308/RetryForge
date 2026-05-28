import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const { v4: uuid } = await import('uuid');

const handleNewAccountConnection = async (req, res) => {
    const acctCode = req.query.code;

    const frontEndUrl = process.env.NODE_ENV === 'production' ?
        process.env.retryforge_DATABASE_URL : process.env.FRONT_END_URL;



    console.log("here: " + req.query.code);
    console.log("sk: " + process.env.STRIPE_SECRET_KEY)

    if (undefined === acctCode) {
        res.redirect(frontEndUrl);
    }


    const tokenResponse = await stripe.oauth.token({
        grant_type: 'authorization_code',
        code: `${acctCode}`,
    });


    const account = await stripe.accounts.retrieve(
        tokenResponse.stripe_user_id
    );

    var connected_account_id = tokenResponse.stripe_user_id;

    console.log("acctid: " + connected_account_id);

    const encryptedAccessToken = encrypt(
        tokenResponse.access_token
    );

    const encryptedRefreshToken = encrypt(
        tokenResponse.refresh_token
    );

    res.redirect(frontEndUrl + '/dashboard');
}


export { handleNewAccountConnection }