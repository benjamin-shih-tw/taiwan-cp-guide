# 動態樹 (Link-Cut Tree - LCT)

**Link-Cut Tree (LCT)** 是由 Sleator 和 Tarjan 提出的一種頂級動態樹狀結構。它用來維護一個由若干棵樹組成的**森林**，並能在 $\mathcal{O}(\log N)$ 均攤時間內完成加邊、刪邊、路徑極值查詢、路徑求和、連通性判斷等極其複雜的動態樹上操作。

---

## 1. 核心觀念與基本原理

*   **實鏈剖分 (Preferred Path Decomposition)**：
    *   LCT 將原樹中的邊分為**實邊 (Preferred Edge)** 與**虛邊 (Normal Edge)**。
    *   每個節點最多只能與一個子節點連實邊。這樣原樹就被剖分成若干條互不相交的**實鏈 (Preferred Paths)**。
*   **輔助樹 (Auxiliary Tree - Splay Tree)**：
    *   每條實鏈都用一棵 **Splay Tree (伸展樹)** 來維護。
    *   Splay Tree 中的節點以在原樹中的**深度 (Depth)** 為鍵值（Key），也就是說，中序走訪這棵 Splay 得到的節點順序，正好對應實鏈中由淺到深的節點順序。
    *   **虛邊關係**：Splay Tree 的根節點的父指針指向該實鏈頂端節點在原樹中的父節點，但該父節點的左右子指針並不指向這棵 Splay Tree 的根。這被稱為「認父不認子」的虛指針。
*   **核心操作 `access(x)`**：
    *   `access(x)` 是 LCT 的靈魂。它的功能是打通一條從原樹根節點到節點 $x$ 的全實鏈，使 $x$ 成為對應 Splay Tree 中深度最大的節點（即沒有右子樹）。
    *   步驟：自底向上，將 $x$ 旋轉到當前 Splay Tree 的根，切斷右子樹（原本較深的子節點），並將其父節點指針指向更高的實鏈，重疊連接，直到到達原樹根。
*   **其他基礎操作**：
    *   `makeroot(x)`：使 $x$ 成為原樹的根。先 `access(x)`，然後 `splay(x)`，最後將 $x$ 的子節點翻轉（打上 `rev` 標記）。
    *   `findroot(x)`：尋找 $x$ 所在原樹的根節點。先 `access(x)`，`splay(x)`，然後一直往左子樹走到底即可。
    *   `link(x, y)`：在 $x, y$ 之間連邊。`makeroot(x)`，然後將 $x$ 的父指針指向 $y$。
    *   `cut(x, y)`：刪除 $x, y$ 之間的邊。`makeroot(x)`，`access(y)`，`splay(y)`。如果 $x$ 是 $y$ 的左子節點且沒有右子節點，則將雙方的指針清空。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

以下實作示範：維護動態樹上的路徑 XOR 異或和。

### C++ 實作範本

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

class LinkCutTree {
private:
    struct Node {
        int ch[2] = {0, 0};
        int p = 0;
        int val = 0;
        int sum = 0;
        bool rev = false;
    };

    vector<Node> t;

    // 判斷是否為當前 Splay Tree 的根 (父節點的左右子節點都不指向自己，則為根)
    bool is_root(int x) {
        return t[t[x].p].ch[0] != x && t[t[x].p].ch[1] != x;
    }

    void push_up(int x) {
        t[x].sum = t[t[x].ch[0]].sum ^ t[t[x].ch[1]].sum ^ t[x].val;
    }

    void push_down(int x) {
        if (t[x].rev) {
            swap(t[x].ch[0], t[x].ch[1]);
            if (t[x].ch[0]) t[t[x].ch[0]].rev ^= 1;
            if (t[x].ch[1]) t[t[x].ch[1]].rev ^= 1;
            t[x].rev = false;
        }
    }

    // 遞迴下傳標記
    void push_all(int x) {
        if (!is_root(x)) push_all(t[x].p);
        push_down(x);
    }

    void rotate(int x) {
        int y = t[x].p, z = t[y].p;
        int k = (t[y].ch[1] == x);
        if (!is_root(y)) t[z].ch[t[z].ch[1] == y] = x;
        t[x].p = z;
        t[y].ch[k] = t[x].ch[k ^ 1];
        if (t[x].ch[k ^ 1]) t[t[x].ch[k ^ 1]].p = y;
        t[x].ch[k ^ 1] = y;
        t[y].p = x;
        push_up(y);
        push_up(x);
    }

