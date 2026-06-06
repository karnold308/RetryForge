import sequelizeConfig from '../config/dbConfig.js'


import { Sequelize, DataTypes } from 'sequelize'



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
                tableName: 'USERS',
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
    stripe_subscription_id: {
        type: DataTypes.STRING
    },
    stripe_invoice_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    amount_due: {
        type: DataTypes.INTEGER,
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
    recovered_at: {
        type: DataTypes.DATE
    },
    recovery_email_sent_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    source_event_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    last_charge_attempt_at: {
        type: DataTypes.DATE
    },
    last_failed_event_at: {
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
