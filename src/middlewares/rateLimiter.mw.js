import rateLimit from "express-rate-limit";

/**
 * Senior Developer Security Strategy:
 * 
 * Rate limiting is critical for public endpoints (OTP, Login, etc.) to prevent:
 * 1. Bruteforce attacks on passwords/OTP codes.
 * 2. Resource exhaustion (DDoS) on your mail server or database.
 */

// 📨 Limit OTP requests to 3 per 15 minutes per IP
export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, 
  message: {
    success: false,
    message: "Too many OTP requests. Please try again after 15 minutes."
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});

// 🔑 Limit Login attempts to 10 per 15 minutes
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 🌐 General API limiter (prevention against scraping)
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,
  message: {
    success: false,
    message: "Too many requests. Please slow down."
  }
});
