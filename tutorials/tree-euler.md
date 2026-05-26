# 樹的歐拉序 (Euler Tour Technique - ETT)

**樹的歐拉序 (Euler Tour Technique - ETT)** 是一種將「樹結構扁平化（線性化）為區間結構」的強大工具。

---

## 1. 核心觀念與基本原理

*   **扁平化原理**：
    *   我們在 DFS 遍歷樹的過程中，記錄下每個節點「第一次進入」與「最後一次離開」的時間戳記（`tin[u]` 與 `tout[u]`）。
    *   **子樹區間性質**：以 $u$ 為根的子樹中所有的節點，其進入時間戳記必定落在 $[tin[u], tout[u]]$ 閉區間內。
*   **樹上查詢轉化為區間查詢**：
    透過歐拉序，我們可以把「子樹修改與子樹求和」這類複雜的樹上操作，**完美轉化為區間修改與區間求和**，從而直接用 **線段樹** 或 **樹狀陣列** 進行 $\mathcal{O}(\log N)$ 操作。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

```cpp
#include <vector>
using namespace std;

class EulerTour {
private:
    int n, timer;
    vector<vector<int>> adj;
    vector<int> tin, tout;
public:
    EulerTour(int n) : n(n), timer(0), adj(n), tin(n), tout(n) {}
    void add_edge(int u, int v) { adj[u].push_back(v); adj[v].push_back(u); }
    
    void dfs(int u, int p) {
        tin[u] = ++timer; // 1-based 時間戳記
        for (int v : adj[u]) {
            if (v == p) continue;
            dfs(v, u);
        }
        tout[u] = timer;
    }
    // 子樹區間為 [tin[u], tout[u]]
    pair<int, int> get_subtree_range(int u) {
        return {tin[u], tout[u]};
    }
};
```

```java
import java.util.*;

class EulerTour {
    private int n, timer;
    private List<List<Integer>> adj;
    private int[] tin, tout;
    
    public EulerTour(int n) {
        this.n = n;
        this.timer = 0;
        adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        tin = new int[n];
        tout = new int[n];
    }
    public void addEdge(int u, int v) { adj.get(u).add(v); adj.get(v).add(u); }
    
    public void dfs(int u, int p) {
        tin[u] = ++timer;
        for (int v : adj.get(u)) {
            if (v == p) continue;
            dfs(v, u);
        }
        tout[u] = timer;
    }
}
```

```python
class EulerTour:
    def __init__(self, n):
        self.n = n
        self.timer = 0
        self.adj = [[] for _ in range(n)]
        self.tin = [0] * n
        self.tout = [0] * n
        
    def add_edge(self, u, v):
        self.adj[u].append(v)
        self.adj[v].append(u)
        
    def dfs(self, u, p):
        self.timer += 1
        self.tin[u] = self.timer
        for v in self.adj[u]:
            if v == p: continue
            self.dfs(v, u)
        self.tout[u] = self.timer
```

---

## 3. 複雜度與防禦要點
*   **時間與空間複雜度**：$\mathcal{O}(N)$。
*   **防禦要點**：
    *   在記錄時間戳記時，`timer` 最大值為 $N$。若我們在 DFS 時進入和離開都記錄（如有些雙時間戳記法），歐拉序列長度會擴充至 $2N$，線段樹數組空間必須隨之加倍。
