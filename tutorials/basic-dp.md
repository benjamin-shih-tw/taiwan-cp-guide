# 動態規劃入門 (Intro to DP)

<h4>1. 什麼是動態規劃？（重疊子問題的優化藝術）</h4>
          <p><strong>動態規劃（Dynamic Programming, 簡稱 DP）</strong>是演算法設計中極為核心的思想。當一個大問題可以被拆解為多個<strong>「重疊的子問題」</strong>，且這些子問題的解能夠重複使用時，我們就可以透過「記錄下子問題的解」來避免重複計算，進而將原本指數級時間複雜度的暴力解優化到線性或多項式級別！</p>
          
          <p><strong>生活化比喻：</strong> 
            老師問你：「$1+1+1+1+1$ 等於多少？」你數了一下說：「等於 $5$。」
            老師接著在黑板左邊寫上一個新的「$1+$」，然後問你：「那這個等於多少？」你幾乎毫不猶豫地脫口而出：「等於 $6$！」
            為什麼你不需要重新把 6 個 1 加一遍？因為你的大腦自動「記錄」了先前五個 1 加起來等於 $5$ 的事實，你只要在 $5$ 的基礎上再 $+1$ 即可。這就是 DP 的底層思維：<strong>「記住過去，推導未來」</strong>！
          </p>

          <h4>2. 動態規劃三大支柱（The 3 Pillars of DP）</h4>
          <p>要設計出一個正確且高效的 DP 演算法，必須清楚定義以下三個核心要素：</p>
          <ol>
            <li>
              <strong>狀態定義 (State Definition)：</strong>
              <p>明確說明 <code>dp[i]</code> 或 <code>dp[i][j]</code> 這張表代表的物理意義。例如：<code>dp[i]</code> 代表「走到第 $i$ 階樓梯的總方法數」，或是 <code>dp[i][w]</code> 代表「前 $i$ 個物品在背包容量限重 $w$ 下的最大總價值」。</p>
            </li>
            <li>
              <strong>轉移方程 (Transition Equation)：</strong>
              <p>當前狀態如何由先前已經計算出來的更小子問題狀態推導過來。例如：<code>dp[i] = dp[i-1] + dp[i-2]</code>（爬樓梯只能從前一階或前兩階跨上來）。</p>
            </li>
            <li>
              <strong>邊界與初始條件 (Base Cases)：</strong>
              <p>最基礎、不需要任何轉移就能直接得知的狀態解。例如：<code>dp[1] = 1</code>、<code>dp[2] = 2</code>。這是整張 DP 表格得以向後遞推的起點。</p>
            </li>
          </ol>

          <h4>3. DP 的兩大實作風格：遞迴 vs 遞推</h4>
          <ul>
            <li>
              <strong>自頂向下 (Top-Down) —— 記憶化搜索 (Memoization)</strong>
              <p>以遞迴方式解決問題，但在遞迴過程中以陣列或 Map 紀錄結果，若該狀態已被計算過則直接回傳。思路直觀，只計算有需要的狀態。</p>
              <pre><code class="language-cpp">// 費氏數列：自頂向下 + 記憶化
vector&lt;long long&gt; memo(100, -1);
long long fib(int n) {
    if (n &lt;= 1) return n;
    if (memo[n] != -1) return memo[n]; // 命中記憶快取，直接回傳
    return memo[n] = fib(n - 1) + fib(n - 2); // 記錄答案並回傳
}</code></pre>
            </li>
            <li>
              <strong>自底向上 (Bottom-Up) —— 迭代遞推 (Tabulation) —— 競程最常用</strong>
              <p>從小狀態開始，以迴圈（迭代）由小到大填滿 DP 表格。沒有遞迴所產生的函式調用開銷，且便於進行<strong>「空間優化」</strong>。</p>
              <pre><code class="language-cpp">// 費氏數列：自底向上 + 遞推
long long fib_bottom_up(int n) {
    if (n &lt;= 1) return n;
    vector&lt;long long&gt; dp(n + 1);
    dp[0] = 0; dp[1] = 1;
    for (int i = 2; i &lt;= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}</code></pre>
            </li>
          </ul>

          <h4>4. 經典進階魔法：0/1 背包問題的「空間壓縮」</h4>
          <p>在經典的 0/1 背包問題中，給定物品重量 <code>w[i]</code> 與價值 <code>v[i]</code>，背包總限重為 $W$。二維轉移方程為：</p>
          <p>$$dp[i][j] = \max(dp[i-1][j], dp[i-1][j-w[i]] + v[i])$$</p>
          <p>因為第 $i$ 次轉移的計算「只依賴於第 $i-1$ 層的資料」，我們可以用一維陣列 <code>dp[j]</code> 來重複覆蓋更新！但是，在更新一維陣列時，內層迴圈<strong>必須從大到小（逆序）</strong>遍歷！</p>
          
          <p><strong>為什麼一定要「逆序」？</strong></p>
          <p>因為如果我們從小到大遍歷（如 <code>j = 0 -> W</code>），當我們在算較大的 <code>dp[j]</code> 時，它所依賴的較小狀態 <code>dp[j - w[i]]</code> 在同一次循環中<strong>已經被更新為第 $i$ 次更新後的值了</strong>（也就是說，同一個物品被重複選取了多次，這會變成完全背包問題！）。為了保證更新 <code>dp[j]</code> 時使用的 <code>dp[j - w[i]]</code> 仍是第 $i-1$ 層物品更新前的「舊值」，我們必須**從大到小遍歷**，這樣較小的值才不會被提早覆蓋！</p>
          
          <pre><code class="language-cpp">// 0/1 背包空間壓縮一維陣列版本
int knapsack_1D(int N, int W, const vector&lt;int&gt;&amp; weight, const vector&lt;int&gt;&amp; value) {
    vector&lt;int&gt; dp(W + 1, 0); // 初始化為 0
    
    for (int i = 0; i &lt; N; ++i) {
        // 內層迴圈必須逆序遍歷！
        for (int j = W; j &gt;= weight[i]; --j) {
            dp[j] = max(dp[j], dp[j - weight[i]] + value[i]);
        }
    }
    return dp[W];
}</code></pre>

          <h4>5. 避坑指南與實戰細節</h4>
          <ol>
            <li>
              <strong>表格初始化與極值設定：</strong>
              <p>如果題目要求的是「最小值（如最少硬幣數）」，DP 表格必須初始化為一個<strong>很大的代表值（如 <code>0x3f3f3f3f</code> 或 <code>1e9</code>）</strong>，否則 <code>min</code> 轉移會一直取到初始的 <code>0</code>。但千萬要注意，極值如果設得太大（例如 <code>LLONG_MAX</code>），在做轉移累加時會發生<strong>整數溢位</strong>，導致極值變成負數！</p>
            </li>
            <li>
              <strong>狀態定義不清：</strong>
              <p>遇到 DP 問題切忌急著寫程式碼。先拿紙筆清楚寫下：這維代表什麼？轉移是拿什麼推過來？只有狀態定義明確，寫程式碼才會一氣宏成，除錯時也極易追蹤每個狀態的值是否正確。</p>
            </li>
          </ol>