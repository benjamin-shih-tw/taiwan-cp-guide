# 狀態壓縮 DP (Bitmask DP)

當面對某些指數級規模的問題（如 TSP 旅行推銷員問題，集合大小 $N \le 20$），我們可以使用一個二進位整數來代表集合狀態，這就是**狀態壓縮 DP (Bitmask DP)**。

---

## 1. 核心觀念與基本原理

*   **狀態表示與轉移**：
    狀態通常定義為 $dp[mask][i]$，表示當前走訪過的節點子集為 $mask$，且當前停留在節點 $i$ 的最優解。
*   **狀態壓縮轉移式**：
    如果我們要從當前節點 $i$ 轉移到一個不在當前集合 $mask$ 中的相鄰新節點 $u$：
    $$dp[mask \mid (1 << u)][u] = \min(dp[mask \mid (1 << u)][u], dp[mask][i] + \text{Cost}(i, u))$$
    位元遮罩的大小為 $2^N$，將狀態轉移最佳化至快速的位元底層運算。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

```cpp
#include <vector>
#include <algorithm>
using namespace std;

// 經典 TSP 問題 (起點為 0，遍歷所有點回到 0 的最少花費)
int tsp(int n, const vector<vector<int>>& dist) {
    int num_states = 1 << n;
    vector<vector<int>> dp(num_states, vector<int>(n, 1e9));
    dp[1][0] = 0; // 起點在 0
    
    for (int mask = 1; mask < num_states; mask++) {
        for (int u = 0; u < n; u++) {
            if (dp[mask][u] == 1e9) continue;
            for (int v = 0; v < n; v++) {
                if (!(mask & (1 << v))) { // v 不在當前集合中
                    dp[mask | (1 << v)][v] = min(dp[mask | (1 << v)][v], dp[mask][u] + dist[u][v]);
                }
            }
        }
    }
    
    int ans = 1e9;
    for (int i = 1; i < n; i++) {
        ans = min(ans, dp[num_states - 1][i] + dist[i][0]);
    }
    return ans;
}
```

```java
import java.util.*;

class BitmaskDP {
    public static int tsp(int n, int[][] dist) {
        int numStates = 1 << n;
        int[][] dp = new int[numStates][n];
        for (int[] row : dp) Arrays.fill(row, 1_000_000_000);
        dp[1][0] = 0;
        
        for (int mask = 1; mask < numStates; mask++) {
            for (int u = 0; u < n; u++) {
                if (dp[mask][u] == 1_000_000_000) continue;
                for (int v = 0; v < n; v++) {
                    if ((mask & (1 << v)) == 0) {
                        dp[mask | (1 << v)][v] = Math.min(dp[mask | (1 << v)][v], dp[mask][u] + dist[u][v]);
                    }
                }
            }
        }
        int ans = 1_000_000_000;
        for (int i = 1; i < n; i++) {
            ans = Math.min(ans, dp[numStates - 1][i] + dist[i][0]);
        }
        return ans;
    }
}
```

```python
def tsp(n, dist):
    num_states = 1 << n
    dp = [[10**9] * n for _ in range(num_states)]
    dp[1][0] = 0
    
    for mask in range(1, num_states):
        for u in range(n):
            if dp[mask][u] == 10**9: continue
            for v in range(n):
                if not (mask & (1 << v)):
                    dp[mask | (1 << v)][v] = min(dp[mask | (1 << v)][v], dp[mask][u] + dist[u][v])
                    
    ans = 10**9
    for i in range(1, n):
        ans = min(ans, dp[-1][i] + dist[i][0])
    return ans
```

---

## 3. 複雜度與防禦要點
*   **時間與空間複雜度**：時間 $\mathcal{O}(N^2 \cdot 2^N)$，空間 $\mathcal{O}(N \cdot 2^N)$。
*   **防禦要點**：
    *   **移位溢位**：在大於 30 個頂點的超大規模集合下，不能直接使用 `1 << n`。
