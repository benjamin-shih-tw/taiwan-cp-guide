# 樹狀陣列 (Fenwick Tree / Binary Indexed Tree - BIT)

**樹狀陣列（Binary Indexed Tree, BIT）** 是一種以極小常數與極少空間著稱的區間資料結構。

---

## 1. 核心觀念與基本原理

主要用於解決「單點修改、前綴和查詢」問題，且兩者時間複雜度均為 **$\mathcal{O}(\log N)$**。
*   **核心操作 `lowbit`**：`lowbit(x) = x & (-x)`，能提取出整數 $x$ 在二進位表示下最低位元的 $1$ 及其後置的 $0$。
*   **樹狀結構**：每個節點 `tree[x]` 儲存了區間 `[x - lowbit(x) + 1, x]` 的數據總和。這使得前綴查詢與修改都可藉由加減 `lowbit` 進行精確跳轉。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

```cpp
#include <vector>
using namespace std;

class Fenwick {
private:
    int n;
    vector<long long> tree;
    int lowbit(int x) { return x & (-x); }
public:
    Fenwick(int n) : n(n), tree(n + 1, 0) {}
    void add(int i, long long delta) {
        for (; i <= n; i += lowbit(i)) tree[i] += delta;
    }
    long long query(int i) {
        long long sum = 0;
        for (; i > 0; i -= lowbit(i)) sum += tree[i];
        return sum;
    }
    long long range_query(int l, int r) {
        return query(r) - query(l - 1);
    }
};
```

```java
class Fenwick {
    private int n;
    private long[] tree;
    public Fenwick(int n) {
        this.n = n;
        this.tree = new long[n + 1];
    }
    private int lowbit(int x) { return x & (-x); }
    public void add(int i, long delta) {
        for (; i <= n; i += lowbit(i)) tree[i] += delta;
    }
    public long query(int i) {
        long sum = 0;
        for (; i > 0; i -= lowbit(i)) sum += tree[i];
        return sum;
    }
}
```

```python
class Fenwick:
    def __init__(self, n):
        self.n = n
        self.tree = [0] * (n + 1)
    def add(self, i, delta):
        while i <= self.n:
            self.tree[i] += delta
            i += i & (-i)
    def query(self, i):
        s = 0
        while i > 0:
            s += self.tree[i]
            i -= i & (-i)
        return s
```

---

## 3. 複雜度與防禦要點
*   **時間複雜度**：單點修改與查詢均為 $\mathcal{O}(\log N)$。
*   **空間複雜度**：$\mathcal{O}(N)$，僅需 1 倍輔助陣列。
*   **防禦要點**：
    *   **1-Indexed**：樹狀陣列**必須採用 1-based indexing**。若 `i = 0`，`lowbit(0) = 0`，會導致修改與查詢陷入死循環。
