import { Pool } from 'pg';
const user = process.env.DB_USER;
const pwd = encodeURIComponent(process.env.DB_PWD);
const host = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const port = process.env.DB_PORT;
import dotenv from 'dotenv';



const connectionString = process.env.NODE_ENV === 'production'
  ? process.env.retryforge_DATABASE_URL
  : `postgresql://${user}:${pwd}@${host}:${port}/${dbName}`

const poolConfig = process.env.NODE_ENV === 'production'
  ? {
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    },
  }
  : {
    connectionString: connectionString
  };

const pool = new Pool(poolConfig);

// pool.connect((err) => {
//     if (err)throw err
//     console.log("connect to postgresql successful")
// })

// async function getData() {
//   const client = await pool.connect();
//   try {
//     const { rows } = await client.query('SELECT * FROM posts');
//     return rows;
//   } finally {
//     client.release();
//   }
// }

// export default async function Page() {
//   const data = await getData();
//   return (
//     <div>
//       {data.map((post, index) => (
//         <div key={index}>
//           <h2>{post.title}</h2>
//           <p>{post.content}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

// const pool = new Pool({
//     connectionString: `postgresql://${user}:${pwd}@${host}:${port}/${dbName}`
//     // ssl: { rejectUnauthorized: false },
// });

// const connectDB = async() => {
//     try {
//         const res = await pool.query('SELECT NOW()');
//         console.log('DB connected! DB time: ', res.rows[0])
//     } catch (err) {
//         console.error('DB connection error: ', err.stack);
//     }
// }

export { pool } 