// content.js — injects the ChikaChan sidebar into MyAnimeList pages

(function () {
  if (document.getElementById("chika-root")) return;

  // ── Filter definitions ───────────────────────────────────────────────────────
  const FILTERS = [
    {
      key: "genre",
      label: "Genre",
      options: ["Action","Romance","Comedy","Thriller","Slice of Life","Fantasy","Sci-Fi","Horror","Sports","Mystery","Psychological","Supernatural","Adventure","Drama"]
    },
    {
      key: "type",
      label: "Type",
      options: ["TV Series","Movie","OVA","Short","Manga","Harem","Reverse Harem","Isekai","Mecha","Magical Girl","Yaoi / BL","Yuri / GL","Ecchi","Shounen","Shoujo","Seinen","Josei","Idol","Slice of School Life","Villainess"]
    },
    {
      key: "length",
      label: "Series Length",
      options: ["1–12 eps","13–26 eps","27–50 eps","50+ eps","Movie (1 ep)"]
    },
    {
      key: "character",
      label: "Character Type",
      options: ["Tsundere","Kuudere","Dandere","Yandere","Genki","Anti-hero","Overpowered MC","Underdog MC","Villain MC","Found Family","Rivals to Lovers","Female Lead","Male Lead","Ensemble Cast"]
    }
  ];

  // ── Build filter HTML ────────────────────────────────────────────────────────
  function buildFilters() {
    return FILTERS.map(({ key, label, options }) => `
      <div class="chika-filter-group">
        <span class="chika-filter-group-title">${label}</span>
        <div class="chika-chips" data-filter="${key}">
          <button class="chika-chip chika-chip-any active" data-value="any">Any ✓</button>
          ${options.map(o => `<button class="chika-chip" data-value="${o}">${o}</button>`).join("")}
        </div>
      </div>
    `).join("");
  }

  // ── Root HTML ────────────────────────────────────────────────────────────────
  const root = document.createElement("div");
  root.id = "chika-root";
  root.innerHTML = `
    <div id="chika-toggle" title="Open ChikaChan">
      <img src="${chrome.runtime.getURL("icons/icon48.png")}" alt="ChikaChan" />
    </div>
    <div id="chika-panel" class="chika-hidden">
      <div id="chika-header">
        <span id="chika-title">✨ ChikaChan</span>
        <button id="chika-close" title="Close">✕</button>
      </div>

      <!-- View: Filters -->
      <div id="chika-view-filters">
        <div id="chika-filters">
          <p class="chika-filter-label">What are you in the mood for?</p>
          ${buildFilters()}
        </div>
        <div id="chika-filter-footer">
          <button id="chika-get-recs">Get Recommendations 🌸</button>
        </div>
      </div>

      <!-- View: Recommendations -->
      <div id="chika-view-recs" class="chika-hidden">
        <div id="chika-recs-header">
          <button id="chika-back">← Filters</button>
          <span>Top picks for you</span>
        </div>
        <div id="chika-rec-list"></div>
        <div id="chika-chat-section">
          <p class="chika-filter-label" style="padding:12px 14px 4px">Ask ChikaChan</p>
          <div id="chika-messages"></div>
          <div id="chika-input-row">
            <input id="chika-input" type="text" placeholder="Ask anything…" />
            <button id="chika-send">→</button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(root);

  // ── View refs ────────────────────────────────────────────────────────────────
  const panel        = document.getElementById("chika-panel");
  const toggle       = document.getElementById("chika-toggle");
  const closeBtn     = document.getElementById("chika-close");
  const viewFilters  = document.getElementById("chika-view-filters");
  const viewRecs     = document.getElementById("chika-view-recs");
  const recList      = document.getElementById("chika-rec-list");
  const messagesEl   = document.getElementById("chika-messages");
  const input        = document.getElementById("chika-input");
  const sendBtn      = document.getElementById("chika-send");
  const getRecsBtn   = document.getElementById("chika-get-recs");
  const backBtn      = document.getElementById("chika-back");

  // ── Toggle panel ─────────────────────────────────────────────────────────────
  toggle.addEventListener("click", () => panel.classList.toggle("chika-hidden"));
  closeBtn.addEventListener("click", () => panel.classList.add("chika-hidden"));

  // ── Back button ──────────────────────────────────────────────────────────────
  backBtn.addEventListener("click", () => {
    viewRecs.classList.add("chika-hidden");
    viewFilters.classList.remove("chika-hidden");
  });

  // ── Filter chip logic ────────────────────────────────────────────────────────
  document.querySelectorAll(".chika-chips").forEach(group => {
    const anyChip = group.querySelector(".chika-chip-any");

    group.querySelectorAll(".chika-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        if (chip.classList.contains("chika-chip-any")) {
          // Clicking "Any" deselects everything else
          group.querySelectorAll(".chika-chip").forEach(c => c.classList.remove("active"));
          chip.classList.add("active");
        } else {
          // Deactivate "Any", toggle this chip
          anyChip?.classList.remove("active");
          chip.classList.toggle("active");
          // If nothing selected, re-activate "Any"
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
      const anyActive = group.querySelector(".chika-chip-any")?.classList.contains("active");
      if (anyActive) return; // no filter = don't send
      const active = [...group.querySelectorAll(".chika-chip:not(.chika-chip-any).active")].map(c => c.dataset.value);
      if (active.length) filters[key] = active;
    });
    return filters;
  }

  // ── Scrape MAL anime list ────────────────────────────────────────────────────
  function scrapeAnimeList() {
    const rows = document.querySelectorAll(".list-table-data .list-item");
    if (!rows.length) return null;
    const list = [];
    rows.forEach(row => {
      const title  = row.querySelector(".data.title .link")?.textContent?.trim();
      const score  = row.querySelector(".data.score span")?.textContent?.trim();
      const status = row.querySelector(".data.status span")?.textContent?.trim();
      if (title) list.push({ title, score: score || "–", status: status || "–" });
    });
    return list;
  }

  // ── Render recommendation cards ───────────────────────────────────────────────
  function renderCards(recommendations) {
    recList.innerHTML = "";
    recommendations.forEach((rec, i) => {
      const searchQuery = encodeURIComponent(rec.title);
      const malUrl = rec.mal_url || `https://myanimelist.net/anime.php?q=${searchQuery}&cat=anime`;
      const card = document.createElement("div");
      card.className = "chika-rec-card";
      card.innerHTML = `
        <div class="chika-rec-rank">#${i + 1}</div>
        <div class="chika-rec-body">
          <div class="chika-rec-title">
            <a href="${malUrl}" target="_blank">${rec.title}</a>
          </div>
          <div class="chika-rec-meta">
            ${rec.genre ? `<span class="chika-rec-tag">${rec.genre}</span>` : ""}
            ${rec.type  ? `<span class="chika-rec-tag">${rec.type}</span>`  : ""}
            ${rec.episodes ? `<span class="chika-rec-tag">${rec.episodes} eps</span>` : ""}
            ${rec.score ? `<span class="chika-rec-score">★ ${rec.score}</span>` : ""}
          </div>
          <p class="chika-rec-reason">${rec.reason}</p>
          <a class="chika-rec-link" href="${malUrl}" target="_blank">View on MAL →</a>
        </div>
      `;
      recList.appendChild(card);
    });
  }

  // ── Get recommendations ───────────────────────────────────────────────────────
  getRecsBtn.addEventListener("click", async () => {
    const filters   = getActiveFilters();
    const animeList = scrapeAnimeList();

    viewFilters.classList.add("chika-hidden");
    viewRecs.classList.remove("chika-hidden");
    recList.innerHTML = `<div class="chika-loading">ChikaChan is picking your recommendations… 🌸</div>`;

    try {
      const recs = await window.chikaRecommend({ filters, animeList });
      renderCards(recs);
    } catch (err) {
      recList.innerHTML = `<div class="chika-loading chika-error">❌ ${err.message}</div>`;
    }
  });

  // ── Chat helpers ──────────────────────────────────────────────────────────────
  function appendMessage(role, text) {
    const div = document.createElement("div");
    div.className = `chika-msg chika-msg-${role}`;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  function appendThinking() {
    const div = document.createElement("div");
    div.className = "chika-msg chika-msg-assistant chika-thinking";
    div.textContent = "ChikaChan is thinking…";
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  // ── Chat send ─────────────────────────────────────────────────────────────────
  async function sendMessage() {
    const userText = input.value.trim();
    if (!userText) return;
    appendMessage("user", userText);
    input.value = "";
    sendBtn.disabled = true;
    const thinking = appendThinking();
    try {
      const reply = await window.chikaAsk({ userText, filters: getActiveFilters(), animeList: scrapeAnimeList() });
      thinking.remove();
      appendMessage("assistant", reply);
    } catch (err) {
      thinking.remove();
      appendMessage("assistant", `❌ ${err.message}`);
    } finally {
      sendBtn.disabled = false;
      input.focus();
    }
  }

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keydown", e => { if (e.key === "Enter") sendMessage(); });
})();
