import sequelizeConfig from '../config/dbConfig.js'


import { Sequelize, DataTypes, DatabaseError } from 'sequelize'



const RecoveryCases = sequelizeConfig.define('RecoveryCases', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDv4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: {
                tableName: 'users',
                schema: 'rforge'
            },
            key: 'id'
        }
    },
    stripe_account_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: {
                tableName: 'stripe_accounts',
                schema: 'rforge'
            },
            key: 'id'
        }
    },
    stripe_customer_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stripe_customer_uuid: {
        type: DataTypes.UUID,
        references: {
            model: {
                tableName: 'stripe_account_customers',
                schema: 'rforge'
            },
            key: 'id'
        }
    },
    stripe_subscription_id: {
        type: DataTypes.STRING
    },
    stripe_invoice_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    amount_due: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'usd',
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'active'
    },
    invoice_created_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    recovery_attempt_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    hosted_invoice_url: {
        type: DataTypes.STRING
    },
    amount_recovered: {
        type: DataTypes.NUMBER
    },
    attempt_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    failure_code: {
        type: DataTypes.STRING
    },
    failure_message: {
        type: DataTypes.STRING
    },
    decline_code: {
        type: DataTypes.STRING
    },
    payment_method_type: {
        type: DataTypes.STRING
    },
    network_decline_code: {
        type: DataTypes.STRING
    },
    last_failure_at: {
        type: DataTypes.DATE
    },
    stripe_next_payment_at: {
        type: DataTypes.DATE
    },
    recovered_at: {
        type: DataTypes.DATE
    },
    recovery_email_sent_count: {
        type: DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0
    },
    recovery_source: {
        type: DataTypes.STRING
    },
    retry_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    last_retry_attempt_at: {
        type: DataTypes.DATE
    },
    last_retry_status: {
        type: DataTypes.STRING
    },
    last_recovery_email_sent_at: {
        type: DataTypes.DATE
    },
    source_event_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    stripe_payment_intent_id: {
        type: DataTypes.STRING
    },
    workflow_step: {
        type: DataTypes.INTEGER
    },
    next_action_at: {
        type: DataTypes.DATE
    },
    first_notified_at: {
        type: DataTypes.DATE
    },
    last_notified_at: {
        type: DataTypes.DATE
    },
    last_event_created_at: {
        type: DataTypes.DATE
    },
    last_payment_attempt_at: {
        type: DataTypes.DATE
    },
    last_failed_event_at: {
        type: DataTypes.DATE
    },
    history_imported_at: {
        type: DataTypes.DATE
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW'),
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW'),
    },

}, {
    schema: 'rforge',
    tableName: 'recovery_cases',
    timestamps: false
})


export default RecoveryCases
