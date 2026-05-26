# 折半搜尋 (Meet in the Middle)

**折半搜尋 (Meet in the Middle)** 是一種針對「搜索空間極大（如 $N \le 40$）但無法直接接受 $\mathcal{O}(2^N)$ 暴力搜索」的經典優化技巧。

---

## 1. 核心觀念與基本原理

*   **折半思想與分治**：
    *   將大小為 $N$ 的集合分為兩個大小為 $N/2$ 的子集合。
    *   對前一半獨立執行暴力搜索（$\mathcal{O}(2^{N/2})$），並將所得的所有子集和存入陣列中並**排序**。
    *   對後一半執行暴力搜索（$\mathcal{O}(2^{N/2})$）。當獲取一個子集和 $sum_2$ 時，我們利用**二分搜尋**，在前一半的已排序陣列中搜尋與 $sum_2$ 拼湊最接近目標值的數值。
    總時間複雜度從暴力的 $\mathcal{O}(2^N)$ 戲劇性降至 **$\mathcal{O}(2^{N/2} \log (2^{N/2})) = \mathcal{O}(N \cdot 2^{N/2})$**，在 $N=40$ 時能直接通過！

---

## 2. 三種語言實作範本 (C++ / Java / Python)

```cpp
#include <vector>
#include <algorithm>
using namespace std;

// 折半搜尋求子集和不大於 S 的最大值
long long meet_in_the_middle(const vector<long long>& nums, long long S) {
    int n = nums.size();
    int n1 = n / 2;
    int n2 = n - n1;
    
    vector<long long> left_sums;
    for (int mask = 0; mask < (1 << n1); mask++) {
        long long s = 0;
        for (int i = 0; i < n1; i++) {
            if ((mask >> i) & 1) s += nums[i];
        }
        if (s <= S) left_sums.push_back(s);
    }
    sort(left_sums.begin(), left_sums.end());
    
    long long ans = 0;
    for (int mask = 0; mask < (1 << n2); mask++) {
        long long s = 0;
        for (int i = 0; i < n2; i++) {
            if ((mask >> i) & 1) s += nums[n1 + i];
        }
        if (s <= S) {
            auto it = upper_bound(left_sums.begin(), left_sums.end(), S - s);
            if (it != left_sums.begin()) {
                ans = max(ans, s + *(--it));
            }
        }
    }
    return ans;
}
```

```java
import java.util.*;

class MeetInTheMiddle {
    public static long solve(long[] nums, long S) {
        int n = nums.length;
        int n1 = n / 2;
        int n2 = n - n1;
        
        List<Long> left = new ArrayList<>();
        for (int mask = 0; mask < (1 << n1); mask++) {
            long s = 0;
            for (int i = 0; i < n1; i++) if (((mask >> i) & 1) == 1) s += nums[i];
            if (s <= S) left.add(s);
        }
        Collections.sort(left);
        
        long ans = 0;
        for (int mask = 0; mask < (1 << n2); mask++) {
            long s = 0;
            for (int i = 0; i < n2; i++) if (((mask >> i) & 1) == 1) s += nums[n1 + i];
            if (s <= S) {
                int idx = Collections.binarySearch(left, S - s);
                if (idx < 0) idx = -(idx + 1) - 1;
                if (idx >= 0 && idx < left.size()) {
                    ans = Math.max(ans, s + left.get(idx));
                }
            }
        }
        return ans;
    }
}
```

```python
from bisect import bisect_right

def meet_in_the_middle(nums, S):
    n = len(nums)
    n1 = n // 2
    n2 = n - n1
    
    left = []
    for mask in range(1 << n1):
        s = 0
        for i in range(n1):
            if (mask >> i) & 1: s += nums[i]
        if s <= S: left.append(s)
    left.sort()
    
    ans = 0
    for mask in range(1 << n2):
        s = 0
        for i in range(n2):
            if (mask >> i) & 1: s += nums[n1 + i]
        if s <= S:
            idx = bisect_right(left, S - s) - 1
            if idx >= 0:
                ans = max(ans, s + left[idx])
    return ans
```

---

## 3. 複雜度與防禦要點
*   **時間複雜度**：$\mathcal{O}(N \cdot 2^{N/2})$，空間複雜度為 $\mathcal{O}(2^{N/2})$。
*   **防禦要點**：
    *   在 C++ 移位時，若 $N/2 \ge 31$，必須使用 `1LL`，防止位元操作瞬間數值溢位。
