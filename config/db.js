import dotenv from 'dotenv';
dotenv.config();
import pkg from 'pg';

const { Pool } = pkg;

const connection = new Pool({
  connectionString: process.env.DATABASE_URL 
});

console.log('Connected to MySQL database');

export default connection;