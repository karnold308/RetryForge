import sequelizeConfig from '../config/dbConfig.js';
import { Sequelize, DataTypes } from 'sequelize';


const User = sequelizeConfig.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDv4,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    company: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    refresh_token: {
        type: DataTypes.STRING,
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
    roles: {
        type: DataTypes.JSONB(DataTypes.NUMBER),
        allowNull: false,
        defaultValue: [9999]

    },

}, {
    schema: 'rforge',
    tableName: 'USERS',
    timestamps: false
});
export default User;
