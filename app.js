// ==========================================================================
// 台灣競程修練指南 (Taiwan CP Guide) - 核心交互邏輯
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

// 全域狀態管理器
const APP_STATE = {
    // 從 localStorage 載入已解決的習題 ID 列表
    solvedProblems: JSON.parse(localStorage.getItem("taiwan_cp_solved_problems")) || [],
    // 已研讀過的主題 ID 列表
    readTopics: JSON.parse(localStorage.getItem("taiwan_cp_read_topics")) || [],
    
    // 目前選取的分頁
    currentTab: "roadmap",
    // 學習地圖難度過濾器
    roadmapFilter: "all",
    // 是否隱藏已解決題目/通關主題
    hideSolvedProblems: false,
    
    // 目前選取的代碼模板
    activeTemplateId: "cpp-fast-io",
    // 模板庫搜尋字串
    templateSearchQuery: "",
    // 模板分類過濾器
    templateCategory: "all",
    
    // 計時器相關變數
    timerInterval: null,
    timerSecondsLeft: 1500, // 預設 25 分鐘
    timerRunning: false,
    timerOriginalSeconds: 1500,
    timerMode: "pomodoro", // pomodoro, practice, mock

    // 當前在 Modal 中開啟的主題 ID
    activeTopicId: null
};

// ==========================================================================
// 初始化應用程式
// ==========================================================================
function initApp() {
    // 1. 綁定分頁切換事件
    setupTabNavigation();
    
    // 2. 載入並渲染學習地圖 (Roadmap)
    renderRoadmap();
    setupRoadmapFilters();
    initHideSolvedToggle();
    
    // 3. 載入並渲染演算法模板庫 (Templates)
    renderTemplateSidebar();
    loadActiveTemplate();
    setupTemplateSearchAndFilters();
    
    // 4. 統計面板與進度條即時更新
    updateDashboardStats();
    
    // 5. 初始化工具箱 (Utilities)
    initTimer();
    initAPCSCalculator();
    
    // 6. 進度備份 / 匯出 / 匯入
    initProgressBackup();
    
    // 7. 註冊 PWA Service Worker (支援離線修練)
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker.register("sw.js")
                .then(reg => console.log("Service Worker 註冊成功，範圍: ", reg.scope))
                .catch(err => console.error("Service Worker 註冊失敗: ", err));
        });
    }

    // 7.5. 初始化 Modal 的個人筆記與選手討論版
    initModalNotesAndComments();
    
    // 8. 綁定 Modal 關閉事件
    const modalOverlay = document.getElementById("topic-modal-overlay");
    const modalCloseBtn = document.getElementById("modal-close-btn");
    
    modalCloseBtn.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    
    // 鍵盤 Esc 鍵關閉 Modal
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModal();
        }
    });
}

// ==========================================================================
// 分頁導航交互
// ==========================================================================
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const panels = document.querySelectorAll(".tab-content-panel");
    
    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetTab = btn.getAttribute("data-tab");
            
            // 變更按鈕樣式
            tabButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            // 切換區塊顯示
            panels.forEach(p => {
                p.classList.remove("active");
                if (p.getAttribute("id") === `${targetTab}-panel`) {
                    p.classList.add("active");
                }
            });
            
            APP_STATE.currentTab = targetTab;
        });
    });
}

// ==========================================================================
// Dashboard 數據即時統計
// ==========================================================================
function updateDashboardStats() {
    // 計算總主題與已讀數
    let totalTopics = 0;
    ROADMAP_DATA.forEach(lvl => totalTopics += lvl.topics.length);
    const readCount = APP_STATE.readTopics.length;
    
    // 計算總習題與已解決數
    let totalProblems = 0;
    ROADMAP_DATA.forEach(lvl => {
        lvl.topics.forEach(tp => {
            totalProblems += tp.problems.length;
        });
    });
    
    // 濾除不在數據庫中的已解決問題（安全防護）
    const validSolvedIds = [];
    ROADMAP_DATA.forEach(lvl => {
        lvl.topics.forEach(tp => {
            tp.problems.forEach(p => {
                if (APP_STATE.solvedProblems.includes(p.id)) {
                    validSolvedIds.push(p.id);
                }
            });
        });
    });
    const solvedCount = validSolvedIds.length;
    
    // 更新 DOM 數值
    document.getElementById("stat-read-text").innerText = `${readCount} / ${totalTopics}`;
    document.getElementById("stat-solved-text").innerText = `${solvedCount} / ${totalProblems}`;
    
    // 計算百分比與渲染進度條
    const readPercent = totalTopics > 0 ? Math.round((readCount / totalTopics) * 100) : 0;
    const solvedPercent = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;
    
    document.getElementById("stat-read-percent").innerText = `${readPercent}%`;
    document.getElementById("stat-solved-percent").innerText = `${solvedPercent}%`;
    
    document.getElementById("progress-read-fill").style.width = `${readPercent}%`;
    document.getElementById("progress-solved-fill").style.width = `${solvedPercent}%`;
}

