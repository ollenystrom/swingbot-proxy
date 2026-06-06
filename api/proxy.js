export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { symbol, apikey, fn } = req.query;

  let targetUrl;
  if (symbol && apikey) {
    const func = fn || "TIME_SERIES_WEEKLY";
    targetUrl = `https://www.alphavantage.co/query?function=${func}&symbol=${symbol}&apikey=${apikey}`;
  } else {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Missing parameters" });
    targetUrl = decodeURIComponent(url);
  }

  try {
    const r = await fetch(targetUrl, {
      headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json" }
    });
    if (!r.ok) return res.status(r.status).json({ error: `Upstream HTTP ${r.status}` });
    const text = await r.text();
    try {
      return res.status(200).json(JSON.parse(text));
    } catch {
      return res.status(200).send(text);
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
