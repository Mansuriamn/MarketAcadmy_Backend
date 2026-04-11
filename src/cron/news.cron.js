import cron from "node-cron";
import { fetchNews } from "../services/news.service.js";

export const NewsCron = () => {

  // ⏰ every 30 min, only 9 AM – 4 PM (Mon–Fri)
  cron.schedule("0 9-15 * * 1-5", async () => {
 
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

    console.log("📡 Fetching Stock News...");
    await fetchNews();

  });
 

};