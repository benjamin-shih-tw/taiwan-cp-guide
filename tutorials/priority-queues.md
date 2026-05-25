# 優先佇列與二元堆疊 (Priority Queues & Heap)

在程式設計競賽中，當我們面臨需要**動態維護一組資料的極值（最大值或最小值）**，且需要頻繁執行「插入元素」與「查詢/彈出極值」操作時，標準的排序演算法 $\mathcal{O}(N \log N)$ 將會因為高昂的常數與重複計算而超時。此時，**優先佇列 (Priority Queue)** 及其底層的 **二元堆疊 (Binary Heap)** 結構就是我們的首選解決方案。

---

## 1. 核心觀念與基本原理

### 什麼是二元堆疊 (Binary Heap)？
*   **拓撲結構**：二元堆疊是一棵**完全二叉樹 (Complete Binary Tree)**。這意味著除了最後一層外，樹的每一層都是滿的，且最後一層的節點都儘可能靠左排列。
*   **堆疊性質 (Heap Property)**：
    *   **最大堆 (Max-Heap)**：父節點的鍵值大於或等於任何一個子節點的鍵值。因此，**根節點必然是整棵樹的最大值**。
    *   **最小堆 (Min-Heap)**：父節點的鍵值小於或等於任何一個子節點的鍵值。因此，**根節點必然是整棵樹的最小值**。
*   **動態維護的高效性**：
    *   查詢極值：$\mathcal{O}(1)$。
    *   插入新元素：$\mathcal{O}(\log N)$。新節點插入尾端後，透過「向上調整 (Bubble Up / Sift Up)」維護性質。
    *   彈出極值：$\mathcal{O}(\log N)$。將根節點與尾端節點交換並刪除尾端，隨後讓新的根節點「向下調整 (Bubble Down / Sift Down)」重新恢復平衡。

### 經典應用場景
1.  **Dijkstra 最短路徑演算法**：每次動態挑選當前距離最小的未確定頂點進行鬆弛（$\mathcal{O}(\log V)$）。
2.  **動態中位數維護 (對頂堆, Dual Heaps)**：使用一個最大堆維護較小的一半數值，一個最小堆維護較大的一半數值。透過平衡兩堆的大小，可以在 $\mathcal{O}(1)$ 時間內即時獲取動態串流的中位數。
3.  **K 路歸併 (K-way Merge)**：合併 $K$ 個已排序的陣列。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

以下我們以競程經典模板**「動態中位數維護 (Dynamic Median Maintenance / 對頂堆)」**為核心，展示如何使用三種語言的優先佇列 API 進行高效的極值動態維護：

```cpp
// C++ 對頂堆動態中位數維護範本
#include <iostream>
#include <vector>
#include <queue>
#include <functional>

using namespace std;

class MedianFinder {
private:
    // 最大堆（維護較小的一半數，堆頂是較小數的最大值）
    priority_queue<int, vector<int>, less<int>> max_heap;
    // 最小堆（維護較大的一半數，堆頂是較大數的最小值）
    priority_queue<int, vector<int>, greater<int>> min_heap;

public:
    // 動態插入一個新數，時間複雜度 O(log N)
    void add_number(int num) {
        if (max_heap.empty() || num <= max_heap.top()) {
            max_heap.push(num);
        } else {
            min_heap.push(num);
        }

        // 平衡兩堆的大小，確保 max_heap 的數量等於或比 min_heap 多 1
        if (max_heap.size() > min_heap.size() + 1) {
            min_heap.push(max_heap.top());
            max_heap.pop();
        } else if (max_heap.size() < min_heap.size()) {
            max_heap.push(min_heap.top());
            min_heap.pop();
        }
    }

    // 獲取當前中位數，時間複雜度 O(1)
    double get_median() {
        if (max_heap.size() > min_heap.size()) {
            return max_heap.top();
        }
        return max_heap.top() + (min_heap.top() - max_heap.top()) / 2.0;
    }
};
```

