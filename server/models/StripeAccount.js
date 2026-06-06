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
                tableName: 'USERS',
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
