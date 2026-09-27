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
    problemDomain: "",
    hideSolved: false,
    activeTopic: null,
    baseView: "home"
  };

  const ROADMAP = (typeof ROADMAP_DATA !== "undefined" && Array.isArray(ROADMAP_DATA)) ? ROADMAP_DATA : [];
  const TEMPLATES = (typeof TEMPLATE_DATA !== "undefined" && Array.isArray(TEMPLATE_DATA)) ? TEMPLATE_DATA : [];

  const NOTION_COURSES = Array.isArray(window.NOTION_COURSES) ? window.NOTION_COURSES : [];
  const NOTION_LADDERS = Array.isArray(window.NOTION_LADDERS) ? window.NOTION_LADDERS : [];
  const NOTION_DOMAIN_ORDER = Array.isArray(window.NOTION_DOMAIN_ORDER) ? window.NOTION_DOMAIN_ORDER : [];
  const NOTION_DOMAIN_RELATIONS = window.NOTION_DOMAIN_RELATIONS || {};
  NOTION_COURSES.forEach(course => {
    course.domains = Array.isArray(NOTION_DOMAIN_RELATIONS[course.id])
      ? NOTION_DOMAIN_RELATIONS[course.id].slice()
      : [];
    course.domain = course.domains[0] || "";
  });
  const notionCourseMap = new Map(NOTION_COURSES.map(course => [course.id, course]));

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
    "2e392ab7-6d40-8019-a704-c34f01b2ab1c":"knapsack",
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
    "33092ab7-6d40-8052-ab69-d57ace25461e":"fenwick-tree",
    "33092ab7-6d40-802f-813e-d4ca344b6864":"dsu",
    "33092ab7-6d40-803f-9b93-ca26e064c1bf":"strongly-connected-components",
    "33092ab7-6d40-802e-8b3f-e81a23b44576":"rect-geo",
    "33092ab7-6d40-8067-a9b3-c3459edb680a":"hashing",
    "33092ab7-6d40-80e3-96c2-d21276ba88db":"string-suffix"
  };

  const roadmapToNotion = new Map();
  Object.entries(NOTION_LECTURE_TO_ROADMAP).forEach(([pageId, slug]) => {
    const id = pageId.replace(/-/g, "");
    const list = roadmapToNotion.get(slug) || [];
    list.push(id);
    roadmapToNotion.set(slug, list);
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
  }

  function showView(name) {
    const valid = ["home", "roadmap", "courses", "problems", "resources"];
    if (!valid.includes(name)) name = "home";
    state.baseView = name;
    document.querySelectorAll(".view").forEach(el => el.classList.toggle("active", el.dataset.view === name));
    document.querySelectorAll("[data-nav]").forEach(el => el.classList.toggle("active", el.dataset.nav === name));
    window.scrollTo({ top: 0, behavior: "auto" });
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

    if (parts[0] === "problems") {
      closeLesson(false);
      state.problemDomain = parts.length > 1 ? decodeURIComponent(parts.slice(1).join("/")) : "";
      showView("problems");
      return;
    }

    closeLesson(false);
    showView(parts[0] || "home");
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
        node.className = "roadmap-node" + (done ? " done" : "");
        const badge = course.difficulty == null ? "" : '<span class="node-badge">難度 ' + esc(course.difficulty) + '/10</span>';
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
    domainSelect.innerHTML = '<option value="all">全部大單元</option>';
    groups.forEach(group => {
      const op = document.createElement("option");
      op.value = group.domain.name;
      op.textContent = group.domain.name;
      domainSelect.appendChild(op);
    });
    if (![...domainSelect.options].some(op => op.value === state.courseDomain)) state.courseDomain = "all";
    domainSelect.value = state.courseDomain;
    document.getElementById("course-level").value = state.courseLevel;
    document.getElementById("course-search").value = state.courseSearch;

    const q = state.courseSearch.trim().toLowerCase();
    const matches = course => {
      const text = ((course.title || "") + " " + (course.details || "") + " " +
        (course.domains || []).join(" ") + " " + (course.content || "")).toLowerCase();
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
        card.className = "course-card";
        const diff = course.difficulty;
        const bars = diff == null ? "" : Array.from({ length: 5 }, (_, i) =>
          '<i class="' + (i < Math.ceil(diff / 2) ? "on" : "") + '"></i>'
        ).join("");
        const relationTags = "";
        const difficultyTag = diff == null ? "" : '<span class="tag">難度 ' + esc(diff) + '/10</span>';
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
      renderNotionMarkdownInto(body, ladder.content || "", false);
      details.append(summary, body);
      migratedHost.appendChild(details);
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
    host.innerHTML = "";
    const data = TEMPLATES.slice(0, 12);
    data.forEach(temp => {
      const card = document.createElement("article");
      card.className = "template-card";
      card.innerHTML = "<h3>" + esc(temp.title || temp.id) + "</h3>";
      host.appendChild(card);
    });
  }

  function openLesson(id, pushHash) {
    let course = notionCourseMap.get(id);
    if (!course) course = courseForRoadmap(id);
    if (!course) {
      toast("這堂課在 Coding Course 中沒有非空白內文");
      return;
    }

    state.activeTopic = { source: "notion", course };
    localStorage.setItem(STORAGE.last, course.id);

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
    renderCourseContent(course);

    document.getElementById("lesson-overlay").classList.add("open");
    document.getElementById("lesson-overlay").setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (pushHash) {
      history.pushState(null, "", "#/lesson/" + encodeURIComponent(course.id));
    }
  }

  function closeLesson(pushHash) {
    const overlay = document.getElementById("lesson-overlay");
    if (!overlay.classList.contains("open") && !state.activeTopic) return;
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
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

  function protectMarkdownCode(markdown) {
    const stash = [];
    const hold = value => {
      const id = stash.push(value) - 1;
      return "\uE000" + id + "\uE001";
    };
    let text = String(markdown || "");
    text = text.replace(/```[\s\S]*?```/g, hold);
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

    lines.forEach(line => {
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

  function preprocessNotionMarkdown(markdown) {
    const protectedCode = protectMarkdownCode(markdown);
    let text = protectedCode.text;

    text = text.replace(/<empty-block\s*\/>/gi, "");
    text = text.replace(
      /<unknown\s+url="([^"]*)"\s+alt="([^"]*)"\s*\/>/gi,
      (_, url, alt) => {
        const label = alt && alt.toLowerCase() !== "button" ? alt : "開啟";
        return '<a class="notion-button-block" href="' + url + '">' + label + " ↗</a>";
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
    text = escapeNonHtmlAngles(text);
    return protectedCode.restore(text);
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

  function renderCourseContent(course) {
    renderNotionMarkdownInto(document.getElementById("lesson-content"), course.content || "", true);
  }

  function enhanceNotionDetails(host) {
    if (!window.marked) return;
    const details = Array.from(host.querySelectorAll("details")).reverse();

    details.forEach(detail => {
      if (detail.dataset.notionReady === "1") return;
      const summary = detail.querySelector(":scope > summary");
      if (!summary) return;

      if (window.marked.parseInline) {
        summary.innerHTML = window.marked.parseInline(summary.innerHTML.trim());
      }

      const bodyNodes = Array.from(detail.childNodes).filter(node => node !== summary);
      const raw = bodyNodes.map(node => node.nodeType === Node.TEXT_NODE ? node.textContent : node.outerHTML).join("");
      bodyNodes.forEach(node => node.remove());

      const body = document.createElement("div");
      body.className = "notion-toggle-body";
      body.innerHTML = raw.trim()
        ? window.marked.parse(preprocessNotionMarkdown(raw.trim()))
        : "";
      detail.appendChild(body);
      detail.classList.add("notion-toggle");
      detail.dataset.notionReady = "1";
    });
  }

  function enhanceNotionInlineBlocks(host) {
    if (window.marked && window.marked.parseInline) {
      host.querySelectorAll("td,th").forEach(cell => {
        const raw = cell.innerHTML;
        if (/[*_~`\[]/.test(raw)) cell.innerHTML = window.marked.parseInline(raw);
      });

      host.querySelectorAll("span[color]").forEach(span => {
        const raw = span.innerHTML;
        if (/[*_~`\[]/.test(raw)) span.innerHTML = window.marked.parseInline(raw);
      });
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
      if (/^https?:/i.test(a.getAttribute("href") || "")) {
        a.target = "_blank";
        a.rel = "noreferrer";
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

      const courseResults = NOTION_COURSES.filter(course =>
        ((course.title || "") + " " + (course.details || "") + " " + (course.domains || []).join(" ") + " " + (course.content || ""))
          .toLowerCase().includes(q)
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

    document.getElementById("problem-domain-back").addEventListener("click", () => {
      location.hash = "#/problems";
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