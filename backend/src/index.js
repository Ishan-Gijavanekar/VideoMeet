import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDb } from './db/database.js';
import http from 'http';


const port = process.env.PORT;
const app = express();

const server = http.createServer(app);

app.use(express.json());
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(cookieParser());


server.listen(port, () => {
    connectDb();
    console.log(`Server running on port ${port}`);
})