(() => {
  "use strict";

  const STORAGE = {
    solved: "taiwan_cp_solved_problems",
    read: "taiwan_cp_read_topics",
    theme: "taiwan_cp_theme_v2",
    last: "taiwan_cp_last_topic_v2"
  };

  const state = {
    solved: safeArray(localStorage.getItem(STORAGE.solved)),
    read: safeArray(localStorage.getItem(STORAGE.read)),
    theme: localStorage.getItem(STORAGE.theme) || "system",
    roadmapFilter: "all",
    courseSearch: "",
    courseDomain: "all",
    courseLevel: "all",
    problemSearch: "",
    problemPlatform: "all",
    hideSolved: false,
    activeTopic: null,
    baseView: "home"
  };

  const domainRules = [
    ["Dynamic Programming", "DP", "▦", /\bdp\b|dynamic|動態|knapsack|背包|lis|digit dp|tree dp/i],
    ["Graph", "Graph", "⌘", /graph|圖論|圖 |bfs|dfs|shortest|dijkstra|bellman|floyd|mst|topolog|scc|flow|matching/i],
    ["Tree", "Tree", "⌁", /tree|樹|lca|centroid|heavy light|hld|binary lifting|euler tour/i],
    ["Data Structures", "DS", "▤", /segment tree|fenwick|bit tree|資料結構|stack|queue|deque|priority|heap|set|map|dsu|union find/i],
    ["Sorting & Searching", "Search", "↕", /sort|search|二分|binary search|two pointer|sliding window|排序|搜尋/i],
    ["Greedy", "Greedy", "↗", /greedy|貪心/i],
    ["Mathematics", "Math", "∑", /math|數學|number theory|prime|gcd|modular|combin|fft|ntt|matrix|矩陣|數論/i],
    ["Strings", "String", "Aa", /string|字串|hash|suffix|kmp|z-function|z function|trie/i],
    ["Geometry", "Geometry", "△", /geometry|幾何|convex|point|line|sweep line|rect/i]
  ];

  const tutorialAliases = {
    "intro-sorting": ["sorting-custom"],
    "intro-sets-maps": ["sets-maps", "sets-and-maps"],
    "intro-ds": ["intro-ds", "data-structures"],
    "binary-search": ["binary-search", "binary-search-sorted-array"],
    "shortest-path": ["shortest-path-basic"],
    "shortest-paths": ["shortest-path-basic"],
    "segment-tree-basic": ["segment-tree"],
    "fenwick": ["fenwick-tree"],
    "bit": ["fenwick-tree"],
    "topological-sort": ["toposort"],
    "scc": ["strongly-connected-components", "scc-advanced"],
    "tree-dp": ["dp-trees"],
    "bitmask-dp": ["dp-bitmasks"],
    "interval-dp": ["dp-ranges"]
  };

  const allTopics = [];
  const topicMap = new Map();
  const problemMap = new Map();

  function safeArray(raw) {
    try {
      const v = JSON.parse(raw || "[]");
      return Array.isArray(v) ? v : [];
    } catch (_) {
      return [];
    }
  }

  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function initData() {
    if (!Array.isArray(window.ROADMAP_DATA)) return;
    window.ROADMAP_DATA.forEach((level, levelIndex) => {
      (level.topics || []).forEach((topic, topicIndex) => {
        const row = {
          topic: topic,
          level: level,
          levelIndex: levelIndex,
          topicIndex: topicIndex,
          difficulty: Math.min(10, 1 + levelIndex * 2),
          domain: getDomain(topic)
        };
        allTopics.push(row);
        topicMap.set(topic.id, row);
        (topic.problems || []).forEach(problem => {
          problemMap.set(problem.id, { problem: problem, row: row });
        });
      });
    });
  }

  function getDomain(topic) {
    const text = ((topic.title || "") + " " + (topic.desc || "")).toLowerCase();
    for (const rule of domainRules) {
      if (rule[3].test(text)) return { name: rule[0], short: rule[1], icon: rule[2] };
    }
    return { name: "Foundations", short: "Basic", icon: "{}" };
  }

  function levelBand(score) {
    if (score <= 3) return "beginner";
    if (score <= 6) return "intermediate";
    return "advanced";
  }

  function persist() {
    localStorage.setItem(STORAGE.solved, JSON.stringify(state.solved));
    localStorage.setItem(STORAGE.read, JSON.stringify(state.read));
  }

  function toast(message) {
    const el = document.getElementById("toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove("show"), 1800);
  }

  function setTheme(mode) {
    state.theme = mode;
    localStorage.setItem(STORAGE.theme, mode);
    const dark = mode === "dark" || (mode === "system" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    const btn = document.getElementById("theme-toggle");
    if (btn) btn.textContent = dark ? "☀" : "◐";
  }

  function showView(name) {
    const valid = ["home", "roadmap", "courses", "problems", "resources"];
    if (!valid.includes(name)) name = "home";
    state.baseView = name;
    document.querySelectorAll(".view").forEach(el => el.classList.toggle("active", el.dataset.view === name));
    document.querySelectorAll("[data-nav]").forEach(el => el.classList.toggle("active", el.dataset.nav === name));
    window.scrollTo({ top: 0, behavior: "instant" });
    if (name === "home") renderHome();
    if (name === "roadmap") renderRoadmap();
    if (name === "courses") renderCourses();
    if (name === "problems") renderProblems();
    if (name === "resources") renderResources();
  }

  function router() {
    const hash = location.hash || "#/home";
    const clean = hash.replace(/^#\/?/, "");
    const parts = clean.split("/").filter(Boolean);
    if (parts[0] === "lesson" && parts[1]) {
      const base = state.baseView === "home" ? "courses" : state.baseView;
      showView(base);
      openLesson(parts[1], false);
      return;
    }
    closeLesson(false);
    showView(parts[0] || "home");
  }

  function renderHome() {
    const totalProblems = Array.from(problemMap.keys()).length;
    const solvedValid = state.solved.filter(id => problemMap.has(id)).length;
    const doneValid = state.read.filter(id => topicMap.has(id)).length;
    const progress = allTopics.length ? Math.round(doneValid / allTopics.length * 100) : 0;
    document.getElementById("stat-topics").textContent = allTopics.length;
    document.getElementById("stat-problems").textContent = totalProblems;
    document.getElementById("stat-progress").textContent = progress + "%";
    document.getElementById("stat-levels").textContent = (window.ROADMAP_DATA || []).length;

    const pathHost = document.getElementById("path-cards");
    pathHost.innerHTML = "";
    (window.ROADMAP_DATA || []).slice(0, 3).forEach((level, idx) => {
      const div = document.createElement("article");
      div.className = "path-card";
      div.style.setProperty("--path-color", level.color || "var(--brand)");
      div.innerHTML =
        '<div class="path-icon">' + ["🌱", "🧠", "🚀"][idx] + '</div>' +
        "<h3>" + esc(level.levelName) + "</h3>" +
        "<p>" + esc(level.levelDesc || "") + "</p>" +
        '<div class="path-meta"><span>' + (level.topics || []).length + " 個主題</span><span>開始 →</span></div>";
      div.addEventListener("click", () => {
        state.roadmapFilter = level.levelId;
        location.hash = "#/roadmap";
      });
      pathHost.appendChild(div);
    });

    const groups = domainGroups();
    const domainHost = document.getElementById("domain-cards");
    domainHost.innerHTML = "";
    groups.slice(0, 8).forEach(group => {
      const div = document.createElement("article");
      div.className = "domain-card";
      div.innerHTML = "<h3>" + esc(group.domain.icon + " " + group.domain.name) + "</h3>" +
        "<p>" + esc(group.sample) + "</p>" +
        '<div class="domain-count">' + group.rows.length + " lessons →</div>";
      div.addEventListener("click", () => {
        state.courseDomain = group.domain.name;
        location.hash = "#/courses";
      });
      domainHost.appendChild(div);
    });

    const next = allTopics.find(row => !state.read.includes(row.topic.id)) || allTopics[0];
    if (next) {
      document.getElementById("continue-title").textContent = next.topic.title;
      document.getElementById("continue-desc").textContent = next.topic.desc || "繼續你的學習路線。";
      document.getElementById("continue-btn").onclick = () => openLesson(next.topic.id, true);
    }
  }

  function domainGroups() {
    const map = new Map();
    allTopics.forEach(row => {
      const key = row.domain.name;
      if (!map.has(key)) map.set(key, { domain: row.domain, rows: [], sample: "" });
      const group = map.get(key);
      group.rows.push(row);
      if (!group.sample) group.sample = row.topic.title || "";
    });
    return Array.from(map.values()).sort((a, b) => b.rows.length - a.rows.length);
  }

  function renderRoadmap() {
    const filters = document.getElementById("roadmap-filters");
    filters.innerHTML = "";
    const all = document.createElement("button");
    all.className = "chip" + (state.roadmapFilter === "all" ? " active" : "");
    all.textContent = "全部";
    all.onclick = () => { state.roadmapFilter = "all"; renderRoadmap(); };
    filters.appendChild(all);

    (window.ROADMAP_DATA || []).forEach(level => {
      const btn = document.createElement("button");
      btn.className = "chip" + (state.roadmapFilter === level.levelId ? " active" : "");
      btn.textContent = String(level.levelName || "").split(" (")[0];
      btn.onclick = () => { state.roadmapFilter = level.levelId; renderRoadmap(); };
      filters.appendChild(btn);
    });

    const host = document.getElementById("roadmap-view");
    host.innerHTML = "";
    (window.ROADMAP_DATA || []).forEach((level, levelIndex) => {
      if (state.roadmapFilter !== "all" && state.roadmapFilter !== level.levelId) return;
      const topics = level.topics || [];
      const completed = topics.filter(t => state.read.includes(t.id)).length;
      const block = document.createElement("section");
      block.className = "roadmap-level";
      const meta = document.createElement("div");
      meta.className = "roadmap-level-meta";
      meta.innerHTML =
        '<span class="eyebrow">Stage ' + String(levelIndex + 1).padStart(2, "0") + "</span>" +
        "<h2>" + esc(level.levelName) + "</h2>" +
        "<p>" + esc(level.levelDesc || "") + "</p>" +
        '<div class="level-progress"><div class="mini-progress"><span style="width:' +
        (topics.length ? Math.round(completed / topics.length * 100) : 0) + '%"></span></div></div>';
      const nodes = document.createElement("div");
      nodes.className = "roadmap-nodes";
      topics.forEach(topic => {
        const row = topicMap.get(topic.id);
        const done = state.read.includes(topic.id);
        const node = document.createElement("article");
        node.className = "roadmap-node" + (done ? " done" : "");
        node.innerHTML =
          '<div class="node-top"><h3>' + esc(topic.title) + '</h3><span class="node-badge">難度 ' +
          row.difficulty + "/10</span></div><p>" + esc(topic.desc || "") + "</p>";
        node.onclick = () => openLesson(topic.id, true);
        nodes.appendChild(node);
      });
      block.append(meta, nodes);
      host.appendChild(block);
    });
  }

  function renderCourses() {
    const domainSelect = document.getElementById("course-domain");
    if (domainSelect.options.length <= 1) {
      domainGroups().forEach(group => {
        const op = document.createElement("option");
        op.value = group.domain.name;
        op.textContent = group.domain.name;
        domainSelect.appendChild(op);
      });
    }
    domainSelect.value = state.courseDomain;
    document.getElementById("course-level").value = state.courseLevel;
    document.getElementById("course-search").value = state.courseSearch;

    const q = state.courseSearch.trim().toLowerCase();
    const rows = allTopics.filter(row => {
      const text = ((row.topic.title || "") + " " + (row.topic.desc || "") + " " + row.domain.name).toLowerCase();
      return (!q || text.includes(q)) &&
        (state.courseDomain === "all" || row.domain.name === state.courseDomain) &&
        (state.courseLevel === "all" || levelBand(row.difficulty) === state.courseLevel);
    });

    const host = document.getElementById("courses-grid");
    host.innerHTML = "";
    rows.forEach(row => {
      const topic = row.topic;
      const card = document.createElement("article");
      card.className = "course-card";
      const bars = Array.from({ length: 5 }, (_, i) => '<i class="' + (i < Math.ceil(row.difficulty / 2) ? "on" : "") + '"></i>').join("");
      card.innerHTML =
        '<div class="tag-row"><span class="tag brand">' + esc(row.domain.short) + '</span><span class="tag">' +
        esc(String(row.level.levelName || "").split(" (")[0]) + "</span></div>" +
        "<h3>" + esc(topic.title) + "</h3>" +
        "<p>" + esc(topic.desc || "") + "</p>" +
        '<div class="course-footer"><div class="difficulty" title="難度 ' + row.difficulty + '/10">' + bars +
        '</div><span>' + (topic.problems || []).length + " 題練習</span></div>";
      card.onclick = () => openLesson(topic.id, true);
      host.appendChild(card);
    });
    document.getElementById("course-empty").hidden = rows.length !== 0;
  }

  function renderProblems() {
    const platformSelect = document.getElementById("problem-platform");
    if (platformSelect.options.length <= 1) {
      const platforms = Array.from(new Set(Array.from(problemMap.values()).map(x => x.problem.platform).filter(Boolean))).sort();
      platforms.forEach(p => {
        const op = document.createElement("option");
        op.value = p;
        op.textContent = p;
        platformSelect.appendChild(op);
      });
    }
    platformSelect.value = state.problemPlatform;
    document.getElementById("problem-search").value = state.problemSearch;
    document.getElementById("hide-solved").checked = state.hideSolved;

    const validIds = Array.from(problemMap.keys());
    const solved = validIds.filter(id => state.solved.includes(id)).length;
    const pct = validIds.length ? Math.round(solved / validIds.length * 100) : 0;
    document.getElementById("problem-progress").innerHTML =
      '<div style="display:flex;justify-content:space-between;gap:16px;align-items:center"><div><b>' +
      solved + " / " + validIds.length + '</b><div style="font-size:11px;color:var(--muted)">已完成題目</div></div><strong>' +
      pct + '%</strong></div><div class="mini-progress" style="margin-top:12px"><span style="width:' + pct + '%"></span></div>';

    const q = state.problemSearch.trim().toLowerCase();
    const host = document.getElementById("problem-ladder");
    host.innerHTML = "";

    allTopics.forEach(row => {
      const problems = (row.topic.problems || []).filter(p => {
        const solvedNow = state.solved.includes(p.id);
        const text = ((p.name || "") + " " + (p.platform || "")).toLowerCase();
        return (!q || text.includes(q)) &&
          (state.problemPlatform === "all" || p.platform === state.problemPlatform) &&
          (!state.hideSolved || !solvedNow);
      });
      if (!problems.length) return;

      const block = document.createElement("section");
      block.className = "problem-topic";
      const doneCount = (row.topic.problems || []).filter(p => state.solved.includes(p.id)).length;
      const head = document.createElement("div");
      head.className = "problem-topic-head";
      head.innerHTML = "<h3>" + esc(row.topic.title) + "</h3><span>" + doneCount + " / " + (row.topic.problems || []).length + "</span>";
      block.appendChild(head);

      problems.forEach(p => {
        const solvedNow = state.solved.includes(p.id);
        const line = document.createElement("div");
        line.className = "problem-row";
        line.innerHTML =
          '<input type="checkbox" ' + (solvedNow ? "checked" : "") + ' aria-label="完成題目">' +
          '<div><div class="problem-name">' + esc(p.name) + '</div><div class="problem-meta">' + esc(p.platform || "") + "</div></div>" +
          '<span class="problem-diff">' + esc(p.difficulty || "") + '</span>' +
          '<a href="' + esc(p.url || "#") + '" target="_blank" rel="noreferrer">前往 OJ ↗</a>';
        const checkbox = line.querySelector("input");
        checkbox.addEventListener("change", event => toggleProblem(p.id, event.target.checked));
        block.appendChild(line);
      });
      host.appendChild(block);
    });

    if (!host.children.length) {
      host.innerHTML = '<div class="empty-state">目前沒有符合條件的題目。</div>';
    }
  }

  function toggleProblem(id, checked) {
    if (checked && !state.solved.includes(id)) state.solved.push(id);
    if (!checked) state.solved = state.solved.filter(x => x !== id);
    persist();
    renderHome();
    renderProblems();
    if (state.activeTopic) refreshLessonProgress();
    toast(checked ? "已標記完成" : "已取消完成");
  }

  function renderResources() {
    const host = document.getElementById("template-grid");
    host.innerHTML = "";
    const data = Array.isArray(window.TEMPLATE_DATA) ? window.TEMPLATE_DATA.slice(0, 12) : [];
    if (!data.length) {
      host.innerHTML = '<div class="empty-state">模板資料載入中。</div>';
      return;
    }
    data.forEach(temp => {
      const card = document.createElement("article");
      card.className = "template-card";
      card.innerHTML = "<h3>" + esc(temp.title || temp.id) + "</h3><p>" + esc(temp.desc || temp.category || "") + "</p>";
      host.appendChild(card);
    });
  }

  function openLesson(id, pushHash) {
    const row = topicMap.get(id);
    if (!row) {
      toast("找不到這堂課");
      return;
    }
    state.activeTopic = row;
    localStorage.setItem(STORAGE.last, id);
    const topic = row.topic;
    document.getElementById("lesson-breadcrumb").textContent = row.domain.name + " / " + String(row.level.levelName || "").split(" (")[0];
    document.getElementById("lesson-title").textContent = topic.title || "";
    document.getElementById("lesson-desc").textContent = topic.desc || "";
    document.getElementById("lesson-tags").innerHTML =
      '<span class="tag brand">' + esc(row.domain.short) + '</span><span class="tag">難度 ' + row.difficulty + '/10</span>';

    renderPrerequisites(row);
    renderLessonProblems(topic);
    refreshLessonProgress();
    loadTutorial(row);
    document.getElementById("lesson-overlay").classList.add("open");
    document.getElementById("lesson-overlay").setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (pushHash) history.pushState(null, "", "#/lesson/" + encodeURIComponent(id));
  }

  function closeLesson(pushHash) {
    const overlay = document.getElementById("lesson-overlay");
    if (!overlay.classList.contains("open") && !state.activeTopic) return;
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    state.activeTopic = null;
    if (pushHash) location.hash = "#/" + state.baseView;
  }

  function renderPrerequisites(row) {
    let ids = Array.isArray(row.topic.prerequisites) ? row.topic.prerequisites.slice() : [];
    if (!ids.length && row.topicIndex > 0) {
      const previous = (row.level.topics || [])[row.topicIndex - 1];
      if (previous) ids = [previous.id];
    }
    const box = document.getElementById("lesson-prereq");
    if (!ids.length) {
      box.innerHTML = "<strong>先備知識</strong><span style='color:var(--muted)'>這堂課可以直接開始。</span>";
      return;
    }
    const links = ids.map(id => {
      const p = topicMap.get(id);
      if (!p) return '<span class="tag">' + esc(id) + "</span>";
      return '<button class="chip prereq-link" data-topic="' + esc(id) + '">' + esc(p.topic.title) + "</button>";
    }).join("");
    box.innerHTML = '<strong>先備知識</strong><div class="prereq-list">' + links + "</div>";
    box.querySelectorAll("[data-topic]").forEach(btn => {
      btn.onclick = () => openLesson(btn.dataset.topic, true);
    });
  }

  function renderLessonProblems(topic) {
    const host = document.getElementById("lesson-problems");
    host.innerHTML = "";
    const problems = topic.problems || [];
    if (!problems.length) {
      host.innerHTML = '<div style="color:var(--muted);font-size:13px">這堂課目前沒有綁定練習題。</div>';
      return;
    }
    problems.forEach(p => {
      const line = document.createElement("div");
      line.className = "lesson-problem";
      line.innerHTML =
        '<input type="checkbox" ' + (state.solved.includes(p.id) ? "checked" : "") + '>' +
        "<div><b>" + esc(p.name) + '</b><div class="problem-meta">' + esc(p.platform || "") + " · " + esc(p.difficulty || "") + "</div></div>" +
        '<a href="' + esc(p.url || "#") + '" target="_blank" rel="noreferrer">前往 OJ ↗</a>';
      line.querySelector("input").onchange = e => toggleProblem(p.id, e.target.checked);
      host.appendChild(line);
    });
  }

  function refreshLessonProgress() {
    if (!state.activeTopic) return;
    const topic = state.activeTopic.topic;
    const marked = state.read.includes(topic.id);
    const problems = topic.problems || [];
    const solved = problems.filter(p => state.solved.includes(p.id)).length;
    const pct = problems.length ? Math.round(solved / problems.length * 100) : (marked ? 100 : 0);
    document.getElementById("lesson-progress-label").textContent = marked ? "已完成" : (solved ? "學習中" : "未開始");
    document.getElementById("lesson-progress-fill").style.width = pct + "%";
    const btn = document.getElementById("lesson-mark");
    btn.textContent = marked ? "✓ 已完成" : "標記已完成";
  }

  function toggleLessonComplete() {
    if (!state.activeTopic) return;
    const id = state.activeTopic.topic.id;
    if (state.read.includes(id)) state.read = state.read.filter(x => x !== id);
    else state.read.push(id);
    persist();
    refreshLessonProgress();
    renderHome();
    toast(state.read.includes(id) ? "課程已完成" : "已取消完成");
  }

  async function loadTutorial(row) {
    const host = document.getElementById("lesson-content");
    host.innerHTML = '<div class="loading">載入課程中…</div>';
    const candidates = tutorialCandidates(row.topic.id);
    let markdown = null;

    for (const name of candidates) {
      try {
        const res = await fetch("../tutorials/" + encodeURIComponent(name) + ".md", { cache: "no-store" });
        if (res.ok) {
          markdown = await res.text();
          break;
        }
      } catch (_) {}
    }

    if (markdown == null) {
      const resources = (row.topic.resources || []).map(r => "- [" + (r.name || "資源") + "](" + (r.url || "#") + ")").join("\n");
      markdown = "# " + (row.topic.title || "") + "\n\n" +
        (row.topic.desc || "") + "\n\n" +
        (resources ? "## 延伸資源\n\n" + resources : "");
    }

    if (window.marked) host.innerHTML = window.marked.parse(markdown);
    else host.textContent = markdown;

    host.querySelectorAll("a").forEach(a => {
      if (/^https?:/i.test(a.getAttribute("href") || "")) {
        a.target = "_blank";
        a.rel = "noreferrer";
      }
    });

    buildToc(host);
    if (typeof window.renderMathInElement === "function") {
      try {
        window.renderMathInElement(host, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
            { left: "\\(", right: "\\)", display: false },
            { left: "\\[", right: "\\]", display: true }
          ],
          throwOnError: false
        });
      } catch (_) {}
    }
  }

  function tutorialCandidates(id) {
    const list = [id];
    const alias = tutorialAliases[id] || [];
    alias.forEach(x => list.push(x));
    if (id.startsWith("intro-")) list.push(id.replace(/^intro-/, ""));
    if (id.endsWith("-basic")) list.push(id.replace(/-basic$/, ""));
    return Array.from(new Set(list.filter(Boolean)));
  }

  function buildToc(host) {
    const toc = document.getElementById("lesson-toc");
    toc.innerHTML = "";
    const headings = host.querySelectorAll("h2,h3");
    headings.forEach((h, idx) => {
      if (!h.id) h.id = "lesson-section-" + idx;
      const a = document.createElement("a");
      a.href = "#" + h.id;
      a.textContent = h.textContent;
      a.style.paddingLeft = h.tagName === "H3" ? "18px" : "10px";
      toc.appendChild(a);
    });
    if (!headings.length) toc.innerHTML = '<span style="font-size:11px;color:var(--muted)">本篇沒有額外章節。</span>';
  }

  function setupSearch() {
    const modal = document.getElementById("search-modal");
    const input = document.getElementById("global-search");
    const results = document.getElementById("search-results");
    const open = () => {
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      input.value = "";
      results.innerHTML = '<div class="empty-state">輸入關鍵字搜尋課程與題目。</div>';
      setTimeout(() => input.focus(), 0);
    };
    const close = () => {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
    };
    document.getElementById("search-open").onclick = open;
    document.getElementById("search-close").onclick = close;
    modal.addEventListener("click", e => { if (e.target === modal) close(); });
    document.addEventListener("keydown", e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        open();
      }
      if (e.key === "Escape") {
        close();
        if (document.getElementById("lesson-overlay").classList.contains("open")) closeLesson(true);
      }
    });
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      results.innerHTML = "";
      if (!q) {
        results.innerHTML = '<div class="empty-state">輸入關鍵字搜尋課程與題目。</div>';
        return;
      }
      const topicResults = allTopics.filter(row => ((row.topic.title || "") + " " + (row.topic.desc || "")).toLowerCase().includes(q)).slice(0, 8);
      const problemResults = Array.from(problemMap.values()).filter(x => ((x.problem.name || "") + " " + (x.problem.platform || "")).toLowerCase().includes(q)).slice(0, 8);
      topicResults.forEach(row => {
        const item = document.createElement("div");
        item.className = "search-result";
        item.innerHTML = "<strong>" + esc(row.topic.title) + "</strong><small>課程 · " + esc(row.domain.name) + "</small>";
        item.onclick = () => { close(); openLesson(row.topic.id, true); };
        results.appendChild(item);
      });
      problemResults.forEach(x => {
        const item = document.createElement("div");
        item.className = "search-result";
        item.innerHTML = "<strong>" + esc(x.problem.name) + "</strong><small>題目 · " + esc(x.problem.platform || "") + "</small>";
        item.onclick = () => { window.open(x.problem.url, "_blank", "noopener"); };
        results.appendChild(item);
      });
      if (!results.children.length) results.innerHTML = '<div class="empty-state">沒有找到結果。</div>';
    });
  }

  function setupControls() {
    document.getElementById("theme-toggle").onclick = () => {
      const current = document.documentElement.dataset.theme;
      setTheme(current === "dark" ? "light" : "dark");
    };
    document.getElementById("lesson-close").onclick = () => closeLesson(true);
    document.getElementById("lesson-mark").onclick = toggleLessonComplete;

    document.getElementById("course-search").addEventListener("input", e => {
      state.courseSearch = e.target.value;
      renderCourses();
    });
    document.getElementById("course-domain").addEventListener("change", e => {
      state.courseDomain = e.target.value;
      renderCourses();
    });
    document.getElementById("course-level").addEventListener("change", e => {
      state.courseLevel = e.target.value;
      renderCourses();
    });

    document.getElementById("problem-search").addEventListener("input", e => {
      state.problemSearch = e.target.value;
      renderProblems();
    });
    document.getElementById("problem-platform").addEventListener("change", e => {
      state.problemPlatform = e.target.value;
      renderProblems();
    });
    document.getElementById("hide-solved").addEventListener("change", e => {
      state.hideSolved = e.target.checked;
      renderProblems();
    });
  }

  function bootstrap() {
    initData();
    setTheme(state.theme);
    setupControls();
    setupSearch();
    renderHome();
    renderRoadmap();
    renderCourses();
    renderProblems();
    renderResources();
    window.addEventListener("hashchange", router);
    window.addEventListener("popstate", router);
    router();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
  } else {
    bootstrap();
  }
})();