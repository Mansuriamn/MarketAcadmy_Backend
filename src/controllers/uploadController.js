import cloudinary from "../config/cloudinary.js";
import multer from "multer";

export const uploadImage = async (req, res) => {
  try {
    const page=req.query.page;
    if (!req.file) return res.status(400).json({ error: "No file received" });

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: page },
        (err, result) => err ? reject(err) : resolve(result)
      );
      stream.end(req.file.buffer);
    });

    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    console.error("UPLOAD ERROR:", err); // ← check your terminal for this
    res.status(500).json({ error: err.message }); // ← now returns real error to frontend too
  }
}