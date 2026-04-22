import { fetchStock } from "../services/stock.service.js";
import { getCache, setCache } from "../utils/stockCache.js";

export async function getStockData(req, res) {
  const { symbol } = req.params;

  try {
    const { interval = "15m", range = "5d", p1, p2 } = req.query;
    // ✅ Cache key includes range+interval+period so switching timeframes always fetches fresh data
    const cacheKey = `${symbol}:${range}:${interval}:${p1 || ''}:${p2 || ''}`;

    // ✅ Cache check
    const cached = getCache(cacheKey);
    if (cached) {
      console.log(`[Cache HIT] ${cacheKey} — candles: ${cached.data?.length}`);
      return res.json({ ...cached, source: "cache" });
    }

    // ✅ Fetch
    const data = await fetchStock(symbol, range, interval, p1, p2);
    console.log(`[Stock Service] ${symbol} raw candles fetched: ${data.length}`);

    if (!data.length) {
      return res.status(200).json({
        symbol,
        currentPrice: 0,
        change: 0,
        data: [],
        message: "No live data available",
      });
    }

    // ✅ Calculate (use close as the canonical price)
    const latest = data.at(-1).close;
    const prev   = data.at(-2)?.close || latest;

    const change = prev > 0
      ? ((latest - prev) / prev) * 100
      : 0;

    // ✅ Response envelope: { symbol, currentPrice, change, data: OHLCV[] }
    const response = {
      symbol,
      currentPrice: Number(latest.toFixed(2)),
      change:       Number(change.toFixed(2)),
      data:         data.slice(-500), // Increased to 500 candles for better history
    };

    console.log(`[Controller] ${symbol} response → currentPrice: ${response.currentPrice}, candles: ${response.data.length}`);

    // ✅ Cache
    setCache(cacheKey, response);

    res.json({ ...response, source: "api" });

  } catch (error) {
    console.error("Controller Error:", error.message);

    res.status(500).json({
      error: "Failed to fetch stock",
      message: error.message,
    });
  }
}