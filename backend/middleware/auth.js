import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute= async (req,res,next)=>{
try{
    const token= req.cookies.jwt;
    if(!token){
        return res.status(401).json({message:"Unauthorized"});
    }
    const decode = jwt.verify(token,process.env.JWT_SECRET_KEY);
    if(!decode){
        return res.status(401).json({message:"Unauthorized "});
    }
    const user=await User.findById(decode.userId).select("-password");
    if(!user){
        return res.status(401).json({message:"Unauthorized"});
    }
    req.user=user;
    next();
}catch(error){
    console.error("Error in protected route", error);
    res.status(500).json({message:"Internal Server Error"});
}
}