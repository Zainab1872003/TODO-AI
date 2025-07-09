import { Router } from 'express';
import { register, login, logout, refresh } from '../controllers/auth.controller.js';
import { validateUser, validateLogin } from '../validators/user.validator.js';




const router = Router();

router.post('/register', validateUser, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout);
router.post('/refresh', refresh);

export default router;