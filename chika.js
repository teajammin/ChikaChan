// chika.js — ChikaChan AI logic
// Calls the Vercel proxy which holds the Anthropic key server-side.

(function () {
  const PROXY_URL = "https://chika-chan.vercel.app/api/chat";
  const MODEL = "claude-opus-4-8";

  // ── Shared helpers ────────────────────────────────────────────────────────────
  function buildListContext(animeList) {
    if (!animeList || !animeList.length) {
      return "The user's anime list is unavailable. Recommend popular titles they may not have seen.";
    }
    // Split into taste context (rated) vs exclusion list (everything)
    const rated   = animeList.filter(a => parseFloat(a.score) >= 1);
    const allTitles = animeList.map(a => a.title);

    let ctx = `EXCLUSION LIST — never recommend any of these ${allTitles.length} titles the user has already seen:\n`;
    ctx += allTitles.map(t => `- ${t}`).join("\n");
    ctx += "\n\n";

    if (rated.length) {
      const top = rated.sort((a, b) => parseFloat(b.score) - parseFloat(a.score)).slice(0, 40);
      ctx += `User's top-rated anime (use these to understand their taste):\n`;
      ctx += top.map(a => `- ${a.title} | ${a.score}`).join("\n");
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
        max_tokens: 1500,
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
Return ONLY a valid JSON array of exactly 6 anime recommendations, ordered from strongest to least recommended match.
No prose, no markdown, just raw JSON.

IMPORTANT: Never recommend anything that appears in the user's anime list. They have already seen those.

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
    userContent += "\n\nGive me 6 recommendations.";

    const raw = await callProxy(system, userContent);
    const cleaned = raw.replace(/```json|```/g, "").trim();
    try {
      return JSON.parse(cleaned);
    } catch {
      throw new Error("ChikaChan returned an unexpected format. Please try again.");
    }
  };

  // ── chikaAsk — free-form chat ─────────────────────────────────────────────────
  window.chikaAsk = async function ({ userText, filters, animeList }) {
    const system = `You are ChikaChan, a cheerful, knowledgeable anime recommendation AI.
Personality: warm, enthusiastic, concise. Use light anime vocabulary naturally.
Answer the user's question conversationally. If recommending, suggest 1–3 titles with a brief reason each.`;

    const userContent = `${buildListContext(animeList)}\n\n${buildFilterContext(filters)}\n\nUser: "${userText}"`;

    return callProxy(system, userContent);
  };
})();
