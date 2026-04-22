import mongoose from "mongoose";

const TrendingSchema = new mongoose.Schema({
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

export default mongoose.model("Trending", TrendingSchema);