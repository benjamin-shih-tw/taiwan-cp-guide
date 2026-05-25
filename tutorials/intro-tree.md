# 樹論基礎與直徑 (Introduction to Trees and Tree Diameter)

在圖論與演算法競賽（Competitive Programming, CP）中，「樹（Tree）」是最常用且最重要的資料結構之一。它不僅具備簡潔的數學性質，同時也是許多進階資料結構與演算法（如最近公共祖先 LCA、樹鏈剖分、樹狀 DP 等）的基石。本教學將從樹的基本定義出發，深入探討如何透過鄰接串列進行表示、利用 DFS 計算深度與子樹大小，並詳細說明及證明求解「樹的直徑」的經典演算法。

---

## 1. 核心觀念與基本原理

### 1.1 樹的定義與數學性質
在圖論中，一棵擁有 $V$ 個頂點（Vertices）的無向圖 $G = (V, E)$，若滿足以下任一等價條件，即可稱之為**樹（Tree）**：
1. **連通且無環**：圖 $G$ 是連通的（Connected），且不包含任何環（Cycle）。
2. **邊數與頂點關係**：圖 $G$ 連通，且恰好有 $E = V - 1$ 條邊。
3. **唯一簡單路徑**：圖中任意兩個不同的頂點之間，**有且僅有一條**簡單路徑（Simple Path）。
4. **極小連通圖**：圖 $G$ 連通，但任意刪除一條邊都會導致圖不連通。
5. **極大無環圖**：圖 $G$ 無環，但任意在不相鄰的兩點間加入一條邊，都會形成唯一的環。

在演算法設計中，**「唯一簡單路徑」**是最關鍵的性質。這意味著我們不需要使用複雜的 Dijkstra 等圖論最短路徑演算法來尋找兩點間的通路，只需透過基本的遍歷演算法即可完成。

---

### 1.2 樹的表示法 (Tree Representations)
在程式實作中，樹通常使用**鄰接串列（Adjacency List）**來儲存。
由於樹的邊數為 $V - 1$，它是一種極度稀疏的圖（Sparse Graph）。若使用鄰接矩陣（Adjacency Matrix）儲存，將消耗 $O(V^2)$ 的記憶體空間，這在 $V \ge 10^5$ 的競賽題目中會直接導致記憶體超限（MLE）。
而使用鄰接串列，僅需 $O(V)$ 的空間，並能在 $O(1)$ 的時間內存取某個節點的所有相鄰節點。

#### 無權樹（Unweighted Tree）的鄰接串列
```cpp
// C++ 範例
vector<int> adj[N];
```

#### 帶權樹（Weighted Tree）的鄰接串列
```cpp
// C++ 範例：利用 pair 儲存 (相鄰節點, 邊權)
vector<pair<int, int>> adj[N];
```

---

### 1.3 利用 DFS 計算樹的深度與子樹大小
在一般的圖上進行深度優先搜尋（DFS）時，我們必須使用一個 `visited` 陣列來記錄造訪過的節點，以防陷入無窮迴圈（環路）。
然而在樹上，因為**不存在環**，我們可以使用一個非常優雅的技巧：**「傳遞父節點（Parent）參數」**。

當我們從節點 $u$ 遍歷其所有相鄰節點 $v$ 時，只要滿足 $v \neq \text{parent}$，即可保證不走回頭路。這樣不僅省去了 `visited` 陣列的記憶體開銷，也讓程式碼更加簡潔。

#### 1.3.1 樹的深度（Depth）
定義根節點的深度為 $1$（或 $0$）。若節點 $u$ 的深度為 $\text{depth}[u]$，則其子節點 $v$ 的深度計算公式為：
$$\text{depth}[v] = \text{depth}[u] + 1$$

#### 1.3.2 子樹大小（Subtree Size）
以節點 $u$ 為根的子樹所包含的節點總數 $\text{size}[u]$，等於所有子節點 $v$ 的子樹大小總和再加上 $1$（代表節點 $u$ 本身）。遞迴關係式為：
$$\text{size}[u] = 1 + \sum_{v \in \text{children}(u)} \text{size}[v]$$

