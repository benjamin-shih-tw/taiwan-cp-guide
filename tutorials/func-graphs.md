# 函數圖與基環樹 (Functional Graphs & Cycle Detection)

在算法競賽與面試中，**函數圖 (Functional Graph)** 是一種極具特色的有向圖模型。它的核心特徵是：**每個頂點的出度 (Out-degree) 恰好為 $1$**。這種獨特的拓撲結構使其衍生出豐富的性質，是環偵測、基環樹樹形動態規劃等進階算法的基石。

---

## 1. 核心觀念與基本原理

### 什麼是函數圖與基環樹？
*   **函數圖的定義**：給定一個頂點集合 $V$ 且每個點 $i$ 指向唯一的出邊目的地 $f(i)$，這張圖即代表了函數關係 $f: V \to V$。
*   **拓撲結構性質**：
    1.  因為每個點都有一條出邊，如果我們從任意一個點出發，沿著有向邊一直走，由於頂點數量有限，**最終必然會進入一個環**。
    2.  因此，函數圖的每個連通分量（弱連通）都**恰好包含一個有向環**，且環以外的點會形成若干棵以環上節點為根、邊朝向環的「內向樹 (In-directed Trees)」。
    3.  這種「一個環加上若干棵樹」的拓撲結構，又被稱為**基環樹 (Pseudotree / Cycle-with-trees)**。

### 環偵測與找環路徑演算法
在實戰中，最常見的任務是：**給定一張函數圖，找出所有的環，或是判斷某個點走 $K$ 步之後會停在環的哪一個位置**。常見的找環方法有兩種：

#### 方法 A：三色標記法 (DFS 染色法) — $\mathcal{O}(N)$
使用一個標記陣列 `vis` 來記錄每個節點的訪問狀態：
*   `vis[i] = 0` (未訪問 White)：節點尚未被探索。
*   `vis[i] = 1` (訪問中 Gray)：正在遞迴探索該節點的子樹。如果在此狀態下再次遇到該節點，說明**發現了環**！
*   `vis[i] = 2` (已完成 Black)：該節點及所有能到達的節點已全部探索完畢，不存在未偵測到的環。

#### 方法 B：弗洛伊德判圈演算法 (Floyd's Cycle-Finding Algorithm) — $\mathcal{O}(N)$ 時間, $\mathcal{O}(1)$ 空間
又稱「龜兔賽跑演算法」。我們維護兩個指標：
*   **烏龜 (Slow)**：每次走 $1$ 步：$slow = f(slow)$。
*   **兔子 (Fast)**：每次走 $2$ 步：$fast = f(f(fast))$。
若兔子與烏龜相遇，則證明圖中存在環。此算法最大的優勢是**不需要開闢額外的 visited 陣列**，能將輔助空間降至絕對的 $\mathcal{O}(1)$。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

以下提供在一張給定的函數圖中**偵測環、收集環上所有節點**的完整實作模板：

```cpp
// C++ 三色標記法找環實作範本
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

class FunctionalGraph {
private:
    int n;
    vector<int> f; // f[i] 表示 i 的唯一出邊目的地 (0-indexed)
    vector<int> vis; // 0: 未訪問, 1: 訪問中, 2: 已完成
    vector<int> path; // 記錄 DFS 路徑以重建環

public:
    FunctionalGraph(int n, const vector<int>& next_node) : n(n), f(next_node), vis(n, 0) {}

    // DFS 找環，回傳找到的環節點集合；若無新環則回傳空陣列
    vector<int> find_cycle(int u, vector<int>& parent) {
        vis[u] = 1;
        path.push_back(u);

        int v = f[u];
        if (vis[v] == 0) {
            parent[v] = u;
            vector<int> res = find_cycle(v, parent);
            if (!res.empty()) return res;
        } else if (vis[v] == 1) {
            // 發現回邊，代表找到環！
            vector<int> cycle;
            int curr = u;
            while (curr != v) {
                cycle.push_back(curr);
                curr = parent[curr];
            }
            cycle.push_back(v);
            reverse(cycle.begin(), cycle.end()); // 恢復順向
            vis[u] = 2;
            path.pop_back();
            return cycle;
        }

        vis[u] = 2;
        path.pop_back();
        return {};
    }

    // 獲取整張圖中的所有環
    vector<vector<int>> get_all_cycles() {
        vector<vector<int>> all_cycles;
        vector<int> parent(n, -1);
        for (int i = 0; i < n; ++i) {
            if (vis[i] == 0) {
                vector<int> cycle = find_cycle(i, parent);
                if (!cycle.empty()) {
                    all_cycles.push_back(cycle);
                }
            }
        }
        return all_cycles;
    }
};
```

