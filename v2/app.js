(() => {
  "use strict";

  const APP_ASSET_BASE = new URL(".", document.currentScript?.src || location.href);

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
    problemDomain: "",
    hideSolved: false,
    activeTopic: null,
    baseView: "home"
  };

  const ROADMAP = (typeof ROADMAP_DATA !== "undefined" && Array.isArray(ROADMAP_DATA)) ? ROADMAP_DATA : [];
  let TEMPLATES = (typeof TEMPLATE_DATA !== "undefined" && Array.isArray(TEMPLATE_DATA)) ? TEMPLATE_DATA : [];
  let templatesPromise = null;

  const NOTION_COURSES = Array.isArray(window.NOTION_COURSES) ? window.NOTION_COURSES : [];
  const NOTION_LADDERS = Array.isArray(window.NOTION_LADDERS) ? window.NOTION_LADDERS : [];
  const NOTION_CHILD_PAGES = window.NOTION_CHILD_PAGES || {};
  const NOTION_DOMAIN_ORDER = Array.isArray(window.NOTION_DOMAIN_ORDER) ? window.NOTION_DOMAIN_ORDER : [];
  const NOTION_DOMAIN_RELATIONS = window.NOTION_DOMAIN_RELATIONS || {};
  NOTION_COURSES.forEach(course => {
    course.domains = Array.isArray(NOTION_DOMAIN_RELATIONS[course.id])
      ? NOTION_DOMAIN_RELATIONS[course.id].slice()
      : [];
    course.domain = course.domains[0] || "";
    const localContent = String(course.content || "").trim();
    if (typeof course.hasContent !== "boolean") {
      course.hasContent = localContent ? true : null;
    }
    course.isPlaceholder = course.hasContent === false ||
      String(course.details || "").trim().toLowerCase() === "coming soon";
  });
  const notionCourseMap = new Map(NOTION_COURSES.map(course => [course.id, course]));

  const LIVE_API_BASE = "https://benjaminshih.vercel.app/api/coding-course";
  const PAGE_CACHE_TTL = 45_000;
  const STATIC_COURSE_FALLBACK = new Map(NOTION_COURSES.map(course => [course.id, { ...course }]));
  const STATIC_LADDER_FALLBACK = new Map(NOTION_LADDERS.map(ladder => [ladder.id, { ...ladder }]));
  const CATALOG_REFRESH_TTL = 30_000;
  const courseSearchIndex = new WeakMap();
  const pagePayloadCache = new Map();
  const activePageRenders = new Map();
  const renderedViews = new Set();
  let notionRendererPromise = null;
  let liveCatalogSignature = "";
  let lastCatalogRefresh = 0;
  window.CODING_COURSE_IDS = NOTION_COURSES.map(course => course.id).concat(NOTION_LADDERS.map(ladder => ladder.id));

  function rebuildCourseMap() {
    notionCourseMap.clear();
    NOTION_COURSES.forEach(course => notionCourseMap.set(course.id, course));
    window.CODING_COURSE_IDS = NOTION_COURSES.map(course => course.id).concat(NOTION_LADDERS.map(ladder => ladder.id));
  }

  function courseSearchText(course) {
    if (courseSearchIndex.has(course)) return courseSearchIndex.get(course);
    const text = ((course.title || "") + " " + (course.details || "") + " " +
      (course.domains || []).join(" ") + " " + (course.content || "")).toLowerCase();
    courseSearchIndex.set(course, text);
    return text;
  }

  function ensureTemplates() {
    if (TEMPLATES.length) return Promise.resolve(TEMPLATES);
    if (templatesPromise) return templatesPromise;

    templatesPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-template-data]');
      const node = existing || document.createElement("script");
      node.src = new URL("../data/templates.js", APP_ASSET_BASE).href;
      node.async = true;
      node.dataset.templateData = "1";
      node.addEventListener("load", () => {
        TEMPLATES = (typeof TEMPLATE_DATA !== "undefined" && Array.isArray(TEMPLATE_DATA))
          ? TEMPLATE_DATA
          : [];
        resolve(TEMPLATES);
      }, { once: true });
      node.addEventListener("error", reject, { once: true });
      if (!existing) document.head.appendChild(node);
    }).catch(error => {
      templatesPromise = null;
      throw error;
    });

    return templatesPromise;
  }

  function ensureNotionRenderer() {
    if (window.NotionXBridge?.render) return Promise.resolve();
    if (notionRendererPromise) return notionRendererPromise;

    const stylesheet = new Promise((resolve, reject) => {
      const existing = document.querySelector('link[data-notion-renderer]');
      if (existing?.dataset.loaded === "1") return resolve();
      const link = existing || document.createElement("link");
      link.rel = "stylesheet";
      link.href = new URL("notion-renderer.css", APP_ASSET_BASE).href;
      link.dataset.notionRenderer = "1";
      link.addEventListener("load", () => {
        link.dataset.loaded = "1";
        resolve();
      }, { once: true });
      link.addEventListener("error", reject, { once: true });
      if (!existing) document.head.appendChild(link);
    });

    const script = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-notion-renderer]');
      if (window.NotionXBridge?.render) return resolve();
      const node = existing || document.createElement("script");
      node.src = new URL("notion-renderer.js", APP_ASSET_BASE).href;
      node.async = true;
      node.dataset.notionRenderer = "1";
      node.addEventListener("load", () => window.NotionXBridge?.render
        ? resolve()
        : reject(new Error("Notion renderer unavailable")), { once: true });
      node.addEventListener("error", reject, { once: true });
      if (!existing) document.head.appendChild(node);
    });

    notionRendererPromise = Promise.all([stylesheet, script]).catch(error => {
      notionRendererPromise = null;
      document.querySelectorAll('[data-notion-renderer]').forEach(node => node.remove());
      throw error;
    });
    return notionRendererPromise;
  }

  async function loadNotionPayload(pageId, signal) {
    const cached = pagePayloadCache.get(pageId);
    if (cached && Date.now() - cached.savedAt < PAGE_CACHE_TTL) return cached.payload;

    const response = await fetch(LIVE_API_BASE + "/page/" + encodeURIComponent(pageId), {
      cache: "no-store",
      signal
    });
    if (!response.ok) throw new Error("Notion API " + response.status);
    const payload = await response.json();
    const payloadId = String(payload.id || "").replace(/-/g, "").toLowerCase();
    if (payloadId !== pageId || !payload.blockMap?.block) {
      throw new Error("Notion API returned a mismatched page");
    }
    pagePayloadCache.set(pageId, { payload, savedAt: Date.now() });
    if (pagePayloadCache.size > 12) pagePayloadCache.delete(pagePayloadCache.keys().next().value);
    return payload;
  }

  function cancelRendersWithin(parent) {
    if (!parent) return;
    for (const [host, render] of activePageRenders) {
      if (host === parent || parent.contains(host)) {
        render.controller.abort();
        activePageRenders.delete(host);
      }
    }
  }

  function applyLiveCatalog(catalog) {
    if (!catalog || !Array.isArray(catalog.items) || !catalog.items.length) return false;

    const domains = Array.isArray(catalog.domains) && catalog.domains.length
      ? catalog.domains
      : NOTION_DOMAIN_ORDER.slice();

    const signature = JSON.stringify([
      domains,
      catalog.items.map(item => [
        String(item.id || "").replace(/-/g, ""),
        item.type || "",
        String(item.title || ""),
        String(item.details || ""),
        item.difficulty == null ? null : Number(item.difficulty),
        Array.isArray(item.domains) ? item.domains : [],
        item.hasContent !== false,
        item.status || "",
        item.mastery || ""
      ]).sort((a, b) => String(a[0]).localeCompare(String(b[0])))
    ]);
    if (signature === liveCatalogSignature) return false;
    liveCatalogSignature = signature;

    NOTION_DOMAIN_ORDER.splice(0, NOTION_DOMAIN_ORDER.length, ...domains);

    const lectures = [];
    const ladders = [];

    catalog.items.forEach(item => {
      const id = String(item.id || "").replace(/-/g, "");
      if (!id) return;

      const domains = Array.isArray(item.domains) ? item.domains.filter(Boolean) : [];
      const fallback = STATIC_COURSE_FALLBACK.get(id) || STATIC_LADDER_FALLBACK.get(id) || {};
      const base = {
        ...fallback,
        id,
        title: String(item.title || fallback.title || "").trim(),
        details: String(item.details || fallback.details || "").trim(),
        difficulty: item.difficulty == null ? (fallback.difficulty ?? null) : Number(item.difficulty),
        domains,
        domain: domains[0] || fallback.domain || "",
        status: item.status || "",
        mastery: item.mastery || "",
        hasContent: item.hasContent !== false,
        isPlaceholder: item.hasContent === false || String(item.details || "").trim().toLowerCase() === "coming soon",
        live: true,
        notionUrl: item.notionUrl || fallback.notionUrl || ("https://app.notion.com/p/" + id),
        content: fallback.content || ""
      };

      if (item.type === "lecture") lectures.push(base);
      if (item.type === "assignment" && /^Problem Ladder\s*[—-]/i.test(base.title)) ladders.push(base);
    });

    if (!lectures.length) return false;

    const hasLiveLadders = ladders.length > 0;

    lectures.sort((a,b)=>String(a.title||"").localeCompare(String(b.title||""),"en",{numeric:true}));
    ladders.sort((a,b)=>String(a.title||"").localeCompare(String(b.title||""),"en",{numeric:true}));

    NOTION_COURSES.splice(0, NOTION_COURSES.length, ...lectures);
    if (hasLiveLadders) NOTION_LADDERS.splice(0, NOTION_LADDERS.length, ...ladders);

    Object.keys(NOTION_DOMAIN_RELATIONS).forEach(key => delete NOTION_DOMAIN_RELATIONS[key]);
    NOTION_COURSES.forEach(course => {
      NOTION_DOMAIN_RELATIONS[course.id] = (course.domains || []).slice();
      course.domain = course.domains?.[0] || "";
    });

    rebuildCourseMap();
    return true;
  }

  async function loadLiveCatalog() {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(LIVE_API_BASE + "/catalog", {
        cache: "no-store",
        signal: controller.signal
      });
      if (!response.ok) throw new Error("catalog " + response.status);
      const catalog = await response.json();
      return applyLiveCatalog(catalog);
    } catch (error) {
      console.warn("[Coding Course] live catalog unavailable; using static fallback", error);
      return false;
    } finally {
      clearTimeout(timer);
    }
  }

  const NOTION_LECTURE_TO_ROADMAP = {
    "2f392ab7-6d40-80d7-a19a-f426c0398dce":"time-complexity",
    "2e392ab7-6d40-80f5-9f95-d0827281ae23":"complete-rec",
    "2f092ab7-6d40-8081-a00f-e22eef47cad3":"complete-rec",
    "2e392ab7-6d40-80e3-95f4-f494a3e8f880":"intro-ds",
    "2e392ab7-6d40-804a-8528-e27899e46dc3":"priority-queues",
    "2e392ab7-6d40-8002-8b6f-fbb7dc2b29ed":"intro-sets-maps",
    "2e392ab7-6d40-803e-83b7-ec46acf28ffb":"intro-sorting",
    "2e392ab7-6d40-806c-873a-c58c7f3d77a3":"intro-sorting",
    "33092ab7-6d40-808c-9a81-d540a6d662a1":"two-pointers",
    "33092ab7-6d40-8008-a0a7-c08a54a35c52":"binary-search",
    "36e92ab7-6d40-806b-bf5a-f50e80105a2b":"enumeration-bruteforce",
    "36e92ab7-6d40-8069-8f55-dbe8082655d6":"intro-greedy",
    "2e392ab7-6d40-8076-acd9-d02a39ee64f3":"basic-dp",
    "3e892ab7-6d40-8191-a979-d9f33c5f58c4":"knapsack",
    "2e392ab7-6d40-80a8-94fe-d635920f9c3c":"intro-graphs",
    "2e392ab7-6d40-801c-8e05-e50e3ef06c86":"intro-graphs",
    "33092ab7-6d40-80ee-9d38-f7836636d5fa":"shortest-path-basic",
    "33092ab7-6d40-8043-b128-e639a17c2484":"toposort",
    "33092ab7-6d40-80b5-be7b-eaa7cd896ef1":"intro-tree",
    "33092ab7-6d40-804a-8dda-e8a9c6090a1f":"mst",
    "33092ab7-6d40-8080-86f8-e08bc241b356":"tree-euler",
    "33092ab7-6d40-806a-80b9-c4a4d2d3fec0":"number-theory",
    "33092ab7-6d40-8075-bf02-c0aecbacaf15":"combinatorics",
    "33092ab7-6d40-80e7-9bad-f5a1f860fc8c":"prefix-sums",
    "33092ab7-6d40-809c-9543-d94c24efa37a":"monotonic-structures",
    "33092ab7-6d40-8019-9eaa-fc456a0f2fb7":"segment-tree",
    "3e892ab7-6d40-81c9-a9f7-dd9ac7bbb034":"fenwick-tree",
    "33092ab7-6d40-804a-8dda-e8a9c6090a1f":["dsu","mst"],
    "33092ab7-6d40-802f-813e-d4ca344b6864":"strongly-connected-components",
    "33092ab7-6d40-802e-8b3f-e81a23b44576":"rect-geo",
    "33092ab7-6d40-80e3-96c2-d21276ba88db":"hashing",
    "3e892ab7-6d40-81f8-ad7a-edb667c615ba":"string-suffix"
  };

  const roadmapToNotion = new Map();
  Object.entries(NOTION_LECTURE_TO_ROADMAP).forEach(([pageId, rawSlugs]) => {
    const id = pageId.replace(/-/g, "");
    const slugs = Array.isArray(rawSlugs) ? rawSlugs : [rawSlugs];
    slugs.forEach(slug => {
      const list = roadmapToNotion.get(slug) || [];
      if (!list.includes(id)) list.push(id);
      roadmapToNotion.set(slug, list);
    });
  });

  const NOTION_DOMAIN_META = {
    "00 Fundamentals": ["00", "Fundamentals"],
    "01 Complete Search & Simulation": ["01", "Complete Search"],
    "02 STL & Basic Data Structures": ["02", "STL / Basic DS"],
    "03 Sorting & Searching": ["03", "Sorting / Searching"],
    "04 Prefix Sums": ["04", "Prefix Sums"],
    "05 Greedy": ["05", "Greedy"],
    "06 Graphs": ["06", "Graphs"],
    "07 Trees": ["07", "Trees"],
    "08 Dynamic Programming": ["08", "DP"],
    "09 Data Structures & Range Queries": ["09", "Data Structures"],
    "10 Math": ["10", "Math"],
    "11 Geometry": ["11", "Geometry"],
    "12 Strings": ["12", "Strings"],
    "未歸類": ["•", "未歸類"]
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

  function courseDisplayTitle(course) {
    return String((course && course.title) || "").trim();
  }


  function initData() {
    const roadmapData = (typeof ROADMAP_DATA !== "undefined" && Array.isArray(ROADMAP_DATA)) ? ROADMAP_DATA : [];
    if (!roadmapData.length) return;
    roadmapData.forEach((level, levelIndex) => {
      (level.topics || []).forEach((topic, topicIndex) => {
        const row = {
          topic: topic,
          level: level,
          levelIndex: levelIndex,
          topicIndex: topicIndex,
          difficulty: Math.min(10, 1 + levelIndex * 2)
        };
        allTopics.push(row);
        topicMap.set(topic.id, row);
        (topic.problems || []).forEach(problem => {
          problemMap.set(problem.id, { problem: problem, row: row });
        });
      });
    });
  }


  function levelBand(score) {
    if (score == null || Number.isNaN(Number(score))) return "unknown";
    if (score <= 3) return "beginner";
    if (score <= 6) return "intermediate";
    return "advanced";
  }

  function notionDomainMeta(name) {
    const pair = NOTION_DOMAIN_META[name] || ["•", name || "Course"];
    return { name: name || "Course", icon: pair[0], short: pair[1] };
  }

  function notionDomainGroups() {
    const map = new Map();
    const ensure = name => {
      if (!map.has(name)) map.set(name, { domain: notionDomainMeta(name), courses: [], sample: "" });
      return map.get(name);
    };

    NOTION_DOMAIN_ORDER.forEach(ensure);
    NOTION_COURSES.forEach(course => {
      const names = course.domains && course.domains.length ? course.domains : ["未歸類"];
      names.forEach(name => {
        const group = ensure(name);
        group.courses.push(course);
        if (!group.sample) group.sample = course.title || "";
      });
    });

    const ordered = [];
    NOTION_DOMAIN_ORDER.forEach(name => {
      const group = map.get(name);
      if (group && group.courses.length) ordered.push(group);
    });
    Array.from(map.values()).forEach(group => {
      if (!NOTION_DOMAIN_ORDER.includes(group.domain.name) &&
          group.domain.name !== "未歸類" &&
          group.courses.length) ordered.push(group);
    });
    const unassigned = map.get("未歸類");
    if (unassigned && unassigned.courses.length) ordered.push(unassigned);
    ordered.forEach(group => {
      group.courses.sort((a, b) => String(a.title || "").localeCompare(String(b.title || ""), "en", { numeric: true }));
    });
    return ordered;
  }

  function courseForRoadmap(slug) {
    const ids = roadmapToNotion.get(slug) || [];
    for (const id of ids) {
      const course = notionCourseMap.get(id);
      if (course) return course;
    }
    return null;
  }

  function coursesForRoadmap(slug) {
    const ids = roadmapToNotion.get(slug) || [];
    return ids.map(id => notionCourseMap.get(id)).filter(Boolean);
  }

  function problemEntriesForDomain(domainName) {
    const entries = [];
    allTopics.forEach(row => {
      const linkedCourses = coursesForRoadmap(row.topic.id);
      const belongs = domainName === "未歸類"
        ? linkedCourses.length === 0 || linkedCourses.every(course => !(course.domains || []).length)
        : linkedCourses.some(course => (course.domains || []).includes(domainName));
      if (!belongs) return;
      entries.push({ row, linkedCourses });
    });
    return entries;
  }

  function problemCountForDomain(domainName) {
    return problemEntriesForDomain(domainName)
      .reduce((sum, entry) => sum + (entry.row.topic.problems || []).length, 0);
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
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.setAttribute("content", dark ? "#111111" : "#ffffff");
    const btn = document.getElementById("theme-toggle");
    if (btn) btn.textContent = dark ? "☀" : "◐";
    if (window.NotionXBridge && typeof window.NotionXBridge.setTheme === "function") {
      window.NotionXBridge.setTheme(dark);
    }
  }

  function showView(name, forceRender) {
    const valid = ["welcome", "home", "roadmap", "courses", "problems", "resources"];
    if (!valid.includes(name)) name = "home";
    const activeView = document.querySelector(".view.active")?.dataset.view;
    const viewChanged = activeView !== name;
    state.baseView = name;
    document.body.classList.toggle("welcome-active", name === "welcome");
    document.querySelectorAll(".view").forEach(el => el.classList.toggle("active", el.dataset.view === name));
    document.querySelectorAll("[data-nav]").forEach(el => el.classList.toggle("active", el.dataset.nav === name));
    if (!viewChanged && !forceRender && renderedViews.has(name)) return;
    window.scrollTo({ top: 0, behavior: "auto" });
    if (name === "welcome") {
      renderWelcome();
      if (window.CourseFX && typeof window.CourseFX.activateWelcome === "function") {
        window.CourseFX.activateWelcome();
      }
    } else if (window.CourseFX && typeof window.CourseFX.deactivateWelcome === "function") {
      window.CourseFX.deactivateWelcome();
    }
    if (name === "home") renderHome();
    if (name === "roadmap") renderRoadmap();
    if (name === "courses") renderCourses();
    if (name === "problems") renderProblems();
    if (name === "resources") renderResources();
    renderedViews.add(name);
  }

  function router() {
    const hash = location.hash || "#/welcome";
    const clean = hash.replace(/^#\/?/, "");
    const lessonMatch = clean.match(/^lesson\/([0-9a-f]{32})(?:\?block=([0-9a-f]{32}))?$/i);

    if (lessonMatch) {
      const base = state.baseView === "home" ? "courses" : state.baseView;
      showView(base);
      openLesson(lessonMatch[1], false, lessonMatch[2] || "");
      return;
    }

    const parts = clean.split("/").filter(Boolean);

    if (parts[0] === "problems") {
      closeLesson(false);
      state.problemDomain = parts.length > 1 ? decodeURIComponent(parts.slice(1).join("/")) : "";
      showView("problems");
      return;
    }

    closeLesson(false);
    showView(parts[0] || "welcome");
  }

  function renderWelcome() {
    const totalCourses = NOTION_COURSES.length;
    const totalDomains = NOTION_DOMAIN_ORDER.length;
    const totalLadders = NOTION_LADDERS.length;
    const doneCourses = state.read.filter(id => notionCourseMap.has(id)).length;
    const progress = totalCourses ? Math.round(doneCourses / totalCourses * 100) : 0;

    const stats = [
      ["welcome-course-count", totalCourses, ""],
      ["welcome-domain-count", totalDomains, ""],
      ["welcome-ladder-count", totalLadders, ""],
      ["welcome-progress-count", progress, "%"]
    ];

    stats.forEach(([id, value, suffix]) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.dataset.count = String(value);
      el.dataset.suffix = suffix;
    });

    const track = document.getElementById("welcome-domain-track");
    if (track) {
      const names = NOTION_DOMAIN_ORDER.length ? NOTION_DOMAIN_ORDER : notionDomainGroups().map(group => group.domain.name);
      const loop = [...names, ...names];
      track.innerHTML = loop.map(name => '<span>' + esc(name) + '</span>').join("");
    }

    if (window.CourseFX && typeof window.CourseFX.refreshWelcome === "function") {
      window.CourseFX.refreshWelcome();
    }
  }

  function renderHome() {
    const totalProblems = Array.from(problemMap.keys()).length;
    const doneCourses = state.read.filter(id => notionCourseMap.has(id)).length;
    const progress = NOTION_COURSES.length ? Math.round(doneCourses / NOTION_COURSES.length * 100) : 0;
    document.getElementById("stat-topics").textContent = NOTION_COURSES.length;
    document.getElementById("stat-problems").textContent = totalProblems;
    document.getElementById("stat-progress").textContent = progress + "%";
    document.getElementById("stat-levels").textContent = NOTION_DOMAIN_ORDER.length;

    const groups = notionDomainGroups();
    const domainHost = document.getElementById("domain-cards");
    domainHost.innerHTML = "";
    groups.forEach(group => {
      const div = document.createElement("article");
      div.className = "domain-card";
      div.innerHTML =
        "<h3>" + esc(group.domain.name) + "</h3>" +
        '<div class="domain-count">' + group.courses.length + " 課</div>";
      div.addEventListener("click", () => {
        state.courseDomain = group.domain.name;
        location.hash = "#/courses";
      });
      domainHost.appendChild(div);
    });

    const next = NOTION_COURSES.find(course => !state.read.includes(course.id)) || NOTION_COURSES[0];
    const continueTitle = document.getElementById("continue-title");
    const continueDesc = document.getElementById("continue-desc");
    const continueBtn = document.getElementById("continue-btn");
    if (next) {
      continueTitle.textContent = courseDisplayTitle(next);
      continueDesc.hidden = true;
      continueDesc.textContent = "";
      continueBtn.hidden = false;
      continueBtn.onclick = () => openLesson(next.id, true);
    } else {
      continueTitle.textContent = "";
      continueDesc.hidden = true;
      continueBtn.hidden = true;
    }
  }

  function renderRoadmap() {
    const groups = notionDomainGroups();
    const filters = document.getElementById("roadmap-filters");
    filters.innerHTML = "";

    const all = document.createElement("button");
    all.className = "chip" + (state.roadmapFilter === "all" ? " active" : "");
    all.textContent = "全部單元";
    all.onclick = () => { state.roadmapFilter = "all"; renderRoadmap(); };
    filters.appendChild(all);

    groups.forEach(group => {
      const btn = document.createElement("button");
      btn.className = "chip" + (state.roadmapFilter === group.domain.name ? " active" : "");
      btn.textContent = group.domain.name;
      btn.onclick = () => { state.roadmapFilter = group.domain.name; renderRoadmap(); };
      filters.appendChild(btn);
    });

    const host = document.getElementById("roadmap-view");
    host.innerHTML = "";
    groups.forEach((group, index) => {
      if (state.roadmapFilter !== "all" && state.roadmapFilter !== group.domain.name) return;
      const completed = group.courses.filter(course => state.read.includes(course.id)).length;
      const block = document.createElement("section");
      block.className = "roadmap-level";

      const meta = document.createElement("div");
      meta.className = "roadmap-level-meta";
      const pct = group.courses.length ? Math.round(completed / group.courses.length * 100) : 0;
      meta.innerHTML =
        '<span class="eyebrow">Unit ' + String(index + 1).padStart(2, "0") + "</span>" +
        "<h2>" + esc(group.domain.name) + "</h2>" +
        "<p>" + group.courses.length + " 堂課</p>" +
        '<div class="level-progress"><div class="mini-progress"><span style="width:' + pct + '%"></span></div></div>';

      const nodes = document.createElement("div");
      nodes.className = "roadmap-nodes";
      group.courses.forEach(course => {
        const done = state.read.includes(course.id);
        const node = document.createElement("article");
        node.className = "roadmap-node" + (done ? " done" : "") + (course.isPlaceholder ? " coming-soon" : "");
        const badge = course.isPlaceholder
          ? '<span class="node-badge muted">Coming soon</span>'
          : (course.difficulty == null ? "" : '<span class="node-badge">難度 ' + esc(course.difficulty) + '/10</span>');
        node.innerHTML =
          '<div class="node-top"><h3>' + esc(courseDisplayTitle(course)) + "</h3>" + badge + "</div>" +
          (course.details ? "<p>" + esc(course.details) + "</p>" : "");
        node.onclick = () => openLesson(course.id, true);
        nodes.appendChild(node);
      });

      block.append(meta, nodes);
      host.appendChild(block);
    });
  }

  function renderCourses() {
    const groups = notionDomainGroups();
    const domainSelect = document.getElementById("course-domain");
    const domainSignature = groups.map(group => group.domain.name).join("\n");
    if (domainSelect.dataset.signature !== domainSignature) {
      domainSelect.innerHTML = '<option value="all">全部大單元</option>';
      groups.forEach(group => {
        const op = document.createElement("option");
        op.value = group.domain.name;
        op.textContent = group.domain.name;
        domainSelect.appendChild(op);
      });
      domainSelect.dataset.signature = domainSignature;
    }
    if (![...domainSelect.options].some(op => op.value === state.courseDomain)) state.courseDomain = "all";
    domainSelect.value = state.courseDomain;
    document.getElementById("course-level").value = state.courseLevel;
    document.getElementById("course-search").value = state.courseSearch;

    const q = state.courseSearch.trim().toLowerCase();
    const matches = course => {
      const text = courseSearchText(course);
      const band = course.difficulty == null ? null : levelBand(course.difficulty);
      return (!q || text.includes(q)) &&
        (state.courseLevel === "all" || band === state.courseLevel);
    };

    const host = document.getElementById("courses-grid");
    host.innerHTML = "";
    let shown = 0;

    groups.forEach(group => {
      if (state.courseDomain !== "all" && state.courseDomain !== group.domain.name) return;
      const courses = group.courses.filter(matches);
      if (!courses.length) return;
      shown += courses.length;

      const section = document.createElement("section");
      section.className = "unit-section";
      const heading = document.createElement("div");
      heading.className = "unit-heading";
      heading.innerHTML =
        '<div><span class="eyebrow">Unit</span><h2>' + esc(group.domain.name) + '</h2></div>' +
        '<span class="unit-count">' + courses.length + " lessons</span>";

      const grid = document.createElement("div");
      grid.className = "unit-course-grid";

      courses.forEach(course => {
        const card = document.createElement("article");
        card.className = "course-card" + (course.isPlaceholder ? " coming-soon" : "");
        const diff = course.difficulty;
        const bars = diff == null ? "" : Array.from({ length: 5 }, (_, i) =>
          '<i class="' + (i < Math.ceil(diff / 2) ? "on" : "") + '"></i>'
        ).join("");
        const relationTags = "";
        const difficultyTag = course.isPlaceholder
          ? '<span class="tag muted">Coming soon</span>'
          : (diff == null ? "" : '<span class="tag">難度 ' + esc(diff) + '/10</span>');
        const footer = diff == null ? "" :
          '<div class="course-footer"><div class="difficulty" title="難度 ' + esc(diff) + '/10">' + bars + '</div></div>';

        card.innerHTML =
          ((relationTags || difficultyTag) ? '<div class="tag-row">' + relationTags + difficultyTag + '</div>' : "") +
          "<h3>" + esc(courseDisplayTitle(course)) + "</h3>" +
          (course.details ? "<p>" + esc(course.details) + "</p>" : "") +
          footer;
        card.onclick = () => openLesson(course.id, true);
        grid.appendChild(card);
      });

      section.append(heading, grid);
      host.appendChild(section);
    });

    document.getElementById("course-empty").hidden = shown !== 0;
  }

  function renderProblems() {
    const home = document.getElementById("problem-domain-home");
    const detail = document.getElementById("problem-domain-detail");
    const groups = notionDomainGroups();

    if (!state.problemDomain) {
      home.hidden = false;
      detail.hidden = true;

      const grid = document.getElementById("problem-domain-grid");
      grid.innerHTML = "";
      groups.forEach(group => {
        const problemCount = problemCountForDomain(group.domain.name);
        const ladderCount = NOTION_LADDERS.filter(ladder => ladder.domain === group.domain.name).length;
        const card = document.createElement("article");
        card.className = "problem-domain-card";
        card.innerHTML =
          "<h2>" + esc(group.domain.name) + "</h2>" +
          '<div class="problem-domain-meta"><span>' + group.courses.length + " 課</span><span>" +
          ladderCount + " 題單</span><span>" + problemCount + " 題</span></div>";
        card.onclick = () => {
          location.hash = "#/problems/" + encodeURIComponent(group.domain.name);
        };
        grid.appendChild(card);
      });
      return;
    }

    const group = groups.find(item => item.domain.name === state.problemDomain);
    if (!group) {
      state.problemDomain = "";
      location.hash = "#/problems";
      return;
    }

    home.hidden = true;
    detail.hidden = false;
    document.getElementById("problem-domain-title").textContent = group.domain.name;

    const courseHost = document.getElementById("problem-course-list");
    courseHost.innerHTML = "";
    group.courses.forEach(course => {
      const row = document.createElement("button");
      row.className = "problem-course-row";
      row.innerHTML =
        '<span class="problem-course-name">' + esc(courseDisplayTitle(course)) + "</span>" +
        (course.difficulty == null ? "" : '<span class="problem-course-diff">' + esc(course.difficulty) + "/10</span>") +
        '<span class="problem-course-arrow">→</span>';
      row.onclick = () => openLesson(course.id, true);
      courseHost.appendChild(row);
    });

    const migratedHost = document.getElementById("migrated-ladders");
    cancelRendersWithin(migratedHost);
    if (window.NotionXBridge?.unmountWithin) window.NotionXBridge.unmountWithin(migratedHost);
    migratedHost.innerHTML = "";
    const migrated = NOTION_LADDERS
      .filter(ladder => ladder.domain === group.domain.name)
      .sort((a, b) => String(a.title || "").localeCompare(String(b.title || ""), "en", { numeric: true }));

    migrated.forEach((ladder, index) => {
      const details = document.createElement("details");
      details.className = "migrated-ladder";
      if (migrated.length === 1) details.open = true;
      const summary = document.createElement("summary");
      let label = String(ladder.title || "");
      label = label.replace("Problem Ladder — ", "").replace("Problem Ladder - ", "");
      summary.innerHTML =
        '<span class="ladder-step-index">' + String(index + 1).padStart(2, "0") + "</span>" +
        "<span>" + esc(label) + "</span>";
      const body = document.createElement("div");
      body.className = "migrated-ladder-body markdown-body";
      const loadLadder = () => {
        if (!details.open || body.dataset.loaded === "1") return;
        body.dataset.loaded = "1";
        renderNotionPageInto(body, ladder.id, ladder.content || "", false, ladder);
      };
      details.addEventListener("toggle", loadLadder);
      details.append(summary, body);
      migratedHost.appendChild(details);
      loadLadder();
    });
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

    const allEntries = problemEntriesForDomain(group.domain.name);
    const allDomainProblems = allEntries.flatMap(entry => entry.row.topic.problems || []);
    const solved = allDomainProblems.filter(problem => state.solved.includes(problem.id)).length;
    const pct = allDomainProblems.length ? Math.round(solved / allDomainProblems.length * 100) : 0;
    document.getElementById("problem-progress").innerHTML =
      '<div class="ladder-progress-line"><span>' + solved + " / " + allDomainProblems.length +
      '</span><strong>' + pct + '%</strong></div>' +
      '<div class="mini-progress"><span style="width:' + pct + '%"></span></div>';

    const q = state.problemSearch.trim().toLowerCase();
    const ladder = document.getElementById("problem-ladder");
    ladder.innerHTML = "";

    allEntries.forEach(({ row }, entryIndex) => {
      const problems = (row.topic.problems || []).filter(problem => {
        const solvedNow = state.solved.includes(problem.id);
        const text = ((problem.name || "") + " " + (problem.platform || "")).toLowerCase();
        return (!q || text.includes(q)) &&
          (state.problemPlatform === "all" || problem.platform === state.problemPlatform) &&
          (!state.hideSolved || !solvedNow);
      });
      if (!problems.length) return;

      const step = entryIndex + 1;
      const block = document.createElement("section");
      block.className = "ladder-step";

      const head = document.createElement("div");
      head.className = "ladder-step-head";
      const doneCount = (row.topic.problems || []).filter(problem => state.solved.includes(problem.id)).length;
      head.innerHTML =
        '<span class="ladder-step-index">' + String(step).padStart(2, "0") + "</span>" +
        '<div><h3>' + esc(row.topic.title) + '</h3><small>' +
        doneCount + " / " + (row.topic.problems || []).length + "</small></div>";
      block.appendChild(head);

      problems.forEach(problem => {
        const solvedNow = state.solved.includes(problem.id);
        const line = document.createElement("div");
        line.className = "problem-row";
        line.innerHTML =
          '<input type="checkbox" ' + (solvedNow ? "checked" : "") + ' aria-label="完成題目">' +
          '<div><div class="problem-name">' + esc(problem.name) + '</div><div class="problem-meta">' +
          esc(problem.platform || "") + "</div></div>" +
          '<span class="problem-diff">' + esc(problem.difficulty || "") + "</span>" +
          '<a href="' + esc(problem.url || "#") + '" target="_blank" rel="noreferrer">開啟 ↗</a>';
        line.querySelector("input").addEventListener("change", event => toggleProblem(problem.id, event.target.checked));
        block.appendChild(line);
      });

      ladder.appendChild(block);
    });

    if (!ladder.children.length) ladder.innerHTML = '<div class="empty-state">目前沒有題目</div>';
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
    if (!TEMPLATES.length) {
      host.innerHTML = '<div class="empty-state">載入模板…</div>';
      ensureTemplates()
        .then(() => {
          if (state.baseView === "resources") renderResources();
        })
        .catch(error => {
          console.warn("[Coding Course] template data unavailable", error);
          host.innerHTML = '<div class="empty-state">模板載入失敗，請重新整理。</div>';
        });
      return;
    }

    host.innerHTML = "";
    const data = TEMPLATES.slice(0, 12);
    data.forEach(temp => {
      const card = document.createElement("article");
      card.className = "template-card";
      card.innerHTML = "<h3>" + esc(temp.title || temp.id) + "</h3>";
      host.appendChild(card);
    });
  }

  function openLesson(id, pushHash, blockId) {
    const requestedId = String(id || "").replace(/-/g, "").toLowerCase();
    let course = notionCourseMap.get(requestedId);
    if (!course) course = courseForRoadmap(id);

    // Notion child pages are not necessarily catalog lessons. Keep them inside
    // Coding Course and let the live page API render them in the same overlay.
    if (!course && /^[0-9a-f]{32}$/.test(requestedId)) {
      const fallbackPage = NOTION_CHILD_PAGES[requestedId] || {};
      course = {
        id: requestedId,
        title: fallbackPage.title || "載入課程內容…",
        details: "",
        difficulty: null,
        domains: [],
        domain: "",
        hasContent: true,
        isPlaceholder: false,
        live: true,
        isNotionSubpage: true,
        content: fallbackPage.content || ""
      };
    }

    if (!course) {
      toast("這堂課在 Coding Course 中沒有非空白內文");
      return;
    }

    state.activeTopic = { source: "notion", course };
    if (!course.isNotionSubpage) localStorage.setItem(STORAGE.last, course.id);

    const domains = course.domains && course.domains.length ? course.domains : [];
    document.getElementById("lesson-breadcrumb").textContent =
      "Coding Course" + (domains.length ? " / " + domains.join(" / ") : "");
    document.getElementById("lesson-title").textContent = courseDisplayTitle(course);

    const desc = document.getElementById("lesson-desc");
    if (course.details) {
      desc.hidden = false;
      desc.textContent = course.details;
    } else {
      desc.hidden = true;
      desc.textContent = "";
    }

    let tags = "";
    if (course.difficulty != null) tags += '<span class="tag">難度 ' + esc(course.difficulty) + '/10</span>';
    document.getElementById("lesson-tags").innerHTML = tags;

    document.getElementById("lesson-prereq").style.display = "none";
    document.querySelector(".lesson-end").style.display = "none";

    refreshLessonProgress();
    renderCourseContent(course, blockId);

    document.getElementById("lesson-overlay").classList.add("open");
    document.getElementById("lesson-overlay").setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (pushHash) {
      history.pushState(null, "", "#/lesson/" + encodeURIComponent(course.id) + (blockId ? "?block=" + encodeURIComponent(blockId) : ""));
    }
  }

  function closeLesson(pushHash) {
    const overlay = document.getElementById("lesson-overlay");
    if (!overlay.classList.contains("open") && !state.activeTopic) return;
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    const lessonHost = document.getElementById("lesson-content");
    cancelRendersWithin(lessonHost);
    if (window.NotionXBridge?.unmount) window.NotionXBridge.unmount(lessonHost);
    state.activeTopic = null;
    if (pushHash) location.hash = state.baseView === "problems" && state.problemDomain ? "#/problems/" + encodeURIComponent(state.problemDomain) : "#/" + state.baseView;
  }

  function refreshLessonProgress() {
    if (!state.activeTopic || !state.activeTopic.course) return;
    const id = state.activeTopic.course.id;
    const marked = state.read.includes(id);
    document.getElementById("lesson-progress-label").textContent = marked ? "已完成" : "未開始";
    document.getElementById("lesson-progress-fill").style.width = marked ? "100%" : "0%";
    const btn = document.getElementById("lesson-mark");
    btn.textContent = marked ? "✓ 已完成" : "標記已完成";
  }

  function toggleLessonComplete() {
    if (!state.activeTopic || !state.activeTopic.course) return;
    const id = state.activeTopic.course.id;
    if (state.read.includes(id)) state.read = state.read.filter(x => x !== id);
    else state.read.push(id);
    persist();
    refreshLessonProgress();
    renderHome();
    renderRoadmap();
    toast(state.read.includes(id) ? "課程已完成" : "已取消完成");
  }

  function normalizeNotionMath(markdown) {
    return String(markdown || "")
      .replace(/\$\`([^\`\n]+)\`\$/g, (_, body) => "$" + body + "$");
  }

  function protectMarkdownCode(markdown) {
    const stash = [];
    const hold = value => {
      const id = stash.push(value) - 1;
      return "\uE000" + id + "\uE001";
    };
    let text = String(markdown || "");
    text = text.replace(/```[\s\S]*?```/g, hold);
    text = text.replace(/\$\$[\s\S]*?\$\$/g, hold);
    text = text.replace(/\\\[[\s\S]*?\\\]/g, hold);
    text = text.replace(/\\\([^\n]*?\\\)/g, hold);
    text = text.replace(/\$[^$\n]+\$/g, hold);
    text = text.replace(/`[^`\n]*`/g, hold);
    return {
      text,
      restore(value) {
        return value.replace(/\uE000(\d+)\uE001/g, (_, id) => stash[Number(id)] || "");
      }
    };
  }

  function convertNotionToggleHeadings(markdown) {
    const lines = String(markdown || "").split("\n");
    const out = [];
    const stack = [];

    lines.forEach(originalLine => {
      let line = originalLine;
      let removeTabs = stack.length;
      while (removeTabs > 0 && line.startsWith("\t")) {
        line = line.slice(1);
        removeTabs--;
      }

      const toggle = line.match(/^(#{1,6})\s+(.+?)\s*\{toggle\s*=\s*["']true["']\}\s*$/i);
      const heading = toggle || line.match(/^(#{1,6})\s+/);
      const level = heading ? heading[1].length : null;

      if (level != null) {
        while (stack.length && stack[stack.length - 1] >= level) {
          out.push("</details>");
          stack.pop();
        }
      }

      if (toggle) {
        out.push('<details class="notion-toggle notion-toggle-h' + level + '"><summary>' + toggle[2].trim() + "</summary>");
        stack.push(level);
      } else {
        out.push(line);
      }
    });

    while (stack.length) {
      out.push("</details>");
      stack.pop();
    }
    return out.join("\n");
  }

  function deindentNotionDetails(markdown) {
    const lines = String(markdown || "").split("\n");
    const out = [];
    let depth = 0;

    lines.forEach(originalLine => {
      const trimmed = originalLine.trimStart();
      const closing = /^<\/details\s*>/i.test(trimmed);
      if (closing) depth = Math.max(0, depth - 1);

      let line = originalLine;
      let removeTabs = depth;
      while (removeTabs > 0 && line.startsWith("\t")) {
        line = line.slice(1);
        removeTabs--;
      }
      out.push(line);

      if (/^<details(?:\s|>)/i.test(trimmed)) depth++;
    });

    return out.join("\n");
  }

  function isolateNotionHtmlBlocks(markdown) {
    return String(markdown || "")
      .replace(/(^|\n)[ \t]*(<table\b)/gi, "$1\n$2")
      .replace(/<\/table>[ \t]*(?=\n|$)/gi, "</table>\n\n")
      .replace(/(^|\n)[ \t]*(<details\b)/gi, "$1\n$2")
      .replace(/<\/details>[ \t]*(?=\n|$)/gi, "</details>\n\n")
      .replace(/(^|\n)[ \t]*```/g, "$1```")
      .replace(/```[ \t]*(?=\n|$)/g, "```\n");
  }

  function escapeNonHtmlAngles(markdown) {
    const allowed = new Set([
      "a","abbr","b","blockquote","br","code","col","colgroup","dd","del","details","div","dl","dt",
      "em","figure","figcaption","h1","h2","h3","h4","h5","h6","hr","i","img","kbd","li","mark",
      "ol","p","pre","s","small","span","strong","sub","summary","sup","table","tbody","td","tfoot",
      "th","thead","tr","u","ul"
    ]);
    return String(markdown || "").replace(/<([^>\n]+)>/g, full => {
      const inner = full.slice(1, -1).trim();
      const cleaned = inner.replace(/^\//, "").trim();
      const nameMatch = cleaned.match(/^([a-zA-Z][\w-]*)\b/);
      const name = nameMatch ? nameMatch[1].toLowerCase() : "";
      if (allowed.has(name) || inner.startsWith("!--")) return full;
      return full.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    });
  }

  function notionPageIdFromUrl(url) {
    const raw = String(url || "").trim();
    const isNotionAbsolute = /^https?:\/\/(?:www\.)?(?:app\.)?notion\.(?:so|com)\//i.test(raw);
    const isNotionRelative = /^\/p\/[0-9a-f]{32}(?=$|[?#/])/i.test(raw);
    if (!isNotionAbsolute && !isNotionRelative) return "";
    const match = raw.match(/([0-9a-f]{32})(?=$|[?#/])/i);
    return match ? match[1].toLowerCase() : "";
  }

  function routeNotionPageUrl(url) {
    const id = notionPageIdFromUrl(url);
    return id ? "#/lesson/" + id : url;
  }

  function preprocessNotionMarkdown(markdown) {
    const normalized = normalizeNotionMath(markdown)
      .split("\n")
      .map(line => line.replace(/^\t+/, ""))
      .join("\n");
    const protectedCode = protectMarkdownCode(normalized);
    let text = protectedCode.text;

    text = text.replace(/<empty-block\s*\/>/gi, "");

    text = text.replace(
      /<(?:page)\s+url="([^"]*)"\s*>([\s\S]*?)<\/page>/gi,
      (_, url, label) => '<a class="notion-page-block" href="' + routeNotionPageUrl(url) + '">' + label.trim() + '<span>↗</span></a>'
    );
    text = text.replace(
      /<mention-page\s+url="([^"]*)"\s*>([\s\S]*?)<\/mention-page>/gi,
      (_, url, label) => '<a class="notion-mention" href="' + routeNotionPageUrl(url) + '">' + label.trim() + "</a>"
    );
    text = text.replace(
      /<embed\s+src="([^"]*)"\s*>\s*<\/embed>/gi,
      (_, src) => src ? '<a class="notion-attachment" href="' + src + '">Embed ↗</a>' : ""
    );
    text = text.replace(
      /<unknown\s+url="([^"]*)"\s+alt="([^"]*)"\s*\/>/gi,
      (_, url, alt) => {
        const label = alt && alt.toLowerCase() !== "button" ? alt : "開啟";
        return '<a class="notion-button-block" href="' + routeNotionPageUrl(url) + '">' + label + " ↗</a>";
      }
    );
    text = text.replace(
      /<(file|pdf)\s+src="([^"]*)"\s*>\s*<\/\1>/gi,
      (_, kind, src) => {
        const label = kind.toUpperCase();
        if (src) return '<a class="notion-attachment" href="' + src + '">' + label + " ↗</a>";
        return '<span class="notion-attachment notion-attachment-empty">' + label + "</span>";
      }
    );

    text = convertNotionToggleHeadings(text);
    text = deindentNotionDetails(text);
    text = isolateNotionHtmlBlocks(text);
    text = escapeNonHtmlAngles(text);
    return protectedCode.restore(text);
  }

  let notionRenderCounter = 0;

  function renderLessonPlaceholder(host, title) {
    if (window.NotionXBridge?.unmount) window.NotionXBridge.unmount(host);
    host.className = "lesson-placeholder";
    host.innerHTML =
      '<div class="lesson-placeholder-mark">Coming soon</div>' +
      '<h2>' + esc(title || "這堂課") + '</h2>' +
      '<p>Notion 已建立課程空殼；內容補上後，這裡會自動顯示，不需要再 push 網站。</p>';
    const toc = document.getElementById("lesson-toc");
    if (toc) toc.innerHTML = "";
  }

  function renderLessonError(host, course, message) {
    if (window.NotionXBridge?.unmount) window.NotionXBridge.unmount(host);
    host.className = "lesson-load-error";
    host.innerHTML =
      '<strong>內容暫時載入失敗</strong>' +
      '<p>' + esc(message || "請稍後再試。") + '</p>' +
      '<button type="button" class="btn small ghost">重新載入</button>';
    host.querySelector("button")?.addEventListener("click", () => renderCourseContent(course));
  }

  async function renderNotionPageInto(host, pageId, fallbackMarkdown, makeToc, courseMeta, blockId) {
    const token = String(++notionRenderCounter);
    host.dataset.notionRenderToken = token;

    activePageRenders.get(host)?.controller.abort();

    if (window.NotionXBridge?.unmount) window.NotionXBridge.unmount(host);

    if (courseMeta?.staticOnly && String(fallbackMarkdown || "").trim()) {
      host.className = "markdown-body";
      renderNotionMarkdownInto(host, fallbackMarkdown, makeToc);
      return;
    }

    if (courseMeta?.isPlaceholder || courseMeta?.hasContent === false) {
      renderLessonPlaceholder(host, courseMeta?.title);
      return;
    }

    host.className = "notion-live-host";
    host.innerHTML =
      '<div class="notion-loading" aria-label="載入課程內容">' +
      '<i></i><i></i><i></i><i></i>' +
      '</div>';

    const controller = new AbortController();
    activePageRenders.set(host, { token, controller });
    const timer = setTimeout(() => controller.abort(), 25000);
    let rendererError = null;
    const rendererReady = ensureNotionRenderer().catch(error => {
      rendererError = error;
    });

    try {
      const cleanId = String(pageId || "").replace(/-/g, "").toLowerCase();
      const payload = await loadNotionPayload(cleanId, controller.signal);
      await rendererReady;
      if (rendererError) throw rendererError;

      if (host.dataset.notionRenderToken !== token) return;

      const lessonHost = document.getElementById("lesson-content");
      if (host === lessonHost && state.activeTopic?.course?.id === cleanId && payload.title) {
        courseMeta.title = String(payload.title);
        const title = document.getElementById("lesson-title");
        if (title) title.textContent = courseMeta.title;
      }

      if (payload.hasContent === false) {
        if (String(fallbackMarkdown || "").trim()) {
          host.className = "markdown-body";
          renderNotionMarkdownInto(host, fallbackMarkdown, makeToc);
        } else {
          renderLessonPlaceholder(host, courseMeta?.title || payload.title);
        }
        return;
      }

      if (!window.NotionXBridge || typeof window.NotionXBridge.render !== "function") {
        throw new Error("Notion renderer 尚未載入");
      }

      host.replaceChildren();
      host.className = "notion-live-host";
      const ok = window.NotionXBridge.render(host, payload.blockMap, {
        onReady: () => {
          if (host.dataset.notionRenderToken !== token) return;
          if (makeToc) buildToc(host);
          if (blockId) scrollToNotionBlock(host, blockId);
        },
        onError: error => {
          if (host.dataset.notionRenderToken !== token) return;
          console.error("[Coding Course] Notion render failed", cleanId, error);
          setTimeout(() => {
            if (host.dataset.notionRenderToken === token) {
              renderNotionFallback(host, fallbackMarkdown, makeToc, courseMeta, cleanId);
            }
          }, 0);
        }
      });
      if (!ok) throw new Error("Notion blockMap 無法渲染");
    } catch (error) {
      if (host.dataset.notionRenderToken !== token) return;
      console.warn("[Coding Course] live page unavailable", pageId, error);

      await rendererReady;
      renderNotionFallback(host, fallbackMarkdown, makeToc, courseMeta, pageId);
    } finally {
      clearTimeout(timer);
      if (activePageRenders.get(host)?.token === token) activePageRenders.delete(host);
    }
  }

  function renderNotionFallback(host, fallbackMarkdown, makeToc, courseMeta, pageId) {
    if (window.NotionXBridge?.unmount) window.NotionXBridge.unmount(host);
    if (String(fallbackMarkdown || "").trim()) {
      host.className = "markdown-body";
      renderNotionMarkdownInto(host, fallbackMarkdown, makeToc);
    } else if (courseMeta?.isPlaceholder) {
      renderLessonPlaceholder(host, courseMeta?.title);
    } else {
      renderLessonError(host, courseMeta || { id: pageId }, "無法顯示 Notion 內容，請重新載入。");
    }
  }


  function renderNotionMarkdownInto(host, markdown, makeToc) {
    const source = String(markdown || "");
    if (!source.trim()) {
      host.innerHTML = "";
      if (makeToc) buildToc(host);
      return;
    }

    if (window.marked) {
      window.marked.setOptions({ gfm: true, breaks: false });
      host.innerHTML = window.marked.parse(preprocessNotionMarkdown(source));
    } else {
      host.textContent = source;
    }

    enhanceNotionDetails(host);
    enhanceNotionInlineBlocks(host);
    enhanceCodeBlocks(host);
    renderLessonMath(host);
    if (makeToc) buildToc(host);
  }

  function renderCourseContent(course, blockId) {
    renderNotionPageInto(
      document.getElementById("lesson-content"),
      course.id,
      course.content || "",
      true,
      course,
      blockId
    );
  }

  function enhanceNotionDetails(host) {
    if (!window.marked) return;

    const parseTextRun = nodes => {
      const source = nodes.map(node => node.textContent || "").join("");
      const fragment = document.createDocumentFragment();

      if (!source.trim()) {
        nodes.forEach(node => fragment.appendChild(node));
        return fragment;
      }

      const holder = document.createElement("div");
      holder.innerHTML = window.marked.parse(preprocessNotionMarkdown(source));
      while (holder.firstChild) fragment.appendChild(holder.firstChild);
      return fragment;
    };

    const process = detail => {
      if (!detail || detail.dataset.notionReady === "1") return;
      const summary = detail.querySelector(":scope > summary");
      if (!summary) return;

      if (window.marked.parseInline) {
        summary.innerHTML = window.marked.parseInline(summary.textContent.trim());
      }

      const body = document.createElement("div");
      body.className = "notion-toggle-body";

      // Do not serialize already-rendered DOM back into Markdown.
      // Re-parsing outerHTML double-escapes code and exposes closing tags.
      const nodes = Array.from(detail.childNodes).filter(node => node !== summary);
      let textRun = [];

      const flushTextRun = () => {
        if (!textRun.length) return;
        body.appendChild(parseTextRun(textRun));
        textRun = [];
      };

      nodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          textRun.push(node);
          return;
        }

        flushTextRun();
        body.appendChild(node);
      });
      flushTextRun();

      detail.appendChild(body);
      detail.classList.add("notion-toggle");
      detail.dataset.notionReady = "1";

      Array.from(body.querySelectorAll("details")).forEach(process);
    };

    Array.from(host.querySelectorAll("details"))
      .filter(detail => !detail.parentElement.closest("details"))
      .forEach(process);
  }

  function enhanceNotionInlineBlocks(host) {
    if (window.marked && window.marked.parseInline) {
      const renderTextNodes = root => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);

        nodes.forEach(node => {
          const parent = node.parentElement;
          if (!parent || parent.closest("pre,code,a,.katex")) return;
          const raw = node.textContent || "";
          if (!raw || raw.includes("$") || !/[\*\_~`\[]/.test(raw)) return;

          const html = window.marked.parseInline(raw);
          if (html === raw) return;
          const template = document.createElement("template");
          template.innerHTML = html;
          node.replaceWith(template.content);
        });
      };

      host.querySelectorAll("td,th,span[color]").forEach(renderTextNodes);
    }

    const colors = {
      gray:"#787774", brown:"#9f6b53", orange:"#d9730d", yellow:"#cb912f",
      green:"#448361", blue:"#337ea9", purple:"#9065b0", pink:"#c14c8a", red:"#d44c47"
    };
    const backgrounds = {
      gray:"#ebeced", brown:"#e9e5e3", orange:"#faebdd", yellow:"#fbf3db",
      green:"#ddedea", blue:"#ddebf1", purple:"#eae4f2", pink:"#f4dfeb", red:"#fbe4e4"
    };

    host.querySelectorAll("span[color]").forEach(span => {
      const value = (span.getAttribute("color") || "").toLowerCase();
      if (value.endsWith("_background")) {
        const key = value.replace("_background", "");
        if (backgrounds[key]) span.style.background = backgrounds[key];
        span.classList.add("notion-color-background");
      } else if (colors[value]) {
        span.style.color = colors[value];
      } else if (/^#[0-9a-f]{3,8}$/i.test(value)) {
        span.style.color = value;
      }
    });

    host.querySelectorAll("a").forEach(a => {
      const rawHref = a.getAttribute("href") || "";
      const routedHref = routeNotionPageUrl(rawHref);
      if (routedHref !== rawHref) a.setAttribute("href", routedHref);

      const finalHref = a.getAttribute("href") || "";
      if (/^https?:/i.test(finalHref)) {
        a.target = "_blank";
        a.rel = "noreferrer";
      } else {
        a.removeAttribute("target");
        a.removeAttribute("rel");
      }
    });

    host.querySelectorAll("img").forEach(img => {
      img.loading = "lazy";
      img.decoding = "async";
    });

    host.querySelectorAll("table").forEach(table => {
      if (table.parentElement && table.parentElement.classList.contains("notion-table-wrap")) return;
      const wrap = document.createElement("div");
      wrap.className = "notion-table-wrap";
      table.parentNode.insertBefore(wrap, table);
      wrap.appendChild(table);
    });
  }

  function enhanceCodeBlocks(host) {
    host.querySelectorAll("pre").forEach(pre => {
      const code = pre.querySelector("code");
      if (!code) return;

      let language = "";
      const langClass = Array.from(code.classList).find(name => name.startsWith("language-"));
      if (langClass) language = langClass.slice(9).trim().toLowerCase();

      if (["c++", "cpp", "cplusplus"].includes(language)) language = "cpp";
      if (["plain", "plain-text", "plain text", "text", "txt"].includes(language)) language = "plaintext";

      const source = code.textContent || "";
      const looksCpp = /#include\s*[<"]|\bstd::|\b(?:cin|cout)\s*>>?|\bvector\s*</.test(source) ||
        /\b(?:int|long long|void)\s+\w+\s*\([^)]*\)\s*\{/.test(source);

      if ((!language || language === "plaintext") && looksCpp) language = "cpp";

      code.className = language ? "language-" + language : "language-plaintext";

      if (window.hljs) {
        try {
          if (language === "plaintext") {
            code.classList.add("hljs");
          } else {
            window.hljs.highlightElement(code);
          }
        } catch (_) {
          code.classList.add("hljs");
        }
      }

      const shell = document.createElement("div");
      shell.className = "code-block";
      const toolbar = document.createElement("div");
      toolbar.className = "code-toolbar";

      const label = document.createElement("span");
      label.textContent = language === "cpp" ? "C++" :
        language === "javascript" || language === "js" ? "JavaScript" :
        language === "plaintext" || !language ? "Text" : language;

      const copy = document.createElement("button");
      copy.type = "button";
      copy.textContent = "Copy";
      copy.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(source);
          copy.textContent = "Copied";
          setTimeout(() => { copy.textContent = "Copy"; }, 1200);
        } catch (_) {
          copy.textContent = "Copy failed";
          setTimeout(() => { copy.textContent = "Copy"; }, 1200);
        }
      });

      toolbar.append(label, copy);
      pre.parentNode.insertBefore(shell, pre);
      shell.append(toolbar, pre);
    });
  }

  function renderLessonMath(host) {
    const run = () => {
      if (typeof window.renderMathInElement !== "function") return false;
      try {
        window.renderMathInElement(host, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "\\[", right: "\\]", display: true },
            { left: "\\(", right: "\\)", display: false },
            { left: "$", right: "$", display: false }
          ],
          ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code", "option"],
          ignoredClasses: ["katex", "hljs"],
          throwOnError: false,
          strict: "ignore"
        });
        return true;
      } catch (_) {
        return false;
      }
    };

    if (run()) return;
    let tries = 0;
    const retry = setInterval(() => {
      tries++;
      if (run() || tries >= 20) clearInterval(retry);
    }, 100);
  }

  function buildToc(host) {
    const toc = document.getElementById("lesson-toc");
    toc.innerHTML = "";
    const headings = host.querySelectorAll("h1,h2,h3,.notion-h1,.notion-h2,.notion-h3");
    headings.forEach((h, idx) => {
      if (!h.id) h.id = "lesson-section-" + idx;
      const a = document.createElement("a");
      a.href = location.hash;
      a.textContent = h.textContent;
      const level = h.matches("h3,.notion-h3") ? 3 : (h.matches("h2,.notion-h2") ? 2 : 1);
      a.style.paddingLeft = (level - 1) * 9 + "px";
      a.addEventListener("click", event => {
        event.preventDefault();
        h.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      toc.appendChild(a);
    });
    if (!headings.length) toc.innerHTML = '<span style="font-size:11px;color:var(--muted)">本篇沒有額外章節。</span>';
  }

  function scrollToNotionBlock(host, blockId) {
    const targetId = String(blockId || "").replace(/-/g, "").toLowerCase();
    if (!targetId) return;
    const target = Array.from(host.querySelectorAll("[id]")).find(node =>
      String(node.id || "").replace(/-/g, "").toLowerCase() === targetId
    );
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
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

      const courseResults = NOTION_COURSES.filter(course =>
        courseSearchText(course).includes(q)
      ).slice(0, 8);
      const problemResults = Array.from(problemMap.values()).filter(x =>
        ((x.problem.name || "") + " " + (x.problem.platform || "")).toLowerCase().includes(q)
      ).slice(0, 8);

      courseResults.forEach(course => {
        const item = document.createElement("div");
        item.className = "search-result";
        item.innerHTML =
          "<strong>" + esc(courseDisplayTitle(course)) + "</strong>" +
          "<small>" + ((course.domains || []).length ? esc(course.domains.join(" · ")) : "未歸類") + "</small>";
        item.onclick = () => { close(); openLesson(course.id, true); };
        results.appendChild(item);
      });

      problemResults.forEach(x => {
        const item = document.createElement("div");
        item.className = "search-result";
        item.innerHTML =
          "<strong>" + esc(x.problem.name) + "</strong><small>題目 · " + esc(x.problem.platform || "") + "</small>";
        item.onclick = () => { window.open(x.problem.url, "_blank", "noopener"); };
        results.appendChild(item);
      });

      if (!results.children.length) {
        results.innerHTML = '<div class="empty-state">沒有找到結果。</div>';
      }
    });
  }

  function setupControls() {
    let courseSearchFrame = 0;
    let problemSearchFrame = 0;
    document.getElementById("theme-toggle").onclick = event => {
      const button = event.currentTarget;
      const current = document.documentElement.dataset.theme;
      const next = current === "dark" ? "light" : "dark";
      if (window.CourseFX && typeof window.CourseFX.themeReveal === "function") {
        window.CourseFX.themeReveal(button, () => setTheme(next), event);
      } else {
        setTheme(next);
      }
    };
    document.getElementById("lesson-close").onclick = () => closeLesson(true);
    document.getElementById("lesson-mark").onclick = toggleLessonComplete;

    document.getElementById("course-search").addEventListener("input", e => {
      state.courseSearch = e.target.value;
      cancelAnimationFrame(courseSearchFrame);
      courseSearchFrame = requestAnimationFrame(renderCourses);
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
      cancelAnimationFrame(problemSearchFrame);
      problemSearchFrame = requestAnimationFrame(renderProblems);
    });
    document.getElementById("problem-platform").addEventListener("change", e => {
      state.problemPlatform = e.target.value;
      renderProblems();
    });
    document.getElementById("hide-solved").addEventListener("change", e => {
      state.hideSolved = e.target.checked;
      renderProblems();
    });

    document.getElementById("problem-domain-back").addEventListener("click", () => {
      location.hash = "#/problems";
    });
  }

  function bootstrap() {
    initData();
    setTheme(state.theme);
    setupControls();
    setupSearch();
    let routeFrame = 0;
    const scheduleRouter = () => {
      cancelAnimationFrame(routeFrame);
      routeFrame = requestAnimationFrame(() => {
        routeFrame = 0;
        router();
      });
    };
    window.addEventListener("hashchange", scheduleRouter);
    window.addEventListener("popstate", scheduleRouter);
    router();

    const refreshCatalog = async (forceContentRefresh = false) => {
      if (forceContentRefresh) pagePayloadCache.clear();
      const changed = await loadLiveCatalog();
      lastCatalogRefresh = Date.now();
      if (!changed) return;
      showView(state.baseView, true);
      const activeCourse = state.activeTopic?.course;
      const liveCourse = activeCourse && notionCourseMap.get(activeCourse.id);
      if (activeCourse?.isPlaceholder && liveCourse && !liveCourse.isPlaceholder) {
        openLesson(liveCourse.id, false);
      }
    };

    refreshCatalog();

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) return;
      if (Date.now() - lastCatalogRefresh < CATALOG_REFRESH_TTL) return;
      refreshCatalog(true);
    });

    window.addEventListener("pageshow", event => {
      if (!event.persisted) return;
      refreshCatalog(true);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
  } else {
    bootstrap();
  }
})();