#### 實作概念碼：
```cpp
void dfs(int u, int p, int d) {
    depth[u] = d;
    subtree_size[u] = 1;
    for (int v : adj[u]) {
        if (v != p) { // 避免走回父節點
            dfs(v, u, d + 1);
            subtree_size[u] += subtree_size[v];
        }
    }
}
```

---

### 1.4 樹的直徑 (Tree Diameter)
**樹的直徑**定義為：**樹上任意兩個頂點之間的最長簡單路徑長度**。
路徑長度的定義可以是「邊的數量」，或是邊上「權重的總和」。

求解樹的直徑最經典且高效的方法為**雙重 DFS（或 BFS）演算法**。該方法包含兩個步驟：
1. **第一次走訪**：從樹中任意選擇一個節點 $u$ 出發進行 DFS，找到距離 $u$ 最遠的節點，記為 $x$。
2. **第二次走訪**：從節點 $x$ 出發進行第二次 DFS，找到距離 $x$ 最遠的節點，記為 $y$。
3. **結論**：節點 $x$ 與 $y$ 之間的路徑即為樹的直徑，其長度（距離）即為直徑長度。

#### 雙重 DFS 的正確性證明
為什麼第一次 DFS 找到的最遠點 $x$ 一定是直徑的端點之一？

我們可以用反證法來直觀理解：
設這棵樹的某一條真正直徑為路徑 $P(A, B)$。我們從任意頂點 $u$ 出發尋找最遠的頂點 $x$。
* **情況一：$u$ 在直徑 $P(A, B)$ 上。**
  假設 $x$ 不是直徑的端點（即 $x \neq A$ 且 $x \neq B$）。
  因為 $x$ 是從 $u$ 出發能到達的最遠點，所以有 $d(u, x) > d(u, A)$ 且 $d(u, x) > d(u, B)$。
  但如果這樣，我們可以建構出一條新的路徑 $P(x, B)$，其長度為 $d(x, u) + d(u, B) > d(A, u) + d(u, B) = d(A, B)$。這與 $P(A, B)$ 是最長路徑（直徑）的假設矛盾。因此，$x$ 必定是 $A$ 或 $B$。
  
* **情況二：$u$ 不在直徑 $P(A, B)$ 上。**
  設從 $u$ 到直徑 $P(A, B)$ 的最短路徑與直徑相交於節點 $v$。
  當我們從 $u$ 出發尋找最遠點時，該路徑必定會經過點 $v$，然後沿著直徑走向 $A$ 或 $B$。如果它走向了其他非直徑端點的點 $C$，同理可推導出 $P(C, A)$ 或 $P(C, B)$ 會比原直徑 $P(A, B)$ 更長，再次產生矛盾。

因此，不論起點 $u$ 為何，第一次 DFS 得到的最遠點 $x$ 必定是樹的直徑的其中一個端點。既然 $x$ 已是直徑端點，那麼第二次從 $x$ 出發找到的最遠點 $y$ 自然就是直徑的另一個端點，兩者間的距離即為直徑。

> [!WARNING]
> 雙重 DFS/BFS 演算法**僅在所有邊權皆為非負數時成立**。若樹中含有負邊權，此正確性證明將不再成立，此時必須使用**樹狀動態規劃（Tree DP）**來求解。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

以下提供三種語言的完整實作範本，均採用雙重 DFS 演算法求解**帶權樹的直徑**。
程式碼中均包含輸入處理、特判處理（如 $N \le 1$）以及防禦型變數設計（防止溢位）。

