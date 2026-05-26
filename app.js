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
    // 各單元學習狀態標籤 mapping (topicId -> status)
    topicStatus: JSON.parse(localStorage.getItem("taiwan_cp_topic_status")) || {},
    
    // 目前選取的分頁
    currentTab: "roadmap",
    // 學習地圖難度過濾器
    roadmapFilter: "all",
    // 是否隱藏已解決題目/通關主題
    hideSolvedProblems: false,
    
    // 目前選取的代碼模板
    activeTemplateId: "cpp-fast-io",
    // 目前選取的模板程式語言 (cpp, java, py)
    activeTemplateLang: "cpp",
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
    // 0. 融入 APCS 考綱與關卡設計，初始化學習進度狀態
    enrichRoadmapWithAPCS();
    initTopicStatuses();

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

    // 7.5. 初始化 Modal 的個人筆記與選手討論版，以及狀態切換按鈕事件
    initModalNotesAndComments();
    setupStatusPillListeners();

    // 7.8. 初始化 AI 教練系統
    initCoachSystem();
    
    // 7.9. 初始化競賽檢定專區
    initContestSystem();
    
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
    
    // 9. 載入先前儲存的 Codeforces handle 並綁定同步按鈕事件
    const savedHandle = localStorage.getItem("cf_handle");
    if (savedHandle) {
        const handleInput = document.getElementById("cf-handle-input");
        if (handleInput) handleInput.value = savedHandle;
        const syncStatus = document.getElementById("cf-sync-status");
        if (syncStatus) syncStatus.innerText = `上次同步帳號: ${savedHandle}`;
    }
    
    const syncBtn = document.getElementById("cf-sync-btn");
    if (syncBtn) {
        syncBtn.addEventListener("click", () => {
            const handleInput = document.getElementById("cf-handle-input");
            const handle = handleInput ? handleInput.value.trim() : "";
            syncCodeforcesProgress(handle);
        });
    }
    
    // 7.10. 初始化講義程式碼切換 Tabs 事件 (對齊 USACO Guide)
    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".tutorial-code-tab-btn");
        if (!btn) return;
        
        const container = btn.closest(".tutorial-code-tabs");
        if (!container) return;
        
        const tabIdx = btn.getAttribute("data-tab-idx");
        
        // 切換按鈕 active
        container.querySelectorAll(".tutorial-code-tab-btn").forEach(b => {
            b.classList.toggle("active", b === btn);
        });
        
        // 切換內容 active
        container.querySelectorAll(".tutorial-code-tab-content").forEach(c => {
            c.classList.toggle("active", c.getAttribute("data-tab-idx") === tabIdx);
        });
    });

    // 9.5. 初始化用戶端登入登出狀態管理
    initUserAuthentication();
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

    // 自動背景同步到 Supabase 雲端
    if (typeof syncProgressToCloud === "function") {
        syncProgressToCloud();
    }
}

