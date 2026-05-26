# 最小費用最大流 (Minimum Cost Maximum Flow - MCMF)

在網路流中，不僅每條邊有容量限制，同時每單位流量流經該邊還需要支付特定的**單位費用 (Unit Cost)**。**最小費用最大流 (MCMF)** 的目標是在保證從源點 $S$ 到匯點 $T$ 的流量達到最大流的前提下，使得總費用（每條邊的流量 $\times$ 單位費用之和）最小。

---

## 1. 核心觀念與基本原理

*   **問題定義**：
    每條有向邊具有容量 $U(u,v)$ 與單位費用 $C(u,v)$。當我們在該邊推送 $f(u,v)$ 的流量時，產生的費用為 $f(u,v) \times C(u,v)$。我們需要尋找一個可行流 $f$，在滿足流量最大化的條件下，使總費用 $\sum C(u,v)f(u,v)$ 最小。
*   **消圈定理與最短路增廣**：
    *   **SPFA 增廣 (Primal-Dual 演算法)**：
        殘餘網路中會存在反向邊。如果正向邊的費用為 $c$，則相應的反向邊費用必須設為 $-c$（代表退流時可以退回費用）。
        由於存在負權邊，我們不能直接使用 Dijkstra，而是使用 **SPFA 演算法** 在殘餘網路上尋找一條從 $S$ 到 $T$ 的**單位費用最短路徑**。沿著這條最短路徑進行增廣，直到無法找到新的增廣路為止。
    *   **Dijkstra + 勢能優化 (Potentials)**：
        若圖的規模較大，SPFA 最壞複雜度會退化至 $\mathcal{O}(VE)$。此時可引入**勢能法 (Primal-Dual with Potentials)**，利用頂點勢能 $h(u)$ 將所有殘餘邊的邊權重構為非負值：$w'(u,v) = w(u,v) + h(u) - h(v) \ge 0$，從而允許使用高速的 Dijkstra 演算法進行增廣。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

以下實作示範：使用最經典且常規實用的 **SPFA 最短路增廣** 演算法來實現最小費用最大流。

### C++ 實作範本

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>

using namespace std;

const long long INF = 1e18;

struct Edge {
    int to;
    long long cap;
    long long flow;
    long long cost;
    size_t rev;
};

class MCMF {
private:
    int n;
    vector<vector<Edge>> adj;
    vector<long long> dist;
    vector<int> parent_node;
    vector<int> parent_edge;
    vector<bool> in_queue;

    // 使用 SPFA 尋找單位費用最短路
    bool spfa(int s, int t) {
        fill(dist.begin(), dist.end(), INF);
        fill(in_queue.begin(), in_queue.end(), false);
        queue<int> q;

        dist[s] = 0;
        q.push(s);
        in_queue[s] = true;

        while (!q.empty()) {
            int u = q.front();
            q.pop();
            in_queue[u] = false;

            for (size_t i = 0; i < adj[u].size(); ++i) {
                const auto& e = adj[u][i];
                if (e.cap - e.flow > 0 && dist[e.to] > dist[u] + e.cost) {
                    dist[e.to] = dist[u] + e.cost;
                    parent_node[e.to] = u;
                    parent_edge[e.to] = i;
                    if (!in_queue[e.to]) {
                        q.push(e.to);
                        in_queue[e.to] = true;
                    }
                }
            }
        }
        return dist[t] != INF;
    }

public:
    MCMF(int n) : n(n), adj(n), dist(n), parent_node(n), parent_edge(n), in_queue(n) {}

    void add_edge(int from, int to, long long cap, long long cost) {
        adj[from].push_back({to, cap, 0, cost, adj[to].size()});
        adj[to].push_back({from, 0, 0, -cost, adj[from].size() - 1}); // 反向邊費用為負
    }

    // 傳回 {最大流, 最小費用}
    pair<long long, long long> get_mcmf(int s, int t) {
        long long max_flow = 0;
        long long min_cost = 0;

        while (spfa(s, t)) {
            // 尋找此增廣路上的最小剩餘容量
            long long push = INF;
            for (int v = t; v != s; v = parent_node[v]) {
                int u = parent_node[v];
                int idx = parent_edge[v];
                push = min(push, adj[u][idx].cap - adj[u][idx].flow);
            }

            // 進行增廣與費用累計
            for (int v = t; v != s; v = parent_node[v]) {
                int u = parent_node[v];
                int idx = parent_edge[v];
                adj[u][idx].flow += push;
                adj[v][adj[u][idx].rev].flow -= push;
                min_cost += push * adj[u][idx].cost;
            }
            max_flow += push;
        }
        return {max_flow, min_cost};
    }
};
```

### Java 實作範本

```java
import java.util.*;

public class MCMF {
    private static final long INF = Long.MAX_VALUE / 2;

    public static class Edge {
        int to;
        long cap, flow, cost;
        int rev;

        public Edge(int to, long cap, long cost, int rev) {
            this.to = to;
            this.cap = cap;
            this.flow = 0;
            this.cost = cost;
            this.rev = rev;
        }
    }

    private int n;
    private List<List<Edge>> adj;
    private long[] dist;
    private int[] parentNode;
    private int[] parentEdge;
    private boolean[] inQueue;

