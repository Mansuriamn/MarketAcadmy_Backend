import axios from "axios";
import { resolveStockSymbol } from "../utils/stockUtils.js";

const client = axios.create({
  baseURL: "https://query1.finance.yahoo.com",
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
  },
  timeout: 5000,
});

export async function fetchStock(symbol, range, interval, p1, p2) {
  try {
    const finalSymbol = resolveStockSymbol(symbol);
    let url = `/v8/finance/chart/${finalSymbol}?interval=${interval}`;
    
    if (p1 && p2) {
      url += `&period1=${p1}&period2=${p2}`;
    } else {
      url += `&range=${range}`;
    }

    const res = await client.get(url);
  
    const chart = res.data?.chart?.result?.[0];
    if (!chart) return [];

    const timestamps = chart.timestamp;
    if (!timestamps) return [];
    
    const quotes = chart.indicators.quote[0];

    return timestamps
      .map((t, i) => ({
        time: t,
        open:   quotes.open?.[i]   ?? null,
        high:   quotes.high?.[i]   ?? null,
        low:    quotes.low?.[i]    ?? null,
        close:  quotes.close?.[i]  ?? null,
        volume: quotes.volume?.[i] ?? null,
      }))
      .filter(c => c.open !== null && c.high !== null && c.low !== null && c.close !== null);

  } catch (err) {
    console.error("Yahoo blocked / error:", err.message);
    return [];
  }
}