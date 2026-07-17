// api/chat.js — Vercel serverless proxy for ChikaChan
// Your Anthropic key stays here on the server; users never see it.

// ── Simple in-memory rate limiter ─────────────────────────────────────────────
// Allows MAX_REQUESTS per IP per WINDOW_MS.
// Note: each Vercel function instance has its own memory, so this is a
// best-effort limit. For stricter limits, swap this for Vercel KV or Upstash.
const MAX_REQUESTS  = 20;   // requests per window
const WINDOW_MS     = 60 * 60 * 1000; // 1 hour

const ipMap = new Map(); // { ip: { count, resetAt } }

function isRateLimited(ip) {
  const now  = Date.now();
  const entry = ipMap.get(ip);

  if (!entry || now > entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  if (entry.count > MAX_REQUESTS) return true;
  return false;
}

// ── CORS helper ───────────────────────────────────────────────────────────────
function setCors(res) {
  // Allow requests from the Chrome extension (chrome-extension://*) and any origin
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

// ── Handler ───────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  setCors(res);

  // Preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Rate limit by IP
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Too many requests. Please try again later." });
  }

  // Validate body
  const { model, max_tokens, system, messages } = req.body ?? {};
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid request body." });
  }

  // Forward to Anthropic
  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY, // set this in Vercel dashboard
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model:      model      ?? "claude-opus-4-8",
        max_tokens: max_tokens ?? 1024,
        system,
        messages,
      }),
    });

    const data = await anthropicRes.json();

    if (!anthropicRes.ok) {
      return res.status(anthropicRes.status).json({ error: data?.error?.message ?? "Anthropic error" });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("ChikaChan proxy error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
}