// ==========================================================================
// 學習地圖 (Roadmap) 渲染與交互
// ==========================================================================
function renderRoadmap() {
    const roadmapContainer = document.getElementById("roadmap-container");
    if (!roadmapContainer) return;
    roadmapContainer.innerHTML = ""; // 清空
    
    ROADMAP_DATA.forEach(level => {
        // 如果有難度篩選，不符合的直接跳過
        if (APP_STATE.roadmapFilter !== "all" && level.levelId !== APP_STATE.roadmapFilter) {
            return;
        }
        
        // 計算該難度等級底下的習題與主題統計
        let lvlTotalProblems = 0;
        let lvlSolvedProblems = 0;
        let lvlSolvedTopics = 0;
        const totalLvlTopics = level.topics.length;
        
        level.topics.forEach(tp => {
            const topicTotalProblems = tp.problems.length;
            const topicSolvedProblems = tp.problems.filter(p => APP_STATE.solvedProblems.includes(p.id)).length;
            lvlTotalProblems += topicTotalProblems;
            lvlSolvedProblems += topicSolvedProblems;
            
            const status = APP_STATE.topicStatus[tp.id] || "not-started";
            if (status === "mastered" || status === "proficient") {
                lvlSolvedTopics++;
            }
        });
        
        // 1. 建立 USACO Guide 雙欄式區塊 (左側單元概要，中間時間軸線，右側順序列節點)
        const usacoLevelBlock = document.createElement("div");
        usacoLevelBlock.className = "usaco-level-block";
        usacoLevelBlock.style.setProperty("--level-color", level.color);
        
        // 左側：單元總覽
        const leftSummary = `
            <div class="usaco-level-left">
                <h2 class="usaco-level-title">${level.levelName.split(' (')[0]}</h2>
                <div class="usaco-level-progress-wrapper">
                    <div class="usaco-level-progress-bar">
                        <div class="usaco-level-progress-fill" style="width: ${totalLvlTopics > 0 ? (lvlSolvedTopics / totalLvlTopics * 100) : 0}%"></div>
                    </div>
                    <span class="usaco-level-progress-text">${lvlSolvedTopics}/${totalLvlTopics}</span>
                </div>
                <p class="usaco-level-desc">${level.levelDesc}</p>
            </div>
        `;
        
        // 右側：垂直時間線與節點清單
        let nodesHTML = "";
        level.topics.forEach(topic => {
            const topicTotalProblems = topic.problems.length;
            const topicSolvedProblems = topic.problems.filter(p => APP_STATE.solvedProblems.includes(p.id)).length;
            const isCompleted = topicSolvedProblems === topicTotalProblems && topicTotalProblems > 0;
            
            // 如果啟用「隱藏已通關」，且該主題所有習題都已解決，則隱藏卡片
            if (APP_STATE.hideSolvedProblems && isCompleted) {
                return;
            }
            
            const isUnlocked = isTopicUnlocked(topic.id);
            const status = APP_STATE.topicStatus[topic.id] || "not-started";
            
            let statusDotClass = "not-started";
            if (!isUnlocked) statusDotClass = "locked";
            else if (status === "learning") statusDotClass = "learning";
            else if (status === "mastered") statusDotClass = "mastered";
            else if (status === "proficient") statusDotClass = "proficient";
            
            let badgeHTML = "";
            if (!isUnlocked) {
                const unmetPrereqs = topic.prerequisites.filter(prereqId => {
                    const prereqStatus = APP_STATE.topicStatus[prereqId];
                    return !(prereqStatus === "mastered" || prereqStatus === "proficient");
                }).map(prereqId => {
                    let prereqTopic = null;
                    for (const lvl of ROADMAP_DATA) {
                        prereqTopic = lvl.topics.find(t => t.id === prereqId);
                        if (prereqTopic) break;
                    }
                    return prereqTopic ? prereqTopic.title.split(' ')[0].replace(/[（(].*[）)]/, '') : prereqId;
                });
                badgeHTML = `<span class="usaco-node-locked-badge">🔒 需先掌握: ${unmetPrereqs.join(', ')}</span>`;
            } else {
                badgeHTML = `<span class="usaco-node-apcs-badge">🎯 APCS ${topic.apcsWeight ? topic.apcsWeight.split(' ')[0] : '★★★☆☆'}</span>`;
            }
            
            nodesHTML += `
                <div class="usaco-node-item ${!isUnlocked ? 'locked' : ''} status-${status}" data-topic-id="${topic.id}">
                    <!-- 中間時間軸節點小圓點 -->
                    <div class="usaco-node-timeline-point ${statusDotClass}">
                        <div class="usaco-point-inner"></div>
                    </div>
                    
                    <!-- 右側節點內容主體 -->
                    <div class="usaco-node-content-card">
                        <div class="usaco-node-header">
                            <h3 class="usaco-node-title">${topic.title}</h3>
                            <div class="usaco-node-badges-group">
                                ${badgeHTML}
                            </div>
                        </div>
                        <p class="usaco-node-desc">${topic.desc}</p>
                        <div class="usaco-node-footer">
                            <span class="usaco-node-stat">📚 ${topic.resources.length} 篇講義</span>
                            <span class="usaco-node-stat">💻 習題: ${topicSolvedProblems}/${topicTotalProblems}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        usacoLevelBlock.innerHTML = `
            ${leftSummary}
            <div class="usaco-level-right-timeline">
                <div class="usaco-timeline-line"></div>
                <div class="usaco-nodes-container">
                    ${nodesHTML}
                </div>
            </div>
        `;
        
        // 點擊事件綁定
        level.topics.forEach(topic => {
            const nodeEl = usacoLevelBlock.querySelector(`[data-topic-id="${topic.id}"]`);
            if (nodeEl) {
                nodeEl.addEventListener("click", () => {
                    if (!isTopicUnlocked(topic.id)) {
                        const unmetNames = topic.prerequisites.filter(prereqId => {
                            const prereqStatus = APP_STATE.topicStatus[prereqId];
                            return !(prereqStatus === "mastered" || prereqStatus === "proficient");
                        }).map(prereqId => {
                            let prereqTopic = null;
                            for (const lvl of ROADMAP_DATA) {
                                prereqTopic = lvl.topics.find(t => t.id === prereqId);
                                if (prereqTopic) break;
                            }
                            return prereqTopic ? `「${prereqTopic.title}」` : prereqId;
                        });
                        showToast(`🔒 未解鎖！請先將前置單元 ${unmetNames.join(' 與 ')} 研讀並提升狀態至【已掌握】以上！`);
                        return;
                    }
                    openTopicModal(topic, level);
                });
            }
        });
        
        roadmapContainer.appendChild(usacoLevelBlock);
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
    
    // 🛡️ 容錯與安全配對機制：若未傳入 level，自動從 ROADMAP_DATA 中尋找對應難度級別
    if (!level && typeof ROADMAP_DATA !== "undefined") {
        for (let i = 0; i < ROADMAP_DATA.length; i++) {
            const lvl = ROADMAP_DATA[i];
            if (lvl.topics.some(t => t.id === topic.id)) {
                level = lvl;
                break;
            }
        }
    }
    
    // 設定基礎資訊
    if (level) {
        badge.innerText = level.levelName;
        badge.style.backgroundColor = level.color;
        badge.style.color = "#ffffff";
        badge.style.display = "inline-block";
    } else {
        badge.innerText = "競程修練";
        badge.style.backgroundColor = "var(--color-accent)";
        badge.style.color = "#ffffff";
        badge.style.display = "inline-block";
    }
    title.innerText = topic.title;
    desc.innerText = topic.desc;
    
    // 渲染 APCS 考點與破關目標
    const apcsContainer = document.getElementById("modal-apcs-alert-container");
    if (apcsContainer) {
        if (topic.apcsWeight) {
            apcsContainer.innerHTML = `
                <div class="modal-apcs-alert">
                    <div class="modal-apcs-alert-header">
                        <span>🎯 APCS 考點分析 (評級: ${topic.apcsWeight})</span>
                    </div>
                    <div class="modal-apcs-alert-body">
                        <strong>考點重點：</strong>${topic.apcsFocus}
                    </div>
                    <div class="modal-apcs-alert-goal">
                        🏆 <strong>破關狀態目標：</strong>${topic.stageGoal}
                    </div>
                </div>
            `;
            apcsContainer.style.display = "block";
        } else {
            apcsContainer.innerHTML = "";
            apcsContainer.style.display = "none";
        }
    }
    
    // 更新學習進度 Pill 選取狀態
    const currentStatus = APP_STATE.topicStatus[topic.id] || "not-started";
    const statusPillBtns = document.querySelectorAll(".status-pill-btn");
    statusPillBtns.forEach(btn => {
        if (btn.getAttribute("data-status") === currentStatus) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
    
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
    
    // 渲染觀念教學 (動態載入與本土化翻譯)
    const btnLocal = document.getElementById("btn-source-local");
    const btnOiWiki = document.getElementById("btn-source-oiwiki");
    
    if (btnLocal && btnOiWiki) {
        const newBtnLocal = btnLocal.cloneNode(true);
        const newBtnOiWiki = btnOiWiki.cloneNode(true);
        btnLocal.parentNode.replaceChild(newBtnLocal, btnLocal);
        btnOiWiki.parentNode.replaceChild(newBtnOiWiki, btnOiWiki);
        
        newBtnLocal.addEventListener("click", () => {
            loadTutorialContent(topic, "local");
        });
        newBtnOiWiki.addEventListener("click", () => {
            loadTutorialContent(topic, "oiwiki");
        });
    }
    loadTutorialContent(topic, "local");
    
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
        const probEl = document.getElementById(`prob-item-${problemId}`);
        if (probEl) probEl.classList.add("completed");
        showToast("🔥 太棒了！完成了這道競程挑戰！");
    } else {
        // 從已解決清單移除
        APP_STATE.solvedProblems = APP_STATE.solvedProblems.filter(id => id !== problemId);
        const probEl = document.getElementById(`prob-item-${problemId}`);
        if (probEl) probEl.classList.remove("completed");
    }
    
    // 自動更新已讀與進度狀態
    const currentTopic = ROADMAP_DATA.flatMap(lvl => lvl.topics).find(tp => tp.id === topicId);
    if (currentTopic) {
        const totalProbs = currentTopic.problems.length;
        const solvedProbs = currentTopic.problems.filter(p => APP_STATE.solvedProblems.includes(p.id)).length;
        
        if (solvedProbs === totalProbs && totalProbs > 0) {
            if (!APP_STATE.readTopics.includes(topicId)) {
                APP_STATE.readTopics.push(topicId);
            }
            // 自動升級為【已掌握】(mastered)
            const oldStatus = APP_STATE.topicStatus[topicId] || "not-started";
            if (oldStatus === "not-started" || oldStatus === "learning") {
                APP_STATE.topicStatus[topicId] = "mastered";
                showToast(`🏆 恭喜！你已完成「${currentTopic.title}」的所有推薦習題，進度升級為【已掌握】！`);
            }
        } else {
            APP_STATE.readTopics = APP_STATE.readTopics.filter(id => id !== topicId);
            // 若為【已掌握】或【精熟】，但題目沒寫完，若原本是 mastered 則調回 learning (保留 proficient 不強制降級，因為可能手動標記精熟)
            if (APP_STATE.topicStatus[topicId] === "mastered") {
                APP_STATE.topicStatus[topicId] = "learning";
            }
        }
    }
    
    // 儲存狀態至 localStorage
    localStorage.setItem("taiwan_cp_solved_problems", JSON.stringify(APP_STATE.solvedProblems));
    localStorage.setItem("taiwan_cp_read_topics", JSON.stringify(APP_STATE.readTopics));
    localStorage.setItem("taiwan_cp_topic_status", JSON.stringify(APP_STATE.topicStatus));
    
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
    
    // 同步更新語言 Tabs UI
    const langButtons = document.querySelectorAll(".code-lang-tab");
    langButtons.forEach(btn => {
        const lang = btn.getAttribute("data-lang");
        if (lang === APP_STATE.activeTemplateLang) {
            btn.classList.add("active");
            btn.style.background = "rgba(255,255,255,0.06)";
            btn.style.borderColor = "rgba(255,255,255,0.1)";
            btn.style.color = "#fff";
        } else {
            btn.classList.remove("active");
            btn.style.background = "transparent";
            btn.style.borderColor = "transparent";
            btn.style.color = "#94a3b8";
        }
    });
    
    // 依語言選擇代碼字串
    let codeStr = "";
    let langLabel = "";
    if (APP_STATE.activeTemplateLang === "cpp") {
        codeStr = temp.code || "";
        langLabel = "C++ (STD 17)";
    } else if (APP_STATE.activeTemplateLang === "java") {
        codeStr = temp.codeJava || `// 💡 社群維護中！此「${temp.title}」專題目前暫未完成 Java 版本。\n// 推薦閱讀左側講義、或點擊上方「C++」標籤參考 C++ 實作範本。`;
        langLabel = "Java (SE 11)";
    } else if (APP_STATE.activeTemplateLang === "py") {
        codeStr = temp.codePython || `# 💡 社群維護中！此「${temp.title}」專題目前暫未完成 Python 版本。\n# 推薦閱讀左側講義、或點擊上方「C++」標籤參考 C++ 實作範本。`;
        langLabel = "Python (3.10)";
    }
    
    // 語法高亮轉換與載入
    const highlightedCode = highlightCode(codeStr, APP_STATE.activeTemplateLang);
    document.getElementById("code-display").innerHTML = highlightedCode;
    
    // 綁定複製按鈕功能
    const copyBtn = document.getElementById("code-copy-btn");
    copyBtn.innerHTML = `<span>📋 Copy</span>`;
    
    // 防止重複綁定 listener
    const newCopyBtn = copyBtn.cloneNode(true);
    copyBtn.parentNode.replaceChild(newCopyBtn, copyBtn);
    
    newCopyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(codeStr).then(() => {
            newCopyBtn.innerHTML = `<span>✅ Copied!</span>`;
            showToast(`📋 ${langLabel.split(" ")[0]} 模板代碼已複製到剪貼簿！`);
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
    
    // 語言選擇切換頁籤監聽
    const langButtons = document.querySelectorAll(".code-lang-tab");
    langButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            langButtons.forEach(b => {
                b.classList.remove("active");
                b.style.background = "transparent";
                b.style.borderColor = "transparent";
                b.style.color = "#94a3b8";
            });
            btn.classList.add("active");
            btn.style.background = "rgba(255,255,255,0.06)";
            btn.style.borderColor = "rgba(255,255,255,0.1)";
            btn.style.color = "#fff";
            
            APP_STATE.activeTemplateLang = btn.getAttribute("data-lang");
            loadActiveTemplate();
        });
    });
}

// 離線 C++ 進階語法高亮引擎 (基於字詞掃描器 Tokenizer)
// 離線多程式語言高亮引擎 (支援 C++, Java, Python - 基於 Tokenizer)
function highlightCode(code, lang) {
    const rules = [
        { type: "cp-comment", regex: lang === "py" ? /^#.*/ : /^\/\/.*|^\/\*[\s\S]*?\*\// },
        { type: "cp-preprocessor", regex: lang === "py" ? /^import\s+\w+|^from\s+\w+/ : /^#\w+/ },
        { type: "cp-string", regex: /^"([^"\\]|\\.)*"|^'([^'\\]|\\.)*'/ },
        { type: "cp-number", regex: /^\b0x[0-9a-fA-F]+\b|^\b\d+(\.\d+)?([eE][+-]?\d+)?\b/ },
        { type: "cp-keyword", regex: lang === "py" 
            ? /^\b(def|class|return|for|in|if|elif|else|while|break|continue|import|from|as|try|except|with|lambda|and|or|not|is|None|True|False)\b/
            : /^\b(using|namespace|struct|class|signed|main|return|for|if|else|while|break|continue|template|typedef|typename|inline|const|public|private|protected|virtual|friend|explicit|operator|new|delete|import|package|static|void|try|catch|finally|throw|throws|extends|implements)\b/ 
        },
        { type: "cp-type", regex: lang === "py"
            ? /^\b(list|dict|set|tuple|str|int|float|bool|range)\b/
            : lang === "java"
                ? /^\b(int|long|double|float|char|boolean|void|String|Integer|Long|Double|Float|Boolean|Vector|ArrayList|LinkedList|Stack|Queue|Deque|PriorityQueue|HashSet|TreeSet|HashMap|TreeMap|Scanner|BufferedReader|InputStreamReader|PrintWriter|BufferedOutputStream|StringTokenizer)\b/
                : /^\b(int|long|double|float|char|bool|void|vector|pair|queue|priority_queue|greater|set|map|unordered_set|unordered_map|stack|deque|string|auto)\b/ 
        },
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
            
            // 動態切換結果框配色樣式 (1~5 級分)
            const resultBox = document.querySelector(".calc-result-box");
            if (resultBox) {
                resultBox.classList.remove("lvl-1", "lvl-2", "lvl-3", "lvl-4", "lvl-5");
                resultBox.classList.add(`lvl-${grade.level}`);
            }
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
    
    // 逐一檢查每個前置依賴是否已完成或已研讀且狀態為【已掌握】或【精熟】
    return topic.prerequisites.every(prereqId => {
        const status = APP_STATE.topicStatus[prereqId];
        return (status === "mastered" || status === "proficient");
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

// ==========================================================================
// 🎮 遊戲化學習狀態標籤與 APCS 考點數據庫 (Taiwan APCS aligned Guide Metadata)
// ==========================================================================
const APCS_METADATA = {
    "time-complexity": {
        apcsWeight: "★★★★☆ (觀念題必考 / 實作題超時防線)",
        apcsFocus: "APCS 觀念題每屆必考 2-3 題，主要計算迴圈執行次數與遞迴時間複雜度（主定理或遞迴樹）；在實作題中，必須根據測資範圍限制（例如 N <= 10^5）正確設計演算法複雜度，避免拿到 TLE（超過時間限制）的 0 分。",
        stageGoal: "能準確判讀程式碼的時間複雜度，並在實作中根據測資範圍估算出可行的最差時間複雜度上限。"
    },
    "intro-ds": {
        apcsWeight: "★★★★★ (實作題全單元基石)",
        apcsFocus: "動態陣列 (std::vector)、二元組 (std::pair) 與結構體 (struct) 是實作二至四題管理複雜資料的關鍵。透過自訂 struct 封裝多維屬性（如座標、得分、學號），能顯著提高寫題效率並減少 Bug。",
        stageGoal: "能靈活宣告 struct 與 vector，並使用自訂比較函式搭配 std::sort 進行多欄位複合條件排序。"
    },
    "simulation": {
        apcsWeight: "★★★★★ (實作題第一題必考 / 佔 100 分)",
        apcsFocus: "實作題 Q1 幾乎 100% 為「基本模擬題」。考驗如何將長篇的遊戲規則或物理模擬（如洗牌、踩地雷、基地台覆蓋）精確轉換為程式碼，不涉及複雜演算法，但注重細節與邊界處理。",
        stageGoal: "能獨立寫出具備二維陣列、條件分支的複雜模擬程式，並能妥善處理各類邊界與特殊輸入格式。"
    },
    "intro-sorting": {
        apcsWeight: "★★★★☆ (實作題第二題常客)",
        apcsFocus: "排序是解決許多競程問題的前置步驟。APCS 觀念題常出現氣泡排序、選擇排序、快速排序的遞迴模擬與穩定性分析；實作題 Q2 常以排序作為排序二分搜或貪心排程的預處理。",
        stageGoal: "熟練使用 std::sort 進行陣列與容器排序，並能手動模擬基礎排序法以通過觀念題的程式追蹤。"
    },
    "intro-sets-maps": {
        apcsWeight: "★★★★☆ (實作題第三題優化必備)",
        apcsFocus: "利用 std::set 與 std::map 進行 $O(\\log N)$ 的去重與快速值對照，能有效取代 $O(N)$ 的線性搜尋，在實作 Q2 與 Q3 中作為防止超時的效能優化利器。",
        stageGoal: "能熟練運用 C++ STL 的 set 與 map 進行資料去重、鍵值查詢，並理解其與雜湊結構的時空複雜度差異。"
    },
    "enumeration-bruteforce": {
        apcsWeight: "★★★★★ (實作題拿分核心 / 觀念題常客)",
        apcsFocus: "暴力枚舉是拿取實作題子任務分數（Subtasks）的核心策略。即使無法寫出最佳解，透過 $O(N^2)$ 或 $O(2^N)$ 的暴力解亦能取得 40% 到 60% 的分數；觀念題常考窮舉搜尋的路徑數。",
        stageGoal: "能編寫巢狀迴圈進行多維度暴力枚舉，或利用遞迴進行深度為 N 的狀態空間搜索。"
    },
    "complete-rec": {
        apcsWeight: "★★★★★ (觀念題魔王 / 實作題第三題關鍵)",
        apcsFocus: "遞迴（Recursion）是 APCS 觀念題的「重中之重」（通常佔 30 分以上），考驗變數作用域、遞迴樹追蹤與返回值；在實作 Q3 中，常用於回溯法（Backtracking）窮舉子集或排列組合。",
        stageGoal: "能精準畫出遞迴調用樹，算出觀念題輸出，並能獨立寫出回溯法生成排列與組合的程式。"
    },
    "prefix-sums": {
        apcsWeight: "★★★★★ (實作題第二、三題常用優化)",
        apcsFocus: "區間求和的終極優化！當實作題需要頻繁詢問靜態陣列的區間總和時，使用前綴和將查詢複雜度從 $O(N)$ 降至 $O(1)$。2D 前綴和也曾在 APCS 實作題中做為子矩陣和的優化解。",
        stageGoal: "熟練掌握 1D 與 2D 前綴和的建置公式，精確處理下標邊界（1-indexed），完成快速區間查詢。"
    },
    "intro-greedy": {
        apcsWeight: "★★★★★ (實作題第二、三題必考 / 佔 100 分)",
        apcsFocus: "貪心算法（Greedy）是 APCS 實作題出題率極高的考點，通常出現在 Q2 或 Q3（如排程問題、線段覆蓋、物品裝箱）。難點在於證明的正確性，實作上多半結合排序或優先佇列。",
        stageGoal: "具備設計簡單貪心策略的能力，並能搭配排序或堆疊在 $O(N \\log N)$ 時間內求解."
    },
    "intro-graphs": {
        apcsWeight: "★★★★☆ (實作題圖論基礎)",
        apcsFocus: "APCS 中後半段題目的基底。需要掌握如何使用鄰接矩陣與鄰接串列（std::vector 陣列）表達點與邊，並理解度數、連通性、有向與無向圖的基本性質。",
        stageGoal: "能獨立使用鄰接串列建構無向圖與有向圖，並正確遍歷每個節點的鄰居。"
    },
    "rect-geo": {
        apcsWeight: "★★★☆☆ (實作與觀念模擬)",
        apcsFocus: "主要處理二維網格或多個矩形的相交、覆蓋面積與座標計算。例如經典的線段覆蓋問題或矩形面積聯集，考驗坐標系轉換與條件控制。",
        stageGoal: "掌握矩形相交的判定條件（X軸與Y軸投射重疊），並能處理多線段覆蓋區間合併的問題。"
    },
    "ad-hoc": {
        apcsWeight: "★★★☆☆ (實作與觀念思維題)",
        apcsFocus: "Ad Hoc 指的是不具備特定演算法模板、純粹考驗邏輯思考與數學觀察的創意題型。常需要找出數列的隱含規律、位元互補性或鏡像對稱關係。",
        stageGoal: "養成多角度思考的習慣，學會在草稿紙上列出小測資的手推過程以發掘隱藏規律。"
    },
    "more-prefix-sums": {
        apcsWeight: "★★★★☆ (實作題第三題核心優化)",
        apcsFocus: "差分陣列常用於實作題中「區間加值」的場景。將 $O(N)$ 的區間修改轉化為 $O(1)$ 的單點修改，最後透過一次前綴和還原陣列，常用於區間覆蓋與更新問題。",
        stageGoal: "熟練掌握差分陣列的更新機制與還原前綴和，能解決離線區間加值與覆蓋問題。"
    },
    "two-pointers": {
        apcsWeight: "★★★★☆ (實作題第三題優化解)",
        apcsFocus: "利用雙指針對撞（求兩數之和）或同向移動（滑動視窗），利用資料的單調性，在 $O(N)$ 的線性時間內求解區間條件，是取代暴力 $O(N^2)$ 的常見手段。",
        stageGoal: "能正確實作左右指針對撞與滑動視窗模板，精確控制指標移動條件以防無窮迴圈。"
    },
    "binary-search": {
        apcsWeight: "★★★★★ (實作題第三、四題超高頻 / 佔 100 分)",
        apcsFocus: "二分搜尋答案（Binary Search on Answer）是 APCS 實作題最經典的 Q3/Q4 解法。只要答案區間具備單調性（可否性質），就能透過二分搜將求解問題轉化為判定問題。",
        stageGoal: "熟練撰寫二分搜模板（注意邊界與死循環），並能設計出一套 $O(N)$ 或 $O(M)$ 的 `check(x)` 函數來判定可行性。"
    },
    "binary-search-sorted-array": {
        apcsWeight: "★★★★☆ (實作題二三題優化基礎)",
        apcsFocus: "利用二分搜在已排序的陣列中搜尋元素。APCS 實作中應多運用 `std::lower_bound`（搵第一個大於等於）與 `std::upper_bound`（搵第一個大於），以 $O(\\log N)$ 取代線性搜尋。",
        stageGoal: "熟練使用 lower_bound 與 upper_bound 計算區間元素個數、尋找前驅後繼元素，並能應用於座標離散化。"
    },
    "sorting-custom": {
        apcsWeight: "★★★★★ (實作題第二、三題核心 / 佔 100 分)",
        apcsFocus: "自訂排序規則是解決貪心排程與區間合併題目的前置核心。例如：排程問題中按「結束時間」排序、微波爐使用中按「耗時比例」排序等，排序對了題目就解決了一半。",
        stageGoal: "能根據數學推導或貪心證明寫出正確的 C++ 比較函式 `cmp`，並熟練實作線段合併與工作排程問題。"
    },
    "graph-traversal": {
        apcsWeight: "★★★★★ (實作題第四題必考 / 佔 100 分)",
        apcsFocus: "DFS（深度優先）與 BFS（廣度優先）是圖論題的必考核心。BFS 常用於求解無權圖的最短路徑、最少步數；DFS 常用於偵測環路、拓撲排序或遞迴走訪所有可行路徑。",
        stageGoal: "能使用 queue 寫出無 bug 的 BFS 模板求最短路，並用遞迴寫出 DFS 走訪模板，並能正確維護 `visited` 狀態陣列。"
    },
    "flood-fill": {
        apcsWeight: "★★★★☆ (實作題第三、四題核心手法)",
        apcsFocus: "洪水填充常用於二維網格圖（Grid）中尋找連通塊（比如：計算地圖上有幾個島嶼、區分封閉空間）。利用 DFS/BFS 搭配方向陣列對網格進行遍歷與染色標記。",
        stageGoal: "熟練二維網格的四/八方向遍歷，寫出無 bug 的 Flood Fill，並注意遞迴深度以防系統 Stack Overflow。"
    },
    "intro-tree": {
        apcsWeight: "★★★★★ (觀念題與實作第四題最高頻 / 佔 100 分)",
        apcsFocus: "樹（Tree）是 APCS 出題機率極高之資料結構。觀念題必考「前序/中序/後序遍歷追蹤」、「樹的深度與高度計算」；實作 Q4 經常給予「父親陣列」要求計算直徑、樹高或特定路徑。",
        stageGoal: "能從父親陣列建構鄰接表，並寫出遞迴 DFS 求樹的高度、深度、葉子節點個數與樹的直徑。"
    },
    "func-graphs": {
        apcsWeight: "★★★☆☆ (實作題第四題進階考點)",
        apcsFocus: "每個點的出度適為 1 的有向圖（又稱基環樹）。APCS 曾考過「指針追蹤與週期判定」的題目（例如走訪元素直到重複），考驗對環與鏈結構的處理。",
        stageGoal: "能判定點是否在環上，找出環的起點與長度，並能沿著唯一出邊進行高效追蹤。"
    },
    "priority-queues": {
        apcsWeight: "★★★★☆ (實作題第三、四題動態優化)",
        apcsFocus: "優先佇列（Priority Queue / Heap）用於動態取得目前資料集中的最大值或最小值。在 APCS Q3/Q4 中常做為貪心算法的動態載體，或 Dijkstra 最短路徑的優化工具。",
        stageGoal: "熟練掌握 `std::priority_queue` 的宣告方式（特別是小頂堆與自訂比較結構），並能運用其優化極值查詢至 $O(\\log N)$。"
    },
    "intro-bitwise": {
        apcsWeight: "★★★★★ (觀念題必考，佔約 20~30 分 / 實作題進階)",
        apcsFocus: "位元操作（AND, OR, XOR, NOT, 移位）在觀念題非常高頻，特別是運算子優先順序與 XOR 互補性質。在實作題中，Bitmask（位元遮罩）可用於在 $O(2^N)$ 時間內窮舉子集狀態。",
        stageGoal: "掌握各類位元操作，學會用整數二進位代表狀態集，寫出利用位元移位（1 << N）枚舉所有子集的程式碼。"
    },
    "monotonic-structures": {
        apcsWeight: "★★★★☆ (實作題第四題滿分優化)",
        apcsFocus: "單調棧與單調佇列可在 $O(N)$ 線性時間內維護一個區間內的第一個較大/較小值，是優化巢狀迴圈的核心結構。曾出現在 APCS 實作第四題（如看得到的建築物）。",
        stageGoal: "掌握單調棧的「維護單調遞增/遞減」進出棧邏輯，能解決下一個較大元素（NGE）或滑動視窗極值問題。"
    },
    "basic-dp": {
        apcsWeight: "★★★★★ (實作題第三、四題黃金守門員 / 佔 100 分)",
        apcsFocus: "動態規劃（DP）是 APCS 實作四級與五級分的最關鍵分水嶺！幾乎每屆實作 Q3 或 Q4 必考一題基本 DP（例如：0/1背包、硬幣兌換、最長共同子序列 LCS、最長遞增子序列 LIS）。",
        stageGoal: "理解 DP 的「子問題重疊」與「無後效性」，能獨立定義狀態、推導轉移方程式，並寫出無 Bug 的遞推程式碼。"
    },
    "shortest-path-basic": {
        apcsWeight: "★★★★☆ (實作題第四題常客)",
        apcsFocus: "在圖論中求起點到終點的最短路徑。若邊權為 1 則使用 $O(V+E)$ 的 BFS；若邊權為正數則必須使用 $O((V+E)\\log V)$ 的 Dijkstra 搭配優先佇列優化。",
        stageGoal: "熟練編寫 Dijkstra 最短路徑演算法，正確處理鬆弛操作（Relaxation）並記錄最短路徑長度。"
    }
};

// 1. 融入 APCS 考點與破關目標至 ROADMAP_DATA
function enrichRoadmapWithAPCS() {
    ROADMAP_DATA.forEach(lvl => {
        lvl.topics.forEach(tp => {
            const meta = APCS_METADATA[tp.id];
            if (meta) {
                tp.apcsWeight = meta.apcsWeight;
                tp.apcsFocus = meta.apcsFocus;
                tp.stageGoal = meta.stageGoal;
            } else {
                tp.apcsWeight = "★★★☆☆ (進階競程單元)";
                tp.apcsFocus = "主要出現於 TOI 選訓營、全國決賽或 APCS 實作第四題滿分挑戰，提供高效資料結構或複雜演算法優化。";
                tp.stageGoal = "理解演算法的核心邏輯與時空複雜度，並能寫出正確模板通過推薦習題。";
            }
        });
    });
}

// 2. 初始化學習狀態（相容舊有已讀進度）
function initTopicStatuses() {
    ROADMAP_DATA.forEach(lvl => {
        lvl.topics.forEach(tp => {
            if (!APP_STATE.topicStatus[tp.id]) {
                // 舊資料相容：如果在 readTopics 內，預設為 mastered
                if (APP_STATE.readTopics.includes(tp.id)) {
                    APP_STATE.topicStatus[tp.id] = "mastered";
                } else {
                    // 檢查是否所有題目都完成了
                    const total = tp.problems.length;
                    if (total > 0) {
                        const solved = tp.problems.filter(p => APP_STATE.solvedProblems.includes(p.id)).length;
                        if (solved === total) {
                            APP_STATE.topicStatus[tp.id] = "mastered";
                        } else {
                            APP_STATE.topicStatus[tp.id] = "not-started";
                        }
                    } else {
                        APP_STATE.topicStatus[tp.id] = "not-started";
                    }
                }
            }
            
            // 雙向同步：如果已掌握或精熟，確保存在於 readTopics 中以利數據統計
            const currentStatus = APP_STATE.topicStatus[tp.id];
            if (currentStatus === "mastered" || currentStatus === "proficient") {
                if (!APP_STATE.readTopics.includes(tp.id)) {
                    APP_STATE.readTopics.push(tp.id);
                }
            } else {
                APP_STATE.readTopics = APP_STATE.readTopics.filter(id => id !== tp.id);
            }
        });
    });
    localStorage.setItem("taiwan_cp_topic_status", JSON.stringify(APP_STATE.topicStatus));
    localStorage.setItem("taiwan_cp_read_topics", JSON.stringify(APP_STATE.readTopics));
}

// 3. 綁定 Modal 內學習狀態 Pill 按鈕事件與儲存邏輯
function setupStatusPillListeners() {
    const statusPillBtns = document.querySelectorAll(".status-pill-btn");
    statusPillBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            if (!APP_STATE.activeTopicId) return;
            
            const newStatus = btn.getAttribute("data-status");
            const oldStatus = APP_STATE.topicStatus[APP_STATE.activeTopicId] || "not-started";
            
            if (newStatus === oldStatus) return;
            
            // 更新狀態
            APP_STATE.topicStatus[APP_STATE.activeTopicId] = newStatus;
            
            // 點擊「精熟」或「已掌握」時顯示恭喜的 Toast
            const topic = ROADMAP_DATA.flatMap(lvl => lvl.topics).find(t => t.id === APP_STATE.activeTopicId);
            if (newStatus === "mastered") {
                showToast(`🟢 已掌握！將「${topic ? topic.title : '此單元'}」標記為已掌握。`);
            } else if (newStatus === "proficient") {
                showToast(`👑 精熟！你已能舉一反三獨立解決「${topic ? topic.title : '此單元'}」的 APCS 變形題！`);
            } else {
                showToast(`🎯 進度已更新！`);
            }
            
            // 更新 UI 選取樣式
            statusPillBtns.forEach(b => {
                if (b.getAttribute("data-status") === newStatus) {
                    b.classList.add("active");
                } else {
                    b.classList.remove("active");
                }
            });
            
            // 同步更新舊的 readTopics (已讀) 列表，確保相容性與統計面板計算
            if (newStatus === "mastered" || newStatus === "proficient") {
                if (!APP_STATE.readTopics.includes(APP_STATE.activeTopicId)) {
                    APP_STATE.readTopics.push(APP_STATE.activeTopicId);
                }
            } else {
                APP_STATE.readTopics = APP_STATE.readTopics.filter(id => id !== APP_STATE.activeTopicId);
            }
            
            // 儲存至 localStorage
            localStorage.setItem("taiwan_cp_topic_status", JSON.stringify(APP_STATE.topicStatus));
            localStorage.setItem("taiwan_cp_read_topics", JSON.stringify(APP_STATE.readTopics));
            
            // 重新計算進度統計與重新渲染地圖以即時更新解鎖狀態
            updateDashboardStats();
            renderRoadmap();
        });
    });
}

// ==========================================================================
// 🎓 AI 客製化學習路徑生成系統 (AI Coach System)
// ==========================================================================

// 初始化 AI 教練分頁事件
function initCoachSystem() {
    const generateBtn = document.getElementById("coach-generate-btn");
    if (!generateBtn) return;
    
    generateBtn.addEventListener("click", generateCoachBlueprint);
}

// 產生客製化修練藍圖
function generateCoachBlueprint() {
    // 1. 取得選項值
    const targetRadio = document.querySelector('input[name="coach-target"]:checked');
    const target = targetRadio ? targetRadio.value : "apcs";
    
    const backgroundSelect = document.getElementById("coach-background");
    const background = backgroundSelect ? backgroundSelect.value : "novice";
    
    const goalSelect = document.getElementById("coach-goal");
    const goal = goalSelect ? goalSelect.value : "apcs-3";
    
    // 2. 獲取對照藍圖數據
    if (typeof getCoachBlueprint !== "function") {
        console.error("getCoachBlueprint 函式未載入，請確認 data/coach_db.js 是否載入成功。");
        showToast("錯誤：無法載入教練數據庫");
        return;
    }
    
    const blueprint = getCoachBlueprint(target, background, goal);
    if (!blueprint) {
        showToast("無法生成該條件下的學習藍圖");
        return;
    }
    
    // 3. 渲染至結果容器
    const titleEl = document.getElementById("blueprint-title");
    if (titleEl) titleEl.textContent = blueprint.title;
    
    // 渲染知識卡片
    const kMapContainer = document.getElementById("blueprint-knowledge-map");
    if (kMapContainer) {
        kMapContainer.innerHTML = "";
        blueprint.knowledgeMap.forEach(item => {
            const card = document.createElement("div");
            card.className = "knowledge-card";
            
            // 是否有對應學習單元的連結
            const linkHtml = item.link 
                ? `<span class="k-card-link" onclick="jumpToRoadmapTopic('${item.link}')">👉 前往學習單元</span>`
                : "";
                
            card.innerHTML = `
                <div class="k-card-header">
                    <div class="k-card-title-group">
                        <span class="k-card-title">${item.topic}</span>
                        <span class="k-card-badge">${item.status}</span>
                    </div>
                    ${linkHtml}
                </div>
                <p class="k-card-desc">${item.desc}</p>
            `;
            kMapContainer.appendChild(card);
        });
    }
    
    // 渲染實戰練習策略
    const practiceContainer = document.getElementById("blueprint-practice-strategy");
    if (practiceContainer) {
        practiceContainer.innerHTML = blueprint.practiceStrategy.map(p => {
            // 支持簡單 Markdown 的粗體 **text**
            const formatted = p.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
            return `<p>${formatted}</p>`;
        }).join("");
    }
    
    // 渲染常見盲點與破局關鍵
    const pitfallsContainer = document.getElementById("blueprint-pitfalls");
    if (pitfallsContainer) {
        pitfallsContainer.innerHTML = blueprint.pitfallsAndTips.map(p => {
            const formatted = p.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
            return `<p>${formatted}</p>`;
        }).join("");
    }
    
    // 4. 顯示結果面板
    const resultContainer = document.getElementById("coach-result-container");
    if (resultContainer) {
        resultContainer.style.display = "block";
        
        // 5. KaTeX 數學公式自動渲染 (確保時間複雜度等完美呈現)
        if (typeof renderMathInElement === "function") {
            renderMathInElement(resultContainer, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false},
                    {left: '\\(', right: '\\)', display: false},
                    {left: '\\[', right: '\\[', display: true}
                ],
                throwOnError: false
            });
        }
        
        // 6. 平滑捲動至結果面板
        resultContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    
    showToast("⚡ 已為您生成專屬修練藍圖！");
}

