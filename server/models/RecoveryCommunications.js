
import sequelizeConfig from '../config/dbConfig.js'


import { Sequelize, DataTypes, STRING } from 'sequelize'



const RecoveryCommunications = sequelizeConfig.define('RecoveryCommunications', {
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
    type: {
        type: DataTypes.STRING
    },
    step: {
        type: DataTypes.INTEGER
    },
    status: {
        type: DataTypes.STRING
    },
    recipient: {
        type: DataTypes.STRING
    },
    provider_id: {
        type: DataTypes.STRING
    },
    sent_at: {
        type: DataTypes.DATE
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW'),
    },

}, {
    schema: 'rforge',
    tableName: 'recovery_Communications',
    timestamps: false
})


export default RecoveryCommunications