import mongoose from "mongoose";

const EmailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,        // 🚀 prevent duplicates
    lowercase: true,     // normalize data
    trim: true,
  },

}, { timestamps: true });

export default mongoose.model("Email",EmailSchema);