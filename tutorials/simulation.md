# 基礎模擬 (Simulation)

<h4>1. 什麼是「模擬題」？</h4>
          <p>模擬（Simulation）是競賽程式中最直覺但也最容易寫出 Bug 的題型。它的核心精神是：<strong>「題目要你做什麼，你就用程式碼原封不動地做出什麼。」</strong></p>
          <p>模擬題通常不需要複雜的演算法或高等數學，而是考驗你**「閱讀長篇大論的題意並將其精確轉換為程式碼」**的能力。常見的題型包含：棋盤遊戲（如踩地雷、井字棋）、文字處理、二維矩陣翻轉與旋轉，或是按照特定步驟模擬狀態轉移（如撲克牌洗牌）。</p>
          
          <h4>2. 模擬題的痛點與避坑指南</h4>
          <ul>
            <li><strong>邊界條件與 Off-by-One 錯誤：</strong> 陣列索引是否會溢位（例如 $0$-indexed 與 $1$-indexed 的轉換）？</li>
            <li><strong>複雜狀態轉移：</strong> 建議在草稿紙上先畫出狀態轉移的流程圖，再開始動筆寫程式，切忌一邊想一邊寫。</li>
            <li><strong>模組化設計 (Modular Design)：</strong> 如果題目包含多個獨立的操作（例如 APCS 矩陣翻轉 + 旋轉），請將它們寫成獨立的函數（如 <code>rotate()</code>、<code>flip()</code>），而不是把幾百行程式碼全部塞在 <code>main()</code> 裡面。</li>
          </ul>

          <h4>3. 高手必備技巧：網格方向向量 (dx, dy)</h4>
          <p>在二維網格模擬（如走迷宮、貪食蛇）中，我們常需要讓角色向「上、下、左、右」或「斜向八方」移動。如果你用多個 <code>if-else</code> 來寫，程式碼會顯得冗長且極易出錯。</p>
          <p><strong>優雅的解法：方向陣列。</strong> 我們可以宣告兩個陣列來代表 $X$ 軸與 $Y$ 軸的偏移量：</p>
          <pre><code>// 依序代表：上 (0), 右 (1), 下 (2), 左 (3) 的方向偏移
+const int dx[] = {-1, 0, 1, 0};
+const int dy[] = {0, 1, 0, -1};
+
+// 當前坐標在 (x, y)，要朝方向 dir (0~3) 移動一步：
+int next_x = x + dx[dir];
+int next_y = y + dy[dir];</code></pre>
          <p>如果要逆時針轉 90 度，只需 <code>dir = (dir + 3) % 4;</code>；順時針轉 90 度，只需 <code>dir = (dir + 1) % 4;</code>。這極大地簡化了程式碼複雜度！</p>

          <h4>4. 經典實戰模板：二維矩陣順時針 90 度旋轉</h4>
          <p>在 APCS 實作題中，矩陣操作是極高頻的常客。讓我們來看如何將一個 $R 	imes C$（$R$ 行 $C$ 列）的矩陣 $A$ 順時針旋轉 90 度，得到一個 $C 	imes R$ 的新矩陣 $B$：</p>
          <pre><code>// 旋轉原理：
+// 原本的 A[i][j] 會跑到新矩陣的 B[j][R - 1 - i] 位置
+
+vector&lt;vector&lt;int&gt;&gt; rotate90(const vector&lt;vector&lt;int&gt;&gt;&amp; A) {
+    int R = A.size();
+    int C = A[0].size();
+    // 宣告一個 C 行 R 列 的新矩陣，初始化為 0
+    vector&lt;vector&lt;int&gt;&gt; B(C, vector&lt;int&gt;(R, 0));
+    
+    for (int i = 0; i &lt; R; i++) {
+        for (int j = 0; j &lt; C; j++) {
+            B[j][R - 1 - i] = A[i][j];
+        }
+    }
+    return B;
+}</code></pre>