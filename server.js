import { validateEnv } from "./src/config/env.js";
import app from "./src/app.js";

validateEnv(); // 🛡️ Ensure all configs are present
import connectDB from "./src/config/db.js";
import Parser from "rss-parser";
import { StockCron } from "./src/cron/stock.cron.js";
import {NewsCron} from "./src/cron/news.cron.js"
import { CryptoNews } from "./src/cron/CryptoNews.js";
const parser = new Parser();

connectDB();

StockCron();  // 👈 start cron
NewsCron();
CryptoNews();



const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {
  console.log(`🚀 Server running on port http://localhost:${PORT}`);
});