import {
  createEmailService,
  getAllEmailsService,
} from "../services/email.service.js";

import { sendOTPEmail, sendWelcomeEmail } from "../utils/mailer.js";

// ================= OTP STORE =================
// ⚠️ Replace with Redis / DB in production
const otpStore = {};

// ================= UTILS =================
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ================= CONTROLLERS =================

// 🔹 Send OTP
export const sendOTP = async (req, res) => {
  try {
    const { email, name } = req.body;

    // Validation
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Valid email is required",
      });
    }

    const otp = generateOTP();

    otpStore[email] = {
      otp,
      name: name || "Trader", // ✅ Store name (default to Trader)
      expires: Date.now() + 5 * 60 * 1000, // 5 min
    };

    await sendOTPEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

// 🔹 Verify OTP + Subscribe Email
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validation
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const record = otpStore[email];

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "No OTP found",
      });
    }

    if (Date.now() > record.expires) {
      delete otpStore[email];
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (record.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // OTP valid → delete
    delete otpStore[email];

    // Save email in DB
    const result = await createEmailService(email);
    if (result) {
      await sendWelcomeEmail(email, record.name); // ✅ Pass name to mailer
    }
    return res.status(201).json({
      success: true,
      message: "Email verified & subscribed",
      data: result,
    });


  } catch (error) {
    const status = error.message === "Email already subscribed" ? 400 : 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// 🔹 Get All Emails
export const getAllEmails = async (req, res) => {
  try {
    const emails = await getAllEmailsService();

    return res.status(200).json({
      success: true,
      count: emails.length,
      data: emails,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};