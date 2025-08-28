import express from 'express';
import {uploadRecording, getRecordingByRoom, deleteRecording} from '../controllers/recording.controller.js';
import { securedRoute } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.post('/upload', securedRoute, uploadRecording);
router.get('/get/:id', securedRoute, getRecordingByRoom);
router.delete('/delete/:id', securedRoute, deleteRecording);


export default router;