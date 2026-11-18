/* Branch preview browser regression test; uses the repo files directly, no production deployment. */
"use strict";
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const MIME = {".html":"text/html",".js":"text/javascript",".css":"text/css",".png":"image/png",".jpg":"image/jpeg",".woff2":"font/woff2",".woff":"font/woff",".gif":"image/gif"};
const server = http.createServer((req,res)=>{
  const pathname = decodeURIComponent((req.url||"/").split("?")[0]);
  const target = path.resolve(root, "." + pathname, pathname.endsWith("/") ? "index.html" : "");
  if (!target.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
  fs.readFile(target,(error,data)=>{
    if (error){res.writeHead(404);res.end();return;}
    res.writeHead(200,{"Content-Type":MIME[path.extname(target)]||"application/octet-stream","Cache-Control":"no-store"});
    res.end(data);
  });
});
async function main(){
  await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
  const base="http://127.0.0.1:"+server.address().port;
  const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
  try{
    const page=await browser.newPage({viewport:{width:1280,height:900}});
    const errors=[];
    page.on("pageerror",e=>errors.push(e.message));
    // A failing live API must not prevent archived Markdown from being readable.
    await page.route("https://benjaminshih.vercel.app/**",route=>route.fulfill({status:503,contentType:"application/json",body:"{}"}));
    await page.goto(base+"/v3/#/dashboard",{waitUntil:"domcontentloaded"});
    await page.waitForFunction(()=>window.V3Catalog?.lessons?.length >=70);
    assert.match(await page.locator("#app h1").textContent(),/Learn/);
    await page.locator('.topbar nav a[href="#/courses"]').click();
    await page.waitForSelector("#course-results .catalog-card");
    await page.locator("#course-results .catalog-card").first().click();
    await page.waitForSelector(".grid.two-col > .card");
    await page.locator(".grid.two-col > .card").first().click();
    await page.waitForSelector(".lesson-row");
    await page.locator(".lesson-row").first().click();
    await page.waitForSelector("#study-panel");
    assert.equal(await page.locator("#stage-nav .stage-link").count(),6,"six-section learning navigation");
    await page.locator('[data-mode="interactive"]').click();
    await page.locator("#self-check-note").fill("Testing self-check notes");
    await page.locator("#complete-stage").check();
    await page.locator("#plan-review").click();
    await page.locator("#mark-read").click();
    assert(await page.locator("#mark-read").textContent() !== "", "read completion controls");
    await page.waitForFunction(() => ["Notion Live","本機快照","載入失敗","尚無內容"].includes(document.getElementById("source-status")?.textContent), null, { timeout: 20000 });
    assert(["Notion Live","本機快照","載入失敗","尚無內容"].includes(await page.locator("#source-status").textContent()),"original source status resolved");
    await page.goto(base+"/v3/#/problems",{waitUntil:"domcontentloaded"});
    await page.waitForSelector(".problem-row button[data-attempt]");
    await page.locator(".problem-row button[data-attempt]").first().click();
    await page.locator('#attempt-form select[name="status"]').selectOption("wa");
    await page.locator('#attempt-form select[name="reason"]').selectOption("演算法觀念");
    await page.locator('#attempt-form textarea[name="note"]').fill("Check recurrence");
    await page.locator('#attempt-form button[type="submit"]').click();
    await page.waitForFunction(()=>Object.keys(window.V3Store.read().mistakes).length>=1);
    await page.goto(base+"/v3/#/review",{waitUntil:"domcontentloaded"});
    await page.waitForSelector("[data-review]");
    await page.locator('[data-review][data-quality="4"]').first().click();
    await page.goto(base+"/v3/#/roadmap",{waitUntil:"domcontentloaded"});
    await page.waitForSelector(".catalog-card");
    await page.locator(".catalog-card").first().click();
    assert(await page.locator("#app h1").textContent(),"knowledge map detail");
    await page.goto(base+"/v3/#/progress",{waitUntil:"domcontentloaded"});
    assert.match(await page.locator("#app h1").textContent(),/學習掌握度/);
    await page.locator("#export-progress").click();
    await page.setViewportSize({width:390,height:844});
    await page.goto(base+"/v3/#/dashboard",{waitUntil:"domcontentloaded"});
    const viewport=await page.evaluate(()=>({viewport:innerWidth,content:document.documentElement.scrollWidth}));
    assert(viewport.content <= viewport.viewport+12,"mobile dashboard should not overflow horizontally");
    assert.deepEqual(errors,[],"browser page errors");
    console.log("Browser smoke passed: navigation, lesson, source fallback, interactive notes, attempt dialog, reviews, roadmap, responsive layout");
  }finally{
    await browser.close();
    server.close();
  }
}
main().catch(error=>{console.error(error);server.close();process.exitCode=1;});
