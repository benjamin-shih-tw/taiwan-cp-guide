/* Node 22 dependency-free regression checks for the branch-only v3 site. */
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const sources = [
  "data/notion_catalog_snapshot.js",
  "data/notion_courses_part1.js", "data/notion_courses_part2.js",
  "data/notion_courses_part3.js", "data/notion_courses_part4.js",
  "data/notion_courses_part5.js", "data/notion_ladders.js",
  "data/notion_image_mirror.js", "data/roadmap.js",
  "v3/topic-mappings.js", "v3/learning.js", "v3/catalog.js"
];
const state = new Map();
const localStorage = {
  getItem: key => state.has(key) ? state.get(key) : null,
  setItem: (key, value) => state.set(key, String(value))
};
const sandbox = { window: {}, URL, console, localStorage, Date, setTimeout, clearTimeout };
vm.createContext(sandbox);
for (const file of sources) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), sandbox, { filename: file });
}
const { V3Catalog: C, V3Store: S } = sandbox.window;
assert(C && S, "catalog / learning globals must exist");
assert(C.courses.length >= 10, "expected actual source courses");
assert(C.lessons.length >= 70, "expected actual source lessons");
assert(C.problems.length >= 100, "expected actual linked problems");
assert.equal(C.roadmap.length,0,"dependency map must remain empty");
assert.equal(C.topicById.size,0,"no dependency nodes exposed");
assert.equal(C.edges.length,0,"no dependency edges exposed");
for(const lesson of C.lessons)assert.equal(C.prerequisitesForLesson(lesson.id).length,0,"no inherited prerequisite gates");
for(const problem of C.problems){
  assert(problem.domains.length,"all indexed problems assigned to a subject");
  for(const domain of problem.domains)assert(C.courseById.has(domain),"valid problem subject");
  assert(C.byDomain(problem.domain).some(p=>p.id===problem.id),"subject lookup includes problem");
}
assert.equal(C.problemLevels.map(l=>l.label).join(","),"基礎,中階,進階,挑戰,延伸,未標示難度");
assert.equal(C.problemLevel({difficulty:"Advanced"}).id,"advanced");
assert.equal(C.problemLevel({difficulty:"Extension"}).id,"extension");
assert.equal(new Set(C.lessons.map(c => c.id)).size, C.lessons.length, "lessons must have stable unique IDs");
const allChapters = C.courses.flatMap(c => c.chapters);
assert(allChapters.length > 0, "chapters generated");
for (const lesson of C.lessons) {
  assert(C.chapterFor(lesson.id)?.lessons.some(l => l.id === lesson.id), "every lesson must belong to chapter");
  assert(C.path(lesson).startsWith("#/courses/"), "every lesson has a deep link");
}
for (const [id, prereq] of C.edges.map(e => [e.to, e.from])) {
  assert(C.topicById.has(id) && C.topicById.has(prereq), "prerequisite graph must not contain dangling links");
}
const graph = new Map([...C.topicById.keys()].map(id => [id, []]));
for (const edge of C.edges) graph.get(edge.from).push(edge.to);
const visited = new Set(), active = new Set();
function walk(node) {
  assert(!active.has(node), "prerequisite graph must be acyclic");
  if (visited.has(node)) return;
  active.add(node);
  for (const next of graph.get(node)) walk(next);
  active.delete(node);
  visited.add(node);
}
for (const id of graph.keys()) walk(id);
const first=C.lessons[0].id;
S.markRead(first,true);
S.completeStep(first,2,true);
S.setMastery(first,"theory",3);
S.setNote(first,"local note test");
S.planReview(first);
assert(S.read().done[first], "read state persisted");
assert(S.read().steps[first].includes(2), "step state persisted");
assert.equal(S.read().mastery[first].theory,3, "mastery persisted");
assert.equal(S.read().notes[first],"local note test", "note persisted");
assert(S.dueCourses(C.lessons).some(c=>c.id===first),"scheduled review due today");
S.review(first,4);
assert(!S.dueCourses(C.lessons).some(c=>c.id===first),"successful review rescheduled");
S.recordAttempt(C.problems[0].id,"wa","演算法觀念","needs reconsideration");
assert(S.read().mistakes[C.problems[0].id],"wrong-answer mistake recorded");
S.recordAttempt(C.problems[0].id,"ac","","");
assert.equal(S.read().mistakes[C.problems[0].id].resolved,true,"AC resolves mistake");
S.recordAttempt(C.problems[0].id,"ac","","AC note preserved");
assert.equal(S.read().mistakes[C.problems[0].id].note,"AC note preserved","notes save for AC status too");
const backup=JSON.parse(JSON.stringify(S.read()));
S.markRead(first,false);
assert(!S.read().done[first],"temporary clear for import test");
S.importBackup(backup);
assert(S.read().done[first],"JSON backup restores completed lesson");
assert.throws(()=>S.importBackup({invalid:42}),/不是 Coding Course/,"reject unrelated backup");
assert(S.nextSuggestions(C.lessons,5,C.prerequisitesForLesson).length>0,"recommendations available");
const html=fs.readFileSync(path.join(root,"v3/index.html"),"utf8");
const matches=[...html.matchAll(/<script\s+(?:defer\s+)?src="([^"]+)"/g)].map(m=>m[1].split("?")[0]);
for (const file of matches) {
  const resolved=path.resolve(root,"v3",file);
  assert(fs.existsSync(resolved),"missing static script: "+file);
}
assert(matches.indexOf("topic-mappings.js")<matches.indexOf("catalog.js"),"explicit prerequisites must load before catalog");
console.log("v3 checks passed:",JSON.stringify({
  courses:C.courses.length,chapters:allChapters.length,lessons:C.lessons.length,
  problems:C.problems.length,topicNodes:C.topicById.size,edges:C.edges.length,
  frozenMarkdownBackups:C.lessons.filter(l=>l.fallback.trim()).length
}));


