# 樹鏈剖分 (Heavy-Light Decomposition - HLD)

**樹鏈剖分（Heavy-Light Decomposition, HLD）** 是一種將樹結構劃分成若干條線性「重鏈」與「輕邊」的強大樹上分治技術。

---

## 1. 核心觀念與基本原理

*   **重子節點 (Heavy Child) 與輕子節點 (Light Child)**：
    *   對於每個節點，其子節點中擁有最大子樹規模（節點數最多）的子節點稱為**重子節點**，其餘子節點為**輕子節點**。
    *   連向重子節點的邊稱為**重邊**，其餘為**輕邊**。由重邊連結而成的極長路徑稱為**重鏈**。
*   **樹上路徑轉化為線性區間**：
    我們在 DFS 走訪時，優先造訪重子節點。這樣能確保每條重鏈上的節點在歐拉序（DFS 序）中是**完全連續的**。
    *   **對數鏈跳轉**：從任何節點 $u$ 到根節點，最多只會經過 $\mathcal{O}(\log N)$ 條重鏈與輕邊。配合**線段樹**，我們能以 **$\mathcal{O}(\log^2 N)$** 的極佳時間，完成樹上路徑的區間修改與求和。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

```cpp
#include <vector>
#include <algorithm>
using namespace std;

class HLD {
private:
    int n, timer;
    vector<vector<int>> adj;
    vector<int> parent, depth, heavy, head, pos;
    
    int dfs_sz(int u, int p) {
        int sz = 1, max_c_sz = 0;
        for (int v : adj[u]) {
            if (v == p) continue;
            parent[v] = u;
            depth[v] = depth[u] + 1;
            int c_sz = dfs_sz(v, u);
            sz += c_sz;
            if (c_sz > max_c_sz) {
                max_c_sz = c_sz;
                heavy[u] = v; // 標記重子節點
            }
        }
        return sz;
    }
    
    void dfs_hld(int u, int h) {
        head[u] = h;
        pos[u] = timer++; // 分配 DFS 序，重鏈內部連續
        if (heavy[u] != -1) dfs_hld(heavy[u], h);
        for (int v : adj[u]) {
            if (v != parent[u] && v != heavy[u]) {
                dfs_hld(v, v); // 輕子節點作為新重鏈頭
            }
        }
    }
public:
    HLD(int n) : n(n), timer(0), adj(n), parent(n, -1), depth(n, 0), heavy(n, -1), head(n), pos(n) {}
    void add_edge(int u, int v) { adj[u].push_back(v); adj[v].push_back(u); }
    void init() {
        dfs_sz(0, -1);
        dfs_hld(0, 0);
    }
    int get_pos(int u) { return pos[u]; }
    int lca(int u, int v) {
        while (head[u] != head[v]) {
            if (depth[head[u]] > depth[head[v]]) u = parent[head[u]];
            else v = parent[head[v]];
        }
        return depth[u] < depth[v] ? u : v;
    }
};
```

```java
import java.util.*;

class HLD {
    private int n, timer;
    private List<List<Integer>> adj;
    private int[] parent, depth, heavy, head, pos;
    
    public HLD(int n) {
        this.n = n; this.timer = 0;
        adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        parent = new int[n]; depth = new int[n];
        heavy = new int[n]; Arrays.fill(heavy, -1);
        head = new int[n]; pos = new int[n];
    }
    public void addEdge(int u, int v) { adj.get(u).add(v); adj.get(v).add(u); }
    
    public void init() { dfsSz(0, -1); dfsHld(0, 0); }
    
    private int dfsSz(int u, int p) {
        int sz = 1, maxCSz = 0;
        for (int v : adj.get(u)) {
            if (v == p) continue;
            parent[v] = u; depth[v] = depth[u] + 1;
            int cSz = dfsSz(v, u);
            sz += cSz;
            if (cSz > maxCSz) { maxCSz = cSz; heavy[u] = v; }
        }
        return sz;
    }
    private void dfsHld(int u, int h) {
        head[u] = h; pos[u] = timer++;
        if (heavy[u] != -1) dfsHld(heavy[u], h);
        for (int v : adj.get(u)) {
            if (v != parent[u] && v != heavy[u]) dfsHld(v, v);
        }
    }
}
```

```python
import sys
sys.setrecursionlimit(200000)

class HLD:
    def __init__(self, n):
        self.n = n
        self.timer = 0
        self.adj = [[] for _ in range(n)]
        self.parent = [-1] * n
        self.depth = [0] * n
        self.heavy = [-1] * n
        self.head = [0] * n
        self.pos = [0] * n
        
    def add_edge(self, u, v):
        self.adj[u].append(v)
        self.adj[v].append(u)
        
    def init(self):
        self._dfs_sz(0, -1)
        self._dfs_hld(0, 0)
        
    def _dfs_sz(self, u, p):
        sz = 1
        max_c_sz = 0
        for v in self.adj[u]:
            if v == p: continue
            self.parent[v] = u
            self.depth[v] = self.depth[u] + 1
            c_sz = self._dfs_sz(v, u)
            sz += c_sz
            if c_sz > max_c_sz:
                max_c_sz = c_sz
                self.heavy[u] = v
        return sz
        
    def _dfs_hld(self, u, h):
        self.head[u] = h
        self.pos[u] = self.timer
        self.timer += 1
        if self.heavy[u] != -1:
            self._dfs_hld(self.heavy[u], h)
        for v in self.adj[u]:
            if v != self.parent[u] and v != self.heavy[u]:
                self._dfs_hld(v, v)
```

---

## 3. 複雜度與防禦要點
*   **時間複雜度**：剖分 $\mathcal{O}(N)$，路徑跳轉 $\mathcal{O}(\log N)$，配合線段樹為 $\mathcal{O}(\log^2 N)$。
*   **防禦要點**：
    *   在 HLD 跳轉時，比較深度必須是**鏈頭 `head` 的深度**，即 `depth[head[u]]`，而非點本尊 `depth[u]`，否則會產生錯誤的跳轉邏輯。
