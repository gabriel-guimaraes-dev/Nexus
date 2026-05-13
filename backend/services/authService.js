import pool from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { safeParse } from '../utils/safeParse.js';

const JWT_SECRET = process.env.JWT_SECRET || 'chave_mestra';

export async function loginUser({ username, password }) {
    if (!username || !password) {
        const error = new Error('Username and password required');
        error.status = 400;
        throw error;
    }

    const result = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
    );

    if (result.rows.length === 0) {
        const error = new Error('User not found');
        error.status = 400;
        throw error;
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
        const error = new Error('Invalid password');
        error.status = 400;
        throw error;
    }

    const token = jwt.sign(
        {
            id: user.id,
            username: user.username
        },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    return {
        token,
        id: user.id,
        username: user.username,
        gold: user.gold,
        inventory: safeParse(user.inventory, []),
        equipment: safeParse(user.equipment, {})
    };
}