import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDb } from './db/database.js';
import { configureSocket, server, app } from './server.js';


const port = process.env.PORT;



app.use(express.json());
app.use(cors({credentials: true, origin: 'http://localhost:5173'}));
app.use(cookieParser());


configureSocket();

import userRoutes from './routes/user.routes.js';
import messageRoutes from './routes/messages.routes.js';
import roomRoutes from './routes/room.routes.js';
import historyRoutes from './routes/history.routes.js';
import recordingRoutes from './routes/recording.routes.js';


app.use('api/v1/users', userRoutes);
app.use('api/v1//messages', messageRoutes);
app.use('api/v1/rooms', roomRoutes);
app.use('api/v1/history', historyRoutes);
app.use('api/v1/recordings', recordingRoutes);


server.listen(port, () => {
    connectDb();
    console.log(`Server running on port ${port}`);
})