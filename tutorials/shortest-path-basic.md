# 單源最短路徑 (Dijkstra's Algorithm)

在圖論演算法中，**單源最短路徑 (Single-Source Shortest Path, SSSP)** 是一個極高頻的核心考點。給定一個帶權有向圖或無向圖，且**所有邊的權重皆為非負數**，Dijkstra 演算法能以極高的效率，計算出從起點到圖中所有其他頂點的最短路徑。

---

## 1. 核心觀念與基本原理

### 鬆弛操作 (Edge Relaxation) — 最短路徑的底層核心
最短路徑演算法的本質是透過不斷「放寬（鬆弛）」邊的限制來逼近真實答案。
*   **數學轉移方程**：設 `dist[u]` 表示從起點到頂點 $u$ 當前估計的最短距離。若存在一條從 $u$ 到 $v$ 且權重為 $w$ 的邊，我們嘗試進行以下鬆弛操作：
    $$\text{dist}[v] = \min(\text{dist}[v], \text{dist}[u] + w)$$
    如果透過頂點 $u$ 繞行到 $v$ 的路徑比當前記錄的 `dist[v]` 還要短，我們就更新 `dist[v]` 的數值。

### Dijkstra 演算法的貪婪邏輯
Dijkstra 採用了**貪婪策略 (Greedy Strategy)** 與**動態規劃 (DP)** 的融合思維，其基本流程如下：
1.  **初始化**：起點距離設為 `dist[src] = 0`，其餘所有頂點距離設為無窮大 `dist[i] = INF`。
2.  **選擇極值**：在所有**尚未確定最短路徑**的頂點中，挑選出一個目前 `dist` 值最小的頂點 $u$。
3.  **確定狀態**：將頂點 $u$ 標記為「已確定最短路徑」（此時 `dist[u]` 即為真實的最短路徑，此後不再被修改）。
4.  **鄰居鬆弛**：遍歷頂點 $u$ 的所有出邊 $(u, v, w)$，對相鄰頂點 $v$ 進行鬆弛操作。
5.  **重複執行**：重複步驟 2~4，直到所有頂點都已確定，或優先佇列已空。

### 優先佇列優化 (Heap-Optimized Dijkstra)
若使用樸素方法（暴力走訪）尋找最小距離頂點，每次需要 $\mathcal{O}(V)$ 時間，總複雜度為 $\mathcal{O}(V^2 + E)$。
藉由**優先佇列（二元堆疊 Min-Heap）**，我們能在 $\mathcal{O}(\log V)$ 時間內獲取最小距離頂點。鬆弛成功後直接推入堆中。優化後的總時間複雜度降至 **$\mathcal{O}((V + E) \log V)$**，這在稀疏圖（$E \ll V^2$）中具備壓倒性的效能優勢。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

以下提供在一張給定的帶權有向圖上，執行**優先佇列優化 Dijkstra 演算法**的完整實作模板。範本支援**路徑重建 (Path Reconstruction)**，可完整輸出從起點到終點的具體節點序列：

```cpp
// C++ 優先佇列優化 Dijkstra 實作範本 (支援路徑重建)
#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>

using namespace std;

const long long INF = 1e18; // 使用 64 位元無窮大防溢位

struct Edge {
    int to;
    long long weight;
};

struct Element {
    long long dist;
    int u;
    // 優先佇列的比較子：距離越小優先級越高 (Min-Heap)
    bool operator>(const Element& other) const {
        return dist > other.dist;
    }
};

class Dijkstra {
private:
    int n;
    vector<vector<Edge>> adj;

public:
    Dijkstra(int n) : n(n), adj(n) {}

    void add_edge(int u, int v, long long w) {
        adj[u].push_back({v, w});
    }

    // 執行 Dijkstra 算法，回傳起點到終點的最短路徑序列；若無法到達則回傳空陣列
    vector<int> get_shortest_path(int src, int dest, vector<long long>& dist) {
        dist.assign(n, INF);
        vector<int> parent(n, -1);
        priority_queue<Element, vector<Element>, greater<Element>> pq;

        dist[src] = 0;
        pq.push({0, src});

        while (!pq.empty()) {
            long long d = pq.top().dist;
            int u = pq.top().u;
            pq.pop();

            // 惰性刪除判定：若彈出的距離大於當前記錄的距離，說明是過期數據，直接跳過
            if (d > dist[u]) continue;
            if (u == dest) break; // 提前找到終點，結束優化

            for (const auto& edge : adj[u]) {
                int v = edge.to;
                long long w = edge.weight;

                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    parent[v] = u;
                    pq.push({dist[v], v});
                }
            }
        }

        if (dist[dest] == INF) return {}; // 無法到達

        // 重建路徑
        vector<int> path;
        for (int curr = dest; curr != -1; curr = parent[curr]) {
            path.push_back(curr);
        }
        reverse(path.begin(), path.end());
        return path;
    }
};
```