// 跨 Tab 跳轉並開啟 Roadmap 指定主題 Modal
function jumpToRoadmapTopic(topicId) {
    // 1. 切換至學習地圖 Tab
    const roadmapTabBtn = document.getElementById("tab-btn-roadmap");
    if (roadmapTabBtn) {
        roadmapTabBtn.click();
    }
    
    // 2. 在數據中搜尋對應的主題與單元難度級別
    let foundTopic = null;
    let foundLevel = null;
    if (typeof ROADMAP_DATA !== "undefined") {
        for (let i = 0; i < ROADMAP_DATA.length; i++) {
            const lvl = ROADMAP_DATA[i];
            for (let j = 0; j < lvl.topics.length; j++) {
                const tp = lvl.topics[j];
                if (tp.id === topicId) {
                    foundTopic = tp;
                    foundLevel = lvl;
                    break;
                }
            }
            if (foundTopic) break;
        }
    }
    
    // 3. 觸開 Modal 彈窗
    if (foundTopic) {
        setTimeout(() => {
            // 先捲動至對應卡片 (已修正為 .usaco-node-item 時間軸卡片結構)
            const cardEl = document.querySelector(`.usaco-node-item[data-topic-id="${topicId}"]`);
            if (cardEl) {
                cardEl.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            openTopicModal(foundTopic, foundLevel);
        }, 200);
    } else {
        showToast("已成功跳轉，請在學習地圖中閱讀此單元！");
    }
}

// ==========================================================================
// 前端簡繁/本土化轉換與動態 Markdown 載入 (Translation & Dynamic Wiki Mirror)
// ==========================================================================

// Map of topicId -> relative path in OI-Wiki docs/
const OIWIKI_MAPPING = {
    "time-complexity": "basic/complexity.md",
    "intro-ds": "lang/csl/container.md",
    "simulation": "basic/simulate.md",
    "intro-sorting": "basic/sort-intro.md",
    "intro-sets-maps": "lang/csl/container.md",
    "enumeration-bruteforce": "basic/enumerate.md",
    "complete-rec": "basic/recursion.md",
    "prefix-sums": "basic/prefix-sum.md",
    "intro-greedy": "basic/greedy.md",
    "intro-graphs": "graph/concept.md",
    "rect-geo": "geometry/2d.md",
    "ad-hoc": "basic/construction.md",
    "more-prefix-sums": "basic/prefix-sum.md",
    "two-pointers": "basic/two-pointer.md",
    "binary-search": "basic/binary.md",
    "binary-search-sorted-array": "basic/binary.md",
    "sorting-custom": "basic/sort-intro.md",
    "graph-traversal": "graph/dfs.md",
    "flood-fill": "graph/dfs.md",
    "intro-tree": "graph/tree-basic.md",
    "func-graphs": "graph/functional-graph.md",
    "priority-queues": "ds/heap.md",
    "intro-bitwise": "math/bit.md",
    "monotonic-structures": "ds/monotonous-stack.md",
    "basic-dp": "dp/knapsack.md",
    "shortest-path-basic": "graph/shortest-path.md",
    "mst": "graph/mst.md",
    "topo-sort": "graph/topo.md",
    "segment-tree": "ds/seg.md",
    "bit": "ds/bit.md",
    "string-hash": "string/hash.md",
    "bst": "ds/bst.md",
    "knapsack-dp": "dp/knapsack.md",
    "lis": "dp/lis.md",
    "interval-dp": "dp/interval.md",
    "state-dp": "dp/state.md",
    "tree-dp": "dp/tree.md",
    "euler-tour": "graph/euler.md",
    "number-theory-basic": "math/number-theory/basic.md",
    "combinatorics": "math/combinatorics.md",
    "binary-lifting": "graph/lca.md",
    "lca": "graph/lca.md",
    "scc": "graph/scc.md",
    "mo": "misc/mo.md",
    "sqrt-decomp": "ds/sqrt-decomposition.md",
    "hld": "ds/hld.md",
    "dsu-on-tree": "graph/dsu-on-tree.md",
    "ac-automaton": "string/ac-automaton.md",
    "convex-hull": "geometry/convex-hull.md",
    "xor-basis": "math/linear-algebra/basis.md",
    "gaussian-elimination": "math/numerical/gauss.md",
    "tarjan-scc": "graph/scc.md",
    "splay": "ds/splay.md",
    "lct": "ds/lct.md",
    "kdtree": "ds/kdt.md",
    "persistent-seg": "ds/persistent-seg.md",
    "treap": "ds/treap.md",
    "cdq": "ds/dividing.md",
    "flow-max": "graph/flow/max-flow.md",
    "flow-mincost": "graph/flow/min-cost.md",
    "bipartite-match": "graph/match/bigraph-match.md",
    "general-match": "graph/match/general-match.md",
    "2-sat": "graph/2-sat.md",
    "rotating-calipers": "geometry/rotating-calipers.md",
    "halfplane": "geometry/halfplane-intersection.md",
    "sam": "string/sam.md",
    "pam": "string/pam.md",
    "fft": "math/poly/fft.md",
    "ntt": "math/poly/fft.md",
    "mobius": "math/number-theory/mobius.md",
    "du-sieve": "math/number-theory/du.md"
};

// Terminology replacement dictionary: Traditional Mainland Term -> Traditional Taiwanese Term
const CP_TERMS_MAPPING = {
    "單調隊列": "單調佇列",
    "單調棧": "單調堆疊",
    "雙指針": "雙指標",
    "雙指針算法": "雙指標演算法",
    "鄰接表": "鄰接串列",
    "鄰接矩陣": "鄰接矩陣",
    "最小費用最大流": "最小費用最大流",
    "強連通分量": "強連通分量",
    "後綴自動機": "後綴自動機",
    "旋轉卡殼": "旋轉卡殼",
    "半平面交": "半平面交",
    "線性基": "線性基",
    "高斯消元": "高斯消去",
    "快速冪": "快速冪",
    "模逆元": "模逆元",
    "斐波那契": "費氏",
    "莫比烏斯反演": "莫比烏斯反演",
    "杜教篩": "杜教篩",
    "快速傅里葉變換": "快速傅立葉變換",
    "快速傅立葉變換": "快速傅立葉變換",
    "二分搜尋": "二分搜尋",
    "二分查找": "二分搜尋",
    "三分法": "三分搜尋",
    "二分法": "二分搜尋",
    "狀態轉移方程式": "狀態轉移方程式",
    "狀態轉移方程": "狀態轉移方程式",
    "連通分量": "連通分量",
    "網絡流": "網路流",
    "結構體": "結構體",
    "記憶體": "記憶體",
    "控制台": "控制台",
    "執行緒": "執行緒",
    "二元樹": "二元樹",
    "哈夫曼樹": "赫夫曼樹",
    "赫夫曼樹": "赫夫曼樹",
    "數組": "陣列",
    "算法": "演算法",
    "指針": "指標",
    "哈希表": "雜湊表",
    "哈希": "雜湊",
    "隊列": "佇列",
    "代碼": "程式碼",
    "變量": "變數",
    "遞歸": "遞迴",
    "遍歷": "遍歷",
    "最短路": "最短路徑",
    "並查集": "並查集",
    "連通塊": "連通塊",
    "拓撲": "拓樸",
    "拓樸": "拓樸",
    "優化": "優化",
    "貪心": "貪心",
    "離散化": "離散化",
    "前綴和": "前綴和",
    "差分": "差分",
    "回溯": "回溯",
    "邊界": "邊界",
    "節點": "節點",
    "直徑": "直徑",
    "最大流": "最大流",
    "字典樹": "字典樹",
    "回文樹": "回文樹",
    "凸包": "凸包",
    "矩陣": "矩陣",
    "逆元": "逆元",
    "質數": "質數",
    "素數": "質數",
    "約數": "因數",
    "因數": "因數",
    "公約數": "公因數",
    "公倍數": "公倍數",
    "莫隊": "莫隊",
    "分治": "分治",
    "平衡樹": "平衡樹",
    "紅黑樹": "紅黑樹",
    "樹套樹": "樹套樹",
    "內存": "記憶體",
    "堆棧": "堆疊",
    "堆": "堆積",
    "運行": "執行",
    "調試": "除錯",
    "文件": "檔案",
    "終端": "終端機",
    "程序": "程式",
    "實現": "實作",
    "構造": "建構",
    "聲明": "宣告",
    "支持": "支援",
    "棧": "堆疊",
    "樹鏈剖分": "樹鏈剖分",
    "鏈表": "鏈結串列"
};

// Offline CN to TW character conversion fallback
function offlineFallbackCN2TW(text) {
    if (!text) return "";
    const charMap = {
        '数': '數', '组': '組', '算': '算', '法': '法', '队': '隊', '列': '列', '栈': '棧', '针': '針', '代': '代', '码': '碼',
        '图': '圖', '论': '論', '倍': '倍', '增': '增', '树': '樹', '链': '鏈', '剖': '剖', '分': '分', '单': '單', '调': '調',
        '线': '線', '段': '段', '点': '點', '边': '邊', '邻': '鄰', '接': '接', '复': '複', '杂': '雜', '度': '度', '归': '歸',
        '递': '遞', '推': '推', '联': '聯', '通': '通', '块': '塊', '优': '優', '化': '化', '贪': '貪', '心': '心', '双': '雙',
        '标': '標', '离': '離', '散': '散', '规': '規', '划': '劃', '强': '強', '网': '網', '络': '絡', '流': '流', '最': '最',
        '短': '短', '路': '路', '径': '徑', '关': '關', '键': '鍵', '祖': '祖', '先': '先', '构': '構', '造': '造', '实': '實',
        '现': '現', '编': '編', '译': '譯', '运': '運', '行': '行', '调': '調', '试': '試', '输': '輸', '入': '入', '出': '出',
        '库': '庫', '东': '東', '西': '西', '两': '兩', '个': '個', '这': '這', '么': '麼', '样': '樣', '写': '寫', '无': '無',
        '时': '時', '间': '間', '空': '空', '内': '內', '存': '存', '记': '記', '忆': '憶', '体': '體', '级': '級', '考': '考',
        '纲': '綱', '习': '習', '题': '題', '练': '練', '解': '解', '锁': '鎖', '进': '進', '阶': '階', '高': '高', '级': '級'
    };
    let result = '';
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        result += charMap[char] || char;
    }
    return result;
}

