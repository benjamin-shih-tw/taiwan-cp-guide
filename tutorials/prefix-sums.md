# 前綴和演算法 (Prefix Sums)

前綴和（Prefix Sums）是競程與算法面試中最經典的「預處理（Preprocessing）」技巧。它能在 $O(N)$ 的時間內完成數組的預先計算，從而在後續的查詢中，以 **$O(1)$ 常數時間**即時查詢任意子陣列（區間）的元素總和。這對於需要進行多次區間查詢的問題來說，是不可或缺的效率優化核心。

---

## 1. 核心思想與數學原理

假設有一個長度為 $N$ 的陣列 $A = [a_1, a_2, \dots, a_n]$。
若我們需要頻繁查詢區間 $[L, R]$ 的元素總和：
$$\text{Sum}(L, R) = \sum_{i=L}^{R} a_i$$
最直覺的做法是每次查詢都用一個迴圈從 $L$ 累加到 $R$，單次查詢的時間複雜度為 $O(N)$。如果有 $Q$ 次查詢，總時間將高達 $O(Q \times N)$，在 $Q, N \ge 10^5$ 時會無情超時。

### 前綴和的解決方案：
我們定義一個全新陣列 $P$，其中 $P_i$ 代表從陣列起點（$1$-indexed）到第 $i$ 個元素的**累加總和**：
* $P_0 = 0$
* $P_1 = a_1$
* $P_2 = a_1 + a_2$
* $P_i = P_{i-1} + a_i$ （這是前綴和的遞推構造公式）

當我們想查詢區間 $[L, R]$ 的和時，可以利用以下數學公式進行區間差分：
$$\text{Sum}(L, R) = P_R - P_{L-1}$$

> **為什麼？**
> 因為 $P_R = (a_1 + a_2 + \dots + a_{L-1}) + (a_L + \dots + a_R) = P_{L-1} + \text{Sum}(L, R)$。
> 因此，我們只需進行一次簡單的減法運算，即可在 $O(1)$ 時間內得到區間和！

---

## 2. 二維前綴和 (2D Prefix Sums)

前綴和很容易推廣到二維網格結構。我們用 `pref[i][j]` 表示從左上角 `(1,1)` 到右下角 `(i,j)` 的矩形區域內所有元素的總和。

### 遞推構造公式 (二維前綴和建表)：
$$\text{pref}[i][j] = \text{pref}[i-1][j] + \text{pref}[i][j-1] - \text{pref}[i-1][j-1] + A[i][j]$$
*(減去重疊的左上角矩形，再加上當前單格的值)*

### 區間查詢公式：
若要查詢左上角 `(x1, y1)` 到右下角 `(x2, y2)` 的子矩形區域和：
$$\text{Sum} = \text{pref}[x2][y2] - \text{pref}[x1-1][y2] - \text{pref}[x2][y1-1] + \text{pref}[x1-1][y1-1]$$

---

## 3. 三大語言範本程式碼 (C++ / Java / Python)

以下提供一維前綴和建表與查詢的實作範本（採用標準 $1$-indexed 防禦性邊界設計）：

```cpp
// C++ 一維前綴和實作範本
#include <bits/stdc++.h>
using namespace std;

class PrefixSum1D {
private:
    vector<long long> pref;

public:
    // 建構子：進行 O(N) 的前綴和建表
    PrefixSum1D(const vector<int>& a) {
        int n = a.size();
        pref.assign(n + 1, 0);
        for (int i = 1; i <= n; ++i) {
            pref[i] = pref[i - 1] + a[i - 1]; // 遞推累加
        }
    }

    // 查詢閉區間 [L, R] 的區間和 (0-indexed 轉 1-indexed 處理)
    long long query(int L, int R) {
        L++; R++; // 轉換為 1-indexed 邊界
        if (L > R || L < 1 || R >= pref.size()) return 0;
        return pref[R] - pref[L - 1]; // O(1) 減法即時求值
    }
};
```

```java
// Java 一維前綴和實作範本
class PrefixSum1D {
    private long[] pref;

    // 構造前綴和陣列，時間複雜度 O(N)
    public PrefixSum1D(int[] a) {
        int n = a.length;
        pref = new long[n + 1];
        for (int i = 1; i <= n; i++) {
            pref[i] = pref[i - 1] + a[i - 1];
        }
    }

    // 查詢區間 [L, R] 的元素總和 (0-indexed 閉區間)
    public long query(int L, int R) {
        L++; R++; // 轉為 1-indexed
        if (L > R || L < 1 || R >= pref.length) return 0;
        return pref[R] - pref[L - 1];
    }
}
```

```python
# Python 一維前綴和實作範本
class PrefixSum1D:
    def __init__(self, a):
        """
        O(N) 時間預處理前綴和陣列
        """
        n = len(a)
        self.pref = [0] * (n + 1)
        for i in range(1, n + 1):
            self.pref[i] = self.pref[i - 1] + a[i - 1]

    def query(self, L, R):
        """
        O(1) 時間查詢區間 [L, R] 元素和 (0-indexed 閉區間)
        """
        L += 1
        R += 1
        if L > R or L < 1 or R >= len(self.pref):
            return 0
        return self.pref[R] - self.pref[L - 1]
```

---

## 4. 複雜度與防禦要點

* **時間複雜度**：建表預處理 $O(N)$，單次查詢 $O(1)$。
* **空間複雜度**：$O(N)$，需額外開闢一個長度為 $N+1$ 的累加陣列。
* **溢位防禦 (Overflow)**：
  在競程中，區間累加和極易超出 $32$ 位元有號整數的上限（`2 * 10^9`）。為防止數值溢位，**前綴和陣列（`pref`）必須宣告為 $64$ 位元整數型別**（C++ 中的 `long long`，Java 中的 `long`）。
* **哨兵邊界設計 ($1$-Indexed Sentinel)**：
  強烈建議將前綴和數組設計為 $1$-indexed，即長度為 $N+1$，且將 `pref[0]` 初始化為 $0$。這樣在處理區間端點 $L=0$ 時，`pref[R] - pref[0]` 不會發生陣列索引越界（Out of Bounds）的 runtime 錯誤。
