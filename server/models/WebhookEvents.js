import sequelizeConfig from '../config/dbConfig.js'


import { Sequelize, DataTypes } from 'sequelize'



const WebhookEvents = sequelizeConfig.define('WebhookEvents', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDv4,
        primaryKey: true
    },
    stripe_event_id: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    event_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stripe_account_uuid: {
        type: DataTypes.UUID,
        allowNull: true
    },
    processed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    processing_error: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    received_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW')
    },
    processed_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    failure_code: {
        type: DataTypes.STRING
    },
    failure_message: {
        type: DataTypes.STRING
    },
    charge_created_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    raw_payload: {
        type: DataTypes.JSONB
    },

}, {
    schema: 'rforge',
    tableName: 'webhook_events',
    timestamps: false
})


export default WebhookEvents