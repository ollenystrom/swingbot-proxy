export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing url parameter" });

  try {
    const decoded = decodeURIComponent(url);
    const r = await fetch(decoded, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
      }
    });

    if (!r.ok) {
      return res.status(r.status).json({ error: `Upstream HTTP ${r.status}` });
    }

    const text = await r.text();

    // Försök parsa som JSON
    try {
      const data = JSON.parse(text);
      return res.status(200).json(data);
    } catch {
      // Returnera råtext om det inte är JSON
      return res.status(200).send(text);
    }

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
