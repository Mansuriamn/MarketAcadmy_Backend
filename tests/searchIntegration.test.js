import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import Blog from '../src/models/BlogModel.js'; 

dotenv.config();

const TEST_BLOG = {
  title: "INTEGRATION_TEST_TITLE_UNIQUE_99",
  description: "This is a test blog for integration verification.",
  category: "Test",
  image: "https://example.com/image.png"
};

async function runIntegrationTest() {
  console.log("🚀 Starting Search Integration Test...");
  
  try {
    // 1. Connect to DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ DB Connected");

    // 2. Clear existing test data
    await Blog.deleteOne({ title: TEST_BLOG.title });

    // 3. Create Sample Data
    const blog = await Blog.create(TEST_BLOG);
    console.log("✅ Test Blog Created in DB: " + blog._id);

    // Wait a moment for database consistency
    console.log("⌛ Waiting for DB consistency...");
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 4. Test API Search
    const searchUrl = `http://localhost:5000/api/blogs/search?q=INTEGRATION_TEST_TITLE`;
    console.log("📡 Querying API: " + searchUrl);
    const response = await axios.get(searchUrl);
    
    // The controller returns an ARRAY directly: res.status(200).json(blog);
    const blogs = Array.isArray(response.data) ? response.data : (response.data.blogs || []);
    console.log("📊 API returned " + blogs.length + " items.");
    
    const found = blogs.some(b => b.title === TEST_BLOG.title);
    
    if (found) {
      console.log("🔥 SUCCESS: Blog found via API Search! DB + Service + Controller integrated correctly.");
    } else {
      console.error("❌ FAILURE: Blog created in DB but not found via API Search.");
      if (blogs.length > 0) {
        console.log("First item returned: " + blogs[0].title);
      }
    }

    // 5. Cleanup
    await Blog.findByIdAndDelete(blog._id);
    console.log("🧹 Cleanup Complete");

  } catch (err) {
    console.error("💥 Integration Test Failed:", err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

runIntegrationTest();
