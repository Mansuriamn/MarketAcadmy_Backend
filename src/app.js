import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import multer from "multer";
import bodyParser from "body-parser";
import compression from "compression";
import cloudinary from "./config/cloudinary.js"; // add this
import {
  registerUser,
  loginUser,
  getMe,
} from "./controllers/auth.controller.js";
import {
  getAllCourses,
  getCourseById,
  getCourseByCategory,
  createCourse,
  deleteCourse,
  getCourseBySearch
} from "./controllers/course.controller.js";
import {
  getAllNews,
  getNewsById,
  getNewsByCategory,
  createNews,
  deleteNews,
  getNewsBySearch
} from "./controllers/news.controller.js";
import {
  getAllBlogs,
  getBlogById,
  getBlogByCategory,
  createBlog,
  deleteBlog,
  getBlogBySearch
} from "./controllers/blog.controller.js";
import {
  getHeadlines,
  createHeadline
} from "./controllers/breakingNews.controller.js";
import {
  getTrending,
  getTrendingById
} from "./controllers/trending.controller.js";
import { uploadImage } from "./controllers/uploadController.js";
import {protect} from "./middlewares/auth.middleware.js";
import { sendOTP,verifyOTP } from "./controllers/email.controller.js";
import { apiLimiter, otpLimiter, loginLimiter } from "./middlewares/rateLimiter.mw.js";
import { validate } from "./middlewares/validate.mw.js";
import { createBlogSchema, createCourseSchema, createNewsSchema } from "./validations/schemas.js";
import { getStockData } from "./controllers/stock.controller.js";


const app = express();

// All middleware FIRST
app.use(cookieParser());
// CORS Configuration (Production-Ready)
const allowedOrigins = [
  process.env.FRONTEND_URL, // e.g. https://yourdomain.com
  'http://localhost:5173',
  'http://localhost:5174',
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use(morgan("dev"));
app.use(helmet());
app.use(compression()); // 🚀 Compresses all responses

// Simple performance monitoring middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (duration > 500) {
      console.warn(`⚠️ Slow Request: ${req.method} ${req.originalUrl} took ${duration}ms`);
    }
  });
  next();
});

const upload = multer({ storage: multer.memoryStorage() });


app.use("/api", apiLimiter);

app.post("/api/admin/login", loginLimiter, loginUser);
app.get('/api/auth/me', protect, getMe);

app.get("/api/blogs/search", getBlogBySearch);
app.get("/api/blogs/category/:category", getBlogByCategory);
app.get("/api/blogs", getAllBlogs);
app.get("/api/blogs/:id", getBlogById);

app.post("/api/blogs/create", protect, validate(createBlogSchema), createBlog);
app.delete("/api/blogs/delete/:id", protect, deleteBlog);

app.get("/api/courses/search", getCourseBySearch);
app.get("/api/courses/category/:category", getCourseByCategory);
app.get("/api/courses", getAllCourses);
app.get("/api/courses/:id", getCourseById);
app.post("/api/courses/create", protect, validate(createCourseSchema), createCourse);
app.delete("/api/courses/delete/:id", protect, deleteCourse);

app.get("/api/news/search", getNewsBySearch);
app.get("/api/news/category/:category", getNewsByCategory);
app.get("/api/news", getAllNews);
app.get("/api/news/:id", getNewsById);
app.post("/api/news/create", protect, validate(createNewsSchema), createNews);
app.delete("/api/news/delete/:id", protect, deleteNews);

app.get("/api/headlines", getHeadlines);
app.post("/api/headlines/create", protect, createHeadline);

// ✅ Routes AFTER middleware
app.post("/upload", protect, upload.single("image"), uploadImage); 

app.get("/api/get/trending", getTrending);
app.get("/api/get/trending/:id", getTrendingById);

app.post("/api/send-otp", otpLimiter, sendOTP);
app.post("/api/verify-otp", verifyOTP);

app.get("/api/stock/:symbol", getStockData);


// ─── FAILURE PREPARATION: Centralized Error Handling ───────────────────────
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Resource not found" });
});

app.use((err, req, res, next) => {
  console.error("Internal Error:", err.message);
  res.status(err.status || 500).json({ success: false, message: err.message });
});





export default app;