# 線段樹 (Segment Tree)

**線段樹 (Segment Tree)** 是一種極為強大且通用的區間資料結構。

---

## 1. 核心觀念與基本原理

它主要解決「區間查詢（如區間和、最大值）」與「區間修改」問題。
*   **結構性質**：將一個區間 $[1, N]$ 分治成二叉樹結構。每個樹節點代表一個子區間。
*   **懶標記懶惰傳播 (Lazy Propagation)**：當我們進行區間修改時，不需要立即遞迴更新到所有葉子節點，而是在被覆蓋的區間節點上打上一個「懶標記 (Lazy tag)」，直到下次訪問該子區間時才向下傳播，從而將區間修改的複雜度最佳化至 **$\mathcal{O}(\log N)$**。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

```cpp
#include <vector>
using namespace std;

class SegTree {
private:
    int n;
    vector<long long> tree, lazy;
    void push(int node, int start, int end) {
        if (lazy[node] == 0) return;
        int mid = (start + end) / 2;
        tree[2 * node] += lazy[node] * (mid - start + 1);
        lazy[2 * node] += lazy[node];
        tree[2 * node + 1] += lazy[node] * (end - mid);
        lazy[2 * node + 1] += lazy[node];
        lazy[node] = 0;
    }
    void update(int node, int start, int end, int l, int r, long long val) {
        if (r < start || end < l) return;
        if (l <= start && end <= r) {
            tree[node] += val * (end - start + 1);
            lazy[node] += val;
            return;
        }
        push(node, start, end);
        int mid = (start + end) / 2;
        update(2 * node, start, mid, l, r, val);
        update(2 * node + 1, mid + 1, end, l, r, val);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }
    long long query(int node, int start, int end, int l, int r) {
        if (r < start || end < l) return 0;
        if (l <= start && end <= r) return tree[node];
        push(node, start, end);
        int mid = (start + end) / 2;
        return query(2 * node, start, mid, l, r) + query(2 * node + 1, mid + 1, end, l, r);
    }
public:
    SegTree(int n) : n(n) {
        tree.assign(4 * n, 0);
        lazy.assign(4 * n, 0);
    }
    void range_add(int l, int r, long long val) { update(1, 0, n - 1, l, r, val); }
    long long range_sum(int l, int r) { return query(1, 0, n - 1, l, r); }
};
```

```java
class SegTree {
    private int n;
    private long[] tree, lazy;
    public SegTree(int n) {
        this.n = n;
        tree = new long[4 * n];
        lazy = new long[4 * n];
    }
    private void push(int node, int start, int end) {
        if (lazy[node] == 0) return;
        int mid = (start + end) / 2;
        tree[2 * node] += lazy[node] * (mid - start + 1);
        lazy[2 * node] += lazy[node];
        tree[2 * node + 1] += lazy[node] * (end - mid);
        lazy[2 * node + 1] += lazy[node];
        lazy[node] = 0;
    }
    public void update(int node, int start, int end, int l, int r, long val) {
        if (r < start || end < l) return;
        if (l <= start && end <= r) {
            tree[node] += val * (end - start + 1);
            lazy[node] += val;
            return;
        }
        push(node, start, end);
        int mid = (start + end) / 2;
        update(2 * node, start, mid, l, r, val);
        update(2 * node + 1, mid + 1, end, l, r, val);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }
    public long query(int node, int start, int end, int l, int r) {
        if (r < start || end < l) return 0;
        if (l <= start && end <= r) return tree[node];
        push(node, start, end);
        int mid = (start + end) / 2;
        return query(2 * node, start, mid, l, r) + query(2 * node + 1, mid + 1, end, l, r);
    }
}
```

```python
class SegTree:
    def __init__(self, n):
        self.n = n
        self.tree = [0] * (4 * n)
        self.lazy = [0] * (4 * n)
        
    def _push(self, node, start, end):
        if self.lazy[node] == 0:
            return
        mid = (start + end) // 2
        self.tree[2 * node] += self.lazy[node] * (mid - start + 1)
        self.lazy[2 * node] += self.lazy[node]
        self.tree[2 * node + 1] += self.lazy[node] * (end - mid)
        self.lazy[2 * node + 1] += self.lazy[node]
        self.lazy[node] = 0

    def update(self, node, start, end, l, r, val):
        if r < start or end < l:
            return
        if l <= start and end <= r:
            self.tree[node] += val * (end - start + 1)
            self.lazy[node] += val
            return
        self._push(node, start, end)
        mid = (start + end) // 2
        self.update(2 * node, start, mid, l, r, val)
        self.update(2 * node + 1, mid + 1, end, l, r, val)
        self.tree[node] = self.tree[2 * node] + self.tree[2 * node + 1]

    def query(self, node, start, end, l, r):
        if r < start or end < l:
            return 0
        if l <= start and end <= r:
            return self.tree[node]
        self._push(node, start, end)
        mid = (start + end) // 2
        return self.query(2 * node, start, mid, l, r) + self.query(2 * node + 1, mid + 1, end, l, r)
```

---

## 3. 複雜度與防禦要點
*   **時間複雜度**：建表 $\mathcal{O}(N)$，區間更新與查詢皆為 $\mathcal{O}(\log N)$。
*   **防禦要點**：
    *   **空間倍數**：線段樹陣列必須開到 **$4 \times N$** 以上，否則容易發生 Out of Bounds 記憶體崩潰。
