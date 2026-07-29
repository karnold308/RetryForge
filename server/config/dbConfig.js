import { Sequelize } from 'sequelize';

const user = process.env.NODE_ENV === 'production' ? process.env.retryforge_PGUSER : process.env.DB_USER;
const pwd = process.env.NODE_ENV === 'production' ? process.env.retryforge_PGPASSWORD : encodeURIComponent(process.env.DB_PWD);
const host = process.env.NODE_ENV === 'production' ? process.env.retryforge_PGHOST : process.env.DB_HOST;
const dbName = process.env.NODE_ENV === 'production' ? process.env.retryforge_PGDATABASE : process.env.DB_NAME;
const port = process.env.DB_PORT;

const sequelizeConfig = new Sequelize(
    dbName,
    user,
    pwd,
    {
        host,
        dialect: 'postgres',
        pool: {
            max: 3,
            min: 0,
            idle: 10000,
            acquire: 30000
        },
        dialectOptions: {
            ssl: process.env.NODE_ENV === 'production'
                ? {
                    require: true,
                    rejectUnauthorized: false
                }
                : false
        },
        logging: false
    },
    
);

export default sequelizeConfig;