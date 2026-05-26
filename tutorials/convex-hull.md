# 二維凸包 (Convex Hull)

給定二維平面上的點集，**凸包 (Convex Hull)** 是指能包圍所有點的最小凸多邊形。

---

## 1. 核心觀念與基本原理

*   **Andrew 演算法 (Monotone Chain Algorithm) — $\mathcal{O}(N \log N)$**：
    *   Andrew 演算法是 Graham 掃描法的優化變體，實作極為簡單且常數極小。
    *   **排序與雙向掃描**：將點集依照 $x$ 座標從小到大排序（若 $x$ 相同則依 $y$ 排序）。
    *   **叉積與順逆時針判定**：我們維護一個單調棧，依序加入點。如果加入新點與棧頂前兩個點形成「順時針旋轉（右拐）」，說明中間的棧頂點是非凸包點，將其彈出，直到滿足「逆時針旋轉（左拐）」再壓入。
    分別掃描一次「下凸包」與「上凸包」並進行拼接，即可在極佳效率下取得完整凸包頂點集。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

```cpp
#include <vector>
#include <algorithm>
using namespace std;

struct Point {
    long long x, y;
    bool operator<(const Point& other) const {
        if (x != other.x) return x < other.x;
        return y < other.y;
    }
};

// 向量 (A->B) 與 (A->C) 的二維叉積
long long cross_product(const Point& A, const Point& B, const Point& C) {
    return (B.x - A.x) * (C.y - A.y) - (B.y - A.y) * (C.x - A.x);
}

// Andrew 凸包演算法
vector<Point> convex_hull(vector<Point>& pts) {
    int n = pts.size();
    if (n <= 1) return pts;
    sort(pts.begin(), pts.end());
    
    vector<Point> hull;
    // 1. 構建下凸包
    for (int i = 0; i < n; i++) {
        while (hull.size() >= 2 && cross_product(hull[hull.size() - 2], hull.back(), pts[i]) <= 0) {
            hull.pop_back();
        }
        hull.push_back(pts[i]);
    }
    // 2. 構建上凸包
    int lower_size = hull.size();
    for (int i = n - 2; i >= 0; i--) {
        while (hull.size() > lower_size && cross_product(hull[hull.size() - 2], hull.back(), pts[i]) <= 0) {
            hull.pop_back();
        }
        hull.push_back(pts[i]);
    }
    hull.pop_back(); // 移除重複的起點
    return hull;
}
```

```java
import java.util.*;

class ConvexHull {
    static class Point implements Comparable<Point> {
        long x, y;
        Point(long x, long y) { this.x = x; this.y = y; }
        public int compareTo(Point o) {
            if (this.x != o.x) return Long.compare(this.x, o.x);
            return Long.compare(this.y, o.y);
        }
    }
    private static long crossProduct(Point A, Point B, Point C) {
        return (B.x - A.x) * (C.y - A.y) - (B.y - A.y) * (C.x - A.x);
    }
}
```

```python
def cross_product(A, B, C):
    return (B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0])

def convex_hull(pts):
    pts = sorted(pts)
    if len(pts) <= 1:
        return pts
        
    # 下凸包
    lower = []
    for p in pts:
        while len(lower) >= 2 and cross_product(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)
        
    # 上凸包
    upper = []
    for p in reversed(pts):
        while len(upper) >= 2 and cross_product(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)
        
    return lower[:-1] + upper[:-1]
```

---

## 3. 複雜度與防禦要點
*   **時間與空間複雜度**：時間 $\mathcal{O}(N \log N)$，空間 $\mathcal{O}(N)$。
*   **防禦要點**：
    *   **三點共線**：叉積結果為 $0$ 代表三點共線。若題目要求凸包邊上不能包含共線點，需使用 `<= 0` 進行判定過濾。
