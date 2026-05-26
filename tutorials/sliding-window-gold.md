# 金級滑動視窗 (Sliding Window Gold)

金級滑動視窗主要解決「動態維護視窗內特定複雜性質」的問題。

---

## 1. 核心觀念與基本原理

*   **雙指標左右收縮（雙指針）**：
    維護一個半開半閉區間 $[L, R)$。當區間內狀態滿足條件時，右指標 $R$ 右移；若不滿足，左指標 $L$ 右移收縮。
*   **雙指針單調性前提**：
    只有當問題**具有單調性性質**時（即若區間 $[L, R]$ 滿足條件，則其子區間也必然滿足，或若不滿足則擴大也必然不滿足），才能使用雙指針將複雜度降至 **$\mathcal{O}(N)$**。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

```cpp
#include <vector>
#include <algorithm>
using namespace std;

// 尋找元素和不超過 S 的最長子陣列長度
int max_len_subarr(const vector<int>& nums, long long S) {
    int n = nums.size();
    int l = 0, max_len = 0;
    long long current_sum = 0;
    for (int r = 0; r < n; r++) {
        current_sum += nums[r];
        while (current_sum > S && l <= r) {
            current_sum -= nums[l];
            l++;
        }
        max_len = max(max_len, r - l + 1);
    }
    return max_len;
}
```

```java
class SlidingWindowGold {
    public static int maxLen(int[] nums, long S) {
        int n = nums.length;
        int l = 0, maxLen = 0;
        long currentSum = 0;
        for (int r = 0; r < n; r++) {
            currentSum += nums[r];
            while (currentSum > S && l <= r) {
                currentSum -= nums[l];
                l++;
            }
            maxLen = Math.max(maxLen, r - l + 1);
        }
        return maxLen;
    }
}
```

```python
def max_len_subarr(nums, S):
    l, max_len, current_sum = 0, 0, 0
    for r in range(len(nums)):
        current_sum += nums[r]
        while current_sum > S and l <= r:
            current_sum -= nums[l]
            l += 1
        max_len = max(max_len, r - l + 1)
    return max_len
```

---

## 3. 複雜度與防禦要點
*   **時間與空間複雜度**：時間 $\mathcal{O}(N)$，空間 $\mathcal{O}(1)$。
*   **防禦要點**：
    *   在處理負數數組時，雙指針**不具有單調性性質**。負數數組區間和限制必須改用前綴和與平衡樹/雙端佇列，或者使用單調棧。
