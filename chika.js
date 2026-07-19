// chika.js — ChikaChan AI logic
// Calls the Vercel proxy which holds the Anthropic key server-side.

(function () {
  const PROXY_URL = "https://chika-chan.vercel.app/api/chat";
  const MODEL = "claude-opus-4-8";

  // ── Shared helpers ────────────────────────────────────────────────────────────
  function buildListContext(animeList) {
    if (!animeList || !animeList.length) {
      return "The user's anime list is unavailable. Recommend well-regarded but niche titles.";
    }

    // Official MAL API v2 returns string statuses
    const completed   = animeList.filter(a => a.status === "completed"     || a.status === "watching");
    const unwanted    = animeList.filter(a => a.status === "on_hold"       || a.status === "dropped");
    const planToWatch = animeList.filter(a => a.status === "plan_to_watch");
    const allTitles   = animeList.map(a => a.title);

    // Full exclusion list — every title regardless of status
    let ctx = `=== DO NOT RECOMMEND ANY OF THESE ${allTitles.length} TITLES ===\n`;
    ctx += `The user has already seen or is aware of all of them.\n`;
    ctx += allTitles.map(t => `- ${t}`).join("\n");
    ctx += "\n\n";

    // Call out dropped/on-hold explicitly so they aren't treated as favourites
    if (unwanted.length) {
      ctx += `The following were DROPPED or put ON HOLD — the user did not enjoy them, do NOT recommend similar shows:\n`;
      ctx += unwanted.map(a => `- ${a.title}`).join("\n");
      ctx += "\n\n";
    }

    // Taste signal from well-rated completed anime only
    const rated = completed.filter(a => parseFloat(a.score) >= 7);
    if (rated.length) {
      const top = rated.sort((a, b) => parseFloat(b.score) - parseFloat(a.score)).slice(0, 40);
      ctx += `User's favourite anime (use ONLY these to understand their taste — do NOT recommend them):\n`;
      ctx += top.map(a => `- ${a.title} | ${a.score}/10`).join("\n");
    }

    return ctx;
  }

  function buildFilterContext(filters) {
    if (!filters || !Object.keys(filters).length) return "No filters — recommend based on list taste alone.";
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

  // ── chikaRecommend — returns structured JSON for card rendering ───────────────
  window.chikaRecommend = async function ({ filters, animeList, similarTo, character, extra }) {
    const system = `You are ChikaChan, an expert anime recommendation AI.
Return ONLY a valid JSON array of exactly 10 anime recommendations, ordered from strongest to least recommended match.
No prose, no markdown, just raw JSON.

══════════════════════════════════════════
🚫 ABSOLUTE RULE — ZERO EXCEPTIONS:
══════════════════════════════════════════
NEVER recommend ANY anime that appears in the user's list.
This includes:
  • Completed anime   — the user has already seen it
  • On-hold anime     — the user started and stopped; do NOT revisit
  • Dropped anime     — the user disliked it; never recommend it
  • Watching anime    — already in progress
  • Plan-to-watch     — the user already knows about it

⚠️ ROMANISATION WARNING: The exclusion list may use Japanese titles (e.g. "Shingeki no Kyojin") OR English titles (e.g. "Attack on Titan"). They are the SAME anime. Check BOTH the Japanese romanisation AND the English title of every candidate before recommending it.

Before finalising each recommendation, ask yourself:
1. "Does this title — in any language or romanisation — appear in the exclusion list?"
2. "Is this anime known by an alternative title that IS in the exclusion list?"
If yes to either — discard it and pick something else.
If you recommend anything from the exclusion list it is a complete failure.
══════════════════════════════════════════

Each object must have these fields:
{
  "title": "Exact anime title",
  "mal_url": "https://myanimelist.net/anime/ANIME_ID/",
  "genre": "Primary genre",
  "type": "e.g. TV Series / Movie / OVA",
  "episodes": "number or unknown",
  "score": "MAL score e.g. 8.4",
  "reason": "2 sentences explaining why this fits the user's taste and filters"
}

If you don't know the exact MAL ID, use: "https://myanimelist.net/anime.php?q=TITLE&cat=anime" with the title URL-encoded.
Prioritise diversity — don't repeat the same studio or franchise.`;

    let userContent = `${buildListContext(animeList)}\n\n${buildFilterContext(filters)}`;
    if (similarTo)  userContent += `\n\nSimilar to: "${similarTo.label}" — recommend anime with a similar vibe, story, or style.`;
    if (character)  userContent += `\n\nLead character: "${character.label}" — recommend anime featuring this character or a similar character archetype.`;
    if (extra)      userContent += `\n\nAdditional request from user: "${extra}"`;
    userContent += "\n\nGive me 10 recommendations.";

    const raw = await callProxy(system, userContent);
    const cleaned = raw.replace(/```json|```/g, "").trim();
    try {
      return JSON.parse(cleaned);
    } catch {
      throw new Error("ChikaChan returned an unexpected format. Please try again.");
    }
  };


})();
