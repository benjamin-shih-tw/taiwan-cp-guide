# 時間複雜度分析 (Time Complexity)

<h4>1. 為什麼要學複雜度？（競程的第一條鐵律）</h4>
          <p>在競賽程式（Competitive Programming）中，每一道題目都設有嚴格的<strong>「時間限制」</strong>（通常為 $1.0$ 秒）與<strong>「空間限制」</strong>（通常為 $256 \text{ MB}$）。如果你的程式運行超時，就會得到無情的 <code>TLE (Time Limit Exceeded)</code>。</p>
          <p>在實戰中，我們絕對不能「先隨便寫一個解法，等跑超時了再想辦法優化」。因為這樣會浪費極多寶貴的競賽時間。我們必須在**動筆寫程式碼之前**，就透過題目給定的「測資資料範圍 $N$」，精確估算出我們的演算法會執行多少次基本運算，預先判定它能不能在時限內通過！</p>
          
          <h4>2. 什麼是大 $O$ 符號？（Big-O Notation）</h4>
          <p>大 $O$ 符號用來表示演算法在最壞情況下，其執行時間隨著輸入資料規模 $N$ 增長時的<strong>「增長趨勢」</strong>。它忽略了低階項與常數係數，只關注最主要的增長因素。</p>
          <p>例如，若一個程式的基本運算次數是 $3N^2 + 5N + 10$，當 $N$ 變得極大時（如 $10^5$），$N^2$（即 $10^{10}$）會遠遠大於 $5N$（即 $5 	imes 10^5$），因此低階項 $5N+10$ 與常數係數 $3$ 都可以忽略不記，我們稱其時間複雜度為 $O(N^2)$。</p>

          <h4>3. 程式碼實戰：常見複雜度的程式碼特徵</h4>
          <ul>
            <li>
              <strong>$O(1)$ — 常數時間 (Constant Time)</strong>
              <p>無論輸入的 $N$ 有多大，程式執行的步驟都是固定的。例如透過數學公式直接求值：</p>
              <pre><code>// 計算 1 加到 N 的總和
long long sum = 1LL * N * (N + 1) / 2; // 只需 1 步運算</code></pre>
            </li>
            <li>
              <strong>$O(N)$ — 線性時間 (Linear Time)</strong>
              <p>運算次數與 $N$ 成正比。最常見的特徵是「單層迴圈」：</p>
              <pre><code>// 遍歷長度為 N 的陣列尋找最大值
int max_val = a[0];
for (int i = 1; i &lt; N; i++) {
    max_val = max(max_val, a[i]);
}</code></pre>
            </li>
            <li>
              <strong>$O(N^2)$ — 平方時間 (Quadratic Time)</strong>
              <p>最常見的特徵是「雙層嵌套迴圈」：</p>
              <pre><code>// 氣泡排序法 (Bubble Sort)
for (int i = 0; i &lt; N; i++) {
    for (int j = i + 1; j &lt; N; j++) {
        if (a[i] &gt; a[j]) swap(a[i], a[j]);
    }
}</code></pre>
            </li>
            <li>
              <strong>$O(log N)$ — 對數時間 (Logarithmic Time)</strong>
              <p>每次運算後，問題的規模都會折半。最經典的特徵是「二分搜尋法」：</p>
              <pre><code>int L = 0, R = N - 1;
while (L &lt;= R) {
    int mid = L + (R - L) / 2;
    if (a[mid] == target) return mid;
    else if (a[mid] &lt; target) L = mid + 1;
    else R = mid - 1;
}</code></pre>
            </li>
            <li>
              <strong>$O(N log N)$ — 線性對數時間</strong>
              <p>常見於高效排序演算法（如 <code>std::sort</code>）與分治法。例如先將大小為 $N$ 的數組進行排序，然後遍歷一次。</p>
            </li>
          </ul>

          <h4>4. 競程萬用對照表：根據 $N$ 選擇解法</h4>
          <p>現代電腦的 CPU 在 $1.0$ 秒內大約可以執行 <strong>$10^8$ 次基本運算（一億次）</strong>。請牢記以下對照表：</p>
          <table class="tutorial-table" style="width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.9rem;">
            <thead>
              <tr style="background: rgba(255,255,255,0.06); border-bottom: 2px solid rgba(255,255,255,0.1);">
                <th style="padding: 0.6rem; text-align: left;">資料規模 $N$</th>
                <th style="padding: 0.6rem; text-align: left;">最大允許複雜度</th>
                <th style="padding: 0.6rem; text-align: left;">推薦演算法 / 技巧</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
                <td style="padding: 0.6rem;">$N le 10$</td>
                <td style="padding: 0.6rem; color: #f43f5e; font-weight: 600;">$O(N!)$ 或 $O(3^N)$</td>
                <td style="padding: 0.6rem;">全排列枚舉、暴力回溯法</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
                <td style="padding: 0.6rem;">$N le 20$</td>
                <td style="padding: 0.6rem; color: #f59e0b; font-weight: 600;">$O(2^N)$</td>
                <td style="padding: 0.6rem;">子集枚舉、折半搜尋、狀態壓縮 DP</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
                <td style="padding: 0.6rem;">$N le 500$</td>
                <td style="padding: 0.6rem; color: #eab308; font-weight: 600;">$O(N^3)$</td>
                <td style="padding: 0.6rem;">Floyd-Warshall 最短路徑、區間 DP</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
                <td style="padding: 0.6rem;">$N le 5000$</td>
                <td style="padding: 0.6rem; color: #3b82f6; font-weight: 600;">$O(N^2)$</td>
                <td style="padding: 0.6rem;">雙層迴圈暴力、動態規劃 (DP)</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
                <td style="padding: 0.6rem;">$N le 2 	imes 10^5$</td>
                <td style="padding: 0.6rem; color: #10b981; font-weight: 600;">$O(N log N)$</td>
                <td style="padding: 0.6rem;"><code>std::sort</code>、二分搜尋、線段樹、分治法</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
                <td style="padding: 0.6rem;">$N le 10^7$</td>
                <td style="padding: 0.6rem; color: #10b981; font-weight: 600;">$O(N)$</td>
                <td style="padding: 0.6rem;">單層迴圈、雙指針、差分、單調棧/佇列、線性篩</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
                <td style="padding: 0.6rem;">$N ge 10^8$</td>
                <td style="padding: 0.6rem; color: #a78bfa; font-weight: 600;">$O(log N)$ 或 $O(1)$</td>
                <td style="padding: 0.6rem;">數學公式、對數二分搜尋、矩陣快速冪</td>
              </tr>
            </tbody>
          </table>

          <blockquote>
            <p><strong>💡 空間複雜度 (Memory Limit) 同樣不容忽視：</strong><br>
            一般競程的記憶體限制為 $256 \text{ MB}$。在 C++ 中，一個標準 <code>int</code> 佔用 $4$ Bytes，一個 <code>long long</code> 佔用 $8$ Bytes。<br>
            - $10^6$ 個 <code>int</code> 陣列佔用約 $4 \text{ MB}$ 的空間。<br>
            - 在限制為 $256 \text{ MB}$ 的情況下，宣告的陣列大小**絕對不應超過 $5 	imes 10^7$ 個 <code>int</code>**（約佔 $200 \text{ MB}$）。否則會得到 <code>MLE (Memory Limit Exceeded)</code> 錯誤！</p>
          </blockquote>