import * as trendingService from "../services/trending.service.js";

export const getTrending = async (req, res) => {
  try {
    const limit = Math.max(parseInt(req.query.limit) || 4, 1);
    const offset = Math.max(parseInt(req.query.offset) || 0, 0);

    const trending = await trendingService.getTrending(limit, offset);

    return res.status(200).json({
      success: true,
      count: trending.length,
      data: trending,
    });
  } catch (error) {
    console.error("GET TRENDING ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const createTrending = async (req, res) => {
  try {
    const { title, summary } = req.body;

    // ✅ Validation
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const trending = await trendingService.createTrending({
      title,
      summary,
    });

    return res.status(201).json({
      success: true,
      data: trending,
    });
  } catch (error) {
    console.error("CREATE TRENDING ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
