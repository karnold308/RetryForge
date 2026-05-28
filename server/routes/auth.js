 import express from 'express';
const router = express.Router();
import { handleLogin, handleRefresh, handleLogout } from '../controllers/authController.js';
import { loginLimiter } from '../middleware/loginLimiter.js';

router.route('/login')
    .post(loginLimiter, handleLogin);

router.route('/refresh')
    .get(handleRefresh)

router.route('/logout')
    .post(handleLogout)


export { router };