// Full translation and localization wrapper
function translateAndLocalize(text) {
    if (!text) return "";
    
    // 1. Convert characters to Traditional
    if (window.OpenCC && window.OpenCC.Converter) {
        try {
            const converter = window.OpenCC.Converter({ from: 'cn', to: 'tw' });
            text = converter(text);
        } catch (err) {
            console.warn("OpenCC conversion failed, using offline fallback:", err);
            text = offlineFallbackCN2TW(text);
        }
    } else {
        text = offlineFallbackCN2TW(text);
    }
    
    // 2. Perform terminology replacements
    const sortedTerms = Object.keys(CP_TERMS_MAPPING).sort((a, b) => b.length - a.length);
    for (const term of sortedTerms) {
        const escapedTerm = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(escapedTerm, 'g');
        text = text.replace(regex, CP_TERMS_MAPPING[term]);
    }
    
    return text;
}

// Get the Raw Markdown file URL for OI Wiki from GitHub mirror CDN
function getRawOiWikiUrl(topicId, topicData) {
    if (OIWIKI_MAPPING[topicId]) {
        return `https://fastly.jsdelivr.net/gh/OI-wiki/OI-wiki@master/docs/${OIWIKI_MAPPING[topicId]}`;
    }
    
    if (topicData && topicData.resources) {
        const wikiRes = topicData.resources.find(res => res.url && res.url.includes("oi-wiki.org"));
        if (wikiRes) {
            let cleanUrl = wikiRes.url.split('#')[0];
            let path = cleanUrl.replace(/^https?:\/\/(www\.)?oi-wiki\.org\/?/, '');
            path = path.replace(/^\/+|\/+$/g, '');
            if (path) {
                const dirIndices = ['dp', 'graph', 'math', 'string', 'ds', 'geometry', 'search', 'lang', 'basic', 'misc'];
                if (dirIndices.includes(path)) {
                    return `https://fastly.jsdelivr.net/gh/OI-wiki/OI-wiki@master/docs/${path}/index.md`;
                }
                return `https://fastly.jsdelivr.net/gh/OI-wiki/OI-wiki@master/docs/${path}.md`;
            }
        }
    }
    return null;
}

