import express from 'express';
import {register, login, getUser, getUserById, updateUser, deleteUser, logout} from '../controllers/user.controller.js';
import { securedRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/user', securedRoute, getUser);
router.get('/user/:id', securedRoute, getUserById);
router.put('/user', securedRoute, updateUser);
router.delete('/user', securedRoute, deleteUser);


export default router;