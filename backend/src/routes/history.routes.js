import express from 'express';
import {addEventToHistory, getHistoryByRoom, deleteHistoryByRoom} from '../controllers/history.controller.js';
import { securedRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/add', securedRoute, addEventToHistory);
router.get('/get/:id', securedRoute, getHistoryByRoom);
router.delete('/delete/:id', securedRoute, deleteHistoryByRoom);


export default router;