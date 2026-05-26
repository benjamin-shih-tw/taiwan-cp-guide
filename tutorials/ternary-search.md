# 三分搜尋 (Ternary Search)

當我們需要尋找一個**單峰函數 (Unimodal Function)** 的極值（最大值或最小值）時，二分搜尋將不再適用。此時應採用**三分搜尋 (Ternary Search)**。

---

## 1. 核心觀念與基本原理

*   **雙決策分割點**：
    *   對於當前搜尋區間 $[L, R]$，我們將其均勻分割為三段：
        $$m_1 = L + \frac{R - L}{3}$$
        $$m_2 = R - \frac{R - L}{3}$$
    *   **區間收縮**（尋找極大值為例）：
        *   若 $f(m_1) < f(m_2)$，說明極值一定不在左側第一段中，收縮區間 $L = m_1$。
        *   若 $f(m_1) > f(m_2)$，說明極值一定不在右側第三段中，收縮區間 $R = m_2$。
    每次更新後，搜尋範圍縮小為原來的 $2/3$，時間複雜度為優秀的 **$\mathcal{O}(\log N)$**。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

```cpp
#include <iostream>
using namespace std;

// 範例：凸函數 f(x) = -(x-3)^2 + 10 在 [0, 10] 上求最大值 (答案 x=3)
double f(double x) {
    return -(x - 3.0) * (x - 3.0) + 10.0;
}

double ternary_search(double l, double r) {
    double eps = 1e-9;
    while (r - l > eps) {
        double m1 = l + (r - l) / 3.0;
        double m2 = r - (r - l) / 3.0;
        if (f(m1) < f(m2)) {
            l = m1;
        } else {
            r = m2;
        }
    }
    return l; // 極值點 x
}
```

```java
class TernarySearch {
    private static double f(double x) {
        return -(x - 3.0) * (x - 3.0) + 10.0;
    }
    public static double search(double l, double r) {
        double eps = 1e-9;
        while (r - l > eps) {
            double m1 = l + (r - l) / 3.0;
            double m2 = r - (r - l) / 3.0;
            if (f(m1) < f(m2)) {
                l = m1;
            } else {
                r = m2;
            }
        }
        return l;
    }
}
```

```python
def f(x):
    return -(x - 3.0) ** 2 + 10.0

def ternary_search(l, r):
    eps = 1e-9
    while r - l > eps:
        m1 = l + (r - l) / 3.0
        m2 = r - (r - l) / 3.0
        if f(m1) < f(m2):
            l = m1
        else:
            r = m2
    return l
```

---

## 3. 複雜度與防禦要點
*   **時間複雜度**：$\mathcal{O}(\log_{1.5}(N))$。
*   **防禦要點**：
    *   **平台平坦區間**：如果單峰函數中含有**一段完全平坦（值相同）的區域**，三分搜尋將無法判斷收縮方向，可能會陷入死路或取得錯誤解答。
