import dotenv from 'dotenv';
dotenv.config();
import pkg from 'pg';

const { Pool } = pkg;

const connection = new Pool({
  database: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// const connection = new Pool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   ssl: false
// });


console.log('Connected to MySQL database');

export default connection;