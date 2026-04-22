import TrendingModel from "../models/TrendingModel.js";
import Parser from "rss-parser";

const parser = new Parser();

 const createTrending = async (data) => {
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
    .sort({ createdAt: -1, _id: -1 }) // latest first ✅
    .skip(offset)
    .limit(limit)
    .lean();
};














// ================= FEEDS (ONLY 2 BEST) =================
const CRYPTO_RSS_FEEDS = [
  {
    name: "CoinDesk",
    url: "https://www.coindesk.com/arc/outboundfeeds/rss/",
    priority: 1,
  },
  {
    name: "Cointelegraph",
    url: "https://cointelegraph.com/rss",
    priority: 2,
  },
];

// ================= CATEGORY =================
const CATEGORY_KEYWORDS = {
  bitcoin: ["bitcoin", "btc"],
  ethereum: ["ethereum", "eth"],
  regulation: ["sec", "etf", "regulation", "ban", "law"],
  exchange: ["binance", "coinbase", "exchange", "hack"],
  defi: ["defi", "web3", "dao", "staking"],
  market: ["price", "surge", "rally", "crash"],
};

const detectCategory = (text = "") => {
  const lower = text.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) {
      return category;
    }
  }

  return "general";
};

// ================= IMAGE EXTRACTION =================
const extractImage = (item) => {
  return (
    item.enclosure?.url ||
    item["media:content"]?.url ||
    item["media:thumbnail"]?.url ||
    (item.content &&
      item.content.match(/<img.*?src="(.*?)"/)?.[1]) ||
    null
  );
};

// ================= FETCH FEED =================
const fetchFeed = async (feed) => {
  try {
    const parsed = await parser.parseURL(feed.url);

    return parsed.items.slice(0, 10).map((item) => ({
      title: item.title?.trim(),
      description: item.contentSnippet || "",
      image: extractImage(item),
      link: item.link,
      category: detectCategory(item.title),
      source: feed.name,
      priority: feed.priority,
      publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
    }));
  } catch (err) {
    console.error(`❌ Error fetching ${feed.name}`);
    return [];
  }
};

// ================= MAIN SERVICE =================
export const fetchCryptoNews = async () => {
  try {
    // 🚀 Fetch in parallel
    const results = await Promise.all(
      CRYPTO_RSS_FEEDS.map((feed) => fetchFeed(feed))
    );

    let allNews = results.flat();

    // ================= FILTER INVALID =================
    allNews = allNews.filter(
      (item) => item.title && item.link
    );

    // ================= REMOVE DUPLICATES =================
    const uniqueNews = Array.from(
      new Map(allNews.map((item) => [item.link, item])).values()
    );

    // ================= SORT =================
    uniqueNews.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      return b.publishedAt - a.publishedAt;
    });

    // ================= LIMIT =================
    const finalNews = uniqueNews.slice(0, 20);

    // ================= SAVE TO DB =================
    // Avoid duplicates in DB
    const existingLinks = await TrendingModel.find({
      link: { $in: finalNews.map((n) => n.link) },
    }).select("link");

    const existingSet = new Set(existingLinks.map((e) => e.link));

    const newNews = finalNews.filter((n) => !existingSet.has(n.link));

    if (newNews.length > 0) {
      await TrendingModel.insertMany(newNews);
    }

    return newNews;
  } catch (error) {
    console.error("❌ Crypto Service Error:", error);
    return [];
  }
};