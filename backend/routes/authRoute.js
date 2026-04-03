import express from "express";
import {signup, login, logout, onboard, verification, forgotPassword, verifyOtp, changePassword} from "../controllers/authController.js";
import { protectRoute } from "../middleware/auth.js";
import { userScehma, validateUser } from "../lib/userValidate.js";
import upload from '../middleware/multer.js';
const router= express.Router();

router.post("/signup",validateUser(userScehma), signup);
router.post("/verify/:token",verification);
router.post("/login",login);
router.post("/logout",protectRoute, logout);
router.post("/forgotpassword", forgotPassword);
router.post("/verifyotp/:email", verifyOtp);
router.post("/changepassword/:email", changePassword);

router.post("/onboard", protectRoute, upload.single("profilePic"), onboard);


//check if user logged in
router.get("/me", protectRoute, (req,res)=>{
    res.status(200).json({success: true, user: req.user});
})
export default router;
