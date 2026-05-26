# 換根 DP (Rerooting DP / Tree DP with Two Passes)

**換根 DP** 主要解決「求以樹中**每一個頂點**為根時的最優解」問題。

---

## 1. 核心觀念與基本原理

*   **兩次 Pass 思想 (Two-pass DFS)**：
    *   **First Pass (自底向上 DFS)**：任選一個頂點（如 $0$）為根，計算出每個節點其子樹內部狀態的最優解（如子樹深度或長度）。
    *   **Second Pass (自頂向下 DFS / 換根轉移)**：從根節點出發向子節點遍歷。在向下轉移的過程中，藉由將當前根節點 u 排除子節點 v 的貢獻，快速重構出「除去 v 子樹之外的其餘樹部分」對 v 的貢獻。這樣僅需 $\mathcal{O}(1)$ 就能完成根的移動。
    總時間複雜度從暴力的 $\mathcal{O}(N^2)$ 優雅地降至 **$\mathcal{O}(N)$**。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

```cpp
#include <vector>
#include <algorithm>
using namespace std;

// 經典問題：求樹中每個節點到其他所有點的距離之和
class Rerooting {
private:
    int n;
    vector<vector<int>> adj;
    vector<int> sz;
    vector<long long> dp;
public:
    Rerooting(int n) : n(n), adj(n), sz(n, 0), dp(n, 0) {}
    void add_edge(int u, int v) { adj[u].push_back(v); adj[v].push_back(u); }
    
    void dfs1(int u, int p) {
        sz[u] = 1;
        for (int v : adj[u]) {
            if (v == p) continue;
            dfs1(v, u);
            sz[u] += sz[v];
            dp[u] += dp[v] + sz[v];
        }
    }
    
    void dfs2(int u, int p) {
        for (int v : adj[u]) {
            if (v == p) continue;
            // 換根轉移公式：
            // dp[v] = dp[u] - sz[v] + (N - sz[v])
            dp[v] = dp[u] - sz[v] + (n - sz[v]);
            dfs2(v, u);
        }
    }
    vector<long long> solve() {
        dfs1(0, -1);
        dfs2(0, -1);
        return dp;
    }
};
```

```java
import java.util.*;

class Rerooting {
    private int n;
    private List<List<Integer>> adj;
    private int[] sz;
    private long[] dp;
    
    public Rerooting(int n) {
        this.n = n;
        adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        sz = new int[n];
        dp = new long[n];
    }
    public void addEdge(int u, int v) { adj.get(u).add(v); adj.get(v).add(u); }
    
    public void dfs1(int u, int p) {
        sz[u] = 1;
        for (int v : adj.get(u)) {
            if (v == p) continue;
            dfs1(v, u);
            sz[u] += sz[v];
            dp[u] += dp[v] + sz[v];
        }
    }
    public void dfs2(int u, int p) {
        for (int v : adj.get(u)) {
            if (v == p) continue;
            dp[v] = dp[u] - sz[v] + (n - sz[v]);
            dfs2(v, u);
        }
    }
}
```

```python
import sys
sys.setrecursionlimit(200000)

class Rerooting:
    def __init__(self, n):
        self.n = n
        self.adj = [[] for _ in range(n)]
        self.sz = [0] * n
        self.dp = [0] * n
        
    def add_edge(self, u, v):
        self.adj[u].append(v)
        self.adj[v].append(u)
        
    def dfs1(self, u, p):
        self.sz[u] = 1
        for v in self.adj[u]:
            if v == p: continue
            self.dfs1(v, u)
            self.sz[u] += self.sz[v]
            self.dp[u] += self.dp[v] + self.sz[v]
            
    def dfs2(self, u, p):
        for v in self.adj[u]:
            if v == p: continue
            self.dp[v] = self.dp[u] - self.sz[v] + (self.n - self.sz[v])
            self.dfs2(v, u)
```

---

## 3. 複雜度與防禦要點
*   **時間與空間複雜度**：時間 $\mathcal{O}(N)$，空間 $\mathcal{O}(N)$。
*   **防禦要點**：
    *   在轉移時特別注意非對稱操作（如最大值的最大深度，換根時需要維護「最大值」與「次大值」，防止當最大深度的子分支就是 v 時，把 u 扣除 v 貢獻後造成錯誤）。
