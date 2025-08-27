import express from 'express';
import {createRoom, joinRoom, leaveRoom, getRoomDetails, getParticipants, getRoomMessages, getRoomRecording, getRoomHistory, deactivateRoom, deleteRoom} from '../controllers/room.controller.js';
import { securedRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/create', securedRoute, createRoom);
router.post('/join', securedRoute, joinRoom);
router.post('/leave', securedRoute, leaveRoom);
router.get('/details/:id', securedRoute, getRoomDetails);
router.get('/participants/:id', securedRoute, getParticipants);
router.get('/messages/:id', securedRoute, getRoomMessages);
router.get('/recordings/:id', securedRoute, getRoomRecording);
router.get('/history/:id', securedRoute, getRoomHistory);
router.put('/deactivate/:id', securedRoute, deactivateRoom);
router.delete('/delete/:id', securedRoute, deleteRoom);


export default router;