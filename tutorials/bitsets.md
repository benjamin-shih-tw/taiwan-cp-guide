# Bitset 優化 (Bitset Optimizations)

**Bitset 優化** 是一種利用 CPU 底層位元平行處理特性（一般為 $32$ 或 $64$ 位元平行運算），將狀態壓縮或子集判定操作的常數因子優化至極致（除以 $32$ 或 $64$）的常數優化技術。

---

## 1. 核心觀念與基本原理

*   **位元層級平行處理**：
    *   在標準二維 DP 狀態轉移或背包判定中，若狀態只涉及「可行性（0 或 1）」，我們可以將整個 DP 陣列壓制成一個超大二進位整數（`bitset`）。
    *   **超低常數優化**：
        當我們進行背包轉移 `dp[j] = dp[j] | dp[j - w]` 時，可以將其完美化簡為位元整數的移位與按位或操作：
        $$\text{dp} = \text{dp} \mid (\text{dp} \ll w)$$
        CPU 能在單個指令內平行處理 64 位元的轉移，相當於時間複雜度直接**除以 $64$**，使原來需要 $10^9$ 次的基本運算瞬間降至僅需 $1.5 \times 10^7$ 次，在 $1$ 秒內暴風通過！

---

## 2. 三種語言實作範本 (C++ / Java / Python)

```cpp
#include <iostream>
#include <vector>
#include <bitset>
using namespace std;

// 經典背包可行性判定：用 bitset 優化 (物品大小總和不超過 100000)
bool solve_knapsack_bitset(const vector<int>& weights, int target) {
    // 必須使用常數定義位元大小
    const int MAX_W = 100005;
    bitset<MAX_W> dp;
    dp[0] = 1; // 初始可行
    
    for (int w : weights) {
        dp |= (dp << w); // 一行指令完成 O(W/64) 整體狀態轉移！
    }
    return dp[target];
}
```

```java
import java.util.BitSet;

class BitsetOpt {
    public static boolean solve(int[] weights, int target) {
        BitSet dp = new BitSet(target + 1);
        dp.set(0);
        
        for (int w : weights) {
            // Java 內建的 BitSet 無法直接進行動態左移位元操作
            // 可使用手動循環 Long 陣列或以動態遍歷位元進行優化
            for (int j = target; j >= w; j--) {
                if (dp.get(j - w)) dp.set(j);
            }
        }
        return dp.get(target);
    }
}
```

```python
class BitsetOpt:
    def solve(self, weights, target):
        # Python 支援無限精度的整數，天然就是一個超大型 Bitset！
        dp = 1 # 二進位代表 dp[0] = 1
        for w in weights:
            dp |= (dp << w)
        return bool((dp >> target) & 1)
```

---

## 3. 複雜度與防禦要點
*   **時間複雜度**：$\mathcal{O}(\frac{N \cdot W}{w_0})$，其中 $w_0 = 32$ 或 $64$ 為字長常數。
*   **防禦要點**：
    *   在 C++ 中，`std::bitset<N>` 的大小 $N$ **必須在編譯期確定為常數**，不能使用動態變數。若需要動態大小，必須使用 `std::vector<bool>`（雖然同樣具有位元壓縮優化，但缺少部分位元操作 API）或手寫 `unsigned long long` 陣列。
