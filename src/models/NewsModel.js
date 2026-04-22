import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  image: String,


  link: {
    type: String,
    required: true,
    unique: true   // 🔥 prevents duplicates at DB level
  },

  category: {
    type: String,
    default: "general"
  },


  publishedAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

// 🚀 PERFORMANCE: Faster queries for news categories and sorted feeds
newsSchema.index({ publishedAt: -1 });
newsSchema.index({ category: 1, publishedAt: -1 });

// 🔥 FULL TEXT SEARCH Optimization
newsSchema.index({ title: "text", category: "text", description: "text" });

export default mongoose.model("News", newsSchema);