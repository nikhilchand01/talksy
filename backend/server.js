import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from "./routes/authRoute.js";
import cookieParser from 'cookie-parser';
import userRoutes from "./routes/userRoute.js";
import chatRoutes from "./routes/chatRoutes.js";
import connectCloudinary from './lib/cloudinary.js';
import path from 'path';

dotenv.config();
const app=express();
const PORT =process.env.PORT;

const __dirname= path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true //allow frontend to send cookies
}));


const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected");
    }catch(error){
      console.error("Database Not Connected",error);
    }
}

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/chat", chatRoutes);


if(process.env.NODE_ENV ==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));
    app.get("*", (req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend/dist/index.html"));
    })
}

app.listen(PORT,()=>{
    console.log(`Server is Running at PORT: ${PORT}`);   
    connectDB();
    connectCloudinary();
 })