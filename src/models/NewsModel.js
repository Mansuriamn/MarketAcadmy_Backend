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

  views: {
    type: Number,
    default: 0
  },

  publishedAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

export default mongoose.model("News", newsSchema);