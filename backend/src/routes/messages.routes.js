import express from 'express';
import {createMessage, getMessageByRoom, deleteMessage} from '../controllers/message.controller.js';
import { securedRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();


router.post('/create/:id', securedRoute, createMessage);
router.get('/get/:id', securedRoute, getMessageByRoom);
router.delete('/delete/:id', securedRoute, deleteMessage);



export default router;