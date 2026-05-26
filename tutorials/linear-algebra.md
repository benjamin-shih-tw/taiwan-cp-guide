# 線性代數與高斯消去法 (Linear Algebra & Gaussian Elimination)

在競賽程式中，線性代數最常出現的應用是利用 **高斯消去法 (Gaussian Elimination)** 求解線性方程組、矩陣行列式或求逆矩陣，以及利用 **XOR 線性基 (XOR Linear Basis)** 解決一組數的異或組合極值問題。

---

## 1. 核心觀念與基本原理

*   **高斯消去法 (Gaussian Elimination)**：
    *   **目標**：在 $\mathcal{O}(N^3)$ 時間內求解包含 $N$ 個未知數與 $M$ 個方程的線性方程組 $Ax = B$。
    *   **增廣矩陣**：將係數矩陣 $A$ 與常數項 $B$ 合併成一個 $N \times (N+1)$ 的矩陣。
    *   **行變換**：透過三種初等行變換（交換兩行、某行乘以非零常數、某行加到另一行），將增廣矩陣消減為**上三角矩陣**或**行最簡形 (Row Echelon Form)**。
    *   **解的判定**：
        1. **唯一解**：消去後，對角線元素均非零，自底向上回代即可。
        2. **無窮多組解**：消去後，出現 $0 = 0$ 的恆等式（存在自由變數）。
        3. **無解**：消去後，出現 $0 = d$ (其中 $d \neq 0$) 的矛盾式。
*   **XOR 線性基 (XOR Linear Basis)**：
    *   **定義**：線性基是從一個整數集合中構建出來的另一個**極小整數集合**。這個極小集合具有這樣的性質：原集合中任意多個數的 XOR 異或和，都可以由線性基中某個子集的元素 XOR 異或得到。
    *   **性質**：
        *   線性基中的元素在二進制最高位（主元位置）互不相同。
        *   線性基沒有多餘元素（線性無關），其大小最多為整數的二進位位數（例如 64 位元整數最多為 64 個元素）。
    *   **經典問題**：求解集合中任意子集 XOR 異或和的最大值。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

以下實作示範：
1. 高斯消去法求解浮點數方程組（C++、Java）。
2. XOR 線性基的插入與求解最大 XOR 異或和（Python、C++ 參考）。

### C++ 實作範本 (高斯消去法)

```cpp
#include <iostream>
#include <vector>
#include <cmath>
#include <algorithm>

using namespace std;

const double EPS = 1e-9;

// 求解 Ax = B，其中 mat 爲 N * (N+1) 的增廣矩陣
// 返回值：0 代表無解，1 代表唯一解，2 代表有無限多組解
int gaussian_elimination(vector<vector<double>>& mat, vector<double>& ans) {
    int n = mat.size();
    int m = mat[0].size() - 1;

    int row = 0;
    for (int col = 0; col < m && row < n; ++col) {
        // 主元消去選主元 (Pivot Selection)
        int pivot = row;
        for (int i = row + 1; i < n; ++i) {
            if (abs(mat[i][col]) > abs(mat[pivot][col])) {
                pivot = i;
            }
        }

        if (abs(mat[pivot][col]) < EPS) continue; // 當前列全爲 0，跳過

        swap(mat[row], mat[pivot]);

        // 將主元行歸一化
        double div = mat[row][col];
        for (int j = col; j <= m; ++j) {
            mat[row][j] /= div;
        }

        // 消去其餘行的當前列
        for (int i = 0; i < n; ++i) {
            if (i != row && abs(mat[i][col]) > EPS) {
                double factor = mat[i][col];
                for (int j = col; j <= m; ++j) {
                    mat[i][j] -= factor * mat[row][j];
                }
            }
        }
        row++;
    }

    ans.assign(m, 0);
    // 檢查是否有矛盾式 (無解)
    for (int i = row; i < n; ++i) {
        if (abs(mat[i][m]) > EPS) {
            return 0; // 0 = d 矛盾，無解
        }
    }

    if (row < m) {
        return 2; // 自由變量存在，無限多解
    }

    // 回代得到唯一解
    for (int i = 0; i < m; ++i) {
        ans[i] = mat[i][m];
    }
    return 1;
}
```

