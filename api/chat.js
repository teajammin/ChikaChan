// api/chat.js — Vercel serverless proxy for ChikaChan

const MAX_REQUESTS = 20;
const WINDOW_MS    = 60 * 60 * 1000; // 1 hour
const ipMap        = new Map();

function isRateLimited(ip) {
  const now   = Date.now();
  const entry = ipMap.get(ip);
  if (!entry || now > entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQUESTS;
}

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

module.exports = async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST")    return res.status(405).json({ error: "Method not allowed" });

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (isRateLimited(ip)) return res.status(429).json({ error: "Too many requests. Try again later." });

  const { model, max_tokens, system, messages } = req.body || {};
  if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: "Invalid request body." });

  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type":    "application/json",
        "x-api-key":       process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model:      model      || "claude-opus-4-8",
        max_tokens: max_tokens || 1024,
        system,
        messages,
      }),
    });

    const data = await anthropicRes.json();
    if (!anthropicRes.ok) return res.status(anthropicRes.status).json({ error: data?.error?.message || "Anthropic error" });
    return res.status(200).json(data);
  } catch (err) {
    console.error("ChikaChan proxy error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};
