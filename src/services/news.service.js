import News from "../models/NewsModel.js";
import Parser from "rss-parser";



const parser = new Parser();


export const createNews = async (data) => {
  return await News.create(data);
};

export const getAllNews = async (limit, offset) => {
  const news = await News.find({})
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .lean();;
  return news;
};

export const getNewsById = async (id) => {
  const news = await News.findById(id);
  return news;
};
export const getNewsByCategory = async (limit, offset, category) => {
  const news = await News.find({ category: category })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .lean();
  return news;
};

export const getNewsSearch = async (limit, offset, q) => {
  try {
    // ✅ Guarantee numbers even if controller forgets to parse
    const numLimit = Math.max(1, Number(limit) || 7);
    const numOffset = Math.max(0, Number(offset) || 0);

    let query = {};

    if (q && q.trim().length >= 2) {
      const escaped = q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(escaped, 'i');

      query = {
        $or: [
          { title: searchRegex },
          { category: searchRegex },
          { description: searchRegex },
          { slug: searchRegex },
        ],
      };
    }


    const blogs = await News.find(query)
      .sort({ createdAt: -1 })
      .skip(numOffset)   // ✅ guaranteed number
      .limit(numLimit)   // ✅ guaranteed number
      .lean();

    return blogs;

  } catch (err) {
    console.error('→ getBlogSearch CRASH:', err);
    throw err;
  }
};

export const deleteNews = async (id) => {
  const news = await News.findByIdAndDelete(id);
  return news;
};








// 📰 RSS feeds
const FEEDS = [
  "https://www.cnbc.com/id/100003114/device/rss/rss.html"
];

// 🔑 Keywords
const KEYWORDS = [
  "sensex", "nifty", "stock", "share",
  "market", "ipo", "trading", "equity",
  "oil", "inflation", "economy", "fed", "war"
];

// 📂 Category keywords
const CATEGORY_KEYWORDS = {
  stock: ["stock", "market", "nifty", "sensex", "shares"],
  crypto: ["bitcoin", "crypto", "ethereum", "blockchain"],
  economy: ["inflation", "gdp", "economy", "rbi", "interest"],
  global: ["usa", "china", "europe", "fed", "war", "oil"]
};

// 🧠 Detect category
const getCategory = (text = "") => {
  text = text.toLowerCase();
  let best = "general";
  let max = 0;

  for (const category in CATEGORY_KEYWORDS) {
    let count = 0;
    for (const keyword of CATEGORY_KEYWORDS[category]) {
      if (text.includes(keyword)) count++;
    }
    if (count > max) {
      max = count;
      best = category;
    }
  }

  return best;
};

// 🖼 Fetch OG image from article URL
const fetchOGImage = async (url) => {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(5000)
    });
    const html = await res.text();

    const ogMatch =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);

    const twitterMatch = html.match(
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i
    );

    return ogMatch?.[1] || twitterMatch?.[1] || "";
  } catch {
    return "";
  }
};

// 🔁 Run in batches (no pLimit needed)
const runInBatches = async (items, batchSize, fn) => {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }
  return results;
};

// 🚀 MAIN FUNCTION
export const fetchNews = async () => {
  console.log("📡 Fetching News...");

  try {
    // 🔥 Fetch existing links
    const existingNews = await News.find({}, "link");
    const existingLinks = new Set(existingNews.map((n) => n.link));

    let newsToInsert = [];

    for (const url of FEEDS) {
      try {
        const feed = await parser.parseURL(url);

        for (const item of feed.items) {
          if (!item?.title || !item?.link) continue;

          const link = item.link.trim();

          // ❌ Skip duplicate
          if (existingLinks.has(link)) continue;

          const title = item.title.trim();
          const text = `${title} ${item.contentSnippet || ""}`.toLowerCase();

          // 🔍 Keyword filter
          const isRelevant = KEYWORDS.some((k) => text.includes(k));
          if (!isRelevant) continue;

          const category = getCategory(text);

          newsToInsert.push({
            title,
            description: item.contentSnippet || "",
            image: "",
            link,
            category,
            publishedAt: item.isoDate ? new Date(item.isoDate) : new Date()
          });

          // prevent duplicate in same batch
          existingLinks.add(link);
        }
      } catch (err) {
        console.error(`❌ Feed Error (${url}):`, err.message);
      }
    }

    if (newsToInsert.length === 0) {
      console.log("⚠️ No new news found");
      return;
    }

    // 🖼 Fetch OG images in batches of 5
    console.log(`🖼 Fetching images for ${newsToInsert.length} articles...`);

    newsToInsert = await runInBatches(newsToInsert, 5, async (item) => {
      const image = await fetchOGImage(item.link);
      console.log(`🖼 ${image ? "✅" : "❌"} ${item.title.slice(0, 50)}...`);
      return { ...item, image };
    });

    // 🚀 Insert in DB
    await News.insertMany(newsToInsert, { ordered: false });
    console.log(`✅ Inserted ${newsToInsert.length} news`);

  } catch (err) {
    console.error("❌ Fatal Error:", err.message);
  }
};