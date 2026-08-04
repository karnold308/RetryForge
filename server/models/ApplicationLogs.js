import sequelizeConfig from '../config/dbConfig.js'
import { Sequelize, DataTypes, DATE } from 'sequelize'



const ApplicationLogs = sequelizeConfig.define('ApplicationLogs', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDv4,
        primaryKey: true
    },
    level: {
        type: DataTypes.STRING,
        allowNull: true
    },
    source: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    metadata: {
        type: DataTypes.JSONB,
        allowNull: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: true,
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
        allowNull: true,
        references: {
            model: {
                tableName: 'stripe_accounts',
                schema: 'rforge'
            },
            key: 'id'
        }
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
    }
}, {
    schema: 'rforge',
    tableName: 'application_logs',
    timestamps: false
}

)

export default ApplicationLogs