# 重心剖分 (Centroid Decomposition)

**重心剖分（Centroid Decomposition）** 是一種解決「樹上路徑統計與路徑查詢」的樹上分治技術。

---

## 1. 核心觀念與基本原理

*   **樹的重心 (Centroid)**：
    *   在樹中移除該節點後，所分裂出來的每一棵子樹其節點數**都不超過原樹大小的一半 $N/2$**。
    *   性質：任何樹都必然存在至少一個重心。
*   **分治樹與對數高度**：
    *   每次找到重心後，以該重心作為當前分治層級的根。隨後遞迴對分裂出來的各子樹重複此過程。
    *   重構出的「分治樹」其樹高**絕對不超過 $\mathcal{O}(\log N)$**。
    我們只用考慮所有經過當前重心的樹上路徑，隨後將子問題交給子重心。這能將許多複雜的樹上路徑統計時間優化至 **$\mathcal{O}(N \log N)$**。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

```cpp
#include <vector>
#include <algorithm>
using namespace std;

class CentroidDecomp {
private:
    int n;
    vector<vector<int>> adj;
    vector<bool> removed;
    vector<int> sz;
    
    int get_sz(int u, int p) {
        sz[u] = 1;
        for (int v : adj[u]) {
            if (v != p && !removed[v]) sz[u] += get_sz(v, u);
        }
        return sz[u];
    }
    
    int get_centroid(int u, int p, int total_sz) {
        for (int v : adj[u]) {
            if (v != p && !removed[v] && sz[v] > total_sz / 2) {
                return get_centroid(v, u, total_sz);
            }
        }
        return u;
    }
    
    void decompose(int u, int p) {
        int total_sz = get_sz(u, -1);
        int centroid = get_centroid(u, -1, total_sz);
        removed[centroid] = true;
        
        // 此處可以收集/統計經過當前重心 centroid 的所有路徑
        
        for (int v : adj[centroid]) {
            if (!removed[v]) decompose(v, centroid);
        }
    }
public:
    CentroidDecomp(int n) : n(n), adj(n), removed(n, false), sz(n, 0) {}
    void add_edge(int u, int v) { adj[u].push_back(v); adj[v].push_back(u); }
    void solve() { decompose(0, -1); }
};
```

```java
import java.util.*;

class CentroidDecomp {
    private int n;
    private List<List<Integer>> adj;
    private boolean[] removed;
    private int[] sz;
    
    public CentroidDecomp(int n) {
        this.n = n;
        adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        removed = new boolean[n];
        sz = new int[n];
    }
    public void addEdge(int u, int v) { adj.get(u).add(v); adj.get(v).add(u); }
    
    public void solve() { decompose(0, -1); }
    
    private int getSz(int u, int p) {
        sz[u] = 1;
        for (int v : adj.get(u)) {
            if (v != p && !removed[v]) sz[u] += getSz(v, u);
        }
        return sz[u];
    }
    private int getCentroid(int u, int p, int totalSz) {
        for (int v : adj.get(u)) {
            if (v != p && !removed[v] && sz[v] > totalSz / 2) {
                return getCentroid(v, u, totalSz);
            }
        }
        return u;
    }
    private void decompose(int u, int p) {
        int totalSz = getSz(u, -1);
        int centroid = getCentroid(u, -1, totalSz);
        removed[centroid] = true;
        for (int v : adj.get(centroid)) {
            if (!removed[v]) decompose(v, centroid);
        }
    }
}
```

```python
import sys
sys.setrecursionlimit(200000)

class CentroidDecomp:
    def __init__(self, n):
        self.n = n
        self.adj = [[] for _ in range(n)]
        self.removed = [False] * n
        self.sz = [0] * n
        
    def add_edge(self, u, v):
        self.adj[u].append(v)
        self.adj[v].append(u)
        
    def solve(self):
        self._decompose(0, -1)
        
    def _get_sz(self, u, p):
        self.sz[u] = 1
        for v in self.adj[u]:
            if v != p and not self.removed[v]:
                self.sz[u] += self._get_sz(v, u)
        return self.sz[u]
        
    def _get_centroid(self, u, p, total_sz):
        for v in self.adj[u]:
            if v != p and not self.removed[v] and self.sz[v] > total_sz // 2:
                return self._get_centroid(v, u, total_sz)
        return u
        
    def _decompose(self, u, p):
        total_sz = self._get_sz(u, -1)
        centroid = self._get_centroid(u, -1, total_sz)
        self.removed[centroid] = True
        for v in self.adj[centroid]:
            if not self.removed[v]:
                self._decompose(v, centroid)
```

---

## 3. 複雜度與防禦要點
*   **時間與空間複雜度**：時間 $\mathcal{O}(N \log N)$，空間 $\mathcal{O}(N)$。
*   **防禦要點**：
    *   在計算子樹大小 `get_sz` 和尋找重心 `get_centroid` 時，**必須排除已經在分治上一層被標記刪除的節點 `removed[v]`**，否則會重入父重心，導致無限死循環。
