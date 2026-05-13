const user = process.env.NODE_ENV === 'production' ? process.env.retryforge_PGHOST : process.env.DB_USER;

const pwd = process.env.NODE_ENV === 'production' ? encodeURIComponent(process.env.retryforge_PGPASSWORD) : encodeURIComponent(process.env.DB_PWD) ; 
const host = process.env.NODE_ENV === 'production' ? process.env.retryforge_PGHOST : process.env.DB_HOST;
const dbName = process.env.NODE_ENV === 'production' ? process.env.retryforge_PGDATABASE : process.env.DB_NAME;
const port = process.env.DB_PORT;
    

import { Sequelize, DataTypes } from 'sequelize';
const sequelize = new Sequelize(dbName, user, pwd, {
    host: host,
    dialect: 'postgres',
    dialectOptions: {
    ssl: {
      require: true,
      // Use false to bypass "self-signed certificate" errors in dev
      rejectUnauthorized: false 
    }
  }
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
    tableName: 'users',
    timestamps: false
});
export default User ;
 