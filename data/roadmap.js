// 台灣競程修練指南 (Taiwan CP Guide) - 學習地圖數據
// 參照 USACO Guide (Bronze → Silver → Gold → Platinum → Advanced) 全模組架構
// 採全域物件載入，避免 file:// 協議下 ESM 的 CORS 限制

const ROADMAP_DATA = [
  {
    "levelId": "apcs-basic",
    "levelName": "🟢 啟航級 (APCS 基礎 / USACO Bronze)",
    "levelDesc": "適合零基礎或剛接觸程式的選手。目標：掌握 C++ 基礎、枚舉暴力、模擬、排序與基本圖論概念，達到 APCS 實作三級。",
    "color": "#10B981",
    "accentGlow": "rgba(16, 185, 129, 0.15)",
    "topics": [
      {
        "id": "time-complexity",
        "title": "時間複雜度分析 (Time Complexity)",
        "desc": "學習以大 $O$ 符號（如 $O(N)$、$O(N \\log N)$）估計演算法的時間與空間效率，判斷解法是否能在 $1$ 秒（約 $10^8$ 次運算）的時限內完成。這是競程最核心的底層思維。",
        "resources": [
          {
            "name": "USACO Guide - Time Complexity",
            "url": "https://usaco.guide/bronze/time-comp",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 時間複雜度",
            "url": "https://oi-wiki.org/basic/complexity/",
            "type": "wiki"
          },
          {
            "name": "WiwiHo 的競程筆記 - 複雜度分析",
            "url": "https://cp.wiwiho.me/complexity/",
            "type": "article"
          }
        ],
        "problems": [
          {
            "id": "zj-a001",
            "name": "ZeroJudge a001: 哈囉",
            "platform": "ZeroJudge",
            "url": "https://zerojudge.tw/ShowProblem?problemid=a001",
            "difficulty": "Easy"
          },
          {
            "id": "tioj-1001",
            "name": "TIOJ 1001: Hello World",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/1001",
            "difficulty": "Easy"
          },
          {
            "id": "cf-1000a",
            "name": "Codeforces 1000A: Codehorses",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1000/A",
            "difficulty": "Easy"
          }
        ]
      },
      {
        "id": "intro-ds",
        "title": "基礎資料結構：動態陣列、pair、struct",
        "desc": "學習競程最常用的基礎容器：`vector`、`pair`、`tuple`，以及如何使用 `struct` 自訂資料型別組合資料。",
        "resources": [
          {
            "name": "USACO Guide - Introduction to Data Structures",
            "url": "https://usaco.guide/bronze/intro-ds",
            "type": "guide"
          },
          {
            "name": "WiwiHo 的競程筆記 - C++ STL 介紹",
            "url": "https://cp.wiwiho.me/cpp-stl/",
            "type": "article"
          },
          {
            "name": "AP325 - 第一章：基本語法與練習",
            "url": "https://sites.google.com/site/apcs325/",
            "type": "book"
          }
        ],
        "problems": [
          {
            "id": "zj-a002",
            "name": "ZeroJudge a002: 簡單 I/O",
            "platform": "ZeroJudge",
            "url": "https://zerojudge.tw/ShowProblem?problemid=a002",
            "difficulty": "Easy"
          },
          {
            "id": "zj-a915",
            "name": "ZeroJudge a915: 二維點排序",
            "platform": "ZeroJudge",
            "url": "https://zerojudge.tw/ShowProblem?problemid=a915",
            "difficulty": "Easy"
          },
          {
            "id": "cses-1621",
            "name": "CSES 1621: Distinct Numbers",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1621",
            "difficulty": "Easy"
          }
        ]
      },
      {
        "id": "simulation",
        "title": "基礎模擬 (Simulation)",
        "desc": "直接按照題目規則模擬操作流程，是 APCS 與 USACO Bronze 最高頻的題型。訓練「讀懂題目、轉換成程式」的基本能力。",
        "resources": [
          {
            "name": "USACO Guide - Simulation",
            "url": "https://usaco.guide/bronze/simulation",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 模擬問題",
            "url": "https://oi-wiki.org/basic/simulate/",
            "type": "wiki"
          },
          {
            "name": "APCS 歷屆試題",
            "url": "https://apcs.csie.ntnu.edu.tw/",
            "type": "article"
          }
        ],
        "problems": [
          {
            "id": "zj-b964",
            "name": "ZeroJudge b964: 1. 成績指標",
            "platform": "ZeroJudge",
            "url": "https://zerojudge.tw/ShowProblem?problemid=b964",
            "difficulty": "Easy"
          },
          {
            "id": "zj-f605",
            "name": "ZeroJudge f605: 1. 購買力",
            "platform": "ZeroJudge",
            "url": "https://zerojudge.tw/ShowProblem?problemid=f605",
            "difficulty": "Easy"
          },
          {
            "id": "cf-1030a",
            "name": "Codeforces 1030A: In Search of an Easy Problem",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1030/A",
            "difficulty": "Easy"
          }
        ]
      },
      {
        "id": "intro-sorting",
        "title": "排序與 STL (Sorting & STL)",
        "desc": "使用 `std::sort` 進行自訂比較排序，掌握 `pair`、`struct` 的排序方式，以及穩定排序的概念。",
        "resources": [
          {
            "name": "USACO Guide - Introduction to Sorting",
            "url": "https://usaco.guide/bronze/intro-sorting",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 排序",
            "url": "https://oi-wiki.org/basic/sort-intro/",
            "type": "wiki"
          },
          {
            "name": "WiwiHo 的競程筆記 - 排序",
            "url": "https://cp.wiwiho.me/sort/",
            "type": "article"
          }
        ],
        "problems": [
          {
            "id": "zj-e283",
            "name": "ZeroJudge e283: 小明與客家問候",
            "platform": "ZeroJudge",
            "url": "https://zerojudge.tw/ShowProblem?problemid=e283",
            "difficulty": "Easy"
          },
          {
            "id": "zj-c291",
            "name": "ZeroJudge c291: 2. 小群體",
            "platform": "ZeroJudge",
            "url": "https://zerojudge.tw/ShowProblem?problemid=c291",
            "difficulty": "Medium"
          },
          {
            "id": "cses-1622",
            "name": "CSES 1622: Creating Strings",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1622",
            "difficulty": "Medium"
          }
        ]
      },
      {
        "id": "intro-sets-maps",
        "title": "集合與映射 (Sets & Maps)",
        "desc": "利用 `std::set`、`std::map`、`std::unordered_map` 維護不重複集合或鍵值對應，用於快速查找、頻率統計。",
        "resources": [
          {
            "name": "USACO Guide - Introduction to Sets & Maps",
            "url": "https://usaco.guide/bronze/intro-sets",
            "type": "guide"
          },
          {
            "name": "OI Wiki - STL 容器",
            "url": "https://oi-wiki.org/lang/csl/container/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "zj-c290",
            "name": "ZeroJudge c290: 1. 秘密差",
            "platform": "ZeroJudge",
            "url": "https://zerojudge.tw/ShowProblem?problemid=c290",
            "difficulty": "Medium"
          },
          {
            "id": "cses-1090",
            "name": "CSES 1090: Ferris Wheel",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1090",
            "difficulty": "Easy"
          },
          {
            "id": "cf-1203c",
            "name": "Codeforces 1203C: Common Divisors",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1203/C",
            "difficulty": "Easy"
          }
        ]
      },
      {
        "id": "enumeration-bruteforce",
        "title": "枚舉與完全搜索 (Complete Search)",
        "desc": "在時限內暴力列舉所有可能解。包含單層迴圈枚舉、雙層枚舉，以及基礎剪枝技術加速搜索。",
        "resources": [
          {
            "name": "USACO Guide - Basic Complete Search",
            "url": "https://usaco.guide/bronze/intro-complete",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 暴力枚舉",
            "url": "https://oi-wiki.org/basic/enumerate/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "zj-c294",
            "name": "ZeroJudge c294: 1. 三角形辨別",
            "platform": "ZeroJudge",
            "url": "https://zerojudge.tw/ShowProblem?problemid=c294",
            "difficulty": "Easy"
          },
          {
            "id": "cses-1092",
            "name": "CSES 1092: Two Knights",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1092",
            "difficulty": "Medium"
          },
          {
            "id": "cf-1512b",
            "name": "Codeforces 1512B: Almost Rectangle",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1512/B",
            "difficulty": "Easy"
          }
        ]
      },
      {
        "id": "complete-rec",
        "title": "遞迴完全搜索與排列組合生成",
        "desc": "利用遞迴產生所有排列（permutations）、組合（subsets），解決需要窮舉所有可能狀態的難題。",
        "resources": [
          {
            "name": "USACO Guide - Complete Search with Recursion",
            "url": "https://usaco.guide/bronze/complete-rec",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 遞迴 & 回溯",
            "url": "https://oi-wiki.org/basic/recursion/",
            "type": "wiki"
          },
          {
            "name": "AP325 - 第二章：遞迴",
            "url": "https://sites.google.com/site/apcs325/",
            "type": "book"
          }
        ],
        "problems": [
          {
            "id": "zj-c295",
            "name": "ZeroJudge c295: 2. 最大和",
            "platform": "ZeroJudge",
            "url": "https://zerojudge.tw/ShowProblem?problemid=c295",
            "difficulty": "Medium"
          },
          {
            "id": "zj-f640",
            "name": "ZeroJudge f640: 3. 遞迴函數求值",
            "platform": "ZeroJudge",
            "url": "https://zerojudge.tw/ShowProblem?problemid=f640",
            "difficulty": "Medium"
          },
          {
            "id": "cses-1623",
            "name": "CSES 1623: Apple Division",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1623",
            "difficulty": "Easy",
            "editorialUrl": "https://cp.wiwiho.me/recursion/"
          }
        ]
      },
      {
        "id": "prefix-sums",
        "title": "前綴和 (Prefix Sums)",
        "desc": "預處理陣列前綴和，使區間求和查詢從 $O(N)$ 降為 $O(1)$。可推廣至 2D 前綴和、差分陣列（用於 $O(1)$ 區間加值）。",
        "resources": [
          {
            "name": "USACO Guide - Prefix Sums",
            "url": "https://usaco.guide/silver/prefix-sums",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 前綴和與差分",
            "url": "https://oi-wiki.org/basic/prefix-sum/",
            "type": "wiki"
          },
          {
            "name": "AP325 - 第一章中段：前綴和",
            "url": "https://sites.google.com/site/apcs325/",
            "type": "book"
          }
        ],
        "problems": [
          {
            "id": "cf-1399a",
            "name": "Codeforces 1399A: Remove Smallest",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1399/A",
            "difficulty": "Easy"
          },
          {
            "id": "zj-c296",
            "name": "ZeroJudge c296: 3. 派對客人",
            "platform": "ZeroJudge",
            "url": "https://zerojudge.tw/ShowProblem?problemid=c296",
            "difficulty": "Medium"
          },
          {
            "id": "cf-1442a",
            "name": "Codeforces 1442A: Extreme Subtraction",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1442/A",
            "difficulty": "Easy"
          }
        ]
      },
      {
        "id": "intro-greedy",
        "title": "貪心算法入門 (Intro to Greedy)",
        "desc": "每一步選擇當下最優的決策，累積達到全域最優。經典問題：活動安排、硬幣兌換、最大不重疊區間數。",
        "resources": [
          {
            "name": "USACO Guide - Introduction to Greedy Algorithms",
            "url": "https://usaco.guide/bronze/intro-greedy",
            "type": "guide"
          },
          {
            "name": "AP325 - 第三章中段：貪心演算法",
            "url": "https://sites.google.com/site/apcs325/",
            "type": "book"
          },
          {
            "name": "OI Wiki - 貪心",
            "url": "https://oi-wiki.org/basic/greedy/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "zj-f579",
            "name": "ZeroJudge f579: 1. 幼兒園遊戲",
            "platform": "ZeroJudge",
            "url": "https://zerojudge.tw/ShowProblem?problemid=f579",
            "difficulty": "Easy"
          },
          {
            "id": "cses-1629",
            "name": "CSES 1629: Movie Festival",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1629",
            "difficulty": "Easy"
          },
          {
            "id": "cf-1201b",
            "name": "Codeforces 1201B: Zero or One",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1201/B",
            "difficulty": "Easy"
          }
        ]
      },
      {
        "id": "intro-graphs",
        "title": "圖論入門：概念與建圖 (Intro to Graphs)",
        "desc": "介紹圖的基本概念（點、邊、有向/無向圖），以及三種常見的建圖方式：鄰接矩陣、鄰接串列、邊列表。",
        "resources": [
          {
            "name": "USACO Guide - Introduction to Graphs",
            "url": "https://usaco.guide/bronze/intro-graphs",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 圖論相關概念",
            "url": "https://oi-wiki.org/graph/concept/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cf-977e",
            "name": "Codeforces 977E: Cyclic Components",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/977/E",
            "difficulty": "Medium"
          },
          {
            "id": "cses-1666",
            "name": "CSES 1666: Building Roads",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1666",
            "difficulty": "Easy"
          },
          {
            "id": "zj-b263",
            "name": "ZeroJudge b263: 捷運",
            "platform": "ZeroJudge",
            "url": "https://zerojudge.tw/ShowProblem?problemid=b263",
            "difficulty": "Easy"
          }
        ]
      },
      {
        "id": "rect-geo",
        "title": "矩形幾何 (Rectangle Geometry)",
        "desc": "處理座標軸對齊的矩形問題：矩形相交判定、聯集面積計算、點在矩形內部的判斷。APCS 常見幾何類型。",
        "resources": [
          {
            "name": "USACO Guide - Rectangle Geometry",
            "url": "https://usaco.guide/bronze/rect-geo",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 二維計算幾何基礎",
            "url": "https://oi-wiki.org/geometry/2d/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "zj-c297",
            "name": "ZeroJudge c297: 4. 棒球遊戲",
            "platform": "ZeroJudge",
            "url": "https://zerojudge.tw/ShowProblem?problemid=c297",
            "difficulty": "Hard"
          },
          {
            "id": "cses-1084",
            "name": "CSES 1084: Apartments",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1084",
            "difficulty": "Easy"
          },
          {
            "id": "cf-546d",
            "name": "Codeforces 546D: Queue (矩形模擬)",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/546/D",
            "difficulty": "Medium"
          }
        ]
      },
      {
        "id": "ad-hoc",
        "title": "創意與 Ad Hoc 題型",
        "desc": "沒有固定解題框架、需要依靠觀察力與創意的題目。此類題型訓練你從數學規律或直覺推導出高效解法。",
        "resources": [
          {
            "name": "USACO Guide - Ad Hoc Problems",
            "url": "https://usaco.guide/bronze/ad-hoc",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 特殊問題",
            "url": "https://oi-wiki.org/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cf-1368b",
            "name": "Codeforces 1368B: Codeforces Subsequences",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1368/B",
            "difficulty": "Easy"
          },
          {
            "id": "cf-1335b",
            "name": "Codeforces 1335B: Construct the String",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1335/B",
            "difficulty": "Easy"
          },
          {
            "id": "zj-a285",
            "name": "ZeroJudge a285: 找出前三名",
            "platform": "ZeroJudge",
            "url": "https://zerojudge.tw/ShowProblem?problemid=a285",
            "difficulty": "Easy"
          }
        ]
      }
    ]
  },
  {
    "levelId": "toi-silver",
    "levelName": "🔵 突破級 (TOI 複選 / APCS 進階 / USACO Silver)",
    "levelDesc": "適合已掌握基本語法，準備衝刺 TOI 複選、APCS 實作四至五級的選手。目標：前綴和、BFS/DFS、二分搜、雙指針與基礎 DP。",
    "color": "#3B82F6",
    "accentGlow": "rgba(59, 130, 246, 0.15)",
    "topics": [
      {
        "id": "prefix-sums",
        "title": "前綴和 (Prefix Sums)",
        "desc": "預處理陣列前綴和，使區間求和查詢從 $O(N)$ 降為 $O(1)$。可推廣至 2D 前綴和、差分陣列（用於 $O(1)$ 區間加值）。",
        "resources": [
          {
            "name": "USACO Guide - Prefix Sums",
            "url": "https://usaco.guide/silver/prefix-sums",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 前綴和",
            "url": "https://oi-wiki.org/basic/prefix-sum/",
            "type": "wiki"
          },
          {
            "name": "AP325 - 第一章中段：前綴和",
            "url": "https://sites.google.com/site/apcs325/",
            "type": "book"
          }
        ],
        "problems": [
          {
            "id": "cses-1646",
            "name": "CSES 1646: Static Range Sum Queries",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1646",
            "difficulty": "Easy",
            "editorialUrl": "https://cp.wiwiho.me/prefix-sum/"
          },
          {
            "id": "zj-g597",
            "name": "ZeroJudge g597: 3. 生產線優化",
            "platform": "ZeroJudge",
            "url": "https://zerojudge.tw/ShowProblem?problemid=g597",
            "difficulty": "Medium"
          },
          {
            "id": "cf-295a",
            "name": "Codeforces 295A: Greg and Array",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/295/A",
            "difficulty": "Medium"
          }
        ]
      },
      {
        "id": "more-prefix-sums",
        "title": "差分與進階前綴和應用",
        "desc": "差分陣列 (Difference Array) 實現 $O(1)$ 區間加值、$O(N)$ 還原；2D 差分；以及前綴和結合二分搜的進階技巧。",
        "resources": [
          {
            "name": "USACO Guide - More on Prefix Sums",
            "url": "https://usaco.guide/silver/more-prefix-sums",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 差分",
            "url": "https://oi-wiki.org/basic/prefix-sum/#%E5%B7%AE%E5%88%86",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1652",
            "name": "CSES 1652: Forest Queries II",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1652",
            "difficulty": "Medium"
          },
          {
            "id": "cf-816b",
            "name": "Codeforces 816B: Karen and Coffee",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/816/B",
            "difficulty": "Hard"
          },
          {
            "id": "zj-h084",
            "name": "ZeroJudge h084: 4. 牆上塗鴉",
            "platform": "ZeroJudge",
            "url": "https://zerojudge.tw/ShowProblem?problemid=h084",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "two-pointers",
        "prerequisites": [
          "prefix-sums",
          "intro-ds"
        ],
        "title": "雙指針與滑動視窗 (Two Pointers)",
        "desc": "兩個指針同向或異向滑動，將原本 $O(N^2)$ 的暴力區間問題優化至 $O(N)$。應用：最長不重複子字串、兩數之和、最小覆蓋子陣列。",
        "resources": [
          {
            "name": "USACO Guide - Two Pointers",
            "url": "https://usaco.guide/silver/two-pointers",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 雙指針",
            "url": "https://oi-wiki.org/basic/two-pointer/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1640",
            "name": "CSES 1640: Sum of Two Values",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1640",
            "difficulty": "Easy",
            "editorialUrl": "https://cp.wiwiho.me/two-pointer/"
          },
          {
            "id": "cses-1660",
            "name": "CSES 1660: Subarray Sums I",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1660",
            "difficulty": "Medium"
          },
          {
            "id": "cf-1041b",
            "name": "Codeforces 1041B: Strings Equalizer",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1041/B",
            "difficulty": "Easy"
          }
        ]
      },
      {
        "id": "binary-search",
        "prerequisites": [
          "time-complexity"
        ],
        "title": "二分搜尋 (Binary Search on Answer)",
        "desc": "對數時間複雜度的極致搜索。除搜尋有序陣列外，「對答案二分搜」更是競程中極重要的思路：先設定答案範圍，再用 check 函式驗證可行性。",
        "resources": [
          {
            "name": "USACO Guide - Binary Search",
            "url": "https://usaco.guide/silver/binary-search",
            "type": "guide"
          },
          {
            "name": "AP325 - 第三章：折半搜尋與二分搜",
            "url": "https://sites.google.com/site/apcs325/",
            "type": "book"
          },
          {
            "name": "OI Wiki - 二分",
            "url": "https://oi-wiki.org/basic/binary/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1620",
            "name": "CSES 1620: Factory Machines",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1620",
            "difficulty": "Medium",
            "editorialUrl": "https://cp.wiwiho.me/binary-search/"
          },
          {
            "id": "zj-f608",
            "name": "ZeroJudge f608: 4. 飛過城市",
            "platform": "ZeroJudge",
            "url": "https://zerojudge.tw/ShowProblem?problemid=f608",
            "difficulty": "Hard"
          },
          {
            "id": "cf-1213g",
            "name": "Codeforces 1213G: Distinctification (二分搜應用)",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1034/C",
            "difficulty": "Medium"
          }
        ]
      },
      {
        "id": "binary-search-sorted-array",
        "title": "有序陣列的二分搜應用",
        "desc": "利用 `lower_bound`、`upper_bound` 在已排序容器中高效查找第一個 ≥ x 或 > x 的位置。配合離散化技術，是線段樹與 BIT 的常用前置技巧。",
        "resources": [
          {
            "name": "USACO Guide - Binary Search on Sorted Arrays",
            "url": "https://usaco.guide/silver/binary-search-sorted-array",
            "type": "guide"
          },
          {
            "name": "WiwiHo 的競程筆記 - 二分搜",
            "url": "https://cp.wiwiho.me/binary-search/",
            "type": "article"
          }
        ],
        "problems": [
          {
            "id": "cses-1074",
            "name": "CSES 1074: Stick Lengths",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1074",
            "difficulty": "Medium"
          },
          {
            "id": "cf-1520d",
            "name": "Codeforces 1520D: Nezzar and Nice Beatmap",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1520/D",
            "difficulty": "Easy"
          },
          {
            "id": "zj-f581",
            "name": "ZeroJudge f581: 3. 圓環出口",
            "platform": "ZeroJudge",
            "url": "https://zerojudge.tw/ShowProblem?problemid=f581",
            "difficulty": "Medium"
          }
        ]
      },
      {
        "id": "sorting-custom",
        "title": "自訂排序與貪心進階 (Sorting-based Greedy)",
        "desc": "設計特定的比較函式使資料排列後具備貪心選擇的最優性。包含區間排程、交換論證（Exchange Argument）等技巧。",
        "resources": [
          {
            "name": "USACO Guide - Custom Comparators and Coordinate Compression",
            "url": "https://usaco.guide/silver/sorting-custom",
            "type": "guide"
          },
          {
            "name": "USACO Guide - Greedy with Sorting",
            "url": "https://usaco.guide/silver/greedy-sorting",
            "type": "guide"
          }
        ],
        "problems": [
          {
            "id": "cses-2183",
            "name": "CSES 2183: Missing Coin Sum",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/2183",
            "difficulty": "Easy"
          },
          {
            "id": "cf-1537c",
            "name": "Codeforces 1537C: Challenging Cliffs",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1537/C",
            "difficulty": "Easy"
          },
          {
            "id": "cses-1629",
            "name": "CSES 1629: Movie Festival (貪心進階)",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1629",
            "difficulty": "Easy"
          }
        ]
      },
      {
        "id": "graph-traversal",
        "prerequisites": [
          "intro-graphs"
        ],
        "title": "圖的遍歷：DFS 與 BFS",
        "desc": "圖論核心基石。DFS 用於連通性分析、環路偵測與拓撲序；BFS 用於計算無權圖最短路徑與層次結構。",
        "resources": [
          {
            "name": "USACO Guide - Graph Traversal",
            "url": "https://usaco.guide/silver/graph-traversal",
            "type": "guide"
          },
          {
            "name": "OI Wiki - DFS",
            "url": "https://oi-wiki.org/graph/dfs/",
            "type": "wiki"
          },
          {
            "name": "OI Wiki - BFS",
            "url": "https://oi-wiki.org/graph/bfs/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1193",
            "name": "CSES 1193: Labyrinth",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1193",
            "difficulty": "Medium"
          },
          {
            "id": "cses-1666",
            "name": "CSES 1666: Building Roads (連通塊)",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1666",
            "difficulty": "Easy"
          },
          {
            "id": "tioj-1092",
            "name": "TIOJ 1092: 數字遊戲",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/1092",
            "difficulty": "Medium"
          }
        ]
      },
      {
        "id": "flood-fill",
        "title": "洪水填充 (Flood Fill) 與連通塊",
        "desc": "BFS/DFS 在 2D 格點地圖上的應用。找出有多少連通區域、計算每個區域的大小，是網格圖類問題的標準解法。",
        "resources": [
          {
            "name": "USACO Guide - Flood Fill",
            "url": "https://usaco.guide/silver/flood-fill",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 搜索",
            "url": "https://oi-wiki.org/search/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1192",
            "name": "CSES 1192: Counting Rooms",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1192",
            "difficulty": "Easy"
          },
          {
            "id": "cf-1365d",
            "name": "Codeforces 1365D: Solve The Maze",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1365/D",
            "difficulty": "Medium"
          },
          {
            "id": "zj-c297",
            "name": "ZeroJudge c297: 棒球遊戲 (BFS)",
            "platform": "ZeroJudge",
            "url": "https://zerojudge.tw/ShowProblem?problemid=c297",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "intro-tree",
        "title": "樹的基礎：根與遍歷 (Tree Basics)",
        "desc": "樹的定義、根節點、父子關係、樹的深度與直徑。學習用 DFS/BFS 遍歷無根樹與有根樹，是後續「樹形 DP」的基礎。",
        "resources": [
          {
            "name": "USACO Guide - Introduction to Tree Algorithms",
            "url": "https://usaco.guide/silver/intro-tree",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 樹的基礎",
            "url": "https://oi-wiki.org/graph/tree-basic/",
            "type": "wiki"
          },
          {
            "name": "WiwiHo 的競程筆記 - 樹",
            "url": "https://cp.wiwiho.me/tree/",
            "type": "article"
          }
        ],
        "problems": [
          {
            "id": "cses-1674",
            "name": "CSES 1674: Subordinates",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1674",
            "difficulty": "Easy"
          },
          {
            "id": "cses-1131",
            "name": "CSES 1131: Tree Diameter",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1131",
            "difficulty": "Easy"
          },
          {
            "id": "tioj-1097",
            "name": "TIOJ 1097: 樹的高度",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/1097",
            "difficulty": "Easy"
          }
        ]
      },
      {
        "id": "func-graphs",
        "title": "函數圖 (Functional Graphs)",
        "desc": "每個節點的出度恰好為 1 的有向圖，形成「$\\rho$ 型」結構。應用：找環、倍增跳躍（Binary Lifting）的基礎。",
        "resources": [
          {
            "name": "USACO Guide - Functional Graphs",
            "url": "https://usaco.guide/silver/func-graphs",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 內向樹",
            "url": "https://oi-wiki.org/graph/functional-graph/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1686",
            "name": "CSES 1686: Coin Collector",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1686",
            "difficulty": "Hard"
          },
          {
            "id": "cf-1020b",
            "name": "Codeforces 1020B: Badge",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1020/B",
            "difficulty": "Easy"
          },
          {
            "id": "cf-1137c",
            "name": "Codeforces 1137C: Museums Tour",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1137/C",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "priority-queues",
        "title": "優先佇列 (Priority Queue / Heap)",
        "desc": "以 `std::priority_queue` 維護動態最大值或最小值，在排程、Dijkstra、貪心問題中廣泛應用。時間複雜度 $O(\\log N)$ 進出隊。",
        "resources": [
          {
            "name": "USACO Guide - Priority Queues",
            "url": "https://usaco.guide/silver/priority-queues",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 堆",
            "url": "https://oi-wiki.org/ds/heap/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1163",
            "name": "CSES 1163: Traffic Lights",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1163",
            "difficulty": "Easy"
          },
          {
            "id": "cses-1674-b",
            "name": "CSES 1641: Sum of Three Values",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1641",
            "difficulty": "Medium"
          },
          {
            "id": "cf-1077d",
            "name": "Codeforces 1077D: Small Multiple",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1077/D",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "intro-bitwise",
        "title": "位元運算與集合生成 (Bitmask)",
        "desc": "利用二進位整數的位元操作（AND、OR、XOR、位移）模擬集合操作，生成所有子集，是「狀壓 DP」的直接基礎。",
        "resources": [
          {
            "name": "USACO Guide - Introduction to Bitwise Operations",
            "url": "https://usaco.guide/silver/intro-bitwise",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 位運算",
            "url": "https://oi-wiki.org/math/bit/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cf-1658c",
            "name": "Codeforces 1658C: Shinju and the Lost Permutation",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1658/C",
            "difficulty": "Medium"
          },
          {
            "id": "cses-1622-b",
            "name": "CSES 2205: Gray Code",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/2205",
            "difficulty": "Easy"
          },
          {
            "id": "cf-1247d",
            "name": "Codeforces 1247D: Power Products",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1247/D",
            "difficulty": "Medium"
          }
        ]
      },
      {
        "id": "monotonic-structures",
        "title": "單調結構：單調棧與單調佇列",
        "desc": "維護具有單調遞增或遞減特性的線性容器，能在 $O(1)$ 時間查詢區間極值或下一個更大/更小元素，為多種 DP 優化的核心工具。",
        "resources": [
          {
            "name": "OI Wiki - 單調棧",
            "url": "https://oi-wiki.org/ds/monotonous-stack/",
            "type": "wiki"
          },
          {
            "name": "OI Wiki - 單調佇列",
            "url": "https://oi-wiki.org/ds/monotonous-queue/",
            "type": "wiki"
          },
          {
            "name": "USACO Guide - Stacks",
            "url": "https://usaco.guide/gold/stacks",
            "type": "guide"
          }
        ],
        "problems": [
          {
            "id": "cses-1645",
            "name": "CSES 1645: Nearest Smaller Values",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1645",
            "difficulty": "Medium"
          },
          {
            "id": "tioj-1225",
            "name": "TIOJ 1225: 堆疊遊戲",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/1225",
            "difficulty": "Medium"
          },
          {
            "id": "cf-1092f",
            "name": "Codeforces 1092F: Tree with Maximum Cost",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1092/F",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "basic-dp",
        "prerequisites": [
          "complete-rec"
        ],
        "title": "動態規劃入門 (Intro to DP)",
        "desc": "記憶化搜索與遞推兩種 DP 實現方式。理解「狀態定義、轉移方程、邊界條件」三要素。經典題型：最長遞增子序列 LIS、硬幣兌換、背包問題。",
        "resources": [
          {
            "name": "USACO Guide - Introduction to DP",
            "url": "https://usaco.guide/gold/intro-dp",
            "type": "guide"
          },
          {
            "name": "AP325 - 第四章：動態規劃",
            "url": "https://sites.google.com/site/apcs325/",
            "type": "book"
          },
          {
            "name": "OI Wiki - 動態規劃",
            "url": "https://oi-wiki.org/dp/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1633",
            "name": "CSES 1633: Dice Combinations",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1633",
            "difficulty": "Easy"
          },
          {
            "id": "zj-b057",
            "name": "ZeroJudge b057: LCS 最長共同子序列",
            "platform": "ZeroJudge",
            "url": "https://zerojudge.tw/ShowProblem?problemid=b057",
            "difficulty": "Medium"
          },
          {
            "id": "zj-d052",
            "name": "ZeroJudge d052: LIS 練習",
            "platform": "ZeroJudge",
            "url": "https://zerojudge.tw/ShowProblem?problemid=d052",
            "difficulty": "Medium"
          }
        ]
      },
      {
        "id": "shortest-path-basic",
        "title": "最短路徑：BFS 與 Dijkstra",
        "desc": "無權圖最短路徑用 BFS ($O(N+M)$)；有非負權重的圖使用 Dijkstra 演算法搭配優先佇列，時間複雜度 $O(M \\log N)$。",
        "resources": [
          {
            "name": "USACO Guide - Unweighted Shortest Paths (BFS)",
            "url": "https://usaco.guide/gold/unweighted-shortest-paths",
            "type": "guide"
          },
          {
            "name": "USACO Guide - Shortest Paths with Non-Negative Edge Weights",
            "url": "https://usaco.guide/gold/shortest-paths",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 最短路",
            "url": "https://oi-wiki.org/graph/shortest-path/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1671",
            "name": "CSES 1671: Shortest Routes I (Dijkstra)",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1671",
            "difficulty": "Medium"
          },
          {
            "id": "tioj-1096",
            "name": "TIOJ 1096: 最短路徑",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/1096",
            "difficulty": "Medium"
          },
          {
            "id": "cses-1672",
            "name": "CSES 1672: Shortest Routes II (Floyd)",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1672",
            "difficulty": "Medium"
          }
        ]
      }
    ]
  },
  {
    "levelId": "toi-gold",
    "levelName": "🟡 榮耀級 (TOI 選訓營 / NPSC / USACO Gold)",
    "levelDesc": "適合已通過 TOI 複選，準備入選選訓營或爭取 ICPC 台灣代表資格的頂尖選手。目標：進階資料結構、拓撲、圖論、進階 DP、數論。",
    "color": "#F59E0B",
    "accentGlow": "rgba(245, 158, 11, 0.15)",
    "topics": [
      {
        "id": "dsu",
        "prerequisites": [
          "intro-graphs",
          "intro-ds"
        ],
        "title": "並查集 (Disjoint Set Union, DSU)",
        "desc": "高效維護動態不相交集合的合併與查詢。路徑壓縮與啟發式合併使操作攤還時間複雜度近似 $O(\\alpha(N))$，為最小生成樹（Kruskal）的核心元件。",
        "resources": [
          {
            "name": "USACO Guide - Disjoint Set Union",
            "url": "https://usaco.guide/gold/dsu",
            "type": "guide"
          },
          {
            "name": "WiwiHo 的競程筆記 - 並查集",
            "url": "https://cp.wiwiho.me/dsu/",
            "type": "article"
          },
          {
            "name": "OI Wiki - 並查集",
            "url": "https://oi-wiki.org/ds/dsu/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1676",
            "name": "CSES 1676: Road Construction",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1676",
            "difficulty": "Medium"
          },
          {
            "id": "tioj-1191",
            "name": "TIOJ 1191: 社團好友分類",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/1191",
            "difficulty": "Medium"
          },
          {
            "id": "cf-1253d",
            "name": "Codeforces 1253D: Harmonious Graph",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1253/D",
            "difficulty": "Medium"
          }
        ]
      },
      {
        "id": "mst",
        "prerequisites": [
          "dsu"
        ],
        "title": "最小生成樹 (Minimum Spanning Tree)",
        "desc": "求無向加權圖的最小生成樹。Kruskal 演算法結合 DSU，時間複雜度 $O(M \\log M)$；Prim 演算法以 priority queue 實現。",
        "resources": [
          {
            "name": "USACO Guide - Minimum Spanning Trees",
            "url": "https://usaco.guide/gold/mst",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 最小生成樹",
            "url": "https://oi-wiki.org/graph/mst/",
            "type": "wiki"
          },
          {
            "name": "WiwiHo 的競程筆記 - MST",
            "url": "https://cp.wiwiho.me/mst/",
            "type": "article"
          }
        ],
        "problems": [
          {
            "id": "cses-1675",
            "name": "CSES 1675: Road Reparation",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1675",
            "difficulty": "Medium"
          },
          {
            "id": "tioj-1211",
            "name": "TIOJ 1211: 最小生成樹練習",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/1211",
            "difficulty": "Medium"
          },
          {
            "id": "cf-888g",
            "name": "Codeforces 888G: Xor-MST",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/888/G",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "toposort",
        "title": "拓撲排序 (Topological Sort)",
        "desc": "將有向無環圖 (DAG) 的頂點依照依賴關係線性排序。Kahn 演算法（BFS 入度）與 DFS 法，是有向圖 DP（Shortest Path on DAG）的基礎。",
        "resources": [
          {
            "name": "USACO Guide - Topological Sort",
            "url": "https://usaco.guide/gold/toposort",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 拓撲排序",
            "url": "https://oi-wiki.org/graph/topo/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1679",
            "name": "CSES 1679: Course Schedule",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1679",
            "difficulty": "Easy"
          },
          {
            "id": "cses-1680",
            "name": "CSES 1680: Longest Flight Route",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1680",
            "difficulty": "Medium"
          },
          {
            "id": "cf-1385e",
            "name": "Codeforces 1385E: Directing Edges",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1385/E",
            "difficulty": "Medium"
          }
        ]
      },
      {
        "id": "segment-tree",
        "title": "線段樹與懶標記 (Segment Tree & Lazy Propagation)",
        "desc": "區間查詢與區間修改的標準資料結構。Lazy Propagation 延遲標記下放確保每次操作在 $O(\\log N)$ 時間內完成，空間複雜度 $O(4N)$。",
        "resources": [
          {
            "name": "USACO Guide - Point Update Range Query (PURQ)",
            "url": "https://usaco.guide/gold/PURS",
            "type": "guide"
          },
          {
            "name": "WiwiHo 的競程筆記 - 線段樹",
            "url": "https://cp.wiwiho.me/segment-tree/",
            "type": "article"
          },
          {
            "name": "OI Wiki - 線段樹",
            "url": "https://oi-wiki.org/ds/seg/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1648",
            "name": "CSES 1648: Range Update Queries",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1648",
            "difficulty": "Medium"
          },
          {
            "id": "tioj-1869",
            "name": "TIOJ 1869: 二維樹狀陣列",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/1869",
            "difficulty": "Hard"
          },
          {
            "id": "cses-1736",
            "name": "CSES 1736: Polynomial Queries",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1736",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "fenwick-tree",
        "title": "樹狀陣列 (Fenwick Tree / BIT)",
        "desc": "比線段樹更簡潔的區間前綴和資料結構，支援單點修改與前綴和查詢（$O(\\log N)$）。利用 lowbit 運算實作，常數極小。",
        "resources": [
          {
            "name": "USACO Guide - PURS / BIT",
            "url": "https://usaco.guide/gold/PURS",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 樹狀陣列",
            "url": "https://oi-wiki.org/ds/bit/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1647",
            "name": "CSES 1647: Static Range Minimum Queries",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1647",
            "difficulty": "Easy"
          },
          {
            "id": "cses-1649",
            "name": "CSES 1649: Chessboard and Queens",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1649",
            "difficulty": "Medium"
          },
          {
            "id": "cf-1093g",
            "name": "Codeforces 1093G: Multidimensional Queries",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1093/G",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "hashing",
        "title": "字串雜湊 (String Hashing)",
        "desc": "以多項式滾動雜湊（Polynomial Rolling Hash）在 $O(N)$ 預處理後，$O(1)$ 比較任意子字串是否相等。用於字串比對、回文偵測、LCP 計算。",
        "resources": [
          {
            "name": "USACO Guide - String Hashing",
            "url": "https://usaco.guide/gold/hashing",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 字串雜湊",
            "url": "https://oi-wiki.org/string/hash/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1753",
            "name": "CSES 1753: String Matching (Hash)",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1753",
            "difficulty": "Easy"
          },
          {
            "id": "cf-1063f",
            "name": "Codeforces 1063F: String Journey",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1063/F",
            "difficulty": "Hard"
          },
          {
            "id": "tioj-1306",
            "name": "TIOJ 1306: 字串比對",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/1306",
            "difficulty": "Medium"
          }
        ]
      },
      {
        "id": "intro-sorted-sets",
        "title": "有序集合的進階應用 (Sorted Sets / Policy Tree)",
        "desc": "利用 `std::set`、`std::multiset`、`std::map` 或 C++ Policy-Based Data Structure 維護有序元素集合，實現動態排名查詢（Order Statistic Tree）。",
        "resources": [
          {
            "name": "USACO Guide - Intro to Sorted Sets",
            "url": "https://usaco.guide/gold/intro-sorted-sets",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 平衡樹",
            "url": "https://oi-wiki.org/ds/bst/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1163-b",
            "name": "CSES 1163: Traffic Lights (set)",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1163",
            "difficulty": "Easy"
          },
          {
            "id": "cf-702d",
            "name": "Codeforces 702D: Road to Post Office",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/702/D",
            "difficulty": "Medium"
          },
          {
            "id": "cf-896c",
            "name": "Codeforces 896C: Willem, Chtholly and Seniorious",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/896/C",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "knapsack",
        "title": "背包問題 (Knapsack DP)",
        "desc": "0/1 背包、完全背包、多重背包的 DP 轉移。學習空間壓縮技巧（滾動陣列），以及背包在字串、集合分割問題上的變體應用。",
        "resources": [
          {
            "name": "USACO Guide - Knapsack DP",
            "url": "https://usaco.guide/gold/knapsack",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 背包 DP",
            "url": "https://oi-wiki.org/dp/knapsack/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1634",
            "name": "CSES 1634: Minimizing Coins",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1634",
            "difficulty": "Easy"
          },
          {
            "id": "cses-1636",
            "name": "CSES 1636: Coin Combinations II",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1636",
            "difficulty": "Easy"
          },
          {
            "id": "cf-1244f",
            "name": "Codeforces 1244F: Minimizing the Circle (Knapsack)",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1244/F",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "lis",
        "title": "最長遞增子序列 (LIS) 進階",
        "desc": "LIS 的 $O(N^2)$ 基礎 DP 到 $O(N \\log N)$ 二分搜優化（patience sorting），以及最長公共子序列 LCS 的 DP 定義與還原路徑。",
        "resources": [
          {
            "name": "USACO Guide - LIS",
            "url": "https://usaco.guide/gold/lis",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 最長不下降子序列",
            "url": "https://oi-wiki.org/dp/lis/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1145",
            "name": "CSES 1145: Increasing Subsequence",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1145",
            "difficulty": "Easy"
          },
          {
            "id": "cf-1268b",
            "name": "Codeforces 1268B: Domino for Young",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1268/B",
            "difficulty": "Easy"
          },
          {
            "id": "tioj-2053",
            "name": "TIOJ 2053: 最長嚴格遞增子序列",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/2053",
            "difficulty": "Medium"
          }
        ]
      },
      {
        "id": "paths-grids",
        "title": "路徑 DP 與格點問題 (Paths in Grids)",
        "desc": "在 2D 格點地圖上的 DP。求從左上到右下的方法數、最短路、最大分數路徑，以及「路徑不相交」等進階格點 DP。",
        "resources": [
          {
            "name": "USACO Guide - Paths on Grids",
            "url": "https://usaco.guide/gold/paths-grids",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 數字三角形",
            "url": "https://oi-wiki.org/dp/number-triangle/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1638",
            "name": "CSES 1638: Grid Paths",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1638",
            "difficulty": "Medium"
          },
          {
            "id": "cses-1639",
            "name": "CSES 1639: Edit Distance",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1639",
            "difficulty": "Easy"
          },
          {
            "id": "cf-1517d",
            "name": "Codeforces 1517D: Explorer Space",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1517/D",
            "difficulty": "Medium"
          }
        ]
      },
      {
        "id": "dp-ranges",
        "title": "區間 DP (Range DP)",
        "desc": "以區間為狀態進行的動態規劃。典型問題：矩陣鏈乘積、石子合併、括號分組、最優多邊形三角剖分。通常複雜度 $O(N^3)$。",
        "resources": [
          {
            "name": "USACO Guide - Range DP",
            "url": "https://usaco.guide/gold/dp-ranges",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 區間 DP",
            "url": "https://oi-wiki.org/dp/interval/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1097",
            "name": "CSES 1097: Removal Game (區間 DP)",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1097",
            "difficulty": "Medium"
          },
          {
            "id": "tioj-1351",
            "name": "TIOJ 1351: 矩陣鏈乘積",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/1351",
            "difficulty": "Hard"
          },
          {
            "id": "cf-1527e",
            "name": "Codeforces 1527E: Partition into at Most Two Segments",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1527/E",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "dp-bitmasks",
        "title": "狀態壓縮 DP (Bitmask DP)",
        "desc": "用整數的位元表示集合狀態，在 $O(2^N \\cdot N)$ 或 $O(2^N \\cdot N^2)$ 內解決需要追蹤子集選取情況的 DP 問題。",
        "resources": [
          {
            "name": "USACO Guide - Bitmask DP",
            "url": "https://usaco.guide/gold/dp-bitmasks",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 狀壓 DP",
            "url": "https://oi-wiki.org/dp/state/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1653",
            "name": "CSES 1653: Elevator Rides (狀壓 DP)",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1653",
            "difficulty": "Hard"
          },
          {
            "id": "cses-1690",
            "name": "CSES 1690: Hamiltonian Flights",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1690",
            "difficulty": "Hard"
          },
          {
            "id": "cf-580d",
            "name": "Codeforces 580D: Kefa and Dishes",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/580/D",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "dp-trees",
        "title": "樹形 DP (DP on Trees)",
        "desc": "以樹的節點為狀態的動態規劃。求樹的直徑、最大獨立集、最小頂點覆蓋，以及「換根 DP」技術讓每個節點都成為根來計算答案。",
        "resources": [
          {
            "name": "USACO Guide - DP on Trees",
            "url": "https://usaco.guide/gold/dp-trees",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 樹形 DP",
            "url": "https://oi-wiki.org/dp/tree/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1130",
            "name": "CSES 1130: Tree Matching",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1130",
            "difficulty": "Medium"
          },
          {
            "id": "cses-1132",
            "name": "CSES 1132: Tree Distances I",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1132",
            "difficulty": "Hard"
          },
          {
            "id": "zj-d793",
            "name": "ZeroJudge d793: 樹的直徑練習",
            "platform": "ZeroJudge",
            "url": "https://zerojudge.tw/ShowProblem?problemid=d793",
            "difficulty": "Medium"
          }
        ]
      },
      {
        "id": "all-roots",
        "title": "換根 DP (Rerooting / All-Roots DP)",
        "desc": "透過兩次 DFS（先求以某節點為根的答案，再「換根」推廣到所有節點），在 $O(N)$ 時間內計算每個節點作為根的 DP 答案。",
        "resources": [
          {
            "name": "USACO Guide - All Roots DP",
            "url": "https://usaco.guide/gold/all-roots",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 換根 DP",
            "url": "https://oi-wiki.org/dp/reroot/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1133",
            "name": "CSES 1133: Tree Distances II (換根)",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1133",
            "difficulty": "Hard"
          },
          {
            "id": "cf-1092f-2",
            "name": "Codeforces 1092F: Tree with Maximum Cost",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1092/F",
            "difficulty": "Hard"
          },
          {
            "id": "tioj-1184",
            "name": "TIOJ 1184: 樹的距離和",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/1184",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "tree-euler",
        "title": "尤拉巡迴路與 DFS 序 (Euler Tour / DFS Order)",
        "desc": "透過一次 DFS 將樹的節點展開到線性陣列（DFS 序 / 括號序），使樹的子樹操作轉化為區間操作，可與線段樹/BIT 結合。",
        "resources": [
          {
            "name": "USACO Guide - Euler Tour",
            "url": "https://usaco.guide/gold/tree-euler",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 尤拉序",
            "url": "https://oi-wiki.org/graph/euler/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1138",
            "name": "CSES 1138: Path Queries",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1138",
            "difficulty": "Hard"
          },
          {
            "id": "cf-916e",
            "name": "Codeforces 916E: Jamie and Tree",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/916/E",
            "difficulty": "Hard"
          },
          {
            "id": "tioj-1224",
            "name": "TIOJ 1224: 矩形覆蓋面積",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/1224",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "number-theory",
        "title": "數論基礎 (Number Theory & Modular Arithmetic)",
        "desc": "質數篩法（線性篩）、輾轉相除法、擴展 GCD（ExGCD）、費馬小定理與模逆元、以及整除分塊。模運算在計數 DP 中無所不在。",
        "resources": [
          {
            "name": "USACO Guide - Divisibility & Modular Arithmetic",
            "url": "https://usaco.guide/gold/divisibility",
            "type": "guide"
          },
          {
            "name": "USACO Guide - Modular Arithmetic",
            "url": "https://usaco.guide/gold/modular",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 數論基礎",
            "url": "https://oi-wiki.org/math/number-theory/basic/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1713",
            "name": "CSES 1713: Counting Divisors",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1713",
            "difficulty": "Easy"
          },
          {
            "id": "zj-a289",
            "name": "ZeroJudge a289: 常用模逆元",
            "platform": "ZeroJudge",
            "url": "https://zerojudge.tw/ShowProblem?problemid=a289",
            "difficulty": "Medium"
          },
          {
            "id": "cf-1543a",
            "name": "Codeforces 1543A: Exciting Bets",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1543/A",
            "difficulty": "Easy"
          }
        ]
      },
      {
        "id": "combinatorics",
        "title": "組合數學 (Combinatorics)",
        "desc": "排列數、組合數的計算（帕斯卡三角形、逆元預處理階乘）；鴿巢原理、容斥原理；以及計數 DP 常用技巧。",
        "resources": [
          {
            "name": "USACO Guide - Combinatorics",
            "url": "https://usaco.guide/gold/combo",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 組合數學",
            "url": "https://oi-wiki.org/math/combinatorics/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1715",
            "name": "CSES 1715: Counting Coprime Pairs",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1715",
            "difficulty": "Medium"
          },
          {
            "id": "cf-1406c",
            "name": "Codeforces 1406C: Link Cut Centroids",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1406/C",
            "difficulty": "Medium"
          },
          {
            "id": "tioj-1282",
            "name": "TIOJ 1282: GCD 區間與修改",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/1282",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "sliding-window-gold",
        "title": "滑動視窗與雙端佇列 DP 優化",
        "desc": "利用滑動視窗維護固定大小的區間最值（Monotonic Queue），以及用滑動視窗優化某些 DP 轉移，將 $O(N^2)$ 降至 $O(N)$。",
        "resources": [
          {
            "name": "USACO Guide - Sliding Window",
            "url": "https://usaco.guide/gold/sliding-window",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 單調佇列優化",
            "url": "https://oi-wiki.org/dp/opt/monotone-queue/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1644",
            "name": "CSES 1644: Maximum Subarray Sum II",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1644",
            "difficulty": "Medium"
          },
          {
            "id": "cf-1321e",
            "name": "Codeforces 1321E: World of Darkraft (滑動視窗 DP)",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1321/E",
            "difficulty": "Hard"
          },
          {
            "id": "tioj-2023",
            "name": "TIOJ 2023: 進階區間查詢",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/2023",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "meet-in-the-middle",
        "title": "分治折半搜索 (Meet in the Middle)",
        "desc": "對長度為 N 的問題，分成兩個長度為 N/2 的子問題分別枚舉，再合併結果，將 $O(2^N)$ 降至 $O(2^{N/2} \\log N)$。",
        "resources": [
          {
            "name": "USACO Guide - Meet in the Middle",
            "url": "https://usaco.guide/gold/meet-in-the-middle",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 折半搜索",
            "url": "https://oi-wiki.org/search/bidirectional/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1628",
            "name": "CSES 1628: Meet in the Middle",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1628",
            "difficulty": "Medium"
          },
          {
            "id": "cf-888e",
            "name": "Codeforces 888E: Maximum Subsequence",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/888/E",
            "difficulty": "Hard"
          },
          {
            "id": "cf-1006e",
            "name": "Codeforces 1006E: Military Problem",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1006/E",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "hashmaps",
        "title": "雜湊表與自訂雜湊 (Hashmaps & Custom Hashing)",
        "desc": "理解 `std::unordered_map` 的運作原理與常數優化，以及如何自訂 Hash 函數防止刻意構造的 worst case，在競程中做到穩定 $O(1)$。",
        "resources": [
          {
            "name": "USACO Guide - Hashmaps",
            "url": "https://usaco.guide/gold/hashmaps",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 雜湊表",
            "url": "https://oi-wiki.org/ds/hash/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cf-1420d",
            "name": "Codeforces 1420D: Rescue Nibel",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1420/D",
            "difficulty": "Easy"
          },
          {
            "id": "cses-1169",
            "name": "CSES 1169: Nested Ranges Check",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1169",
            "difficulty": "Hard"
          },
          {
            "id": "cf-1208g",
            "name": "Codeforces 1208G: Polygons",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1208/G",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "digit-dp",
        "title": "數位 DP (Digit DP)",
        "desc": "計算 $[1, N]$ 範圍內滿足特定數字性質（如各位數字之和、數字中不含某個值）的整數個數。以逐位枚舉控制「上界限制」的 DP 技巧。",
        "resources": [
          {
            "name": "USACO Guide - Digit DP",
            "url": "https://usaco.guide/gold/digit-dp",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 數位 DP",
            "url": "https://oi-wiki.org/dp/number/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-2220",
            "name": "CSES 2220: Classic (Digit DP)",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/2220",
            "difficulty": "Hard"
          },
          {
            "id": "cf-1073e",
            "name": "Codeforces 1073E: Segment Sum",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1073/E",
            "difficulty": "Hard"
          },
          {
            "id": "cf-1202e",
            "name": "Codeforces 1202E: You Need to Raise Em All!",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1202/E",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "strongly-connected-components",
        "title": "強連通分量 (SCC) 與 2-SAT",
        "desc": "有向圖縮點技術。Tarjan / Kosaraju 演算法求 SCC，縮點後形成 DAG 進一步分析。2-SAT 可在 $O(N + M)$ 判斷布林方程式是否有解。",
        "resources": [
          {
            "name": "OI Wiki - 強連通分量",
            "url": "https://oi-wiki.org/graph/scc/",
            "type": "wiki"
          },
          {
            "name": "WiwiHo 的競程筆記 - SCC",
            "url": "https://cp.wiwiho.me/scc/",
            "type": "article"
          }
        ],
        "problems": [
          {
            "id": "cses-1683",
            "name": "CSES 1683: Planets and Kingdoms",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1683",
            "difficulty": "Medium"
          },
          {
            "id": "cf-427c",
            "name": "Codeforces 427C: Checkposts (SCC)",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/427/C",
            "difficulty": "Medium"
          },
          {
            "id": "tioj-1402",
            "name": "TIOJ 1402: 縮點與水流問題",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/1402",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "ternary-search",
        "title": "三分搜與凸函數優化 (Ternary Search)",
        "desc": "在凸函數（單峰函數）上用三分搜找最大值/最小值，時間複雜度 $O(\\log N)$ 或 $O(\\log(1/\\epsilon))$。",
        "resources": [
          {
            "name": "USACO Guide - Ternary Search",
            "url": "https://usaco.guide/gold/ternary-search",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 三分法",
            "url": "https://oi-wiki.org/basic/binary/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cf-439d",
            "name": "Codeforces 439D: Devu and his Brother",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/439/D",
            "difficulty": "Medium"
          },
          {
            "id": "cses-1063",
            "name": "CSES 1063: Maximum Rent",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1063",
            "difficulty": "Hard"
          },
          {
            "id": "cf-1326e",
            "name": "Codeforces 1326E: Bombs",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1326/E",
            "difficulty": "Hard"
          }
        ]
      }
    ]
  },
  {
    "levelId": "icpc-platinum",
    "levelName": "🔴 巔峰級 Ⅰ (選訓頂尖 / ICPC Asia / USACO Platinum)",
    "levelDesc": "適合在選訓營頂尖階段準備代表台灣出征 IOI，或大學端備戰 ICPC Asia Finals 的選手。目標：進階樹論、幾何、平台查詢、根號算法。",
    "color": "#EF4444",
    "accentGlow": "rgba(239, 68, 68, 0.15)",
    "topics": [
      {
        "id": "binary-lifting",
        "title": "倍增與 LCA (Binary Lifting / Sparse Table)",
        "desc": "利用倍增法預處理每個節點的 $2^k$ 代祖先，在 $O(N \\log N)$ 預處理後 $O(\\log N)$ 查詢 LCA（最近公共祖先）。Sparse Table 用於靜態 RMQ。",
        "resources": [
          {
            "name": "USACO Guide - Binary Jumping (LCA)",
            "url": "https://usaco.guide/plat/binary-jump",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 最近公共祖先",
            "url": "https://oi-wiki.org/graph/lca/",
            "type": "wiki"
          },
          {
            "name": "WiwiHo 的競程筆記 - LCA",
            "url": "https://cp.wiwiho.me/lca/",
            "type": "article"
          }
        ],
        "problems": [
          {
            "id": "cses-1688",
            "name": "CSES 1688: Company Queries I",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1688",
            "difficulty": "Easy"
          },
          {
            "id": "cses-1689",
            "name": "CSES 1689: Company Queries II (LCA)",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1689",
            "difficulty": "Medium"
          },
          {
            "id": "tioj-1171",
            "name": "TIOJ 1171: LCA 查詢",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/1171",
            "difficulty": "Medium"
          }
        ]
      },
      {
        "id": "hld",
        "title": "樹鏈剖分 (Heavy-Light Decomposition)",
        "desc": "將樹分解為重鏈，使樹上路徑操作轉換為線性區間操作。配合線段樹，樹上路徑修改/查詢時間複雜度為 $O(\\log^2 N)$。",
        "resources": [
          {
            "name": "USACO Guide - Heavy-Light Decomposition",
            "url": "https://usaco.guide/plat/hld",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 樹鏈剖分",
            "url": "https://oi-wiki.org/ds/hld/",
            "type": "wiki"
          },
          {
            "name": "WiwiHo 的競程筆記 - HLD",
            "url": "https://cp.wiwiho.me/hld/",
            "type": "article"
          }
        ],
        "problems": [
          {
            "id": "cses-2134",
            "name": "CSES 2134: Path Queries II (HLD)",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/2134",
            "difficulty": "Hard"
          },
          {
            "id": "tioj-1185",
            "name": "TIOJ 1185: 樹上路徑修改與查詢",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/1185",
            "difficulty": "Hard"
          },
          {
            "id": "cf-343d",
            "name": "Codeforces 343D: Water Tree (HLD)",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/343/D",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "centroid",
        "title": "點分治 (Centroid Decomposition)",
        "desc": "反覆以重心為根將樹分治，每條路徑恰好被計算一次，將樹上路徑統計問題降至 $O(N \\log^2 N)$。",
        "resources": [
          {
            "name": "USACO Guide - Centroid Decomposition",
            "url": "https://usaco.guide/plat/centroid",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 點分治",
            "url": "https://oi-wiki.org/graph/point-divide/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1714",
            "name": "CSES 1714: Distinct Values (點分治)",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1714",
            "difficulty": "Hard"
          },
          {
            "id": "cf-342e",
            "name": "Codeforces 342E: Xenia and Tree",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/342/E",
            "difficulty": "Hard"
          },
          {
            "id": "tioj-1626",
            "name": "TIOJ 1626: 點分治練習",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/1626",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "sqrt",
        "title": "根號算法與莫隊 (Sqrt Decomposition / Mo's Algorithm)",
        "desc": "將資料分成 $\\sqrt{N}$ 塊分別處理；莫隊以 $O(N\\sqrt{N})$ 離線回答無修改區間查詢。帶修莫隊、樹上莫隊等進階變體。",
        "resources": [
          {
            "name": "USACO Guide - Square Root Decomposition",
            "url": "https://usaco.guide/plat/sqrt",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 莫隊算法",
            "url": "https://oi-wiki.org/misc/mo/",
            "type": "wiki"
          },
          {
            "name": "WiwiHo 的競程筆記 - 莫隊",
            "url": "https://cp.wiwiho.me/mos-algorithm/",
            "type": "article"
          }
        ],
        "problems": [
          {
            "id": "cf-86d",
            "name": "Codeforces 86D: Powerful array (莫隊)",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/86/D",
            "difficulty": "Hard"
          },
          {
            "id": "tioj-1615",
            "name": "TIOJ 1615: 經典莫隊練習",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/1615",
            "difficulty": "Hard"
          },
          {
            "id": "cf-940f",
            "name": "Codeforces 940F: Machine Learning (帶修莫隊)",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/940/F",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "segtree-ext",
        "title": "線段樹進階：合併、持久化、可持久線段樹",
        "desc": "線段樹合併（Segment Tree Merging）用於樹上操作；主席樹（Persistent Segment Tree / 可持久化線段樹）支援歷史版本查詢，可解決靜態區間第 K 小。",
        "resources": [
          {
            "name": "USACO Guide - Segment Tree Extensions",
            "url": "https://usaco.guide/plat/segtree-ext",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 可持久化線段樹",
            "url": "https://oi-wiki.org/ds/persistent-seg/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cf-600e",
            "name": "Codeforces 600E: Lomsat gelral (線段樹合併)",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/600/E",
            "difficulty": "Hard"
          },
          {
            "id": "tioj-1500",
            "name": "TIOJ 1500: 區間第 K 小 (主席樹)",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/1500",
            "difficulty": "Hard"
          },
          {
            "id": "cses-1735",
            "name": "CSES 1735: Range Queries and Copies",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1735",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "convex-hull",
        "title": "凸包 (Convex Hull)",
        "desc": "求點集的最小凸多邊形。Andrew's Monotone Chain / Graham Scan 演算法，$O(N \\log N)$。應用於幾何最大最小化問題與凸包技巧 (CHT) 的幾何詮釋。",
        "resources": [
          {
            "name": "USACO Guide - Convex Hull",
            "url": "https://usaco.guide/plat/convex-hull",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 凸包",
            "url": "https://oi-wiki.org/geometry/convex-hull/",
            "type": "wiki"
          },
          {
            "name": "WiwiHo 的競程筆記 - 計算幾何",
            "url": "https://cp.wiwiho.me/geometry/",
            "type": "article"
          }
        ],
        "problems": [
          {
            "id": "cses-2195",
            "name": "CSES 2195: Convex Hull",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/2195",
            "difficulty": "Hard"
          },
          {
            "id": "tioj-1178",
            "name": "TIOJ 1178: 凸包 Convex Hull",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/1178",
            "difficulty": "Hard"
          },
          {
            "id": "cf-852e",
            "name": "Codeforces 852E: Casinos and Slots",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/852/E",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "convex-hull-trick",
        "title": "斜率優化 (Convex Hull Trick / Li Chao Tree)",
        "desc": "將 DP 轉移中形如 $f(i) = \\min_j(b(j) \\cdot x(i) + c(j))$ 的式子視為直線的最小值問題，用凸包維護使每次查詢 $O(\\log N)$ 甚至 $O(1)$。",
        "resources": [
          {
            "name": "USACO Guide - Convex Hull Trick",
            "url": "https://usaco.guide/plat/convex-hull-trick",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 斜率優化",
            "url": "https://oi-wiki.org/dp/opt/slope/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1155",
            "name": "CSES 1155: Pyramid Array",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1155",
            "difficulty": "Hard"
          },
          {
            "id": "tioj-2095",
            "name": "TIOJ 2095: 斜率優化 DP",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/2095",
            "difficulty": "Hard"
          },
          {
            "id": "cf-319c",
            "name": "Codeforces 319C: Kalila and Dimna in the Logging Industry",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/319/C",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "sweep-line",
        "title": "掃描線 (Sweep Line / Range Sweep)",
        "desc": "想像一條垂直線從左到右掃過平面，配合事件佇列處理幾何問題（矩形面積聯集、線段相交計數、最近點對）。",
        "resources": [
          {
            "name": "USACO Guide - Sweep Line",
            "url": "https://usaco.guide/plat/sweep-line",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 掃描線",
            "url": "https://oi-wiki.org/geometry/scanning/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1741",
            "name": "CSES 1741: Intersection Points",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1741",
            "difficulty": "Hard"
          },
          {
            "id": "tioj-1224-b",
            "name": "TIOJ 1224: 矩形覆蓋面積 (掃描線+線段樹)",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/1224",
            "difficulty": "Hard"
          },
          {
            "id": "cf-1093g-b",
            "name": "Codeforces 1093G: Multidimensional Queries",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1093/G",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "matrix-expo",
        "title": "矩陣快速冪 (Matrix Exponentiation)",
        "desc": "以矩陣表達線性遞推關係式，利用快速冪在 $O(k^3 \\log N)$ 時間內計算第 N 項（$k$ 為狀態維度）。常用於費氏數列、路徑計數等。",
        "resources": [
          {
            "name": "USACO Guide - Matrix Exponentiation",
            "url": "https://usaco.guide/plat/matrix-expo",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 矩陣快速冪",
            "url": "https://oi-wiki.org/math/matrix-exponentiation/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1757",
            "name": "CSES 1757: Graph Counting (矩陣快速冪)",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1757",
            "difficulty": "Hard"
          },
          {
            "id": "cf-1276c",
            "name": "Codeforces 1276C: Beautiful Rectangle (矩陣)",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1276/C",
            "difficulty": "Hard"
          },
          {
            "id": "tioj-1428",
            "name": "TIOJ 1428: 矩陣快速冪",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/1428",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "dc-dp",
        "title": "分治 DP 優化 (Divide and Conquer DP)",
        "desc": "當 DP 轉移的最優決策點具有單調性時（SMAWK / 四邊形不等式），用分治法將 $O(N^2)$ DP 降至 $O(N \\log N)$。",
        "resources": [
          {
            "name": "USACO Guide - Divide & Conquer DP",
            "url": "https://usaco.guide/plat/DC-DP",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 1D/1D 優化",
            "url": "https://oi-wiki.org/dp/opt/divide/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-2086",
            "name": "CSES 2086: New Flight Routes",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/2086",
            "difficulty": "Hard"
          },
          {
            "id": "cf-311e",
            "name": "Codeforces 311E: Horizontal and Vertical Cuts",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/311/E",
            "difficulty": "Hard"
          },
          {
            "id": "tioj-1944",
            "name": "TIOJ 1944: 分治 DP 優化",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/1944",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "bitsets",
        "title": "位元集合 (Bitsets) 優化",
        "desc": "利用 `std::bitset` 的位元並行運算將某些 $O(N^2)$ 或 $O(N^2/w)$ 的演算法加速。常用於子集枚舉、最短路、集合交集等場景（$w = 64$）。",
        "resources": [
          {
            "name": "USACO Guide - Bitsets",
            "url": "https://usaco.guide/plat/bitsets",
            "type": "guide"
          },
          {
            "name": "OI Wiki - bitset",
            "url": "https://oi-wiki.org/lang/csl/bitset/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cf-1017e",
            "name": "Codeforces 1017E: The Superseded Algorithm",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1017/E",
            "difficulty": "Hard"
          },
          {
            "id": "cses-1684",
            "name": "CSES 1684: Reachability Queries (bitset)",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1684",
            "difficulty": "Hard"
          },
          {
            "id": "tioj-2162",
            "name": "TIOJ 2162: Bitset 集合優化",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/2162",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "merging",
        "title": "DSU on Tree (小到大合併 / Dsu on Tree)",
        "desc": "利用啟發式合併（小集合合入大集合），使樹上每個元素最多被移動 $O(\\log N)$ 次，整體複雜度 $O(N \\log N)$，用於統計子樹資訊。",
        "resources": [
          {
            "name": "USACO Guide - Small-to-Large Merging",
            "url": "https://usaco.guide/plat/merging",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 啟發式合併",
            "url": "https://oi-wiki.org/ds/dsu-on-tree/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cf-600e-b",
            "name": "Codeforces 600E: Lomsat gelral (DSU on Tree)",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/600/E",
            "difficulty": "Hard"
          },
          {
            "id": "cses-1139",
            "name": "CSES 1139: Counting Children",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1139",
            "difficulty": "Hard"
          },
          {
            "id": "cf-741d",
            "name": "Codeforces 741D: Arpa's letter-marked tree",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/741/D",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "geometry-advanced",
        "title": "計算幾何進階 (Computational Geometry)",
        "desc": "向量運算、線段相交判斷、半平面交（半平面交求最優化）、旋轉卡尺（最遠點對）等進階幾何算法。",
        "resources": [
          {
            "name": "USACO Guide - Geometry Primitives",
            "url": "https://usaco.guide/plat/geo-pri",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 二維計算幾何基礎",
            "url": "https://oi-wiki.org/geometry/2d/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "tioj-2038",
            "name": "TIOJ 2038: 點線交集計算",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/2038",
            "difficulty": "Hard"
          },
          {
            "id": "cses-2189",
            "name": "CSES 2189: Point in Polygon",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/2189",
            "difficulty": "Hard"
          },
          {
            "id": "cf-613d",
            "name": "Codeforces 613D: Kingdom and its Cities",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/613/D",
            "difficulty": "Hard"
          }
        ]
      }
    ]
  },
  {
    "levelId": "icpc-advanced",
    "levelName": "⚡ 巔峰級 Ⅱ (IOI 國手 / ICPC World Finals / USACO Advanced)",
    "levelDesc": "對應 USACO Advanced 模組。適合代表台灣參加 IOI 或衝刺 ICPC World Finals 的神鬼級選手。涵蓋 FFT、網路流、後綴結構、LCT 等高等技術。",
    "color": "#8B5CF6",
    "accentGlow": "rgba(139, 92, 246, 0.15)",
    "topics": [
      {
        "id": "fft-ntt",
        "title": "快速傅立葉變換 / 數論變換 (FFT / NTT)",
        "desc": "在 $O(N \\log N)$ 內完成多項式乘法。FFT 使用複數在浮點精度下完成；NTT 在特定質數模意義下進行無精度損失的整數運算。",
        "resources": [
          {
            "name": "USACO Guide - Fast Fourier Transform",
            "url": "https://usaco.guide/adv/fft",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 多項式與生成函數",
            "url": "https://oi-wiki.org/math/poly/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1725",
            "name": "CSES 1725: String Matching (NTT)",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1725",
            "difficulty": "Hard"
          },
          {
            "id": "cf-632e",
            "name": "Codeforces 632E: Thief in a Shop (FFT 背包)",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/632/E",
            "difficulty": "Hard"
          },
          {
            "id": "tioj-2121",
            "name": "TIOJ 2121: 多項式乘法",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/2121",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "max-flow",
        "title": "網路最大流 (Maximum Flow / Dinic's Algorithm)",
        "desc": "求網路從源點到匯點的最大流量。Dinic 演算法（BFS 分層圖 + DFS 增廣路 + 當前弧優化）在 $O(V^2 E)$ 最壞、$O(E \\sqrt{V})$ 二分圖場景下高效。",
        "resources": [
          {
            "name": "USACO Guide - Maximum Flow",
            "url": "https://usaco.guide/adv/max-flow",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 最大流",
            "url": "https://oi-wiki.org/graph/max-flow/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1694",
            "name": "CSES 1694: Download Speed (最大流)",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1694",
            "difficulty": "Hard"
          },
          {
            "id": "tioj-1084",
            "name": "TIOJ 1084: 最大流練習",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/1084",
            "difficulty": "Hard"
          },
          {
            "id": "cf-1270i",
            "name": "Codeforces 1270I: Colorful Graph (流)",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1270/I",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "min-cut",
        "title": "最小割與最大流最小割定理",
        "desc": "由 Ford-Fulkerson 定理：有向圖最大流等於最小割容量。掌握如何從最大流的剩餘網路中找出最小割，並應用於最小頂點割、最小邊割問題。",
        "resources": [
          {
            "name": "USACO Guide - Min Cut",
            "url": "https://usaco.guide/adv/min-cut",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 最小割",
            "url": "https://oi-wiki.org/graph/min-cut/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1696",
            "name": "CSES 1696: School Excursion (最大獨立集)",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1696",
            "difficulty": "Hard"
          },
          {
            "id": "cf-1442e",
            "name": "Codeforces 1442E: Black, White and Grey (二分+最大流)",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1442/E",
            "difficulty": "Hard"
          },
          {
            "id": "tioj-1084-b",
            "name": "TIOJ 1084: 最大流最小割",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/1084",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "min-cost-flow",
        "title": "最小費用最大流 (Min Cost Max Flow / MCMF)",
        "desc": "在滿足最大流的前提下最小化總費用。SPFA 增廣路或使用 Johnson 算法（勢函數）將 SPFA 替換為 Dijkstra，解決費用可能為負的情況。",
        "resources": [
          {
            "name": "USACO Guide - Min Cost Flow",
            "url": "https://usaco.guide/adv/min-cost-flow",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 費用流",
            "url": "https://oi-wiki.org/graph/flow/min-cost/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "tioj-1424",
            "name": "TIOJ 1424: 最小費用最大流",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/1424",
            "difficulty": "Hard"
          },
          {
            "id": "cf-1535e",
            "name": "Codeforces 1535E: Optimal Scheduling (MCMF)",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1535/E",
            "difficulty": "Hard"
          },
          {
            "id": "cses-2129",
            "name": "CSES 2129: Task Assignment (費用流)",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/2129",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "scc-advanced",
        "title": "橋與割點、雙連通分量 (BCC / 2-CC)",
        "desc": "無向圖中使圖不連通的邊（橋）與點（割點）；邊雙連通分量與點雙連通分量的求法（Tarjan DFS），縮點應用。",
        "resources": [
          {
            "name": "USACO Guide - BCC and 2CC",
            "url": "https://usaco.guide/adv/BCC-2CC",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 橋與割點",
            "url": "https://oi-wiki.org/graph/cut/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1705",
            "name": "CSES 1705: Road Reparation (橋)",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1705",
            "difficulty": "Hard"
          },
          {
            "id": "cf-193e",
            "name": "Codeforces 193E: Fibonacci Number (割點)",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/193/E",
            "difficulty": "Hard"
          },
          {
            "id": "tioj-1585",
            "name": "TIOJ 1585: 割邊與橋",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/1585",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "link-cut-tree",
        "title": "動態樹 (Link-Cut Tree / Euler Tour Tree)",
        "desc": "支援動態連接/切斷邊的樹形結構，並能在 $O(\\log N)$ 時間查詢/修改兩節點路徑上的資訊。基於 Splay Tree 實作的 LCT 是最常用的版本。",
        "resources": [
          {
            "name": "USACO Guide - Link Cut Tree",
            "url": "https://usaco.guide/adv/link-cut-tree",
            "type": "guide"
          },
          {
            "name": "OI Wiki - LCT",
            "url": "https://oi-wiki.org/ds/lct/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "tioj-2200",
            "name": "TIOJ 2200: 動態樹 LCT 模板題",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/2200",
            "difficulty": "Extreme"
          },
          {
            "id": "cses-2110",
            "name": "CSES 2110: Dynamic Connectivity (LCT)",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/2110",
            "difficulty": "Extreme"
          },
          {
            "id": "cf-117e",
            "name": "Codeforces 117E: DP on LCT",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/117/E",
            "difficulty": "Extreme"
          }
        ]
      },
      {
        "id": "string-suffix",
        "title": "後綴結構：後綴陣列與後綴自動機 (SA / SAM)",
        "desc": "後綴陣列（Suffix Array）以 $O(N \\log N)$ 排序所有後綴；後綴自動機（Suffix Automaton）是所有子字串的最小狀態機。兩者都是字串 Advanced 競程的核心工具。",
        "resources": [
          {
            "name": "USACO Guide - Suffix Arrays",
            "url": "https://usaco.guide/adv/suffix-array",
            "type": "guide"
          },
          {
            "name": "USACO Guide - String Suffix Structures",
            "url": "https://usaco.guide/adv/string-suffix",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 後綴自動機",
            "url": "https://oi-wiki.org/string/sam/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1753-b",
            "name": "CSES 1753: String Matching (SA)",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1753",
            "difficulty": "Hard"
          },
          {
            "id": "cf-235c",
            "name": "Codeforces 235C: Cyclical Quest (SAM)",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/235/C",
            "difficulty": "Hard"
          },
          {
            "id": "tioj-2035",
            "name": "TIOJ 2035: AC 自動機進階",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/2035",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "game-theory",
        "title": "博弈論與 Sprague-Grundy (Game Theory / SG Theorem)",
        "desc": "理解公平遊戲（Impartial Game）的 Grundy 數（Nimber）計算。Sprague-Grundy 定理讓複合遊戲問題可以用 XOR 合併分析，涵蓋 Nim、Grundy 值與遊戲 DP。",
        "resources": [
          {
            "name": "USACO Guide - Game Theory",
            "url": "https://usaco.guide/adv/game-theory",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 博弈論",
            "url": "https://oi-wiki.org/math/game-theory/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1729",
            "name": "CSES 1729: Stick Game (SG)",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1729",
            "difficulty": "Medium"
          },
          {
            "id": "cf-768e",
            "name": "Codeforces 768E: Game of Stones (Grundy)",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/768/E",
            "difficulty": "Hard"
          },
          {
            "id": "tioj-1606",
            "name": "TIOJ 1606: 博弈必勝題",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/1606",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "slope-trick",
        "title": "斜率技巧 (Slope Trick)",
        "desc": "以分段線性函數（piecewise linear convex function）的斜率為單位進行 DP，用優先佇列維護函數形狀，解決一類最小化絕對值偏差的問題。",
        "resources": [
          {
            "name": "USACO Guide - Slope Trick",
            "url": "https://usaco.guide/adv/slope-trick",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 斜率優化",
            "url": "https://oi-wiki.org/dp/opt/slope/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cf-713c",
            "name": "Codeforces 713C: Sonya and Problem Wihtout a Legend (斜率技巧)",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/713/C",
            "difficulty": "Hard"
          },
          {
            "id": "cf-1033e",
            "name": "Codeforces 1033E: Hidden Bipartite Graph",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1033/E",
            "difficulty": "Hard"
          },
          {
            "id": "tioj-2105",
            "name": "TIOJ 2105: Slope Trick 練習",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/2105",
            "difficulty": "Extreme"
          }
        ]
      },
      {
        "id": "persistent-ds",
        "title": "持久化資料結構 (Persistent Data Structures)",
        "desc": "在修改資料結構時保留舊版本，支援歷史查詢。主席樹（持久化線段樹）解決靜態區間第 K 小；持久化並查集解決帶時間回溯的集合問題。",
        "resources": [
          {
            "name": "USACO Guide - Persistent Segment Tree",
            "url": "https://usaco.guide/adv/persistent",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 可持久化資料結構",
            "url": "https://oi-wiki.org/ds/persistent/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "tioj-1500-b",
            "name": "TIOJ 1500: 區間第 K 小 (主席樹)",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/1500",
            "difficulty": "Hard"
          },
          {
            "id": "cses-1735-b",
            "name": "CSES 1735: Range Queries and Copies",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1735",
            "difficulty": "Hard"
          },
          {
            "id": "cf-786c",
            "name": "Codeforces 786C: Till I Collapse (持久化 DSU)",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/786/C",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "linear-algebra",
        "title": "線性代數：高斯消去與 XOR 線性基 (Linear Algebra)",
        "desc": "高斯消去法求解線性方程組（可用於位元 GF(2) 域）；XOR 線性基（Basis）維護一組向量集合的線性獨立基，用於查詢最大 XOR 子集。",
        "resources": [
          {
            "name": "USACO Guide - XOR Basis",
            "url": "https://usaco.guide/adv/xor-basis",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 線性基",
            "url": "https://oi-wiki.org/math/linear-algebra/basis/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cf-1099d",
            "name": "Codeforces 1099D: Sum in the tree (XOR Basis)",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1099/D",
            "difficulty": "Hard"
          },
          {
            "id": "cses-1139-b",
            "name": "CSES 1139: XOR Maximization (線性基)",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1139",
            "difficulty": "Medium"
          },
          {
            "id": "tioj-1932",
            "name": "TIOJ 1932: 高斯消去法",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/1932",
            "difficulty": "Hard"
          }
        ]
      },
      {
        "id": "offline-algorithms",
        "title": "離線算法：離線 LCT、刪除操作 (Offline Algorithms)",
        "desc": "將查詢離線後排序或分治處理，支援時間倒流（撤銷操作）、鏈式刪除等線上無法處理的操作。包含帶撤銷的 DSU 與 Offline Deletion 技巧。",
        "resources": [
          {
            "name": "USACO Guide - Offline Deletion",
            "url": "https://usaco.guide/adv/offline-del",
            "type": "guide"
          },
          {
            "name": "OI Wiki - 離線算法",
            "url": "https://oi-wiki.org/offline/",
            "type": "wiki"
          }
        ],
        "problems": [
          {
            "id": "cses-1740",
            "name": "CSES 1740: New Flight Routes (離線)",
            "platform": "CSES",
            "url": "https://cses.fi/problemset/task/1740",
            "difficulty": "Hard"
          },
          {
            "id": "cf-1217e",
            "name": "Codeforces 1217E: Sum Queries (帶撤銷 DSU)",
            "platform": "Codeforces",
            "url": "https://codeforces.com/problemset/problem/1217/E",
            "difficulty": "Hard"
          },
          {
            "id": "tioj-2113",
            "name": "TIOJ 2113: 離線刪邊連通性",
            "platform": "TIOJ",
            "url": "https://tioj.ck.tp.edu.tw/problems/2113",
            "difficulty": "Extreme"
          }
        ]
      }
    ]
  }
];

if (typeof module !== 'undefined') {
  module.exports = ROADMAP_DATA;
}