// ==========================================================================
// 學習地圖 (Roadmap) 渲染與交互
// ==========================================================================
function renderRoadmap() {
    const roadmapContainer = document.getElementById("roadmap-container");
    roadmapContainer.innerHTML = ""; // 清空
    
    ROADMAP_DATA.forEach(level => {
        // 如果有難度篩選，不符合的直接跳過
        if (APP_STATE.roadmapFilter !== "all" && level.levelId !== APP_STATE.roadmapFilter) {
            return;
        }
        
        // 1. 建立難度區塊
        const levelBlock = document.createElement("section");
        levelBlock.className = "level-block";
        levelBlock.style.setProperty("--level-color", level.color);
        
        // 計算該難度等級底下的習題統計
        let lvlTotalProblems = 0;
        let lvlSolvedProblems = 0;
        
        level.topics.forEach(tp => {
            lvlTotalProblems += tp.problems.length;
            tp.problems.forEach(p => {
                if (APP_STATE.solvedProblems.includes(p.id)) {
                    lvlSolvedProblems++;
                }
            });
        });
        
        // 2. 渲染難度區塊頭部
        levelBlock.innerHTML = `
            <div class="level-header">
                <h2 class="level-title">${level.levelName}</h2>
                <div class="level-desc">${level.levelDesc}</div>
            </div>
            <div class="topics-grid" id="grid-${level.levelId}"></div>
        `;
        
        roadmapContainer.appendChild(levelBlock);
        const grid = document.getElementById(`grid-${level.levelId}`);
        
        // 3. 渲染該等級底下的主題卡片
        level.topics.forEach(topic => {
            // 計算此主題內部習題完成度
            const topicTotalProblems = topic.problems.length;
            const topicSolvedProblems = topic.problems.filter(p => APP_STATE.solvedProblems.includes(p.id)).length;
            const isCompleted = topicSolvedProblems === topicTotalProblems && topicTotalProblems > 0;
            
            // 如果啟用「隱藏已通關」，且該主題所有習題都已解決，則隱藏卡片
            if (APP_STATE.hideSolvedProblems && isCompleted) {
                return;
            }
            
            // 檢查前置依賴是否解鎖
            const isUnlocked = isTopicUnlocked(topic.id);
            
            const card = document.createElement("div");
            card.className = `topic-card ${!isUnlocked ? 'locked' : ''}`;
            card.style.setProperty("--level-color", level.color);
            
            // 是否主題已研讀 (當所有習題完成，或玩家打勾已讀)
            const isRead = APP_STATE.readTopics.includes(topic.id);
            
            let badgeHTML = "";
            if (!isUnlocked) {
                // 找出未完成的前置主題簡稱
                const unmetPrereqs = topic.prerequisites.filter(prereqId => {
                    let prereqTopic = null;
                    for (const lvl of ROADMAP_DATA) {
                        prereqTopic = lvl.topics.find(t => t.id === prereqId);
                        if (prereqTopic) break;
                    }
                    if (!prereqTopic) return false;
                    const totalSolved = prereqTopic.problems.filter(p => APP_STATE.solvedProblems.includes(p.id)).length;
                    const totalProbs = prereqTopic.problems.length;
                    const isCompleted = totalSolved === totalProbs && totalProbs > 0;
                    const isRead = APP_STATE.readTopics.includes(prereqId);
                    return !(isCompleted || isRead);
                }).map(prereqId => {
                    let prereqTopic = null;
                    for (const lvl of ROADMAP_DATA) {
                        prereqTopic = lvl.topics.find(t => t.id === prereqId);
                        if (prereqTopic) break;
                    }
                    return prereqTopic ? prereqTopic.title.split(' ')[0] : prereqId;
                });
                badgeHTML = `<span class="locked-badge">🔒 鎖定 (需先完成: ${unmetPrereqs.join(', ')})</span>`;
            } else {
                badgeHTML = `
                    <span class="topic-status-badge ${isCompleted ? 'completed' : ''}">
                        ${isCompleted ? '🔥 已通關' : '⏳ 研讀中'}
                    </span>
                `;
            }
            
            card.innerHTML = `
                <div class="topic-card-header">
                    <div class="topic-card-header-left">
                        <h3 class="topic-card-title">${topic.title}</h3>
                    </div>
                    ${badgeHTML}
                </div>
                <p class="topic-card-desc">${topic.desc}</p>
                <div class="topic-card-footer">
                    <div class="card-stat">
                        <span>📚 ${topic.resources.length} 篇講義</span>
                    </div>
                    <div class="card-stat">
                        <span>💻 習題: ${topicSolvedProblems}/${topicTotalProblems}</span>
                        <span class="card-arrow-icon">→</span>
                    </div>
                </div>
            `;
            
            // 點擊主題卡片，未解鎖時阻擋並顯示 Warning Toast，已解鎖時開啟 Detail Modal
            card.addEventListener("click", () => {
                if (!isTopicUnlocked(topic.id)) {
                    const unmetNames = topic.prerequisites.filter(prereqId => {
                        let prereqTopic = null;
                        for (const lvl of ROADMAP_DATA) {
                            prereqTopic = lvl.topics.find(t => t.id === prereqId);
                            if (prereqTopic) break;
                        }
                        if (!prereqTopic) return false;
                        const totalSolved = prereqTopic.problems.filter(p => APP_STATE.solvedProblems.includes(p.id)).length;
                        const totalProbs = prereqTopic.problems.length;
                        const isCompleted = totalSolved === totalProbs && totalProbs > 0;
                        const isRead = APP_STATE.readTopics.includes(prereqId);
                        return !(isCompleted || isRead);
                    }).map(prereqId => {
                        let prereqTopic = null;
                        for (const lvl of ROADMAP_DATA) {
                            prereqTopic = lvl.topics.find(t => t.id === prereqId);
                            if (prereqTopic) break;
                        }
                        return prereqTopic ? `「${prereqTopic.title}」` : prereqId;
                    });
                    showToast(`🔒 未解鎖！請先修讀並完成 ${unmetNames.join(' 與 ')} 的所有推薦習題！`);
                    return;
                }
                openTopicModal(topic, level);
            });
            grid.appendChild(card);
        });
    });
}

