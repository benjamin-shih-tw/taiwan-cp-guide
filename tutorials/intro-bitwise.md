# 位元運算與子集生成 (Bitwise Operations & Bitmask Subsets)

在算法競賽中，**位元運算 (Bitwise Operations)** 是一種利用電腦底層硬體對二進位直接操作的超高速優化技巧。藉由將狀態壓縮成二進位整數（即 **位元遮罩 Bitmask**），我們能以極低的常數時間與空間複雜度，優雅地解決諸如「子集生成」、「集合狀態壓縮動態規劃 (Bitmask DP)」等高頻考題。

---

## 1. 核心觀念與基本原理

### 六大核心位元運算子
電腦內部的數值皆以補碼形式的二進位儲存，以下是六種最底層的位元操作：
1.  **按位與 (AND `&`)**：兩者皆為 $1$ 才回傳 $1$。常用於**檢查特定位元**。
2.  **按位或 (OR `|`)**：任意一者為 $1$ 即回傳 $1$。常用於**標記/啟用特定狀態**。
3.  **按位異或 (XOR `^`)**：兩者不同回傳 $1$，相同回傳 $0$。常用於**翻轉狀態**或**消除相同元素**。
4.  **按位取反 (NOT `~`)**：$1$ 變 $0$，$0$ 變 $1$。常用於**狀態清零遮罩構造**。
5.  **左移 (Left Shift `<<`)**：二進位位元全部左移，右端補 $0$。在不溢出的情況下，`x << k` 等價於 $x \times 2^k$。
6.  **右移 (Right Shift `>>`)**：二進位位元全部右移。在非負整數下，`x >> k` 等價於 $\lfloor x / 2^k \rfloor$。

### 運算子優先級陷阱（CP 致命 Bug 之一）
在 C++、Java 與 Python 中，**位元運算子的優先級極低**，其優先順序甚至低於比較運算子（如 `==`、`!=`、`<`）。
*   **錯誤示範**：`if (mask & 1 == 0)`
    由於 `==` 優先級高於 `&`，這行程式碼會被編譯器解讀為 `mask & (1 == 0)`，即 `mask & 0`，這會引發嚴重的邏輯 Bug！
*   **防禦策略**：**涉及位元運算時，請務必養成無條件加上括號的習慣**：
    `if ((mask & 1) == 0)`

### 位元遮罩 (Bitmask) 的基礎操作
假設我們用一個整數 `mask` 的二進位第 $0 \sim N-1$ 位來代表一個大小為 $N$ 的集合狀態（$1$ 代表該元素存在，$0$ 代表不存在）：
*   **檢查第 $k$ 個元素是否在集合中**：`if ((mask & (1 << k)) != 0)` 或 `if ((mask >> k) & 1)`
*   **將第 $k$ 個元素加入集合**：`mask |= (1 << k)`
*   **將第 $k$ 個元素移出集合**：`mask &= ~(1 << k)`
*   **翻轉第 $k$ 個元素的狀態**：`mask ^= (1 << k)`

### 子集生成 (Bitmask Subset Generation)
對於一個大小為 $N$ 的集合，其子集總數為 $2^N$。我們可以使用一個從 $0$ 遞增到 $2^N - 1$ 的整數 `mask`，其中 `mask` 的二進位表示即對應集合的一種子集狀態。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

以下提供使用**位元遮罩暴力生成所有子集並計算子集元素總和**的經典模板（解決「子集和 Subset Sum」問題）：

```cpp
// C++ 位元遮罩子集生成與子集和模板
#include <iostream>
#include <vector>

using namespace std;

class SubsetSumSolver {
public:
    // 回傳所有滿足子集總和等於 target 的子集狀態 (以位元遮罩表示)
    vector<int> solve_subset_sum(const vector<int>& weights, long long target) {
        int n = weights.size();
        int total_states = 1 << n; // 2^n 種狀態
        vector<int> matching_masks;

        for (int mask = 0; mask < total_states; ++mask) {
            long long current_sum = 0;
            for (int i = 0; i < n; ++i) {
                // 檢查 mask 的第 i 位是否為 1
                if ((mask >> i) & 1) {
                    current_sum += weights[i];
                }
            }

            if (current_sum == target) {
                matching_masks.push_back(mask);
            }
        }
        return matching_masks;
    }
};
```

```java
// Java 位元遮罩子集生成與子集和模板
import java.io.*;
import java.util.*;

class SubsetSumSolver {
    public List<Integer> solveSubsetSum(int[] weights, long target) {
        int n = weights.length;
        int totalStates = 1 << n; // 2^n
        List<Integer> matchingMasks = new ArrayList<>();

        for (int mask = 0; mask < totalStates; mask++) {
            long currentSum = 0;
            for (int i = 0; i < n; i++) {
                if (((mask >> i) & 1) == 1) {
                    currentSum += weights[i];
                }
            }

            if (currentSum == target) {
                matchingMasks.add(mask);
            }
        }
        return matchingMasks;
    }
}
```

```python
# Python 位元遮罩子集生成與子集和模板
from typing import List

class SubsetSumSolver:
    def solve_subset_sum(self, weights: List[int], target: int) -> List[int]:
        n = len(weights)
        total_states = 1 << n # 2^n
        matching_masks = []

        for mask in range(total_states):
            current_sum = 0
            for i in range(n):
                if (mask >> i) & 1:
                    current_sum += weights[i]
            
            if current_sum == target:
                matching_masks.append(mask)
                
        return matching_masks
```

---

## 3. 複雜度與防禦要點

### 複雜度分析
*   **時間複雜度**：$\mathcal{O}(N \cdot 2^N)$。共 $2^N$ 個狀態，每個狀態需要 $\mathcal{O}(N)$ 走訪其二進位位元。
*   **空間複雜度**：$\mathcal{O}(1)$（若不計回傳答案所需的儲存空間）。這是位元壓縮最無敵的優勢，相比 DFS 遞迴子集生成，位元遮罩**完全不需要遞迴系統堆疊空間**。

### 防禦性設計與避坑指南
1.  **32 位元整數溢出防範 (Integer Overflow)**:
    在 C++ 與 Java 中，一個標準有號整數（`int`）為 32 位元，最大表示值為 $2^{31}-1 \approx 2 \times 10^9$。
    *   **危險代碼**：`1 << 30` 依然安全，但當 $N \ge 31$ 時，`1 << 31` 就會直接發生符號溢位變成負數，`1 << 32` 會引發 undefined behavior。
    *   **防禦策略**：**當集合大小 $N \ge 31$ 時，必須使用 64 位元長整數進行移位**。
        *   C++: `1LL << k` (LL 字尾代表 `long long`，最高支援到 $N=62$)。
        *   Java: `1L << k` (L 字尾代表 `long`)。
2.  **Java 的無號右移 (`>>>`)**:
    在 Java 中，`>>` 是有號右移（高位補符號位元），而 `>>>` 是無號右移（高位一律補 $0$）。
    *   **防禦策略**：在實作位元遮罩時，我們的 `mask` 一律被視為無符號的狀態字，因此建議使用 `>>>` 或確保 `mask` 為非負整數以防符號位元干擾。
3.  **Python 的無界限整數取反問題 (`~`)**:
    Python 的整數是動態無界限的，因此不存在 32 位元溢出問題，但也因此 `~0` 不會得到 `0xFFFFFFFF`，而是會得到負數 `-1`（補碼表示）。
    *   **防禦策略**：在 Python 中若要限制取反在特定位數 $N$ 內，應主動配合遮罩截斷：`~mask & ((1 << N) - 1)`。
