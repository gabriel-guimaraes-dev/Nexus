import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../db.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const {username, password} = req.body;

        const existingUser = await pool.query( 'SELECT * FROM users WHERE username = $1', [username]);

        if(existingUser.rows.length > 0) {
            return res.status(400).json({error: 'Username Already Exists'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(`
            INSERT INTO users (username, password)
            VALUES ($1, $2)
            RETURNING id, username, gold, inventory, equipment`,
        [username, hashedPassword]);

        res.status(201).json(result.rows[0]);
    } catch(error) {
        res.status(500).json({error: error.message});
    }
});

router.post('/login', async (req, res) => {
    try {
        const {username, password} = req.body;

        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if(result.rows.length === 0) {
            return res.status(400).json({
                error: 'User not found'
            });
        }

        const user = result.rows[0];

        const validPassword = await bcrypt.compare(password, user.password);

        if(!validPassword) {
            return res.status(400).json({error: 'Invalid password'});
        }

        res.json({
            id: user.id,
            username: user.username,
            gold: user.gold,
            inventory: user.inventory || [],
            equipment: user.equipment || {}
        });
    } catch(error) {
        res.status(500).json({
            error: error.message
        });
    }
});

router.post('/user/save', async(req, res) => {
    try {
        const {id, gold, inventory, equipment} = req.body;

        await pool.query(`
            UPDATE users
            SET gold = $1,
                inventory = $2,
                equipment = $3
            WHERE id = $4
            `,
            [
                gold, JSON.stringify(inventory), JSON.stringify(equipment), id
            ]
        );

        res.json({ message: 'User Saved Successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Save failed'});
    }
});

export default router;
