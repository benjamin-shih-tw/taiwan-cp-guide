# 樹形 DP (Tree DP)

**樹形 DP (Tree DP)** 是指在樹結構上進行遞迴決策與狀態轉移的動態規劃模型。

---

## 1. 核心觀念與基本原理

*   **無後效性與分治**：
    樹結構本身即是遞迴分治的拓撲模型。子樹的最優解能獨立計算且不影響其他無關分支，天然符合無後效性。
*   **遞迴轉移（自底向上）**：
    我們通常使用一個 DFS 遍歷樹，並在回溯的過程中計算狀態。狀態通常定義為 $dp[u][0/1]$，表示在以 $u$ 為根的子樹中，節點 $u$ 選擇「選 (1)」或「不選 (0)」時的最優解。
*   **經典問題**：樹的最大獨立集（如「沒有上司的舞會」）。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

```cpp
#include <vector>
#include <algorithm>
using namespace std;

// 沒有上司的舞會 (樹的最大獨立集)
void dfs(int u, int p, const vector<vector<int>>& adj, const vector<int>& happy, vector<vector<int>>& dp) {
    dp[u][1] = happy[u];
    dp[u][0] = 0;
    for (int v : adj[u]) {
        if (v == p) continue;
        dfs(v, u, adj, happy, dp);
        dp[u][1] += dp[v][0]; // 選 u，則子節點 v 不能選
        dp[u][0] += max(dp[v][0], dp[v][1]); // 不選 u，則子節點 v 可選可不選
    }
}
```

```java
import java.util.*;

class TreeDP {
    public static void dfs(int u, int p, List<List<Integer>> adj, int[] happy, int[][] dp) {
        dp[u][1] = happy[u];
        dp[u][0] = 0;
        for (int v : adj.get(u)) {
            if (v == p) continue;
            dfs(v, u, adj, happy, dp);
            dp[u][1] += dp[v][0];
            dp[u][0] += Math.max(dp[v][0], dp[v][1]);
        }
    }
}
```

```python
import sys
sys.setrecursionlimit(200000)

def dfs(u, p, adj, happy, dp):
    dp[u][1] = happy[u]
    dp[u][0] = 0
    for v in adj[u]:
        if v == p: continue
        dfs(v, u, adj, happy, dp)
        dp[u][1] += dp[v][0]
        dp[u][0] += max(dp[v][0], dp[v][1])
```

---

## 3. 複雜度與防禦要點
*   **時間與空間複雜度**：時間 $\mathcal{O}(N)$，空間 $\mathcal{O}(N)$（DFS 遞迴系統堆疊與狀態表開銷）。
*   **防禦要點**：
    *   **無根樹雙向邊**：樹是雙向邊，DFS 時**必須排除父節點 `p`**，否則會發生無限遞迴引發段錯誤。
