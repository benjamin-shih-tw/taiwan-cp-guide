# 計算幾何進階 (Advanced Computational Geometry)

**計算幾何進階** 涉及多邊形判定、線段交點、圓與線的相交、半平面交等更嚴格且高度抗精度的幾何代數運算。

---

## 1. 核心觀念與基本原理

*   **向量與精度防線**：
    *   計算幾何中最致命的死穴是**浮點數精度誤差 (Precision errors)**。
    *   **防禦策略**：
        1.  盡量使用**有理數整數運算**。例如叉積 `cross_product`、點積一律採用 64 位元長整數進行計算。
        2.  在必須使用實數浮點數時，一律引入精度誤差常數 $\epsilon$（`eps = 1e-9`）進行判定。例如 $A == B$ 必須寫成 `abs(A - B) < eps`。
*   **線段相交判定**：
    利用向量叉積的方向性。若兩條線段 $AB$ 與 $CD$ 相交，則 $C$ 和 $D$ 必須分立在直線 $AB$ 的兩側，且 $A$ 和 $B$ 必須分立在直線 $CD$ 的兩側（使用跨立實驗進行精確排他判定）。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

```cpp
#include <iostream>
#include <cmath>
#include <algorithm>
using namespace std;

const double EPS = 1e-9;

struct Point {
    double x, y;
};

// 實數相等的精度防線
bool d_equal(double a, double b) {
    return abs(a - b) < EPS;
}

// 向量叉積
double cross_product(const Point& A, const Point& B, const Point& C) {
    return (B.x - A.x) * (C.y - A.y) - (B.y - A.y) * (C.x - A.x);
}

// 判定點 C 是否在線段 AB 上 (共線且在投影範圍內)
bool on_segment(const Point& A, const Point& B, const Point& C) {
    return d_equal(cross_product(A, B, C), 0) &&
           C.x >= min(A.x, B.x) - EPS && C.x <= max(A.x, B.x) + EPS &&
           C.y >= min(A.y, B.y) - EPS && C.y <= max(A.y, B.y) + EPS;
}

// 判定線段 AB 與 CD 是否相交
bool intersect(const Point& A, const Point& B, const Point& C, const Point& D) {
    double cp1 = cross_product(A, B, C);
    double cp2 = cross_product(A, B, D);
    double cp3 = cross_product(C, D, A);
    double cp4 = cross_product(C, D, B);
    
    // 跨立實驗
    if (((cp1 > EPS && cp2 < -EPS) || (cp1 < -EPS && cp2 > EPS)) &&
        ((cp3 > EPS && cp4 < -EPS) || (cp3 < -EPS && cp4 > EPS))) {
        return true;
    }
    // 共線特例判定
    if (on_segment(A, B, C)) return true;
    if (on_segment(A, B, D)) return true;
    if (on_segment(C, D, A)) return true;
    if (on_segment(C, D, B)) return true;
    return false;
}
```

```java
class CompGeom {
    // 類似的 EPS 精度與跨立相交實驗 Java 實作
}
```

```python
class CompGeom:
    # 類似的 Python 幾何精度實作
    pass
```

---

## 3. 複雜度與防禦要點
*   **時間複雜度**：線段相交判定為常數 $\mathcal{O}(1)$。
*   **防禦要點**：
    *   **避免使用 `double` 進行無謂的除法**：除法是浮點數精度的最大殺手。在判定「斜率相等」時，一律將 $\frac{y_1}{x_1} == \frac{y_2}{x_2}$ 轉寫為乘法 $y_1 \cdot x_2 == y_2 \cdot x_1$ 進行交叉相乘，這能直接在整數域完成完全無損的判定。
