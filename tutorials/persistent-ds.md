# 可持久化資料結構與主席樹 (Persistent Data Structures & Persistent Segment Tree)

在競賽程式中，**可持久化 (Persistency)** 代表一種能夠在修改後依舊保留歷史版本，並支援對任何歷史版本進行查詢與修改的頂級資料結構設計。其中最經典、最常用且威力強大的就是 **可持久化線段樹 (Persistent Segment Tree)**，在台灣與中國競賽界被通俗地稱為 **「主席樹」**。

---

## 1. 核心觀念與基本原理

*   **何謂可持久化**：
    普通的資料結構在修改後舊版資訊就會被覆蓋。而可持久化資料結構能保存所有歷史版本。
    *   **部分可持久化 (Partially Persistent)**：所有版本均可查詢，但只有最新版本可修改。
    *   **完全可持久化 (Fully Persistent)**：所有歷史版本均可查詢，也均可在任何歷史版本上進行修改分支。
*   **主席樹（可持久化線段樹）的指針與節點共用機制**：
    線段樹每次進行「單點修改」時，在高度為 $\log N$ 的樹中，**只有一條從根到被修改葉節點的長度為 $\log N$ 的路徑上的節點會被改變**。
    *   **節點新建與指針共用**：
        我們不需要拷貝整棵樹，而是僅新建這 $\log N$ 個受影響的節點。對於那些沒有改變的子樹，我們直接將新節點的子指針（左子或右子）**指向前一版本的對應節點**。
    *   每次修改會增加 $\mathcal{O}(\log N)$ 的空間，並產生一個新的**根節點指針**。
*   **經典應用：區間第 $k$ 大 (Range K-th Smallest Query)**：
    *   給定長度為 $N$ 的數組，求任意區間 $[L, R]$ 內的第 $k$ 小數值。
    *   做法：先離散化。依序將數組從第 1 個到第 $N$ 個元素插入主席樹（插入相當於該數值頻率 $+1$），得到 $N$ 個版本。
    *   區間 $[L, R]$ 的資訊等同於「版本 $R$」減去「版本 $L-1$」的差分樹。在差分樹上進行二分搜尋即可在 $\mathcal{O}(\log N)$ 內精確找出第 $k$ 小。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

以下實作示範：建構一個主席樹，支援單點修改與區間求和（完全可持久化）。

### C++ 實作範本

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

class PersistentSegmentTree {
private:
    struct Node {
        int lc = 0; // 左子節點編號
        int rc = 0; // 右子節點編號
        long long sum = 0;
    };

    int n;
    int node_cnt;
    vector<Node> t;
    vector<int> roots; // 保存每個版本的根節點編號

    // 單點修改：返回新建立的節點編號
    int update(int prev_node, int l, int r, int idx, long long val) {
        int curr_node = ++node_cnt;
        t[curr_node] = t[prev_node]; // 先拷貝前一版本的節點

        if (l == r) {
            t[curr_node].sum += val;
            return curr_node;
        }

        int mid = l + (r - l) / 2;
        if (idx <= mid) {
            t[curr_node].lc = update(t[prev_node].lc, l, mid, idx, val);
        } else {
            t[curr_node].rc = update(t[prev_node].rc, mid + 1, r, idx, val);
        }
        t[curr_node].sum = t[t[curr_node].lc].sum + t[t[curr_node].rc].sum;
        return curr_node;
    }

    // 區間查詢
    long long query(int node, int l, int r, int ql, int qr) {
        if (!node || ql > r || qr < l) return 0;
        if (ql <= l && r <= qr) return t[node].sum;
        int mid = l + (r - l) / 2;
        return query(t[node].lc, l, mid, ql, qr) + query(t[node].rc, mid + 1, r, ql, qr);
    }

public:
    // n: 區間長度, q: 預估修改次數 (空間分配預估為 (n + q * log(n)) * 2)
    PersistentSegmentTree(int n, int q) : n(n), node_cnt(0) {
        int max_nodes = n * 4 + q * 40; // 安全的節點分配空間
        t.resize(max_nodes);
        roots.push_back(0); // 版本 0 的根為 0
    }

    // 在指定版本 prev_ver 的基礎上，將 idx 位置增加 val，生成一個新版本
    void modify(int prev_ver, int idx, long long val) {
        int new_root = update(roots[prev_ver], 1, n, idx, val);
        roots.push_back(new_root);
    }

    // 查詢版本 ver 中區間 [ql, qr] 的和
    long long query_sum(int ver, int ql, int qr) {
        return query(roots[ver], 1, n, ql, qr);
    }

    int get_latest_version() {
        return roots.size() - 1;
    }
};
```

### Java 實作範本

```java
import java.util.*;

public class PersistentSegmentTree {
    public static class Node {
        int lc = 0;
        int rc = 0;
        long sum = 0;
    }

    private int n;
    private int nodeCnt;
    private Node[] t;
    private List<Integer> roots;

