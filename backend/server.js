import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import pool from './db.js';
import authRoutes from './routes/authRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import storeRoutes from './routes/storeRoutes.js';

dotenv.config();

const app = express();

app.use(cors({
    origin: ['https://verdant-faun-14056a.netlify.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

//routes
app.use('/auth', authRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/store', storeRoutes);

//test route
app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json(result.rows[0]);
    } catch(error) {
        res.status(500).json({error: error.message});
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
});