function setupRoadmapFilters() {
    const filterButtons = document.querySelectorAll("[data-level-filter]");
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            APP_STATE.roadmapFilter = btn.getAttribute("data-level-filter");
            renderRoadmap();
        });
    });
}

function initHideSolvedToggle() {
    const toggle = document.getElementById("hide-solved-toggle");
    if (!toggle) return;
    
    toggle.checked = APP_STATE.hideSolvedProblems;
    toggle.addEventListener("change", (e) => {
        APP_STATE.hideSolvedProblems = e.target.checked;
        renderRoadmap();
    });
}

// ==========================================================================
// 主題詳情 Modal 邏輯與練習題打勾
// ==========================================================================
function openTopicModal(topic, level) {
    const modalOverlay = document.getElementById("topic-modal-overlay");
    const badge = document.getElementById("modal-level-badge");
    const title = document.getElementById("modal-title");
    const desc = document.getElementById("modal-desc");
    
    // 設定當前選中的主題 ID
    APP_STATE.activeTopicId = topic.id;
    
    // 設定基礎資訊
    badge.innerText = level.levelName;
    badge.style.backgroundColor = level.color;
    badge.style.color = "#ffffff";
    title.innerText = topic.title;
    desc.innerText = topic.desc;
    
    // ✍️ GitHub 編輯按鈕連結
    const editBtn = document.getElementById("github-edit-btn");
    if (editBtn) {
        editBtn.href = `https://github.com/benjamin-shih-tw/taiwan-cp-guide/edit/dev/data/roadmap.js`;
    }
    
    // 重置個人筆記與討論區的 Tabs
    const tabBtns = document.querySelectorAll(".section-tab-btn");
    const tabContents = document.querySelectorAll(".section-tab-content");
    tabBtns.forEach(btn => {
        if (btn.getAttribute("data-sec-tab") === "notes") {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
    tabContents.forEach(content => {
        if (content.id === "sec-tab-notes") {
            content.classList.add("active");
        } else {
            content.classList.remove("active");
        }
    });
    
    // 預先填充個人學習筆記
    const savedNotes = localStorage.getItem(`taiwan_cp_notes_${topic.id}`) || "";
    const notesTextarea = document.getElementById("notes-textarea");
    if (notesTextarea) {
        notesTextarea.value = savedNotes;
    }
    const statusElement = document.getElementById("notes-save-status");
    if (statusElement) {
        statusElement.innerText = "💾 已儲存";
        statusElement.classList.remove("saving");
    }
    
    // 渲染學長姐置頂討論與留言清單
    renderComments(topic.id);
    
    // 渲染觀念教學 (如果存在)
    const tutorialSection = document.getElementById("modal-tutorial-section");
    const tutorialContainer = document.getElementById("modal-tutorial");
    if (topic.tutorial && topic.tutorial.trim() !== "") {
        tutorialContainer.innerHTML = topic.tutorial;
        tutorialSection.style.display = "block";
    } else {
        tutorialContainer.innerHTML = "";
        tutorialSection.style.display = "none";
    }
    
    // 渲染「推薦教材資源」清單
    const resourceContainer = document.getElementById("modal-resources");
    resourceContainer.innerHTML = "";
    
    topic.resources.forEach(res => {
        const typeIcon = res.type === "slide" ? "📊" : (res.type === "book" ? "📖" : "🌐");
        const resItem = document.createElement("a");
        resItem.className = "resource-item";
        resItem.href = res.url;
        resItem.target = "_blank";
        
        resItem.innerHTML = `
            <div class="resource-info">
                <span class="resource-type-icon">${typeIcon}</span>
                <span class="resource-name">${res.name}</span>
            </div>
            <span class="resource-link-icon">↗</span>
        `;
        resourceContainer.appendChild(resItem);
    });
    
    // 渲染「推薦練習題」清單
    const problemContainer = document.getElementById("modal-problems");
    problemContainer.innerHTML = "";
    
    topic.problems.forEach(prob => {
        const isSolved = APP_STATE.solvedProblems.includes(prob.id);
        
        // 如果啟用「隱藏已通關」，且該題目已解決，則不渲染該題目項目
        if (APP_STATE.hideSolvedProblems && isSolved) {
            return;
        }
        
        const probItem = document.createElement("div");
        probItem.className = `problem-item ${isSolved ? 'completed' : ''}`;
        probItem.id = `prob-item-${prob.id}`;
        
        // 根據難度產生標籤 class
        const diffClass = prob.difficulty.toLowerCase();
        
        probItem.innerHTML = `
            <label class="problem-check-wrapper">
                <input type="checkbox" id="chk-${prob.id}" ${isSolved ? 'checked' : ''}>
                <span class="custom-checkbox">✓</span>
                <div class="problem-details">
                    <span class="problem-title">${prob.name}</span>
                    <div class="problem-meta">
                        <span class="platform-tag">${prob.platform}</span>
                        <span>•</span>
                        <span class="diff-tag ${diffClass}">${prob.difficulty}</span>
                    </div>
                </div>
            </label>
            <div class="problem-links-group">
                ${prob.editorialUrl ? `<a href="${prob.editorialUrl}" target="_blank" class="editorial-link" title="閱讀繁中題解">📖 題解</a>` : ''}
                <a href="${prob.url}" target="_blank" class="problem-link" title="前往 OJ 刷題">🔗</a>
            </div>
        `;
        
        // 核取方塊點擊切換事件
        const checkbox = probItem.querySelector(`input[type="checkbox"]`);
        checkbox.addEventListener("change", (e) => {
            toggleProblemStatus(prob.id, topic.id, e.target.checked);
        });
        
        problemContainer.appendChild(probItem);
    });
    
    // 彈出顯示
    modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden"; // 防止背景捲動
    
    // KaTeX 數學公式自動渲染
    if (typeof renderMathInElement === "function") {
        renderMathInElement(modalOverlay, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false},
                {left: '\\(', right: '\\)', display: false},
                {left: '\\[', right: '\\[', display: true}
            ],
            throwOnError: false
        });
    }
}

