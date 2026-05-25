# 倍增演算法與最近公共祖先 (Binary Lifting & LCA)

在圖論中，倍增演算法（Binary Lifting）是一種非常高效的優化技術。它可以讓我們在 $O(N \log N)$ 的時間進行預處理，並在 $O(\log N)$ 的時間內查詢樹上節點的最近公共祖先（LCA, Lowest Common Ancestor）。

---

## 1. 什麼是倍增思想？

如果我們要找一個節點的祖先，最暴力的演算法是一個一個指標往上跳，但這樣在樹退化成一條鏈時，單次查詢的複雜度會退化成 $O(N)$。

倍增思想的核心是：**不要每次只跳一步，而是跳 $2^i$ 步。**
我們可以用一個二維動態規劃陣列（其實是個表，但常被稱為 DP 陣列）來維護狀態：
- `up[x][i]` 代表節點 `x` 往上跳 $2^i$ 步所到達的祖先節點。

根據狀態轉移方程式：
$$up[x][i] = up[up[x][i-1]][i-1]$$

這代表：要往上跳 $2^i$ 步，可以先往上跳 $2^{i-1}$ 步，再從那裡繼續往上跳 $2^{i-1}$ 步。

---

## 2. 演算法實作與最近公共祖先

利用倍增表求 LCA 的基本步驟：
1. 首先用 DFS 遍歷整棵樹，計算每個節點的深度（depth）以及它們的直系父親 `up[x][0]`。
2. 預處理整個倍增陣列。
3. 給定兩個節點 `u` 和 `v`，我們先將較深的點往上跳，直到兩者深度相同。
4. 如果此時 `u == v`，說明 LCA 就是當前的節點，直接返回。
5. 否則，我們使用雙指標邏輯，讓 `u` 和 `v` 同步往上跳（跳 $2^i$ 步，從大到小嘗試），直到它們的直系父親相同，此時它們的父親就是 LCA。

---

## 3. 三大語言範本程式碼 (C++ / Java / Python)

請在下方選取您熟悉的程式語言，閱讀並複製對照 LCA 模板：

```cpp
// C++ 倍增法 LCA 實作範本
#include <bits/stdc++.h>
using namespace std;

struct LCA {
    int n, l;
    vector<vector<int>> adj;
    int timer;
    vector<int> tin, tout;
    vector<vector<int>> up;

    LCA(int n, int root) : n(n) {
        l = ceil(log2(n));
        tin.resize(n + 1);
        tout.resize(n + 1);
        up.assign(n + 1, vector<int>(l + 1));
        adj.resize(n + 1);
        timer = 0;
    }

    void add_edge(int u, int v) {
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    void dfs(int v, int p) {
        tin[v] = ++timer;
        up[v][0] = p;
        for (int i = 1; i <= l; ++i) {
            up[v][i] = up[up[v][i - 1]][i - 1];
        }
        for (int u : adj[v]) {
            if (u != p) dfs(u, v);
        }
        tout[v] = ++timer;
    }

    bool is_ancestor(int u, int v) {
        return tin[u] <= tin[v] && tout[u] >= tout[v];
    }

    int get_lca(int u, int v) {
        if (is_ancestor(u, v)) return u;
        if (is_ancestor(v, u)) return v;
        for (int i = l; i >= 0; --i) {
            if (!is_ancestor(up[u][i], v)) {
                u = up[u][i];
            }
        }
        return up[u][0];
    }
};
```

```java
// Java 倍增法 LCA 實作範本
import java.util.*;

class LCA {
    int n, l;
    List<List<Integer>> adj;
    int timer;
    int[] tin, tout;
    int[][] up;

    public LCA(int n) {
        this.n = n;
        this.l = (int) Math.ceil(Math.log(n) / Math.log(2));
        tin = new int[n + 1];
        tout = new int[n + 1];
        up = new int[n + 1][l + 1];
        adj = new ArrayList<>();
        for (int i = 0; i <= n; i++) adj.add(new ArrayList<>());
        timer = 0;
    }

    public void addEdge(int u, int v) {
        adj.get(u).add(v);
        adj.get(v).add(u);
    }

    public void dfs(int v, int p) {
        tin[v] = ++timer;
        up[v][0] = p;
        for (int i = 1; i <= l; ++i) {
            up[v][i] = up[up[v][i - 1]][i - 1];
        }
        for (int u : adj.get(v)) {
            if (u != p) dfs(u, v);
        }
        tout[v] = ++timer;
    }

    public boolean isAncestor(int u, int v) {
        return tin[u] <= tin[v] && tout[u] >= tout[v];
    }

    public int getLCA(int u, int v) {
        if (isAncestor(u, v)) return u;
        if (isAncestor(v, u)) return v;
        for (int i = l; i >= 0; --i) {
            if (!isAncestor(up[u][i], v)) {
                u = up[u][i];
            }
        }
        return up[u][0];
    }
}
```

```python
# Python 倍增法 LCA 實作範本
import math

class LCA:
    def __init__(self, n):
        self.n = n
        self.l = math.ceil(math.log2(n)) if n > 1 else 1
        self.tin = [0] * (n + 1)
        self.tout = [0] * (n + 1)
        self.up = [[0] * (self.l + 1) for _ in range(n + 1)]
        self.adj = [[] for _ in range(n + 1)]
        self.timer = 0

    def add_edge(self, u, v):
        self.adj[u].append(v)
        self.adj[v].append(u)

    def dfs(self, v, p):
        self.timer += 1
        self.tin[v] = self.timer
        self.up[v][0] = p
        for i in range(1, self.l + 1):
            self.up[v][i] = self.up[self.up[v][i - 1]][i - 1]
        for u in self.adj[v]:
            if u != p:
                self.dfs(u, v)
        self.timer += 1
        self.tout[v] = self.timer

    def is_ancestor(self, u, v):
        return self.tin[u] <= self.tin[v] and self.tout[u] >= self.tout[v]

    def get_lca(self, u, v):
        if self.is_ancestor(u, v):
            return u
        if self.is_ancestor(v, u):
            return v
        for i in range(self.l, -1, -1):
            if not self.is_ancestor(self.up[u][i], v):
                u = self.up[u][i]
        return self.up[u][0]
```