```java
// Java 優先佇列優化 Dijkstra 實作範本 (支援路徑重建)
import java.io.*;
import java.util.*;

class Dijkstra {
    public static final long INF = Long.MAX_VALUE / 2; // 防止加法溢位

    static class Edge {
        int to;
        long weight;
        Edge(int to, long weight) {
            this.to = to;
            this.weight = weight;
        }
    }

    static class Element implements Comparable<Element> {
        long dist;
        int u;
        Element(long dist, int u) {
            this.dist = dist;
            this.u = u;
        }
        @Override
        public int compareTo(Element other) {
            return Long.compare(this.dist, other.dist); // 升序 (Min-Heap)
        }
    }

    private int n;
    private List<List<Edge>> adj;

    public Dijkstra(int n) {
        this.n = n;
        this.adj = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            adj.add(new ArrayList<>());
        }
    }

    public void addEdge(int u, int v, long w) {
        adj.get(u).add(new Edge(v, w));
    }

    public List<Integer> getShortestPath(int src, int dest, long[] dist) {
        Arrays.fill(dist, INF);
        int[] parent = new int[n];
        Arrays.fill(parent, -1);

        PriorityQueue<Element> pq = new PriorityQueue<>();

        dist[src] = 0;
        pq.offer(new Element(0, src));

        while (!pq.isEmpty()) {
            Element curr = pq.poll();
            long d = curr.dist;
            int u = curr.u;

            if (d > dist[u]) continue; // 惰性刪除
            if (u == dest) break;

            for (Edge edge : adj.get(u)) {
                int v = edge.to;
                long w = edge.weight;

                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    parent[v] = u;
                    pq.offer(new Element(dist[v], v));
                }
            }
        }

        if (dist[dest] == INF) return new ArrayList<>();

        List<Integer> path = new ArrayList<>();
        int curr = dest;
        while (curr != -1) {
            path.add(curr);
            curr = parent[curr];
        }
        Collections.reverse(path);
        return path;
    }
}
```

```python
# Python 優先佇列優化 Dijkstra 實作範本 (支援路徑重建)
import heapq
from typing import List, Tuple

INF = float('inf')

class Dijkstra:
    def __init__(self, n: int):
        self.n = n
        self.adj = [[] for _ in range(n)]

    def add_edge(self, u: int, v: int, w: int):
        self.adj[u].append((v, w))

    def get_shortest_path(self, src: int, dest: int) -> Tuple[List[int], List[float]]:
        dist = [INF] * self.n
        parent = [-1] * self.n
        pq = [] # 儲存元素為 (dist, u)

        dist[src] = 0.0
        heapq.heappush(pq, (0.0, src))

        while pq:
            d, u = heapq.heappop(pq)

            if d > dist[u]:
                continue # 惰性刪除
            if u == dest:
                break

            for v, w in self.adj[u]:
                if dist[u] + w < dist[v]:
                    dist[v] = dist[u] + w
                    parent[v] = u
                    heapq.heappush(pq, (dist[v], v))

        if dist[dest] == INF:
            return [], dist

        path = []
        curr = dest
        while curr != -1:
            path.append(curr)
            curr = parent[curr]
        path.reverse()
        return path, dist
```

---

## 3. 複雜度與防禦要點

### 複雜度分析
*   **時間複雜度**：$\mathcal{O}((V + E) \log V)$。在最壞情況下，堆中最多會同時存在 $E$ 個鬆弛狀態，每次彈出與插入皆為 $\mathcal{O}(\log V)$；配合惰性刪除，每個頂點只會被真正確定一次，因此效率極高。
*   **空間複雜度**：$\mathcal{O}(V + E)$。鄰接表需要 $\mathcal{O}(V + E)$ 空間，優先佇列在最壞情況下需要 $\mathcal{O}(E)$ 空間。

### 防禦性設計與避坑指南
1.  **Dijkstra 的致命死穴：負權邊 (Negative Edge Weights)**
    Dijkstra 演算法建立在「已被確定最短路徑的頂點，其距離此後只會遞增、不會被二次鬆弛變小」的貪心前提上。**如果圖中含有負權邊，這個前提將被徹底打破**，Dijkstra 會產出完全錯誤的答案，甚至陷入死循環。
    *   **防禦策略**：如果圖中含有負邊權，**必須改用 Bellman-Ford 演算法或 SPFA 演算法**。
2.  **惰性刪除 (Lazy Deletion) 的防超時機制**
    在鬆弛成功後，我們會直接向優先佇列推入新狀態 `(new_dist, v)`。這會導致一個頂點在佇列中存在多個不同的舊狀態。
    *   **防禦策略**：在彈出堆頂元素時，**必須執行 `if (d > dist[u]) continue;` 判定**。否則，程式會重覆走訪這些過期的髒節點出邊，使時間複雜度退化並無情超時 (TLE)。
3.  **無窮大常數溢出防範 (INF Overflow)**
    在鬆弛判定 `dist[u] + w < dist[v]` 中，若 `dist[u]` 當前為無窮大 `INF` 且 `w` 為正數，兩者相加會直接發生數值溢位。
    *   **防禦策略**：
        - 將 `dist` 陣列與 `INF` 宣告為 **64 位元長整數**（C++ 的 `long long`，Java 的 `long`）。
        - 在 Java 中，將 `INF` 設計為 `Long.MAX_VALUE / 2`，預留安全的溢位防護邊界，防止相加溢位。
