import sequelizeConfig from '../config/dbConfig.js'


import { Sequelize, DataTypes, STRING } from 'sequelize'



const RecoveryStrategyStats = sequelizeConfig.define('RecoveryStrategyStats', {
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
    email_step_used: {
        type: DataTypes.NUMBER
    },
    recovery_speed_hours: {
        type: DataTypes.NUMBER
    },
    amount: {
        type: DataTypes.NUMBER
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW'),
    },

}, {
    schema: 'rforge',
    tableName: 'recovery_strategy_stats',
    timestamps: false
})


export default RecoveryStrategyStats