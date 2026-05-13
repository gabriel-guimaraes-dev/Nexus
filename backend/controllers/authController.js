import pool from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { safeParse } from '../utils/safeParse.js';

const JWT_SECRET = process.env.JWT_SECRET;

export async function login(req, res) {
    try {
        const {username, password} = req.body;
        const result =  await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );

        if(result.rows.length === 0){
            return res.status(400).json({error: 'User not found'});
        }

        const user = result.rows[0];

        const validPassword = await bcrypt.compare(password, user.password);

        if(!validPassword){
            return res.status(400).json({error: 'Invalid password'});
        }

        const token = jwt.sign(
            {id: user.id, username: user.username},
            JWT_SECRET,
            {expiresIn: '24h'}
        );

        return res.json({
            token,
            id: user.id,
            username: user.username,
            gold: user.gold,
            inventory: safeParse(user.inventory, []),
            equipment: safeParse(user.equipment, {})
        });
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export async function register(req, res) {
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

        const user = result.rows[0];

        res.status(201).json({
            id: user.id,
            username: user.username,
            gold: user.gold,
            inventory: safeParse(user.inventory,[]),
            equipment: safeParse(user.equipment,{})
        });
    } catch(error) {
        res.status(500).json({error: error.message});
    }
}

export async function getUserState(req, res) {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            'SELECT id, username, gold, inventory, equipment FROM users WHERE id = $1',
            [userId]
        );

        const user = result.rows[0];

        if(!user){
            return res.status(404).json({error: 'User not found'});
        }
        
        res.json({
            id: user.id,
            username: user.username,
            gold: user.gold,
            inventory: safeParse(user.inventory, []),
            equipment: safeParse(user.equipment, {})
        });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}
