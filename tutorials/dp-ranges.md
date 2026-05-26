# 區間 DP (Range DP)

**區間 DP (Range DP)** 是一種在區間（子段）上進行狀態轉移的特殊動態規劃模型。

---

## 1. 核心觀念與基本原理

*   **區間分治思維**：
    狀態通常定義為 $dp[i][j]$，表示子區間 $[i, j]$ 的最優解。
*   **轉移原理與階層遍歷**：
    我們通常藉由列舉「區間長度 $len$」（從小到大，由 $len=2$ 開始），然後遍歷區間起點 $i$。接著在區間內部列舉決策分割點 $k$（$i \le k < j$），由兩個更小長度的子區間最優解拼湊出當前區間的最優解：
    $$dp[i][j] = \min_{i \le k < j} (dp[i][k] + dp[k+1][j] + \text{Cost}(i, k, j))$$
*   **經典問題**：矩陣鏈乘法、石子合併。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

```cpp
#include <vector>
#include <algorithm>
using namespace std;

// 經典石子合併最少分數
int stone_merge(const vector<int>& stones) {
    int n = stones.size();
    vector<int> pref(n + 1, 0);
    for (int i = 0; i < n; i++) pref[i + 1] = pref[i] + stones[i];
    
    vector<vector<int>> dp(n, vector<int>(n, 0));
    for (int len = 2; len <= n; len++) { // 1. 枚舉區間長度
        for (int i = 0; i + len - 1 < n; i++) { // 2. 枚舉起點 i
            int j = i + len - 1;
            dp[i][j] = 1e9;
            for (int k = i; k < j; k++) { // 3. 枚舉決策分割點
                dp[i][j] = min(dp[i][j], dp[i][k] + dp[k + 1][j] + (pref[j + 1] - pref[i]));
            }
        }
    }
    return dp[0][n - 1];
}
```

```java
import java.util.*;

class RangeDP {
    public static int stoneMerge(int[] stones) {
        int n = stones.length;
        int[] pref = new int[n + 1];
        for (int i = 0; i < n; i++) pref[i + 1] = pref[i] + stones[i];
        
        int[][] dp = new int[n][n];
        for (int len = 2; len <= n; len++) {
            for (int i = 0; i + len - 1 < n; i++) {
                int j = i + len - 1;
                dp[i][j] = 1_000_000_000;
                for (int k = i; k < j; k++) {
                    dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k + 1][j] + (pref[j + 1] - pref[i]));
                }
            }
        }
        return dp[0][n - 1];
    }
}
```

```python
def stone_merge(stones):
    n = len(stones)
    pref = [0] * (n + 1)
    for i in range(n):
        pref[i + 1] = pref[i] + stones[i]
        
    dp = [[0] * n for _ in range(n)]
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = 10**9
            for k in range(i, j):
                dp[i][j] = min(dp[i][j], dp[i][k] + dp[k + 1][j] + (pref[j + 1] - pref[i]))
    return dp[0][n - 1]
```

---

## 3. 複雜度與防禦要點
*   **時間與空間複雜度**：時間 $\mathcal{O}(N^3)$，空間 $\mathcal{O}(N^2)$。
*   **防禦要點**：
    *   **循環順序**：外層**絕對不能直接遍歷起點 $i$**，否則在轉移時，小區間的狀態尚未計算完畢，會導致 DP 計算順序錯誤。必須外層遍歷長度 $len$ 或逆序遍歷 $i$。
