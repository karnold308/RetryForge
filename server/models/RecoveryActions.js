import sequelizeConfig from '../config/dbConfig.js'


import { Sequelize, DataTypes, STRING } from 'sequelize'



const RecoveryActions = sequelizeConfig.define('RecoveryActions', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDv4,
        primaryKey: true
    },
    recovery_case_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: {
                tableName: 'recovery_cases',
                schema: 'rforge'
            },
            key: 'id'
        }
    },
    action_type: {
        type: DataTypes.STRING
    },
    details: {
        type: DataTypes.JSONB
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
    tableName: 'recovery_actions',
    timestamps: false
})


export default RecoveryActions