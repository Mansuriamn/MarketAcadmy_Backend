import BreakingNewsModel from "../models/BreakingNewsModel.js";
import Parser from "rss-parser";
import { formatMarketHeadline } from "../utils/marketUtils.js";


const parser = new Parser();

export const getBreakingNews = async (limit, offset) => {
         try {
                  const news = await BreakingNewsModel.find() .sort({ createdAt: -1 }).limit(limit).skip(offset);
                  return news;
         } catch (error) {
                  console.error(error);
         }
};

export const createHeadline =async(headline) => {
         try {
                  const news = await BreakingNewsModel.create(headline);
                  return news;
         } catch (error) {
                  console.error(error);
         }
};

export const fetchStockNews = async () => {
  try {
    console.log("📡 Fetching RSS...");

    const feed = await parser.parseURL(
      "https://www.moneycontrol.com/rss/marketreports.xml"
    );

    const newsList = feed.items.slice(0, 5);

   for (const item of newsList) {
    const finalHeadline = formatMarketHeadline(item.title);
    await createHeadline({ text: finalHeadline });
  }

  } catch (error) {
    console.error("❌ Service Error:", error.message);
  }
  
};