import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  toggleUserStatus,
  forgotPassword,
  resetPassword,
} from './UserCn.js';
import { verifyToken, isAdmin } from '../../Middleware/authMidd.js';
import { loginLimiter, otpLimiter } from '../../Middleware/rateLimitMidd.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login',loginLimiter, loginUser);
router.post('/logout', logoutUser);

router.get('/profile', verifyToken, getUserProfile);
router.put('/profile', verifyToken, updateUserProfile);

router.get('/', verifyToken, isAdmin, getAllUsers);
router.put('/:id/toggle-status', verifyToken, isAdmin, toggleUserStatus);

router.post('/forgot-password',otpLimiter, forgotPassword);
router.post('/reset-password', resetPassword);

export default router;