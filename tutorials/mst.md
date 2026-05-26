# 最小生成樹 (Minimum Spanning Tree - MST)

給定一個無向連通帶權圖，**最小生成樹 (MST)** 是指一個包含圖中所有節點且邊權總和最小的樹結構。

---

## 1. 核心觀念與基本原理

### 兩大經典演算法
1.  **Kruskal 演算法 (Kruskal's Algorithm) — $\mathcal{O}(E \log E)$**：
    *   核心思想：基於**貪婪選擇**。將所有邊依照權重從小到大排序，依序加入樹中。若加入該邊會形成環，則丟棄。
    *   實作核心：利用 **DSU** 判斷環路與聯通性。
2.  **Prim 演算法 (Prim's Algorithm) — $\mathcal{O}(E \log V)$**：
    *   核心思想：從單一節點出發，每次挑選與當前樹集合相連且權重最小的邊。
    *   實作核心：利用**優先佇列**優化。

對於稀疏圖，Kruskal 實作極為簡單且常數小，是競程的首選。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

```cpp
#include <vector>
#include <algorithm>
using namespace std;

struct Edge {
    int u, v;
    long long w;
    bool operator<(const Edge& other) const { return w < other.w; }
};

// Kruskal MST
long long kruskal(int n, vector<Edge>& edges) {
    sort(edges.begin(), edges.end());
    vector<int> parent(n);
    for (int i = 0; i < n; i++) parent[i] = i;
    auto find = [&](auto& self, int i) -> int {
        return parent[i] == i ? i : parent[i] = self(self, parent[i]);
    };
    
    long long mst_weight = 0;
    int edges_used = 0;
    for (const auto& e : edges) {
        int root_u = find(find, e.u);
        int root_v = find(find, e.v);
        if (root_u != root_v) {
            parent[root_u] = root_v;
            mst_weight += e.w;
            edges_used++;
            if (edges_used == n - 1) break;
        }
    }
    return edges_used == n - 1 ? mst_weight : -1; // -1 代表不連通
}
```

```java
import java.util.*;

class MST {
    static class Edge implements Comparable<Edge> {
        int u, v; long w;
        Edge(int u, int v, long w) { this.u = u; this.v = v; this.w = w; }
        public int compareTo(Edge o) { return Long.compare(this.w, o.w); }
    }
    public static long kruskal(int n, List<Edge> edges) {
        Collections.sort(edges);
        int[] parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        
        long mstWeight = 0;
        int edgesUsed = 0;
        for (Edge e : edges) {
            int rootU = find(parent, e.u);
            int rootV = find(parent, e.v);
            if (rootU != rootV) {
                parent[rootU] = rootV;
                mstWeight += e.w;
                edgesUsed++;
                if (edgesUsed == n - 1) break;
            }
        }
        return edgesUsed == n - 1 ? mstWeight : -1;
    }
    private static int find(int[] parent, int i) {
        return parent[i] == i ? i : (parent[i] = find(parent, parent[i]));
    }
}
```

```python
def kruskal(n, edges):
    edges.sort(key=lambda x: x[2]) # x = (u, v, w)
    parent = list(range(n))
    def find(i):
        if parent[i] == i:
            return i
        parent[i] = find(parent[i])
        return parent[i]
    
    mst_weight = 0
    edges_used = 0
    for u, v, w in edges:
        root_u = find(u)
        root_v = find(v)
        if root_u != root_v:
            parent[root_u] = root_v
            mst_weight += w
            edges_used += 1
            if edges_used == n - 1:
                break
    return mst_weight if edges_used == n - 1 else -1
```

---

## 3. 複雜度與防禦要點
*   **時間複雜度**：$\mathcal{O}(E \log E)$。
*   **防禦要點**：
    *   **大數溢位**：邊權累加和極易溢出 32 位元整數，MST 總重變數必須宣告為 64 位元長整數。
    *   **圖不連通**：若最終所選邊數少於 $V-1$，說明圖不連通，無生成樹。
