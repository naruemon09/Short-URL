import dotenv from 'dotenv'
dotenv.config()
import pkg from 'pg';

const { Pool } = pkg;

const connection = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: false,
  });


  async function testConnection() {
  try {
    const res = await connection.query('SELECT NOW()')
    console.log('Connected to PostgreSQL at:', res.rows[0].now)
  } catch (error) {
    console.error('Error connecting to database:', error)
  }
}

testConnection()

console.log('Connected to database');

export default connection;