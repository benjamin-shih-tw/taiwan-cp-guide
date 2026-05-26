# 強連通分量 (Strongly Connected Components - SCC)

在有向圖中，**強連通分量 (SCC)** 是指一個極大的頂點子集，其中任意兩個頂點都可以互相到達。

---

## 1. 核心觀念與基本原理

*   **有向圖縮點 (Condensation)**：
    將圖中的每個強連通分量縮為一個「超級節點」，縮點後整張圖會被重構為一個**有向無環圖 (DAG)**，這使我們能直接在其上執行拓撲排序或動態規劃。
*   **Tarjan 演算法 — $\mathcal{O}(V + E)$**：
    *   基於 DFS 遍歷，維護兩個重要標記：
        1.  `dfn[u]`：節點 $u$ 被 DFS 遍歷到的時間戳記。
        2.  `low[u]`：節點 $u$ 透過子樹及其回邊能到達的最小 `dfn`。
    *   **判定與出棧**：若在回溯過程中發現 `dfn[u] == low[u]`，說明 $u$ 是該強連通分量的頭節點，將棧中一直到 $u$ 的節點全部彈出作為一個強連通分量。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

```cpp
#include <vector>
#include <stack>
#include <algorithm>
using namespace std;

class Tarjan {
private:
    int n, timer, scc_cnt;
    vector<vector<int>> adj;
    vector<int> dfn, low, scc_id;
    vector<bool> in_stack;
    stack<int> stk;
    
    void dfs(int u) {
        dfn[u] = low[u] = ++timer;
        stk.push(u);
        in_stack[u] = true;
        
        for (int v : adj[u]) {
            if (dfn[v] == 0) {
                dfs(v);
                low[u] = min(low[u], low[v]);
            } else if (in_stack[v]) {
                low[u] = min(low[u], dfn[v]);
            }
        }
        
        if (dfn[u] == low[u]) {
            scc_cnt++;
            while (true) {
                int v = stk.top(); stk.pop();
                in_stack[v] = false;
                scc_id[v] = scc_cnt;
                if (v == u) break;
            }
        }
    }
public:
    Tarjan(int n, const vector<vector<int>>& adj) : n(n), adj(adj), timer(0), scc_cnt(0) {
        dfn.assign(n, 0);
        low.assign(n, 0);
        scc_id.assign(n, 0);
        in_stack.assign(n, false);
    }
    void solve() {
        for (int i = 0; i < n; i++) {
            if (dfn[i] == 0) dfs(i);
        }
    }
    vector<int> get_scc_ids() { return scc_id; }
};
```

```java
import java.util.*;

class Tarjan {
    private int n, timer, sccCnt;
    private List<List<Integer>> adj;
    private int[] dfn, low, sccId;
    private boolean[] inStack;
    private Stack<Integer> stk;
    
    public Tarjan(int n, List<List<Integer>> adj) {
        this.n = n; this.adj = adj;
        this.dfn = new int[n]; this.low = new int[n];
        this.sccId = new int[n]; this.inStack = new boolean[n];
        this.stk = new Stack<>();
    }
    private void dfs(int u) {
        dfn[u] = low[u] = ++timer;
        stk.push(u); inStack[u] = true;
        
        for (int v : adj.get(u)) {
            if (dfn[v] == 0) {
                dfs(v);
                low[u] = Math.min(low[u], low[v]);
            } else if (inStack[v]) {
                low[u] = Math.min(low[u], dfn[v]);
            }
        }
        if (dfn[u] == low[u]) {
            sccCnt++;
            while (true) {
                int v = stk.pop(); inStack[v] = false;
                sccId[v] = sccCnt;
                if (v == u) break;
            }
        }
    }
}
```

```python
import sys
sys.setrecursionlimit(200000)

class Tarjan:
    def __init__(self, n, adj):
        self.n = n
        self.adj = adj
        self.timer = 0
        self.scc_cnt = 0
        self.dfn = [0] * n
        self.low = [0] * n
        self.scc_id = [0] * n
        self.in_stack = [False] * n
        self.stk = []
        
    def _dfs(self, u):
        self.timer += 1
        self.dfn[u] = self.low[u] = self.timer
        self.stk.append(u)
        self.in_stack[u] = True
        
        for v in self.adj[u]:
            if self.dfn[v] == 0:
                self._dfs(v)
                self.low[u] = min(self.low[u], self.low[v])
            elif self.in_stack[v]:
                self.low[u] = min(self.low[u], self.dfn[v])
                
        if self.dfn[u] == self.low[u]:
            self.scc_cnt += 1
            while True:
                v = self.stk.pop()
                self.in_stack[v] = False
                self.scc_id[v] = self.scc_cnt
                if v == u:
                    break
```

---

## 3. 複雜度與防禦要點
*   **時間與空間複雜度**：$\mathcal{O}(V + E)$。
*   **防禦要點**：
    *   **入棧判定**：在更新 `low[u] = min(low[u], dfn[v])` 時，**必須加上 `in_stack[v]` 的限制判定**。否則如果指向了一個已經出棧的強連通分量頂點，會產生錯誤的縮點邏輯。
