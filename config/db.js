import dotenv from 'dotenv';
dotenv.config();
import { neon } from '@neondatabase/serverless';

console.log('DB URL:', process.env.DATABASE_URL);
const sql = neon(process.env.DATABASE_URL);

export default sql;
