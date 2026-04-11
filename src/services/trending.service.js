import TrendingModel from "../models/TrendingModel.js";

export const createTrending = async (data) => {
  return await TrendingModel.create(data);
};

export const getTrendingById = async (id) => {
  return await TrendingModel.findById(id);
};

export const deleteTrending = async (id) => {
  return await TrendingModel.findByIdAndDelete(id);
};

export const getTrending = async (limit, offset) => {
  return await TrendingModel.find()
    .sort({ createdAt: -1 }) // latest first ✅
    .skip(offset)
    .limit(limit)
    .lean();
};