### Java 實作範本 (高斯消去法)

```java
import java.util.*;

public class GaussianElimination {
    private static final double EPS = 1e-9;

    // mat: N * (N+1) 增廣矩陣
    // 返回 0:無解, 1:唯一解, 2:無限多解
    public static int solve(double[][] mat, double[] ans) {
        int n = mat.length;
        int m = mat[0].length - 1;

        int row = 0;
        for (int col = 0; col < m && row < n; col++) {
            int pivot = row;
            for (int i = row + 1; i < n; i++) {
                if (Math.abs(mat[i][col]) > Math.abs(mat[pivot][col])) {
                    pivot = i;
                }
            }

            if (Math.abs(mat[pivot][col]) < EPS) continue;

            double[] temp = mat[row];
            mat[row] = mat[pivot];
            mat[pivot] = temp;

            double div = mat[row][col];
            for (int j = col; j <= m; j++) {
                mat[row][j] /= div;
            }

            for (int i = 0; i < n; i++) {
                if (i != row && Math.abs(mat[i][col]) > EPS) {
                    double factor = mat[i][col];
                    for (int j = col; j <= m; j++) {
                        mat[i][j] -= factor * mat[row][j];
                    }
                }
            }
            row++;
        }

        Arrays.fill(ans, 0);
        for (int i = row; i < n; i++) {
            if (Math.abs(mat[i][m]) > EPS) {
                return 0; // 無解
            }
        }

        if (row < m) {
            return 2; // 無限多解
        }

        for (int i = 0; i < m; i++) {
            ans[i] = mat[i][m];
        }
        return 1;
    }
}
```

### Python 實作範本 (XOR 線性基)

```python
class LinearBasis:
    def __init__(self, max_bit=62):
        self.max_bit = max_bit
        self.basis = [0] * (max_bit + 1)

    # 插入一個整數到線性基中
    def insert(self, x):
        for i in range(self.max_bit, -1, -1):
            if (x >> i) & 1:
                if not self.basis[i]:
                    self.basis[i] = x
                    return True
                x ^= self.basis[i]
        return False # 說明該整數可以由當前線性基內的數 XOR 組合出來

    # 獲取子集最大 XOR 異或和
    def get_max_xor(self):
        max_val = 0
        for i in range(self.max_bit, -1, -1):
            if (max_val ^ self.basis[i]) > max_val:
                max_val ^= self.basis[i]
        return max_val
```

---

## 3. 複雜度與防禦要點

*   **時間複雜度**：
    *   高斯消去法：$\mathcal{O}(N^3)$。三層循環，消去操作需要耗費立方級時間。
    *   XOR 線性基插入與最大值查詢：$\mathcal{O}(\log(\text{Max})) \approx \mathcal{O}(60)$，即線性的二進位位數次操作，常數極小。
*   **防禦要點**：
    *   **浮點數精度防禦**：
        高斯消去法在實數運算中存在嚴重的累積誤差。
        *   **主元選擇 (Pivoting)**：每次必須在當前列中選擇絕對值最大的元素交換到主元行。如果不選主元，直接除以一個極小的數，會導致浮點數急劇放大，最終結果完全崩潰。
        *   **零值判斷**：絕不能使用 `mat[i][j] == 0`，必須使用 `abs(mat[i][j]) < EPS`。
    *   **線性基位數設定**：
        在處理大整數（例如 $10^{18}$ 規模）時，二進位最多可達 60 多位。因此線性基陣列大小及插入的循環必須覆蓋到 60 以上，**否則會漏掉高位的主元**。