function closeModal() {
    const modalOverlay = document.getElementById("topic-modal-overlay");
    modalOverlay.classList.remove("active");
    document.body.style.overflow = ""; // 恢復捲動
    
    APP_STATE.activeTopicId = null;
    
    // 關閉時重新渲染地圖以更新統計狀態與進度條
    renderRoadmap();
}

function toggleProblemStatus(problemId, topicId, isChecked) {
    if (isChecked) {
        // 加入已解決清單
        if (!APP_STATE.solvedProblems.includes(problemId)) {
            APP_STATE.solvedProblems.push(problemId);
        }
        document.getElementById(`prob-item-${problemId}`).classList.add("completed");
        showToast("🔥 太棒了！完成了這道競程挑戰！");
    } else {
        // 從已解決清單移除
        APP_STATE.solvedProblems = APP_STATE.solvedProblems.filter(id => id !== problemId);
        document.getElementById(`prob-item-${problemId}`).classList.remove("completed");
    }
    
    // 自動更新已讀狀態
    const currentTopic = ROADMAP_DATA.flatMap(lvl => lvl.topics).find(tp => tp.id === topicId);
    if (currentTopic) {
        const totalProbs = currentTopic.problems.length;
        const solvedProbs = currentTopic.problems.filter(p => APP_STATE.solvedProblems.includes(p.id)).length;
        
        if (solvedProbs === totalProbs && totalProbs > 0) {
            if (!APP_STATE.readTopics.includes(topicId)) {
                APP_STATE.readTopics.push(topicId);
            }
        } else {
            APP_STATE.readTopics = APP_STATE.readTopics.filter(id => id !== topicId);
        }
    }
    
    // 儲存狀態至 localStorage
    localStorage.setItem("taiwan_cp_solved_problems", JSON.stringify(APP_STATE.solvedProblems));
    localStorage.setItem("taiwan_cp_read_topics", JSON.stringify(APP_STATE.readTopics));
    
    // 即時更新 Dashboard 數值與進度條
    updateDashboardStats();
}

// ==========================================================================
// 演算法代碼模板庫 (Template Library) 渲染與交互
// ==========================================================================
function renderTemplateSidebar() {
    const sidebar = document.getElementById("template-menu");
    sidebar.innerHTML = "";
    
    const filteredTemplates = TEMPLATE_DATA.filter(temp => {
        // 1. 關鍵字搜尋過濾
        const matchSearch = temp.title.toLowerCase().includes(APP_STATE.templateSearchQuery.toLowerCase()) ||
                            temp.desc.toLowerCase().includes(APP_STATE.templateSearchQuery.toLowerCase()) ||
                            temp.id.toLowerCase().includes(APP_STATE.templateSearchQuery.toLowerCase());
        
        // 2. 分類過濾
        const matchCat = APP_STATE.templateCategory === "all" || temp.category === APP_STATE.templateCategory;
        
        return matchSearch && matchCat;
    });
    
    if (filteredTemplates.length === 0) {
        sidebar.innerHTML = `<div style="color: #64748b; font-size: 0.85rem; padding: 1rem; text-align: center;">找不到相符模板 🔍</div>`;
        return;
    }
    
    filteredTemplates.forEach(temp => {
        const btn = document.createElement("button");
        btn.className = `template-menu-item ${temp.id === APP_STATE.activeTemplateId ? 'active' : ''}`;
        btn.innerHTML = `
            <span>${temp.title.split(" (")[0]}</span>
            <span class="menu-item-cat">${temp.category.split(" ")[0]}</span>
        `;
        
        btn.addEventListener("click", () => {
            APP_STATE.activeTemplateId = temp.id;
            
            // 重新整理按鈕啟動狀態
            document.querySelectorAll(".template-menu-item").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            loadActiveTemplate();
        });
        
        sidebar.appendChild(btn);
    });
}

function loadActiveTemplate() {
    const temp = TEMPLATE_DATA.find(t => t.id === APP_STATE.activeTemplateId);
    if (!temp) return;
    
    document.getElementById("viewer-cat").innerText = temp.category;
    document.getElementById("viewer-title").innerText = temp.title;
    document.getElementById("viewer-desc").innerText = temp.desc;
    
    // 語法高亮轉換與載入
    const highlightedCode = highlightCppCode(temp.code);
    document.getElementById("code-display").innerHTML = highlightedCode;
    
    // 綁定複製按鈕功能
    const copyBtn = document.getElementById("code-copy-btn");
    copyBtn.innerHTML = `<span>📋 Copy</span>`;
    
    // 防止重複綁定 listener
    const newCopyBtn = copyBtn.cloneNode(true);
    copyBtn.parentNode.replaceChild(newCopyBtn, copyBtn);
    
    newCopyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(temp.code).then(() => {
            newCopyBtn.innerHTML = `<span>✅ Copied!</span>`;
            showToast("📋 C++ 模板代碼已複製到剪貼簿！");
            setTimeout(() => {
                newCopyBtn.innerHTML = `<span>📋 Copy</span>`;
            }, 2000);
        }).catch(err => {
            console.error("複製失敗: ", err);
        });
    });
}

