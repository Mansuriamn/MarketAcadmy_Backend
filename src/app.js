import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import multer from "multer";
import bodyParser from "body-parser";
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
} from "../src/controllers/blog.controller.js";
import{
getHeadlines,
createHeadline
} from "../src/controllers/BreakingNews.controller.js";
import {
  getTrending,
  createTrending
} from "../src/controllers/trending.controller.js";
import { uploadImage } from "../src/controllers/uploadController.js";
import {protect} from "./middlewares/auth.middleware.js";
import {
  createEmail,
  getAllEmails,
} from "../src/controllers/email.controller.js";

const app = express();

// All middleware FIRST
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "15mb" }));        // ← merged & moved up
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use(bodyParser.json({ limit: "15mb" }));
app.use(morgan("dev"));
app.use(helmet());

const upload = multer({ storage: multer.memoryStorage() });

app.post("/register", registerUser);
app.post("/api/admin/login", loginUser);
app.get('/api/auth/me', protect, getMe);

app.get("/api/blogs/search", getBlogBySearch);
app.get("/api/blogs/category/:category", getBlogByCategory);
app.get("/api/blogs", getAllBlogs);
app.get("/api/blogs/:id", getBlogById);
app.post("/api/blogs/create", createBlog);
app.delete("/api/blogs/:id", protect, deleteBlog);

app.get("/api/courses/search", getCourseBySearch);
app.get("/api/courses/category/:category", getCourseByCategory);
app.get("/api/courses", getAllCourses);
app.get("/api/courses/:id", getCourseById);
app.post("/api/courses/create",  createCourse);
app.delete("/api/courses/:id", protect, deleteCourse);



app.get("/api/news/search", getNewsBySearch);
app.get("/api/news/category/:category", getNewsByCategory);
app.get("/api/news", getAllNews);
app.get("/api/news/:id", getNewsById);
// app.post("/api/news/create",  createNews);
app.delete("/api/news/:id", protect, deleteNews);


app.get("/api/headlines", getHeadlines);
app.post("/api/headlines/create", createHeadline);


// ✅ Routes AFTER middleware
app.post("/upload", protect, upload.single("image"), uploadImage); 


app.get("/api/get/trending", getTrending);
app.post("/api/create/trending", createTrending);


app.get("/api/get/emails", getAllEmails);
app.post("/api/create/email", createEmail);


export default app;