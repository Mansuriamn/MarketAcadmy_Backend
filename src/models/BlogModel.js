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

  views: {
    type: Number,
    default: 0
  },

  publishedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model("Blog", blogSchema);