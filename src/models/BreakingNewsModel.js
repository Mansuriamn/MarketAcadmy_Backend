import mongoose from "mongoose";

const BreakingNewsSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      unique: true,
    }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Headline",BreakingNewsSchema)