// Fetch and render tutorial Markdown contents
async function loadTutorialContent(topic, source = "local") {
    const tutorialSection = document.getElementById("modal-tutorial-section");
    const tutorialContainer = document.getElementById("modal-tutorial");
    const btnLocal = document.getElementById("btn-source-local");
    const btnOiWiki = document.getElementById("btn-source-oiwiki");
    
    if (!tutorialSection || !tutorialContainer) return;
    
    if (btnLocal && btnOiWiki) {
        if (source === "local") {
            btnLocal.classList.add("active");
            btnOiWiki.classList.remove("active");
        } else {
            btnLocal.classList.remove("active");
            btnOiWiki.classList.add("active");
        }
    }
    
    tutorialSection.style.display = "block";
    tutorialContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #64748b;">
            <span class="loading-icon" style="display: inline-block; animation: spin 1.5s linear infinite; margin-right: 0.5rem;">⏳</span> 正在載入與本土化翻譯教材，請稍候...
        </div>
    `;
    
    try {
        if (source === "local") {
            // Check if inline tutorial exists first
            if (topic.tutorial && topic.tutorial.trim() !== "") {
                if (topic.tutorial.trim().startsWith("<")) {
                    tutorialContainer.innerHTML = groupCodeBlocksIntoTabs(translateAndLocalize(topic.tutorial));
                } else {
                    const html = marked.parse(topic.tutorial);
                    tutorialContainer.innerHTML = groupCodeBlocksIntoTabs(translateAndLocalize(html));
                }
                triggerKaTeXRender(tutorialContainer);
                return;
            }
            
            // Try fetching from local markdown file
            try {
                const response = await fetch(`tutorials/${topic.id}.md`);
                if (response.ok) {
                    const mdText = await response.text();
                    const html = marked.parse(mdText);
                    tutorialContainer.innerHTML = groupCodeBlocksIntoTabs(translateAndLocalize(html));
                    triggerKaTeXRender(tutorialContainer);
                    return;
                }
            } catch (err) {
                console.log("Local markdown fetch failed, falling back:", err);
            }
            
            // Fallback: Suggest switching to OI Wiki if available
            const oiWikiUrl = getRawOiWikiUrl(topic.id, topic);
            if (oiWikiUrl) {
                tutorialContainer.innerHTML = `
                    <div style="text-align: center; padding: 2rem; border: 1px dashed rgba(255,255,255,0.1); border-radius: 8px;">
                        <p style="color: #94a3b8; margin-bottom: 1rem;">📖 本站暫無此單元之客製化講義，但已為您匹配到對應的 OI Wiki 百科教材！</p>
                        <button class="action-btn" id="btn-fallback-oiwiki" style="padding:0.4rem 1rem; font-size:0.85rem; border-radius:4px; background:linear-gradient(135deg, #3b82f6, #8b5cf6); color:#fff; border:none; cursor:pointer; font-weight:600;">
                            ⚡ 切換至 OI Wiki 繁中鏡像
                        </button>
                    </div>
                `;
                const fallbackBtn = document.getElementById("btn-fallback-oiwiki");
                if (fallbackBtn) {
                    fallbackBtn.addEventListener("click", () => {
                        loadTutorialContent(topic, "oiwiki");
                    });
                }
            } else {
                tutorialContainer.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: #64748b;">
                        本單元暫無本站教材或 OI Wiki 百科鏡像。歡迎查閱右側推薦講義與資源！
                    </div>
                `;
            }
        } else {
            // Load from OI Wiki
            const oiWikiUrl = getRawOiWikiUrl(topic.id, topic);
            if (!oiWikiUrl) {
                tutorialContainer.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: #64748b;">
                        此單元無對應的 OI Wiki 百科頁面。
                    </div>
                `;
                return;
            }
            
            const response = await fetch(oiWikiUrl);
            if (!response.ok) {
                throw new Error(`無法獲取 OI Wiki 內容 (HTTP status: ${response.status})`);
            }
            const mdText = await response.text();
            const html = marked.parse(mdText);
            tutorialContainer.innerHTML = groupCodeBlocksIntoTabs(translateAndLocalize(html));
            triggerKaTeXRender(tutorialContainer);
        }
    } catch (error) {
        console.error("載入教材出錯:", error);
        tutorialContainer.innerHTML = `
            <div style="text-align: center; padding: 2.5rem; color: #f43f5e; border: 1px dashed rgba(244,63,94,0.2); border-radius: 8px; background: rgba(244,63,94,0.03);">
                <p style="font-weight: 600; margin-bottom: 0.5rem;">❌ 載入教材失敗！</p>
                <p style="font-size:0.85rem; color:#94a3b8; margin: 0;">請檢查您的網路連線，或稍後再試。若在離線環境下，請切換至「本站教材」。</p>
                <span style="font-size:0.75rem; color:#64748b; display:block; margin-top:0.5rem;">(錯誤詳情: ${error.message})</span>
            </div>
        `;
    }
}

// Trigger KaTeX parsing on elements
function triggerKaTeXRender(element) {
    if (typeof renderMathInElement === "function") {
        renderMathInElement(element, {
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

// Codeforces progress synchronization via public Handle lookup API
async function syncCodeforcesProgress(handle) {
    const syncBtn = document.getElementById("cf-sync-btn");
    const handleInput = document.getElementById("cf-handle-input");
    const syncStatus = document.getElementById("cf-sync-status");
    
    if (!handle) {
        showToast("⚠️ 請輸入 Codeforces 使用者名稱！");
        return;
    }
    
    if (syncBtn) syncBtn.disabled = true;
    if (handleInput) handleInput.disabled = true;
    if (syncStatus) {
        syncStatus.innerText = "⏳ 正在從 Codeforces 拉取 AC 記錄...";
        syncStatus.style.color = "#a855f7"; // loading purple
    }
    
    try {
        const response = await fetch(`https://codeforces.com/api/user.status?handle=${handle}`);
        if (!response.ok) {
            throw new Error(`CF API 請求失敗 (Status: ${response.status})`);
        }
        
        const resJson = await response.json();
        if (resJson.status !== "OK") {
            throw new Error(resJson.comment || "API 回傳錯誤");
        }
        
        const submissions = resJson.result;
        const okSubmissions = submissions.filter(sub => sub.verdict === "OK");
        
        const solvedCfIds = new Set();
        okSubmissions.forEach(sub => {
            if (sub.problem && sub.problem.contestId && sub.problem.index) {
                const cfId = `cf-${sub.problem.contestId}${sub.problem.index.toLowerCase()}`;
                solvedCfIds.add(cfId);
            }
        });
        
        let newlySolvedCount = 0;
        ROADMAP_DATA.forEach(lvl => {
            lvl.topics.forEach(tp => {
                tp.problems.forEach(p => {
                    if (p.id.startsWith("cf-") && solvedCfIds.has(p.id)) {
                        if (!APP_STATE.solvedProblems.includes(p.id)) {
                            APP_STATE.solvedProblems.push(p.id);
                            newlySolvedCount++;
                        }
                    }
                });
            });
        });
        
        localStorage.setItem("taiwan_cp_solved_problems", JSON.stringify(APP_STATE.solvedProblems));
        
        // Auto upgrade topic statuses & refresh views
        autoUpgradeTopicStatuses();
        renderRoadmap();
        updateDashboardStats();
        
        localStorage.setItem("cf_handle", handle);
        
        if (syncStatus) {
            syncStatus.innerText = `✅ 同步成功！新增 ${newlySolvedCount} 題，已存檔。`;
            syncStatus.style.color = "#10b981"; // success green
        }
        showToast(`⚡ 同步成功！拉取了 ${solvedCfIds.size} 道 AC 題目，新增 ${newlySolvedCount} 題進度！`);
        
    } catch (err) {
        console.error("Codeforces Sync Error:", err);
        if (syncStatus) {
            syncStatus.innerText = `❌ 同步失敗: ${err.message}`;
            syncStatus.style.color = "#f43f5e"; // error red
        }
        showToast(`❌ 同步失敗: ${err.message}`);
    } finally {
        if (syncBtn) syncBtn.disabled = false;
        if (handleInput) handleInput.disabled = false;
    }
}

