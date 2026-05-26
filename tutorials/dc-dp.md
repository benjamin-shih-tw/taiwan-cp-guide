# 分治優化 DP (Divide and Conquer DP Optimization)

**分治優化 DP** 是一種將特定二維 DP 的 $\mathcal{O}(K \cdot N^2)$ 複雜度，優化至 **$\mathcal{O}(K \cdot N \log N)$** 的進階動態規劃優化技術。

---

## 1. 核心觀念與基本原理

*   **最優決策點單調性**：
    *   適用條件：設 $dp[i][j]$ 表示前 $i$ 個物品劃分成 $j$ 組的最優解。若對於固定的組數，隨著狀態 $i$ 的增加，其最優決策點 $opt[i]$（即取得最優解的分割點 $k$）也滿足**單調遞增**性質：
        $$opt[i] \le opt[i+1]$$
*   **二分分治遞迴搜尋**：
    我們定義分治函數 `solve(l, r, optL, optR)`。對於當前區間中點 $mid = (l+r)/2$，我們以 $\mathcal{O}(optR - optL)$ 暴力尋找其最優分割點 $best$。隨後利用單調性，遞迴計算左半部 $[l, mid-1]$（決策範圍限縮至 $[optL, best]$）與右半部 $[mid+1, r]$（決策範圍限縮至 $[best, optR]$）。
    這將狀態轉移代價直接降至優秀的對數階。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

```cpp
#include <vector>
#include <algorithm>
using namespace std;

// 經典分治 DP 優化框架
class DCDPOpt {
private:
    int n, k;
    vector<vector<long long>> dp;
    
    // 範例虛擬 Cost 函數
    long long cost(int l, int r) { return 0; } 
    
    void compute(int g, int l, int r, int opt_l, int opt_r) {
        if (l > r) return;
        int mid = (l + r) / 2;
        int best_k = opt_l;
        dp[g][mid] = 1e18;
        
        for (int k = opt_l; k <= min(mid, opt_r); k++) {
            long long val = dp[g - 1][k] + cost(k + 1, mid);
            if (val < dp[g][mid]) {
                dp[g][mid] = val;
                best_k = k;
            }
        }
        compute(g, l, mid - 1, opt_l, best_k);
        compute(g, mid + 1, r, best_k, opt_r);
    }
};
```

```java
class DCDPOpt {
    // 類似的分治遞迴結構
}
```

```python
def compute(g, l, r, opt_l, opt_r, dp, cost):
    if l > r: return
    mid = (l + r) // 2
    best_k = opt_l
    dp[g][mid] = 10**18
    for k in range(opt_l, min(mid, opt_r) + 1):
        val = dp[g-1][k] + cost(k + 1, mid)
        if val < dp[g][mid]:
            dp[g][mid] = val
            best_k = k
    compute(g, l, mid - 1, opt_l, best_k, dp, cost)
    compute(g, mid + 1, r, best_k, opt_r, dp, cost)
```

---

## 3. 複雜度與防禦要點
*   **時間複雜度**：每組轉移為 $\mathcal{O}(N \log N)$，總複雜度為 $\mathcal{O}(K \cdot N \log N)$。
*   **防禦要點**：
    *   **決策點單調性證明**：使用此優化前必須數學證明決策點單調性，或驗證區間 Cost 函數是否滿足**四邊形不等式 (Quadrangle Inequality)**：
        $$w(a, d) + w(b, c) \ge w(a, c) + w(b, d) \quad (a \le b \le c \le d)$$
