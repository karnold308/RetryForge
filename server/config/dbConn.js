const { Pool } = require('pg');
const user = process.env.DB_USER;
const pwd = encodeURIComponent(process.env.DB_PWD);
const host = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const port = process.env.DB_PORT;

const pool = new Pool({
    connectionString: `postgresql://${user}:${pwd}@${host}:${port}/${dbName}`
    // ssl: { rejectUnauthorized: false },
});

// const connectDB = async() => {
//     try {
//         const res = await pool.query('SELECT NOW()');
//         console.log('DB connected! DB time: ', res.rows[0])
//     } catch (err) {
//         console.error('DB connection error: ', err.stack);
//     }
// }

module.exports = { pool } 