# 線段樹進階應用 (Segment Tree Extensions)

在進階算法競賽中，線段樹往往會演化出更複雜的高級變體，如**「動態開點線段樹」**與**「線段樹合併」**。

---

## 1. 核心觀念與基本原理

*   **動態開點 (Dynamic Segment Tree)**：
    *   當區間值域極大（如 $N \le 10^9$）且空間限制不允許我們直接開闢 $4 \times N$ 大小的樹形陣列時，我們可以採用動態開點技術。
    *   **延遲分配空間**：只有在被真正造訪或修改的區間節點上，我們才使用 `new` 指標或靜態指標池動態分配空間，未造訪的子節點指標一律指向 null。這能將空間複雜度從原來的 $\mathcal{O}(N)$ 大幅壓縮至僅需 **$\mathcal{O}(Q \log N)$**。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

```cpp
#include <iostream>
using namespace std;

// 動態開點線段樹單點修改與區間求和範本
class DynSegTree {
private:
    struct Node {
        long long val = 0;
        Node* left = nullptr;
        Node* right = nullptr;
    };
    Node* root;
    long long n;
    
    void update(Node*& node, long long start, long long end, long long idx, long long val) {
        if (!node) node = new Node();
        node->val += val;
        if (start == end) return;
        long long mid = start + (end - start) / 2;
        if (idx <= mid) update(node->left, start, mid, idx, val);
        else update(node->right, mid + 1, end, idx, val);
    }
    long long query(Node* node, long long start, long long end, long long l, long long r) {
        if (!node || r < start || end < l) return 0;
        if (l <= start && end <= r) return node->val;
        long long mid = start + (end - start) / 2;
        return query(node->left, start, mid, l, r) + query(node->right, mid + 1, end, l, r);
    }
public:
    DynSegTree(long long n) : n(n) { root = new Node(); }
    void add(long long idx, long long val) { update(root, 0, n - 1, idx, val); }
    long long sum(long long l, long long r) { return query(root, 0, n - 1, l, r); }
};
```

```java
class DynSegTree {
    static class Node {
        long val = 0;
        Node left, right;
    }
    private Node root;
    private long n;
    public DynSegTree(long n) { this.n = n; this.root = new Node(); }
    
    public void add(long idx, long val) { update(root, 0, n - 1, idx, val); }
    
    private void update(Node node, long start, long end, long idx, long val) {
        node.val += val;
        if (start == end) return;
        long mid = start + (end - start) / 2;
        if (idx <= mid) {
            if (node.left == null) node.left = new Node();
            update(node.left, start, mid, idx, val);
        } else {
            if (node.right == null) node.right = new Node();
            update(node.right, mid + 1, end, idx, val);
        }
    }
}
```

```python
class DynSegTree:
    class Node:
        def __init__(self):
            self.val = 0
            self.left = None
            self.right = None
            
    def __init__(self, n):
        self.n = n
        self.root = self.Node()
        
    def add(self, idx, val):
        self._update(self.root, 0, self.n - 1, idx, val)
        
    def _update(self, node, start, end, idx, val):
        node.val += val
        if start == end:
            return
        mid = start + (end - start) // 2
        if idx <= mid:
            if node.left is None:
                node.left = self.Node()
            self._update(node.left, start, mid, idx, val)
        else:
            if node.right is None:
                node.right = self.Node()
            self._update(node.right, mid + 1, end, idx, val)
```

---

## 3. 複雜度與防禦要點
*   **時間與空間複雜度**：時間單次 $\mathcal{O}(\log N)$，空間為 $\mathcal{O}(Q \log N)$，其中 $N$ 可以大至 $10^9$。
*   **防禦要點**：
    *   **記憶體池優化 (Memory Pool)**：在 C++ 中動態 `new` 節點會引發大量記憶體碎片與常數延遲，建議在實戰中使用靜態陣列分配器模擬指標。
