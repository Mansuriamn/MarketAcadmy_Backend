import BreakingNewsModel from "../models/BreakingNewsModel.js";
import Parser from "rss-parser";


const parser = new Parser();

export const getBreakingNews = async (limit, offset) => {
         try {
                  const news = await BreakingNewsModel.find() .sort({ createdAt: -1, _id: -1 }).limit(limit).skip(offset);
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

const hasEmoji = (text = "") => {
  return /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu.test(text);
};

export const fetchStockNews = async () => {
  try {
    console.log("📡 Fetching RSS...");

    const feed = await parser.parseURL(
      "https://www.moneycontrol.com/rss/marketreports.xml"
    );

    const newsList = feed.items.slice(0, 5);

    for (const item of newsList) {
      const title = item.title || "";

      // ❌ Skip if emoji exists
      if (hasEmoji(title)) {
        console.log(`⛔ Skipped (emoji found): ${title}`);
        continue;
      }

      await createHeadline({
        text: title.trim()
      });
    }

  } catch (error) {
    console.error("❌ Service Error:", error.message);
  }
};