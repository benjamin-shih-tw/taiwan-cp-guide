# 單調棧與單調佇列 (Monotonic Stack & Monotonic Queue)

在演算法設計中，如果我們面臨需要在陣列中尋找「某個元素左邊或右邊第一個比它大（或小）的元素」，或者需要「動態維護滑動視窗中的最大/最小值」，直接使用暴力法會導致 $\mathcal{O}(N^2)$ 或 $\mathcal{O}(N \log K)$ 的高昂時間複雜度。此時，**單調棧 (Monotonic Stack)** 與 **單調佇列 (Monotonic Queue)** 這兩種以線性均攤時間運作的資料結構，便能將複雜度直接優化至絕對高效的 $\mathcal{O}(N)$。

---

## 1. 核心觀念與基本原理

### 什麼是「單調性」資料結構？
這類結構的核心思想是：**主動剔除「永遠不可能成為答案」的髒數據，強制讓容器內部的元素保持嚴格的單調遞增或單調遞減**。

### A. 單調棧 (Monotonic Stack)
*   **定義與原理**：棧內元素從棧底到棧頂保持單調性。
    *   **遞增棧**（小到大）：新元素若比棧頂小，則將棧頂彈出，直到棧頂小於新元素再壓入。主要用於尋找**第一個比自己小的元素**。
    *   **遞減棧**（大到小）：新元素若比棧頂大，則將棧頂彈出，直到棧頂大於新元素再壓入。主要用於尋找**第一個比自己大的元素**（Next Greater Element）。
*   **均攤分析 (Amortized Analysis)**：雖然單次操作可能伴隨多次 `pop()`，但由於每個元素在整個過程中**最多入棧一次、出棧一次**，因此處理 $N$ 個元素的總時間複雜度為嚴格的 $\mathcal{O}(N)$。

### B. 單調佇列 (Monotonic Queue)
*   **定義與原理**：主要用於解決**滑動視窗最值問題**。我們使用**雙端佇列 (Deque)** 來維護視窗內元素的單調性。
*   **維護最大值的邏輯（遞減佇列）**：
    1.  當一個新元素準備從右端進入佇列時，將佇列右端所有「小於或等於」新元素的舊元素全部彈出（因為新元素生存期更長且值更大，舊的小元素已無翻身之日，主動剔除）。
    2.  將新元素從右端推入佇列。
    3.  檢查佇列左端的元素（即當前的最大值）其索引是否已經滑出視窗範圍（若 `index < i - K + 1`，則將其從左端彈出）。
    4.  此時，**佇列左端的元素即為當前視窗的最大值**。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

以下提供解決經典競程題**「滑動視窗最大值 (Sliding Window Maximum)」**的標準 $\mathcal{O}(N)$ 雙端佇列（Deque）實作範本：

```cpp
// C++ 單調佇列滑動視窗最大值範本
#include <iostream>
#include <vector>
#include <deque>

using namespace std;

class SlidingWindow {
public:
    vector<int> max_sliding_window(const vector<int>& nums, int k) {
        int n = nums.size();
        if (n == 0 || k == 0) return {};
        
        vector<int> result;
        deque<int> dq; // 雙端佇列，儲存陣列索引以利邊界判斷

        for (int i = 0; i < n; ++i) {
            // 1. 保持佇列單調性：若新元素大於或等於佇列尾端元素，則將尾端彈出
            while (!dq.empty() && nums[dq.back()] <= nums[i]) {
                dq.pop_back();
            }

            // 2. 將當前元素索引推入佇列右端
            dq.push_back(i);

            // 3. 防禦邊界：移出已經滑出視窗左端邊界 (i - k + 1) 的索引
            if (dq.front() < i - k + 1) {
                dq.pop_front();
            }

            // 4. 當視窗大小已達到 k 時，開始記錄當前視窗的最大值
            if (i >= k - 1) {
                result.push_back(nums[dq.front()]);
            }
        }
        return result;
    }
};
```

```java
// Java 單調佇列滑動視窗最大值範本
import java.io.*;
import java.util.*;

class SlidingWindow {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        if (n == 0 || k == 0) return new int[0];

        int[] result = new int[n - k + 1];
        int idx = 0;
        Deque<Integer> dq = new ArrayDeque<>(); // 儲存陣列索引

        for (int i = 0; i < n; i++) {
            // 1. 維護單調性
            while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[i]) {
                dq.pollLast();
            }

            // 2. 推入索引
            dq.offerLast(i);

            // 3. 移出滑出邊界的索引
            if (dq.peekFirst() < i - k + 1) {
                dq.pollFirst();
            }

            // 4. 寫入結果
            if (i >= k - 1) {
                result[idx++] = nums[dq.peekFirst()];
            }
        }
        return result;
    }
}
```

```python
# Python 單調佇列滑動視窗最大值範本
from collections import deque
from typing import List

class SlidingWindow:
    def max_sliding_window(self, nums: List[int], k: int) -> List[int]:
        n = len(nums)
        if n == 0 or k == 0:
            return []

        result = []
        dq = deque()  # 雙端佇列，儲存陣列索引

        for i in range(n):
            # 1. 維護單調性（由大到小）
            while dq and nums[dq[-1]] <= nums[i]:
                dq.pop()

            # 2. 插入當前索引
            dq.append(i)

            # 3. 檢查左端元素是否滑出視窗範圍
            if dq[0] < i - k + 1:
                dq.popleft()

            # 4. 視窗成型後，左端元素即為最大值
            if i >= k - 1:
                result.append(nums[dq[0]])

        return result
```

---

## 3. 複雜度與防禦要點

### 複雜度分析
*   **時間複雜度**：$\mathcal{O}(N)$。不論滑動視窗大小 $K$ 有多大，每個元素最多經歷一次 `push` 和一次 `pop` 操作，均攤到單次走訪的時間複雜度為 $\mathcal{O}(1)$。
*   **空間複雜度**：$\mathcal{O}(K)$。雙端佇列中最多同時儲存 $K$ 個索引元素。

### 防禦性設計與避坑指南
1.  **為什麼佇列中必須儲存「索引 (Index)」而非「數值 (Value)」？**
    如果佇列中儲存數值，當視窗向右移動時，我們將**無法判定左端最大值是否已經超出了視窗範圍**（因為值本身不包含位置資訊，若陣列中有重複值更會引發邏輯死鎖）。
    *   **防禦策略**：**雙端佇列一律儲存陣列索引 `i`**。在比較時使用 `nums[dq.back()]`，在檢查越界時使用 `dq.front() < i - k + 1`，這是最完美的防禦寫法。
2.  **單調棧中自訂物件與大數溢位防護**:
    在解決如「直方圖中最大矩形 (Largest Rectangle in Histogram)」等單調棧進階題時，我們常常需要將高度與寬度進行累加或相乘。
    *   **防禦策略**：矩形面積計算極易超出 $32$ 位元有號整數的上限。在做 `area = width * height` 乘法運算時，**寬度與高度變數必須預先強制轉型為 $64$ 位元長整數**（C++ 的 `long long`，Java 的 `long`），防止在乘法運算瞬間發生數值溢位。
3.  **Deque 的 Java API 效能避坑**:
    在 Java 中，`LinkedList` 也可以用作 Deque，但由於其底層是雙向鏈結串列，節點記憶體不連續且帶有額外指標開銷，會導致高昂的常數時間與頻繁的 Garbage Collection。
    *   **防禦策略**：**在 Java 競程中，一律使用 `ArrayDeque` 來實作 Deque**。其底層是循環陣列，常數極小，讀寫效能遠勝 `LinkedList`。
