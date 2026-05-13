import pool from '../db.js';
import {safeParse} from '../utils/safeParse.js';


//buy store
export async function buyStoreItem(req, res) {
    try {
        const {cart} = req.body;
        const userId = req.user.id;

        if(!Array.isArray(cart) || cart.length === 0) {
            return res.status(400).json({error: 'Invalid cart'});
        }

        const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

        if(result.rows.length === 0) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        const user = result.rows[0];
        let inventory = safeParse(user.inventory, []);
        let gold = user.gold;

        const totalCost = cart.reduce((sum, cartItem) => {
            const price = Number(cartItem?.item?.gold || 0);
            const qty = Number(cartItem?.quantity || 0);

            return sum + (price * qty);
        }, 0);

        if(gold < totalCost) {
            return res.status(400).json({
                error: 'Not enough gold'
            });
        }

        gold -= totalCost;

        cart.forEach(cartEntry => {
            const existingItem = inventory.find(inv => inv.item.name == cartEntry.item.name);

            if(existingItem) {
                existingItem.quantity += cartEntry.quantity;
            } else {
                inventory.push(cartEntry);
            }
        });

        await pool.query(`
            UPDATE users
            SET gold = $1,
                inventory = $2
            WHERE id = $3
            `, [
            gold, JSON.stringify(inventory), userId
        ]);

        res.json({
            gold, inventory, equipment: safeParse(user.equipment || {})
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Purchase failed'});
    }
}