### 2.1 C++ 實作範本
```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

// 定義邊的結構
struct Edge {
    int to;
    long long weight;
};

int n;
vector<vector<Edge>> adj;
long long max_dist;
int farthest_node;

// 深度優先搜尋 (DFS)
// u: 當前節點, p: 父節點, dist: 從起點到當前節點的累計距離
void dfs(int u, int p, long long dist) {
    if (dist > max_dist) {
        max_dist = dist;
        farthest_node = u;
    }
    for (const auto& edge : adj[u]) {
        if (edge.to != p) {
            dfs(edge.to, u, dist + edge.weight);
        }
    }
}

int main() {
    // 最佳化輸入輸出效能
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    if (!(cin >> n)) return 0;

    // 初始化鄰接串列 (點編號為 1 到 n)
    adj.assign(n + 1, vector<Edge>());

    for (int i = 0; i < n - 1; ++i) {
        int u, v;
        long long w;
        cin >> u >> v >> w;
        adj[u].push_back({v, w});
        adj[v].push_back({u, w});
    }

    // 防禦性特判：若頂點數為 1，直徑為 0
    if (n <= 1) {
        cout << 0 << "\n";
        return 0;
    }

    // 第一次 DFS：從任意點（此處選點 1）出發，找出最遠的點 farthest_node
    max_dist = -1;
    farthest_node = 1;
    dfs(1, 0, 0);

    // 第二次 DFS：從最遠點 farthest_node 出發，找出真正的直徑長度
    int start_node = farthest_node;
    max_dist = -1;
    dfs(start_node, 0, 0);

    cout << max_dist << "\n";

    return 0;
}
```

---

### 2.2 Java 實作範本
```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.StringTokenizer;

public class Main {
    // 定義邊的類別
    static class Edge {
        int to;
        long weight;

        Edge(int to, long weight) {
            this.to = to;
            this.weight = weight;
        }
    }

    static int n;
    static ArrayList<ArrayList<Edge>> adj;
    static long maxDist;
    static int farthestNode;

    // 深度優先搜尋 (DFS)
    static void dfs(int u, int p, long dist) {
        if (dist > maxDist) {
            maxDist = dist;
            farthestNode = u;
        }
        for (Edge edge : adj.get(u)) {
            if (edge.to != p) {
                dfs(edge.to, u, dist + edge.weight);
            }
        }
    }

    public static void main(String[] args) throws IOException {
        FastScanner scanner = new FastScanner();
        Integer num = scanner.nextInt();
        if (num == null) return;
        n = num;

        // 初始化鄰接串列
        adj = new ArrayList<>(n + 1);
        for (int i = 0; i <= n; i++) {
            adj.add(new ArrayList<>());
        }

        for (int i = 0; i < n - 1; i++) {
            int u = scanner.nextInt();
            int v = scanner.nextInt();
            long w = scanner.nextLong();
            adj.get(u).add(new Edge(v, w));
            adj.get(v).add(new Edge(u, w));
        }

        // 防禦性特判
        if (n <= 1) {
            System.out.println(0);
            return;
        }

        // 第一次 DFS：從任意點（此處選點 1）出發
        maxDist = -1;
        farthestNode = 1;
        dfs(1, 0, 0);

        // 第二次 DFS：從最遠點出發
        int startNode = farthestNode;
        maxDist = -1;
        dfs(startNode, 0, 0);

        System.out.println(maxDist);
    }

    // 高效快速輸入解析器
    static class FastScanner {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st;

        String next() {
            while (st == null || !st.hasMoreTokens()) {
                try {
                    String line = br.readLine();
                    if (line == null) return null;
                    st = new StringTokenizer(line);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            return st.nextToken();
        }

        Integer nextInt() {
            String val = next();
            return val == null ? null : Integer.parseInt(val);
        }

        Long nextLong() {
            String val = next();
            return val == null ? null : Long.parseLong(val);
        }
    }
}
```

---

### 2.3 Python 實作範本
```python
import sys

# 提高 Python 的預設遞迴深度限制，避免在鏈狀樹（Deep Tree）中發生 Stack Overflow
sys.setrecursionlimit(300000)

def solve():
    # 使用 sys.stdin.read 進行高速輸入讀取
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    
    n = int(input_data[0])
    
    # 防禦性特判：若頂點數小於等於 1
    if n <= 1:
        print(0)
        return
    
    # 建立鄰接串列
    adj = [[] for _ in range(n + 1)]
    idx = 1
    for _ in range(n - 1):
        if idx >= len(input_data):
            break
        u = int(input_data[idx])
        v = int(input_data[idx+1])
        w = int(input_data[idx+2])
        adj[u].append((v, w))
        adj[v].append((u, w))
        idx += 3

    max_dist = -1
    farthest_node = 1

    # 定義內部 DFS 函數
    def dfs(u, p, dist):
        nonlocal max_dist, farthest_node
        if dist > max_dist:
            max_dist = dist
            farthest_node = u
        for to, weight in adj[u]:
            if to != p:
                dfs(to, u, dist + weight)

    # 第一次 DFS：從節點 1 出發找出最遠節點
    dfs(1, 0, 0)

    # 第二次 DFS：從最遠節點出發找出直徑
    start_node = farthest_node
    max_dist = -1
    dfs(start_node, 0, 0)

    print(max_dist)

if __name__ == '__main__':
    solve()
```

