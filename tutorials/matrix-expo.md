# 矩陣快速冪 (Matrix Exponentiation)

**矩陣快速冪 (Matrix Exponentiation)** 是一種在 **$\mathcal{O}(\log N)$ 時間**內，求解大規模遞迴關係式（如費氏數列第 $10^{18}$ 項）的強大代數演算法。

---

## 1. 核心觀念與基本原理

*   **遞迴式的矩陣乘法轉換**：
    將遞迴關係式寫成向量與矩陣相乘的形式：
    $$\begin{bmatrix} F_{n} \\ F_{n-1} \end{bmatrix} = \begin{bmatrix} 1 & 1 \\ 1 & 0 \end{bmatrix} \cdot \begin{bmatrix} F_{n-1} \\ F_{n-2} \end{bmatrix}$$
*   **對數級冪次加速**：
    透過代數遞推，將求解第 $N$ 項轉換為矩陣的 $N$ 次方乘法：
    $$\begin{bmatrix} F_{n} \\ F_{n-1} \end{bmatrix} = \begin{bmatrix} 1 & 1 \\ 1 & 0 \end{bmatrix}^{n-1} \cdot \begin{bmatrix} F_{1} \\ F_{0} \end{bmatrix}$$
    利用**快速冪（二分乘法）**，可以在對數時間內求得矩陣冪次，突破線性轉移瓶頸。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

```cpp
#include <vector>
using namespace std;

typedef vector<vector<long long>> Matrix;
long long MOD = 1000000007;

Matrix multiply(const Matrix& A, const Matrix& B) {
    int r = A.size(), c = B[0].size(), k = B.size();
    Matrix C(r, vector<long long>(c, 0));
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            for (int p = 0; p < k; p++) {
                C[i][j] = (C[i][j] + A[i][p] * B[p][j]) % MOD;
            }
        }
    }
    return C;
}

Matrix power(Matrix A, long long exp) {
    int n = A.size();
    Matrix res(n, vector<long long>(n, 0));
    for (int i = 0; i < n; i++) res[i][i] = 1; // 單位矩陣
    while (exp > 0) {
        if (exp % 2 == 1) res = multiply(res, A);
        A = multiply(A, A);
        exp /= 2;
    }
    return res;
}
```

```java
class MatrixExpo {
    static long MOD = 1000000007;
    public static long[][] multiply(long[][] A, long[][] B) {
        int r = A.length, c = B[0].length, k = B.length;
        long[][] C = new long[r][c];
        for (int i = 0; i < r; i++) {
            for (int j = 0; j < c; j++) {
                for (int p = 0; p < k; p++) {
                    C[i][j] = (C[i][j] + A[i][p] * B[p][j]) % MOD;
                }
            }
        }
        return C;
    }
}
```

```python
def multiply(A, B, mod=1000000007):
    r, c, k = len(A), len(B[0]), len(B)
    C = [[0] * c for _ in range(r)]
    for i in range(r):
        for j in range(c):
            for p in range(k):
                C[i][j] = (C[i][j] + A[i][p] * B[p][j]) % mod
    return C
```

---

## 3. 複雜度與防禦要點
*   **時間複雜度**：$\mathcal{O}(K^3 \log N)$，其中 $K$ 為矩陣大小（通常 $K \le 5$）。
*   **防禦要點**：
    *   **溢位防護**：矩陣乘法中包含多次 `A[i][p] * B[p][j]` 乘法，必須使用 64 位元長整數，且在每次乘法後立即取模。
