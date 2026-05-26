# 斜率優化 (Convex Hull Trick / Slope Optimization)

**斜率優化（Convex Hull Trick）** 是一種將一維 DP 的 $\mathcal{O}(N^2)$ 狀態轉移，優化至高效 **$\mathcal{O}(N)$ 或 $\mathcal{O}(N \log N)$** 的幾何優化技術。

---

## 1. 核心觀念與基本原理

*   **轉移方程與直線方程式**：
    對於許多 1D DP 問題，其狀態轉移方程通常具有如下形式：
    $$dp[i] = \min_{j < i} (dp[j] - a[i] \cdot b[j] + C)$$
    若我們將與 $j$ 相關的狀態寫成直線方程式 $y = m_j \cdot x + c_j$，其中 $x = a[i]$，斜率 $m_j = -b[j]$，截距 $c_j = dp[j]$。這時，**求 $dp[i]$ 就等價於在一個已知的直線集合中，求在橫座標 $x$ 時的最低縱座標 $y$**。
*   **凸包維護 (Convex Hull Trick)**：
    *   如果直線斜率具有單調性，我們可以用雙端佇列 (Deque) 維護凸包的下邊界。
    *   利用「相交點」或「斜率判定」，在佇列中剔除被其他直線覆蓋無用的直線。
    這使轉移的代價從線性掃描降為極限的 $\mathcal{O}(1)$！

---

## 2. 三種語言實作範本 (C++ / Java / Python)

```cpp
#include <vector>
#include <deque>
using namespace std;

struct Line {
    long long m, c; // y = m*x + c
    long long eval(long long x) { return m * x + c; }
};

// 判斷當線 L3 加入時，L2 是否已經無用
bool is_useless(const Line& L1, const Line& L2, const Line& L3) {
    return (double)(L2.c - L1.c) / (L1.m - L2.m) >= (double)(L3.c - L2.c) / (L2.m - L3.m);
}

class ConvexHullTrick {
private:
    deque<Line> dq;
public:
    // 動態加入一條斜率單調遞減的直線
    void add_line(long long m, long long c) {
        Line cur = {m, c};
        while (dq.size() >= 2 && is_useless(dq[dq.size() - 2], dq.back(), cur)) {
            dq.pop_back();
        }
        dq.push_back(cur);
    }
    // 查詢 x 座標下的極小值 (要求 x 單調遞增)
    long long query(long long x) {
        while (dq.size() >= 2 && dq[0].eval(x) >= dq[1].eval(x)) {
            dq.pop_front();
        }
        return dq[0].eval(x);
    }
};
```

```java
import java.util.*;

class ConvexHullTrick {
    static class Line {
        long m, c;
        Line(long m, long c) { this.m = m; this.c = c; }
        long eval(long x) { return m * x + c; }
    }
}
```

```python
class ConvexHullTrick:
    def __init__(self):
        self.dq = []
        
    def _is_useless(self, L1, L2, L3):
        return (L2.c - L1.c) * (L2.m - L3.m) >= (L3.c - L2.c) * (L1.m - L2.m)
        
    def add_line(self, m, c):
        class Line:
            def __init__(self, m, c):
                self.m = m
                self.c = c
            def eval(self, x):
                return self.m * x + self.c
        cur = Line(m, c)
        while len(self.dq) >= 2 and self._is_useless(self.dq[-2], self.dq[-1], cur):
            self.dq.pop()
        self.dq.append(cur)
        
    def query(self, x):
        while len(self.dq) >= 2 and self.dq[0].eval(x) >= self.dq[1].eval(x):
            self.dq.pop(0)
        return self.dq[0].eval(x)
```

---

## 3. 複雜度與防禦要點
*   **時間複雜度**：單次加入與查詢均為 $\mathcal{O}(1)$ 均攤。
*   **防禦要點**：
    *   **雙重單調性**：上述模板要求**斜率 $m$ 必須單調**且**查詢點 $x$ 必須單調**。若不具單調性，則不能使用 Deque 單調維護，必須使用李超線段樹 (Li Chao Tree) 或 CDQ 分治。
