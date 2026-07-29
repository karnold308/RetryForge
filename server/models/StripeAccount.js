import sequelizeConfig from '../config/dbConfig.js'


import { Sequelize, DataTypes } from 'sequelize'



const StripeAccount = sequelizeConfig.define('StripeAccount', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDv4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        references: {
            model: {
                tableName: 'users',
                schema: 'rforge'
            },
            key: 'id'
        }
    },
    stripe_account_id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    access_token_encrypted: {
        type: DataTypes.STRING,
        allowNull: true
    },
    refresh_token_encrypted: {
        type: DataTypes.STRING,
        allowNull: true
    },
    scope: {
        type: DataTypes.STRING
    },
    connected: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    charges_enabled: {
        type: DataTypes.BOOLEAN
    },
    details_submitted: {
        type: DataTypes.BOOLEAN
    },
    payouts_enabled: {
        type: DataTypes.BOOLEAN
    },
    stripe_email: {
        type: DataTypes.STRING
    },
    account_type: {
        type: DataTypes.STRING
    },
    country: {
        type: DataTypes.STRING
    },
    history_sync_status: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'pending'
    },
    history_sync_started_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    history_sync_completed_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    history_sync_error: {
        type: DataTypes.STRING,
        allowNull: true
    },
    initial_sync_complete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    disconnected_at: {
        type: DataTypes.DATE,
        allowNull: true
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
    tableName: 'stripe_accounts',
    timestamps: false
})


export default StripeAccount
