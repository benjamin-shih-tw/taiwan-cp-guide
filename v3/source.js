(() => {
  "use strict";
  const API = "https://benjaminshih.vercel.app/api/coding-course";
  let rendererPromise, markdownPromise;
  function loadScript(src) {
    return new Promise((resolve,reject)=>{
      const script=document.createElement("script");
      const timeout=setTimeout(()=>{script.remove();reject(new Error("Script load timed out"));},8000);
      script.src=src;
      script.onload=()=>{clearTimeout(timeout);resolve();};
      script.onerror=()=>{clearTimeout(timeout);script.remove();reject(new Error("Script load failed"));};
      document.head.appendChild(script);
    });
  }
  function readyMarkdown() {
    if(markdownPromise)return markdownPromise;
    markdownPromise=(async()=>{
      if(!window.marked?.parse)await loadScript("https://cdn.jsdelivr.net/npm/marked@15.0.12/lib/marked.umd.js");
      if(!window.renderMathInElement){
        if(!document.querySelector('link[data-v3-math]')){
          const link=document.createElement("link");link.rel="stylesheet";
          link.href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css";
          link.dataset.v3Math="1";document.head.appendChild(link);
        }
        if(!window.katex)await loadScript("https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js");
        await loadScript("https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js");
      }
    })().catch(error=>{markdownPromise=null;console.warn("[v3] snapshot formatting unavailable",error);});
    return markdownPromise;
  }
  let current = null;
  const cache = new Map();
  function ready() {
    if (window.NotionXBridge?.render) return Promise.resolve();
    if (rendererPromise) return rendererPromise;
    rendererPromise = new Promise((resolve, reject) => {
      if (!document.querySelector('link[data-v3-notion]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "../v2/notion-renderer.css";
        link.dataset.v3Notion = "1";
        document.head.appendChild(link);
      }
      loadScript("../v2/notion-renderer.js").then(()=>window.NotionXBridge?.render ? resolve() : reject(new Error("Notion bridge missing")),reject);
    }).catch(error => { rendererPromise = null; throw error; });
    return rendererPromise;
  }
  function cleanup() {
    if (!current) return;
    current.controller.abort();
    if (window.NotionXBridge?.unmount) window.NotionXBridge.unmount(current.host);
    current = null;
  }
  async function localMarkdown(host, source, handle) {
    await readyMarkdown();
    if(current!==handle)return;
    const markdown = String(source || "");
    host.className = "markdown-body v3-markdown";
    if (window.marked?.parse) {
      window.marked.setOptions({ gfm: true });
      host.innerHTML = window.marked.parse(markdown);
      mirrorExpiredImages(host);
      // The Markdown comes from the project's own frozen Notion snapshots.
      // Do not rewrite the source. Embedded links remain normal hyperlinks.
      if (window.renderMathInElement) {
        try {
          window.renderMathInElement(host, { delimiters: [
            {left:"$$",right:"$$",display:true}, {left:"\\[",right:"\\]",display:true},
            {left:"\\(",right:"\\)",display:false}, {left:"$",right:"$",display:false}
          ], ignoredTags:["script","noscript","style","textarea","pre","code"], throwOnError:false });
        } catch (_) {}
      }
    } else {
      const pre = document.createElement("pre");
      pre.textContent = markdown;
      host.replaceChildren(pre);
    }
  }
  function mirrorExpiredImages(host) {
    const mirror = window.NOTION_IMAGE_MIRROR || {};
    host.querySelectorAll("img[src]").forEach(img => {
      try {
        const source = new URL(img.getAttribute("src"), location.href);
        img.loading = "lazy";
        if (!source.hostname.startsWith("prod-files-secure.s3.")) return;
        const imageId = source.pathname.match(/\/[0-9a-f-]{36}\/([0-9a-f-]{36})\/[^/]+$/i)?.[1]?.toLowerCase();
        const local = mirror[imageId];
        if (local) img.src = new URL("../v2/" + local, location.href).href;
      } catch (_) {}
      img.loading = "lazy";
    });
  }
  function headings(host) {
    return Array.from(host.querySelectorAll("h1,h2,h3,.notion-h1,.notion-h2,.notion-h3"))
      .filter(n => n.textContent?.trim())
      .map((el, index) => {
        if (!el.id) el.id = "source-heading-" + index;
        return { id: el.id, title: el.textContent.trim().slice(0,160) };
      });
  }
  async function render(lesson, host, callbacks = {}) {
    cleanup();
    const controller = new AbortController();
    const handle = { controller, host };
    current = handle;
    host.className = "notion-live-host";
    host.innerHTML = '<p class="muted" role="status">正在載入原始教材…</p>';
    const emit = (kind, detail) => {
      if (current !== handle) return;
      callbacks.onStatus?.(kind, detail);
      if (kind === "ready") callbacks.onHeadings?.(headings(host));
    };
    try {
      // The API and renderer are independent: start both immediately.
      const payloadPromise=(async()=>{
        const saved=cache.get(lesson.id);
        if(saved)return saved;
        const timeout=setTimeout(()=>controller.abort(),12000);
        try{
          const response=await fetch(API+"/page/"+encodeURIComponent(lesson.id),{signal:controller.signal,cache:"default"});
          if(!response.ok)throw new Error("Notion API "+response.status);
          const data=await response.json();
          if(!data.blockMap?.block)throw new Error("Notion returned no block map");
          cache.set(lesson.id,data);
          if(cache.size>16)cache.delete(cache.keys().next().value);
          return data;
        }finally{clearTimeout(timeout);}
      })();
      const [payload]=await Promise.all([payloadPromise,ready()]);
      if (controller.signal.aborted || current !== handle) return;
      if (payload.hasContent === false) {
        host.innerHTML = '<div class="empty">Notion 此頁目前沒有教材內文。</div>';
        emit("empty"); return;
      }
      host.replaceChildren();
      host.className = "notion-live-host";
      const ok = window.NotionXBridge.render(host, payload.blockMap, {
        onReady: () => requestAnimationFrame(() => emit("ready", "live")),
        onError: error => {
          if (current !== handle) return;
          console.warn("[v3] React Notion renderer failed; switching to snapshot", error);
          setTimeout(async () => {
            if (current !== handle) return;
            window.NotionXBridge?.unmount(host);
            if (lesson.fallback?.trim()) {
              await localMarkdown(host, lesson.fallback, handle);
              emit("ready", "snapshot");
            } else {
              host.innerHTML = '<div class="empty">教材渲染失敗，請開啟原始 Notion 連結。</div>';
              emit("error", "renderer");
            }
          }, 0);
        }
      });
      if (!ok) throw new Error("Notion renderer rejected the page");
    } catch (error) {
      if (current !== handle) return;
      console.warn("[v3] live Notion content failed", lesson.id, error);
      if (lesson.fallback?.trim()) {
        await localMarkdown(host, lesson.fallback, handle);
        emit("ready", "snapshot");
      } else {
        host.innerHTML = '<div class="empty">目前無法取得教材。請使用原始 Notion 或 v2 連結閱讀；教材沒有遺失或被改寫。</div>';
        emit("error", String(error.message || error));
      }
    }
  }
  function jump(id) {
    if (!current) return;
    const host = current.host;
    const target = Array.from(host.querySelectorAll("[id]")).find(n => n.id === id);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  window.V3Source = Object.freeze({ render, cleanup, jump, headings });
})();
