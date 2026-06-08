import User from './User.js'
import StripeAccount from './StripeAccount.js'
import RecoveryCases from './RecoveryCases.js'
import WebhookEvents from './WebhookEvents.js'
import StripeAccountCustomers from './StripeAccountCustomers.js'



User.hasOne(StripeAccount, {
    foreignKey: 'user_id',
    as: 'stripeAccount'
});

StripeAccount.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});



User.hasMany(RecoveryCases, {
    foreignKey: 'user_id',
    as: 'recoveryCases'
})

RecoveryCases.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
})



StripeAccount.hasMany(RecoveryCases, {
    foreignKey: 'stripe_account_uuid',
    sourceKey: 'id',
    as: 'recoveryCases'
})

RecoveryCases.belongsTo(StripeAccount, {
    foreignKey: 'stripe_account_uuid',
    targetKey: 'id',
    as: 'stripeAccount'
})



StripeAccount.hasMany(WebhookEvents, {
    foreignKey: 'stripe_account_uuid',
    sourceKey: 'id',
    as: 'webhookEvents'
})


WebhookEvents.belongsTo(StripeAccount, {
    foreignKey: 'stripe_account_uuid',
    targetKey: 'id',
    as: 'stripeAccount'
})




User.hasMany(StripeAccountCustomers, {
    foreignKey: 'user_id',
    sourceKey: 'id',
    as: 'stripeAccountCustomers'
})

StripeAccountCustomers.belongsTo(User, {
    foreignKey: 'user_id',
    targetKey: 'id',
    as: 'user'
})

StripeAccount.hasMany(StripeAccountCustomers, {
    foreignKey: 'stripe_account_uuid',
    sourceKey: 'id',
    as: 'stripeAccountCustomers'
})

StripeAccountCustomers.belongsTo(StripeAccount, {
    foreignKey: 'stripe_account_uuid',
    targetKey: 'id',
    as: 'stripeAccount'
})

RecoveryCases.belongsTo(StripeAccountCustomers, {
    foreignKey: "stripe_customer_id",
    targetKey: "stripe_customer_id"
})


export { User, StripeAccount, RecoveryCases, WebhookEvents, StripeAccountCustomers }