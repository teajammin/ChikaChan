// crunchyAI.js — ChikaChan AI logic for Crunchyroll
// Defines window.crRecommend (separate from window.chikaRecommend used on MAL).

(function () {
  const PROXY_URL = "https://chika-chan.vercel.app/api/chat";
  const MODEL     = "claude-opus-4-8";

  function buildWatchContext(watchedSeries) {
    if (!watchedSeries || !watchedSeries.length) {
      return "The user's Crunchyroll watch history is unavailable. Recommend well-regarded anime available on Crunchyroll.";
    }
    const titles = watchedSeries.map(s => s.title);
    let ctx  = `=== DO NOT RECOMMEND ANY OF THESE ${titles.length} SERIES ===\n`;
    ctx += "The user has already watched or started watching all of these on Crunchyroll.\n";
    ctx += titles.map(t => `- ${t}`).join("\n");
    ctx += "\n\nUse these titles to understand what genres, themes, and styles the user enjoys.\n";
    ctx += "Infer their taste from what they've chosen to watch — variety, length, tone, themes.";
    return ctx;
  }

  function buildFilterContext(filters) {
    if (!filters || !Object.keys(filters).length) return "No filters — recommend based on watch history taste alone.";
    return "Active filters:\n" + Object.entries(filters).map(([k, v]) => `  ${k}: ${v.join(", ")}`).join("\n");
  }

  async function callProxy(system, userContent) {
    const res = await fetch(PROXY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2500,
        system,
        messages: [{ role: "user", content: userContent }],
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error ?? `Server error ${res.status}`);
    }
    const data = await res.json();
    return data.content?.[0]?.text ?? "";
  }

  window.crRecommend = async function ({ filters, watchedSeries, similarTo, extra }) {
    const system = `You are ChikaChan, an expert anime recommendation AI for Crunchyroll users.
Return ONLY a valid JSON array of exactly 10 anime recommendations, ordered from strongest to least recommended match.
No prose, no markdown, just raw JSON.

══════════════════════════════════════════
🚫 ABSOLUTE RULE — ZERO EXCEPTIONS:
══════════════════════════════════════════
NEVER recommend ANY anime the user has already watched or started on Crunchyroll.

⚠️ ROMANISATION WARNING: The watch history may use Japanese titles (e.g. "Shingeki no Kyojin") OR English titles (e.g. "Attack on Titan"). They are the SAME anime. Check BOTH the Japanese romanisation AND the English title of every candidate before recommending it.

Before finalising each recommendation, ask yourself:
1. "Does this title — in any language or romanisation — appear in the exclusion list?"
2. "Is this anime known by an alternative title that IS in the exclusion list?"
If yes to either — discard it and pick something else.
If you recommend anything from the exclusion list it is a complete failure.
══════════════════════════════════════════

Prioritise anime available on Crunchyroll.

Each object must have these fields:
{
  "title": "Exact anime title as known on Crunchyroll",
  "cr_url": "https://www.crunchyroll.com/search?q=TITLE_URL_ENCODED",
  "genre": "Primary genre",
  "type": "e.g. TV Series / Movie / OVA",
  "episodes": "number or unknown",
  "score": "MAL score or estimated score e.g. 8.4",
  "reason": "2 sentences explaining why this fits the user's taste and filters"
}

Prioritise diversity — don't repeat the same studio or franchise.`;

    let userContent = `${buildWatchContext(watchedSeries)}\n\n${buildFilterContext(filters)}`;
    if (similarTo) userContent += `\n\nSimilar to: "${similarTo.label}" — recommend anime with a similar vibe, story, or style.`;
    if (extra)     userContent += `\n\nAdditional request from user: "${extra}"`;
    userContent += "\n\nGive me 10 recommendations.";

    const raw     = await callProxy(system, userContent);
    const cleaned = raw.replace(/```json|```/g, "").trim();
    try {
      return JSON.parse(cleaned);
    } catch {
      throw new Error("ChikaChan returned an unexpected format. Please try again.");
    }
  };
})();
