import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);

app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json(result.rows[0]);
    } catch(error) {
        res.status(500).json({error: error.message});
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server Running on port ${process.env.PORT}`);
});
