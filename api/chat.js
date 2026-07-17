// api/chat.js — Vercel serverless proxy for ChikaChan
const https = require("https");

const MAX_REQUESTS = 20;
const WINDOW_MS    = 60 * 60 * 1000;
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

function httpsPost(url, headers, body) {
  return new Promise((resolve, reject) => {
    const parsed  = new URL(url);
    const payload = JSON.stringify(body);
    const options = {
      hostname: parsed.hostname,
      path:     parsed.pathname,
      method:   "POST",
      headers:  { ...headers, "Content-Length": Buffer.byteLength(payload) },
    };
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch (e) { reject(new Error("Failed to parse Anthropic response")); }
      });
    });
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

module.exports = async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST")    return res.status(405).json({ error: "Method not allowed" });

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY is not set." });
  }

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (isRateLimited(ip)) return res.status(429).json({ error: "Too many requests. Try again later." });

  const { model, max_tokens, system, messages } = req.body || {};
  if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: "Invalid request body." });

  try {
    const result = await httpsPost(
      "https://api.anthropic.com/v1/messages",
      {
        "Content-Type":      "application/json",
        "x-api-key":         process.env.ANTHROPIC_API_KEY.trim(),
        "anthropic-version": "2023-06-01",
      },
      {
        model:      model      || "claude-opus-4-8",
        max_tokens: max_tokens || 1024,
        system,
        messages,
      }
    );

    if (result.status !== 200) {
      return res.status(result.status).json({ error: result.body?.error?.message || "Anthropic error" });
    }
    return res.status(200).json(result.body);
  } catch (err) {
    console.error("ChikaChan proxy error:", err);
    return res.status(500).json({ error: err.message || "Internal server error." });
  }
};