    void splay(int x) {
        push_all(x);
        while (!is_root(x)) {
            int y = t[x].p, z = t[y].p;
            if (!is_root(y)) {
                if ((t[y].ch[1] == x) ^ (t[z].ch[1] == y)) rotate(x);
                else rotate(y);
            }
            rotate(x);
        }
    }

public:
    LinkCutTree(int n) {
        t.resize(n + 1);
    }

    void set_value(int x, int v) {
        splay(x);
        t[x].val = v;
        push_up(x);
    }

    // 將根到 x 的路徑變為實鏈，並使 x 成為 Splay Tree 的根
    void access(int x) {
        for (int t_node = 0; x; t_node = x, x = t[x].p) {
            splay(x);
            t[x].ch[1] = t_node;
            push_up(x);
        }
    }

    void make_root(int x) {
        access(x);
        splay(x);
        t[x].rev ^= 1;
    }

    int find_root(int x) {
        access(x);
        splay(x);
        while (t[x].ch[0]) {
            push_down(x);
            x = t[x].ch[0];
        }
        splay(x);
        return x;
    }

    void split(int x, int y) {
        make_root(x);
        access(y);
        splay(y);
    }

    void link(int x, int y) {
        make_root(x);
        if (find_root(y) != x) {
            t[x].p = y;
        }
    }

    void cut(int x, int y) {
        make_root(x);
        if (find_root(y) == x && t[y].p == x && !t[y].ch[0]) {
            t[y].p = t[x].ch[1] = 0;
            push_up(x);
        }
    }

    int query_path(int x, int y) {
        split(x, y);
        return t[y].sum;
    }
};
```

### Java 實作範本

```java
public class LinkCutTree {
    public static class Node {
        int[] ch = new int[2];
        int p = 0;
        int val = 0;
        int sum = 0;
        boolean rev = false;
    }

    private Node[] t;

    public LinkCutTree(int n) {
        t = new Node[n + 1];
        for (int i = 0; i <= n; i++) {
            t[i] = new Node();
        }
    }

    private boolean isRoot(int x) {
        return t[t[x].p].ch[0] != x && t[t[x].p].ch[1] != x;
    }

    private void pushUp(int x) {
        t[x].sum = t[t[x].ch[0]].sum ^ t[t[x].ch[1]].sum ^ t[x].val;
    }

    private void pushDown(int x) {
        if (t[x].rev) {
            int temp = t[x].ch[0];
            t[x].ch[0] = t[x].ch[1];
            t[x].ch[1] = temp;
            if (t[x].ch[0] != 0) t[t[x].ch[0]].rev ^= true;
            if (t[x].ch[1] != 0) t[t[x].ch[1]].rev ^= true;
            t[x].rev = false;
        }
    }

    private void pushAll(int x) {
        if (!isRoot(x)) pushAll(t[x].p);
        pushDown(x);
    }

    private void rotate(int x) {
        int y = t[x].p, z = t[y].p;
        int k = (t[y].ch[1] == x) ? 1 : 0;
        if (!isRoot(y)) {
            t[z].ch[t[z].ch[1] == y ? 1 : 0] = x;
        }
        t[x].p = z;
        t[y].ch[k] = t[x].ch[k ^ 1];
        if (t[x].ch[k ^ 1] != 0) t[t[x].ch[k ^ 1]].p = y;
        t[x].ch[k ^ 1] = y;
        t[y].p = x;
        pushUp(y);
        pushUp(x);
    }

    private void splay(int x) {
        pushAll(x);
        while (!isRoot(x)) {
            int y = t[x].p, z = t[y].p;
            if (!isRoot(y)) {
                if ((t[y].ch[1] == x) ^ (t[z].ch[1] == y)) rotate(x);
                else rotate(y);
            }
            rotate(x);
        }
    }

    public void setVal(int x, int v) {
        splay(x);
        t[x].val = v;
        pushUp(x);
    }

    public void access(int x) {
        for (int tNode = 0; x != 0; tNode = x, x = t[x].p) {
            splay(x);
            t[x].ch[1] = tNode;
            pushUp(x);
        }
    }

    public void makeRoot(int x) {
        access(x);
        splay(x);
        t[x].rev ^= true;
    }

    public int findRoot(int x) {
        access(x);
        splay(x);
        while (t[x].ch[0] != 0) {
            pushDown(x);
            x = t[x].ch[0];
        }
        splay(x);
        return x;
    }

    public void split(int x, int y) {
        makeRoot(x);
        access(y);
        splay(y);
    }

    public void link(int x, int y) {
        makeRoot(x);
        if (findRoot(y) != x) {
            t[x].p = y;
        }
    }

