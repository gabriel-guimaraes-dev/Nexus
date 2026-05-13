import pool from '../db.js';
import {safeParse} from '../utils/safeParse.js';

export async function equipItem(req, res) {
    try {
        const userId = req.user.id;
        const { itemName } = req.body;

        const result = await pool.query(
            'SELECT inventory, equipment FROM users WHERE id = $1',
            [userId]
        );

        if(result.rows.length === 0){
            return res.status(404).json({error: 'User not found'});
        }

        const user = result.rows[0];

        let inventory = safeParse(user.inventory, []);
        let equipment = safeParse(user.equipment, {});

        const itemEntry = inventory.find(i => i.item.name === itemName);

        if (!itemEntry) {
            return res.status(400).json({ error: 'Item not in inventory' });
        }

        const slotMap = {
            helmet: 'head',
            chest: 'chest',
            leggings: 'legs',
            shield: 'leftWeapon',
            sword: 'rightWeapon',
            spear: 'rightWeapon',
            bow: 'rightWeapon',
            dagger: 'rightWeapon',
            arms: 'arms'
        };

        const slot = slotMap[itemEntry.item.specification];

        if (!slot) {
            return res.status(400).json({ error: 'Invalid slot' });
        }

        equipment[slot] = itemEntry.item;

        await pool.query(`
            UPDATE users
            SET inventory = $1,
                equipment = $2
            WHERE id = $3
        `, [JSON.stringify(inventory), JSON.stringify(equipment), userId]);

        res.json({ inventory, equipment });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Equip failed' });
    }
}

export async function sellItem(req, res) {
    try {
        const {itemName} = req.body;
        const userId = req.user.id;

        const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

        if(result.rows.length === 0) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        const user = result.rows[0];
        let inventory = safeParse(user.inventory, []);
        let equipment = safeParse(user.equipment, {});
        let gold = user.gold;

        const itemEntry = inventory.find(entry => entry.item.name === itemName);

        if(!itemEntry) {
            return res.status(400).json({
                error: 'Item not found'
            });
        }

        gold += Math.floor(itemEntry.item.gold * 0.6);

        itemEntry.quantity--;

        if(itemEntry.quantity <= 0) {
            inventory = inventory.filter(entry => entry.item.name !== itemName);

            Object.keys(equipment).forEach(slot => {
                if (equipment[slot]?.name === itemName) {
                    delete equipment[slot];
                }
            });
        }

        await pool.query (`
            UPDATE users
            SET gold = $1,
                inventory = $2,
                equipment = $3
            WHERE id = $4
            `, [
                gold, JSON.stringify(inventory), JSON.stringify(equipment), userId
            ]);

            res.json({
                gold, inventory, equipment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Sell failed'});
    }
}