    public PersistentSegmentTree(int n, int q) {
        this.n = n;
        this.nodeCnt = 0;
        int maxNodes = n * 4 + q * 40;
        this.t = new Node[maxNodes];
        for (int i = 0; i < maxNodes; i++) {
            t[i] = new Node();
        }
        this.roots = new ArrayList<>();
        roots.add(0); // 版本 0
    }

    private int update(int prevNode, int l, int r, int idx, long val) {
        int currNode = ++nodeCnt;
        t[currNode].lc = t[prevNode].lc;
        t[currNode].rc = t[prevNode].rc;
        t[currNode].sum = t[prevNode].sum;

        if (l == r) {
            t[currNode].sum += val;
            return currNode;
        }

        int mid = l + (r - l) / 2;
        if (idx <= mid) {
            t[currNode].lc = update(t[prevNode].lc, l, mid, idx, val);
        } else {
            t[currNode].rc = update(t[prevNode].rc, mid + 1, r, idx, val);
        }
        t[currNode].sum = t[t[currNode].lc].sum + t[t[currNode].rc].sum;
        return currNode;
    }

    private long query(int node, int l, int r, int ql, int qr) {
        if (node == 0 || ql > r || qr < l) return 0;
        if (ql <= l && r <= qr) return t[node].sum;
        int mid = l + (r - l) / 2;
        return query(t[node].lc, l, mid, ql, qr) + query(t[node].rc, mid + 1, r, ql, qr);
    }

    public void modify(int prevVer, int idx, long val) {
        int newRoot = update(roots.get(prevVer), 1, n, idx, val);
        roots.add(newRoot);
    }

    public long querySum(int ver, int ql, int qr) {
        return query(roots.get(ver), 1, n, ql, qr);
    }

    public int getLatestVersion() {
        return roots.size() - 1;
    }
}
```

### Python 實作範本

```python
class Node:
    def __init__(self):
        self.lc = 0
        self.rc = 0
        self.sum = 0

class PersistentSegmentTree:
    def __init__(self, n, q):
        self.n = n
        self.node_cnt = 0
        # 預先分配空間以提高 Python 效率
        max_nodes = n * 4 + q * 40
        self.t = [Node() for _ in range(max_nodes)]
        self.roots = [0]

    def _update(self, prev_node, l, r, idx, val):
        self.node_cnt += 1
        curr_node = self.node_cnt
        
        # 拷貝舊節點
        self.t[curr_node].lc = self.t[prev_node].lc
        self.t[curr_node].rc = self.t[prev_node].rc
        self.t[curr_node].sum = self.t[prev_node].sum

        if l == r:
            self.t[curr_node].sum += val
            return curr_node

        mid = l + (r - l) // 2
        if idx <= mid:
            self.t[curr_node].lc = self._update(self.t[prev_node].lc, l, mid, idx, val)
        else:
            self.t[curr_node].rc = self._update(self.t[prev_node].rc, mid + 1, r, idx, val)
            
        lc = self.t[curr_node].lc
        rc = self.t[curr_node].rc
        self.t[curr_node].sum = self.t[lc].sum + self.t[rc].sum
        return curr_node

    def _query(self, node, l, r, ql, qr):
        if node == 0 or ql > r or qr < l:
            return 0
        if ql <= l and r <= qr:
            return self.t[node].sum
        mid = l + (r - l) // 2
        return self._query(self.t[node].lc, l, mid, ql, qr) + self._query(self.t[node].rc, mid + 1, r, ql, qr)

    def modify(self, prev_ver, idx, val):
        new_root = self._update(self.roots[prev_ver], 1, self.n, idx, val)
        self.roots.append(new_root)

    def query_sum(self, ver, ql, qr):
        return self._query(self.roots[ver], 1, self.n, ql, qr)

    def get_latest_version(self):
        return len(self.roots) - 1
```

---

## 3. 複雜度與防禦要點

*   **時間複雜度**：
    每次單點修改/區間查詢的時間複雜度均為完美的 $\mathcal{O}(\log N)$。
*   **空間複雜度**：
    每次修改新增 $\mathcal{O}(\log N)$ 個節點。若總共進行 $M$ 次修改，則空間複雜度為 $\mathcal{O}(N + M \log N)$。
*   **防禦要點**：
    *   **動態開點與陣列大小分配**：
        可持久化線段樹是動態開點的。**嚴禁使用傳統線段樹的 `4 * N` 空間！**
        如果進行了 $M$ 次修改，必須預留 `4 * N + M * (log N + 2)` 的節點陣列空間，否則在大量修改時會瞬間發生越界錯誤（RE / Segment fault）。
    *   **版本索引越界防禦**：
        每次 modify 後會產生新版本。在 query 時必須嚴格確認所查詢的 `ver` 索引是否在 `[0, roots.size() - 1]` 內，防止對未初始化或不存在的歷史版本進行存取。
