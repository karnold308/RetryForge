const user = process.env.NODE_ENV === 'production' ? process.env.retryforge_PGUSER : process.env.DB_USER;
const pwd = process.env.NODE_ENV === 'production' ? process.env.retryforge_PGPASSWORD : encodeURIComponent(process.env.DB_PWD) ; 
const host = process.env.NODE_ENV === 'production' ? process.env.retryforge_PGHOST : process.env.DB_HOST;
const dbName = process.env.NODE_ENV === 'production' ? process.env.retryforge_PGDATABASE : process.env.DB_NAME;
const port = process.env.DB_PORT;
    

import { Sequelize, DataTypes } from 'sequelize';

const sslConfig = process.env.NODE_ENV === 'production'
  ? `ssl: {
      require: true,
      // Use false to bypass "self-signed certificate" errors in dev
      rejectUnauthorized: false 
    }`
  : ``


const sequelize = new Sequelize(dbName, user, pwd, {
    host: host,
    dialect: 'postgres',
    dialectOptions: {
        sslConfig
  }
});

const StripeAccount = sequelize.define('StripeAccount', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDv4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowedNull: false,
        unique: true,
        references: {
            model: 'USERS',
            key: 'id'
        }
    },
    stripe_account_id: {
        type: DataTypes.STRING,
        allowedNull: true,
        unique: true
    },
    access_token: {
        type: DataTypes.STRING,
        allowedNull: true
    },
    refresh_token: {
        type: DataTypes.STRING,
        allowedNull: true
    },
    scope: {
        type: DataTypes.STRING,
        allowedNull: true
    },
    connected: {
        type: DataTypes.BOOLEAN,
        allowedNull: true
    },
    charges_enabled: {
        type: DataTypes.BOOLEAN,
        allowedNull: true
    },
    details_submitted: {
        type: DataTypes.BOOLEAN,
        allowedNull: true
    },
    payments_enabled: {
        type: DataTypes.BOOLEAN,
        allowedNull: true
    },
    country: {
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
    
}, {
    schema: 'rforge',
    tableName: 'STRIPE_ACCOUNTS',
    timestamps: false
});
export default User ;
 