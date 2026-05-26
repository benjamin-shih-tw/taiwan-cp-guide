# 最大流 (Maximum Flow - Dinic's Algorithm)

**最大流 (Maximum Flow)** 是網路流中最經典的核心基礎模型。在容量網路上，我們希望從源點 $S$ 向匯點 $T$ 推送盡可能多的流量，在滿足每條有向邊的容量限制以及除源點和匯點外所有點的流量平衡前提下，求解最大總流出量。

---

## 1. 核心觀念與基本原理

*   **流量平衡與容量限制**：
    在容量網路上，流經每條有向邊的流量不能超過其容量上限，且除源點與匯點外，每個節點的流出流量必須等於流入流量。
*   **Dinic 演算法 — $\mathcal{O}(V^2 E)$**：
    目前競程中最實用且常數極小的最大流演算法。
    1.  **BFS 構建分層圖**：計算起點到每個節點的層級（距離步數）。若無法到達匯點，說明已無增廣路徑，算法結束。
    2.  **DFS 多路增廣**：在分層圖上沿著深度遞增方向遞迴搜尋增廣路，並利用 **當前弧優化 (Current Arc Optimization)** 防止重覆掃描無用邊，完成多路流量推送。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

### C++ 實作範本

```cpp
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

const long long INF = 1e18;

struct Edge {
    int to;
    long long cap, flow;
    size_t rev;
};

class Dinic {
private:
    int n;
    vector<vector<Edge>> adj;
    vector<int> level, ptr;
    
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
public:
    Dinic(int n) : n(n), adj(n), level(n), ptr(n) {}
    void add_edge(int from, int to, long long cap) {
        adj[from].push_back({to, cap, 0, adj[to].size()});
        adj[to].push_back({from, 0, 0, adj[from].size() - 1}); // 殘餘反向邊
    }
    long long max_flow(int s, int t) {
        long long flow = 0;
        while (bfs(s, t)) {
            fill(ptr.begin(), ptr.end(), 0);
            while (long long pushed = dfs(s, t, INF)) {
                flow += pushed;
            }
        }
        return flow;
    }
};
```

### Java 實作範本

```java
import java.util.*;

public class Dinic {
    private static final long INF = Long.MAX_VALUE / 2;

    public static class Edge {
        int to;
        long cap, flow;
        int rev;

        public Edge(int to, long cap, int rev) {
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

    public Dinic(int n) {
        this.n = n;
        this.adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        this.level = new int[n];
        this.ptr = new int[n];
    }

    public void addEdge(int from, int to, long cap) {
        adj.get(from).add(new Edge(to, cap, adj.get(to).size()));
        adj.get(to).add(new Edge(from, 0, adj.get(from).size() - 1));
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

    public long maxFlow(int s, int t) {
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
}
```

### Python 實作範本

```python
from collections import deque

class Dinic:
    def __init__(self, n):
        self.n = n
        self.adj = [[] for _ in range(n)]
        self.level = [-1] * n
        self.ptr = [0] * n
        
    def add_edge(self, u, v, cap):
        # [to, cap, flow, rev]
        self.adj[u].append([v, cap, 0, len(self.adj[v])])
        self.adj[v].append([u, 0, 0, len(self.adj[u]) - 1])

    def bfs(self, s, t):
        self.level = [-1] * self.n
        self.level[s] = 0
        q = deque([s])
        while q:
            u = q.popleft()
            for v, cap, flow, rev in self.adj[u]:
                if cap - flow > 0 and self.level[v] == -1:
                    self.level[v] = self.level[u] + 1
                    q.append(v)
        return self.level[t] != -1

    def dfs(self, u, t, pushed):
        if pushed == 0 or u == t:
            return pushed
        while self.ptr[u] < len(self.adj[u]):
            e = self.adj[u][self.ptr[u]]
            v, cap, flow, rev = e
            if self.level[u] + 1 == self.level[v] and cap - flow > 0:
                tr = self.dfs(v, t, min(pushed, cap - flow))
                if tr > 0:
                    e[2] += tr
                    self.adj[v][rev][2] -= tr
                    return tr
            self.ptr[u] += 1
        return 0

    def max_flow(self, s, t):
        flow = 0
        while self.bfs(s, t):
            self.ptr = [0] * self.n
            while True:
                pushed = self.dfs(s, t, float('inf'))
                if pushed == 0:
                    break
                flow += pushed
        return flow
```

---

## 3. 複雜度與防禦要點
*   **時間複雜度**：最壞為 $\mathcal{O}(V^2 E)$，但在二分圖匹配等特定網絡中，實際複雜度僅為優秀的 $\mathcal{O}(E \sqrt{V})$，常數極小。
*   **防禦要點**：
    *   **當前弧優化**：在 DFS 內部，`ptr[u]` 必須傳遞引用或動態累計，防止重覆掃描無用邊，否則時間複雜度會退化。
    *   **雙向邊的殘餘容量初始化**：向反向邊 `add_edge` 時反向容量必須為 0，且反向邊的 flow 加減要與正向邊相反（扣減）。
