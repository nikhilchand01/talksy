import User from "../models/User.js"
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js";
import { verifyEmail } from "../lib/verifyEmail.js";
import Session from "../models/SessionModel.js";
import { sendOtpMail } from "../lib/sendOtpMail.js";
import { v2 as cloudinary } from 'cloudinary';

export async function signup(req, res) {
  console.log(req.body);
  const { email, password, fullName } = req.body;
  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`
    const newUser = await User.create({
      email, fullName, password, profilePic: randomAvatar,
    });
    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || ""
      })
      console.log(`Stream user created for ${newUser._id}`);

    } catch (error) {
      console.log("Error creating Stream User", error);
    }
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d"
    });
    res.cookie("jwt", token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production"
    })
    verifyEmail(token, email)
    newUser.token = token
    await newUser.save();
    res.status(201).json({ success: true, user: newUser })
  } catch (error) {
    console.log("Error is SignUp ", error);
    res.status(500).json({ message: "Internal Server Error" });

  }
};

export async function verification(req, res) {
  try {
    const verifyToken = (token) => {
      try {
        return jwt.verify(token, process.env.JWT_SECRET_KEY);
      } catch (error) {
        return null;
      }
    };

    const { token } = req.params;
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.json({ success: false, message: "Invalid" });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.token = null;
    user.isVerified = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email Verified Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Invalid email " });

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect)
      return res.status(404).json({ message: "Invalid password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h"
    });
    res.cookie("jwt", token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production"
    })
    if (user.isVerified !== true) {
      return res.status(403).json({
        success: false,
        message: "Verify your account than login"
      })
    }
    const existingSession = await Session.findOne({ userId: user._id });
    if (existingSession) {
      await Session.deleteOne({ userId: user._id })
    }
    await Session.create({ userId: user._id });

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "10d" });

    user.isLoggedIn = true;
    await user.save();
    return res.status(200).json({
      success: true,
      message: `Welcome back ${user.fullName}`,
      accessToken,
      refreshToken,
      user
    })
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export async function logout(req, res) {
  try {
    const userId = req.user;
    console.log("Logging out user:", userId);

    await Session.deleteMany({ userId });
    await User.findByIdAndUpdate(userId, { isLoggedIn: false }, { new: true })
    res.clearCookie("jwt")
    return res.status(200).json({ success: true, message: "LogOut Successfull" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
};

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found"
      })
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000)
    user.otp = otp;
    user.otpExpiry = expiry;
    await user.save();
    await sendOtpMail(email, otp);
    return res.status(200).json({
      success: true,
      message: "Otp sent"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export async function verifyOtp(req, res) {
  const { otp } = req.body;
  const email = req.params.email;
  if (!otp) {
    return res.status(400).json({
      success: false,
      message: "OTP is required"
    })
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }
    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP not generated or already verified"
      })
    }
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one"
      })
    }
    if (otp !== user.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      })
    }
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "OTP verified successfully"
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server error"
    })
  }
}

export async function changePassword(req, res){
  const {newPassword, confirmPassword} = req.body;
  const email= req.params.email;

  if(!newPassword || !confirmPassword){
    return res.status(400).json({
      success: false,
      message: "All fields required"
    })
  }
  if(newPassword !== confirmPassword){
    return res.status(400).json({
      success: false,
      message: "Password did not match"
    })
  }
  try{
    const user =await User.findOne({email});
    //console.log(user);
    
    if(!user){
      return res.status(404).json({
        success: false,
        message: "User Not Found"
      })
    }

    user.password= newPassword;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Password changed successfully"
    })
  }catch(error){
    return res.status(500).json({
      success: false,
      message:"Internal Server Error"
    })
  }
}

export async function onboard(req, res) {
  try {
    const userId = req.user._id;
    const { fullName, bio, nativeLanguage, age , location } = req.body;

    if (!fullName || !bio || !nativeLanguage || !age || !location) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !age && "age",
          !location && "location",
        ]
      });
    }

    // Upload image if provided
    let profilePicUrl = "";
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "user_profiles",
        resource_type: "image",
      });
      profilePicUrl = uploadResult.secure_url;
    }

    const updateUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        profilePic: profilePicUrl || req.body.profilePic || "",
        isOnboarded: true,
      },
      { new: true }
    );

    if (!updateUser) {
      return res.status(404).json({ message: "User Not Found" });
    }
    
    try {
      await upsertStreamUser({
        id: updateUser._id.toString(),
        name: updateUser.fullName,
        image: updateUser.profilePic || "",
      });
      console.log(`Stream user updated after onboarding for ${updateUser.fullName}`);
    } catch (error) {
      console.error("Error updating stream user during onboarding", error.message);
    }

    res.status(200).json({ message: "Updated User", user: updateUser });
  } catch (error) {
    console.error("Onboarding error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}