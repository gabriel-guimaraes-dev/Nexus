import express from 'express';
import {login, register, getUserState} from '../controllers/authController.js';
import {equipItem} from '../controllers/inventoryController.js';
import {buyStoreItem} from '../controllers/storeController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

//auth
router.post('/login', login);
router.post('/register', register);

// user state
router.get('/user/state', authenticateToken, getUserState);

// inventory
router.post('/store/buy', authenticateToken, buyStoreItem);
router.post('/inventory/equip', authenticateToken, equipItem);

export default router;