```java
// Java 三色標記法找環實作範本
import java.io.*;
import java.util.*;

class FunctionalGraph {
    private int n;
    private int[] f; // f[i] 目的地
    private int[] vis; // 0: unvisited, 1: visiting, 2: visited
    private int[] parent;

    public FunctionalGraph(int n, int[] nextNode) {
        this.n = n;
        this.f = nextNode;
        this.vis = new int[n];
        this.parent = new int[n];
        Arrays.fill(parent, -1);
    }

    private List<Integer> findCycle(int u, List<Integer> cycleContainer) {
        vis[u] = 1;
        int v = f[u];

        if (vis[v] == 0) {
            parent[v] = u;
            List<Integer> res = findCycle(v, cycleContainer);
            if (res != null) return res;
        } else if (vis[v] == 1) {
            // 找到環
            List<Integer> cycle = new ArrayList<>();
            int curr = u;
            while (curr != v) {
                cycle.add(curr);
                curr = parent[curr];
            }
            cycle.add(v);
            Collections.reverse(cycle);
            vis[u] = 2;
            return cycle;
        }

        vis[u] = 2;
        return null;
    }

    public List<List<Integer>> getAllCycles() {
        List<List<Integer>> allCycles = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            if (vis[i] == 0) {
                List<Integer> cycle = findCycle(i, allCycles);
                if (cycle != null) {
                    allCycles.add(cycle);
                }
            }
        }
        return allCycles;
    }
}
```

```python
# Python 三色標記法找環實作範本
import sys
# 增加遞迴深度防護
sys.setrecursionlimit(200000)

class FunctionalGraph:
    def __init__(self, n, next_node):
        self.n = n
        self.f = next_node  # next_node[i] 表示 i 的下一個節點
        self.vis = [0] * n  # 0: white, 1: gray, 2: black
        self.parent = [-1] * n

    def _find_cycle(self, u):
        self.vis[u] = 1
        v = self.f[u]

        if self.vis[v] == 0:
            self.parent[v] = u
            res = self._find_cycle(v)
            if res is not None:
                return res
        elif self.vis[v] == 1:
            # 找到環，回溯收集
            cycle = []
            curr = u
            while curr != v:
                cycle.append(curr)
                curr = self.parent[curr]
            cycle.append(v)
            cycle.reverse()
            self.vis[u] = 2
            return cycle

        self.vis[u] = 2
        return None

    def get_all_cycles(self):
        all_cycles = []
        for i in range(self.n):
            if self.vis[i] == 0:
                cycle = self._find_cycle(i)
                if cycle is not None:
                    all_cycles.append(cycle)
        return all_cycles
```

---

## 3. 複雜度與防禦要點

### 複雜度分析
*   **時間複雜度**：$\mathcal{O}(N)$。不論使用 DFS 標記法或是 Floyd 判圈演算法，每個頂點與每條出邊都最多被走訪常數次。
*   **空間複雜度**：$\mathcal{O}(N)$（DFS 遞迴系統堆疊空間及 `vis`、`parent` 輔助陣列）。若使用 Floyd 演算法，空間可優化至 $\mathcal{O}(1)$。

### 防禦性設計與避坑指南
1.  **倍增法與有向躍遷 (Binary Lifting / Doubling)**:
    在某些題目中，我們需要求「從點 $u$ 出發，走 $K$ 步後會到達哪個點」，其中 $K \le 10^{18}$。此時直接模擬會無情超時。
    *   **防禦策略**：建立倍增表 `up[i][j]` 表示從節點 `i` 躍遷 $2^j$ 步到達的節點。
    *   **狀態轉移式**：`up[i][j] = up[up[i][j-1]][j-1]`，預處理時間複雜度為 $\mathcal{O}(N \log K)$，單次查詢僅需 $\mathcal{O}(\log K)$。
2.  **遞迴深度防護 (Stack Overflow)**:
    若圖的拓撲結構退化成一條極長的有向鏈，遞迴深度會高達 $10^5$ 以上，易導致記憶體溢出。
    *   **防禦策略**：在 C++ 中加大系統堆疊限制；在 Python 中使用 `sys.setrecursionlimit`；或使用拓撲排序（Kahn's Algorithm 剝離入度為 0 的葉子節點）將所有樹枝修剪掉，最後只對剩下的環節點進行疊代式遍歷。
3.  **自環與雙向環 (Self-loops & Two-node cycles)**:
    當某節點 $f(i) = i$（自環）或 $f(i) = j \land f(j) = i$ 時，找環邏輯容易死鎖或遺漏。
    *   **防禦策略**：利用 `vis[v] == 1` 的判定能完美防禦自環，因為 `v == u` 時會直接觸發回邊收集邏輯，直接回傳 `[u]`。
