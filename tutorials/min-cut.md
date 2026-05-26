# 最小割與最大流最小割定理 (Min-Cut)

**最小割 (Minimum Cut)** 是圖論與網路流中的核心概念。根據 **最大流最小割定理 (Max-Flow Min-Cut Theorem)**，在一個容量網路中，從源點 $S$ 到匯點 $T$ 的最大流量，完全等於將圖分割為 $S$ 與 $T$ 兩個不相交子集時，切斷所有從 $S$ 指向 $T$ 的有向邊所需的最少邊容量總和。

---

## 1. 核心觀念與基本原理

*   **定義**：
    *   **割 (Cut)**：將網路的頂點集 $V$ 分割為兩個互斥子集 $S$ 與 $T$（其中 $S$ 包含源點 $s$，$T$ 包含匯點 $t$），割的**容量 (Capacity)** 定義為所有從 $S$ 指向 $T$ 的有向邊的容量總和。
    *   **最小割**：在所有可能的割中，容量最小的那個割。
*   **最大流最小割定理**：
    *   對於任意網路，$S-T$ 最大流的流量大小等於 $S-T$ 最小割的容量值。
*   **如何尋找最小割的邊集**：
    1. 執行 Dinic 演算法求出最大流。
    2. 在最終的**殘餘網路 (Residual Network)** 上，從源點 $S$ 開始進行一次 BFS 或 DFS。
    3. 所有能夠從 $S$ 透過**剩餘容量大於 0 的邊**到達的節點組成集合 $A$，其餘節點組成集合 $B$。
    4. 所有滿足「起點在 $A$ 中、終點在 $B$ 中」且「在原圖中存在此有向邊」的邊，即為最小割的割邊。
*   **經典應用**：
    *   **二分圖最小點覆蓋與最大獨立集**：點覆蓋數 + 獨立集數 = 頂點總數。最小點覆蓋 = 最大匹配數（Kőnig 定理）。
    *   **最大權閉合子圖 (Maximum Weight Closure Graph)**：利用最小割求解在有依賴關係下的選擇決策問題。將正權點連向源點 $S$，負權點連向匯點 $T$，依賴關係連 $\infty$ 邊。最大權值 = 所有正權和 - 最小割。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

以下實作示範：使用 Dinic 演算法求最大流後，透過殘餘網路進行 DFS 標記，輸出屬於最小割的所有割邊。

### C++ 實作範本

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>

using namespace std;

const long long INF = 1e18;

struct Edge {
    int from;
    int to;
    long long cap;
    long long flow;
    size_t rev;
};

class DinicMinCut {
private:
    int n;
    vector<vector<Edge>> adj;
    vector<int> level;
    vector<int> ptr;
    vector<bool> visited;

    bool bfs(int s, int t) {
        fill(level.begin(), level.end(), -1);
        level[s] = 0;
        queue<int> q;
        q.push(s);
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (const auto& e : adj[u]) {
                if (e.cap - e.flow > 0 && level[e.to] == -1) {
                    level[e.to] = level[u] + 1;
                    q.push(e.to);
                }
            }
        }
        return level[t] != -1;
    }

    long long dfs(int u, int t, long long pushed) {
        if (pushed == 0 || u == t) return pushed;
        for (int& cid = ptr[u]; cid < adj[u].size(); ++cid) {
            auto& e = adj[u][cid];
            int v = e.to;
            if (level[u] + 1 != level[v] || e.cap - e.flow == 0) continue;
            long long tr = dfs(v, t, min(pushed, e.cap - e.flow));
            if (tr == 0) continue;
            e.flow += tr;
            adj[v][e.rev].flow -= tr;
            return tr;
        }
        return 0;
    }

    // 在殘餘網路上 DFS 找出源點可達點集 A
    void dfs_residual(int u) {
        visited[u] = true;
        for (const auto& e : adj[u]) {
            if (e.cap - e.flow > 0 && !visited[e.to]) {
                dfs_residual(e.to);
            }
        }
    }

