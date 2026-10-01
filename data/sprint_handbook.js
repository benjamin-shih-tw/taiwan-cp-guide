// Additive course skeletons and problem ladders derived from the uploaded 115學年度《競程衝刺技術手冊》.
// Existing Notion courses and existing problem ladders are never replaced by this file.
(() => {
  "use strict";

  const ROWS = [["0.0","如何使用這本手冊",4,[],[],[]],["0.1","入口一：從題目特徵找方法",5,[],[],[]],["0.2","入口二：從資料範圍找複雜度",7,[],[],[]],["0.3","入口三：從操作找資料結構",8,[],[],[]],["1.1","比賽節奏與策略",9,[],[],[]],["1.2","程式骨架",9,[],[],[]],["1.3","輸入格式大全",10,[],[],[]],["1.4","用檔案測試範例",12,[],[],[]],["1.5","輸出格式與浮點數",14,[],[],[]],["1.6","整數溢位與陣列大小",15,[],[],[]],["1.7","評測結果與除錯",15,[],[],[]],["1.8","上傳前檢查表",15,[],[],[]],["2.1","看懂評分表",17,[],[],[]],["2.2","五種窮舉模板",17,["例題 2-1｜密碼鎖","例題 2-2｜拔河分組","例題 2-3｜加減符號","例題 2-4｜連續營收","例題 2-5｜移除中間數"],[["同型","Creating Strings","1622"],["同型","Apple Division","1623"],["同型","Chessboard and Queens","1624"]],["人際關係（114 P1）","串珠遊戲（113 P2）","資產問題（113 P1）","爭霸遊戲（113 P4）"]],["2.3","從暴力到正解：記憶化",27,["例題 2-6｜兩端取牌"],[["相關","Removal Game","1097"]],["魔杖工廠（113 P5）"]],["2.4","考場流程與混合寫法",29,[],[],["爭霸遊戲（113 P4）"]],["2.5","批次測試：一次跑完整個資料夾",31,[],[],[]],["2.6","對拍：用暴力檢查正解",33,[],[],[]],["2.7","折半枚舉",34,["例題 2-7｜預算購物"],[["同型","Meet in the Middle","1628"]],[]],["2.8","用暴力找規律",36,["例題 2-8｜取石子"],[],[]],["2.9","設計邊界測資",38,[],[],[]],["2.10","考古題暴力挑戰表",39,[],[],[]],["2.11","章末練習",39,["練習 2-A｜點菜組合","練習 2-B｜排座位","練習 2-C｜最接近的預算"],[["相關","Apple Division","1623"],["相關","Creating Strings","1622"],["相關","Chessboard and Queens","1624"],["相關","Meet in the Middle","1628"]],[]],["3.1","vector",42,[],[],[]],["3.2","string",43,[],[],[]],["3.3","sort",44,[],[],[]],["3.4","map 與 set",44,["例題 3-1｜停車位"],[["同型","Distinct Numbers","1621"],["同型","Concert Tickets","1091"]],[]],["3.5","queue、stack、priority_queue",48,[],[],[]],["3.6","lower_bound",49,[],[],[]],["3.7","常見陷阱",49,[],[],[]],["3.8","位元運算",50,["例題 3-2｜權限系統"],[],[]],["3.9","章末練習",52,["練習 3-A｜詞頻排名","練習 3-B｜最近的座位","練習 3-C｜最多同時在線"],[["相關","Distinct Numbers","1621"],["相關","Concert Tickets","1091"],["同型","Restaurant Customers","1619"]],[]],["4.1","自訂排序",55,["例題 4-1｜成績排名"],[],["領取獎金（114 P3）"]],["4.2","貪心",56,["例題 4-2｜借用教室"],[["同型","Movie Festival","1629"],["相關","Movie Festival II","1632"]],[]],["4.3","計數",58,["例題 4-3｜字母重組"],[["相關","Palindrome Reorder","1755"]],["旅遊推薦（113 P7）"]],["4.4","座標壓縮",60,["例題 4-4｜最擁擠的時刻"],[["相關","Restaurant Customers","1619"]],["科學特展的人潮（115 校內賽 P2）"]],["4.5","priority_queue 的貪心",62,["例題 4-5｜合併繩子"],[["相關","Room Allocation","1164"]],[]],["4.6","如何確認貪心是對的",63,["例題 4-6｜排隊領餐"],[["相關","Tasks and Deadlines","1630"]],[]],["4.7","章末練習",65,["練習 4-A｜最少的檢查點","練習 4-B｜兩間教室","練習 4-C｜加權完成時間"],[["相關","Movie Festival","1629"],["同型","Movie Festival II","1632"],["相關","Tasks and Deadlines","1630"]],[]],["5.1","前綴和",68,["例題 5-1｜區間總和查詢"],[["同型","Static Range Sum Queries","1646"],["相關","Maximum Subarray Sum","1643"]],["資產問題（113 P1）","爭霸遊戲（113 P4）"]],["5.2","差分",69,["例題 5-2｜牆面上漆"],[["相關","Range Update Queries","1651"]],["科學特展的人潮（115 校內賽 P2）"]],["5.3","雙指標",71,["例題 5-3｜預算內最長連續"],[["同型","Subarray Sums I","1660"],["相關","Ferris Wheel","1090"]],["爭霸遊戲（113 P4）"]],["5.4","二分搜答案",73,["例題 5-4｜基地台"],[["同型","Factory Machines","1620"],["同型","Array Division","1085"]],["水力發電（114 P6）","書架分段（115 校內賽 P4）"]],["5.5","二維前綴和",76,["例題 5-5｜果園收成"],[["同型","Forest Queries","1652"]],[]],["5.6","三分搜尋",77,["例題 5-6｜集合地點"],[],[]],["5.7","章末練習",79,["練習 5-A｜道路整修","練習 5-B｜和為 K 的區間數","練習 5-C｜書架分段"],[["相關","Range Update Queries","1651"],["同型","Subarray Sums II","1661"],["同型","Array Division","1085"]],[]],["6.1","事件模擬",82,["例題 6-1｜印表機排隊"],[["相關","Josephus Problem I","2162"]],["渡輪調度（115 校內賽 P3）"]],["6.2","堆疊",83,["例題 6-2｜括號檢查"],[],["串珠遊戲（113 P2）"]],["6.3","單調堆疊與單調佇列",85,["例題 6-3｜更高的大樓","例題 6-4｜連續 k 天最高溫"],[["同型","Nearest Smaller Values","1645"],["同型","Sliding Window Minimum","3221"]],[]],["6.4","方格與方向陣列",88,["例題 6-5｜掃地機器人"],[],[]],["6.5","大數字與小數",90,["例題 6-6｜分組搬運"],[],["透光問題（114 P5）"]],["6.6","矩形幾何",92,["例題 6-7｜兩張海報"],[],[]],["6.7","章末練習",94,["練習 6-A｜排隊等候","練習 6-B｜最大矩形","練習 6-C｜停車場"],[["同型","Advertisement","1142"]],[]],["7.1","寫 DP 的四個步驟",97,["例題 7-1｜挑選攤位"],[["同型","Dice Combinations","1633"],["同型","Removing Digits","1637"]],[]],["7.2","狀態不夠時加一維",99,["例題 7-2｜股票買賣"],[["同型","Array Description","1746"],["相關","Counting Towers","2413"]],[]],["7.3","0/1 背包",101,["例題 7-3｜競賽選題"],[["同型","Book Shop","1158"],["相關","Money Sums","1745"]],["物資運送（114 P4）"]],["7.4","完全背包",104,["例題 7-4｜鋼條切割"],[["同型","Coin Combinations II","1636"]],[]],["7.5","最少個數與方法數",106,["例題 7-5｜最少包裹","例題 7-6｜湊分方法數"],[["同型","Minimizing Coins","1634"],["同型","Coin Combinations I","1635"]],[]],["7.6","LIS",109,["例題 7-7｜成長紀錄"],[["同型","Increasing Subsequence","1145"]],[]],["7.7","編輯距離",111,["例題 7-8｜打字修正"],[["同型","Edit Distance","1639"],["同型","Longest Common Subsequence","3403"]],["旅遊推薦（113 P7）"]],["7.8","格子路徑",113,["例題 7-9｜撿金幣"],[["同型","Grid Paths I","1638"]],[]],["7.9","區間 DP",115,["例題 7-10｜彩色積木"],[["相關","Removal Game","1097"],["相關","Rectangle Cutting","1744"]],["魔杖工廠（113 P5）","消消樂（113 P6）"]],["7.10","位元 DP",119,[],[["相關","Elevator Rides","1653"]],[]],["7.11","字典序最小的答案",120,[],[],[]],["7.12","DP 題型速查",121,[],[],[]],["7.13","單調佇列優化",122,["例題 7-11｜跳石頭"],[],[]],["7.14","斜率優化",123,["例題 7-12｜分批印刷"],[],[]],["7.15","數位 DP",126,["例題 7-13｜數字和的倍數"],[["同型","Counting Numbers","2220"]],[]],["7.16","章末練習",128,["練習 7-A｜數字歸零","練習 7-B｜填補數列","練習 7-C｜合併石堆"],[["相關","Removing Digits","1637"],["相關","Array Description","1746"],["相關","Rectangle Cutting","1744"]],[]],["8.1","圖的表示方法",130,[],[],[]],["8.2","DFS 與連通塊",131,["例題 8-1｜社群分組"],[["同型","Building Roads","1666"]],[]],["8.3","BFS：最少步數",133,["例題 8-2｜轉乘次數"],[["同型","Message Route","1667"]],[]],["8.4","方格上的 flood fill",135,["例題 8-3｜湖泊數量"],[["同型","Counting Rooms","1192"],["相關","Labyrinth","1193"]],[]],["8.5","樹的基礎",136,["例題 8-4｜公司組織"],[["同型","Subordinates","1674"]],[]],["8.6","並查集",138,["例題 8-5｜何時全部連通"],[["同型","Road Construction","1676"]],[]],["8.7","拓撲排序與 DAG 上的 DP",141,["例題 8-6｜工程最早完成"],[["同型","Course Schedule","1679"],["相關","Longest Flight Route","1680"]],[]],["8.8","DFS、BFS、並查集、拓撲排序怎麼選？",143,[],[],[]],["8.9","章末練習",143,["練習 8-A｜需要幾條新路","練習 8-B｜分成兩隊","練習 8-C｜最少學期數"],[["同型","Building Roads","1666"],["同型","Building Teams","1668"],["相關","Course Schedule","1679"],["相關","Longest Flight Route","1680"]],[]],["9.1","Dijkstra",146,["例題 9-1｜外送時間"],[["同型","Shortest Routes I","1671"],["相關","Flight Discount","1195"]],[]],["9.2","Bellman-Ford 與最多 K 段",148,["例題 9-2｜機票轉機"],[["相關","High Score","1673"],["相關","Cycle Finding","1197"]],["路徑導航（113 P3）"]],["9.3","Floyd-Warshall",151,["例題 9-3｜城市距離查詢"],[["同型","Shortest Routes II","1672"]],[]],["9.4","0-1 BFS",153,["例題 9-4｜破牆"],[],[]],["9.5","最小生成樹",154,["例題 9-5｜光纖網路"],[["同型","Road Reparation","1675"]],[]],["9.6","有向最小生成樹",157,["例題 9-6｜灌溉水道"],[],["水力發電（114 P6）"]],["9.7","章末練習",159,["練習 9-A｜最近的醫院","練習 9-B｜免費一段","練習 9-C｜兩人會合"],[["相關","Shortest Routes I","1671"],["相關","Flight Discount","1195"]],[]],["10.1","強連通分量",162,["例題 10-1｜互通的路口"],[["同型","Planets and Kingdoms","1683"],["相關","Flight Routes Check","1682"]],["傳播群組（113 P8）"]],["10.2","橋",165,["例題 10-2｜關鍵道路"],[["同型","Necessary Roads","2076"],["相關","Necessary Cities","2077"]],["島鏈補橋（115 校內賽 P6）"]],["10.3","樹 DP",167,["例題 10-3｜公司派對"],[["相關","Tree Diameter","1131"],["相關","Tree Matching","1130"]],[]],["10.4","換根 DP",169,["例題 10-4｜最佳集會地點"],[["同型","Tree Distances II","1133"],["相關","Tree Distances I","1132"]],[]],["10.5","函數圖",171,["例題 10-5｜傳紙條"],[["相關","Planets Queries I","1750"],["相關","Planets Cycles","1751"]],[]],["10.6","最近共同祖先",173,["例題 10-6｜家族輩分"],[["同型","Company Queries II","1688"],["同型","Distance Queries","1135"]],[]],["10.7","Euler Tour",175,["例題 10-7｜部門業績"],[["同型","Subtree Queries","1137"]],[]],["10.8","最大流",177,["例題 10-8｜輸水管線"],[["同型","Download Speed","1694"],["相關","Distinct Routes","1711"]],[]],["10.9","最小割",180,["例題 10-9｜封鎖道路"],[["同型","Police Chase","1695"]],[]],["10.10","二分匹配",182,["例題 10-10｜社團配對"],[["同型","School Dance","1696"]],[]],["10.11","章末練習",184,["練習 10-A｜樹的直徑","練習 10-B｜關鍵路口","練習 10-C｜加權家譜距離"],[["同型","Tree Diameter","1131"],["同型","Necessary Cities","2077"],["相關","Distance Queries","1135"]],[]],["11.1","整除、gcd 與 lcm",188,["例題 11-1｜同時閃爍"],[["相關","Common Divisors","1081"]],[]],["11.2","質數篩與質因數分解",189,["例題 11-2｜因數個數"],[["同型","Counting Divisors","1713"]],[]],["11.3","模運算與快速冪",190,["例題 11-3｜細菌繁殖"],[["同型","Exponentiation","1095"],["相關","Exponentiation II","1712"]],[]],["11.4","組合數取模",192,["例題 11-4｜選組員"],[["同型","Binomial Coefficients","1079"],["相關","Distributing Apples","1716"]],[]],["11.5","矩陣快速冪",194,["例題 11-5｜鋪磁磚"],[["同型","Fibonacci Numbers","1722"],["相關","Throwing Dice","1096"]],["電子看板（115 校內賽 P7）"]],["11.6","章末練習",196,["練習 11-A｜互質的個數","練習 11-B｜分配糖果","練習 11-C｜等比數列總和"],[["相關","Counting Divisors","1713"],["同型","Distributing Apples","1716"],["相關","Fibonacci Numbers","1722"]],[]],["12.1","樹狀陣列",199,["例題 12-1｜即時銷售統計"],[["同型","Dynamic Range Sum Queries","1648"],["相關","Range Update Queries","1651"]],[]],["12.2","線段樹",201,["例題 12-2｜氣溫監測"],[["同型","Dynamic Range Minimum Queries","1649"],["相關","Hotel Queries","1143"]],[]],["12.3","稀疏表",203,["例題 12-3｜最低水位"],[["同型","Static Range Minimum Queries","1647"]],[]],["12.4","延遲標記",204,["例題 12-4｜區間加值與求和"],[["相關","Range Updates and Sums","1735"]],[]],["12.5","區間問題怎麼選？",206,[],[],[]],["12.6","章末練習",207,["練習 12-A｜區間 XOR","練習 12-B｜最小值與位置","練習 12-C｜旅館分配"],[["相關","Range Xor Queries","1650"],["相關","Dynamic Range Minimum Queries","1649"],["同型","Hotel Queries","1143"]],[]],["13.1","前綴函數與 KMP",210,["例題 13-1｜關鍵字出現次數"],[["同型","String Matching","1753"],["相關","Finding Periods","1733"]],[]],["13.2","Z 演算法",212,["例題 13-2｜與開頭相同的長度"],[["同型","String Functions","2107"],["相關","Finding Borders","1732"]],[]],["13.3","字串雜湊",213,["例題 13-3｜最長重複片段"],[["同型","Repeating Substring","2106"]],[]],["13.4","Trie",216,["例題 13-4｜字首計數"],[["相關","Word Combinations","1731"]],[]],["13.5","章末練習",218,["練習 13-A｜最短週期","練習 13-B｜最長共同片段","練習 13-C｜最少單字拼字"],[["相關","Finding Periods","1733"],["相關","Repeating Substring","2106"],["相關","Word Combinations","1731"]],[]],["14.1","二分搜答案＋BFS",221,["例題 14-1｜載重限制"],[],["水力發電（114 P6）"]],["14.2","座標壓縮＋樹狀陣列",223,["例題 14-2｜逆序數對"],[["相關","Salary Queries","1144"]],[]],["14.3","排序＋priority_queue",224,["例題 14-3｜截止期限"],[],[]],["14.4","DP＋樹狀陣列",225,["例題 14-4｜最大和遞增子序列"],[["相關","Increasing Subsequence II","1748"]],[]],["14.5","離線處理＋樹狀陣列",227,["例題 14-5｜區間內不同的數"],[["同型","Distinct Values Queries","1734"]],[]],["14.6","章末練習",229,["練習 14-A｜最平緩的路線","練習 14-B｜兩倍逆序數對","練習 14-C｜限重連通查詢"],[["相關","Salary Queries","1144"],["相關","Road Construction","1676"]],[]],["A","考古題對照表",232,[],[],[]],["B","錯題原因紀錄表",233,[],[],[]]];
  const CHAPTERS = {"0":"考場快速索引","1":"考場實戰","2":"部分分與暴力窮舉","3":"STL 速查","4":"排序與貪心","5":"前綴和、差分與雙指標","6":"模擬與實作細節","7":"動態規劃","8":"圖論基礎","9":"最短路與生成樹","10":"進階圖論與樹","11":"數學","12":"區間資料結構","13":"字串演算法","14":"綜合題型"};

  function stableId(kind, key) {
    const seeds = [0x811c9dc5, 0x9e3779b9, 0x85ebca6b, 0xc2b2ae35];
    const out = seeds.map(seed => {
      let h = seed >>> 0;
      const s = kind + ":" + key;
      for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 0x01000193) >>> 0;
        h ^= h >>> 13;
      }
      return (h >>> 0).toString(16).padStart(8, "0");
    });
    return out.join("");
  }

  function domainFor(section) {
    if (section === "A" || section === "B") return "HB 15｜附錄";
    const ch = String(Number(section.split(".")[0])).padStart(2, "0");
    return "HB " + ch + "｜" + CHAPTERS[String(Number(ch))];
  }

  function titleFor(section, title) {
    if (section === "A") return "HB 15-01｜附錄 A：考古題對照表";
    if (section === "B") return "HB 15-02｜附錄 B：錯題原因紀錄表";
    const [ch, sub] = section.split(".");
    return "HB " + String(Number(ch)).padStart(2, "0") + "-" +
      String(Number(sub)).padStart(2, "0") + "｜" + title;
  }

  function defaultTasks(section, title) {
    if (section === "0.0") return [
      "辨識手冊的「必備／進階／選讀」標記，排出自己的學習順序。",
      "說明「同型」與「相關」題的差別，並安排一題練習。",
      "建立自己的章節進度與錯題紀錄。"
    ];
    if (section === "A") return [
      "從考古題對照表挑 3 題，只根據題目特徵判斷可能方法。",
      "為選出的題目標記對應章節與預估複雜度。",
      "完成其中 1 題並回填錯題原因。"
    ];
    if (section === "B") return [
      "挑 3 題近期錯題，分類成讀題、演算法、實作、邊界或複雜度問題。",
      "每題寫出一個最小反例或會失敗的測資。",
      "隔天不看舊程式重新寫一次其中 1 題。"
    ];
    if (title.includes("章末練習")) return [
      "完成本章 L1 辨識題：先寫方法與複雜度，再核對答案。",
      "完成本章 L2 標準題。",
      "完成本章 L3 變形題。"
    ];
    if (["比賽節奏","上傳前檢查","評測結果","輸入格式","輸出格式","程式骨架","用檔案測試","整數溢位"].some(x => title.includes(x))) {
      return [
        "整理「" + title + "」的個人考場版本。",
        "設計一個最容易犯錯的例子，寫出錯誤現象與修正方法。",
        "在一份小程式上實際驗證本節流程。"
      ];
    }
    if (["入口一","入口二","入口三","怎麼選","速查"].some(x => title.includes(x))) {
      return [
        "做 10 個「" + title + "」辨識題，只寫方法與複雜度。",
        "把容易混淆的兩種方法各寫一個反例。",
        "整理一張自己的判斷流程表。"
      ];
    }
    return [
      "觀念辨識：說明「" + title + "」何時適用，並寫出核心複雜度。",
      "模板實作：不看手冊重寫「" + title + "」的核心流程或模板。",
      "邊界測試：自行準備至少 3 組小測資，手算後和程式輸出比對。"
    ];
  }

  function ladderMarkdown(section, title, page, core, cses, applications) {
    const fallback = defaultTasks(section, title);
    const coreItems = core.length ? core : fallback.slice(0, 2);
    const related = cses.length
      ? cses.map(([kind, name, id]) => "[" + kind + "｜CSES " + name + "（" + id + "）](https://cses.fi/problemset/task/" + id + ")")
      : ["本節沒有額外列出的 CSES 對照題；先完成核心練習。"];
    const finalItems = applications.slice();
    if (title.includes("章末練習")) finalItems.push("重做本章 L1 辨識題：每題先寫方法與複雜度，再核對答案。");
    else finalItems.push(...fallback.slice(-2));
    const uniqueFinal = Array.from(new Set(finalItems));

    const numbered = items => items.map((item, i) => (i + 1) + ". " + item).join("\n");
    return [
      "## Problem Ladder",
      "> 《競程衝刺技術手冊》§" + section + " · PDF p." + page,
      "",
      "<details>",
      "<summary>01｜核心練習</summary>",
      "",
      numbered(coreItems),
      "",
      "</details>",
      "",
      "<details>",
      "<summary>02｜同型／延伸題</summary>",
      "",
      numbered(related),
      "",
      "</details>",
      "",
      "<details>",
      "<summary>03｜考古／實作檢查</summary>",
      "",
      numbered(uniqueFinal),
      "",
      "</details>"
    ].join("\n");
  }

  const courses = [];
  const ladders = [];
  const domains = [];

  ROWS.forEach(([section, title, page, core, cses, applications]) => {
    const domain = domainFor(section);
    if (!domains.includes(domain)) domains.push(domain);
    const courseId = stableId("hb-course", section);
    const courseTitle = titleFor(section, title);

    courses.push({
      id: courseId,
      title: courseTitle,
      details: "《競程衝刺技術手冊》§" + section + " · PDF p." + page,
      difficulty: null,
      domain,
      notionUrl: "",
      content: "",
      source: "sprint-handbook",
      staticOnly: true,
      handbookSection: section,
      handbookPage: page
    });

    ladders.push({
      id: stableId("hb-ladder", section),
      title: "Problem Ladder — " + courseTitle,
      domain,
      sourceCourseId: courseId,
      notionUrl: "",
      content: ladderMarkdown(section, title, page, core, cses, applications),
      source: "sprint-handbook",
      staticOnly: true,
      handbookSection: section,
      handbookPage: page
    });
  });

  window.NOTION_DOMAIN_ORDER = Array.isArray(window.NOTION_DOMAIN_ORDER) ? window.NOTION_DOMAIN_ORDER : [];
  domains.forEach(domain => {
    if (!window.NOTION_DOMAIN_ORDER.includes(domain)) window.NOTION_DOMAIN_ORDER.push(domain);
  });

  window.NOTION_DOMAIN_RELATIONS = window.NOTION_DOMAIN_RELATIONS || {};
  window.NOTION_COURSES = Array.isArray(window.NOTION_COURSES) ? window.NOTION_COURSES : [];
  window.NOTION_LADDERS = Array.isArray(window.NOTION_LADDERS) ? window.NOTION_LADDERS : [];

  const courseIds = new Set(window.NOTION_COURSES.map(item => item.id));
  courses.forEach(course => {
    window.NOTION_DOMAIN_RELATIONS[course.id] = [course.domain];
    if (!courseIds.has(course.id)) {
      window.NOTION_COURSES.push(course);
      courseIds.add(course.id);
    }
  });

  const ladderIds = new Set(window.NOTION_LADDERS.map(item => item.id));
  ladders.forEach(ladder => {
    if (!ladderIds.has(ladder.id)) {
      window.NOTION_LADDERS.push(ladder);
      ladderIds.add(ladder.id);
    }
  });

  window.SPRINT_HANDBOOK_COURSES = courses;
  window.SPRINT_HANDBOOK_LADDERS = ladders;
})();
