import sequelizeConfig from '../config/dbConfig.js'
import { DataTypes } from 'sequelize'

const StripeCustomerSnapshots = sequelizeConfig.define('StripeCustomerSnapshots', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    stripe_customer_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
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

    metadata: {
        type: DataTypes.JSONB
    },
    source_event_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    event_type: {
        type: DataTypes.STRING
    }
}, {
    schema: 'rforge',
    tableName: 'stripe_customer_snapshots',
    timestamps: false
})

export default StripeCustomerSnapshots