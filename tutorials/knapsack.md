# 背包問題 (Knapsack DP)

**背包問題 (Knapsack Problem)** 是動態規劃中最經典、最重要的入門與基礎模型。

---

## 1. 核心觀念與基本原理

### 兩大核心背包模型
1.  **0-1 背包 (0-1 Knapsack)**：每個物品只有一件，可以選擇「裝 (1)」或「不裝 (0)」。
    *   **狀態轉移方程**：設 $dp[i][j]$ 表示前 $i$ 個物品在背包剩餘容量為 $j$ 時的最大價值。
        $$dp[i][j] = \max(dp[i-1][j], dp[i-1][j-w_i] + v_i)$$
    *   **空間壓制優化**：由於當前狀態只與上一行 $i-1$ 相關，我們可以使用一維陣列 $dp[j]$，但**必須逆序遍歷** $j$，以防重複使用同一個物品。
2.  **完全背包 (Unbounded Knapsack)**：每種物品有無限件。
    *   **空間優化與轉移**：使用一維陣列 $dp[j]$，但**必須順序遍歷** $j$，因為每種物品可以無限多次挑選。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

```cpp
#include <vector>
#include <algorithm>
using namespace std;

// 0-1 背包一維優化
long long solve_01_knapsack(int n, int W, const vector<int>& w, const vector<int>& v) {
    vector<long long> dp(W + 1, 0);
    for (int i = 0; i < n; i++) {
        for (int j = W; j >= w[i]; j--) { // 逆序
            dp[j] = max(dp[j], dp[j - w[i]] + v[i]);
        }
    }
    return dp[W];
}
```

```java
import java.util.*;

class Knapsack {
    public static long solve01(int n, int W, int[] w, int[] v) {
        long[] dp = new long[W + 1];
        for (int i = 0; i < n; i++) {
            for (int j = W; j >= w[i]; j--) {
                dp[j] = Math.max(dp[j], dp[j - w[i]] + v[i]);
            }
        }
        return dp[W];
    }
}
```

```python
def solve_01_knapsack(n, W, w, v):
    dp = [0] * (W + 1)
    for i in range(n):
        for j in range(W, w[i] - 1, -1):
            dp[j] = max(dp[j], dp[j - w[i]] + v[i])
    return dp[W]
```

---

## 3. 複雜度與防禦要點
*   **時間與空間複雜度**：時間 $\mathcal{O}(N \cdot W)$，空間一維優化後為 $\mathcal{O}(W)$。
*   **防禦要點**：
    *   **狀態更新順序**：在 0-1 背包中將 $j$ 的循環寫成正序，會直接退化成完全背包。
