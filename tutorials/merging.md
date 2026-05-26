# 啟發式合併 (Heuristic Merging / Small-to-Large)

**啟發式合併（Small-to-Large Merging）** 是一種將多個集合動態合併時，透過「將小集合的元素一個個插入大集合中」以保證高效總時間複雜度的進階分治優化技術。

---

## 1. 核心觀念與基本原理

*   **小集合合併入大集合 (Small to Large)**：
    *   假設我們需要動態合併兩個集合 $A$ 與 $B$。
    *   **優化策略**：比較兩者的大小。如果 $|A| < |B|$，我們將 $A$ 中的元素逐一取出插入到 $B$ 中，反之亦然。
*   **對數複雜度保證**：
    *   乍看之下，這種逐個插入的方法非常暴力，但在合併過程中，**任何一個元素每次被移動時，它所在的集合規模都至少會加倍（乘以 2）**。
    *   因為最大規模為 $N$，所以**任何一個元素在整個合併過程中最多只會被移動 $\mathcal{O}(\log N)$ 次**。
    因此，即使使用最暴力的插入，合併 $N$ 個元素的總時間複雜度上限依然被嚴格鎖定在極為優秀的 **$\mathcal{O}(N \log N)$** 或 **$\mathcal{O}(N \log^2 N)$**（依集合插入複雜度而定），這是一個非常神奇且優雅的複雜度分析保證。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

```cpp
#include <vector>
#include <set>
#include <algorithm>
using namespace std;

// 經典應用：動態合併樹上節點的集合 (如求子樹內不同元素的個數)
class SmallToLarge {
private:
    int n;
    vector<vector<int>> adj;
    vector<int> color;
    vector<set<int>> subtree_sets;
    vector<int> ans;
    
    void dfs(int u, int p) {
        subtree_sets[u].insert(color[u]); // 初始化加入自己
        for (int v : adj[u]) {
            if (v == p) continue;
            dfs(v, u);
            // 啟發式合併：小合併入大
            if (subtree_sets[u].size() < subtree_sets[v].size()) {
                swap(subtree_sets[u], subtree_sets[v]); // O(1) 指標指針交換！
            }
            // 逐個插入
            for (int x : subtree_sets[v]) {
                subtree_sets[u].insert(x);
            }
            subtree_sets[v].clear(); // 釋放空間
        }
        ans[u] = subtree_sets[u].size(); // 記錄答案
    }
public:
    SmallToLarge(int n, const vector<int>& col) : n(n), adj(n), color(col), subtree_sets(n), ans(n) {}
    void add_edge(int u, int v) { adj[u].push_back(v); adj[v].push_back(u); }
    vector<int> solve() {
        dfs(0, -1);
        return ans;
    }
};
```

```java
import java.util.*;

class SmallToLarge {
    // 類似的 Set 啟發式合併與 O(1) 參照交換實作
}
```

```python
class SmallToLarge:
    def __init__(self, n, color):
        self.n = n
        self.adj = [[] for _ in range(n)]
        self.color = color
        self.sets = [set() for _ in range(n)]
        self.ans = [0] * n
        
    def add_edge(self, u, v):
        self.adj[u].append(v)
        self.adj[v].append(u)
        
    def dfs(self, u, p):
        self.sets[u].add(self.color[u])
        for v in self.adj[u]:
            if v == p: continue
            self.dfs(v, u)
            # 啟發式合併
            if len(self.sets[u]) < len(self.sets[v]):
                self.sets[u], self.sets[v] = self.sets[v], self.sets[u]
            for x in self.sets[v]:
                self.sets[u].add(x)
            self.sets[v].clear()
        self.ans[u] = len(self.sets[u])
```

---

## 3. 複雜度與防禦要點
*   **時間複雜度**：$\mathcal{O}(N \log^2 N)$（配合 `std::set`）或 $\mathcal{O}(N \log N)$（配合 `std::unordered_set`）。
*   **防禦要點**：
    *   **O(1) 參照交換**：在 swap 交換兩個集合時，在 C++ 中必須使用 `swap(setA, setB)`（它是 $\mathcal{O}(1)$ 指標參照交換）；在 Java / Python 中必須直接交換物件引用參照。**千萬不可手動將大集合複製入小集合**，否則會直接失去啟發式優化保證，退化成 $\mathcal{O}(N^2)$。
