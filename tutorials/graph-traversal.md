# 圖的遍歷：DFS 與 BFS

<h4>1. 競程中的圖論起手式：如何存一張圖？</h4>
          <p>在解圖論題之前，我們必須先考慮如何在記憶體中高效率地表達頂點（Vertices, $V$）與邊（Edges, $E$）的關係。競程中最常用的儲存方式有兩種：</p>
          <ul>
            <li>
              <strong>鄰接矩陣 (Adjacency Matrix)：空間複雜度 $O(V^2)$</strong>
              <p>用二維陣列 <code>adj[u][v]</code> 儲存點 $u$ 到點 $v$ 是否有邊。因為空間高達 $O(V^2)$，在點數 $V ge 10^5$ 的競程題目中會直接導致 <strong>MLE (Memory Limit Exceeded)</strong>，因此只適合 $V le 1000$ 的稠密圖。</p>
            </li>
            <li>
              <strong>鄰接串列 (Adjacency List) —— 競程標配：空間複雜度 $O(V + E)$</strong>
              <p>用 C++ 的動態陣列 <code>vector&lt;vector&lt;int&gt;&gt; adj</code> 儲存。<code>adj[u]</code> 是一個儲存「所有從點 $u$ 連出去的相鄰頂點」的動態陣列。這種存法既省空間，又能在 $O(\text{degree}(u))$ 時間內遍歷相鄰點，是幾乎所有圖論演算法的基礎。</p>
              <pre><code class="language-cpp">// 讀入無向圖並建構鄰接串列的標準寫法
int V, E;
cin &gt;&gt; V &gt;&gt; E;
vector&lt;vector&lt;int&gt;&gt; adj(V + 1); // 頂點編號通常為 1-indexed

for (int i = 0; i &lt; E; i++) {
    int u, v;
    cin &gt;&gt; u &gt;&gt; v;
    adj[u].push_back(v);
    adj[v].push_back(u); // 若是有向圖，刪除這一行
}</code></pre>
            </li>
          </ul>

          <h4>2. 深度優先搜尋 (DFS, Depth First Search)</h4>
          <p><strong>核心思想：一路走到底，碰壁再回頭。</strong> DFS 是一種類似探險迷宮的走法，它會沿著某一條分支不斷深入遍歷，直到無路可走（碰到葉子節點或已訪問過的點），才回溯到上一個分叉路口，尋找下一個未探索的分支。</p>
          <p>在程式實現上，DFS 自然地利用了<strong>「遞迴（Recursion）」</strong>結構，本質上是由系統的 <strong>Stack（棧）</strong> 來維護遍歷順序。其時間複雜度為 $O(V + E)$。</p>
          <p><strong>C++ DFS 核心程式碼模板：</strong></p>
          <pre><code class="language-cpp">#include &lt;bits/stdc++.h&gt;
using namespace std;

vector&lt;vector&lt;int&gt;&gt; adj;
vector&lt;bool&gt; vis;

// DFS 遍歷頂點 u，p 為 u 的父節點（主要用於樹上防走回頭路，若是一般圖可省略 p）
void dfs(int u, int p = -1) {
    vis[u] = true;
    
    for (int v : adj[u]) {
        if (v == p) continue; // 防走回頭路
        if (!vis[v]) {
            dfs(v, u); // 遞迴訪問鄰居
        }
    }
}</code></pre>

          <h4>3. 廣度優先搜尋 (BFS, Breadth First Search)</h4>
          <p><strong>核心思想：平鋪直敘，層層擴展（水波效應）。</strong> BFS 就像是往平靜的湖面丟一顆石頭，水波會一圈一圈、由近及遠地向外擴散。BFS 從起點出發，先訪問所有距離為 1 的點，再訪問距離為 2 的點，以此類推。</p>
          <p>在程式實現上，BFS 需要借助<strong>「佇列（Queue，先進先出 FIFO）」</strong>來實現，並以一個 <code>dist</code> 陣列記錄起點到每個點的最短距離。時間複雜度為 $O(V + E)$。</p>
          <p><strong>C++ BFS 核心程式碼模板（求無權圖最短路徑）：</strong></p>
          <pre><code class="language-cpp">#include &lt;bits/stdc++.h&gt;
using namespace std;

vector&lt;vector&lt;int&gt;&gt; adj;

// BFS 尋找從 start 到所有點的最短距離
vector&lt;int&gt; bfs(int start, int n) {
    vector&lt;int&gt; dist(n + 1, -1); // -1 代表未訪問
    queue&lt;int&gt; q;
    
    q.push(start);
    dist[start] = 0; // 起點距離為 0
    
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        
        for (int v : adj[u]) {
            if (dist[v] == -1) { // 如果鄰居未被訪問
                dist[v] = dist[u] + 1; // 更新距離 (層級 + 1)
                q.push(v); // 放入佇列中
            }
        }
    }
    return dist; // 回傳距離陣列
}</code></pre>

          <h4>4. DFS 與 BFS 的抉擇對比</h4>
          <table class="tutorial-table" style="width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.9rem;">
            <thead>
              <tr style="background-color: var(--card-bg-light); border-bottom: 2px solid var(--neon-cyan);">
                <th style="padding: 0.6rem; text-align: left;">比較維度</th>
                <th style="padding: 0.6rem; text-align: left;">深度優先搜尋 (DFS)</th>
                <th style="padding: 0.6rem; text-align: left;">廣度優先搜尋 (BFS)</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 0.6rem; font-weight: bold;">使用資料結構</td>
                <td style="padding: 0.6rem;">系統 Stack (遞迴)</td>
                <td style="padding: 0.6rem;">Queue (佇列)</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 0.6rem; font-weight: bold;">空間複雜度</td>
                <td style="padding: 0.6rem;">$O(H)$，與樹高/深度成正比，通常省空間</td>
                <td style="padding: 0.6rem;">$O(W)$，與最大寬度成正比，層次點多時較耗記憶體</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 0.6rem; font-weight: bold;">求無權圖最短路徑</td>
                <td style="padding: 0.6rem;">不適合（回溯法求最短路需要暴力枚舉所有路徑，極慢）</td>
                <td style="padding: 0.6rem;"><strong>最佳選擇</strong>（第一次碰到目標點時，該路徑必定是最短路）</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 0.6rem; font-weight: bold;">經典應用場景</td>
                <td style="padding: 0.6rem;">連通塊統計、環路偵測、樹上路徑資訊維護（樹形 DP）、回溯搜狀態空間</td>
                <td style="padding: 0.6rem;">走迷宮求最少步數、無權最短路、圖上按距離層次分層處理</td>
              </tr>
            </tbody>
          </table>