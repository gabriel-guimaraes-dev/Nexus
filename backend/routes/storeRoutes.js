import express from 'express';
import {buyStoreItem} from '../controllers/storeController.js';
import {authenticateToken} from '../middleware/authMiddleware.js';

const router = express.Router();

// buy store items
router.post('/buy', authenticateToken, buyStoreItem);

export default router;
