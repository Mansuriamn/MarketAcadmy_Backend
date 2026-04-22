import mongoose from "mongoose";

const courseSchema =new mongoose.Schema({
    
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    url:{
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    }
}, { timestamps: true });

// 🚀 PERFORMANCE: Faster queries for courses
courseSchema.index({ publishedAt: -1 });
courseSchema.index({ category: 1, publishedAt: -1 });

// 🔥 FULL TEXT SEARCH Optimization
courseSchema.index({ title: "text", category: "text", description: "text" });

export default mongoose.model("Course", courseSchema);