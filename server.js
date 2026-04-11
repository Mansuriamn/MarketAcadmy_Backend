import "./src/config/env.js"; // ← must be the FIRST import
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import Parser from "rss-parser";
import { StockCron } from "./src/cron/stock.cron.js";
import {NewsCron} from "./src/cron/news.cron.js"

const parser = new Parser();

connectDB();

StockCron();  // 👈 start cron
NewsCron();



const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {
  console.log(`🚀 Server running on port http://localhost:${PORT}`);
});