import User from './User.js'
import StripeAccount from './StripeAccount.js'
import RecoveryCases from './RecoveryCases.js'
import WebhookEvents from './WebhookEvents.js'
import StripeAccountCustomers from './StripeAccountCustomers.js'
import RecoveryActions from './RecoveryActions.js'
import StripeCustomerSnapshots from './StripeCustomerSnapshots.js'
import RecoveryCommunications from './RecoveryCommunications.js'
import RecoveryStrategyStats from './RecoveryStrategyStats.js'
import CronJobAudit from './CronJobAudit.js'


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


StripeAccountCustomers.hasMany(RecoveryCases, {
    foreignKey: 'stripe_customer_id',
    sourceKey: 'stripe_customer_id',
    as: 'recoveryCases'
})

RecoveryCases.belongsTo(StripeAccountCustomers, {
    foreignKey: "stripe_customer_id",
    targetKey: "stripe_customer_id",
    as: 'stripeAccountCustomer'
})


RecoveryCases.hasMany(RecoveryActions, {
    foreignKey: 'recovery_case_uuid',
    sourceKey: 'id',
    as: 'recoveryActions'
})

RecoveryActions.belongsTo(RecoveryCases, {
    foreignKey: "recovery_case_uuid",
    targetKey: "id",
    as: 'recoveryCases'
})


StripeAccount.hasMany(StripeCustomerSnapshots, {
    foreignKey: 'stripe_account_uuid',
    sourceKey: 'id',
    as: 'stripeCustomerSnapshots'
})



StripeCustomerSnapshots.belongsTo(StripeAccount, {
    foreignKey: "stripe_account_uuid",
    targetKey: "id",
    as: 'stripeAccount'
})


RecoveryCases.hasMany(RecoveryCommunications, {
    foreignKey: 'recovery_case_uuid',
    sourceKey: 'id',
    as: 'recoveryCommunications'
})

RecoveryCommunications.belongsTo(RecoveryCases, {
    foreignKey: "recovery_case_uuid",
    targetKey: "id",
    as: 'recoveryCases'
})

RecoveryCases.hasMany(RecoveryStrategyStats, {
    foreignKey: 'recovery_case_uuid',
    sourceKey: 'id',
    as: 'recoveryStrategyStats'
})

RecoveryStrategyStats.belongsTo(RecoveryCases, {
    foreignKey: "recovery_case_uuid",
    targetKey: "id",
    as: 'recoveryCases'
})

export {
    User, StripeAccount,
    RecoveryCases, WebhookEvents,
    StripeAccountCustomers, RecoveryActions,
    StripeCustomerSnapshots, RecoveryCommunications,
    RecoveryStrategyStats, CronJobAudit,


}