function setupTemplateSearchAndFilters() {
    // 搜尋輸入監聽
    const searchInput = document.getElementById("template-search");
    searchInput.addEventListener("input", (e) => {
        APP_STATE.templateSearchQuery = e.target.value;
        renderTemplateSidebar();
    });
    
    // 分類選擇監聽
    const catButtons = document.querySelectorAll("[data-cat-filter]");
    catButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            catButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            APP_STATE.templateCategory = btn.getAttribute("data-cat-filter");
            renderTemplateSidebar();
        });
    });
}

// 離線 C++ 進階語法高亮引擎 (基於字詞掃描器 Tokenizer)
function highlightCppCode(code) {
    const rules = [
        { type: "cp-comment", regex: /^\/\/.*|^\/\*[\s\S]*?\*\// },
        { type: "cp-preprocessor", regex: /^#\w+/ },
        { type: "cp-string", regex: /^"([^"\\]|\\.)*"|^'([^'\\]|\\.)*'/ },
        { type: "cp-number", regex: /^\b0x[0-9a-fA-F]+\b|^\b\d+(\.\d+)?([eE][+-]?\d+)?\b/ },
        { type: "cp-keyword", regex: /^\b(using|namespace|struct|class|signed|main|return|for|if|else|while|break|continue|template|typedef|typename|inline|const|public|private|protected|virtual|friend|explicit|operator|new|delete)\b/ },
        { type: "cp-type", regex: /^\b(int|long|double|float|char|bool|void|vector|pair|queue|priority_queue|greater|set|map|unordered_set|unordered_map|stack|deque|string|auto)\b/ },
        { type: "cp-identifier", regex: /^[a-zA-Z_]\w*/ },
        { type: "cp-symbol", regex: /^[\+\-\*\/%=<>!&|~^:;,\.\?\{\}\[\]\(\)]/ },
        { type: "cp-whitespace", regex: /^\s+/ },
        { type: "cp-fallback", regex: /^./ }
    ];

    let html = "";
    let i = 0;
    while (i < code.length) {
        const sub = code.substring(i);
        let matched = false;
        for (const rule of rules) {
            const m = sub.match(rule.regex);
            if (m && m.index === 0) {
                const text = m[0];
                const escapedText = text
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt bridge;"); // wait, let's just do standard entities
                
                // Let's fix standard entities safely
                const cleanEscapedText = text
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;");

                if (rule.type === "cp-whitespace" || rule.type === "cp-fallback" || rule.type === "cp-identifier" || rule.type === "cp-symbol") {
                    html += cleanEscapedText;
                } else {
                    html += `<span class="${rule.type}">${cleanEscapedText}</span>`;
                }
                i += text.length;
                matched = true;
                break;
            }
        }
        if (!matched) {
            const char = code[i];
            html += char.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            i++;
        }
    }
    return html;
}


// ==========================================================================
// 競程工具箱：計時器功能 (Pomodoro & Mock Contest)
// ==========================================================================
function initTimer() {
    const clock = document.getElementById("timer-clock");
    const startBtn = document.getElementById("timer-start");
    const pauseBtn = document.getElementById("timer-pause");
    const resetBtn = document.getElementById("timer-reset");
    const modeButtons = document.querySelectorAll(".timer-mode-btn");
    
    // 計時器時間設定對照表
    const timerModesMap = {
        "pomodoro": 1500,  // 25 mins
        "practice": 5400,  // 90 mins (1.5h)
        "mock": 18000      // 300 mins (5h, NPSC/ICPC 經典規格)
    };
    
    // 更新時鐘顯示
    function updateClockDisplay() {
        const hrs = Math.floor(APP_STATE.timerSecondsLeft / 3600);
        const mins = Math.floor((APP_STATE.timerSecondsLeft % 3600) / 60);
        const secs = APP_STATE.timerSecondsLeft % 60;
        
        let displayStr = "";
        if (hrs > 0) {
            displayStr += `${hrs.toString().padStart(2, '0')}:`;
        }
        displayStr += `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        clock.innerText = displayStr;
        
        // 倒數警戒視覺效果 (剩餘時間不足 5% 時紅光閃爍)
        const threshold = Math.round(APP_STATE.timerOriginalSeconds * 0.05);
        if (APP_STATE.timerSecondsLeft <= threshold && APP_STATE.timerSecondsLeft > 0) {
            clock.classList.add("flashing");
        } else {
            clock.classList.remove("flashing");
        }
    }
    
    // 切換計時模式
    modeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            if (APP_STATE.timerRunning) {
                if (!confirm("計時正在進行中，確定要更換模式並重新計時嗎？")) return;
            }
            
            clearInterval(APP_STATE.timerInterval);
            APP_STATE.timerRunning = false;
            
            const mode = btn.getAttribute("data-mode");
            APP_STATE.timerMode = mode;
            APP_STATE.timerSecondsLeft = timerModesMap[mode];
            APP_STATE.timerOriginalSeconds = timerModesMap[mode];
            
            modeButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            // 重置控制鈕
            startBtn.style.display = "block";
            pauseBtn.style.display = "none";
            
            updateClockDisplay();
        });
    });
    
    // 開始計時
    startBtn.addEventListener("click", () => {
        if (APP_STATE.timerRunning) return;
        
        APP_STATE.timerRunning = true;
        startBtn.style.display = "none";
        pauseBtn.style.display = "block";
        
        APP_STATE.timerInterval = setInterval(() => {
            if (APP_STATE.timerSecondsLeft > 0) {
                APP_STATE.timerSecondsLeft--;
                updateClockDisplay();
            } else {
                // 計時終了
                clearInterval(APP_STATE.timerInterval);
                APP_STATE.timerRunning = false;
                startBtn.style.display = "block";
                pauseBtn.style.display = "none";
                clock.classList.remove("flashing");
                
                showToast("🔔 競程計時結束！辛苦了，快動動身體休息一下！");
                alert("⏰ 時間終了！請停止編寫代碼！");
            }
        }, 1000);
    });
    
    // 暫停計時
    pauseBtn.addEventListener("click", () => {
        clearInterval(APP_STATE.timerInterval);
        APP_STATE.timerRunning = false;
        startBtn.style.display = "block";
        pauseBtn.style.display = "none";
    });
    
    // 重置計時
    resetBtn.addEventListener("click", () => {
        clearInterval(APP_STATE.timerInterval);
        APP_STATE.timerRunning = false;
        
        APP_STATE.timerSecondsLeft = timerModesMap[APP_STATE.timerMode];
        
        startBtn.style.display = "block";
        pauseBtn.style.display = "none";
        
        updateClockDisplay();
    });
    
    // 初始顯示
    updateClockDisplay();
}

// ==========================================================================
// 競程工具箱：APCS 實作題級分模擬計算機
// ==========================================================================
function initAPCSCalculator() {
    const selects = document.querySelectorAll(".calc-select");
    const resultScore = document.getElementById("result-score");
    const resultLabel = document.getElementById("result-label");
    
    // APCS 級分標準對照表
    const gradingThresholds = [
        { minScore: 350, level: 5, label: "👑 頂尖級 (世界決賽/保送大學資工)" },
        { minScore: 250, level: 4, label: "🚀 高級 (APCS 申請熱門科系免筆試)" },
        { minScore: 140, level: 3, label: "✨ 中級 (資工系二階篩選安全門檻)" },
        { minScore: 40,  level: 2, label: "📚 初級 (具備扎實基礎解題能力)" },
        { minScore: 0,   level: 1, label: "🌱 基礎級 (程式設計初學者階段)" }
    ];
    
    function calculateAPCSLevel() {
        let totalScore = 0;
        
        // 累加 4 題的分數
        selects.forEach(select => {
            totalScore += parseInt(select.value);
        });
        
        // 匹配對應級分
        const grade = gradingThresholds.find(g => totalScore >= g.minScore);
        
        // 渲染結果，增加動態跳動數值視覺效果
        if (grade) {
            resultScore.innerText = grade.level;
            resultLabel.innerText = `${grade.label} (總分: ${totalScore}/400)`;
        }
    }
    
    // 監聽所有下拉選單變更
    selects.forEach(select => {
        select.addEventListener("change", calculateAPCSLevel);
    });
    
    // 初始試算
    calculateAPCSLevel();
}

// ==========================================================================
// 進度備份、匯出與匯入 (Backup, Export & Import)
// ==========================================================================
function initProgressBackup() {
    const exportBtn = document.getElementById("export-progress-btn");
    const importInput = document.getElementById("import-progress-input");
    
    if (!exportBtn || !importInput) return;
    
    // 匯出：將目前進度序列化為 JSON 並觸發下載
    exportBtn.addEventListener("click", () => {
        const exportData = {
            version: 1,
            exportedAt: new Date().toISOString(),
            solvedProblems: APP_STATE.solvedProblems,
            readTopics: APP_STATE.readTopics
        };
        
        const jsonStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        
        const anchor = document.createElement("a");
        const timestamp = new Date().toISOString().slice(0, 10);
        anchor.download = `taiwan_cp_progress_${timestamp}.json`;
        anchor.href = url;
        anchor.click();
        URL.revokeObjectURL(url);
        
        showToast(`📤 進度已匯出！已解決 ${APP_STATE.solvedProblems.length} 題。`);
    });
    
    // 匯入：讀取 JSON 備份並還原進度
    importInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const data = JSON.parse(evt.target.result);
                
                // 資料驗證
                if (!Array.isArray(data.solvedProblems) || !Array.isArray(data.readTopics)) {
                    throw new Error("格式錯誤：無效的備份格式");
                }
                
                // 寫入進度並持久化
                APP_STATE.solvedProblems = data.solvedProblems;
                APP_STATE.readTopics = data.readTopics;
                
                localStorage.setItem("taiwan_cp_solved_problems", JSON.stringify(APP_STATE.solvedProblems));
                localStorage.setItem("taiwan_cp_read_topics", JSON.stringify(APP_STATE.readTopics));
                
                // 重新渲染頁面
                renderRoadmap();
                updateDashboardStats();
                
                showToast(`📥 進度匯入成功！已還原 ${data.solvedProblems.length} 道已解題目的紀錄。`);
            } catch (err) {
                showToast(`❌ 匯入失敗：${err.message}`);
            }
            // 重置 input 以允許重複匯入同一檔案
            importInput.value = "";
        };
        reader.readAsText(file);
    });
}

// ==========================================================================
// 輔助工具：Toast 輕量訊息提示
// ==========================================================================
function showToast(message) {
    const toast = document.getElementById("toast-msg");
    document.getElementById("toast-text").innerText = message;
    
    toast.classList.add("show");
    
    // 3 秒後自動隱藏
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// ==========================================================================
// 前置依賴解鎖判斷 (Prerequisites Unlock Check)
// ==========================================================================
function isTopicUnlocked(topicId) {
    // 找出目標主題資料
    let topic = null;
    for (const lvl of ROADMAP_DATA) {
        topic = lvl.topics.find(t => t.id === topicId);
        if (topic) break;
    }
    
    // 若找不到主題，或者沒有設定前置依賴，則直接解鎖
    if (!topic || !topic.prerequisites || topic.prerequisites.length === 0) {
        return true;
    }
    
    // 逐一檢查每個前置依賴是否已完成或已研讀
    return topic.prerequisites.every(prereqId => {
        // 已標記研讀 → 解鎖
        if (APP_STATE.readTopics.includes(prereqId)) return true;
        
        // 所有推薦習題都已解決 → 解鎖
        let prereqTopic = null;
        for (const lvl of ROADMAP_DATA) {
            prereqTopic = lvl.topics.find(t => t.id === prereqId);
            if (prereqTopic) break;
        }
        if (!prereqTopic) return false;
        
        const total = prereqTopic.problems.length;
        if (total === 0) return true;
        const solved = prereqTopic.problems.filter(p => APP_STATE.solvedProblems.includes(p.id)).length;
        return solved === total;
    });
}

// ==========================================================================
// 學長姐置頂 Tips 資料庫 (Pinned Expert Comments)
// ==========================================================================
const PINNED_COMMENTS = {
    "time-complexity": [
        {
            author: "Max 學長 (TOI 金牌 2023)",
            badge: "admin",
            text: "🏆 競程金科玉律：寫每道題之前，先問自己「N 是多少？」。N ≤ 2e5 用 O(N log N)，N ≤ 5000 才考慮 O(N²)，N ≤ 20 才考慮 O(2^N)。把這張表背起來，90% 的 TLE 都能提前避免！",
            time: "置頂"
        }
    ],
    "simulation": [
        {
            author: "Winnie 學姐 (APCS 5級)",
            badge: "admin",
            text: "💡 模擬題最常見的 Bug 來源：邊界條件！請養成寫完後立刻想「N=1 怎麼辦？N 是最大值怎麼辦？」的習慣，並測試這些邊界案例。",
            time: "置頂"
        }
    ],
    "complete-rec": [
        {
            author: "Eric 學長 (TOI 複選選手)",
            badge: "admin",
            text: "🌳 遞迴題一定要畫「遞迴樹」！先在紙上模擬 N=3 或 N=4 的情況，確認樹的結構正確了再寫程式碼。遞迴的 Base Case 就是樹的葉子節點，絕對不能搞錯！",
            time: "置頂"
        }
    ],
    "prefix-sums": [
        {
            author: "Cathy 學姐 (IOI 台灣選手)",
            badge: "admin",
            text: "⚠️ 請永遠用 1-indexed 的前綴和！宣告 pref[0] = 0，這樣查詢 [L, R] 就是 pref[R] - pref[L-1]，完全不需要特判 L=0 的邊界情況，Bug 少一半！另外，當 N 很大時記得用 long long 避免溢位。",
            time: "置頂"
        }
    ],
    "two-pointers": [
        {
            author: "Alex 學長 (Codeforces 2100 Rating)",
            badge: "admin",
            text: "🚨 陷阱警告：滑動視窗只適用於陣列中所有元素都是非負整數的情況！如果元素可以是負數，擴大視窗不一定讓和變大，「單調性」消失，此時必須改用前綴和搭配 std::map 的方法。",
            time: "置頂"
        }
    ],
    "binary-search": [
        {
            author: "Peter 學長 (TOI 初選滿分)",
            badge: "admin",
            text: "🎯「對答案二分搜」是難度飛躍的關鍵技巧！當你發現問題可以改成「驗證：答案是否 ≥ x？」的形式，就能二分搜答案。Check 函數的複雜度 × log(答案範圍) 就是總複雜度。",
            time: "置頂"
        }
    ],
    "graph-traversal": [
        {
            author: "Linda 學姐 (ICPC 參賽選手)",
            badge: "admin",
            text: "📌 BFS vs DFS 選擇秘訣：求最短路徑（無權圖）→ BFS；求連通塊、DFS 序、路徑本身 → DFS。BFS 的 visited 標記必須在「加入 queue 的時候」就標記，而不是「從 queue 取出時」，否則會重複處理節點！",
            time: "置頂"
        }
    ],
    "basic-dp": [
        {
            author: "Tom 學長 (APCS 5級，台大資工)",
            badge: "admin",
            text: "💡 DP 解題四步驟：(1) 定義 dp[i] 的意義（用中文寫清楚！）；(2) 找出狀態轉移方程式；(3) 確認初始值；(4) 確認計算順序（通常是由小到大）。背包問題是 DP 入門最重要的原型，務必搞懂！",
            time: "置頂"
        }
    ],
    "dsu": [
        {
            author: "Grace 學姐 (TOI 金牌 2024)",
            badge: "admin",
            text: "🔗 DSU 的兩個優化「路徑壓縮」+「秩合併」缺一不可！只有路徑壓縮是 O(log N) 均攤，只有秩合併也是 O(log N)，兩者同時使用才能達到接近 O(1) 的 Ackermann 函數均攤複雜度。",
            time: "置頂"
        }
    ],
    "mst": [
        {
            author: "Kevin 學長 (ICPC 亞洲賽金牌)",
            badge: "admin",
            text: "🌐 Kruskal vs Prim 選擇：稀疏圖（邊少，E ≈ V）用 Kruskal + DSU，O(E log E)；稠密圖（邊多，E ≈ V²）用 Prim + priority_queue，O(E log V)。競程最常見的是稀疏圖，所以 Kruskal 更常用。",
            time: "置頂"
        }
    ]
};

// 渲染學長姐置頂 Tips 與用戶自行發布留言
function renderComments(topicId) {
    const commentList = document.getElementById("modal-comments-list");
    if (!commentList) return;
    
    commentList.innerHTML = "";
    
    // --- 1. 渲染置頂學長姐 Tips ---
    const pinnedTips = PINNED_COMMENTS[topicId] || [];
    pinnedTips.forEach(tip => {
        const item = document.createElement("div");
        item.className = "comment-item pinned";
        item.innerHTML = `
            <div class="comment-header">
                <div class="comment-author-info">
                    <span class="comment-author">📌 ${tip.author}</span>
                    <span class="comment-badge admin">學長姐 Tips</span>
                </div>
                <span class="comment-time">${tip.time}</span>
            </div>
            <div class="comment-body">${tip.text}</div>
        `;
        commentList.appendChild(item);
    });
    
    // 若無置頂 Tips，顯示引導
    if (pinnedTips.length === 0) {
        const empty = document.createElement("div");
        empty.className = "comment-item pinned";
        empty.innerHTML = `
            <div class="comment-header">
                <div class="comment-author-info">
                    <span class="comment-author">📌 台灣CP指南</span>
                    <span class="comment-badge admin">公告</span>
                </div>
                <span class="comment-time">置頂</span>
            </div>
            <div class="comment-body">💡 歡迎各位在下方分享你的學習心得、解題思路，或提出卡關的問題！你的分享能幫助更多台灣的競程人！</div>
        `;
        commentList.appendChild(empty);
    }
    
    // --- 2. 渲染本地儲存的用戶留言 ---
    const userComments = JSON.parse(localStorage.getItem(`taiwan_cp_comments_${topicId}`)) || [];
    userComments.forEach(comment => {
        const item = document.createElement("div");
        item.className = "comment-item";
        item.innerHTML = `
            <div class="comment-header">
                <div class="comment-author-info">
                    <span class="comment-author">🙋 ${comment.author}</span>
                    <span class="comment-badge user">選手</span>
                </div>
                <span class="comment-time">${comment.time}</span>
            </div>
            <div class="comment-body">${comment.text}</div>
        `;
        commentList.appendChild(item);
    });
}

// ==========================================================================
// Modal 個人筆記與選手討論區 (Notes Autosave & Comment Board)
// ==========================================================================
function initModalNotesAndComments() {
    let notesDebounceTimer = null;
    
    // --- 1. Tab 切換邏輯 ---
    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".section-tab-btn");
        if (!btn) return;
        
        const targetTab = btn.getAttribute("data-sec-tab");
        if (!targetTab) return;
        
        // 切換 active 狀態
        document.querySelectorAll(".section-tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".section-tab-content").forEach(c => c.classList.remove("active"));
        
        btn.classList.add("active");
        const targetContent = document.getElementById(`sec-tab-${targetTab}`);
        if (targetContent) targetContent.classList.add("active");
        
        // 切換到討論區時重新渲染留言
        if (targetTab === "comments" && APP_STATE.activeTopicId) {
            renderComments(APP_STATE.activeTopicId);
        }
    });
    
    // --- 2. 個人筆記 Debounce 自動存檔 (800ms) ---
    const notesTextarea = document.getElementById("notes-textarea");
    const saveStatus = document.getElementById("notes-save-status");
    
    if (notesTextarea && saveStatus) {
        notesTextarea.addEventListener("input", () => {
            if (!APP_STATE.activeTopicId) return;
            
            // 顯示「存檔中...」狀態
            saveStatus.innerText = "⏳ 存檔中...";
            saveStatus.classList.add("saving");
            
            // 清除舊的計時器，設定新的 debounce 計時器
            clearTimeout(notesDebounceTimer);
            notesDebounceTimer = setTimeout(() => {
                const content = notesTextarea.value;
                localStorage.setItem(`taiwan_cp_notes_${APP_STATE.activeTopicId}`, content);
                
                saveStatus.innerText = "💾 已儲存";
                saveStatus.classList.remove("saving");
            }, 800);
        });
    }
    
    // --- 3. 留言發布邏輯 ---
    const commentForm = document.getElementById("comment-form");
    const commentInput = document.getElementById("comment-input");
    
    if (commentForm && commentInput) {
        commentForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            if (!APP_STATE.activeTopicId) return;
            
            const text = commentInput.value.trim();
            if (!text) return;
            
            // 建立留言物件
            const now = new Date();
            const timeStr = `${now.getFullYear()}/${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
            const newComment = {
                author: "我",
                text: text,
                time: timeStr
            };
            
            // 存入 LocalStorage
            const key = `taiwan_cp_comments_${APP_STATE.activeTopicId}`;
            const existing = JSON.parse(localStorage.getItem(key)) || [];
            existing.push(newComment);
            localStorage.setItem(key, JSON.stringify(existing));
            
            // 清空輸入框並重新渲染
            commentInput.value = "";
            renderComments(APP_STATE.activeTopicId);
            
            // 顯示成功 Toast
            showToast("💬 留言發布成功！已儲存到本地。");
            
            // 自動捲動到最新留言
            const commentList = document.getElementById("modal-comments-list");
            if (commentList) {
                setTimeout(() => { commentList.scrollTop = commentList.scrollHeight; }, 50);
            }
        });
    }
}
