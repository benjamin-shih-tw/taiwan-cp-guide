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
    assert.match(await page.locator("#app h1").textContent(),/Coding Course/);
    await page.locator('.topbar nav a[href="#/courses"]').click();
    await page.waitForSelector("#course-results .catalog-card");
    await page.locator("#course-results .catalog-card").first().click();
    await page.waitForSelector(".grid.two-col > .card");
    await page.locator(".grid.two-col > .card").first().click();
    await page.waitForSelector(".lesson-row");
    await page.locator(".lesson-row").first().click();
    await page.waitForSelector("#source-content");
    assert.equal(await page.locator("#study-panel,#stage-nav,[data-mode]").count(),0,"removed lesson panels and modes");
    await page.locator("#plan-review").click();
    await page.locator("#mark-read").click();
    assert(await page.locator("#mark-read").textContent() !== "", "read completion controls");
    await page.waitForFunction(() => ["Notion Live","本機快照","載入失敗","尚無內容"].includes(document.getElementById("source-status")?.textContent), null, { timeout: 20000 });
    assert(["Notion Live","本機快照","載入失敗","尚無內容"].includes(await page.locator("#source-status").textContent()),"original source status resolved");
    await page.goto(base+"/v3/#/problems",{waitUntil:"domcontentloaded"});
    await page.waitForSelector(".unit-directory .unit-card");
    assert.equal(await page.locator(".unit-card").count(),13,"problem subjects match courses");
    await page.locator(".unit-card").filter({hasText:"08 Dynamic Programming"}).click();
    await page.waitForSelector(".problem-row button[data-attempt]");
    assert(await page.locator('.problem-level[data-level]').count()>0,"difficulty groups within subject");
    await page.locator("#problem-difficulty").selectOption("basic");
    assert.equal(await page.locator('.problem-level:not([data-level="basic"])').count(),0,"difficulty filter");
    await page.locator("#problem-difficulty").selectOption("");
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
    await page.waitForSelector("#roadmap-canvas");
    assert.equal(await page.locator("#roadmap-canvas > *").count(),0,"dependency map is blank");
    assert(!/啟航級|APCS|USACO/.test(await page.locator("#app").textContent()));
    await page.goto(base+"/v3/#/progress",{waitUntil:"domcontentloaded"});
    assert.match(await page.locator("#app h1").textContent(),/學習進度/);
    await page.locator("#export-progress").click();
    await page.setViewportSize({width:390,height:844});
    await page.goto(base+"/v3/#/dashboard",{waitUntil:"domcontentloaded"});
    const viewport=await page.evaluate(()=>({viewport:innerWidth,content:document.documentElement.scrollWidth}));
    assert(viewport.content <= viewport.viewport+12,"mobile dashboard should not overflow horizontally");
    await page.goto(base+"/v3/#/problems",{waitUntil:"domcontentloaded"});
    assert.equal(await page.locator(".unit-card").count(),13);
    const phone=await page.evaluate(()=>({viewport:innerWidth,content:document.documentElement.scrollWidth}));
    assert(phone.content<=phone.viewport+2,"mobile subject directory fits viewport");
    assert.deepEqual(errors,[],"browser page errors");
    console.log("Browser smoke passed: navigation, source fallback, removed panels, subject difficulty groups, attempts, reviews, blank roadmap, mobile layout");
  }finally{
    await browser.close();
    server.close();
  }
}
main().catch(error=>{console.error(error);server.close();process.exitCode=1;});

