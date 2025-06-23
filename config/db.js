import dotenv from 'dotenv';
dotenv.config();
import pkg from 'pg';

const { Pool } = pkg;

const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSLMODE === 'disable' ? false : { rejectUnauthorized: false }
});

// const connection = new Pool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   ssl: false
// });
export default connection;

connection.query('SELECT NOW()')
  .then(result => {
    console.log('Connected! Time:', result.rows[0].now);
    connection.end(); // ปิด connection
  })
  .catch(err => {
    console.error('Database error:', err.message);
  });