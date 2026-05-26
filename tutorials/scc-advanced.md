# 無向圖雙連通分量與割點橋 (Biconnected Components, Cut Vertices & Bridges)

在無向圖中，**連通性**的分析比單純的 DFS 深寬。透過 **Tarjan 演算法**，我們可以在 $\mathcal{O}(V + E)$ 時間內同時求出無向圖的 **割點 (Cut Vertices / Articulation Points)**、**橋 (Bridges)** 以及 **雙連通分量 (Biconnected Components, BCC)**。這在網路容災、拓撲結構分析中是頂級重要的基礎工具。

---

## 1. 核心觀念與基本原理

*   **基礎定義**：
    *   **割點 (Cut Vertex)**：在連通無向圖中，若刪除某個頂點 $u$ 及其相連的邊後，圖的連通分量個數增加，則稱 $u$ 為割點。
    *   **橋 (Bridge / Cut Edge)**：若刪除某條邊 $e$ 後，圖的連通分量個數增加，則稱 $e$ 為橋。
    *   **點雙連通 (Vertex Biconnected)**：任意兩點間存在至少兩條「頂點不重疊」的簡單路徑。一個點雙連通分量 (v-BCC) 中沒有割點。
    *   **邊雙連通 (Edge Biconnected)**：任意兩點間存在至少兩條「邊不重疊」的簡單路徑。一個邊雙連通分量 (e-BCC) 中沒有橋。
*   **Tarjan 演算法之 DFS 樹核心變數**：
    *   `dfn[u]`：節點 $u$ 在 DFS 遍歷中被訪問到的次序（時間戳記）。
    *   `low[u]`：從 $u$ 出發，經過最多一條非樹邊（後向邊），所能到達的最小時間戳記。
*   **判定準則**：
    *   **割點判定**：
        *   若 $u$ 是 DFS 樹的根節點：當且僅當 $u$ 擁有**至少兩個**子節點時，$u$ 是割點。
        *   若 $u$ 不是樹根：當且僅當存在一個子節點 $v$ 滿足 `low[v] >= dfn[u]` 時，$u$ 是割點。
    *   **橋判定**：
        *   一條無向樹邊 $(u, v)$（其中 $u$ 是 $v$ 的父節點）是橋，當且僅當 `low[v] > dfn[u]`。這意味著子樹 $v$ 內沒有任何後向邊可以繞回 $u$ 或 $u$ 以上的節點。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

以下實作示範：使用 Tarjan 演算法求出無向圖的所有**割點**與**橋**。

### C++ 實作範本

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

class TarjanUndirected {
private:
    int n;
    int timer;
    vector<vector<int>> adj;
    vector<int> dfn;
    vector<int> low;
    vector<bool> is_cut;
    vector<pair<int, int>> bridges;

    void dfs(int u, int p = -1) {
        dfn[u] = low[u] = ++timer;
        int children = 0;

        for (int v : adj[u]) {
            if (v == p) continue; // 避免直接回頭走父邊
            if (dfn[v]) {
                // 後向邊
                low[u] = min(low[u], dfn[v]);
            } else {
                // 樹枝邊
                children++;
                dfs(v, u);
                low[u] = min(low[u], low[v]);

                // 割點判定
                if (p != -1 && low[v] >= dfn[u]) {
                    is_cut[u] = true;
                }
                // 橋判定
                if (low[v] > dfn[u]) {
                    bridges.push_back({min(u, v), max(u, v)});
                }
            }
        }
        // 樹根單獨判定
        if (p == -1 && children > 1) {
            is_cut[u] = true;
        }
    }

public:
    TarjanUndirected(int n) : n(n), timer(0), adj(n), dfn(n, 0), low(n, 0), is_cut(n, false) {}

    void add_edge(int u, int v) {
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    void solve() {
        for (int i = 0; i < n; i++) {
            if (!dfn[i]) {
                dfs(i);
            }
        }
    }

    vector<int> get_cut_vertices() {
        vector<int> cuts;
        for (int i = 0; i < n; i++) {
            if (is_cut[i]) cuts.push_back(i);
        }
        return cuts;
    }

    vector<pair<int, int>> get_bridges() {
        return bridges;
    }
};
```

### Java 實作範本

```java
import java.util.*;

public class TarjanUndirected {
    private int n;
    private int timer;
    private List<List<Integer>> adj;
    private int[] dfn;
    private int[] low;
    private boolean[] isCut;
    private List<int[]> bridges;

