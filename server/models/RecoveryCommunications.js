
import sequelizeConfig from '../config/dbConfig.js'


import { Sequelize, DataTypes, STRING, JSONB } from 'sequelize'



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
    provider_payload: {
        type: DataTypes.JSONB
    },
    sent_at: {
        type: DataTypes.DATE
    },
    opened_at: {
        type: DataTypes.DATE
    },
    clicked_at: {
        type: DataTypes.DATE
    },
    metadata: {
        type: JSONB
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW'),
    },

}, {
    schema: 'rforge',
    tableName: 'recovery_communications',
    timestamps: false
})


export default RecoveryCommunications