public:
    DinicMinCut(int n) : n(n), adj(n), level(n), ptr(n), visited(n, false) {}

    void add_edge(int from, int to, long long cap) {
        adj[from].push_back({from, to, cap, 0, adj[to].size()});
        adj[to].push_back({to, from, 0, adj[from].size() - 1});
    }

    long long get_max_flow(int s, int t) {
        long long flow = 0;
        while (bfs(s, t)) {
            fill(ptr.begin(), ptr.end(), 0);
            while (long long pushed = dfs(s, t, INF)) {
                flow += pushed;
            }
        }
        return flow;
    }

    // 獲取所有割邊 (from A to B)
    vector<pair<int, int>> get_min_cut_edges(int s) {
        fill(visited.begin(), visited.end(), false);
        dfs_residual(s);
        vector<pair<int, int>> cut_edges;
        for (int u = 0; u < n; ++u) {
            if (visited[u]) {
                for (const auto& e : adj[u]) {
                    // 若邊在原圖中有正容量，且終點不可達，則此邊為割邊
                    if (e.cap > 0 && !visited[e.to]) {
                        cut_edges.push_back({u, e.to});
                    }
                }
            }
        }
        return cut_edges;
    }
};
```

### Java 實作範本

```java
import java.util.*;

public class DinicMinCut {
    private static final long INF = Long.MAX_VALUE / 2;

    public static class Edge {
        int from, to;
        long cap, flow;
        int rev;

        public Edge(int from, int to, long cap, int rev) {
            this.from = from;
            this.to = to;
            this.cap = cap;
            this.flow = 0;
            this.rev = rev;
        }
    }

    private int n;
    private List<List<Edge>> adj;
    private int[] level;
    private int[] ptr;
    private boolean[] visited;

    public DinicMinCut(int n) {
        this.n = n;
        this.adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        this.level = new int[n];
        this.ptr = new int[n];
        this.visited = new boolean[n];
    }

    public void addEdge(int from, int to, long cap) {
        Edge a = new Edge(from, to, cap, adj.get(to).size());
        Edge b = new Edge(to, from, 0, adj.get(from).size());
        adj.get(from).add(a);
        adj.get(to).add(b);
    }

    private boolean bfs(int s, int t) {
        Arrays.fill(level, -1);
        level[s] = 0;
        Queue<Integer> q = new LinkedList<>();
        q.offer(s);
        while (!q.isEmpty()) {
            int u = q.poll();
            for (Edge e : adj.get(u)) {
                if (e.cap - e.flow > 0 && level[e.to] == -1) {
                    level[e.to] = level[u] + 1;
                    q.offer(e.to);
                }
            }
        }
        return level[t] != -1;
    }

    private long dfs(int u, int t, long pushed) {
        if (pushed == 0 || u == t) return pushed;
        for (int cid = ptr[u]; ptr[u] < adj.get(u).size(); ptr[u]++) {
            Edge e = adj.get(u).get(ptr[u]);
            int v = e.to;
            if (level[u] + 1 != level[v] || e.cap - e.flow == 0) continue;
            long tr = dfs(v, t, Math.min(pushed, e.cap - e.flow));
            if (tr == 0) continue;
            e.flow += tr;
            adj.get(v).get(e.rev).flow -= tr;
            return tr;
        }
        return 0;
    }

    private void dfsResidual(int u) {
        visited[u] = true;
        for (Edge e : adj.get(u)) {
            if (e.cap - e.flow > 0 && !visited[e.to]) {
                dfsResidual(e.to);
            }
        }
    }

    public long getMaxFlow(int s, int t) {
        long flow = 0;
        while (bfs(s, t)) {
            Arrays.fill(ptr, 0);
            while (true) {
                long pushed = dfs(s, t, INF);
                if (pushed == 0) break;
                flow += pushed;
            }
        }
        return flow;
    }

