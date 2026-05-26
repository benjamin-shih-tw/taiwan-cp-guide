# 拓撲排序 (Topological Sort)

**拓撲排序 (Topological Sort)** 是針對**有向無環圖 (DAG)** 的節點進行線性排序的演算法。

---

## 1. 核心觀念與基本原理

排序後的序列滿足：對於圖中的任意有向邊 $(u, v)$，$u$ 在序列中都排在 $v$ 的前面（例如前置學科依賴關係）。
*   **Kahn 演算法 (Kahn's Algorithm) — $\mathcal{O}(V + E)$**：
    *   基於**入度 (In-degree)** 的思維。
    *   將所有入度為 $0$ 的節點加入佇列，隨後不斷彈出佇列頂點並將其相鄰出邊的目的地入度減 $1$。若減到 $0$ 則入隊。
    *   **環偵測**：若拓撲排序最終產出的節點數量小於 $V$，說明圖中**含有環**，無法拓撲排序。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

```cpp
#include <vector>
#include <queue>
using namespace std;

vector<int> toposort(int n, const vector<vector<int>>& adj) {
    vector<int> in_degree(n, 0);
    for (int u = 0; u < n; u++) {
        for (int v : adj[u]) in_degree[v]++;
    }
    
    queue<int> q;
    for (int i = 0; i < n; i++) {
        if (in_degree[i] == 0) q.push(i);
    }
    
    vector<int> order;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int v : adj[u]) {
            if (--in_degree[v] == 0) q.push(v);
        }
    }
    return order.size() == n ? order : vector<int>{}; // 空代表有環
}
```

```java
import java.util.*;

class TopoSort {
    public static List<Integer> toposort(int n, List<List<Integer>> adj) {
        int[] inDegree = new int[n];
        for (int u = 0; u < n; u++) {
            for (int v : adj.get(u)) inDegree[v]++;
        }
        
        Queue<Integer> q = new LinkedList<>();
        for (int i = 0; i < n; i++) {
            if (inDegree[i] == 0) q.offer(i);
        }
        
        List<Integer> order = new ArrayList<>();
        while (!q.isEmpty()) {
            int u = q.poll();
            order.add(u);
            for (int v : adj.get(u)) {
                if (--inDegree[v] == 0) q.offer(v);
            }
        }
        return order.size() == n ? order : new ArrayList<>();
    }
}
```

```python
from collections import deque

def toposort(n, adj):
    in_degree = [0] * n
    for u in range(n):
        for v in adj[u]:
            in_degree[v] += 1
            
    q = deque([i for i in range(n) if in_degree[i] == 0])
    order = []
    while q:
        u = q.popleft()
        order.append(u)
        for v in adj[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                q.append(v)
    return order if len(order) == n else []
```

---

## 3. 複雜度與防禦要點
*   **時間與空間複雜度**：$\mathcal{O}(V + E)$。
*   **防禦要點**：
    *   在題目可能存在環的場景下，若不校驗產出序列長度直接使用，會引發邏輯錯誤。