async function sourceChecks(){
  let releaseRenderer,fetches=0,renders=0,unmounts=0;
  const snapshots=[],statuses=[],timers=new Set();
  const doc={
    querySelector:()=>null,createElement:tag=>({tag,dataset:{},remove(){}}),
    head:{appendChild:el=>{if(el.tag==="script")releaseRenderer=()=>el.onload();}},
    body:{appendChild(){}},
  };
  const host=()=>({className:"",innerHTML:"",replaceChildren(){this.innerHTML="";},querySelectorAll:()=>[]});
  const env={window:{marked:{setOptions(){},parse:s=>{snapshots.push(s);return "<p>"+s+"</p>";}},renderMathInElement(){}},
    document:doc,URL,AbortController,location:{href:"https://example.test/v3/"},
    console:{warn(){}},requestAnimationFrame:fn=>fn(),
    setTimeout:fn=>{timers.add(fn);return fn;},clearTimeout:fn=>timers.delete(fn),
    fetch:async()=>{fetches++;return {ok:true,json:async()=>({blockMap:{block:{}},hasContent:true})};}
  };
  vm.createContext(env);
  vm.runInContext(fs.readFileSync(path.join(root,"v3/source.js"),"utf8"),env);
  const reader=env.window.V3Source,lesson={id:"parallel-test",fallback:"# Original source"};
  const pending=reader.render(lesson,host(),{onStatus:k=>statuses.push(k)});
  assert.equal(fetches,1,"API starts while renderer is still pending");
  assert.equal(renders,0,"render waits for bundle readiness");
  env.window.NotionXBridge={render:(h,p,o)=>{renders++;o.onReady();return true;},unmount(){unmounts++;}};
  releaseRenderer();await pending;
  assert.equal(renders,1,"first live page rendered");
  await reader.render(lesson,host());
  assert.equal(fetches,1,"reopening uses cached live payload");
  env.fetch=async()=>{throw new Error("offline");};
  const fallbackHost=host();
  await reader.render({id:"offline",fallback:"# Exact original\n\nText + $x$"},fallbackHost);
  assert.equal(snapshots[0],"# Exact original\n\nText + $x$","formatted fallback receives unchanged source");
  assert(fallbackHost.innerHTML.includes("Exact original"));
  let finishOld;
  env.fetch=()=>new Promise(resolve=>{finishOld=resolve;});
  const staleHost=host(),stale=reader.render({id:"stale"},staleHost);
  const loading=staleHost.innerHTML;
  reader.cleanup();
  finishOld({ok:true,json:async()=>({blockMap:{block:{}},hasContent:true})});
  await stale;
  assert.equal(staleHost.innerHTML,loading,"old request cannot replace a newer route");
  assert(unmounts>=3,"old reader is unmounted when navigating");
  assert.equal(timers.size,0,"network timers cleaned up");
  console.log("Source checks passed: parallel loading, live cache, formatted fallback, stale-navigation cancellation");
}
sourceChecks().catch(error=>{console.error(error);process.exitCode=1;});
