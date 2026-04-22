import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ DB Error:", error.message);
    setTimeout(connectDB, 5000);
  }
};

/**
 * Senior Developer Reliability Pattern: Graceful Shutdown
 * Ensures the database connection is closed cleanly when the server stops.
 */
const shutdown = async () => {
  console.log("\nClosing DB connection...");
  await mongoose.connection.close();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

export default connectDB;