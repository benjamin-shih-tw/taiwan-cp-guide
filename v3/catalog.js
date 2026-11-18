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
  // Prerequisites are copied from the existing roadmap; no implicit edges are fabricated.
  const edges = [...topicById.values()].flatMap(t => t.prerequisites.filter(dep => topicById.has(dep)).map(dep => ({ from: dep, to: t.id })));
  const problems = [];
  const seen = new Set();
  const append = (p) => {
    if (!p.url || !/^https:\/\//i.test(p.url) || seen.has(p.url)) return;
    seen.add(p.url);
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
      const before = content.slice(Math.max(0, match.index - 400), match.index);
      const level = /(?:進階|挑戰|advanced)(?![\s\S]*(?:基礎|必做|beginner))/i.test(before) ? "Advanced" : "Unrated";
      append({
        id: "ladder:" + ladder.id + ":" + idx,
        title: match[1], platform: new URL(url).hostname.replace(/^www\./, ""),
        difficulty: level, url, topicId: "", topicTitle: ladder.title || "",
        lessonId: ladder.sourceCourseId || "", domain: ladder.domain || "",
        source: "notion-ladder"
      });
    }
  }
  function chapterFor(id) {
    const lesson = lessonById.get(id); if (!lesson) return null;
    const c = courseById.get(lesson.domain);
    return c?.chapters.find(ch => ch.lessons.some(l => l.id === id)) || null;
  }
  function byLesson(id) {
    const c = lessonById.get(id);
    return problems.filter(p => p.lessonId === id || (!p.lessonId && c && p.domain === c.domain));
  }
  function byDomain(domain) { return problems.filter(p => p.domain === domain); }
  function path(lesson) {
    const ch = chapterFor(lesson.id);
    return "#/courses/" + encodeURIComponent(lesson.domain) + "/" + encodeURIComponent(ch?.id || "chapter-1") + "/" + lesson.id;
  }
  window.V3Catalog = Object.freeze({
    courses, lessons, problems, roadmap: topicGroups, edges, ladders: ownedLadders,
    lessonById, courseById, topicById, chapterFor, byLesson, byDomain, path,
    setByLesson, setByDomain
  });
})();