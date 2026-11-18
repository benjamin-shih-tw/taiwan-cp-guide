(() => {
  "use strict";
  const snapshot = Array.isArray(window.NOTION_COURSES) ? window.NOTION_COURSES : [];
  // The compact boot catalog contains titles while archived chunks contain the
  // original Markdown. Merge metadata non-destructively, retaining catalog order.
  const merged = new Map();
  for (const item of snapshot) {
    if (!item?.id) continue;
    const previous = merged.get(item.id);
    if (!previous) merged.set(item.id, { ...item });
    else {
      if (!previous.content && item.content) previous.content = item.content;
      if (!previous.details && item.details) previous.details = item.details;
      if (!previous.notionUrl && item.notionUrl) previous.notionUrl = item.notionUrl;
    }
  }
  const canonical = [...merged.values()];
  const domainOrder = Array.isArray(window.NOTION_DOMAIN_ORDER) ? window.NOTION_DOMAIN_ORDER : [];
  const relations = window.NOTION_DOMAIN_RELATIONS || {};
  const ladders = Array.isArray(window.NOTION_LADDERS) ? window.NOTION_LADDERS : [];
  const roadmap = typeof ROADMAP_DATA !== "undefined" && Array.isArray(ROADMAP_DATA) ? ROADMAP_DATA : [];
  const courseIds = new Set();
  const lessons = canonical.filter(c => c && /^[a-f0-9]{32}$/i.test(c.id) && !courseIds.has(c.id) && courseIds.add(c.id)).map(c => ({
    id: c.id, title: String(c.title || "Untitled"), details: String(c.details || ""),
    difficulty: c.difficulty, notionUrl: c.notionUrl || "", fallback: String(c.content || ""),
    domain: (relations[c.id] || [c.domain])[0] || "未分類",
    hasContent: c.hasContent
  }));
  const domainNames = [...new Set([...domainOrder, ...lessons.map(c => c.domain)])];
  const courses = domainNames.map((name, index) => {
    const included = lessons.filter(c => c.domain === name);
    const chapters = [];
    for (let i = 0; i < included.length; i += 5) {
      const chunk = included.slice(i, i + 5);
      chapters.push({
        id: "chapter-" + (Math.floor(i / 5) + 1),
        title: "Chapter " + String(Math.floor(i / 5) + 1).padStart(2, "0"),
        range: [i + 1, i + chunk.length],
        lessons: chunk
      });
    }
    return { id: name, name, order: index, chapters, lessons: included };
  }).filter(c => c.lessons.length);
  const lessonById = new Map(lessons.map(l => [l.id, l]));
  const courseById = new Map(courses.map(c => [c.id, c]));
  const topicById = new Map();
  const topicGroups = roadmap.map(level => ({
    id: level.levelId,
    name: level.levelName,
    topics: (level.topics || []).filter(t => t && typeof t.id === "string").map(topic => {
      const node = { ...topic, level: level.levelName, prerequisites: Array.isArray(topic.prerequisites) ? topic.prerequisites : [] };
      topicById.set(node.id, node);
      return node;
    })
  }));
  const problems = [];
  const seen = new Map();
  const append = (p) => {
    if (!p.url || !/^https:\/\//i.test(p.url)) return;
    const previous = seen.get(p.url);
    if (previous) {
      if (p.lessonId) {
        previous.lessonIds ||= previous.lessonId ? [previous.lessonId] : [];
        if (!previous.lessonIds.includes(p.lessonId)) previous.lessonIds.push(p.lessonId);
        if (!previous.lessonId) previous.lessonId = p.lessonId;
      }
      if (p.domain) {
        previous.domains ||= previous.domain ? [previous.domain] : [];
        if(!previous.domains.includes(p.domain)) previous.domains.push(p.domain);
        if(!previous.domain) previous.domain=p.domain;
      }
      if (p.difficulty !== "Unrated" && previous.difficulty === "Unrated") previous.difficulty = p.difficulty;
      return;
    }
    if (p.lessonId) p.lessonIds = [p.lessonId];
    seen.set(p.url, p);
    problems.push(p);
  };
  for (const group of topicGroups) {
    for (const topic of group.topics) {
      for (const p of topic.problems || []) {
        append({
          id: "roadmap:" + (p.id || encodeURIComponent(p.url)),
          title: p.name || p.id || "Problem",
          platform: p.platform || "External",
          difficulty: p.difficulty || "Unrated",
          url: p.url, topicId: topic.id, topicTitle: topic.title,
          domain: "", lessonId: "", source: "roadmap"
        });
      }
    }
  }
  const ownedLadders = ladders.filter(l => l && (l.sourceCourseId || l.domain));
  const setByLesson = new Map();
  const setByDomain = new Map();
  for (const ladder of ownedLadders) {
    if (ladder.sourceCourseId) {
      const list = setByLesson.get(ladder.sourceCourseId) || [];
      list.push(ladder);
      setByLesson.set(ladder.sourceCourseId, list);
    }
    if (ladder.domain) {
      const list = setByDomain.get(ladder.domain) || [];
      list.push(ladder);
      setByDomain.set(ladder.domain, list);
    }
    const content = String(ladder.content || "");
    const rx = /\[([^\]\n]{2,220})\]\((https:\/\/[^\s)]+)\)/g;
    let match, idx = 0;
    while ((match = rx.exec(content)) !== null && idx++ < 400) {
      const url = match[2].replace(/&amp;/g, "&");
      if (/notion\.(so|com)/.test(url)) continue;
      const before = content.slice(0, match.index);
      let level = "Unrated";
      // Only explicit section labels determine a ladder link's difficulty.
      for(const heading of before.matchAll(/(?:^#{1,6}\s+([^\n]+)|<summary>([^<]+)<\/summary>)/gm)) {
        const label=(heading[1]||heading[2]||"").trim();
        if(/^(?:延伸|extension)/i.test(label)) level="Extension";
        else if(/^(?:挑戰|challenge|extreme)/i.test(label)) level="Extreme";
        else if(/^(?:進階|advanced|hard)/i.test(label)) level="Hard";
        else if(/^(?:中階|medium|intermediate)/i.test(label)) level="Medium";
        else if(/^(?:入門|基礎|easy|beginner|basic)/i.test(label)) level="Easy";
        else if(/^(?:未分類|未標示|unrated)/i.test(label)) level="Unrated";
      }
      append({
        id: "ladder:" + ladder.id + ":" + idx,
        title: match[1], platform: new URL(url).hostname.replace(/^www\./, ""),
        difficulty: level, url, topicId: "", topicTitle: ladder.title || "",
        lessonId: ladder.sourceCourseId || "", domain: ladder.domain || "",
        source: "notion-ladder"
      });
    }
  }
  const rawAssociations = window.V3_EXPLICIT_TOPIC_MAPPINGS || {};
  const lessonTopics = new Map();
  const topicLessons = new Map();
  for (const [originalId, targets] of Object.entries(rawAssociations)) {
    const id = originalId.replace(/-/g, "").toLowerCase();
    if (!lessonById.has(id)) continue;
    const valid = (Array.isArray(targets) ? targets : [targets]).filter(t => topicById.has(t));
    if (!valid.length) continue;
    lessonTopics.set(id, valid);
    for (const topic of valid) {
      const linked = topicLessons.get(topic) || [];
      linked.push(id);
      topicLessons.set(topic, linked);
    }
  }
  // Subject classification is independent of the deliberately empty dependency graph.
  const topicUnits = {
    "00 Fundamentals":["time-complexity","intro-bitwise"],
    "01 Complete Search & Simulation":["simulation","enumeration-bruteforce","complete-rec","ad-hoc","meet-in-the-middle"],
    "02 STL & Basic Data Structures":["intro-ds","intro-sets-maps","priority-queues","intro-sorted-sets","hashmaps","bitsets"],
    "03 Sorting & Searching":["intro-sorting","two-pointers","binary-search","binary-search-sorted-array","ternary-search"],
    "04 Prefix Sums":["prefix-sums","more-prefix-sums"],
    "05 Greedy":["intro-greedy","sorting-custom"],
    "06 Graphs":["intro-graphs","graph-traversal","flood-fill","func-graphs","shortest-path-basic","dsu","mst","toposort","strongly-connected-components","max-flow","min-cut","min-cost-flow","scc-advanced"],
    "07 Trees":["intro-tree","dp-trees","all-roots","tree-euler","binary-lifting","hld","centroid","merging","link-cut-tree"],
    "08 Dynamic Programming":["basic-dp","knapsack","lis","paths-grids","dp-ranges","dp-bitmasks","sliding-window-gold","digit-dp","convex-hull-trick","dc-dp","slope-trick"],
    "09 Data Structures & Range Queries":["monotonic-structures","segment-tree","fenwick-tree","sqrt","segtree-ext","persistent-ds","offline-algorithms"],
    "10 Math":["number-theory","combinatorics","matrix-expo","fft-ntt","game-theory","linear-algebra"],
    "11 Geometry":["rect-geo","convex-hull","sweep-line","geometry-advanced"],
    "12 Strings":["hashing","string-suffix"]
  };
  const unitByTopic=new Map(Object.entries(topicUnits).flatMap(([domain,ids])=>ids.map(id=>[id,domain])));
  for(const p of problems) {
    const domain=p.domain || unitByTopic.get(p.topicId);
    if(!domain) throw new Error("Missing subject classification for "+p.id);
    p.domain=domain;
    p.domains=[...new Set([domain,...(p.domains||[])])];
    const mapped=topicLessons.get(p.topicId)||[];
    p.lessonIds=[...new Set([...(p.lessonIds||[]),...mapped])];
  }
  const problemLevels=[
    {id:"basic",label:"基礎"},{id:"intermediate",label:"中階"},
    {id:"advanced",label:"進階"},{id:"challenge",label:"挑戰"},
    {id:"extension",label:"延伸"},{id:"unrated",label:"未標示難度"}
  ];
  const levelByDifficulty={Easy:"basic",Medium:"intermediate",Hard:"advanced",Advanced:"advanced",Extreme:"challenge",Extension:"extension"};
  function problemLevel(p) {return problemLevels.find(l=>l.id===levelByDifficulty[p.difficulty])||problemLevels[5];}
  function prerequisitesForLesson() { return []; }
  function chapterFor(id) {
    const lesson = lessonById.get(id); if (!lesson) return null;
    const c = courseById.get(lesson.domain);
    return c?.chapters.find(ch => ch.lessons.some(l => l.id === id)) || null;
  }
  function byLesson(id) {
    const c = lessonById.get(id);
    return problems.filter(p => p.lessonId === id || p.lessonIds?.includes(id) || (!p.lessonId && c && p.domains.includes(c.domain)));
  }
  function byDomain(domain) { return problems.filter(p => p.domains.includes(domain)); }
  function path(lesson) {
    const ch = chapterFor(lesson.id);
    return "#/courses/" + encodeURIComponent(lesson.domain) + "/" + encodeURIComponent(ch?.id || "chapter-1") + "/" + lesson.id;
  }
  window.V3Catalog = Object.freeze({
    courses, lessons, problems, roadmap: [], edges: [], ladders: ownedLadders,
    problemLevels, problemLevel,
    lessonById, courseById, topicById: new Map(), chapterFor, byLesson, byDomain, path,
    setByLesson, setByDomain, prerequisitesForLesson
  });
})();
