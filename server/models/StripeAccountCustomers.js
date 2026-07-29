import sequelizeConfig from '../config/dbConfig.js'
import { DataTypes } from 'sequelize'

const StripeAccountCustomers = sequelizeConfig.define('StripeAccountCustomers', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    stripe_customer_id: {
        type: DataTypes.STRING,
        allowNull: false
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
    user_id: {
        type: DataTypes.UUID,
        allowNull: true,
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
        allowNull: true,
        references: {
            model: {
                tableName: 'stripe_accounts',
                schema: 'rforge'
            },
            key: 'id'
        }
    },
    last_invoice_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    last_payment_failed_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    total_failed_payments: {
        type: DataTypes.INTEGER,
        allowNull: true,
        default: 0
    },
    total_recovered_revenue: {
        type: DataTypes.NUMBER,
        allowNull: true,
        default: 0
    },
    metadata: {
        type: DataTypes.JSONB,
        allowNull: true
    },
    created_at_stripe: {
        type: DataTypes.DATE
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    schema: 'rforge',
    tableName: 'stripe_account_customers',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: [
                'stripe_customer_id',
                'stripe_account_uuid'
            ]
        }
    ]
})

export default StripeAccountCustomers