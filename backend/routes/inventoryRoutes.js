import express from 'express';
import {equipItem, sellItem} from '../controllers/inventoryController.js';
import {authenticateToken} from '../middleware/authMiddleware.js';

const router = express.Router();

// sell item
router.post('/sell', authenticateToken, sellItem);

//equip item
router.post('/equip', authenticateToken, equipItem);

export default router;
