import {Server} from "socket.io";
import express from 'express';
import http from "http";
import dotenv from "dotenv";
dotenv.config();
import jwt from 'jsonwebtoken';



const app = express();
const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
    }
})

const configureSocket = () => {
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(new Error("Authentication error"));
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch (error) {
            next(new Error("Authentication error"));
        }  
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('join-room', ({roomId}) => {
            socket.join(roomId);
            socket.to(roomId).emit('user-joined', {userId: socket.user.id});
        });

        socket.on('semd-message', ({roomId, content}) => {
            io.to(roomId).emit('recieve-message', {
                senderId: socket.user.id,
                content,
                timestamp: Date.now()
            });
        });

        socket.on('signal', ({ roomId, signalData }) => {
            socket.to(roomId).emit('signal', {
                senderId: socket.user.id,
                signalData
            });
        });

        socket.on('media-toggle', ({ roomId, mediatype, action }) => {
            socket.to(roomId).emit('media-toggle', {
                senderId: socket.user.id,
                mediatype,
                action
            });
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });

}

export {app, server, configureSocket}