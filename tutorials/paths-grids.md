# 網格路徑 DP (Paths on Grids)

在一個 $N \times M$ 的二維網格中，求從左上角走到右下角的最短路徑、最大價值或路徑總數，是動態規劃中非常高頻的二維表格遞推模型。

---

## 1. 核心觀念與基本原理

*   **無後效性保證**：
    由於規定只能向「下」或向「右」移動，從而自然滿足了 DP 的無後效性性質。
*   **狀態轉移方程**（求路徑總數為例）：
    設 $dp[i][j]$ 表示到達網格格子 $(i, j)$ 的總路徑數。由於只能從上方 $(i-1, j)$ 或左方 $(i, j-1)$ 到達：
    $$dp[i][j] = dp[i-1][j] + dp[i][j-1]$$
    若存在障礙物，則該點的 $dp[i][j] = 0$。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

```cpp
#include <vector>
using namespace std;

long long unique_paths_with_obstacles(const vector<vector<int>>& grid) {
    int r = grid.size();
    int c = grid[0].size();
    if (grid[0][0] == 1) return 0;
    
    vector<long long> dp(c, 0);
    dp[0] = 1;
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            if (grid[i][j] == 1) {
                dp[j] = 0;
            } else if (j > 0) {
                dp[j] += dp[j - 1]; // dp[j] 代表上方狀態，dp[j-1] 代表左方狀態
            }
        }
    }
    return dp[c - 1];
}
```

```java
class GridPath {
    public static long uniquePaths(int[][] grid) {
        int r = grid.length;
        int c = grid[0].length;
        if (grid[0][0] == 1) return 0;
        
        long[] dp = new long[c];
        dp[0] = 1;
        for (int i = 0; i < r; i++) {
            for (int j = 0; j < c; j++) {
                if (grid[i][j] == 1) {
                    dp[j] = 0;
                } else if (j > 0) {
                    dp[j] += dp[j - 1];
                }
            }
        }
        return dp[c - 1];
    }
}
```

```python
def unique_paths(grid):
    r, c = len(grid), len(grid[0])
    if grid[0][0] == 1: return 0
    dp = [0] * c
    dp[0] = 1
    for i in range(r):
        for j in range(c):
            if grid[i][j] == 1:
                dp[j] = 0
            elif j > 0:
                dp[j] += dp[j - 1]
    return dp[-1]
```

---

## 3. 複雜度與防禦要點
*   **時間與空間複雜度**：時間 $\mathcal{O}(R \cdot C)$，滾動空間壓縮後僅需 $\mathcal{O}(C)$。
*   **防禦要點**：
    *   起點和終點若含有障礙物，需預防性特判回傳 0。