    public List<int[]> getMinCutEdges(int s) {
        Arrays.fill(visited, false);
        dfsResidual(s);
        List<int[]> cutEdges = new ArrayList<>();
        for (int u = 0; u < n; u++) {
            if (visited[u]) {
                for (Edge e : adj.get(u)) {
                    if (e.cap > 0 && !visited[e.to]) {
                        cutEdges.add(new int[]{u, e.to});
                    }
                }
            }
        }
        return cutEdges;
    }
}
```

### Python 實作範本

```python
from collections import deque

class DinicMinCut:
    def __init__(self, n):
        self.n = n
        self.adj = [[] for _ in range(n)]
        self.level = [-1] * n
        self.ptr = [0] * n
        self.visited = [False] * n

    def add_edge(self, u, v, cap):
        # [to, cap, flow, rev, from]
        self.adj[u].append([v, cap, 0, len(self.adj[v]), u])
        self.adj[v].append([u, 0, 0, len(self.adj[u]) - 1, v])

    def bfs(self, s, t):
        self.level = [-1] * self.n
        self.level[s] = 0
        q = deque([s])
        while q:
            u = q.popleft()
            for v, cap, flow, rev, _ in self.adj[u]:
                if cap - flow > 0 and self.level[v] == -1:
                    self.level[v] = self.level[u] + 1
                    q.append(v)
        return self.level[t] != -1

    def dfs(self, u, t, pushed):
        if pushed == 0 or u == t:
            return pushed
        while self.ptr[u] < len(self.adj[u]):
            e = self.adj[u][self.ptr[u]]
            v, cap, flow, rev, _ = e
            if self.level[u] + 1 == self.level[v] and cap - flow > 0:
                tr = self.dfs(v, t, min(pushed, cap - flow))
                if tr > 0:
                    e[2] += tr  # flow增加
                    self.adj[v][rev][2] -= tr  # 反向邊flow減少
                    return tr
            self.ptr[u] += 1
        return 0

    def dfs_residual(self, s):
        self.visited[s] = True
        for v, cap, flow, rev, _ in self.adj[s]:
            if cap - flow > 0 and not self.visited[v]:
                self.dfs_residual(v)

    def get_max_flow(self, s, t):
        flow = 0
        while self.bfs(s, t):
            self.ptr = [0] * self.n
            while True:
                pushed = self.dfs(s, t, float('inf'))
                if pushed == 0:
                    break
                flow += pushed
        return flow

    def get_min_cut_edges(self, s):
        self.visited = [False] * self.n
        self.dfs_residual(s)
        cut_edges = []
        for u in range(self.n):
            if self.visited[u]:
                for v, cap, flow, rev, _ in self.adj[u]:
                    # cap > 0 保證此為原圖的正向邊而非反向殘餘邊
                    if cap > 0 and not self.visited[v]:
                        cut_edges.append((u, v))
        return cut_edges
```

---

## 3. 複雜度與防禦要點

*   **時間複雜度**：
    *   最大流求解：一般情況下為 $\mathcal{O}(V^2 E)$，常用在實際圖中常數極小，速度極快。
    *   殘餘網路 DFS 遍歷：線性時間 $\mathcal{O}(V + E)$。
    *   因此，最小割求解的總時間複雜度即等同於最大流時間複雜度 $\mathcal{O}(V^2 E)$。
*   **防禦要點**：
    *   **無效反向邊判斷**：在搜尋割邊時，必須限制 `e.cap > 0`。否則，若是反向殘餘邊滿足 `from A to B`，它並不屬於原圖的割，會導致輸出錯誤的邊。
    *   **連通度無穷邊設定**：在最大權閉合子圖或特殊幾何割點問題中，若某條限制不能被切斷，需將其容量設為 $\infty$（程式中常設為 `1e18` 或 `Long.MAX_VALUE / 2` 避免溢位）。
