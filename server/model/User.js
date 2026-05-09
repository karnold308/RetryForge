const user = process.env.DB_USER;
const pwd = encodeURIComponent(process.env.DB_PWD); 
const host = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const port = process.env.DB_PORT;

const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize(dbName, user, pwd, {
    host: 'localhost',
    dialect: 'postgres'
});

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDv4,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowedNull: false,
        unique: true
    },
    company: {
        type: DataTypes.STRING,
        allowedNull: true,
        unique: false
    },
    password_hash: {
        type: DataTypes.STRING,
        allowedNull: false,
    },
    stripe_account_id: {
        type: DataTypes.STRING,
        allowedNull: true
    },
    refresh_token: {
        type: DataTypes.STRING,
        allowedNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW'), 
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW'), 
    },
    // roles: {
    //     User: {
    //         type: Number,
    //         default: 2001
    //     }, 
    //     Editor: Number,
    //     Admin: Number
    // },
    
}, {
    schema: 'rforge',
    tableName: 'USERS',
    timestamps: false
});

module.exports = User;
 