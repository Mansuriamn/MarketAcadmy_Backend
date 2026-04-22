import * as authService from "../services/auth.service.js";

export const registerUser = async (req, res) => {
  try {
    const {user,token} = await authService.register(req.body);
  
   res.cookie("token", token, {
     httpOnly: true,
     secure: process.env.NODE_ENV === "production",
     sameSite: "Strict",
     maxAge: 24 * 60 * 60 * 1000,
   });
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { user }, // don't send token again
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};



export const loginUser = async (req, res) => {
  try {
    const {user,token} = await authService.login(req.body);

   res.cookie("token", token, {
     httpOnly: true,
     secure: process.env.NODE_ENV === "production",
     sameSite: "Strict",
     maxAge: 24 * 60 * 60 * 1000,
   });
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { user },
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

// controllers/auth.controller.js
export const getMe = async (req, res) => {
  try {

    const user = await authService.getUser(req.user.id); // ← never send password

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};