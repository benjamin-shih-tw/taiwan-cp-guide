(() => {
  "use strict";
  const KEY = "coding_course_v3_learning";
  const DIMENSIONS = ["theory", "implementation", "recognition", "retention"];
  const INTERVALS = [1, 3, 7, 14, 30, 60];
  function plain(value) { return value && typeof value === "object" && !Array.isArray(value) ? value : {}; }
  function read() {
    let s = {};
    try { s = plain(JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (_) {}
    s.done = plain(s.done);
    s.steps = plain(s.steps);
    s.mastery = plain(s.mastery);
    s.reviews = plain(s.reviews);
    s.attempts = plain(s.attempts);
    s.notes = plain(s.notes);
    s.mistakes = plain(s.mistakes);
    s.last = typeof s.last === "string" ? s.last : "";
    return s;
  }
  function write(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); return true; }
    catch (error) { console.warn("[v3] Could not save local progress", error); return false; }
  }
  function update(fn) { const s = read(); fn(s); write(s); return s; }
  function isoDate(date) { return new Date(date).toISOString().slice(0, 10); }
  function addDays(day, amount) {
    const d = new Date(day + "T12:00:00Z");
    d.setUTCDate(d.getUTCDate() + amount);
    return isoDate(d);
  }
  function markRead(id, checked) {
    update(s => { if (checked) s.done[id] = new Date().toISOString(); else delete s.done[id]; s.last = id; });
  }
  function completeStep(id, index, checked) {
    update(s => {
      const steps = new Set(Array.isArray(s.steps[id]) ? s.steps[id] : []);
      if (checked) steps.add(index); else steps.delete(index);
      s.steps[id] = [...steps].sort((a, b) => a - b);
      s.last = id;
    });
  }
  function setMastery(id, dimension, value) {
    if (!DIMENSIONS.includes(dimension)) return;
    update(s => {
      s.mastery[id] ||= {};
      s.mastery[id][dimension] = Math.max(0, Math.min(4, Number(value) || 0));
      s.last = id;
    });
  }
  function setNote(id, note) {
    update(s => { s.notes[id] = String(note || "").slice(0, 10000); s.last = id; });
  }
  function review(id, quality) {
    const q = Math.max(0, Math.min(4, Number(quality) || 0));
    update(s => {
      const previous = plain(s.reviews[id]);
      const stage = q < 3 ? 0 : Math.min((Number(previous.stage) || 0) + 1, INTERVALS.length - 1);
      s.reviews[id] = {
        stage, quality: q, lastReviewedAt: isoDate(new Date()),
        due: addDays(isoDate(new Date()), INTERVALS[stage])
      };
      s.mastery[id] ||= {};
      s.mastery[id].retention = q;
      s.last = id;
    });
  }
  function planReview(id) {
    update(s => {
      const previous = plain(s.reviews[id]);
      s.reviews[id] = { ...previous, stage: 0, due: isoDate(new Date()), manual: true };
    });
  }
  function recordAttempt(problemId, state, reason, note) {
    if (!problemId) return;
    update(s => {
      const old = plain(s.attempts[problemId]);
      const entry = {
        status: ["todo", "trying", "wa", "ac"].includes(state) ? state : "todo",
        updated: new Date().toISOString(),
        count: (Number(old.count) || 0) + 1
      };
      s.attempts[problemId] = entry;
      const previous=plain(s.mistakes[problemId]);
      if(entry.status==="wa" || reason || note || Object.keys(previous).length){
        s.mistakes[problemId]={
          reason:String(reason||"").slice(0,120),
          note:String(note||"").slice(0,5000),
          recorded:entry.updated,
          resolved:entry.status==="ac" || (entry.status!=="wa" && previous.resolved===true)
        };
      }
    });
  }
  function dueCourses(courses, at = isoDate(new Date())) {
    const s = read();
    return courses.filter(c => s.reviews[c.id]?.due && s.reviews[c.id].due <= at);
  }
  function nextSuggestions(courses, max = 8, prerequisites = () => []) {
    const s = read(), today = isoDate(new Date());
    const prerequisiteGaps = new Set();
    for (const course of courses) {
      if (s.done[course.id]) continue;
      for (const dep of prerequisites(course.id)) {
        if (dep.lessonId && !s.done[dep.lessonId]) prerequisiteGaps.add(dep.lessonId);
      }
    }
    const ranked = courses.map((c, i) => {
      const reviewState = s.reviews[c.id];
      const m = plain(s.mastery[c.id]);
      const weak = DIMENSIONS.filter(d => Number.isFinite(Number(m[d])) && m[d] !== undefined && m[d] !== null && Number(m[d]) <= 2);
      let score = 0, reason;
      const missing = prerequisites(c.id).filter(dep => dep.lessonId && !s.done[dep.lessonId]);
      if (prerequisiteGaps.has(c.id) && !s.done[c.id]) { score = 1200; reason = "先修缺口：建議先完成此課"; }
      else if (reviewState?.due && reviewState.due <= today) { score = 1000; reason = "複習到期"; }
      else if (missing.length && !s.done[c.id]) { score = 20; reason = "先修尚未完成：" + missing.map(x => x.title).join("、"); }
      else if (weak.length) { score = 700; reason = "需要補強：" + weak.map(d => ({theory:"理論",implementation:"實作",recognition:"題型辨識",retention:"記憶"}[d])).join("、"); }
      else if (s.done[c.id]) { score = 30; reason = "已閱讀，可練習"; }
      else { score = 500 - i / 100; reason = "尚未閱讀的新課程"; }
      return { course: c, score, reason, index: i };
    });
    return ranked.sort((a, b) => b.score - a.score || a.index - b.index).slice(0, max);
  }
  function importBackup(payload) {
    if (!payload || typeof payload !== "object" || Array.isArray(payload) ||
        (!payload.done && !payload.attempts && !payload.mastery)) {
      throw new Error("不是 Coding Course 的學習備份");
    }
    const allowed = ["done","steps","mastery","reviews","attempts","notes","mistakes"];
    const imported = read();
    for (const section of allowed) {
      const incoming = plain(payload[section]);
      const clean = {};
      for (const [id, value] of Object.entries(incoming)) {
        if (!id || id.length > 220 || ["__proto__","constructor","prototype"].includes(id)) continue;
        if (section === "notes") clean[id] = String(value || "").slice(0,10000);
        else if (section === "done") clean[id] = typeof value === "string" ? value.slice(0,50) : "";
        else if (section === "steps") clean[id] = Array.isArray(value) ? value.filter(x=>Number.isInteger(x)&&x>=0&&x<6).slice(0,6) : [];
        else clean[id] = plain(value);
      }
      imported[section] = clean;
    }
    imported.last = typeof payload.last === "string" ? payload.last.slice(0,220) : "";
    imported.legacyImported = true;
    if (!write(imported)) throw new Error("瀏覽器未允許儲存資料");
    return Object.keys(imported.done).length;
  }
  function restoreLegacy() {
    const s = read();
    if (s.legacyImported) return;
    let legacy = [];
    try { legacy = JSON.parse(localStorage.getItem("taiwan_cp_read_topics") || "[]"); } catch (_) {}
    if (Array.isArray(legacy)) legacy.filter(id => typeof id === "string").forEach(id => { s.done[id] ||= "v2"; });
    s.legacyImported = true;
    write(s);
  }
  restoreLegacy();
  window.V3Store = Object.freeze({
    read, markRead, completeStep, setMastery, setNote, review, planReview,
    recordAttempt, dueCourses, nextSuggestions, isoDate, importBackup,
    dimensions: DIMENSIONS
  });
})();
