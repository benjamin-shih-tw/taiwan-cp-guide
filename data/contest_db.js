// ==========================================================================
// 🏆 台灣資訊學科競賽與檢定大綱資料庫 (Taiwan CP Competitions Syllabus & Problem Scopes)
// ==========================================================================

const CONTEST_DATA = {
  // ------------------------------------------------------------------------
  // 1. APCS 檢定組 (大學程式設計先修檢測)
  // ------------------------------------------------------------------------
  "apcs": {
    name: "🎯 APCS 檢定組",
    desc: "針對台灣教育部主辦之 APCS 大學程式設計先修檢測，對齊 AP325 經典教材與 ZeroJudge 歷屆真題，精準劃分各級分核心考點與推薦刷題範圍。",
    levels: [
      {
        levelName: "🟢 Q1 基礎模擬與陣列操作 (實作 2 級分基石)",
        ap325Focus: "Ch1 遞迴與分治中的基本概念、簡單的下標運算與陣列初始化。",
        zjRange: "主要是歷屆實作題的第一題，難度介於基本控制結構到一維陣列處理。",
        topics: [
          "基本輸入輸出格式 (快讀、多筆輸入處理)",
          "字串與字元處理 (秘密差、字串翻轉、ASCII 運算)",
          "一維陣列基礎操作 (學生成績排序指標、陣列元素搜尋與統計)",
          "條件分支與基本迴圈結構 (if-else、for、while 邏輯控制)"
        ],
        problems: [
          { id: "zj-g595", name: "ZeroJudge g595: 1. 築牆 (APCS 2021-11)", url: "https://zerojudge.tw/ShowProblem?problemid=g595" },
          { id: "zj-f605", name: "ZeroJudge f605: 1. 購買力判定 (APCS 2020-11)", url: "https://zerojudge.tw/ShowProblem?problemid=f605" },
          { id: "zj-c290", name: "ZeroJudge c290: 1. 秘密差 (APCS 2017-03)", url: "https://zerojudge.tw/ShowProblem?problemid=c290" },
          { id: "zj-b964", name: "ZeroJudge b964: 1. 成績指標 (APCS 2016-03)", url: "https://zerojudge.tw/ShowProblem?problemid=b964" }
        ]
      },
      {
        levelName: "🔵 Q2 二維矩陣、自訂排序與基本貪心 (實作 3 級分安全門檻)",
        ap325Focus: "Ch2 排序與二分搜尋 (偏向基本排序與自訂 struct 排序)；Ch3 貪心演算法前半段。",
        zjRange: "歷屆實作題的第二題。特別著重較複雜的二維網格模擬、多條件排序與指標單調移動。",
        topics: [
          "二維陣列與邊界防禦宣告 (二維矩陣翻轉、旋轉、魔王迷宮模擬)",
          "C++ STL `std::sort` 配合自訂結構體 `struct` 與比較器 `cmp`",
          "基本單調性雙指標與滑動視窗 (Two Pointers / Sliding Window)",
          "基礎貪心策略 (Greedy) 排程 (線段覆蓋、活動安排等問題)"
        ],
        problems: [
          { id: "zj-g276", name: "ZeroJudge g276: 2. 魔王迷宮 (APCS 2021-09)", url: "https://zerojudge.tw/ShowProblem?problemid=g276" },
          { id: "zj-f606", name: "ZeroJudge f606: 2. 流量估算 (APCS 2020-11)", url: "https://zerojudge.tw/ShowProblem?problemid=f606" },
          { id: "zj-c291", name: "ZeroJudge c291: 2. 小群體 (APCS 2017-03)", url: "https://zerojudge.tw/ShowProblem?problemid=c291" },
          { id: "zj-b965", name: "ZeroJudge b965: 2. 矩陣轉換 (APCS 2016-03)", url: "https://zerojudge.tw/ShowProblem?problemid=b965" }
        ]
      },
      {
        levelName: "🟡 Q3 遞迴分治、基本圖遍歷與經典 DP (實作 4 級分資工門檻)",
        ap325Focus: "Ch1 遞迴與分治法全章；Ch4 動態規劃 (DP) 基本模型；Ch5 圖與樹的基本遍歷與表達。",
        zjRange: "歷屆實作題的第三題。包含複雜的深度優先搜尋 (DFS)、廣度優先搜尋 (BFS)、二分搜尋答案法以及經典 DP 的狀態轉移方程式推導。",
        topics: [
          "遞迴回溯法 (Backtracking) 用以枚舉子集 ($2^N$)、排列 ($N!$) 與剪枝優化",
          "二分搜尋答案法 (Binary Search on Answer, 如圓環出口)",
          "基本圖論鄰接串列建構與 DFS/BFS 走訪 (連通塊計算、網格 Flood Fill)",
          "經典動態規劃基本功 (LIS、LCS、0/1 背包問題、找零錢 DP)"
        ],
        problems: [
          { id: "zj-f314", name: "ZeroJudge f314: 3. 勇者修練 (APCS 2020-07)", url: "https://zerojudge.tw/ShowProblem?problemid=f314" },
          { id: "zj-f581", name: "ZeroJudge f581: 3. 圓環出口 (APCS 2020-10)", url: "https://zerojudge.tw/ShowProblem?problemid=f581" },
          { id: "zj-h028", name: "ZeroJudge h028: 3. 砍樹 (APCS 2020-01 - 結合單調棧思維)", url: "https://zerojudge.tw/ShowProblem?problemid=h028" },
          { id: "zj-c292", name: "ZeroJudge c292: 3. 數字龍捲風 (APCS 2017-03)", url: "https://zerojudge.tw/ShowProblem?problemid=c292" }
        ]
      },
      {
        levelName: "🔴 Q4 進階樹論、高級 DP 與單調結構 (實作 5 級分巔峰挑戰)",
        ap325Focus: "Ch4 進階動態規劃 (滾動陣列與單調性優化)；Ch5 樹狀結構演算法；Ch6 進階圖論。",
        zjRange: "歷屆實作題的第四題。為 APCS 的「守門員題」，包含樹狀動態規劃 (Tree DP)、單調棧/單調佇列、區間動態規劃、Dijkstra 最短路徑等中高階競程核心技術。",
        topics: [
          "樹論基礎操作與 DFS 走訪 (建鄰接表、求樹的高度/深度、二遍 DFS 求樹的直徑)",
          "樹狀動態規劃 (Tree DP，如血緣關係、樹上最大獨立集)",
          "單調棧與單調佇列優化 (Monotonic Stack/Queue，解決下一個較大元素、區間極值問題)",
          "高難度狀態壓縮動態規劃 (Bitmask DP)、區間 DP、Dijkstra 最短路徑與並查集 (DSU) 的靈活應用"
        ],
        problems: [
          { id: "zj-g278", name: "ZeroJudge g278: 4. 特殊長度區間 (APCS 2021-09)", url: "https://zerojudge.tw/ShowProblem?problemid=g278" },
          { id: "zj-f608", name: "ZeroJudge f608: 4. 飛彈攔截 (APCS 2020-11 - 二維 LIS / 二分搜)", url: "https://zerojudge.tw/ShowProblem?problemid=f608" },
          { id: "zj-c297", name: "ZeroJudge c297: 4. 棒球遊戲 (APCS 2016-10 - 巨型複雜模擬)", url: "https://zerojudge.tw/ShowProblem?problemid=c297" },
          { id: "zj-b967", name: "ZeroJudge b967: 4. 血緣關係 (APCS 2016-03 - 樹的直徑)", url: "https://zerojudge.tw/ShowProblem?problemid=b967" }
        ]
      }
    ]
  },

  // ------------------------------------------------------------------------
  // 2. TOI 一階段選拔 (台灣資訊奧林匹亞複選初試)
  // ------------------------------------------------------------------------
  "toi": {
    name: "🥈 TOI 階段選拔一階",
    desc: "針對進入 TOI 複選一階段（全國前 100 名高中生）的頂尖選拔賽。考題難度約等於 USACO Gold 至 Platinum 級別，著重紮實的進階圖論、區間資料結構、與全方位 DP 狀態推導能力。",
    levels: [
      {
        levelName: "⚡ A. 區間查詢與經典資料結構 (Range Queries & DS)",
        ap325Focus: "Ch4 / Ch5 中關於區間離散化與樹結構部分。",
        zjRange: "ZeroJudge 中帶有 `toi` 初選/複選前綴的區間操作題。",
        topics: [
          "線段樹 (Segment Tree) 支援單點修改、區間查詢、懶標記 (Lazy Propagation) 區間加值",
          "樹狀陣列 (Fenwick Tree / Binary Indexed Tree, BIT) 支援點改區查、區改點查",
          "稀疏表 (Sparse Table) 實作 $O(N \\log N)$ 預處理 $O(1)$ 靜態 RMQ 查詢",
          "並查集 (DSU) 的路徑壓縮、啟發式合併 (秩合併) 與動態連通性維護"
        ],
        problems: [
          { id: "zj-d539", name: "ZeroJudge d539: 區間最大值 (經典 RMQ / 線段樹)", url: "https://zerojudge.tw/ShowProblem?problemid=d539" },
          { id: "zj-e346", name: "ZeroJudge e346: 區間和 (BIT / 樹狀陣列練習)", url: "https://zerojudge.tw/ShowProblem?problemid=e346" },
          { id: "zj-f315", name: "ZeroJudge f315: 4. 排隊 (BIT / 逆序數對變形)", url: "https://zerojudge.tw/ShowProblem?problemid=f315" }
        ]
      },
      {
        levelName: "🌐 B. 進階圖論與樹上問題 (Advanced Graph & Trees)",
        ap325Focus: "Ch5 / Ch6 全方位進階圖論，包含最短路徑與強連通分量。",
        zjRange: "TOI 歷屆圖論題、CSES Graph Algorithms 專題。",
        topics: [
          "單源最短路徑 Dijkstra 演算法 (結合 `std::priority_queue` 優化至 $O(E \\log V)$)",
          "最小生成樹 Kruskal 與 Prim 演算法 (結合並查集判環與堆積優化)",
          "最近公共祖先 (LCA) 倍增法求解與樹上兩點距離運算",
          "強連通分量 (SCC，Tarjan 縮點演算法與 Kosaraju 雙向 DFS 演算法)",
          "拓樸排序 (Topology Sort) 與有向無環圖 (DAG) 上的動態規劃"
        ],
        problems: [
          { id: "zj-a597", name: "ZeroJudge a597: 森林佔地面積 (BFS/DFS 連通塊求解)", url: "https://zerojudge.tw/ShowProblem?problemid=a597" },
          { id: "zj-c268", name: "ZeroJudge c268: 簡單的圖論問題？(Pigeonhole / 歐拉迴路基礎)", url: "https://zerojudge.tw/ShowProblem?problemid=c268" },
          { id: "zj-d365", name: "ZeroJudge d365: Flood Fill 區域計數", url: "https://zerojudge.tw/ShowProblem?problemid=d365" }
        ]
      },
      {
        levelName: "📈 C. 進階與高階動態規劃 (Advanced DP)",
        ap325Focus: "Ch4 動態規劃中後半段：樹狀 DP、區間 DP、狀態壓縮與滾動優化。",
        zjRange: "AtCoder Educational DP Contest 練習集、TOI 歷屆 DP 真題。",
        topics: [
          "最長遞增子序列 (LIS) 結合二分搜優化至 $O(N \\log N)$",
          "區間動態規劃 (Interval DP，如矩陣鏈乘法、石子合併、括號序列)",
          "狀態壓縮動態規劃 (Bitmask DP / 狀壓 DP，如 TSP 旅行推銷員、集合覆蓋)",
          "樹狀動態規劃 (Tree DP，包含直徑維護、樹上背包問題)"
        ],
        problems: [
          { id: "zj-d054", name: "ZeroJudge d054: 骨牌鋪法 (經典遞迴狀態遞推 / DP)", url: "https://zerojudge.tw/ShowProblem?problemid=d054" },
          { id: "zj-d652", name: "ZeroJudge d652: 貪食蛇的晚餐 (區間 DP 經典題型)", url: "https://zerojudge.tw/ShowProblem?problemid=d652" },
          { id: "zj-e357", name: "ZeroJudge e357: 遞迴函數求值 (DP 記憶化優化)", url: "https://zerojudge.tw/ShowProblem?problemid=e357" }
        ]
      }
    ]
  },

  // ------------------------------------------------------------------------
  // 3. 全國高中學科能力競賽 (資訊學科)
  // ------------------------------------------------------------------------
  "olympiad": {
    name: "🥇 全國高中學科能力競賽",
    desc: "台灣高中生資訊學科的全國頂尖決賽。考試特色為「限時極短 (約 3 小時)」、「題數多」、「著重極速實作與 Ad-hoc 思維偏序」，常出現計算幾何基礎與特殊二維枚舉。",
    levels: [
      {
        levelName: "📐 A. 計算幾何與二維偏序基礎 (Geometry & Range Operations)",
        ap325Focus: "Ch2 排序應用；Ch3 貪心與二維坐標排序。",
        zjRange: "全國學科能力競賽決賽與北區/中區/南區分區賽複試題目。",
        topics: [
          "二維凸包 (Convex Hull，Andrew's Monotone Chain 掃描演算法)",
          "向量基礎與幾何判定 (叉積 Cross Product 判定順逆時針與線段相交)",
          "二維偏序與座標離散化 (將無限連續坐標映射至有限離散整數陣列)",
          "二維網格快速掃描線技術 (Sweep Line，解決區間聯集面積、線段合併)"
        ],
        problems: [
          { id: "zj-e508", name: "ZeroJudge e508: 二維凸包經典題型 (Andrew's Monotone Chain)", url: "https://zerojudge.tw/ShowProblem?problemid=e508" },
          { id: "zj-d545", name: "ZeroJudge d545: 2. 垃圾郵件過濾 (雙指標與統計)", url: "https://zerojudge.tw/ShowProblem?problemid=d545" },
          { id: "zj-f377", name: "ZeroJudge f377: 中序轉後序 (基礎資料結構解析器)", url: "https://zerojudge.tw/ShowProblem?problemid=f377" }
        ]
      },
      {
        levelName: "🧩 B. Ad-hoc 構造題與博弈思維 (Ad-hoc & Game Theory)",
        ap325Focus: "Ch1 / Ch2 中對於演算法創意構造的思維引導。",
        zjRange: "競賽中無需複雜模板但要求極強思維與特例觀察的題目。",
        topics: [
          "Ad-hoc 構造法 (根據特定規律構造滿足條件的數列或圖結構)",
          "基本博弈論與狀態轉移 (Nim 遊戲與 XOR 和、SG 值的計算與勝負手判定)",
          "奇偶性分析 (Parity) 與對稱性分析技巧",
          "位元運算的高效優化 (Bitwise operations，利用整數遮罩取代 vector 進行常數級加速)"
        ],
        problems: [
          { id: "zj-a010", name: "ZeroJudge a010: 因數分解 (基礎數論構造與輸出)", url: "https://zerojudge.tw/ShowProblem?problemid=a010" },
          { id: "zj-a015", name: "ZeroJudge a015: 矩陣翻轉 (Ad-hoc 矩陣轉換)", url: "https://zerojudge.tw/ShowProblem?problemid=a015" },
          { id: "zj-b513", name: "ZeroJudge b513: 質數判定 (Miller-Rabin 數論思維基礎)", url: "https://zerojudge.tw/ShowProblem?problemid=b513" }
        ]
      }
    ]
  }
};
