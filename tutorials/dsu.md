# 並查集 (Disjoint Set Union - DSU)

並查集（Disjoint Set Union, DSU，又稱 Union-Find）是一種極度高效的樹形資料結構。它主要用於動態維護若干個不相交的集合，並支援兩大核心操作：**「合併兩個集合 (Union)」**與**「查詢元素屬於哪個集合 (Find)」**。

---

## 1. 核心觀念與基本原理

### 核心操作與優化
每個集合以一棵樹來表示，樹的根節點作為該集合的「代表元 (Representative)」。
1.  **路徑壓縮 (Path Compression)**：在執行 `find(x)` 時，將路徑上所有造訪過的節點直接指向根節點。這樣後續的查詢複雜度會降為常數級 $\mathcal{O}(1)$。
2.  **按秩合併 (Union by Rank/Size)**：將深度較小（或節點數較少）的樹合併到較大樹的根節點下，防止樹退化成一條鏈。

同時採用這兩種優化後，單次操作的均攤時間複雜度僅為 **$\mathcal{O}(\alpha(N))$**，其中 $\alpha(N)$ 是反阿克曼函數（Inverse Ackermann Function），對於所有實際的輸入規模，其值皆小於 $5$，即極接近 $\mathcal{O}(1)$。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

```cpp
#include <vector>
#include <numeric>
using namespace std;

class DSU {
private:
    vector<int> parent, sz;
public:
    DSU(int n) {
        parent.resize(n);
        iota(parent.begin(), parent.end(), 0); // parent[i] = i
        sz.assign(n, 1);
    }
    int find(int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]); // 路徑壓縮
    }
    bool unite(int i, int j) {
        int root_i = find(i);
        int root_j = find(j);
        if (root_i == root_j) return false;
        // 按秩合併
        if (sz[root_i] < sz[root_j]) swap(root_i, root_j);
        parent[root_j] = root_i;
        sz[root_i] += sz[root_j];
        return true;
    }
    int get_size(int i) { return sz[find(i)]; }
};
```

```java
class DSU {
    private int[] parent;
    private int[] sz;
    public DSU(int n) {
        parent = new int[n];
        sz = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            sz[i] = 1;
        }
    }
    public int find(int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]);
    }
    public boolean unite(int i, int j) {
        int rootI = find(i);
        int rootJ = find(j);
        if (rootI == rootJ) return false;
        if (sz[rootI] < sz[rootJ]) {
            int temp = rootI; rootI = rootJ; rootJ = temp;
        }
        parent[rootJ] = rootI;
        sz[rootI] += sz[rootJ];
        return true;
    }
}
```

```python
class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.sz = [1] * n
    def find(self, i):
        if self.parent[i] == i:
            return i
        self.parent[i] = self.find(self.parent[i])
        return self.parent[i]
    def unite(self, i, j):
        root_i = self.find(i)
        root_j = self.find(j)
        if root_i == root_j:
            return False
        if self.sz[root_i] < self.sz[root_j]:
            root_i, root_j = root_j, root_i
        self.parent[root_j] = root_i
        self.sz[root_i] += self.sz[root_j]
        return True
```

---

## 3. 複雜度與防禦要點
*   **時間複雜度**：$\mathcal{O}(\alpha(N))$ 均攤。
*   **空間複雜度**：$\mathcal{O}(N)$。
*   **防禦要點**：
    *   在遞迴 `find` 中忘記將值賦給 `parent[i]`（即漏寫路徑壓縮），會導致複雜度退化成 $\mathcal{O}(N)$。
    *   併查集初始化時，索引大小必須包含 $N$（特別是 1-indexed 圖）。
