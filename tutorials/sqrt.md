# 根號分治與莫隊演算法 (Sqrt Decomposition & Mo's Algorithm)

**根號分治（Sqrt Decomposition）** 與 **莫隊演算法（Mo's Algorithm）** 是利用 $\mathcal{O}(\sqrt{N})$ 區間分塊進行高效區間離線查詢的經典優化技術。

---

## 1. 核心觀念與基本原理

*   **莫隊演算法 (Mo's Algorithm) — $\mathcal{O}(N \sqrt{N})$**：
    *   主要用於**離線區間查詢**。
    *   **分塊排序**：將整個長度為 $N$ 的數組分成 $\sqrt{N}$ 個區間塊。將所有的詢問區間 $[L, R]$ 依照「$L$ 所在的塊編號」從小到大排序；若在同一個塊中，則依照「$R$ 的值」從小到大排序（可使用奇偶排序優化常數）。
    *   **指標暴力跳躍**：排序後，維護區間的左右端點指標 $curL$ 與 $curR$。在詢問間轉移時，指標每次移動一格，動態 `add(x)` 或 `remove(x)` 元素。
    由於排序保證了指標移動的總步數在最壞情況下不超過 **$\mathcal{O}(N \sqrt{N})$**，效率極高。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

```cpp
#include <vector>
#include <cmath>
#include <algorithm>
using namespace std;

struct Query {
    int l, r, id, block;
    bool operator<(const Query& other) const {
        if (block != other.block) return block < other.block;
        return (block & 1) ? r < other.r : r > other.r; // 奇偶化優化
    }
};

// 範例：離線查詢區間內不同元素的個數
vector<int> solve_mos(int n, const vector<int>& a, vector<Query>& queries) {
    int q = queries.size();
    int block_size = sqrt(n);
    for (int i = 0; i < q; i++) {
        queries[i].block = queries[i].l / block_size;
    }
    sort(queries.begin(), queries.end());
    
    vector<int> cnt(1000005, 0); // 頻率表
    int unique_elements = 0;
    
    auto add = [&](int idx) {
        if (cnt[a[idx]] == 0) unique_elements++;
        cnt[a[idx]]++;
    };
    auto remove = [&](int idx) {
        cnt[a[idx]]--;
        if (cnt[a[idx]] == 0) unique_elements--;
    };
    
    vector<int> ans(q);
    int cur_l = 0, cur_r = -1;
    for (const auto& qry : queries) {
        while (cur_r < qry.r) add(++cur_r);
        while (cur_r > qry.r) remove(cur_r--);
        while (cur_l < qry.l) remove(cur_l++);
        while (cur_l > qry.l) add(--cur_l);
        ans[qry.id] = unique_elements;
    }
    return ans;
}
```

```java
import java.util.*;

class MosAlgorithm {
    static class Query implements Comparable<Query> {
        int l, r, id, block;
        Query(int l, int r, int id, int blockSize) {
            this.l = l; this.r = r; this.id = id;
            this.block = l / blockSize;
        }
        public int compareTo(Query o) {
            if (this.block != o.block) return Integer.compare(this.block, o.block);
            return (this.block % 2 == 1) ? Integer.compare(this.r, o.r) : Integer.compare(o.r, this.r);
        }
    }
}
```

```python
import math

def solve_mos(n, a, queries_raw):
    block_size = int(math.sqrt(n)) or 1
    # queries_raw = (l, r, id)
    queries = sorted(
        [(l, r, q_id, l // block_size) for l, r, q_id in queries_raw],
        key=lambda x: (x[3], x[1] if x[3] % 2 else -x[1])
    )
    
    cnt = [0] * 1000005
    unique_elements = 0
    ans = [0] * len(queries_raw)
    
    cur_l, cur_r = 0, -1
    for l, r, q_id, _ in queries:
        while cur_r < r:
            cur_r += 1
            val = a[cur_r]
            if cnt[val] == 0: unique_elements += 1
            cnt[val] += 1
        while cur_r > r:
            val = a[cur_r]
            cnt[val] -= 1
            if cnt[val] == 0: unique_elements -= 1
            cur_r -= 1
        while cur_l < l:
            val = a[cur_l]
            cnt[val] -= 1
            if cnt[val] == 0: unique_elements -= 1
            cur_l += 1
        while cur_l > l:
            cur_l -= 1
            val = a[cur_l]
            if cnt[val] == 0: unique_elements += 1
            cnt[val] += 1
        ans[q_id] = unique_elements
    return ans
```

---

## 3. 複雜度與防禦要點
*   **時間複雜度**：$\mathcal{O}((N + Q) \sqrt{N})$。
*   **防禦要點**：
    *   **莫隊不支援線上修改**：莫隊純粹是**離線演算法**（若要支援修改必須使用帶修改莫隊，引入時間維度，時間複雜度退化為 $\mathcal{O}(N^{5/3})$）。
