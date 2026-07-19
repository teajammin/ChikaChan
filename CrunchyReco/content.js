// content.js — injects the ChikaChan sidebar into Crunchyroll pages

(function () {
  if (document.getElementById("chika-root")) return;

  // ── ChikaChan character SVGs ──────────────────────────────────────────────────
  const CHIKA_FACE_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 48 Q19 16 50 11 Q81 16 82 48 Q84 62 82 74 Q76 62 72 52 Q64 38 50 37 Q36 38 28 52 Q24 62 18 74 Q16 62 18 48Z" fill="#7A4B28"/>
    <path d="M18 54 Q12 68 14 80 Q18 70 22 58Z" fill="#7A4B28"/>
    <path d="M82 54 Q88 68 86 80 Q82 70 78 58Z" fill="#7A4B28"/>
    <path d="M24 20 Q50 13 76 22" fill="none" stroke="#A06830" stroke-width="3" opacity="0.5" stroke-linecap="round"/>
    <path d="M18 38 Q30 30 42 34" fill="none" stroke="#A06830" stroke-width="2" opacity="0.35" stroke-linecap="round"/>
    <ellipse cx="50" cy="56" rx="27" ry="31" fill="#FDDBB4"/>
    <path d="M20 46 Q24 26 50 22 Q70 25 80 44 Q70 33 50 34 Q30 34 22 46Z" fill="#8B5534"/>
    <path d="M44 22 Q46 28 44 34" fill="none" stroke="#9B6038" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M29 47 Q36 44 44 46" fill="none" stroke="#5A3218" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M56 46 Q64 44 71 47" fill="none" stroke="#5A3218" stroke-width="2.6" stroke-linecap="round"/>
    <ellipse cx="37" cy="54" rx="9" ry="10" fill="white"/>
    <ellipse cx="37" cy="55" rx="7" ry="8" fill="#7B4F26"/>
    <ellipse cx="37" cy="56" rx="5.5" ry="6.5" fill="#5C3215"/>
    <ellipse cx="37" cy="57" rx="3.5" ry="4.5" fill="#1a0d06"/>
    <ellipse cx="37" cy="55" rx="7" ry="8" fill="none" stroke="#3a1a08" stroke-width="1.2"/>
    <ellipse cx="37" cy="58" rx="5" ry="3.5" fill="#7B4F26" opacity="0.45"/>
    <circle cx="40" cy="50" r="3" fill="white"/>
    <circle cx="35" cy="57" r="1.4" fill="white" opacity="0.75"/>
    <path d="M29 62 Q37 65 45 62" fill="none" stroke="#5C3215" stroke-width="1.2" opacity="0.5" stroke-linecap="round"/>
    <ellipse cx="63" cy="54" rx="9" ry="10" fill="white"/>
    <ellipse cx="63" cy="55" rx="7" ry="8" fill="#7B4F26"/>
    <ellipse cx="63" cy="56" rx="5.5" ry="6.5" fill="#5C3215"/>
    <ellipse cx="63" cy="57" rx="3.5" ry="4.5" fill="#1a0d06"/>
    <ellipse cx="63" cy="55" rx="7" ry="8" fill="none" stroke="#3a1a08" stroke-width="1.2"/>
    <ellipse cx="63" cy="58" rx="5" ry="3.5" fill="#7B4F26" opacity="0.45"/>
    <circle cx="66" cy="50" r="3" fill="white"/>
    <circle cx="61" cy="57" r="1.4" fill="white" opacity="0.75"/>
    <path d="M55 62 Q63 65 71 62" fill="none" stroke="#5C3215" stroke-width="1.2" opacity="0.5" stroke-linecap="round"/>
    <path d="M28 46 Q33 43 37 44 Q41 43 46 46" fill="none" stroke="#1a0d06" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M54 46 Q59 43 63 44 Q67 43 72 46" fill="none" stroke="#1a0d06" stroke-width="2.4" stroke-linecap="round"/>
    <rect x="26" y="45" width="22" height="17" rx="4" fill="rgba(140,170,220,0.07)" stroke="#1a1a1a" stroke-width="2.2"/>
    <rect x="52" y="45" width="22" height="17" rx="4" fill="rgba(140,170,220,0.07)" stroke="#1a1a1a" stroke-width="2.2"/>
    <line x1="48" y1="53" x2="52" y2="53" stroke="#1a1a1a" stroke-width="2.2"/>
    <line x1="26" y1="52" x2="18" y2="49" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round"/>
    <line x1="74" y1="52" x2="82" y2="49" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round"/>
    <path d="M28 47 Q32 46 34 47" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M54 47 Q58 46 60 47" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.4" stroke-linecap="round"/>
    <ellipse cx="27" cy="65" rx="7" ry="4.5" fill="#FFB0A0" opacity="0.38"/>
    <ellipse cx="73" cy="65" rx="7" ry="4.5" fill="#FFB0A0" opacity="0.38"/>
    <path d="M47 70 Q50 73 53 70" fill="none" stroke="#C9906A" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M41 79 Q50 86 59 79" fill="none" stroke="#C07060" stroke-width="2.3" stroke-linecap="round"/>
    <rect x="43" y="86" width="14" height="8" rx="4" fill="#FDDBB4"/>
  </svg>`;

  const CHIKA_AVATAR_SVG = `<svg class="chika-header-avatar" viewBox="0 0 52 58" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 24 Q9 7 26 4 Q43 7 44 24 Q45 33 44 40 Q41 33 39 26 Q34 19 26 19 Q18 19 13 26 Q11 33 8 40 Q7 33 8 24Z" fill="#7A4B28"/>
    <path d="M8 27 Q4 36 6 44 Q10 37 12 30Z" fill="#7A4B28"/>
    <path d="M44 27 Q48 36 46 44 Q42 37 40 30Z" fill="#7A4B28"/>
    <ellipse cx="26" cy="30" rx="16" ry="18" fill="#FDDBB4"/>
    <path d="M10 23 Q13 13 26 10 Q39 12 42 22 Q37 16 26 17 Q15 16 12 23Z" fill="#8B5534"/>
    <path d="M22 11 Q23 15 22 19" fill="none" stroke="#9B6038" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M12 22 Q16 19.5 20 21" fill="none" stroke="#5A3218" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M32 21 Q36 19.5 40 22" fill="none" stroke="#5A3218" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M12 26 Q16 23.5 20 26" fill="none" stroke="#1a0d06" stroke-width="2" stroke-linecap="round"/>
    <path d="M32 26 Q36 23.5 40 26" fill="none" stroke="#1a0d06" stroke-width="2" stroke-linecap="round"/>
    <path d="M13 25 Q16 23 19 25" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1" stroke-linecap="round"/>
    <path d="M33 25 Q36 23 39 25" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1" stroke-linecap="round"/>
    <rect x="10" y="23" width="13" height="9" rx="2.5" fill="none" stroke="#1a1a1a" stroke-width="1.7"/>
    <rect x="29" y="23" width="13" height="9" rx="2.5" fill="none" stroke="#1a1a1a" stroke-width="1.7"/>
    <line x1="23" y1="27" x2="29" y2="27" stroke="#1a1a1a" stroke-width="1.7"/>
    <line x1="10" y1="27" x2="5"  y2="24" stroke="#1a1a1a" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="42" y1="27" x2="47" y2="24" stroke="#1a1a1a" stroke-width="1.5" stroke-linecap="round"/>
    <ellipse cx="14" cy="35" rx="5.5" ry="3.5" fill="#FFB0A0" opacity="0.55"/>
    <ellipse cx="38" cy="35" rx="5.5" ry="3.5" fill="#FFB0A0" opacity="0.55"/>
    <path d="M18 40 Q26 49 34 40 L33 37 Q26 41 19 37Z" fill="#cc5555"/>
    <path d="M19 37 Q26 40 33 37" fill="rgba(255,255,255,0.55)"/>
    <ellipse cx="26" cy="46" rx="6" ry="4.5" fill="#e87080"/>
    <line x1="40" y1="48" x2="44" y2="39" stroke="#FDDBB4" stroke-width="3.2" stroke-linecap="round"/>
    <line x1="43" y1="49" x2="48" y2="40" stroke="#FDDBB4" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M38 51 Q41 56 45 51 L44 49 Q41 53 39 49Z" fill="#FDDBB4"/>
    <line x1="47" y1="43" x2="50" y2="48" stroke="#FDDBB4" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="37" y1="43" x2="35" y2="49" stroke="#FDDBB4" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`;

  const CHIKA_BODY_SVG = `<svg width="58" height="132" viewBox="0 0 58 132" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 27 Q11 8 29 5 Q47 8 48 27 Q49 37 48 44 Q44 36 42 29 Q36 21 29 21 Q22 21 16 29 Q14 36 10 44 Q9 37 10 27Z" fill="#7A4B28"/>
    <path d="M10 30 Q6 40 8 50 Q12 42 14 33Z" fill="#7A4B28"/>
    <path d="M48 30 Q52 40 50 50 Q46 42 44 33Z" fill="#7A4B28"/>
    <ellipse cx="29" cy="32" rx="17" ry="19" fill="#FDDBB4"/>
    <path d="M12 26 Q15 14 29 11 Q42 13 46 25 Q40 18 29 19 Q18 19 14 26Z" fill="#8B5534"/>
    <path d="M25 12 Q26 16 25 20" fill="none" stroke="#9B6038" stroke-width="2" stroke-linecap="round"/>
    <path d="M17 29 Q21 27 25 28" fill="none" stroke="#5A3218" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M33 28 Q37 27 41 29" fill="none" stroke="#5A3218" stroke-width="1.8" stroke-linecap="round"/>
    <ellipse cx="22" cy="31" rx="5.5" ry="6.5" fill="white"/>
    <ellipse cx="36" cy="31" rx="5.5" ry="6.5" fill="white"/>
    <ellipse cx="22" cy="32" rx="4.5" ry="5.5" fill="#7B4F26"/>
    <ellipse cx="36" cy="32" rx="4.5" ry="5.5" fill="#7B4F26"/>
    <ellipse cx="22" cy="33" rx="3" ry="4" fill="#1a0d06"/>
    <ellipse cx="36" cy="33" rx="3" ry="4" fill="#1a0d06"/>
    <circle cx="24" cy="28.5" r="1.9" fill="white"/>
    <circle cx="38" cy="28.5" r="1.9" fill="white"/>
    <circle cx="21" cy="34" r="1" fill="white" opacity="0.7"/>
    <circle cx="35" cy="34" r="1" fill="white" opacity="0.7"/>
    <path d="M16.5 26 Q19.5 24 22 25 Q24.5 24 27.5 26" fill="none" stroke="#1a0d06" stroke-width="1.7" stroke-linecap="round"/>
    <path d="M30.5 26 Q33.5 24 36 25 Q38.5 24 41.5 26" fill="none" stroke="#1a0d06" stroke-width="1.7" stroke-linecap="round"/>
    <rect x="15" y="26" width="14" height="11" rx="2.8" fill="none" stroke="#1a1a1a" stroke-width="1.7"/>
    <rect x="29" y="26" width="14" height="11" rx="2.8" fill="none" stroke="#1a1a1a" stroke-width="1.7"/>
    <line x1="15" y1="30.5" x2="10" y2="28" stroke="#1a1a1a" stroke-width="1.6" stroke-linecap="round"/>
    <line x1="43" y1="30.5" x2="48" y2="28" stroke="#1a1a1a" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M16 27.5 Q19 26.5 21 27.5" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M30 27.5 Q33 26.5 35 27.5" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="1.2" stroke-linecap="round"/>
    <ellipse cx="16" cy="37" rx="4.5" ry="3" fill="#FFB0A0" opacity="0.38"/>
    <ellipse cx="42" cy="37" rx="4.5" ry="3" fill="#FFB0A0" opacity="0.38"/>
    <path d="M23 43 Q29 48 35 43" fill="none" stroke="#C07060" stroke-width="1.7" stroke-linecap="round"/>
    <rect x="25" y="50" width="8" height="6" rx="2.5" fill="#FDDBB4"/>
    <path d="M17 55 L25 58 L29 54 L33 58 L41 55 L38 51 Q34 49 29 49 Q24 49 20 51Z" fill="#F0F0F0"/>
    <path d="M5 56 L27 56 L25 96 L3 94Z" fill="#3C3C3C"/>
    <path d="M31 56 L53 56 L55 94 L33 96Z" fill="#3C3C3C"/>
    <path d="M5 56 L15 61 L21 72 L29 56Z" fill="#3C3C3C"/>
    <path d="M15 61 L21 72 L29 56 L25 56Z" fill="#F0F0F0"/>
    <path d="M53 56 L43 61 L37 72 L29 56Z" fill="#3C3C3C"/>
    <path d="M43 61 L37 72 L29 56 L33 56Z" fill="#F0F0F0"/>
    <circle cx="29" cy="68" r="1.2" fill="#BBBBBB"/>
    <circle cx="29" cy="74" r="1.2" fill="#BBBBBB"/>
    <circle cx="29" cy="80" r="1.2" fill="#BBBBBB"/>
    <circle cx="29" cy="86" r="2.2" fill="#555" stroke="#2a2a2a" stroke-width="0.6"/>
    <path d="M9 76 Q14 74 18 76 Q14 79 9 76Z" fill="#444"/>
    <path d="M40 76 Q44 74 49 76 Q44 79 40 76Z" fill="#444"/>
    <path d="M5 56 L1 84 Q1 90 4.5 90 Q8 90 9 84 L12 58Z" fill="#3C3C3C" class="chika-arm-l"/>
    <path d="M53 56 L57 84 Q57 90 53.5 90 Q50 90 49 84 L46 58Z" fill="#3C3C3C" class="chika-arm-r"/>
    <ellipse cx="3.5"  cy="92.5" rx="4.5" ry="4" fill="#FDDBB4"/>
    <ellipse cx="54.5" cy="92.5" rx="4.5" ry="4" fill="#FDDBB4"/>
    <path d="M3 94 L7 124 L51 124 L55 94Z" fill="#3C3C3C"/>
    <rect x="16" y="122" width="11" height="10" rx="3.5" fill="#FDDBB4" class="chika-leg-l"/>
    <rect x="31" y="122" width="11" height="10" rx="3.5" fill="#FDDBB4" class="chika-leg-r"/>
  </svg>`;

  // ── Detect Crunchyroll theme ──────────────────────────────────────────────────
  function getCRColors() {
    const bodyBg    = getComputedStyle(document.body).backgroundColor;
    const rgb       = bodyBg.match(/\d+/g)?.map(Number) || [20, 21, 25];
    const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    const isDark    = brightness < 140;

    // Try to pick up CR's nav/header background
    const navEl  = document.querySelector("header, nav, [class*='header']");
    const navBg  = navEl ? getComputedStyle(navEl).backgroundColor : null;
    const validNavBg = navBg && navBg !== "rgba(0, 0, 0, 0)" && navBg !== "transparent"
      ? navBg : (isDark ? "#1c1d23" : "#f2f2f2");

    return {
      isDark,
      headerColor: validNavBg,
      panelBg:     isDark ? "#141519" : "#ffffff",
      panelBg2:    isDark ? "#1c1d23" : "#f5f5f5",
      textColor:   isDark ? "#ffffff" : "#1a1a1a",
      mutedColor:  isDark ? "#9098a0" : "#666",
      borderColor: isDark ? "rgba(255,255,255,0.1)"  : "rgba(0,0,0,0.1)",
      chipBg:      isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
      chipText:    isDark ? "#c0c8d8" : "#444",
      inputBg:     isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
      accentColor: "#f47521",
      btnColor:    "#f47521",
    };
  }

  function applyTheme() {
    const c = getCRColors();
    const existing = document.getElementById("chika-theme");
    if (existing) existing.remove();
    const style = document.createElement("style");
    style.id = "chika-theme";
    style.textContent = `
      #chika-panel {
        --chika-bg:       ${c.panelBg};
        --chika-bg2:      ${c.panelBg2};
        --chika-text:     ${c.textColor};
        --chika-muted:    ${c.mutedColor};
        --chika-border:   ${c.borderColor};
        --chika-chip-bg:  ${c.chipBg};
        --chika-chip-txt: ${c.chipText};
        --chika-input-bg: ${c.inputBg};
        --chika-accent:   ${c.accentColor};
        --chika-header:   ${c.headerColor};
        --chika-btn:      ${c.btnColor};
        background: var(--chika-bg) !important;
        color: var(--chika-text) !important;
      }
    `;
    document.head.appendChild(style);
  }

  applyTheme();

  // ── Crunchyroll session / auth ────────────────────────────────────────────────
  function getCRSession() {
    // Try __NEXT_DATA__ (Next.js server-side props embedded in the page)
    try {
      const el = document.getElementById("__NEXT_DATA__");
      if (el) {
        const nd    = JSON.parse(el.textContent);
        const props = nd?.props?.pageProps;
        const auth  = props?.session || props?.auth || props?.initialUser;
        if (auth) {
          const token     = auth.accessToken || auth.access_token;
          const accountId = auth.accountId   || auth.account_id  || auth.id;
          if (token || accountId) return { token, accountId };
        }
      }
    } catch {}

    // Fallback: scan localStorage for CR auth tokens
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        try {
          const val = JSON.parse(localStorage.getItem(key) || "");
          const token     = val?.access_token || val?.accessToken;
          const accountId = val?.account_id   || val?.accountId;
          if (token || accountId) return { token, accountId };
        } catch {}
      }
    } catch {}

    return null;
  }

  // ── Fetch watch history from CR v2 API ───────────────────────────────────────
  async function fetchCRHistory() {
    const session = getCRSession();
    if (!session?.accountId) return null;

    const headers = { "Content-Type": "application/json" };
    if (session.token) headers["Authorization"] = `Bearer ${session.token}`;

    const seen = new Map(); // keyed by series_id to deduplicate episodes
    let start  = 0;
    const pageSize = 100;

    while (true) {
      try {
        const url = `https://www.crunchyroll.com/content/v2/discover/${session.accountId}/history?page_size=${pageSize}&start=${start}&locale=en-US`;
        const res = await fetch(url, { headers, credentials: "include" });
        if (!res.ok) break;

        const data  = await res.json();
        const items = data.data || [];
        if (!items.length) break;

        for (const item of items) {
          const meta = item.panel?.episode_metadata;
          if (!meta?.series_id || seen.has(meta.series_id)) continue;
          seen.set(meta.series_id, {
            title:     meta.series_title,
            seriesId:  meta.series_id,
            slugTitle: meta.series_slug_title,
          });
        }

        if (items.length < pageSize) break;
        start += pageSize;
        if (start >= 1000) break;
      } catch { break; }
    }

    return seen.size ? [...seen.values()] : null;
  }

  // Fallback: scrape series titles visible on the current CR page
  function scrapeCRPage() {
    const selectors = [
      'a[href*="/series/"] h4',
      'a[href*="/series/"] span',
      '[data-t="title"]',
      '[class*="SeriesCard"] [class*="title"]',
    ];
    const found = new Set();
    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach(el => {
        const t = el.textContent.trim();
        if (t && t.length > 1 && t.length < 200) found.add(t);
      });
    }
    return found.size ? [...found].map(title => ({ title })) : null;
  }

  // ── CR catalog search (autocomplete + card resolution) ───────────────────────
  async function searchCRSeries(q) {
    const url = `https://www.crunchyroll.com/content/v2/discover/search?q=${encodeURIComponent(q)}&n=7&locale=en-US&ratings=true&type=series`;
    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) throw new Error(`Search error ${res.status}`);
    const data = await res.json();

    // CR returns data as array of category objects; find the series category
    const cat   = data.data?.find(c => c.type === "series") || data.data?.[0];
    const items = cat?.items || [];

    return items.map(item => ({
      label:    item.title,
      value:    item.id,
      url:      `https://www.crunchyroll.com/series/${item.id}/${item.slug_title || ""}`,
      imageUrl: item.images?.poster_tall?.[0]?.slice(-1)[0]?.source
             || item.images?.thumbnail?.[0]?.slice(-1)[0]?.source,
    }));
  }

  async function resolveCRData(title) {
    try {
      const results = await searchCRSeries(title);
      if (!results.length) return null;
      const match = results.find(r => r.label.toLowerCase() === title.toLowerCase()) || results[0];
      return { url: match.url, imageUrl: match.imageUrl };
    } catch { return null; }
  }

  // ── Filter definitions ────────────────────────────────────────────────────────
  const FILTERS = [
    {
      key: "genre",
      label: "Genre",
      options: [
        "Action","Adventure","Comedy","Drama","Fantasy","Horror","Mystery",
        "Psychological","Romance","Sci-Fi","Slice of Life","Sports","Supernatural",
        "Thriller","Ecchi","Harem","Reverse Harem","Isekai","Magical Girl","Mecha",
        "Shounen","Shoujo","Seinen","Josei","Yaoi / BL","Yuri / GL","Idol","Villainess"
      ]
    },
    {
      key: "format",
      label: "Format",
      options: ["TV Series","Movie","OVA","ONA","Special","Short"]
    },
    {
      key: "length",
      label: "Series Length",
      options: ["1-12 eps","13-26 eps","27-50 eps","50+ eps","Movie (1 ep)"]
    },
    {
      key: "character",
      label: "Character Type",
      options: [
        "Tsundere","Kuudere","Dandere","Yandere","Genki","Anti-hero",
        "Overpowered MC","Underdog MC","Villain MC","Found Family",
        "Rivals to Lovers","Female Lead","Male Lead","Ensemble Cast"
      ]
    }
  ];

  function buildFilters() {
    return FILTERS.map(({ key, label, options }) => `
      <div class="chika-filter-group">
        <span class="chika-filter-group-title">${label}</span>
        <div class="chika-chips" data-filter="${key}">
          <button class="chika-chip chika-chip-any active" data-value="any">Any</button>
          ${options.map(o => `<button class="chika-chip" data-value="${o}">${o}</button>`).join("")}
        </div>
      </div>
    `).join("");
  }

  // ── Root HTML ─────────────────────────────────────────────────────────────────
  const root = document.createElement("div");
  root.id    = "chika-root";
  root.innerHTML = `
    <div id="chika-toggle" title="Open ChikaChan">
      <div class="chika-toggle-inner">
        <div class="chika-toggle-face">${CHIKA_FACE_SVG}</div>
        <div class="chika-toggle-handle"></div>
      </div>
    </div>
    <div id="chika-panel" class="chika-hidden">
      <div id="chika-header">
        <span id="chika-title">${CHIKA_AVATAR_SVG}ChikaChan</span>
        <button id="chika-close" title="Close">&#10005;</button>
      </div>

      <div class="chika-autocomplete-dropdown" id="chika-similar-dropdown"></div>
      <div class="chika-autocomplete-dropdown" id="chika-char-dropdown"></div>

      <div id="chika-view-filters">
        <div id="chika-filters">
          <p class="chika-filter-label" style="margin-top:10px;">Tell Chika what you're looking for</p>
          ${buildFilters()}

          <div class="chika-filter-group">
            <span class="chika-filter-group-title">Similar to <span class="chika-optional">(optional)</span></span>
            <div class="chika-autocomplete-wrap">
              <input class="chika-autocomplete-input" id="chika-similar-input" type="text" placeholder="Type a series title..." autocomplete="off" />
              <span class="chika-autocomplete-error" id="chika-similar-error"></span>
            </div>
          </div>

          <div class="chika-filter-group">
            <span class="chika-filter-group-title">Anything else? <span class="chika-optional">(optional)</span></span>
            <textarea id="chika-extra" class="chika-extra-input" placeholder="e.g. slow burn romance, set in feudal Japan..." rows="3"></textarea>
          </div>
        </div>

        <div id="chika-filter-footer">
          <button id="chika-get-recs">Get Recommendations</button>
        </div>
      </div>

      <div id="chika-view-recs" class="chika-hidden">
        <div id="chika-recs-header">
          <button id="chika-back">Back to Filters</button>
          <span>Top picks for you</span>
        </div>
        <div id="chika-rec-list"></div>
      </div>
    </div>
  `;
  document.body.appendChild(root);

  // ── Refs ──────────────────────────────────────────────────────────────────────
  const panel       = document.getElementById("chika-panel");
  const toggle      = document.getElementById("chika-toggle");
  const closeBtn    = document.getElementById("chika-close");
  const viewFilters = document.getElementById("chika-view-filters");
  const viewRecs    = document.getElementById("chika-view-recs");
  const recList     = document.getElementById("chika-rec-list");
  const getRecsBtn  = document.getElementById("chika-get-recs");
  const backBtn     = document.getElementById("chika-back");
  const extraInput  = document.getElementById("chika-extra");

  function openPanel()  { panel.classList.remove("chika-hidden"); toggle.classList.add("chika-toggle-hidden"); }
  function closePanel() { panel.classList.add("chika-hidden");    toggle.classList.remove("chika-toggle-hidden"); }

  toggle.addEventListener("click",   openPanel);
  closeBtn.addEventListener("click", closePanel);
  backBtn.addEventListener("click",  () => {
    viewRecs.classList.add("chika-hidden");
    viewFilters.classList.remove("chika-hidden");
  });

  // ── Filter chips ──────────────────────────────────────────────────────────────
  document.querySelectorAll(".chika-chips").forEach(group => {
    const anyChip = group.querySelector(".chika-chip-any");
    group.querySelectorAll(".chika-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        if (chip.classList.contains("chika-chip-any")) {
          group.querySelectorAll(".chika-chip").forEach(c => c.classList.remove("active"));
          chip.classList.add("active");
        } else {
          anyChip?.classList.remove("active");
          chip.classList.toggle("active");
          const hasActive = [...group.querySelectorAll(".chika-chip:not(.chika-chip-any)")].some(c => c.classList.contains("active"));
          if (!hasActive) anyChip?.classList.add("active");
        }
      });
    });
  });

  function getActiveFilters() {
    const filters = {};
    document.querySelectorAll(".chika-chips[data-filter]").forEach(group => {
      const key = group.dataset.filter;
      if (group.querySelector(".chika-chip-any")?.classList.contains("active")) return;
      const active = [...group.querySelectorAll(".chika-chip:not(.chika-chip-any).active")].map(c => c.dataset.value);
      if (active.length) filters[key] = active;
    });
    return filters;
  }

  // ── Autocomplete ──────────────────────────────────────────────────────────────
  let selectedSimilar = null;

  function setupAutocomplete(inputId, dropdownId, errorId, fetchFn, onSelect, onClear) {
    const input    = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);
    const errorEl  = document.getElementById(errorId);
    let debounce   = null;

    function positionDropdown() {
      const ir = input.getBoundingClientRect();
      const pr = panel.getBoundingClientRect();
      dropdown.style.top   = (ir.bottom - pr.top + 4) + "px";
      dropdown.style.left  = (ir.left   - pr.left) + "px";
      dropdown.style.width = ir.width + "px";
    }

    function showItems(results) {
      dropdown.innerHTML = "";
      if (!results.length) {
        const empty = document.createElement("div");
        empty.className   = "chika-ac-item chika-ac-empty";
        empty.textContent = "No results found";
        dropdown.appendChild(empty);
      } else {
        results.forEach(r => {
          const item = document.createElement("div");
          item.className   = "chika-ac-item";
          item.textContent = r.label;
          item.addEventListener("mousedown", e => {
            e.preventDefault();
            input.value = r.label;
            onSelect(r);
            dropdown.classList.remove("open");
            errorEl.textContent = "";
          });
          dropdown.appendChild(item);
        });
      }
      positionDropdown();
      dropdown.classList.add("open");
    }

    input.addEventListener("input", () => {
      errorEl.textContent = "";
      onClear();
      clearTimeout(debounce);
      const q = input.value.trim();
      if (q.length < 2) { dropdown.classList.remove("open"); return; }
      dropdown.innerHTML = `<div class="chika-ac-item chika-ac-empty">Searching...</div>`;
      positionDropdown();
      dropdown.classList.add("open");
      debounce = setTimeout(async () => {
        try   { showItems(await fetchFn(q)); }
        catch { dropdown.innerHTML = `<div class="chika-ac-item chika-ac-empty">Search failed — try again</div>`; }
      }, 350);
    });

    input.addEventListener("blur",  () => setTimeout(() => dropdown.classList.remove("open"), 200));
    input.addEventListener("focus", () => { if (dropdown.children.length && input.value.trim().length >= 2) { positionDropdown(); dropdown.classList.add("open"); } });
  }

  setupAutocomplete(
    "chika-similar-input", "chika-similar-dropdown", "chika-similar-error",
    searchCRSeries,
    r => { selectedSimilar = r; },
    () => { selectedSimilar = null; }
  );

  function validateAutocomplete() {
    const sv = document.getElementById("chika-similar-input").value.trim();
    if (sv && !selectedSimilar) {
      document.getElementById("chika-similar-error").textContent = "Please select a result from the dropdown.";
      return false;
    }
    return true;
  }

  // ── Render recommendation cards ───────────────────────────────────────────────
  function renderCards(recommendations) {
    recList.innerHTML = "";
    recommendations.forEach(rec => {
      const crUrl = rec.cr_url || `https://www.crunchyroll.com/search?q=${encodeURIComponent(rec.title)}`;
      const card  = document.createElement("div");
      card.className = "chika-rec-card";
      card.innerHTML = `
        <img class="chika-rec-cover" alt="${rec.title}">
        <div class="chika-rec-content">
          <div class="chika-rec-title"><a href="${crUrl}" target="_blank">${rec.title}</a></div>
          <div class="chika-rec-meta">
            ${rec.genre    ? `<span class="chika-rec-tag">${rec.genre}</span>`        : ""}
            ${rec.type     ? `<span class="chika-rec-tag">${rec.type}</span>`         : ""}
            ${rec.episodes ? `<span class="chika-rec-tag">${rec.episodes} eps</span>` : ""}
            ${rec.score    ? `<span class="chika-rec-score">${rec.score}</span>`      : ""}
          </div>
          <p class="chika-rec-reason">${rec.reason}</p>
          <a class="chika-rec-link" href="${crUrl}" target="_blank">Watch on Crunchyroll</a>
        </div>
      `;
      recList.appendChild(card);
    });
  }

  // After rendering, fill in real CR URLs and cover images in parallel
  async function resolveCardData(recommendations) {
    const cards = recList.querySelectorAll(".chika-rec-card");
    await Promise.all(recommendations.map(async (rec, i) => {
      const data = await resolveCRData(rec.title);
      if (!data) return;
      const card = cards[i];
      if (!card) return;
      card.querySelectorAll(".chika-rec-content a").forEach(a => a.href = data.url);
      if (data.imageUrl) {
        const img = card.querySelector(".chika-rec-cover");
        if (img) img.src = data.imageUrl;
      }
    }));
  }

  // ── Get recommendations ───────────────────────────────────────────────────────
  getRecsBtn.addEventListener("click", async () => {
    if (!validateAutocomplete()) return;

    const filters   = getActiveFilters();
    const extraText = extraInput.value.trim();

    viewFilters.classList.add("chika-hidden");
    viewRecs.classList.remove("chika-hidden");

    const loadingHTML = `
      <div class="chika-loading-wrap">
        <div class="chika-walker-scene">
          <div class="chika-loading-bg-text">Chika is searching for some recommendations...</div>
          <div class="chika-walker">${CHIKA_BODY_SVG}</div>
        </div>
      </div>`;
    recList.innerHTML = loadingHTML;

    // Fetch watch history; fall back to page scrape
    let watchedSeries = await fetchCRHistory();
    if (!watchedSeries || !watchedSeries.length) {
      watchedSeries = scrapeCRPage();
    }

    try {
      let recs = await window.chikaRecommend({
        filters, watchedSeries, similarTo: selectedSimilar, extra: extraText,
      });

      // Client-side safety net: remove anything already watched
      if (watchedSeries && watchedSeries.length) {
        const normalise = t => t.toLowerCase().trim().replace(/[^a-z0-9　-鿿]/g, "");
        const seenSet   = new Set(watchedSeries.map(s => normalise(s.title)));
        recs = recs.filter(r => !seenSet.has(normalise(r.title)));
      }

      if (!recs.length) {
        recList.innerHTML = `<div class="chika-loading chika-error">All suggestions overlapped with your watch history. Try adjusting your filters and trying again.</div>`;
        return;
      }

      renderCards(recs);
      resolveCardData(recs);
    } catch (err) {
      recList.innerHTML = `<div class="chika-loading chika-error">Error: ${err.message}</div>`;
    }
  });
})();
