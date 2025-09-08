import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import chatRouter from './routes/chat.js' 
// import axios from 'axios';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.use("/api", chatRouter);

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