---

## 3. 複雜度與防禦要點

### 3.1 複雜度分析
* **時間複雜度**：
  在雙重 DFS 演算法中，我們對整棵樹進行了兩次深度優先搜尋。
  每一次 DFS 都會走訪所有頂點一次，並遍歷所有邊兩次（一進一出）。
  由於樹的性質滿足邊數 $E = V - 1$，故單次 DFS 的時間複雜度為 $O(V + E) = O(V)$。
  總時間複雜度為 $2 \times O(V) = O(V)$，這在 $V \le 2 \times 10^5$ 的測資下可在數十毫秒內執行完畢。
  
* **空間複雜度**：
  * **鄰接串列**：需要儲存 $V$ 個頂點與 $2(V-1)$ 條單向邊，空間複雜度為 $O(V)$。
  * **系統遞迴堆疊（Call Stack）**：
    * 在最壞情況下（樹退化為一條鏈），樹的深度為 $O(V)$，遞迴深度達 $V$ 層，堆疊空間為 $O(V)$。
    * 在最好情況下（樹為完全二元樹），樹的深度為 $O(\log V)$，堆疊空間為 $O(\log V)$。
  * 總空間複雜度為 $O(V)$。

---

### 3.2 防禦要點與常見陷阱

1. **數值溢位（Numerical Overflow）**
   * **問題**：若樹的頂點數 $N \le 2 \times 10^5$，且每條邊的權重可高達 $10^9$，則直徑的最大可能值為 $2 \times 10^{14}$。
   * **防禦**：這遠遠超出了標準 32 位元有號整數（`int`，上限約 $2 \times 10^9$）的範圍。因此，在 C++ 中必須使用 `long long`，Java 中必須使用 `long` 來儲存距離和邊權；Python 則會自動轉換為大數，無須擔心溢位，但需注意運算效能。

2. **記憶體溢位（Stack Overflow / 遞迴上限）**
   * **問題**：如果測資給定一棵極端偏斜的樹（鏈狀樹），C++ 或 Java 的預設系統堆疊大小可能不足以容納 $2 \times 10^5$ 層遞迴，導致 `Segment Fault` 或 `StackOverflowError`。
   * **防禦**：
     * **Python**：必須顯式呼叫 `sys.setrecursionlimit` 提升遞迴限制。
     * **Java**：在有些線上評測系統（OJ）中，遞迴過深會直接出錯。若題目記憶體限制極嚴苛或樹極深，可改用**雙重 BFS** 實作（使用佇列 `Queue` 迭代），或是手動用 `Stack` 模擬 DFS，即可完全避免堆疊溢位問題。

3. **極端輸入特判 ($N \le 2$)**
   * **$N = 1$**：只有一個節點，沒有任何邊。此時不應執行 DFS，應直接輸出 `0`。否則從頂點 1 出發，可能會因為鄰接串列為空而引發未定義行為或無用運算。
   * **$N = 2$**：只有兩個節點與一條邊，此時直徑即為該唯一的邊權，確保程式正確讀取並輸出該邊權。

4. **圖的連通性**
   * 雙重 DFS 演算法建立在「圖是一棵樹（必定連通）」的假設上。如果題目給定的是一個由多棵樹組組成的**森林（Forest）**，該演算法將無法在一次流程中求得全圖的最長路徑。請在解題前仔細閱讀題目，確認圖是連通的。