    public TarjanUndirected(int n) {
        this.n = n;
        this.timer = 0;
        this.adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        this.dfn = new int[n];
        this.low = new int[n];
        this.isCut = new boolean[n];
        this.bridges = new ArrayList<>();
    }

    public void addEdge(int u, int v) {
        adj.get(u).add(v);
        adj.get(v).add(u);
    }

    private void dfs(int u, int p) {
        dfn[u] = low[u] = ++timer;
        int children = 0;

        for (int v : adj.get(u)) {
            if (v == p) continue;
            if (dfn[v] > 0) {
                low[u] = Math.min(low[u], dfn[v]);
            } else {
                children++;
                dfs(v, u);
                low[u] = Math.min(low[u], low[v]);

                if (p != -1 && low[v] >= dfn[u]) {
                    isCut[u] = true;
                }
                if (low[v] > dfn[u]) {
                    bridges.add(new int[]{Math.min(u, v), Math.max(u, v)});
                }
            }
        }

        if (p == -1 && children > 1) {
            isCut[u] = true;
        }
    }

    public void solve() {
        for (int i = 0; i < n; i++) {
            if (dfn[i] == 0) {
                dfs(i, -1);
            }
        }
    }

    public List<Integer> getCutVertices() {
        List<Integer> cuts = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            if (isCut[i]) cuts.add(i);
        }
        return cuts;
    }

    public List<int[]> getBridges() {
        return bridges;
    }
}
```

### Python 實作範本

```python
import sys

# 遞迴深度優化
sys.setrecursionlimit(300000)

class TarjanUndirected:
    def __init__(self, n):
        self.n = n
        self.timer = 0
        self.adj = [[] for _ in range(n)]
        self.dfn = [0] * n
        self.low = [0] * n
        self.is_cut = [False] * n
        self.bridges = []

    def add_edge(self, u, v):
        self.adj[u].append(v)
        self.adj[v].append(u)

    def dfs(self, u, p=-1):
        self.timer += 1
        self.dfn[u] = self.low[u] = self.timer
        children = 0

        for v in self.adj[u]:
            if v == p:
                continue
            if self.dfn[v]:
                self.low[u] = min(self.low[u], self.dfn[v])
            else:
                children += 1
                self.dfs(v, u)
                self.low[u] = min(self.low[u], self.low[v])

                # 割點判定
                if p != -1 and self.low[v] >= self.dfn[u]:
                    self.is_cut[u] = True
                # 橋判定
                if self.low[v] > self.dfn[u]:
                    self.bridges.append((min(u, v), max(u, v)))

        # 根節點單獨判定
        if p == -1 and children > 1:
            self.is_cut[u] = True

    def solve(self):
        for i in range(self.n):
            if not self.dfn[i]:
                self.dfs(i, -1)

    def get_cut_vertices(self):
        return [i for i in range(self.n) if self.is_cut[i]]

    def get_bridges(self):
        return self.bridges
```

---

## 3. 複雜度與防禦要點

*   **時間複雜度**：$\mathcal{O}(V + E)$。
    演算法只對圖進行了一次深度優先搜尋，所有節點與邊皆被常數次處理，效率極高。
*   **防禦要點**：
    *   **重邊 (Multiple Edges) 防禦**：
        若圖中存在重邊，單純傳入 `p` 節點編號會出錯（會把另一條平行邊誤認為是向父節點的回頭路而忽略，從而漏掉原本不是橋的邊）。
        *   **解決方案**：在存在重邊的圖中，DFS 傳遞的參數不應該是父節點的**編號**，而應該是進入當前節點的**邊的編號**。同一條邊不能反向走，但如果編號不同，代表是重邊，可以走。
    *   **獨立森林 (Forest)**：
        注意題目給定的圖不一定連通。必須在外層使用循環遍歷所有節點，確保每個未被訪問的連通分量都能執行一次 DFS 樹建構。