    public void cut(int x, int y) {
        makeRoot(x);
        if (findRoot(y) == x && t[y].p == x && t[y].ch[0] == 0) {
            t[y].p = 0;
            t[x].ch[1] = 0;
            pushUp(x);
        }
    }

    public int queryPath(int x, int y) {
        split(x, y);
        return t[y].sum;
    }
}
```

### Python 實作範本

```python
class Node:
    def __init__(self):
        self.ch = [0, 0]
        self.p = 0
        self.val = 0
        self.sum = 0
        self.rev = False

class LinkCutTree:
    def __init__(self, n):
        self.t = [Node() for _ in range(n + 1)]

    def is_root(self, x):
        p = self.t[x].p
        return self.t[p].ch[0] != x and self.t[p].ch[1] != x

    def push_up(self, x):
        lc = self.t[x].ch[0]
        rc = self.t[x].ch[1]
        self.t[x].sum = self.t[lc].sum ^ self.t[rc].sum ^ self.t[x].val

    def push_down(self, x):
        if self.t[x].rev:
            self.t[x].ch[0], self.t[x].ch[1] = self.t[x].ch[1], self.t[x].ch[0]
            lc = self.t[x].ch[0]
            rc = self.t[x].ch[1]
            if lc:
                self.t[lc].rev = not self.t[lc].rev
            if rc:
                self.t[rc].rev = not self.t[rc].rev
            self.t[x].rev = False

    def push_all(self, x):
        if not self.is_root(x):
            self.push_all(self.t[x].p)
        self.push_down(x)

    def rotate(self, x):
        y = self.t[x].p
        z = self.t[y].p
        k = int(self.t[y].ch[1] == x)
        if not self.is_root(y):
            self.t[z].ch[int(self.t[z].ch[1] == y)] = x
        self.t[x].p = z
        self.t[y].ch[k] = self.t[x].ch[k ^ 1]
        if self.t[x].ch[k ^ 1]:
            self.t[self.t[x].ch[k ^ 1]].p = y
        self.t[x].ch[k ^ 1] = y
        self.t[y].p = x
        self.push_up(y)
        self.push_up(x)

    def splay(self, x):
        self.push_all(x)
        while not self.is_root(x):
            y = self.t[x].p
            z = self.t[y].p
            if not self.is_root(y):
                if (self.t[y].ch[1] == x) ^ (self.t[z].ch[1] == y):
                    self.rotate(x)
                else:
                    self.rotate(y)
            self.rotate(x)

    def set_value(self, x, v):
        self.splay(x)
        self.t[x].val = v
        self.push_up(x)

    def access(self, x):
        t_node = 0
        curr = x
        while curr:
            self.splay(curr)
            self.t[curr].ch[1] = t_node
            self.push_up(curr)
            t_node = curr
            curr = self.t[curr].p

    def make_root(self, x):
        self.access(x)
        self.splay(x)
        self.t[x].rev = not self.t[x].rev

    def find_root(self, x):
        self.access(x)
        self.splay(x)
        while self.t[x].ch[0]:
            self.push_down(x)
            x = self.t[x].ch[0]
        self.splay(x)
        return x

    def split(self, x, y):
        self.make_root(x)
        self.access(y)
        self.splay(y)

    def link(self, x, y):
        self.make_root(x)
        if self.find_root(y) != x:
            self.t[x].p = y

    def cut(self, x, y):
        self.make_root(x)
        if self.find_root(y) == x and self.t[y].p == x and not self.t[y].ch[0]:
            self.t[y].p = 0
            self.t[x].ch[1] = 0
            self.push_up(x)

    def query_path(self, x, y):
        self.split(x, y)
        return self.t[y].sum
```

---

## 3. 複雜度與防禦要點

*   **時間複雜度**：加邊、刪邊與路徑查詢在均攤分析（Amortized Analysis）下皆為極致的 $\mathcal{O}(\log N)$。這是基於 Splay Tree 均攤特性的巧妙結合。
*   **防禦要點**：
    *   **雙向翻轉標記 `push_down`**：
        任何改變輔助樹中序走訪順序的操作（例如 `make_root`），都會打上翻轉標記 `rev`。
        **關鍵**：在進行任何子節點移動（例如 `rotate`, `splay`, 以及往下遍歷子樹）前，必須即時下傳 `rev` 標記，否則會出現左右子節點物理混亂、中序排序錯誤，造成整個樹結構失真崩潰。
    *   **虛指針判斷 `is_root`**：
        若某節點的父節點的左子與右子指針都不是該節點自己，說明它是其所在 Splay Tree 的根（它的父指針是虛指針，指向更高的實鏈）。此時進行 `rotate` 與 `splay` 時不能嘗試去修改父節點的子節點指針，以免破壞虛指針。
