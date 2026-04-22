import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: String,

  image: String, // 🖼️ added image field
  
  category: {
    type: String,
    required: true
  },

  publishedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// 🚀 PERFORMANCE: Faster queries for categories and sorted feeds
blogSchema.index({ publishedAt: -1 });
blogSchema.index({ category: 1, publishedAt: -1 });

// 🔥 FULL TEXT SEARCH Optimization
blogSchema.index({ title: "text", category: "text", description: "text" });

export default mongoose.model("Blog", blogSchema);