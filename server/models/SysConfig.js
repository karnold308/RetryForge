import sequelizeConfig from '../config/dbConfig.js'
import { Sequelize, DataTypes, DATE } from 'sequelize'



const SysConfig = sequelizeConfig.define('SysConfig', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDv4,
        primaryKey: true
    },
    config_name: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    config_value: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    last_updated_user_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: {
                tableName: 'users',
                schema: 'rforge'
            },
            key: 'id'
        }
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW'),
        allowNull: false,
    },

}, {
    schema: 'rforge',
    tableName: 'sys_config',
    timestamps: false
})

export default SysConfig
