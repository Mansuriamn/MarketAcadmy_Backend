import { validateEnv } from "./src/config/env.js";
import connectDB from "./src/config/db.js";
import app from "./src/app.js";
import { StockCron } from "./src/cron/stock.cron.js";
import { NewsCron } from "./src/cron/news.cron.js";
import { CryptoNews } from "./src/cron/CryptoNews.js";

validateEnv(); // 🛡️ Ensure all env vars are present before starting

connectDB();

StockCron();  // 📈 Start stock data cron
NewsCron();   // 📰 Start news cron
CryptoNews(); // 🪙 Start crypto news cron

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port http://localhost:${PORT}`);
});