    public MCMF(int n) {
        this.n = n;
        this.adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        this.dist = new long[n];
        this.parentNode = new int[n];
        this.parentEdge = new int[n];
        this.inQueue = new boolean[n];
    }

    public void addEdge(int from, int to, long cap, long cost) {
        adj.get(from).add(new Edge(to, cap, cost, adj.get(to).size()));
        adj.get(to).add(new Edge(from, 0, -cost, adj.get(from).size() - 1));
    }

    private boolean spfa(int s, int t) {
        Arrays.fill(dist, INF);
        Arrays.fill(inQueue, false);
        Queue<Integer> q = new LinkedList<>();

        dist[s] = 0;
        q.offer(s);
        inQueue[s] = true;

        while (!q.isEmpty()) {
            int u = q.poll();
            inQueue[u] = false;

            for (int i = 0; i < adj.get(u).size(); i++) {
                Edge e = adj.get(u).get(i);
                if (e.cap - e.flow > 0 && dist[e.to] > dist[u] + e.cost) {
                    dist[e.to] = dist[u] + e.cost;
                    parentNode[e.to] = u;
                    parentEdge[e.to] = i;
                    if (!inQueue[e.to]) {
                        q.offer(e.to);
                        inQueue[e.to] = true;
                    }
                }
            }
        }
        return dist[t] != INF;
    }

    public long[] getMCMF(int s, int t) {
        long maxFlow = 0;
        long minCost = 0;

        while (spfa(s, t)) {
            long push = INF;
            for (int v = t; v != s; v = parentNode[v]) {
                int u = parentNode[v];
                int idx = parentEdge[v];
                push = Math.min(push, adj.get(u).get(idx).cap - adj.get(u).get(idx).flow);
            }

            for (int v = t; v != s; v = parentNode[v]) {
                int u = parentNode[v];
                int idx = parentEdge[v];
                Edge e = adj.get(u).get(idx);
                e.flow += push;
                adj.get(v).get(e.rev).flow -= push;
                minCost += push * e.cost;
            }
            maxFlow += push;
        }
        return new long[]{maxFlow, minCost};
    }
}
```

### Python 實作範本

```python
from collections import deque

class MCMF:
    def __init__(self, n):
        self.n = n
        self.adj = [[] for _ in range(n)]
        self.dist = [float('inf')] * n
        self.parent_node = [-1] * n
        self.parent_edge = [-1] * n
        self.in_queue = [False] * n

    def add_edge(self, u, v, cap, cost):
        # [to, cap, flow, cost, rev]
        self.adj[u].append([v, cap, 0, cost, len(self.adj[v])])
        self.adj[v].append([u, 0, 0, -cost, len(self.adj[u]) - 1])

    def spfa(self, s, t):
        self.dist = [float('inf')] * self.n
        self.in_queue = [False] * self.n
        
        self.dist[s] = 0
        q = deque([s])
        self.in_queue[s] = True

        while q:
            u = q.popleft()
            self.in_queue[u] = False

            for i, (v, cap, flow, cost, rev) in enumerate(self.adj[u]):
                if cap - flow > 0 and self.dist[v] > self.dist[u] + cost:
                    self.dist[v] = self.dist[u] + cost
                    self.parent_node[v] = u
                    self.parent_edge[v] = i
                    if not self.in_queue[v]:
                        q.append(v)
                        self.in_queue[v] = True
                        
        return self.dist[t] != float('inf')

    def get_mcmf(self, s, t):
        max_flow = 0
        min_cost = 0

        while self.spfa(s, t):
            # 尋找瓶頸流量
            push = float('inf')
            v = t
            while v != s:
                u = self.parent_node[v]
                idx = self.parent_edge[v]
                _, cap, flow, _, _ = self.adj[u][idx]
                push = min(push, cap - flow)
                v = u

            # 更新殘餘邊流量與費用
            v = t
            while v != s:
                u = self.parent_node[v]
                idx = self.parent_edge[v]
                edge = self.adj[u][idx]
                edge[2] += push  # 增加正向流
                rev = edge[4]
                self.adj[v][rev][2] -= push  # 扣減反向流
                min_cost += push * edge[3]
                v = u

            max_flow += push

        return max_flow, min_cost
```

---

## 3. 複雜度與防禦要點

*   **時間複雜度**：
    *   在 SPFA 增廣下，時間複雜度為 $\mathcal{O}(F \cdot VE)$，其中 $F$ 為最大流流量。在一般競賽題目中，由於流量 $F$ 限制與圖的稀疏性，運作速度通常非常快。
    *   在 Dijkstra 勢能優化下，時間複雜度可達到優異的 $\mathcal{O}(F \cdot E \log V)$。
*   **防禦要點**：
    *   **負環處理**：SPFA 可以處理負權邊，但如果原圖本身包含**負費用環路 (Negative Cost Cycles)**，SPFA 就會陷入死循環。在建圖前應確保圖中沒有不經過源點便能無限推流的負權環（通常題目會保證）。
    *   **無效費用方向**：建反向邊時，反向邊的單位費用必須設定為負值 `-cost`，以確保「退流」操作能扣減對應的總花費，否則费用計算會徹底崩潰。
