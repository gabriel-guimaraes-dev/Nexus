import express from 'express';
import {login, register, getUserState} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

//auth
router.post('/login', login);
router.post('/register', register);

// user state
router.get('/user/state', authenticateToken, getUserState);

export default router;
