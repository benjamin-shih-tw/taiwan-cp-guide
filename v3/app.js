(() => {
"use strict";
const C = window.V3Catalog, S = window.V3Store, Source = window.V3Source;
const app = document.getElementById("app");
if (!C || !S || !Source) { app.textContent = "v3 無法載入核心模組，請重新整理頁面。"; return; }
const STAGES = [
  { title:"背景與由來", prompt:"這個演算法要解決什麼問題？與原本做法相比，困難在哪裡？", rx:/背景|緣起|歷史|介紹|intro|overview|problem/i },
  { title:"用途與必要性", prompt:"什麼題型會需要用到它？有哪些適用條件？", rx:/用途|動機|為何|使用時機|application|motivation|why/i },
  { title:"先備知識", prompt:"讀懂原理之前，還需要哪些資料結構或觀念？", rx:/先備|先修|前置|prerequisit|prepar/i },
  { title:"演算法理論與證明", prompt:"用自己的話重述核心不變量、正確性理由與時間複雜度。", rx:/原理|理論|證明|正確|複雜度|演算法|algorithm|proof|complexit/i },
  { title:"實作與常見錯誤", prompt:"不看範例能否寫出主要流程？有哪些邊界情況需要測試？", rx:/實作|程式|模板|寫法|implementation|code|pseudocode/i },
  { title:"結論與延伸", prompt:"總結一個最容易忘的重點，並記下下一次要複習的地方。", rx:/結論|總結|延伸|常見錯|review|summary|conclusion/i }
];
const DIMS = [
  ["theory","理論理解"],["implementation","獨立實作"],
  ["recognition","題型辨識"],["retention","複習保留"]
];
let lessonView = null, activeProblem = null, problemPageSize = 45;
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const attr = esc;
const enc = encodeURIComponent;
const plural = (n, suffix) => Number(n || 0) + " " + suffix;
const pct = (a,b) => b ? Math.round(100*a/b) : 0;
const getCourse = id => C.courseById.get(id);
const findLesson = id => C.lessonById.get(id);
const hashPath = () => {
  const [route,query=""] = (location.hash.slice(1)||"/").split("?");
  let path=[];
  try { path = route.split("/").filter(Boolean).map(decodeURIComponent); } catch (_) {}
  return { path, query: new URLSearchParams(query) };
};
const title = (eyebrow,text,subtitle) => '<header class="hero"><p class="eyebrow">'+esc(eyebrow)+'</p><h1>'+esc(text)+'</h1><p class="muted">'+esc(subtitle||"")+'</p></header>';
const navbtn = (href,label,secondary=true) => '<a class="button'+(secondary?' secondary':'')+'" href="'+attr(href)+'">'+esc(label)+'</a>';
const card = (href,name,description,meta="") => '<a class="card catalog-card" href="'+attr(href)+'"><div class="row"><span class="eyebrow">'+esc(meta)+'</span><span aria-hidden="true">↗</span></div><h3>'+esc(name)+'</h3><p class="muted">'+esc(description)+'</p></a>';
const topicLink = id => "#/roadmap/"+enc(id);
const bar = (a,b) => '<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+pct(a,b)+'"><span style="width:'+pct(a,b)+'%"></span></div>';
function renderEmpty(message) { return '<div class="empty">'+esc(message)+'</div>'; }
function groups() { return C.courses; }
function doneCount(lessons) { const s = S.read(); return lessons.filter(l=>s.done[l.id]).length; }
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("visible"), 2300);
}
function navigate(href) { location.hash = href.replace(/^#/,""); }
function renderDashboard() {
  const store = S.read(), complete = doneCount(C.lessons), due = S.dueCourses(C.lessons);
  const next = S.nextSuggestions(C.lessons, 8, C.prerequisitesForLesson);
  app.innerHTML = title("YOUR LEARNING SPACE","Learn. Practice. Review.","沿用原本的 Coding Course 教材，將閱讀、實作與複習串成一條清楚的學習路徑。")+
    '<div class="grid stats-grid">'+
      '<div class="card stat"><strong>'+C.lessons.length+'</strong><span>課程 Lesson</span></div>'+
      '<div class="card stat"><strong>'+complete+'</strong><span>已閱讀</span></div>'+
      '<div class="card stat"><strong>'+due.length+'</strong><span>今日到期複習</span></div>'+
      '<div class="card stat"><strong>'+C.problems.length+'</strong><span>題庫索引題目</span></div>'+
    '</div>'+
    '<div class="section-head"><div><p class="eyebrow">NEXT ACTION</p><h2>今天先做</h2></div>'+navbtn("#/review","複習清單")+'</div>'+
    '<p class="muted">優先順序：已到期複習 → 弱項 → 未閱讀課程。這些是規則式建議，不會假裝知道你尚未測量的能力。</p>'+
    '<div class="grid two-col">'+next.map(x=>card(C.path(x.course),x.course.title,x.reason,x.course.domain)).join("")+'</div>'+
    '<div class="section-head"><h2>Course 地圖</h2>'+navbtn("#/courses","全部課程")+'</div>'+
    '<div class="grid">'+groups().map(g=>card("#/courses/"+enc(g.id),g.name,plural(doneCount(g.lessons),"已閱讀")+" / "+plural(g.lessons.length,"Lessons"),plural(g.chapters.length,"Chapters"))).join("")+'</div>';
  if(store.last && findLesson(store.last)) document.querySelector(".hero").insertAdjacentHTML("beforeend",'<div class="actions">'+navbtn(C.path(findLesson(store.last)),"↗ 繼續上次的課程",false)+'</div>');
}
function renderCourses() {
  app.innerHTML = title("COURSE LIBRARY","課程總覽","Course → Chapter → Lesson；章節只是原始課程的導覽分組，不會更改教材內容。")+
    '<div class="card"><label for="course-filter">搜尋課程、題型或單元</label><input id="course-filter" type="search" placeholder="例：Dijkstra、Dynamic Programming、Tree"></div>'+
    '<div class="grid" id="course-results" style="margin-top:20px"></div>';
  const input = document.getElementById("course-filter");
  const results = document.getElementById("course-results");
  const draw = () => {
    const query = input.value.trim().toLowerCase();
    const found = groups().filter(g => !query || g.name.toLowerCase().includes(query) || g.lessons.some(l => (l.title+" "+l.details).toLowerCase().includes(query)));
    results.innerHTML = found.map(g=>card("#/courses/"+enc(g.id),g.name,g.lessons.length+" Lessons · "+g.chapters.length+" Chapters · "+doneCount(g.lessons)+" 已閱讀","COURSE "+String(g.order+1).padStart(2,"0"))).join("") || renderEmpty("沒有符合關鍵字的課程。");
  };
  input.addEventListener("input",draw); draw();
}
function renderCourse(id) {
  const course = getCourse(id);
  if(!course) return notFound();
  const chapterCards = course.chapters.map(ch => {
    const ids = ch.lessons;
    return '<a class="card" href="#/courses/'+enc(id)+'/'+enc(ch.id)+'"><div class="row"><span class="eyebrow">'+esc(ch.title)+'</span><small>'+doneCount(ids)+' / '+ids.length+' 已閱讀</small></div><h3>'+esc(ids[0]?.title||ch.title)+' — '+esc(ids[ids.length-1]?.title||"")+'</h3>'+bar(doneCount(ids),ids.length)+'<p class="muted">本章包含 '+ids.length+' 篇原始 Lesson</p></a>';
  }).join("");
  app.innerHTML = title("COURSE",course.name,course.lessons.length+" 篇課程，分為 "+course.chapters.length+" 個導覽章節。")+
    '<div class="actions">'+navbtn("#/courses","← 課程總覽")+navbtn("#/roadmap","先修依賴圖")+'</div>'+
    '<div class="section-head"><h2>Chapters</h2></div><div class="grid two-col">'+chapterCards+'</div>';
}
function renderChapter(domain,chapterId) {
  const course = getCourse(domain),chapter = course?.chapters.find(c=>c.id===chapterId);
  if(!chapter) return notFound();
  const matchedLadders = [...new Map(chapter.lessons.flatMap(l=>C.setByLesson.get(l.id)||[]).map(x=>[x.id,x])).values()];
  const relatedProblems = [...new Map(chapter.lessons.flatMap(l=>C.byLesson(l.id)).map(p=>[p.url,p])).values()];
  app.innerHTML=title(course.name+" / "+chapter.title,"本章課程",chapter.lessons.length+" 篇 Lesson · 原始內容不做修改")+
    '<div class="actions">'+navbtn("#/courses/"+enc(domain),"← "+course.name)+'</div>'+
    '<div class="section-head"><h2>Lessons</h2><span class="muted">'+doneCount(chapter.lessons)+' 已閱讀</span></div>'+
    '<div class="stack">'+chapter.lessons.map((l,i)=>'<a class="card row lesson-row" href="'+C.path(l)+'"><div><p class="eyebrow">LESSON '+String(chapter.range[0]+i).padStart(2,"0")+'</p><h3>'+esc(l.title)+'</h3><small>'+esc(l.details||"")+'</small></div><span>'+(S.read().done[l.id]?"✓":"→")+'</span></a>').join("")+'</div>'+
    '<div class="section-head"><h2>本章必學題型與題單</h2></div>'+
    '<p class="muted">題型以現有 Lesson 標題與原始 Problem Ladder 為準，不會自行補寫不存在的題目。</p>'+
    '<div class="card"><h3>必學題型</h3><div class="chip-row">'+chapter.lessons.map(l=>'<span class="pill">'+esc(l.title)+'</span>').join("")+'</div></div>'+
    '<div class="grid two-col" style="margin-top:15px">'+
       matchedLadders.map(l=>card(l.notionUrl||"../v2/#/problems",l.title,"原始 Notion 題單（內容完整保留）","PROBLEM SET")).join("")+
       (matchedLadders.length?"":'<div class="empty">此章尚未在既有資料中找到直接關聯的 Problem Ladder。</div>')+'</div>'+
    '<div class="section-head"><h2>既有題目分級索引</h2><span class="muted">'+relatedProblems.length+' 題</span></div>'+
    (relatedProblems.length
      ? ["Easy","Medium","Hard","Extreme","Advanced","Unrated"].map(level=>{
          const subset=relatedProblems.filter(p=>p.difficulty===level);
          if(!subset.length)return "";
          return '<section><h3>'+esc(({Easy:"入門",Medium:"中階",Hard:"進階",Extreme:"挑戰",Advanced:"進階題單",Unrated:"未標示難度"}[level]))+' · '+subset.length+'</h3><div class="stack">'+subset.slice(0,12).map(problemRow).join("")+'</div></section>';
        }).join("")
      : renderEmpty("目前沒有直接對應且可索引的外部題目；請使用上方原始題單。"));
  bindAttempts();
}
function stageNavigation() {
  const s=S.read(),stage=lessonView.stage,headings=lessonView.headings||[];
  const links=STAGES.map((item,i)=>{
    const actual=headings.find(h=>item.rx.test(h.title));
    return '<button class="stage-link'+(stage===i?" current":"")+'" data-stage="'+i+'"><span>'+String(i+1).padStart(2,"0")+' · '+esc(item.title)+'</span><small>'+(s.steps[lessonView.id]?.includes(i)?"✓ 已確認":actual?"原文有相關標題":"尚未標記")+'</small></button>';
  }).join("");
  document.getElementById("stage-nav").innerHTML=links;
  document.querySelectorAll("[data-stage]").forEach(btn=>btn.onclick=()=>{
    lessonView.stage=Number(btn.dataset.stage);
    stageNavigation(); updateStudyPanel();
    const match=lessonView.headings.find(h=>STAGES[lessonView.stage].rx.test(h.title));
    if(match) Source.jump(match.id);
  });
}
function renderHeadingToc(headings) {
  const target=document.getElementById("source-toc");
  if(!target) return;
  target.innerHTML=headings.length ? headings.map(h=>'<button class="toc-link" data-jump="'+attr(h.id)+'">'+esc(h.title)+'</button>').join("") : '<span class="muted">本篇目前沒有可辨識的標題。</span>';
  target.querySelectorAll("[data-jump]").forEach(button=>button.onclick=()=>Source.jump(button.dataset.jump));
}
function studyPrompt() {
  const el=document.getElementById("study-panel");
  if(!el||!lessonView) return;
  const id=lessonView.id,s=S.read(),mode=lessonView.mode,stage=lessonView.stage;
  const item=STAGES[stage],note=s.notes[id]||"",done=s.steps[id]?.includes(stage);
  const m=s.mastery[id]||{};
  const dimensionUI=DIMS.map(([key,label])=>'<label class="rating-row"><span>'+label+'</span><select data-mastery="'+key+'" aria-label="'+label+' 掌握程度">'+[0,1,2,3,4].map(n=>'<option value="'+n+'" '+((m[key]??0)===n?"selected":"")+'>'+n+' / 4</option>').join("")+'</select></label>').join("");
  el.innerHTML='<div class="side-panel"><p class="eyebrow">'+(mode==="interactive"?"INTERACTIVE / ":"READER / ")+'STEP '+(stage+1)+' OF 6</p><h3>'+esc(item.title)+'</h3>'+
    '<p>'+esc(item.prompt)+'</p>'+
    (mode==="interactive"?'<label for="self-check-note">用自己的話回答</label><textarea id="self-check-note" rows="5" placeholder="記下你的理解、疑問或實作想法…">'+esc(note)+'</textarea><div class="actions"><button class="button secondary" id="save-note">儲存筆記</button></div>':'<p class="muted">閱讀模式會完整顯示原始教材；切換互動模式後可以逐步做自我檢查。</p>')+
    '<div class="rating-group"><h4>分項掌握（自評）</h4>'+dimensionUI+'</div>'+
    '<label class="check-row"><input type="checkbox" id="complete-stage" '+(done?"checked":"")+'> 此步驟已完成</label>'+
    '<div class="actions"><button class="button secondary" id="prev-stage" '+(stage===0?"disabled":"")+'>上一步</button><button class="button" id="next-stage" '+(stage===5?"disabled":"")+'>下一步 →</button></div>'+
    '</div>';
  el.querySelectorAll("[data-mastery]").forEach(input=>input.onchange=()=>{S.setMastery(id,input.dataset.mastery,input.value);showToast("掌握度已更新");});
  document.getElementById("complete-stage").onchange=e=>{S.completeStep(id,stage,e.target.checked);stageNavigation();updateLessonProgress();};
  document.getElementById("prev-stage").onclick=()=>{lessonView.stage--;stageNavigation();studyPrompt();};
  document.getElementById("next-stage").onclick=()=>{lessonView.stage++;stageNavigation();studyPrompt();};
  if(mode==="interactive"){const field=document.getElementById("self-check-note");field.oninput=()=>S.setNote(id,field.value);document.getElementById("save-note").onclick=()=>{S.setNote(id,field.value);showToast("筆記已儲存在此瀏覽器");};}
}
function updateStudyPanel(){studyPrompt();}
function updateLessonProgress(){
  const id=lessonView.id,steps=S.read().steps[id]||[];
  document.getElementById("step-progress").innerHTML=bar(steps.length,6)+'<small class="muted">'+steps.length+' / 6 階段完成</small>';
  const mark=document.getElementById("mark-read"); if(mark) mark.textContent=S.read().done[id]?"✓ 已標記閱讀":"標記已閱讀";
}
function renderLesson(id,mode="reader") {
  const lesson=findLesson(id);
  if(!lesson)return notFound();
  const course=getCourse(lesson.domain),chapter=C.chapterFor(id);
  lessonView={id,stage:0,mode:mode==="interactive"?"interactive":"reader",headings:[]};
  const all=course?.lessons||[];
  const index=all.findIndex(l=>l.id===id);
  const prev=all[index-1],next=all[index+1];
  const ladder=C.setByLesson.get(id)||[];
  const prereqs=C.prerequisitesForLesson(id);
  const prereqUI=prereqs.length
    ? '<div class="card" style="margin-top:18px"><h3>先修知識</h3><p class="muted">以下關聯取自既有 Roadmap 與 v2 課程對應表。</p><div class="stack">'+prereqs.map(p=>p.lessonId?'<a href="'+C.path(findLesson(p.lessonId))+'">◦ '+esc(p.title)+' → 對應 Lesson</a>':'<a href="'+topicLink(p.topicId)+'">◦ '+esc(p.title)+' → 知識節點</a>').join("")+'</div></div>'
    : '';
  app.innerHTML=title("COURSE / "+(chapter?.title||"CHAPTER")+" / LESSON",lesson.title,lesson.domain)+
    '<div class="actions">'+navbtn("#/courses/"+enc(lesson.domain)+"/"+enc(chapter?.id||"chapter-1"),"← 返回本章")+
    '<button class="button mode-btn" data-mode="reader">閱讀模式</button><button class="button mode-btn" data-mode="interactive">互動模式</button>'+
    (lesson.notionUrl?navbtn(lesson.notionUrl,"原始 Notion ↗"):"")+'</div>'+
    '<div class="lesson-layout v3-lesson-layout"><aside class="card side"><p class="eyebrow">LEARNING PATH</p><h3>六段式學習</h3><div id="step-progress"></div><div id="stage-nav"></div><hr><p class="eyebrow">原文章節</p><div id="source-toc" class="toc"></div></aside>'+
    '<section class="lesson-main"><div class="card source-card"><div class="row"><h2>原始教材</h2><span class="pill" id="source-status">載入中</span></div><p class="muted">以下直接渲染原始 Notion 資料，未改寫文字、公式、圖片或程式碼。</p><div id="source-content" class="notion-live-host" aria-live="polite"></div></div>'+
    prereqUI+'<div class="card" style="margin-top:20px"><h3>相關題單</h3>'+
      (ladder.length?ladder.map(l=>'<p><a href="'+attr(l.notionUrl||"../v2/#/problems")+'" target="_blank" rel="noopener noreferrer">'+esc(l.title)+' ↗</a></p>').join(""):renderEmpty("尚無直接對應的原始題單，可到題庫依主題尋找。"))+
    '</div><div class="card" style="margin-top:20px"><div class="row"><div><h3>閱讀紀錄</h3><p class="muted">閱讀完成與掌握程度分開計算。</p></div><div class="actions"><button id="mark-read" class="button secondary"></button><button id="plan-review" class="button secondary">加入複習清單</button></div></div></div>'+
    '<div class="actions">'+(prev?navbtn(C.path(prev),"← "+prev.title):"")+(next?navbtn(C.path(next),next.title+" →",false):"")+'</div></section>'+
    '<aside id="study-panel" class="card study-side"></aside></div>';
  document.querySelectorAll(".mode-btn").forEach(button=>button.onclick=()=>{
    const desired=button.dataset.mode;
    if(lessonView.mode===desired)return;
    lessonView.mode=desired;
    history.replaceState(null,"",C.path(lesson)+(desired==="interactive"?"?mode=interactive":""));
    updateModeButtons(); studyPrompt();
  });
  function updateModeButtons(){document.querySelectorAll(".mode-btn").forEach(btn=>btn.classList.toggle("selected",btn.dataset.mode===lessonView.mode));}
  updateModeButtons();
  updateLessonProgress();
  stageNavigation();
  studyPrompt();
  document.getElementById("plan-review").onclick=()=>{S.planReview(id);showToast("已加入今天的複習清單");};
  document.getElementById("mark-read").onclick=()=>{
    S.markRead(id,!S.read().done[id]);updateLessonProgress();showToast(S.read().done[id]?"已標記閱讀":"已取消標記");
  };
  const host=document.getElementById("source-content");
  Source.render(lesson,host,{
    onStatus:(kind,detail)=>{
      const el=document.getElementById("source-status");if(el)el.textContent=kind==="ready"?(detail==="live"?"Notion Live":"本機快照"):kind==="empty"?"尚無內容":kind==="error"?"載入失敗":"載入中";
    },
    onHeadings:(headings)=>{
      if(!lessonView || lessonView.id!==id)return;
      lessonView.headings=headings;
      stageNavigation();
      renderHeadingToc(headings);
    }
  });
}
function renderRoadmap() {
  const entries=C.roadmap.map(g=>'<section><div class="section-head"><h2>'+esc(g.name)+'</h2><small>'+g.topics.length+' 個主題</small></div><div class="grid">'+g.topics.map(t=>
    card(topicLink(t.id),t.title,(t.prerequisites||[]).length?"先修："+t.prerequisites.map(x=>C.topicById.get(x)?.title||x).join("、"):"未指定先修主題","KNOWLEDGE NODE")).join("")+'</div></section>').join("");
  app.innerHTML=title("LEARNING ROADMAP","先修依賴地圖","依據既有 data/roadmap.js 的 prerequisites 建立連結；沒有列出的邊不會推測補上。")+
    '<p class="muted">已載入 '+C.topicById.size+' 個知識節點、'+C.edges.length+' 條明確先修關係。</p>'+entries;
}
function renderTopic(id) {
  const t=C.topicById.get(id);if(!t)return notFound();
  const required=t.prerequisites||[];
  const after=C.edges.filter(e=>e.from===id).map(e=>C.topicById.get(e.to)).filter(Boolean);
  const resources=(t.resources||[]).map(r=>'<a class="card" href="'+attr(r.url)+'" target="_blank" rel="noopener noreferrer"><strong>'+esc(r.name)+'</strong><p class="muted">'+esc(r.type||"參考資源")+'</p></a>').join("");
  const topicProblems=C.problems.filter(p=>p.topicId===id);
  app.innerHTML=title("PREREQUISITE GRAPH",t.title,t.level)+
    '<div class="actions">'+navbtn("#/roadmap","← 知識地圖")+'</div>'+
    '<div class="grid two-col" style="margin-top:22px"><div class="card"><h2>先修節點</h2><div class="stack">'+(required.map(x=>card(topicLink(x),C.topicById.get(x)?.title||x,"","PREREQUISITE")).join("")||renderEmpty("目前原始資料沒有指定先修節點。"))+'</div></div>'+
    '<div class="card"><h2>後續延伸</h2><div class="stack">'+(after.map(x=>card(topicLink(x.id),x.title,"","NEXT")).join("")||renderEmpty("目前沒有記錄後續依賴節點。"))+'</div></div></div>'+
    '<div class="card" style="margin-top:20px"><h2>原始主題說明</h2><p>'+esc(t.desc||"")+'</p></div>'+
    '<div class="section-head"><h2>相關題目</h2></div><div class="stack">'+(topicProblems.map(p=>problemRow(p)).join("")||renderEmpty("沒有已索引的題目。"))+'</div>'+
    '<div class="section-head"><h2>參考資源</h2></div><div class="grid two-col">'+(resources||renderEmpty("沒有額外的參考資源。"))+'</div>';
  bindAttempts();
}
function problemRow(p) {
  const s=S.read(),attempt=s.attempts[p.id],status=attempt?.status||"todo";
  const text={todo:"未開始",trying:"嘗試中",wa:"待訂正",ac:"AC"}[status]||"未開始";
  return '<article class="card problem-row"><div><span class="eyebrow">'+esc(p.platform)+' · '+esc(p.difficulty||"Unrated")+'</span><h3><a href="'+attr(p.url)+'" target="_blank" rel="noopener noreferrer">'+esc(p.title)+' ↗</a></h3><small class="muted">'+esc(p.topicTitle||p.domain||"")+'</small></div><button class="button secondary" data-attempt="'+attr(p.id)+'">'+text+' · 記錄</button></article>';
}
function bindAttempts(){
  document.querySelectorAll("[data-attempt]").forEach(btn=>btn.onclick=()=>{
    const id=btn.dataset.attempt,problem=C.problems.find(p=>p.id===id);
    if(!problem)return;
    activeProblem=id;
    const old=S.read();
    const modal=document.getElementById("attempt-dialog");
    modal.querySelector("h2").textContent=problem.title;
    modal.querySelector("[name=status]").value=old.attempts[id]?.status||"todo";
    modal.querySelector("[name=reason]").value=old.mistakes[id]?.reason||"";
    modal.querySelector("[name=note]").value=old.mistakes[id]?.note||"";
    modal.showModal();
  });
}
function renderProblems(){
  const q=new URLSearchParams(location.hash.split("?")[1]||"");
  const domain=q.get("domain")||"";
  const all=C.problems;
  app.innerHTML=title("PROBLEM LIBRARY","分級題庫與錯題追蹤","現有 Roadmap 題目與 Notion 題單連結自動彙整；題目與連結不經改寫。")+
    '<div class="card filter-grid"><label>題目搜尋<input id="problem-search" type="search" placeholder="CSES、Dijkstra、ZeroJudge"></label>'+
    '<label>難度<select id="problem-difficulty"><option value="">全部</option><option>Easy</option><option>Medium</option><option>Hard</option><option>Extreme</option><option>Advanced</option><option>Unrated</option></select></label>'+
    '<label>作答狀態<select id="problem-status"><option value="">全部</option><option value="todo">未開始</option><option value="trying">嘗試中</option><option value="wa">待訂正</option><option value="ac">AC</option></select></label></div>'+
    '<p class="muted" id="problem-count"></p><div class="stack" id="problem-results"></div><div class="actions"><button id="more-problems" class="button secondary">顯示更多</button></div>';
  let limit=problemPageSize;
  const search=document.getElementById("problem-search"),difficulty=document.getElementById("problem-difficulty"),status=document.getElementById("problem-status");
  const draw=()=>{
    const query=search.value.trim().toLowerCase(),s=S.read();
    const filtered=all.filter(p=>(!domain||p.domain===domain)&&(!query||(p.title+" "+p.platform+" "+p.topicTitle).toLowerCase().includes(query))&&(!difficulty.value||p.difficulty===difficulty.value)&&(!status.value||(s.attempts[p.id]?.status||"todo")===status.value));
    document.getElementById("problem-count").textContent="符合 "+filtered.length+" 題，顯示 "+Math.min(limit,filtered.length)+" 題";
    document.getElementById("problem-results").innerHTML=filtered.slice(0,limit).map(problemRow).join("")||renderEmpty("沒有符合條件的題目。");
    document.getElementById("more-problems").hidden=filtered.length<=limit;
    bindAttempts();
  };
  for(const node of [search,difficulty,status])node.addEventListener(node===search?"input":"change",()=>{limit=45;draw();});
  document.getElementById("more-problems").onclick=()=>{limit+=45;draw();};
  draw();
}
function renderReview(){
  const s=S.read(),due=S.dueCourses(C.lessons);
  const scheduled=C.lessons.filter(l=>s.reviews[l.id]?.due&&!due.some(d=>d.id===l.id)).sort((a,b)=>s.reviews[a.id].due.localeCompare(s.reviews[b.id].due));
  const mistakes=C.problems.filter(p=>s.mistakes[p.id]&&!s.mistakes[p.id].resolved);
  const cards=due.map(l=>'<div class="card review-row"><div><h3><a href="'+C.path(l)+'">'+esc(l.title)+'</a></h3><small>到期：'+esc(s.reviews[l.id]?.due)+'</small></div><div class="actions"><button class="button secondary" data-review="'+l.id+'" data-quality="1">需要再練</button><button class="button" data-review="'+l.id+'" data-quality="4">記得很清楚</button></div></div>').join("");
  app.innerHTML=title("SPACED REVIEW","錯題與複習","複習間隔依自評調整：1、3、7、14、30、60 天；資料只儲存在目前瀏覽器。")+
    '<div class="grid stats-grid"><div class="card stat"><strong>'+due.length+'</strong><span>到期複習</span></div><div class="card stat"><strong>'+mistakes.length+'</strong><span>未解決錯題</span></div><div class="card stat"><strong>'+Object.keys(s.done).length+'</strong><span>已讀課程</span></div></div>'+
    '<div class="section-head"><h2>今天要複習</h2></div><div class="stack">'+(cards||renderEmpty("目前沒有到期的複習。可從 Lesson 中安排複習。"))+'</div>'+
    '<div class="section-head"><h2>待訂正錯題</h2>'+navbtn("#/problems","開啟題庫")+'</div><div class="stack">'+(mistakes.map(p=>'<div class="card"><h3>'+esc(p.title)+'</h3><p class="muted">錯因：'+esc(s.mistakes[p.id].reason||"未分類")+'</p><button class="button secondary" data-attempt="'+attr(p.id)+'">更新作答狀態</button></div>').join("")||renderEmpty("目前沒有待訂正的錯題。"))+'</div>'+
    '<div class="section-head"><h2>接下來的排程</h2></div><div class="stack">'+(scheduled.slice(0,12).map(l=>'<div class="card row"><a href="'+C.path(l)+'">'+esc(l.title)+'</a><span class="muted">'+esc(s.reviews[l.id].due)+'</span></div>').join("")||renderEmpty("目前沒有已排定的未來複習。"))+'</div>';
  document.querySelectorAll("[data-review]").forEach(btn=>btn.onclick=()=>{S.review(btn.dataset.review,btn.dataset.quality);renderReview();showToast("複習結果已更新");});
  bindAttempts();
}
function renderProgress(){
  const s=S.read();
  const rows=C.courses.map(c=>'<div class="card"><div class="row"><strong>'+esc(c.name)+'</strong><small>'+doneCount(c.lessons)+' / '+c.lessons.length+'</small></div>'+bar(doneCount(c.lessons),c.lessons.length)+'</div>').join("");
  const rated=C.lessons.filter(l=>s.mastery[l.id]&&Object.keys(s.mastery[l.id]).length);
  app.innerHTML=title("LEARNING ANALYTICS","學習掌握度","閱讀進度、自我評分、作答紀錄分開計算；沒有作答資料的維度不會被當成滿分。")+
    '<div class="grid stats-grid">'+DIMS.map(([k,label])=>{const vals=rated.map(l=>s.mastery[l.id]?.[k]).filter(v=>Number.isFinite(v));const avg=vals.length?(vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1):"—";return '<div class="card stat"><strong>'+avg+'</strong><span>'+label+' / 4</span></div>';}).join("")+'</div>'+
    '<div class="section-head"><h2>各 Course 閱讀進度</h2></div><div class="stack">'+rows+'</div>'+
    '<div class="section-head"><h2>備份學習資料</h2></div><div class="card"><p class="muted">可將本機紀錄匯出為 JSON，方便自行保管。匯出不包含任何原始教材內容。</p><button class="button secondary" id="export-progress">匯出 JSON</button></div>';
  document.getElementById("export-progress").onclick=()=>{
    const blob=new Blob([JSON.stringify(S.read(),null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download="coding-course-v3-progress.json";a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
}
function notFound(){app.innerHTML=title("NOT FOUND","找不到這個頁面","可能是連結過期或教材目錄尚未同步。")+navbtn("#/courses","返回課程總覽");}
function route(){
  Source.cleanup(); lessonView=null;
  const {path,query}=hashPath();
  if(!path.length||path[0]==="home"||path[0]==="dashboard")renderDashboard();
  else if(path[0]==="courses"&&path.length===1)renderCourses();
  else if(path[0]==="courses"&&path.length===2)renderCourse(path[1]);
  else if(path[0]==="courses"&&path[3]&&path.length===4)renderLesson(path[3],query.get("mode")||"reader");
  else if(path[0]==="courses"&&path.length===3)renderChapter(path[1],path[2]);
  else if(path[0]==="lesson"&&path[1])renderLesson(path[1],query.get("mode")||"reader");
  else if(path[0]==="roadmap"&&path[1])renderTopic(path[1]);
  else if(path[0]==="roadmap")renderRoadmap();
  else if(path[0]==="problems")renderProblems();
  else if(path[0]==="review")renderReview();
  else if(path[0]==="progress")renderProgress();
  else notFound();
  window.scrollTo(0,0);
}
document.getElementById("theme").onclick=()=>{
  const dark=document.documentElement.classList.toggle("dark");
  document.documentElement.dataset.theme=dark?"dark":"light";
  window.NotionXBridge?.setTheme?.(dark);
  try{localStorage.setItem("coding_course_v3_dark",dark?"1":"0")}catch(_){}
};
try{if(localStorage.getItem("coding_course_v3_dark")==="1"){document.documentElement.classList.add("dark");document.documentElement.dataset.theme="dark";}}catch(_){}
document.getElementById("attempt-form").onsubmit=e=>{
  e.preventDefault();if(!activeProblem)return;
  const form=e.currentTarget;
  S.recordAttempt(activeProblem,form.elements.status.value,form.elements.reason.value,form.elements.note.value);
  document.getElementById("attempt-dialog").close();
  activeProblem=null;
  route();showToast("題目作答紀錄已儲存");
};
document.getElementById("attempt-cancel").onclick=()=>document.getElementById("attempt-dialog").close();
document.addEventListener("keydown",event=>{
  if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==="k"){
    event.preventDefault();location.hash="#/courses";
    setTimeout(()=>document.getElementById("course-filter")?.focus(),0);
  }
});
window.addEventListener("hashchange",route);
route();
})();