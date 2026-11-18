(() => {
"use strict";
const C = window.V3Catalog, S = window.V3Store, Source = window.V3Source;
const app = document.getElementById("app");
if (!C || !S || !Source) { app.textContent = "v3 無法載入核心模組，請重新整理頁面。"; return; }
let lessonView = null, activeProblem = null;
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
  app.innerHTML = title("YOUR LEARNING SPACE","Coding Course","Learn · Practice · Review")+
    '<div class="grid stats-grid">'+
      '<div class="card stat"><strong>'+C.lessons.length+'</strong><span>課程 Lesson</span></div>'+
      '<div class="card stat"><strong>'+complete+'</strong><span>已閱讀</span></div>'+
      '<div class="card stat"><strong>'+due.length+'</strong><span>今日到期複習</span></div>'+
      '<div class="card stat"><strong>'+C.problems.length+'</strong><span>題庫索引題目</span></div>'+
    '</div>'+
    '<div class="section-head"><div><p class="eyebrow">NEXT ACTION</p><h2>今天先做</h2></div>'+navbtn("#/review","複習清單")+'</div>'+
    '<p class="muted">優先順序：已到期複習 → 弱項 → 未閱讀課程。這些是規則式建議，不會假裝知道你尚未測量的能力。</p>'+
    '<div class="grid two-col">'+next.map(x=>card(C.path(x.course),x.course.title,x.reason,x.course.domain)).join("")+'</div>'+
    '<div class="section-head"><h2>課程單元</h2>'+navbtn("#/courses","全部課程")+'</div>'+
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
      ? C.problemLevels.map(level=>{
          const subset=relatedProblems.filter(p=>C.problemLevel(p).id===level.id);
          if(!subset.length)return "";
          return '<section><h3>'+esc(level.label)+' · '+subset.length+'</h3><div class="stack">'+subset.slice(0,12).map(p=>problemRow(p)).join("")+'</div></section>';
        }).join("")
      : renderEmpty("目前沒有直接對應且可索引的外部題目；請使用上方原始題單。"));
  bindAttempts();
}
function renderHeadingToc(headings) {
  const target=document.getElementById("source-toc");
  if(!target) return;
  target.innerHTML=headings.length ? headings.map(h=>'<button class="toc-link" data-jump="'+attr(h.id)+'">'+esc(h.title)+'</button>').join("") : '<span class="muted">本篇目前沒有可辨識的標題。</span>';
  target.querySelectorAll("[data-jump]").forEach(button=>button.onclick=()=>Source.jump(button.dataset.jump));
}
function updateLessonProgress(){
  const mark=document.getElementById("mark-read");
  if(mark && lessonView) mark.textContent=S.read().done[lessonView.id]?"✓ 已閱讀":"標記已閱讀";
}
function renderLesson(id) {
  const lesson=findLesson(id);
  if(!lesson)return notFound();
  const course=getCourse(lesson.domain),chapter=C.chapterFor(id);
  lessonView={id,headings:[]};
  const all=course?.lessons||[],index=all.findIndex(l=>l.id===id);
  const prev=all[index-1],next=all[index+1],ladder=C.setByLesson.get(id)||[];
  app.innerHTML=title("COURSE / "+(chapter?.title||"CHAPTER")+" / LESSON",lesson.title,lesson.domain)+
    '<div class="actions">'+navbtn("#/courses/"+enc(lesson.domain)+"/"+enc(chapter?.id||"chapter-1"),"← 返回本章")+
    (lesson.notionUrl?navbtn(lesson.notionUrl,"原始 Notion ↗"):"")+'</div>'+
    '<div class="lesson-layout"><article class="lesson-main"><div class="source-card"><div class="row"><h2>教材</h2><span class="pill" id="source-status">載入中</span></div><div id="source-content" class="notion-live-host" aria-live="polite"></div></div>'+
    '<section class="lesson-section"><h3>相關題單</h3>'+
    (ladder.length?ladder.map(l=>'<p><a href="'+attr(l.notionUrl||"../v2/#/problems")+'" target="_blank" rel="noopener noreferrer">'+esc(l.title)+' ↗</a></p>').join(""):renderEmpty("尚無直接對應的原始題單。"))+
    navbtn("#/problems?domain="+enc(lesson.domain),"本單元題庫 →")+'</section>'+
    '<section class="lesson-section"><div class="row"><h3>閱讀紀錄</h3><div class="actions"><button id="mark-read" class="button secondary"></button><button id="plan-review" class="button secondary">加入複習清單</button></div></div></section>'+
    '<div class="actions lesson-pagination">'+(prev?navbtn(C.path(prev),"← "+prev.title):"")+(next?navbtn(C.path(next),next.title+" →",false):"")+'</div></article>'+
    '<aside class="lesson-toc"><p class="eyebrow">本篇目錄</p><div id="source-toc" class="toc"></div></aside></div>';
  updateLessonProgress();
  document.getElementById("plan-review").onclick=()=>{S.planReview(id);showToast("已加入今天的複習清單");};
  document.getElementById("mark-read").onclick=()=>{
    S.markRead(id,!S.read().done[id]);updateLessonProgress();showToast(S.read().done[id]?"已標記閱讀":"已取消標記");
  };
  Source.render(lesson,document.getElementById("source-content"),{
    onStatus:(kind,detail)=>{
      const el=document.getElementById("source-status");
      if(el)el.textContent=kind==="ready"?(detail==="live"?"Notion Live":"本機快照"):kind==="empty"?"尚無內容":kind==="error"?"載入失敗":"載入中";
    },
    onHeadings:headings=>{
      if(!lessonView || lessonView.id!==id)return;
      lessonView.headings=headings;renderHeadingToc(headings);
    }
  });
}
function renderRoadmap() {
  app.innerHTML=title("LEARNING ROADMAP","先修依賴圖","")+'<div id="roadmap-canvas" aria-label="先修依賴圖"></div>';
}
function problemRow(p,s=S.read()) {
  const attempt=s.attempts[p.id],status=attempt?.status||"todo";
  const text={todo:"未開始",trying:"嘗試中",wa:"待訂正",ac:"AC"}[status]||"未開始";
  return '<article class="card problem-row"><div><span class="eyebrow">'+esc(p.platform)+' · '+esc(C.problemLevel(p).label)+'</span><h3><a href="'+attr(p.url)+'" target="_blank" rel="noopener noreferrer">'+esc(p.title)+' ↗</a></h3><small class="muted">'+esc(p.topicTitle||p.domain||"")+'</small></div><button class="button secondary" data-attempt="'+attr(p.id)+'">'+text+' · 記錄</button></article>';
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
  const q=hashPath().query,domain=q.get("domain")||"";
  if(domain&&!C.courseById.has(domain))return notFound();
  const active=domain?C.courseById.get(domain):null;
  const levels=C.problemLevels;
  app.innerHTML=title("PROBLEM LIBRARY",active?active.name:"分級題庫與錯題追蹤",active?"依難度分級練習，記錄 AC、WA、錯誤原因與筆記。":"選擇單元，再依基礎、中階、進階、挑戰與延伸練習。")+
    (active?'<div class="actions">'+navbtn("#/problems","← 全部單元")+navbtn("#/courses/"+enc(domain),"單元課程")+'</div>':"")+
    '<div class="filter-grid"><label>題目搜尋<input id="problem-search" type="search" placeholder="CSES、Dijkstra、ZeroJudge"></label>'+
    '<label>難度<select id="problem-difficulty"><option value="">全部</option>'+levels.map(l=>'<option value="'+l.id+'">'+l.label+'</option>').join("")+'</select></label>'+
    '<label>作答狀態<select id="problem-status"><option value="">全部</option><option value="todo">未開始</option><option value="trying">嘗試中</option><option value="wa">待訂正</option><option value="ac">AC</option></select></label></div>'+
    '<p class="muted" id="problem-count" role="status"></p><div id="problem-results"></div><div id="unit-ladders"></div><div class="actions"><button id="more-problems" class="button secondary" hidden>顯示更多</button></div>';
  let limit=45;
  const search=document.getElementById("problem-search"),difficulty=document.getElementById("problem-difficulty"),status=document.getElementById("problem-status");
  search.value=q.get("search")||"";difficulty.value=q.get("difficulty")||"";status.value=q.get("status")||"";
  // Keep old saved filter links meaningful after adopting Chinese difficulty groups.
  if(!difficulty.value&&q.get("difficulty"))difficulty.value=C.problemLevel({difficulty:q.get("difficulty")}).id;
  const draw=()=>{
    const query=search.value.trim().toLowerCase(),s=S.read();
    const params=new URLSearchParams();
    if(domain)params.set("domain",domain);
    if(search.value)params.set("search",search.value);
    if(difficulty.value)params.set("difficulty",difficulty.value);
    if(status.value)params.set("status",status.value);
    history.replaceState(null,"","#/problems"+(params.size?"?"+params:"") );
    const filtered=C.problems.filter(p=>(!domain||p.domains.includes(domain))&&(!query||(p.title+" "+p.platform+" "+p.topicTitle).toLowerCase().includes(query))&&(!difficulty.value||C.problemLevel(p).id===difficulty.value)&&(!status.value||(s.attempts[p.id]?.status||"todo")===status.value));
    const results=document.getElementById("problem-results"),more=document.getElementById("more-problems");
    document.getElementById("problem-count").textContent="符合 "+filtered.length+" 題"+(active?" · 已 AC "+filtered.filter(p=>s.attempts[p.id]?.status==="ac").length:"");
    if(!active){
      results.className="unit-directory";
      results.innerHTML=C.courses.map(course=>{
        const subset=filtered.filter(p=>p.domains.includes(course.id)),sets=C.setByDomain.get(course.id)||[];
        const link=new URLSearchParams(params);link.set("domain",course.id);
        return '<a class="unit-card" href="#/problems?'+attr(link.toString())+'"><h2>'+esc(course.name)+'</h2><p>'+subset.length+' 題 · '+sets.length+' 份原始題單</p><span>進入單元 →</span></a>';
      }).join("");
      more.hidden=true;
    }else{
      results.className="problem-groups";
      let remaining=limit;
      results.innerHTML=levels.map(level=>{
        const subset=filtered.filter(p=>C.problemLevel(p).id===level.id),visible=subset.slice(0,Math.max(0,remaining));
        remaining-=visible.length;
        if(!subset.length)return "";
        return '<section class="problem-level" data-level="'+level.id+'"><div class="section-head"><h2>'+level.label+'</h2><small class="muted">'+subset.length+' 題</small></div><div class="stack">'+(visible.length?visible.map(p=>problemRow(p,s)).join(""):'<p class="muted">點選「顯示更多」載入本分級題目。</p>')+'</div></section>';
      }).join("")||renderEmpty("沒有符合條件的題目。");
      more.hidden=filtered.length<=limit;
      const sets=C.setByDomain.get(domain)||[];
      document.getElementById("unit-ladders").innerHTML=sets.length?'<section class="lesson-section"><h2>原始題單</h2><p class="muted">完整題單包含尚未收錄至索引的練習與延伸內容。</p>'+sets.map(l=>'<a class="ladder-link" href="'+attr(l.notionUrl||"../v2/#/problems")+'" target="_blank" rel="noopener noreferrer">'+esc(l.title)+' ↗</a>').join("")+'</section>':"";
      bindAttempts();
    }
  };
  let searchTimer;
  search.addEventListener("input",()=>{clearTimeout(searchTimer);searchTimer=setTimeout(()=>{limit=45;draw();},120);});
  for(const node of [difficulty,status])node.addEventListener("change",()=>{clearTimeout(searchTimer);limit=45;draw();});
  document.getElementById("more-problems").onclick=()=>{limit+=45;draw();};
  draw();
}
function renderReview(){
  const s=S.read(),due=S.dueCourses(C.lessons);
  const scheduled=C.lessons.filter(l=>s.reviews[l.id]?.due&&!due.some(d=>d.id===l.id)).sort((a,b)=>s.reviews[a.id].due.localeCompare(s.reviews[b.id].due));
  const mistakes=C.problems.filter(p=>s.attempts[p.id]?.status==="wa"&&!s.mistakes[p.id]?.resolved);
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
  app.innerHTML=title("MY LEARNING","學習進度","課程閱讀、題目作答與複習紀錄。")+
    '<div class="grid stats-grid">'+[
      [C.lessons.filter(l=>s.done[l.id]).length,"已閱讀課程"],
      [C.problems.filter(p=>s.attempts[p.id]?.status==="ac").length,"已 AC 題目"],
      [C.problems.filter(p=>s.attempts[p.id]?.status==="wa").length,"待訂正題目"],
      [S.dueCourses(C.lessons).length,"今日複習"]
    ].map(([n,label])=>'<div class="card stat"><strong>'+n+'</strong><span>'+label+'</span></div>').join("")+'</div>'+
    '<div class="section-head"><h2>各 Course 閱讀進度</h2></div><div class="stack">'+rows+'</div>'+
    '<div class="section-head"><h2>備份學習資料</h2></div><div class="card"><p class="muted">可將本機紀錄匯出為 JSON，方便自行保管。匯出不包含任何原始教材內容。匯入會覆蓋目前的本機學習紀錄。</p><div class="actions"><button class="button secondary" id="export-progress">匯出 JSON</button><label class="button secondary" for="import-progress">匯入 JSON</label><input id="import-progress" type="file" accept=".json,application/json" hidden></div></div>';
  document.getElementById("export-progress").onclick=()=>{
    const blob=new Blob([JSON.stringify(S.read(),null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download="coding-course-v3-progress.json";a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  document.getElementById("import-progress").onchange=async event=>{
    const file=event.target.files?.[0];if(!file)return;
    if(!window.confirm("匯入備份會覆蓋目前瀏覽器的學習紀錄。要繼續嗎？"))return;
    try {const count=S.importBackup(JSON.parse(await file.text()));renderProgress();showToast("已匯入 "+count+" 筆閱讀紀錄");}
    catch(error){showToast("匯入失敗："+String(error.message||error));}
  };
}
function notFound(){app.innerHTML=title("NOT FOUND","找不到這個頁面","可能是連結過期或教材目錄尚未同步。")+navbtn("#/courses","返回課程總覽");}
function route(){
  Source.cleanup(); lessonView=null;
  const {path}=hashPath();
  if(!path.length||path[0]==="home"||path[0]==="dashboard")renderDashboard();
  else if(path[0]==="courses"&&path.length===1)renderCourses();
  else if(path[0]==="courses"&&path.length===2)renderCourse(path[1]);
  else if(path[0]==="courses"&&path[3]&&path.length===4)renderLesson(path[3]);
  else if(path[0]==="courses"&&path.length===3)renderChapter(path[1],path[2]);
  else if(path[0]==="lesson"&&path[1])renderLesson(path[1]);
  else if(path[0]==="roadmap")renderRoadmap();
  else if(path[0]==="problems")renderProblems();
  else if(path[0]==="review")renderReview();
  else if(path[0]==="progress")renderProgress();
  else notFound();
  document.querySelectorAll(".topbar nav a").forEach(a=>a.classList.toggle("active",a.getAttribute("href").slice(2)===(path[0]||"dashboard")));
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