// Auto upgrade topics status to mastered if all recommend exercises are completed
function autoUpgradeTopicStatuses() {
    let upgradedCount = 0;
    ROADMAP_DATA.forEach(lvl => {
        lvl.topics.forEach(tp => {
            const total = tp.problems.length;
            if (total > 0) {
                const solved = tp.problems.filter(p => APP_STATE.solvedProblems.includes(p.id)).length;
                if (solved === total) {
                    const oldStatus = APP_STATE.topicStatus[tp.id];
                    if (oldStatus !== "mastered" && oldStatus !== "proficient") {
                        APP_STATE.topicStatus[tp.id] = "mastered";
                        upgradedCount++;
                    }
                }
            }
        });
    });
    if (upgradedCount > 0) {
        localStorage.setItem("taiwan_cp_topic_status", JSON.stringify(APP_STATE.topicStatus));
    }
    initTopicStatuses(); // Refresh read list and statistics
}

// ==========================================================================
// 🏆 競賽檢定專區動態渲染系統 (Contest Syllabus System)
// ==========================================================================
function initContestSystem() {
    const selectors = document.querySelectorAll(".contest-tab-selector");
    if (selectors.length === 0) return;
    
    selectors.forEach(btn => {
        btn.addEventListener("click", () => {
            selectors.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const contestType = btn.getAttribute("data-contest-type");
            renderContestDetails(contestType);
        });
    });
    
    // 預設渲染 APCS 檢定
    renderContestDetails("apcs");
}

