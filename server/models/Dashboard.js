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


const Dashboard = {}

export default Dashboard
