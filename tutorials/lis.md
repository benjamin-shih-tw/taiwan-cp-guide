# 最長遞增子序列 (Longest Increasing Subsequence - LIS)

給定一個序列，**最長遞增子序列 (LIS)** 是指在不改變元素相對順序的情況下，能挑選出的最長嚴格單調遞增的子序列。

---

## 1. 核心觀念與基本原理

*   **樸素 DP 法 — $\mathcal{O}(N^2)$**：
    設 $dp[i]$ 表示以 $nums[i]$ 結尾的最長遞增子序列長度。轉移式為：
    $$dp[i] = \max_{0 \le j < i, nums[j] < nums[i]} (dp[j] + 1)$$
*   **二分搜尋優化法 — $\mathcal{O}(N \log N)$**：
    我們維護一個輔支陣列 $g$，其中 $g[len]$ 儲存了所有目前長度為 $len$ 的遞增子序列中最小的末尾元素。
    當遍歷到新元素 $x$ 時，利用二分搜尋在 $g$ 中尋找第一個大於等於 $x$ 的元素並用 $x$ 替換它。若 $x$ 大於所有元素，則將 $x$ 追加到末尾。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

```cpp
#include <vector>
#include <algorithm>
using namespace std;

int lis(const vector<int>& nums) {
    vector<int> g;
    for (int x : nums) {
        auto it = lower_bound(g.begin(), g.end(), x); // 嚴格遞增用 lower_bound，非遞減用 upper_bound
        if (it == g.end()) g.push_back(x);
        else *it = x;
    }
    return g.size();
}
```

```java
import java.util.*;

class LIS {
    public static int lis(int[] nums) {
        List<Integer> g = new ArrayList<>();
        for (int x : nums) {
            int idx = Collections.binarySearch(g, x);
            if (idx < 0) idx = -(idx + 1);
            if (idx == g.size()) g.add(x);
            else g.set(idx, x);
        }
        return g.size();
    }
}
```

```python
from bisect import bisect_left

def lis(nums):
    g = []
    for x in nums:
        idx = bisect_left(g, x)
        if idx == len(g):
            g.append(x)
        else:
            g[idx] = x
    return len(g)
```

---

## 3. 複雜度與防禦要點
*   **時間複雜度**：$\mathcal{O}(N \log N)$。
*   **防禦要點**：
    *   **嚴格與非嚴格單調性**：嚴格單調遞增在二分搜尋時要用 `lower_bound`；非嚴格遞增（可重複值）必須改用 `upper_bound` 進行查找替換。