function renderContestDetails(type) {
    const data = CONTEST_DATA[type];
    if (!data) return;
    
    // 1. 渲染描述文字
    const descBox = document.getElementById("contest-type-desc");
    if (descBox) {
        descBox.innerHTML = `
            <div class="contest-desc-title">${data.name}</div>
            <p class="contest-desc-text">${data.desc}</p>
        `;
    }
    
    // 2. 渲染各階段關卡與題目
    const container = document.getElementById("contest-levels-container");
    if (!container) return;
    
    container.innerHTML = "";
    
    data.levels.forEach(level => {
        const card = document.createElement("article");
        card.className = "contest-level-card";
        
        // 構造主題知識點清單 HTML
        const topicsHTML = level.topics.map(t => `<li>🔹 ${t}</li>`).join("");
        
        // 構造推薦題目列表 HTML
        const probsHTML = level.problems.map(prob => {
            const isSolved = APP_STATE.solvedProblems.includes(prob.id);
            return `
                <div class="contest-prob-item ${isSolved ? 'completed' : ''}">
                    <span class="contest-prob-status">${isSolved ? '✅ 已通關' : '⏳ 未解決'}</span>
                    <a href="${prob.url}" target="_blank" class="contest-prob-link">
                        ${prob.name} ↗
                    </a>
                </div>
            `;
        }).join("");
        
        card.innerHTML = `
            <div class="contest-level-card-header">
                <h3>${level.levelName}</h3>
            </div>
            <div class="contest-level-card-body">
                <div class="contest-body-sec">
                    <strong>📚 AP325 教材對應重點：</strong>
                    <p>${level.ap325Focus}</p>
                </div>
                <div class="contest-body-sec">
                    <strong>🎯 ZeroJudge 命題範圍：</strong>
                    <p>${level.zjRange}</p>
                </div>
                <div class="contest-body-sec">
                    <strong>💡 核心考查知識點：</strong>
                    <ul class="contest-topics-list">
                        ${topicsHTML}
                    </ul>
                </div>
                <div class="contest-body-sec">
                    <strong>💻 推薦修練題目：</strong>
                    <div class="contest-prob-list">
                        ${probsHTML}
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// 講義內置多語言程式碼 Tab 組成與分組解析器 (對齊 USACO Guide)
function groupCodeBlocksIntoTabs(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const preElements = doc.querySelectorAll("pre");
    
    let i = 0;
    while (i < preElements.length) {
        const pre = preElements[i];
        if (!pre.parentNode) {
            i++;
            continue;
        }
        
        // 尋找連續的 <pre> 區塊
        const group = [pre];
        let next = pre.nextElementSibling;
        while (next && next.tagName.toLowerCase() === "pre") {
            group.push(next);
            next = next.nextElementSibling;
        }
        
        if (group.length > 1) {
            // 將多個連續代碼區塊封裝成一組 Tabs
            const tabContainer = doc.createElement("div");
            tabContainer.className = "tutorial-code-tabs";
            
            const header = doc.createElement("div");
            header.className = "tutorial-code-tab-header";
            
            const contents = doc.createElement("div");
            contents.className = "tutorial-code-tab-contents";
            
            group.forEach((p, idx) => {
                const code = p.querySelector("code");
                let lang = "Code";
                if (code) {
                    const cls = code.className || "";
                    if (cls.includes("language-cpp") || cls.includes("lang-cpp")) lang = "C++";
                    else if (cls.includes("language-java") || cls.includes("lang-java")) lang = "Java";
                    else if (cls.includes("language-python") || cls.includes("lang-python") || cls.includes("language-py") || cls.includes("lang-py")) lang = "Python";
                    else if (cls.includes("language-pascal")) lang = "Pascal";
                    else if (cls.includes("language-rust")) lang = "Rust";
                }
                
                const btn = doc.createElement("button");
                btn.className = `tutorial-code-tab-btn ${idx === 0 ? "active" : ""}`;
                btn.setAttribute("data-tab-idx", idx);
                btn.textContent = lang;
                header.appendChild(btn);
                
                const contentDiv = doc.createElement("div");
                contentDiv.className = `tutorial-code-tab-content ${idx === 0 ? "active" : ""}`;
                contentDiv.setAttribute("data-tab-idx", idx);
                contentDiv.appendChild(p.cloneNode(true));
                contents.appendChild(contentDiv);
            });
            
            tabContainer.appendChild(header);
            tabContainer.appendChild(contents);
            
            // 用組裝好的 Tabs 取代第一個 <pre>，並刪除其餘的 <pre>
            pre.parentNode.replaceChild(tabContainer, pre);
            for (let k = 1; k < group.length; k++) {
                if (group[k].parentNode) {
                    group[k].parentNode.removeChild(group[k]);
                }
            }
            
            i += group.length;
        } else {
            i++;
        }
    }
    
    return doc.body.innerHTML;
}

// ==========================================================================
// ==========================================================================
// 用戶端登入/登出狀態管理系統 (支援本地快速登入與 Supabase 雲端資料庫同步)
// ==========================================================================
let supabaseClient = null;

function getSupabaseClient() {
    if (supabaseClient) return supabaseClient;
    
    let url = document.getElementById("db-url") ? document.getElementById("db-url").value.trim() : "";
    let key = document.getElementById("db-key") ? document.getElementById("db-key").value.trim() : "";
    
    if (!url || !key) {
        url = localStorage.getItem("taiwan_cp_db_url") || "";
        key = localStorage.getItem("taiwan_cp_db_key") || "";
    }
    
    if (!url || !key) {
        return null;
    }
    
    localStorage.setItem("taiwan_cp_db_url", url);
    localStorage.setItem("taiwan_cp_db_key", key);
    
    const dbUrlInput = document.getElementById("db-url");
    const dbKeyInput = document.getElementById("db-key");
    if (dbUrlInput) dbUrlInput.value = url;
    if (dbKeyInput) dbKeyInput.value = key;
    
    try {
        if (window.supabase) {
            supabaseClient = window.supabase.createClient(url, key);
            return supabaseClient;
        }
    } catch (err) {
        console.error("Supabase init error:", err);
    }
    return null;
}

// 動態同步進度至雲端資料庫
async function syncProgressToCloud() {
    const client = getSupabaseClient();
    if (!client) return;
    
    try {
        const { data: { session } } = await client.auth.getSession();
        const user = session?.user;
        if (!user) return;
        
        const username = localStorage.getItem("taiwan_cp_username") || "匿名選手";
        const cfHandle = localStorage.getItem("cf_handle") || "";
        
        const { error } = await client.from('profiles').upsert({
            id: user.id,
            username: username,
            cf_handle: cfHandle,
            solved_problems: APP_STATE.solvedProblems,
            read_topics: APP_STATE.readTopics,
            topic_status: APP_STATE.topicStatus,
            updated_at: new Date().toISOString()
        });
        
        if (error) {
            console.warn("[Cloud Sync] Upsert failed:", error.message);
        } else {
            console.log("[Cloud Sync] 進度已成功同步至 Supabase 雲端！");
        }
    } catch (err) {
        console.warn("[Cloud Sync] 背景同步失敗，請確認 profiles 資料表是否存在:", err);
    }
}

function initUserAuthentication() {
    const loginBtn = document.getElementById("auth-login-btn");
    const logoutBtn = document.getElementById("auth-logout-btn");
    const loginModal = document.getElementById("login-modal-overlay");
    const loginModalClose = document.getElementById("login-modal-close");
    
    // Tab 控制
    const tabLocal = document.getElementById("auth-tab-local");
    const tabCloud = document.getElementById("auth-tab-cloud");
    const formLocal = document.getElementById("login-form-local");
    const formCloud = document.getElementById("login-form-cloud");
    
    // 摺疊設定
    const btnToggleDb = document.getElementById("btn-toggle-db-settings");
    const dbFields = document.getElementById("db-settings-fields");
    
    // 雲端按鈕
    const btnCloudRegister = document.getElementById("btn-cloud-register");
    
    const loggedOutDiv = document.getElementById("auth-logged-out");
    const loggedInDiv = document.getElementById("auth-logged-in");
    const authUserName = document.getElementById("auth-user-name");
    const authUserHandle = document.getElementById("auth-user-handle");
    
    // 1. Tab 切換事件
    if (tabLocal && tabCloud) {
        tabLocal.addEventListener("click", () => {
            tabLocal.classList.add("active");
            tabLocal.style.background = "rgba(255,255,255,0.08)";
            tabLocal.style.color = "#fff";
            
            tabCloud.classList.remove("active");
            tabCloud.style.background = "transparent";
            tabCloud.style.color = "#94a3b8";
            
            formLocal.style.display = "block";
            formCloud.style.display = "none";
        });
        
        tabCloud.addEventListener("click", () => {
            tabCloud.classList.add("active");
            tabCloud.style.background = "rgba(255,255,255,0.08)";
            tabCloud.style.color = "#fff";
            
            tabLocal.classList.remove("active");
            tabLocal.style.background = "transparent";
            tabLocal.style.color = "#94a3b8";
            
            formCloud.style.display = "block";
            formLocal.style.display = "none";
            
            // 載入預存的 DB 設定
            getSupabaseClient();
        });
    }
    
    // 2. 摺疊自訂資料庫設定
    if (btnToggleDb) {
        btnToggleDb.addEventListener("click", () => {
            if (dbFields.style.display === "none" || !dbFields.style.display) {
                dbFields.style.display = "block";
            } else {
                dbFields.style.display = "none";
            }
        });
    }
    
    // 更新 UI 狀態
    function updateAuthUI() {
        const username = localStorage.getItem("taiwan_cp_username");
        const cfHandle = localStorage.getItem("cf_handle");
        const isCloud = localStorage.getItem("taiwan_cp_login_type") === "cloud";
        
        if (username) {
            authUserName.textContent = `${isCloud ? "☁️" : "👤"} ${username}`;
            if (cfHandle) {
                authUserHandle.textContent = `CF: ${cfHandle}`;
                authUserHandle.style.color = "#a855f7"; // active CF purple
            } else {
                authUserHandle.textContent = "CF: 未綁定";
                authUserHandle.style.color = "#64748b";
            }
            loggedOutDiv.style.display = "none";
            loggedInDiv.style.display = "flex";
        } else {
            loggedOutDiv.style.display = "flex";
            loggedInDiv.style.display = "none";
        }
    }
    
    // 開啟登入彈窗
    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            loginModal.style.display = "flex";
            loginModal.setAttribute("aria-hidden", "false");
            
            const currentCF = localStorage.getItem("cf_handle") || "";
            const localCFInput = document.getElementById("login-cf-handle");
            if (localCFInput) localCFInput.value = currentCF;
        });
    }
    
    // 關閉登入彈窗
    const closeModal = () => {
        loginModal.style.display = "none";
        loginModal.setAttribute("aria-hidden", "true");
    };
    
    if (loginModalClose) loginModalClose.addEventListener("click", closeModal);
    if (loginModal) {
        loginModal.addEventListener("click", (e) => {
            if (e.target === loginModal) closeModal();
        });
    }
    
    // 3. 本地快速登入提交
    if (formLocal) {
        formLocal.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("login-username").value.trim();
            const cfHandle = document.getElementById("login-cf-handle").value.trim();
            
            if (!username) {
                showToast("⚠️ 請輸入選手名稱！");
                return;
            }
            
            localStorage.setItem("taiwan_cp_username", username);
            localStorage.setItem("taiwan_cp_login_type", "local");
            
            if (cfHandle) {
                localStorage.setItem("cf_handle", cfHandle);
                const handleInput = document.getElementById("cf-handle-input");
                if (handleInput) handleInput.value = cfHandle;
                syncCodeforcesProgress(cfHandle);
            }
            
            updateAuthUI();
            closeModal();
            showToast(`✨ 本地登入成功！歡迎 ${username} 選手`);
        });
    }
    
    // 4. 雲端資料庫註冊
    if (btnCloudRegister) {
        btnCloudRegister.addEventListener("click", async () => {
            const email = document.getElementById("cloud-email").value.trim();
            const password = document.getElementById("cloud-password").value.trim();
            
            if (!email || !password) {
                showToast("⚠️ 請填寫 Email 與密碼！");
                return;
            }
            
            let client = getSupabaseClient();
            if (!client) {
                // 如果未填，提示輸入
                dbFields.style.display = "block";
                showToast("⚠️ 請先設定您的 Supabase URL 與 Anon Key！");
                return;
            }
            
            showToast("⏳ 正在註冊雲端帳號...");
            try {
                const { data, error } = await client.auth.signUp({ email, password });
                if (error) throw error;
                
                showToast("✅ 註冊成功！請檢查您的 Email 信箱以啟用帳號，或直接嘗試登入。");
            } catch (err) {
                showToast(`❌ 註冊失敗: ${err.message}`);
            }
        });
    }
    
    // 5. 雲端資料庫登入
    if (formCloud) {
        formCloud.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("cloud-email").value.trim();
            const password = document.getElementById("cloud-password").value.trim();
            
            if (!email || !password) {
                showToast("⚠️ 請填寫 Email 與密碼！");
                return;
            }
            
            let client = getSupabaseClient();
            if (!client) {
                dbFields.style.display = "block";
                showToast("⚠️ 請先在下方設定您的 Supabase 資料庫 URL 與 Key！");
                return;
            }
            
            showToast("⏳ 正在登入雲端資料庫...");
            try {
                const { data: { session }, error } = await client.auth.signInWithPassword({ email, password });
                if (error) throw error;
                
                const user = session.user;
                // 用 Email 前綴作為預設使用者名稱
                const defaultName = email.split("@")[0];
                
                // 從雲端 profiles 拉取進度數據
                const { data: profile } = await client.from('profiles').select('*').eq('id', user.id).single();
                
                if (profile) {
                    localStorage.setItem("taiwan_cp_username", profile.username || defaultName);
                    localStorage.setItem("taiwan_cp_login_type", "cloud");
                    if (profile.cf_handle) {
                        localStorage.setItem("cf_handle", profile.cf_handle);
                        const handleInput = document.getElementById("cf-handle-input");
                        if (handleInput) handleInput.value = profile.cf_handle;
                    }
                    if (profile.solved_problems) {
                        APP_STATE.solvedProblems = profile.solved_problems;
                        localStorage.setItem("taiwan_cp_solved_problems", JSON.stringify(APP_STATE.solvedProblems));
                    }
                    if (profile.read_topics) {
                        APP_STATE.readTopics = profile.read_topics;
                        localStorage.setItem("taiwan_cp_read_topics", JSON.stringify(APP_STATE.readTopics));
                    }
                    if (profile.topic_status) {
                        APP_STATE.topicStatus = profile.topic_status;
                        localStorage.setItem("taiwan_cp_topic_status", JSON.stringify(APP_STATE.topicStatus));
                    }
                    
                    // 刷新頁面進度
                    autoUpgradeTopicStatuses();
                    renderRoadmap();
                } else {
                    // 若雲端無 Profile，則新建一筆
                    localStorage.setItem("taiwan_cp_username", defaultName);
                    localStorage.setItem("taiwan_cp_login_type", "cloud");
                    await client.from('profiles').upsert({
                        id: user.id,
                        username: defaultName,
                        cf_handle: localStorage.getItem("cf_handle") || "",
                        solved_problems: APP_STATE.solvedProblems,
                        read_topics: APP_STATE.readTopics,
                        topic_status: APP_STATE.topicStatus
                    });
                }
                
                updateDashboardStats();
                updateAuthUI();
                closeModal();
                showToast(`✨ 雲端同步登入成功！歡迎 ${localStorage.getItem("taiwan_cp_username")} 選手`);
            } catch (err) {
                showToast(`❌ 登入失敗: ${err.message}`);
            }
        });
    }
    
    // 6. 登出
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            const username = localStorage.getItem("taiwan_cp_username") || "選手";
            const isCloud = localStorage.getItem("taiwan_cp_login_type") === "cloud";
            
            if (isCloud) {
                let client = getSupabaseClient();
                if (client) {
                    await client.auth.signOut();
                }
            }
            
            localStorage.removeItem("taiwan_cp_username");
            localStorage.removeItem("cf_handle");
            localStorage.removeItem("taiwan_cp_login_type");
            
            // 清除 CF 輸入框 UI
            const handleInput = document.getElementById("cf-handle-input");
            if (handleInput) handleInput.value = "";
            const syncStatus = document.getElementById("cf-sync-status");
            if (syncStatus) {
                syncStatus.innerText = "未同步。";
                syncStatus.style.color = "#64748b";
            }
            
            updateAuthUI();
            showToast(`✨ 已成功登出，選手 ${username} 下次見！`);
        });
    }
    
    // 初始化 UI
    updateAuthUI();
}


