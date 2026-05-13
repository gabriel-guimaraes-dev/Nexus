import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;
const requiredEnv = ['DB_USER', 'DB_HOST', 'DB_NAME', 'DB_PASSWORD', 'DB_PORT'];

requiredEnv.forEach((key) => {
    if(!process.env[key]){
        throw new Error(`Missing environment variable: ${key}`);
    }
});


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT), 
    ssl: process.env.NODE_ENV === 'production' ? {rejectUnauthorized: false} : false
});

export default pool;
