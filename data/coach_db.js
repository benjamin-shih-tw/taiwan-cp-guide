// ==========================================================================
// 🎓 AI 客製化學習路徑對照字典 (AI Coach Blueprints Database)
// ==========================================================================
const COACH_BLUEPRINTS = {
    // ----------------------------------------------------------------------
    // APCS 檢定組
    // ----------------------------------------------------------------------
    "apcs_novice_apcs-3": {
        title: "🎯 從零啟航：APCS 實作三級分（觀念三級/實作三級）衝刺藍圖",
        knowledgeMap: [
            { topic: "C++ 基礎語法與變數操作", status: "必學基石", link: "intro-ds", desc: "掌握變數宣告、`cin`/`cout` 輸入輸出、算術運算與條件分支 (`if-else`)。" },
            { topic: "迴圈控制與巢狀迴圈", status: "核心核心", link: "simulation", desc: "熟練 `for` 與 `while` 迴圈，能用雙重迴圈處理九九乘法表或二維矩陣邊界。" },
            { topic: "一維與二維陣列操作", status: "實作第一題必考", link: "simulation", desc: "APCS 實作 Q1 幾乎 100% 涉及陣列索引操作（例如矩陣翻轉、踩地雷、洗牌）。" },
            { topic: "時間複雜度與空間估算", status: "觀念必考", link: "time-complexity", desc: "理解 $O(N)$ 與 $O(N^2)$ 的差別，學會計算迴圈次數，避免實作題超時。" }
        ],
        practiceStrategy: [
            "推薦平台：**ZeroJudge** (特別是基礎題庫 d 區、e 區) 以及本站的「啟航級」練習題。",
            "刷題目標：累積解決至少 50 題基本迴圈與陣列操作題，維持答題正確率 (AC) 達 80% 以上。",
            "模擬特訓：利用本站「競程工具箱」的 APCS 模擬計分器，設定第一題得 100 分，其餘題目拿子任務分數，先以總分 120~160 分為目標。"
        ],
        pitfallsAndTips: [
            "⚠️ **常見盲點 - 語法不熟**：初學者極易花費 80% 的時間在解決分號漏掉、大括號未閉合等編譯錯誤 (CE)。請多手寫代碼熟悉語法。",
            "⚠️ **常見盲點 - 看不懂題目**：APCS 題目描述通常極長。請學會「畫出範例輸入輸出」並手動追蹤變數，在草稿紙上理清邏輯後再寫程式。",
            "💡 **破局心法**：寫程式前，先用自然語言或虛擬碼 (Pseudocode) 寫下邏輯步驟，再翻譯成 C++，能省去一半的 Debug 時間！"
        ]
    },
    
    "apcs_basic-cpp_apcs-3": {
        title: "🚀 語法轉演算法：APCS 實作三級分極速攻略",
        knowledgeMap: [
            { topic: "基礎模擬題與方向向量", status: "實作第一題必拿", link: "simulation", desc: "精通二維網格移動、上下左右鄰居判定，以及邊界溢位防護。" },
            { topic: "排序與 C++ STL 使用", status: "實作第二題常用", link: "intro-sorting", desc: "熟練使用 `std::sort`，並理解基本排序演算法（選擇、泡沫）的原理與觀念題考點。" },
            { topic: "基礎遞迴與數列追蹤", status: "觀念題魔王 / Q2-Q3 加分", link: "complete-rec", desc: "APCS 觀念題有極高佔比在考遞迴樹追蹤與返回值運算，必須能夠手繪遞迴樹。" }
        ],
        practiceStrategy: [
            "推薦平台：**ZeroJudge**（搜尋『APCS 實作題』歷屆第一題與第二題），以及 **AtCoder Beginner Contest (ABC)** 的 A、B 兩題。",
            "刷題指標：每週至少刷 5 題模擬題與 3 題排序題。練習在 40 分鐘內獨立寫出無 bug 的歷屆實作 Q1。"
        ],
        pitfallsAndTips: [
            "⚠️ **常見盲點 - 陣列索引越界**：常因宣告大小剛好為 $N$ 而在訪問 $N$ 時發生 Runtime Error (RE)。宣告陣列時請習慣「多開 5 到 10 格」防禦邊界。",
            "⚠️ **常見盲點 - 遞迴無窮迴圈**：寫遞迴時忘記寫終止條件 (Base Case)。",
            "💡 **破局心法**：遞迴函數的第一行，必須是「終止條件判斷與 return」，這是防止堆疊溢位 (Stack Overflow) 的不二法門！"
        ]
    },

    "apcs_basic-cpp_apcs-4": {
        title: "⚡ 進階突破：挑戰 APCS 實作四級分（演算法與資料結構黃金交叉）",
        knowledgeMap: [
            { topic: "二分搜尋法 (Binary Search on Answer)", status: "實作第三題超高頻", link: "binary-search", desc: "掌握單調性區間判定，能將求解問題轉為 $O(N \\log C)$ 的判定問題。" },
            { topic: "貪心算法 (Greedy) 與排程", status: "實作第二/三題必考", link: "intro-greedy", desc: "學習線段覆蓋、活動安排等經典問題，學會證明貪心策略並搭配排序解決。" },
            { topic: "圖與網格遍歷 (DFS 與 BFS)", status: "實作第三/四題基礎", link: "graph-traversal", desc: "掌握鄰接串列建圖、使用 Queue 實作 BFS 最短路，以及遞迴 DFS 走訪。" },
            { topic: "動態規劃基礎 (Basic DP)", status: "Q3/Q4 決定性守門員", link: "basic-dp", desc: "學會硬幣兌換、背包問題等經典狀態定義與轉移方程式。" }
        ],
        practiceStrategy: [
            "推薦平台：**CSES Problem Set** (Sorting and Searching 區前 15 題) 與 **AtCoder ABC** C-D 題。",
            "刷題指標：獨立做完歷屆 APCS 第二題 15 題以上、第三題 8 題以上。手寫出遞迴與非遞迴版本的二分搜。"
        ],
        pitfallsAndTips: [
            "⚠️ **常見盲點 - 盲目暴力解**：遇到實作 Q3/Q4 直接寫巢狀迴圈，結果在大測資拿到 TLE（逾時）。請務必先看測資範圍估算複雜度！",
            "⚠️ **常見盲點 - DP 狀態定義模糊**：遇到 DP 題只會套模板卻不會推導轉移。請多練習「用中文定義 dp[i] 的具體物理意義」。",
            "💡 **破局心法**：看到題目要求「最大值的最小值」或「最少成本的上限」，先聯想**二分搜尋答案法**！"
        ]
    },

    "apcs_recursion_apcs-3": {
        title: "🎯 鞏固實力：利用遞迴優勢穩拿 APCS 實作三級分",
        knowledgeMap: [
            { topic: "遞迴枚舉與排列組合生成", status: "觀念必考/實作大加分", link: "complete-rec", desc: "使用遞迴生成子集（2^N）或排列（N!），解決排程與枚舉問題。" },
            { topic: "自訂排序與結構體 (struct)", status: "實作第二題必備", link: "intro-sorting", desc: "封裝複合資料（如點座標、分數與編號），熟練 C++ 的 `cmp` 排序比較子。" },
            { topic: "時間複雜度分析", status: "實作題提速防線", link: "time-complexity", desc: "學會精確評估遞迴調用次數，避免因無謂的重複搜索而超時。" }
        ],
        practiceStrategy: [
            "推薦平台：**ZeroJudge** 歷屆實作題第二題、**AtCoder** 遞迴枚舉專題。",
            "刷題目標：在 50 分鐘內寫出能通過完全枚舉子任務的 Backtracking 程式碼。"
        ],
        pitfallsAndTips: [
            "⚠️ **常見盲點 - 遞迴重複計算**：寫斐波那契數列或類似遞迴時，沒有進行記憶化 (Memoization)，導致時間複雜度爆炸為指數級 $O(2^N)$。",
            "💡 **破局心法**：宣告一個全域陣列 `memo` 記錄算過的值，進入遞迴先檢查 `if (memo[x] != -1) return memo[x];`，這是踏入 DP 的第一步！"
        ]
    },

    "apcs_recursion_apcs-4": {
        title: "🔥 突破瓶頸：從遞迴熟練者晉升 APCS 實作四級分",
        knowledgeMap: [
            { topic: "動態規劃基礎 (0/1 背包、LCS、LIS)", status: "Q3/Q4 搶分必備", link: "basic-dp", desc: "將遞迴思維轉化為遞推（由底向上），徹底解決重複子問題。" },
            { topic: "樹狀結構與 DFS 遍歷", status: "實作第四題超高頻", link: "intro-tree", desc: "給予父親陣列建構鄰接串列，計算樹高、深度與樹的直徑。" },
            { topic: "二分搜尋答案 (Binary Search)", status: "Q3 經典考點", link: "binary-search", desc: "在單調區間內進行折半搜索，將求解轉為判定問題。" }
        ],
        practiceStrategy: [
            "推薦平台：**CSES Problem Set** (Introductory, Sorting & Searching, DP 前 10 題)。",
            "刷題目標：在 60 分鐘內能寫出包含建圖與遍歷的 DFS 程式，並通過歷屆實作 Q3。"
        ],
        pitfallsAndTips: [
            "⚠️ **常見盲點 - 樹圖概念混淆**：把樹當作一般圖處理，忘記樹沒有環且邊數為 $V-1$ 的性質，寫了無謂的環判定。",
            "⚠️ **常見盲點 - 遞迴過深**：在系統 Stack 限制嚴格的地方，過深的 DFS 會引發 Stack Overflow。學會使用系統棧或改寫成非遞迴 BFS。",
            "💡 **破局心法**：樹的題目 90% 都可以用「自底向上的 DFS」維護子樹資訊（如子樹大小、最大高度）來求解！"
        ]
    },

    "apcs_algorithms_apcs-4": {
        title: "👑 穩拿四級分：APCS 實作高階技巧與穩健備考策略",
        knowledgeMap: [
            { topic: "二分搜尋答案法 (Binary Search on Answer)", status: "實作題第三題必拿", link: "binary-search", desc: "掌握單調性，靈活撰寫 `check(x)` 函數進行區間驗證。" },
            { topic: "經典動態規劃與滾動陣列優化", status: "實作第四題防線", link: "basic-dp", desc: "不僅會寫 DP，還要學會使用滾動陣列優化空間複雜度至 $O(N)$。" },
            { topic: "雙指針與滑動視窗 (Two Pointers)", status: "實作第三題優化常客", link: "two-pointers", desc: "利用單調性將 $O(N^2)$ 的子區間枚舉優化至 $O(N)$。" }
        ],
        practiceStrategy: [
            "推薦平台：歷屆 APCS 實作題 Q3/Q4、**Codeforces** Div.2 C-D 題。",
            "刷題指標：至少 AC 20 題以上的經典 DP 與 15 題以上的二分搜尋答案題。"
        ],
        pitfallsAndTips: [
            "⚠️ **常見盲點 - TLE 超時**：寫出正確邏輯但因為多餘的 `set` 查詢或 $O(N^2)$ 雙迴圈導致最後兩個大測資超時。注意常數優化與快讀。",
            "💡 **破局心法**：APCS 實作題考前，一定要完整練習「在限時內手寫歷屆完整套題」，調整配分策略，切忌卡在某一題過久！"
        ]
    },

    // ----------------------------------------------------------------------
    // 競賽選手組
    // ----------------------------------------------------------------------
    "competitive_novice_any": {
        title: "⚔️ 資訊競賽啟航：從零打造 IOI/TOI 選手體質",
        knowledgeMap: [
            { topic: "C++ STL 容器與自訂 struct 排序", status: "基礎中的基礎", link: "intro-ds", desc: "精通 `std::vector`, `std::pair`, `std::sort`，這是實作各類演算法的載體。" },
            { topic: "時間與空間複雜度嚴格分析", status: "競賽超時防線", link: "time-complexity", desc: "精確估算程式執行步數（競賽限制通常為 1.0 秒約 $10^8$ 次運算）。" },
            { topic: "遞迴回溯與剪枝 (Pruning)", status: "暴力分/小測資必拿", link: "complete-rec", desc: "學會透過條件剪枝減少搜尋空間，在競賽中搶下子任務（Subtasks）分數。" }
        ],
        practiceStrategy: [
            "推薦平台：**AtCoder Beginner Contest (ABC)** A-C 題、**CSES** Introductory Tasks。",
            "刷題目標：累積 AC 100 題以上，養成良好的程式排版與命名習慣，並在寫題時手動寫出時間複雜度註解。"
        ],
        pitfallsAndTips: [
            "⚠️ **常見盲點 - 複製代碼**：看懂了題解就直接複製貼上。這樣在考場上完全寫不出來。請務必關掉題解，自己重新盲寫一遍直到 AC。",
            "💡 **破局心法**：從第一天起，學會「自己設計極端測資（Corner Cases）」如 $N=1$、極大值、空輸入，在送出前手動驗證代碼！"
        ]
    },

    "competitive_basic-cpp_toi-primary": {
        title: "🥈 初試啼聲：TOI 初選入選與全國賽複賽藍圖",
        knowledgeMap: [
            { topic: "廣度與深度優先搜尋 (BFS/DFS)", status: "圖論核心", link: "graph-traversal", desc: "掌握圖與網格的遍歷、無權圖最短路，以及洪水填充 (Flood Fill)。" },
            { topic: "前綴和與差分優化", status: "基本優化招式", link: "prefix-sums", desc: "將區間查詢與區間加值優化至 $O(1)$ 的必備技巧。" },
            { topic: "二分搜尋答案法 (Binary Search)", status: "高頻黃金考點", link: "binary-search", desc: "將「求解最大/最小」問題轉化為單調區間的「可行性判定」問題。" },
            { topic: "基礎動態規劃 (LCS/LIS/背包)", status: "降維打擊必學", link: "basic-dp", desc: "理解狀態轉移的本質，能解決非線性的最優化問題。" }
        ],
        practiceStrategy: [
            "推薦平台：**CSES Problem Set** (Sorting and Searching, DP 各前 15 題)、**Codeforces** Div.3 / Div.2 A-C 題。",
            "刷題指標：每週 AC 至少 8 題。在 Codeforces 模擬賽中穩定解決前三題。"
        ],
        pitfallsAndTips: [
            "⚠️ **常見盲點 - 實作速度慢**：邏輯想對了，但在考場上花了一小時才寫完，沒時間寫其他題。請在平時練習時自我限時 30 分鐘內寫完一題。",
            "⚠️ **常見盲點 - 忽略 $10^{18}$ 溢位**：變數宣告為 `int` 而非 `long long` 導致大測資溢位拿到 WA。競賽中涉及乘法或加總請一律用 `long long`！",
            "💡 **破局心法**：善用 C++ STL！例如 `std::lower_bound` 與 `std::priority_queue`，能大幅縮短你的程式碼長度與 Bug 發生率。"
        ]
    },

    "competitive_recursion_toi-primary": {
        title: "🥈 演算法進階：TOI 初選 / APCS 實作四級分以上強化路線",
        knowledgeMap: [
            { topic: "單源最短路徑 Dijkstra 演算法", status: "圖論必考", link: "shortest-path-basic", desc: "掌握帶權圖的最短路徑求解，並使用優先佇列進行 $O(E \\log V)$ 優化。" },
            { topic: "優先佇列 (std::priority_queue)", status: "高效動態維護", link: "priority-queues", desc: "動態取得極值，是許多貪心與圖論演算法的加速載體。" },
            { topic: "樹狀結構：直徑與樹高計算", status: "樹論基礎", link: "intro-tree", desc: "給定樹結構，能利用 DFS/BFS 兩次走訪求直徑或進行樹狀動態規劃。" }
        ],
        practiceStrategy: [
            "推薦平台：**CSES** (Graph Algorithms 前 10 題)、**AtCoder ABC** D-E 題。",
            "刷題目標：在 45 分鐘內能默寫出 Dijkstra 模板與樹直徑計算，且程式結構清晰無 Bug。"
        ],
        pitfallsAndTips: [
            "⚠️ **常見盲點 - 重邊與自環處理錯誤**：在建圖時，若沒處理重邊（應保留最小權重），會導致 Dijkstra 算出錯誤答案。建圖時請務必小心防範！",
            "💡 **破局心法**：Dijkstra 中放入 queue 的點若已被更新過（`dist[u] < d`），請直接 `continue;`，這是非常重要的常數優化！"
        ]
    },

    "competitive_algorithms_toi-camp": {
        title: "🥇 進軍選訓營：TOI 複選與國手選拔一階段修練藍圖",
        knowledgeMap: [
            { topic: "單調棧與單調佇列 (Monotonic Structures)", status: "高階優化核心", link: "monotonic-structures", desc: "利用單調性，在 $O(N)$ 線性時間內解決區間極值或下一個較大元素問題。" },
            { topic: "位元運算與狀態枚舉 (Bitmask DP)", status: "進階 DP 常客", link: "intro-bitwise", desc: "使用整數表示集合狀態，在 $O(2^N \\cdot N^2)$ 時間內求解旅行推銷員等問題。" },
            { topic: "經典與進階 DP (含區間 DP、樹狀 DP)", status: "分數分水嶺", link: "basic-dp", desc: "掌握區間合併 DP 與節點間相互依賴的樹狀動態規劃。" }
        ],
        practiceStrategy: [
            "推薦平台：**Codeforces** Div.2 C-E 題、**AtCoder** Educational DP Contest (前 15 題)。",
            "刷題指標：完成 AtCoder DP 專題至少 A-O 題，Codeforces Rating 衝刺目標為 1400 - 1600 (Specialist)。"
        ],
        pitfallsAndTips: [
            "⚠️ **常見盲點 - DP 轉移漏掉狀態**：在複雜 DP 中漏掉邊界狀態或未將初始值設為無限大，導致非法狀態轉移。推導轉移式時應在紙上完整列出狀態轉移圖。",
            "💡 **破局心法**：單調佇列/單調棧通常伴隨著「左右邊界第一個比自己大/小」的幾何特徵，看到此特徵請立即往單調結構思考！"
        ]
    },

    "competitive_advanced_toi-camp": {
        title: "🏆 榮耀巔峰：選訓營二階段與國手選拔衝刺藍圖",
        knowledgeMap: [
            { topic: "樹鏈剖分 (Heavy-Light Decomposition)", status: "巔峰級樹上演算法", link: "intro-tree", desc: "將樹剖分為數條重鏈，搭配線段樹實作 $O(\\log^2 N)$ 的樹上路徑修改與查詢。" },
            { topic: "字串匹配 KMP 與字典樹 (Trie)", status: "進階字串必學", link: "intro-sets-maps", desc: "理解失配指針 $next$ 陣列，以及高效前綴檢索字典樹。" },
            { topic: "網路流最大流 (Dinic's Algorithm)", status: "圖論高級模型", link: "intro-graphs", desc: "利用分層圖與當前弧優化求解最大流，並能靈活建圖轉化二分圖匹配等問題。" }
        ],
        practiceStrategy: [
            "推薦平台：**CSES Problem Set** (Advanced Techniques, String Algorithms, Range Queries)。",
            "刷題指標：完成 CSES 區間查詢與字串專題，Codeforces Rating 挑戰 1900+ (Candidate Master)。"
        ],
        pitfallsAndTips: [
            "⚠️ **常見盲點 - 模板依賴**：只會複製貼上樹鏈剖分或 Dinic 模板，但不知道演算法內部細節。一旦題目要求修改內部邏輯（例如在殘量網格上做 DFS）就會徹底卡關。必須手寫理解每一步！",
            "💡 **破局心法**：網路流題目的難點「95% 在於如何巧妙地建圖（源點、匯點、流量限制）」，平時應著重訓練建圖思維而非單純默寫 Dinic！"
        ]
    },

    // ----------------------------------------------------------------------
    // 預設與 Fallbacks
    // ----------------------------------------------------------------------
    "apcs_fallback": {
        title: "🎯 穩紮穩打：APCS 實作全方位衝刺計畫",
        knowledgeMap: [
            { topic: "C++ 基礎語法與迴圈控制", status: "核心", link: "intro-ds", desc: "掌握基本輸入輸出、條件分支與雙重迴圈。" },
            { topic: "基礎模擬與陣列操作", status: "必考", link: "simulation", desc: "熟練一維/二維陣列邊界處理，解決 Q1 基本模擬。" },
            { topic: "排序與貪心算法", status: "必考", link: "intro-greedy", desc: "學會用 `std::sort` 排序後，採取局部的最優解策略。" }
        ],
        practiceStrategy: [
            "推薦平台：**ZeroJudge** 歷屆 APCS 專區。",
            "刷題目標：累積解決 30 題歷屆實作題，專注拿下前兩題的滿分。"
        ],
        pitfallsAndTips: [
            "⚠️ **常見盲點**：急著寫程式而沒有先釐清變數範圍。請務必養成先寫虛擬碼的習慣。"
        ]
    },
    
    "competitive_fallback": {
        title: "⚔️ 競程修練：資訊競賽實作能力強化路線",
        knowledgeMap: [
            { topic: "時間複雜度與空間複雜度分析", status: "核心", link: "time-complexity", desc: "精確估算演算法在最差測資下的執行步數。" },
            { topic: "廣度與深度優先搜尋 (DFS/BFS)", status: "必備", link: "graph-traversal", desc: "精通圖與網格的搜尋遍歷、走訪 visited 狀態標記。" },
            { topic: "二分搜尋法 (Binary Search)", status: "必學", link: "binary-search", desc: "利用單調性在對數時間內尋找正確答案。" }
        ],
        practiceStrategy: [
            "推薦平台：**CSES Problem Set** 與 **AtCoder** ABC 題庫。",
            "刷題目標：至少解決 80 題經典演算法與資料結構題。"
        ],
        pitfallsAndTips: [
            "⚠️ **常見盲點**：遇到不會的題目太快看題解。應至少自己嘗試思考 30 分鐘以上，想盡各種暴力解法後再開啟題解。"
        ]
    }
};

// 輔助函式：根據 Target, Background, Goal 進行匹配並返回對應藍圖（含 Fallback 降級處理）
function getCoachBlueprint(target, background, goal) {
    const key = `${target}_${background}_${goal}`;
    if (COACH_BLUEPRINTS[key]) {
        return COACH_BLUEPRINTS[key];
    }
    
    // Fallback 1: 匹配特定目標與背景
    const fallbackKey1 = `${target}_${background}_any`;
    for (const k in COACH_BLUEPRINTS) {
        if (k.startsWith(`${target}_${background}_`)) {
            return COACH_BLUEPRINTS[k];
        }
    }
    
    // Fallback 2: 匹配特定目標與目標分數
    for (const k in COACH_BLUEPRINTS) {
        if (k.startsWith(`${target}_`) && k.endsWith(`_${goal}`)) {
            return COACH_BLUEPRINTS[k];
        }
    }
    
    // Fallback 3: 全域目標 Fallback
    return COACH_BLUEPRINTS[`${target}_fallback`] || COACH_BLUEPRINTS["apcs_fallback"];
}
