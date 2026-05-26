# 平衡樹與有序集合 (Introduction to Sorted Sets)

在需要進行**動態排序、範圍查詢（如查詢第一個大於等於 $x$ 的元素）**的場景中，基本的 `hashmap` 或 `vector` 將無能為力。

---

## 1. 核心觀念與基本原理

*   **自平衡二叉搜尋樹 (Balanced BST)**：
    有序集合的底層是紅黑樹等平衡樹結構，所有基本操作（插入、刪除、尋找）的時間複雜度皆為穩定優秀的 **$\mathcal{O}(\log N)$**。
*   **迭代器與範圍檢索**：
    動態維護元素的有序性，讓我們能直接使用迭代器雙向搜尋，或是以對數時間查詢某個元素的前驅（Predecessor）與後繼（Successor）節點。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

```cpp
#include <iostream>
#include <set>
using namespace std;

void sorted_sets_demo() {
    set<int> s;
    s.insert(10);
    s.insert(20);
    
    // 尋找第一個大於等於 15 的元素 (Successor)
    auto it = s.lower_bound(15);
    if (it != s.end()) {
        cout << "Successor >= 15: " << *it << endl;
    }
}
```

```java
import java.util.TreeSet;

class SortedSetsDemo {
    public static void demo() {
        TreeSet<Integer> set = new TreeSet<>();
        set.add(10);
        set.add(20);
        
        // 尋找第一個大於等於 15 的元素 (ceiling)
        Integer val = set.ceiling(15);
        if (val != null) {
            System.out.println("Successor >= 15: " + val);
        }
    }
}
```

```python
from bisect import bisect_left

class SortedListDummy:
    def __init__(self):
        # 由於 Python 沒有原生內建的平衡樹結構
        # 我們可用一個保持排序的陣列與 bisect 進行動態二分插值
        self.arr = []
    def add(self, x):
        idx = bisect_left(self.arr, x)
        self.arr.insert(idx, x)
    def ceiling(self, x):
        idx = bisect_left(self.arr, x)
        return self.arr[idx] if idx < len(self.arr) else None
```

---

## 3. 複雜度與防禦要點
*   **時間複雜度**：平衡樹的插入與查找均為 $\mathcal{O}(\log N)$。
*   **防禦要點**：
    *   Python 沒有原生平衡樹。在大量動態插入的題型中，使用 `list.insert()` 會退化成線性時間 $\mathcal{O}(N)$ 導致超時。
    *   **防禦策略**：在 Python 中建議安裝第三方庫 `sortedcontainers` 的 `SortedList`，或手寫 Treep/Splay。