```java
// Java 對頂堆動態中位數維護範本
import java.io.*;
import java.util.*;

class MedianFinder {
    // 預設是最小堆，需要指定自訂 Comparator 實作最大堆
    private PriorityQueue<Integer> maxHeap;
    private PriorityQueue<Integer> minHeap;

    public MedianFinder() {
        // 使用 Collections.reverseOrder() 建立最大堆
        this.maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        this.minHeap = new PriorityQueue<>();
    }

    public void addNumber(int num) {
        if (maxHeap.isEmpty() || num <= maxHeap.peek()) {
            maxHeap.offer(num);
        } else {
            minHeap.offer(num);
        }

        // 平衡大小
        if (maxHeap.size() > minHeap.size() + 1) {
            minHeap.offer(maxHeap.poll());
        } else if (maxHeap.size() < minHeap.size()) {
            maxHeap.offer(minHeap.poll());
        }
    }

    public double getMedian() {
        if (maxHeap.size() > minHeap.size()) {
            return maxHeap.peek();
        }
        return maxHeap.peek() + (minHeap.peek() - maxHeap.peek()) / 2.0;
    }
}
```

```python
# Python 對頂堆動態中位數維護範本
import heapq

class MedianFinder:
    def __init__(self):
        # Python 的 heapq 預設僅支援「最小堆」
        # 對於最大堆，我們將數值乘上 -1 儲存，取出來時再乘上 -1 還原
        self.max_heap = [] # 儲存負數
        self.min_heap = []

    def add_number(self, num: int):
        if not self.max_heap or num <= -self.max_heap[0]:
            heapq.heappush(self.max_heap, -num)
        else:
            heapq.heappush(self.min_heap, num)

        # 平衡大小
        if len(self.max_heap) > len(self.min_heap) + 1:
            val = -heapq.heappop(self.max_heap)
            heapq.heappush(self.min_heap, val)
        elif len(self.max_heap) < len(self.min_heap):
            val = heapq.heappop(self.min_heap)
            heapq.heappush(self.max_heap, -val)

    def get_median(self) -> float:
        if len(self.max_heap) > len(self.min_heap):
            return float(-self.max_heap[0])
        return (-self.max_heap[0] + self.min_heap[0]) / 2.0
```

---

## 3. 複雜度與防禦要點

### 複雜度分析
*   **時間複雜度**：
    *   `push` / `pop` 操作：$\mathcal{O}(\log N)$。
    *   `top` / `peek` 查詢極值：$\mathcal{O}(1)$。
    *   建堆操作 (Heapify)：對長度為 $N$ 的陣列一次性建立二元堆疊，時間複雜度為線性 $\mathcal{O}(N)$（而非連續插入的 $\mathcal{O}(N \log N)$）。
*   **空間複雜度**：$\mathcal{O}(N)$。需要開闢陣列/動態容器儲存樹的節點。

### 防禦性設計與避坑指南
1.  **C++ 嚴格弱序限制 (Strict Weak Ordering)**:
    在自訂結構體的比較子時，必須保證當 `a == b` 時，比較子必須回傳 `false`。若回傳了 `true`（例如使用 `<=` 或 `>=`），`std::priority_queue` 在做調整時會陷入死循環或記憶體越界，導致執行期崩潰。
2.  **Python 負數最大堆防溢位與浮點數安全**:
    在 Python 中，使用 `heappush(max_heap, -num)` 來做最大堆時，若 `num` 為極大負整數，取負值 ` -num` 會變成極大正整數。雖然 Python 自動支援無限精度整數，但在涉及浮點數計算時，依然要注意浮點數表示極大值時產生的精度丟失問題。
    *   **防禦策略**：在中位數計算中，使用 `max_heap.top() + (min_heap.top() - max_heap.top()) / 2.0` 代替 `(max_heap.top() + min_heap.top()) / 2.0`。這能防止當兩數均極大時，相加直接產生數值溢位。
3.  **惰性刪除優化 (Lazy Deletion / Heap Pruning)**:
    在圖論算法中，我們常常需要修改堆中某個節點的權值，但標準 API 通常不支援 $\mathcal{O}(\log N)$ 的動態更新或任意元素刪除。
    *   **防禦策略**：不需要真的去堆中搜尋該元素，而是採用**惰性刪除**。直接將更新後的重複節點 `{new_dist, u}` 推入堆中。當從堆頂彈出頂點時，如果發現當前彈出的距離大於其記錄的最短距離（即 `d > dist[u]`），說明該狀態是過期的髒數據，直接 `pop()` 丟棄即可。
