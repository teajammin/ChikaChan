// content.js — injects the ChikaChan sidebar into MyAnimeList pages

(function () {
  if (document.getElementById("chika-root")) return;

  // ── ChikaChan character SVG ───────────────────────────────────────────────────
  // Face SVG — used in toggle bubble (slightly oversized → fisheye effect via overflow:hidden)
  const CHIKA_FACE_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <!-- Hair back mass -->
    <ellipse cx="50" cy="44" rx="37" ry="34" fill="#9B6A1A"/>
    <!-- Left curl cluster -->
    <ellipse cx="15" cy="60" rx="13" ry="16" fill="#9B6A1A"/>
    <ellipse cx="11" cy="76" rx="9"  ry="11" fill="#7A5212"/>
    <ellipse cx="19" cy="86" rx="7"  ry="8"  fill="#9B6A1A"/>
    <!-- Right curl cluster -->
    <ellipse cx="85" cy="60" rx="13" ry="16" fill="#9B6A1A"/>
    <ellipse cx="89" cy="76" rx="9"  ry="11" fill="#7A5212"/>
    <ellipse cx="81" cy="86" rx="7"  ry="8"  fill="#9B6A1A"/>
    <!-- Face -->
    <ellipse cx="50" cy="54" rx="28" ry="32" fill="#FFD5A0"/>
    <!-- Bangs (front hair) -->
    <path d="M23 43 C27 20 50 16 50 16 C50 16 73 20 77 43 C69 30 50 28 50 28 C50 28 31 30 23 43Z" fill="#9B6A1A"/>
    <!-- Side strands -->
    <path d="M23 43 C19 56 15 63 15 72" fill="none" stroke="#9B6A1A" stroke-width="5.5" stroke-linecap="round"/>
    <path d="M77 43 C81 56 85 63 85 72" fill="none" stroke="#9B6A1A" stroke-width="5.5" stroke-linecap="round"/>
    <!-- Eye whites -->
    <ellipse cx="37" cy="52" rx="9.5" ry="10" fill="white"/>
    <ellipse cx="63" cy="52" rx="9.5" ry="10" fill="white"/>
    <!-- Iris -->
    <ellipse cx="37" cy="53" rx="7" ry="8" fill="#5080C8"/>
    <ellipse cx="63" cy="53" rx="7" ry="8" fill="#5080C8"/>
    <!-- Pupil -->
    <ellipse cx="37" cy="54" rx="4.5" ry="5.5" fill="#151828"/>
    <ellipse cx="63" cy="54" rx="4.5" ry="5.5" fill="#151828"/>
    <!-- Eye shine -->
    <circle cx="39.5" cy="49.5" r="2.5" fill="white"/>
    <circle cx="65.5" cy="49.5" r="2.5" fill="white"/>
    <circle cx="36"   cy="56"   r="1.2" fill="white" opacity="0.7"/>
    <circle cx="62"   cy="56"   r="1.2" fill="white" opacity="0.7"/>
    <!-- Glasses frames -->
    <rect x="25" y="43" width="24" height="17" rx="5.5" fill="rgba(160,190,255,0.1)" stroke="#1c1c30" stroke-width="2.4"/>
    <rect x="51" y="43" width="24" height="17" rx="5.5" fill="rgba(160,190,255,0.1)" stroke="#1c1c30" stroke-width="2.4"/>
    <!-- Bridge + temples -->
    <line x1="49" y1="51" x2="51" y2="51" stroke="#1c1c30" stroke-width="2.4"/>
    <line x1="25" y1="50" x2="18" y2="46" stroke="#1c1c30" stroke-width="2.2" stroke-linecap="round"/>
    <line x1="75" y1="50" x2="82" y2="46" stroke="#1c1c30" stroke-width="2.2" stroke-linecap="round"/>
    <!-- Cheeks -->
    <ellipse cx="29" cy="64" rx="8" ry="5" fill="#FFB6C1" opacity="0.45"/>
    <ellipse cx="71" cy="64" rx="8" ry="5" fill="#FFB6C1" opacity="0.45"/>
    <!-- Nose -->
    <path d="M47 67 Q50 70 53 67" fill="none" stroke="#C99070" stroke-width="1.6" stroke-linecap="round"/>
    <!-- Smile -->
    <path d="M42 75 Q50 83 58 75" fill="none" stroke="#C07060" stroke-width="2.2" stroke-linecap="round"/>
  </svg>`;

  // Body SVG — used in the loading animation (walking silhouette)
  const CHIKA_BODY_SVG = `<svg width="52" height="122" viewBox="0 0 52 122" xmlns="http://www.w3.org/2000/svg">
    <!-- Hair back -->
    <ellipse cx="26" cy="17" rx="21" ry="18" fill="#9B6A1A"/>
    <!-- Left curl -->
    <ellipse cx="7"  cy="27" rx="7"  ry="9"  fill="#9B6A1A"/>
    <ellipse cx="5"  cy="37" rx="5"  ry="6"  fill="#7A5212"/>
    <!-- Right curl -->
    <ellipse cx="45" cy="27" rx="7"  ry="9"  fill="#9B6A1A"/>
    <ellipse cx="47" cy="37" rx="5"  ry="6"  fill="#7A5212"/>
    <!-- Face -->
    <ellipse cx="26" cy="24" rx="16" ry="18" fill="#FFD5A0"/>
    <!-- Bangs -->
    <path d="M12 19 C14 8 26 5 26 5 C26 5 38 8 40 19 C36 12 26 12 26 12 C26 12 16 12 12 19Z" fill="#9B6A1A"/>
    <!-- Side strands -->
    <path d="M12 19 C9 26 8 30 8 35" fill="none" stroke="#9B6A1A" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M40 19 C43 26 44 30 44 35" fill="none" stroke="#9B6A1A" stroke-width="3.5" stroke-linecap="round"/>
    <!-- Eyes (simplified) -->
    <ellipse cx="20" cy="23" rx="5.5" ry="6" fill="white"/>
    <ellipse cx="32" cy="23" rx="5.5" ry="6" fill="white"/>
    <ellipse cx="20" cy="24" rx="3.5" ry="4" fill="#1a1828"/>
    <ellipse cx="32" cy="24" rx="3.5" ry="4" fill="#1a1828"/>
    <circle  cx="21.5" cy="21.5" r="1.5" fill="white"/>
    <circle  cx="33.5" cy="21.5" r="1.5" fill="white"/>
    <!-- Glasses -->
    <rect x="13" y="18" width="14" height="10" rx="3" fill="none" stroke="#1c1c30" stroke-width="1.8"/>
    <rect x="25" y="18" width="14" height="10" rx="3" fill="none" stroke="#1c1c30" stroke-width="1.8"/>
    <line x1="27" y1="22.5" x2="25" y2="22.5" stroke="#1c1c30" stroke-width="1.8"/>
    <line x1="13" y1="22" x2="9"  y2="20" stroke="#1c1c30" stroke-width="1.6" stroke-linecap="round"/>
    <line x1="39" y1="22" x2="43" y2="20" stroke="#1c1c30" stroke-width="1.6" stroke-linecap="round"/>
    <!-- Cheeks -->
    <ellipse cx="15" cy="28" rx="4.5" ry="3" fill="#FFB6C1" opacity="0.5"/>
    <ellipse cx="37" cy="28" rx="4.5" ry="3" fill="#FFB6C1" opacity="0.5"/>
    <!-- Smile -->
    <path d="M21 32 Q26 37 31 32" fill="none" stroke="#C07060" stroke-width="1.5" stroke-linecap="round"/>
    <!-- Neck -->
    <rect x="22" y="40" width="8" height="6" rx="2" fill="#FFD5A0"/>
    <!-- Blazer body -->
    <path d="M8 46 L44 46 L46 86 L6 86 Z" fill="#2C3952"/>
    <!-- Lapels / collar -->
    <path d="M26 46 L22 60 L26 58 L30 60 L26 46Z" fill="#e8f0ff"/>
    <path d="M8 46 L18 50 L22 60 L26 46 L8 46Z" fill="#3a4a62"/>
    <path d="M44 46 L34 50 L30 60 L26 46 L44 46Z" fill="#3a4a62"/>
    <!-- Left arm -->
    <path d="M8 46 L4 72 Q4 76 7 76 Q10 76 11 72 L13 48Z" fill="#2C3952"/>
    <!-- Right arm -->
    <path d="M44 46 L48 72 Q48 76 45 76 Q42 76 41 72 L39 48Z" fill="#2C3952"/>
    <!-- Hands -->
    <ellipse cx="5.5" cy="78" rx="4" ry="3.5" fill="#FFD5A0"/>
    <ellipse cx="46.5" cy="78" rx="4" ry="3.5" fill="#FFD5A0"/>
    <!-- Long skirt -->
    <path d="M6 86 L4 122 L48 122 L46 86 Z" fill="#2C3952"/>
    <!-- Skirt highlight (subtle fabric line) -->
    <line x1="14" y1="86" x2="12" y2="122" stroke="#3a4a62" stroke-width="1.5" opacity="0.5"/>
    <line x1="38" y1="86" x2="40" y2="122" stroke="#3a4a62" stroke-width="1.5" opacity="0.5"/>
  </svg>`;

  // ── Detect MAL colours ────────────────────────────────────────────────────────
  function getMalColors() {
    const bodyBg     = getComputedStyle(document.body).backgroundColor;
    const rgb        = bodyBg.match(/\d+/g)?.map(Number) || [28, 28, 28];
    const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    const isDark     = brightness < 140;

    const navEl  = document.querySelector("#header") || document.querySelector(".header-menu") || document.querySelector("header");
    const navBg  = navEl ? getComputedStyle(navEl).backgroundColor : null;
    const validNavBg = navBg && navBg !== "rgba(0, 0, 0, 0)" && navBg !== "transparent" ? navBg : (isDark ? "#1c2233" : "#2e51a2");

    const hideAdsEl = [...document.querySelectorAll("a, button")].find(el =>
      /hide\s?ads|supporter|become.*member/i.test(el.textContent)
    );
    let btnColor = null;
    if (hideAdsEl) {
      const bg = getComputedStyle(hideAdsEl).backgroundColor;
      if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") btnColor = bg;
    }
    const accentBtn = btnColor || (isDark ? "#4a7fc1" : "#2e51a2");

    return {
      isDark,
      headerColor:  validNavBg,
      panelBg:      isDark ? "#151f2e" : "#ffffff",
      panelBg2:     isDark ? "#1c2a3a" : "#f4f6fb",
      textColor:    isDark ? "#e8eaf0" : "#1a1a2e",
      mutedColor:   isDark ? "#8ea0b8" : "#666",
      borderColor:  isDark ? "rgba(255,255,255,0.08)" : "rgba(46,81,162,0.15)",
      chipBg:       isDark ? "rgba(255,255,255,0.06)" : "rgba(46,81,162,0.07)",
      chipText:     isDark ? "#b8c8dc" : "#2e51a2",
      inputBg:      isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
      accentColor:  isDark ? "#4a7fc1" : "#2e51a2",
      btnColor:     accentBtn,
    };
  }

  function applyMalTheme() {
    const c = getMalColors();
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

  applyMalTheme();

  // ── Fetch user's FULL MAL anime list via MAL's load API ───────────────────────
  function getMalUsername() {
    const fromUrl = location.pathname.match(/^\/(?:animelist|profile)\/([^\/]+)/);
    if (fromUrl) return fromUrl[1];
    const userEl = document.querySelector(".header-profile-link") ||
                   document.querySelector("#profileLink") ||
                   document.querySelector("a[href*='/profile/']");
    if (userEl) {
      const m = (userEl.href || "").match(/\/profile\/([^\/]+)/);
      if (m) return m[1];
    }
    return null;
  }

  async function fetchFullAnimeList(username) {
    const allItems = [];
    let offset = 0;
    while (true) {
      try {
        const res  = await fetch(`https://myanimelist.net/animelist/${username}/load.json?status=7&offset=${offset}`);
        if (!res.ok) break;
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) break;
        data.forEach(item => {
          allItems.push({
            title:  item.anime_title,
            score:  item.score || "-",
            status: item.status,
          });
        });
        if (data.length < 300) break;
        offset += 300;
      } catch { break; }
    }
    return allItems;
  }

  // Scrape visible items as fallback
  function scrapeVisibleList() {
    const rows = document.querySelectorAll(".list-table-data .list-item");
    if (!rows.length) return null;
    const list = [];
    rows.forEach(row => {
      const title  = row.querySelector(".data.title .link")?.textContent?.trim();
      const score  = row.querySelector(".data.score span")?.textContent?.trim();
      const status = row.querySelector(".data.status span")?.textContent?.trim();
      if (title) list.push({ title, score: score || "-", status: status || "-" });
    });
    return list.length ? list : null;
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
  root.id = "chika-root";
  root.innerHTML = `
    <div id="chika-toggle" title="Open ChikaChan">
      <div class="chika-toggle-inner">
        <div class="chika-toggle-face">${CHIKA_FACE_SVG}</div>
        <div class="chika-toggle-handle"></div>
      </div>
    </div>
    <div id="chika-panel" class="chika-hidden">
      <div id="chika-header">
        <span id="chika-title">ChikaChan</span>
        <button id="chika-close" title="Close">&#10005;</button>
      </div>

      <!-- Dropdowns live here to escape overflow clipping -->
      <div class="chika-autocomplete-dropdown" id="chika-similar-dropdown"></div>
      <div class="chika-autocomplete-dropdown" id="chika-char-dropdown"></div>

      <!-- View: Filters -->
      <div id="chika-view-filters">
        <div id="chika-filters">
          <p class="chika-filter-label" style="margin-top:10px;">Tell Chika what you're looking for</p>
          ${buildFilters()}

          <div class="chika-filter-group">
            <span class="chika-filter-group-title">Similar to <span class="chika-optional">(optional)</span></span>
            <div class="chika-autocomplete-wrap">
              <input class="chika-autocomplete-input" id="chika-similar-input" type="text" placeholder="Type an anime title..." autocomplete="off" />
              <span class="chika-autocomplete-error" id="chika-similar-error"></span>
            </div>
          </div>

          <div class="chika-filter-group">
            <span class="chika-filter-group-title">Lead Character <span class="chika-optional">(optional)</span></span>
            <div class="chika-autocomplete-wrap">
              <input class="chika-autocomplete-input" id="chika-char-input" type="text" placeholder="Type a character name..." autocomplete="off" />
              <span class="chika-autocomplete-error" id="chika-char-error"></span>
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

      <!-- View: Recommendations -->
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

  // ── MAL search (for autocomplete + URL resolution) ────────────────────────────
  async function searchMal(type, q) {
    const url  = `https://myanimelist.net/search/prefix.json?type=${type}&keyword=${encodeURIComponent(q)}&v=1`;
    const res  = await fetch(url, { credentials: "include" });
    if (!res.ok) throw new Error(`Search error ${res.status}`);
    const data = await res.json();
    return (data?.categories?.[0]?.items || []).slice(0, 7).map(item => ({
      label: item.name,
      value: item.id,
      url:   item.url,
    }));
  }

  async function searchAnime(q)      { return searchMal("anime",     q); }
  async function searchCharacters(q) { return searchMal("character", q); }

  // Resolve a title to a real MAL URL using MAL's search
  async function resolveMALUrl(title) {
    try {
      const results = await searchMal("anime", title);
      if (!results.length) return null;
      const exact = results.find(r => r.label.toLowerCase() === title.toLowerCase());
      return (exact || results[0]).url;
    } catch { return null; }
  }

  // ── Autocomplete ──────────────────────────────────────────────────────────────
  let selectedSimilar   = null;
  let selectedCharacter = null;

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
        empty.className = "chika-ac-item chika-ac-empty";
        empty.textContent = "No results found";
        dropdown.appendChild(empty);
      } else {
        results.forEach(r => {
          const item = document.createElement("div");
          item.className = "chika-ac-item";
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

  setupAutocomplete("chika-similar-input", "chika-similar-dropdown", "chika-similar-error", searchAnime,      r => { selectedSimilar   = r; }, () => { selectedSimilar   = null; });
  setupAutocomplete("chika-char-input",    "chika-char-dropdown",    "chika-char-error",    searchCharacters, r => { selectedCharacter = r; }, () => { selectedCharacter = null; });

  function validateAutocomplete() {
    let valid = true;
    const sv = document.getElementById("chika-similar-input").value.trim();
    const cv = document.getElementById("chika-char-input").value.trim();
    if (sv && !selectedSimilar)   { document.getElementById("chika-similar-error").textContent = "Please select a result from the dropdown."; valid = false; }
    if (cv && !selectedCharacter) { document.getElementById("chika-char-error").textContent    = "Please select a result from the dropdown."; valid = false; }
    return valid;
  }

  // ── Render cards ──────────────────────────────────────────────────────────────
  function renderCards(recommendations) {
    recList.innerHTML = "";
    recommendations.forEach((rec, i) => {
      const malUrl = rec.mal_url || `https://myanimelist.net/anime.php?q=${encodeURIComponent(rec.title)}&cat=anime`;
      const card = document.createElement("div");
      card.className = "chika-rec-card";
      card.innerHTML = `
        <div class="chika-rec-rank">#${i + 1}</div>
        <div class="chika-rec-body">
          <div class="chika-rec-title"><a href="${malUrl}" target="_blank">${rec.title}</a></div>
          <div class="chika-rec-meta">
            ${rec.genre    ? `<span class="chika-rec-tag">${rec.genre}</span>`        : ""}
            ${rec.type     ? `<span class="chika-rec-tag">${rec.type}</span>`         : ""}
            ${rec.episodes ? `<span class="chika-rec-tag">${rec.episodes} eps</span>` : ""}
            ${rec.score    ? `<span class="chika-rec-score">${rec.score}</span>`      : ""}
          </div>
          <p class="chika-rec-reason">${rec.reason}</p>
          <a class="chika-rec-link" href="${malUrl}" target="_blank">View on MAL</a>
        </div>
      `;
      recList.appendChild(card);
    });
  }

  // After rendering, silently resolve any search URLs to real MAL pages
  async function resolveCardUrls(recommendations) {
    const cards = recList.querySelectorAll(".chika-rec-card");
    await Promise.all(recommendations.map(async (rec, i) => {
      if (rec.mal_url && !rec.mal_url.includes("anime.php")) return; // already a real URL
      const resolved = await resolveMALUrl(rec.title);
      if (!resolved) return;
      const card = cards[i];
      if (!card) return;
      card.querySelectorAll("a").forEach(a => a.href = resolved);
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

    // Try to get the full list from MAL's API first
    const username  = getMalUsername();
    let   animeList = null;
    if (username) {
      animeList = await fetchFullAnimeList(username);
    }
    if (!animeList || !animeList.length) {
      animeList = scrapeVisibleList();
    }

    recList.innerHTML = loadingHTML;

    try {
      let recs = await window.chikaRecommend({
        filters, animeList,
        similarTo: selectedSimilar,
        character: selectedCharacter,
        extra:     extraText
      });
      // Client-side safety net: strip anything the user has already seen
      if (animeList && animeList.length) {
        const seenSet = new Set(animeList.map(a => a.title.toLowerCase().trim()));
        recs = recs.filter(r => !seenSet.has(r.title.toLowerCase().trim()));
      }
      if (!recs.length) {
        recList.innerHTML = `<div class="chika-loading chika-error">All suggestions overlapped with your list. Try adjusting your filters and trying again.</div>`;
        return;
      }
      renderCards(recs);
      resolveCardUrls(recs); // fix any search URLs in the background
    } catch (err) {
      recList.innerHTML = `<div class="chika-loading chika-error">Error: ${err.message}</div>`;
    }
  });

  function scrapeVisibleList() {
    const rows = document.querySelectorAll(".list-table-data .list-item");
    if (!rows.length) return null;
    const list = [];
    rows.forEach(row => {
      const title  = row.querySelector(".data.title .link")?.textContent?.trim();
      const score  = row.querySelector(".data.score span")?.textContent?.trim();
      const status = row.querySelector(".data.status span")?.textContent?.trim();
      if (title) list.push({ title, score: score || "-", status: status || "-" });
    });
    return list.length ? list : null;
  }
})();
