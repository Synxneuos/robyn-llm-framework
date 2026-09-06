import { Handler } from "@netlify/functions";
import https from "https";

function fetchJson(url: string, headers: Record<string, string> = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on("error", reject);
  });
}

export const handler: Handler = async () => {
  const symbols = ["NVDA", "AAPL", "TSLA", "AMZN"];
  const results: Record<string, { price: number; change24h: number }> = {};

  // 1. Fetch Real Stock Prices from Yahoo Finance (server-side, zero CORS)
  for (const s of symbols) {
    try {
      const data = await fetchJson(
        `https://query1.finance.yahoo.com/v8/finance/chart/${s}?interval=1d`,
        { "User-Agent": "Mozilla/5.0" }
      );
      const meta = data?.chart?.result?.[0]?.meta;
      const price = meta?.regularMarketPrice || 0;
      const prev = meta?.chartPreviousClose || price;
      const change24h = prev > 0 ? +(((price - prev) / prev) * 100).toFixed(2) : 0;
      results[s] = { price, change24h };
    } catch (e) {
      console.error(`Failed to fetch ${s}:`, e);
      // Fallback to recent baseline if API throttled
      const fallbacks: Record<string, number> = { NVDA: 230.36, AAPL: 239.50, TSLA: 218.40, AMZN: 178.90 };
      results[s] = { price: fallbacks[s] || 100, change24h: 0 };
    }
  }

  // 2. Fetch Live ETH Price from CoinGecko
  let ethPrice = 2488.0;
  try {
    const ethData = await fetchJson(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
      { "User-Agent": "Mozilla/5.0" }
    );
    if (ethData?.ethereum?.usd) {
      ethPrice = ethData.ethereum.usd;
    }
  } catch (e) {
    console.error("Failed to fetch ETH price:", e);
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=60",
    },
    body: JSON.stringify({
      stocks: results,
      ethPrice,
      timestamp: new Date().toISOString(),
    }),
  };
};
