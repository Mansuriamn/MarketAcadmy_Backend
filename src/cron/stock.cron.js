import cron from "node-cron";
import { fetchStockNews } from "../services/headlineNews.service.js";


export const StockCron = () => {

  // Run every 30 minutes (safe)
  cron.schedule("*/30 9-15 * * 1-5", async () => {

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // ⛔ Skip before 9:15 AM
    if (hours === 9 && minutes < 15) {
      console.log("⏳ Waiting for market open...");
      return;
    }

    // ⛔ Skip after 3:30 PM
    if (hours === 15 && minutes > 30) {
      console.log("⛔ Market closed");
      return;
    }

    console.log("📊 Fetching stock news...");
    await fetchStockNews();

  });

};
