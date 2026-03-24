import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import chatRouter from './routes/chat.js' 
import authRouter from './routes/user.js'
// import axios from 'axios';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cookieParser())
app.use(cors({
   origin: "https://chatzie-rhyy.vercel.app",
   credentials: true
}))

app.use("/api", chatRouter);
app.use("/api/auth", authRouter)


app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
    ConnectDB();
});

const ConnectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to db");
    }catch(err) {
        console.log("failed to connect DB", err);
    }
}


