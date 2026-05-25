# 二維前綴和與差分

在大規模資料處理與資訊競賽中，我們經常面臨兩類經典問題：
1. **單點修改、區間查詢**：給定陣列，頻繁查詢某個區間 $[l, r]$ 的元素總和。
2. **區間修改、單點查詢**：頻繁將某個區間 $[l, r]$ 的所有元素加上 $v$，最後查詢某些位置的值。

**前綴和 (Prefix Sum)** 與 **差分 (Difference)** 正是為了解決這兩類對稱問題而生的雙生演算法。在二維網格中，這兩項技術的結合能將複雜度大幅降低，是進階演算法（如二分搜尋法、動態規劃）不可或缺的基石。

---

## 1. 核心觀念與基本原理

### 1.1 一維前綴和與差分陣列的對稱美學

* **前綴和** 是將「原陣列的元素進行累加」，使我們能以 $O(1)$ 時間回答任意區間的總和查詢。
* **差分** 是將「相鄰元素的差值記錄下來」，使我們能以 $O(1)$ 時間完成區間加值，最後再用前綴和還原原陣列。

#### 一維差分陣列原理
對於一個長度為 $N$ 的陣列 $A$（以 1-based 索引表示，即 $A[1 \dots N]$），我們定義其差分陣列 $D$ 為：
$$D[i] = \begin{cases} A[1], & i = 1 \\ A[i] - A[i-1], & 2 \le i \le N \end{cases}$$

這個定義帶來一個極佳的性質：原陣列的元素 $A[i]$，正是差分陣列 $D$ 的前綴和！
$$A[i] = \sum_{j=1}^{i} D[j]$$

當我們要對區間 $[l, r]$ 的所有元素加上 $v$ 時，若直接修改 $A$，時間複雜度為 $O(N)$。但在差分陣列 $D$ 中，我們只需要進行兩處修改：
1. $D[l] \gets D[l] + v$：這會使得從 $l$ 開始的所有前綴和（即還原後的 $A[l], A[l+1], \dots$）都增加 $v$。
2. $D[r+1] \gets D[r+1] - v$：這會把從 $r+1$ 開始產生的 $+v$ 抵消掉。

這樣，我們成功將區間修改的複雜度降低到 $O(1)$。在所有修改結束後，只需對 $D$ 進行一次前綴和掃描，即可在 $O(N)$ 時間內完整還原出最終的陣列 $A$。

---

### 1.2 二維前綴和 (2D Prefix Sums)
將一維前綴和的概念擴展到二維網格。假設有一個 $N \times M$ 的二維陣列 $grid$。我們定義二維前綴和陣列 $pref[i][j]$ 表示**從左上角 $(1, 1)$ 到右下角 $(i, j)$ 所包圍的矩形區域內所有元素的總和**。

#### (A) 遞迴關係式（建構公式）
要高效建構出 $pref$ 陣列，利用**排容原理 (Inclusion-Exclusion Principle)**，我們可以在 $O(N \times M)$ 的時間內建構完成：
$$pref[i][j] = pref[i-1][j] + pref[i][j-1] - pref[i-1][j-1] + grid[i][j]$$

**原理說明：**
* $pref[i-1][j]$ 代表上方矩形的總和。
* $pref[i][j-1]$ 代表左方矩形的總和。
* 當我們把這兩個部分相加時，重疊的左上方矩形 $pref[i-1][j-1]$ 被重複計算了兩次，因此必須扣除一次。
* 最後，再加上目前位置的單點數值 $grid[i][j]$。

#### (B) 區間查詢公式
當我們想查詢任意子矩形（左上角為 $(r_1, c_1)$，右下角為 $(r_2, c_2)$，且 $r_1 \le r_2$ 且 $c_1 \le c_2$）的元素總和時，同樣可以透過排容原理在 $O(1)$ 時間內求得：
$$Sum(r_1, c_1, r_2, c_2) = pref[r_2][c_2] - pref[r_1-1][c_2] - pref[r_2][c_1-1] + pref[r_1-1][c_1-1]$$

**原理說明（圖解排容）：**
為了求得目標紅色子矩形（下圖中的區塊 D）之和：
```text
(1,1) -------------- (c1-1) ------ (c2)
  |       A            |      B     |
  |                    |            |
(r1-1) ----------------+------------+
  |                    |            |
  |       C            |      D     |
  |                    |   (target) |
(r2)  -----------------+------------+
```
1. 整體大矩形（包含 A, B, C, D 四區）的總和為 $pref[r_2][c_2]$。
2. 我們必須減去上方不屬於目標範圍的矩形（A 和 B 區），即 $pref[r_1-1][c_2]$。
3. 我們必須減去左方不屬於目標範圍的矩形（A 和 C 區），即 $pref[r_2][c_1-1]$。
4. 因為 A 區（即 $pref[r_1-1][c_1-1]$）被重複扣減了兩次，我們必須將它加回來一次。

---

### 1.3 二維差分陣列 (2D Difference Array)
當面對「多次將二維網格中的某個子矩形區域 $[(r_1, c_1), (r_2, c_2)]$ 內所有元素加上 $v$」的區間修改需求時，使用**二維差分陣列**能將單次子矩形修改的複雜度降低至 $O(1)$。

#### (A) 修改公式
給定一個與原網格對應的差分陣列 $diff$。若要將左上角 $(r_1, c_1)$ 到右下角 $(r_2, c_2)$ 的子矩形區域內所有元素都加上 $val$，我們僅需在 $diff$ 陣列的四個頂點進行操作：
$$diff[r_1][c_1] \gets diff[r_1][c_1] + val$$
$$diff[r_1][c_2+1] \gets diff[r_1][c_2+1] - val$$
$$diff[r_2+1][c_1] \gets diff[r_2+1][c_1] - val$$
$$diff[r_2+1][c_2+1] \gets diff[r_2+1][c_2+1] + val$$

#### (B) 原理解析
當所有區間加值修改結束後，我們對 $diff$ 陣列求一次**二維前綴和**，即可在 $O(N \times M)$ 時間內還原出修改後的網格 $grid$：
$$grid[i][j] = diff[i][j] + grid[i-1][j] + grid[i][j-1] - grid[i-1][j-1]$$

這四個修改點對還原後網格的影響如下：
1. $diff[r_1][c_1] \gets diff[r_1][c_1] + val$：會使得二維前綴和擴散到所有滿足 $i \ge r_1$ 且 $j \ge c_1$ 的位置，這些位置的值皆增加了 $+val$。
2. $diff[r_1][c_2+1] \gets diff[r_1][c_2+1] - val$：為了限制增加的範圍不超過右邊界 $c_2$，在 $c_2+1$ 處減去 $val$。這會把 $i \ge r_1, j \ge c_2+1$ 的 $+val$ 抵消掉。
3. $diff[r_2+1][c_1] \gets diff[r_2+1][c_1] - val$：為了限制增加的範圍不超過下邊界 $r_2$，在 $r_2+1$ 處減去 $val$。這會把 $i \ge r_2+1, j \ge c_1$ 的 $+val$ 抵消掉。
4. $diff[r_2+1][c_2+1] \gets diff[r_2+1][c_2+1] + val$：因為在右下方重疊區域（即 $i \ge r_2+1$ 且 $j \ge c_2+1$）中，我們重複減去了兩次 $val$（分別被上述第 2 點與第 3 點抵消），所以必須在此處補回一個 $+val$，以達到完美的平衡。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

以下提供經過競賽驗證、具備高防禦性的標準模板。為了避免複雜邊界處理與陣列越界（Out of Bounds）問題，所有實作均採用競賽中最推崇的 **1-based 索引設計**。

### 2.1 C++ 實作範本

```cpp
#include <iostream>
#include <vector>

using namespace std;

// =========================================================================
// 1. 二維前綴和類別 (2D Prefix Sums)
// =========================================================================
class PrefixSum2D {
private:
    int n, m;
    vector<vector<long long>> pref;

public:
    PrefixSum2D() : n(0), m(0) {}
    
    // 傳入 1-based 二維陣列，大小為 (n+1) x (m+1)，第 0 行與第 0 列不使用
    PrefixSum2D(const vector<vector<long long>>& grid) {
        if (grid.empty() || grid[0].empty()) return;
        n = grid.size() - 1;
        m = grid[0].size() - 1;
        pref.assign(n + 1, vector<long long>(m + 1, 0));

        for (int i = 1; i <= n; ++i) {
            for (int j = 1; j <= m; ++j) {
                pref[i][j] = pref[i - 1][j] 
                           + pref[i][j - 1] 
                           - pref[i - 1][j - 1] 
                           + grid[i][j];
            }
        }
    }

    // 查詢子矩陣 [(r1, c1), (r2, c2)] 的區間和，時間複雜度為 O(1)
    long long query(int r1, int c1, int r2, int c2) const {
        if (r1 > r2 || c1 > c2 || r1 < 1 || c1 < 1 || r2 > n || c2 > m) {
            return 0; // 防禦性邊界處理
        }
        return pref[r2][c2] 
             - pref[r1 - 1][c2] 
             - pref[r2][c1 - 1] 
             + pref[r1 - 1][c1 - 1];
    }
};

// =========================================================================
// 2. 二維差分陣列類別 (2D Difference Array)
// =========================================================================
class DifferenceArray2D {
private:
    int n, m;
    vector<vector<long long>> diff;

public:
    // 初始化一個 n x m 的 1-based 差分陣列，實際分配大小為 (n+2) x (m+2) 以防越界
    DifferenceArray2D(int n, int m) : n(n), m(m) {
        diff.assign(n + 2, vector<long long>(m + 2, 0));
    }

    // 將子矩陣 [(r1, c1), (r2, c2)] 的所有元素加上 val，時間複雜度為 O(1)
    void update(int r1, int c1, int r2, int c2, long long val) {
        if (r1 > r2 || c1 > c2 || r1 < 1 || c1 < 1 || r2 > n || c2 > m) {
            return;
        }
        diff[r1][c1] += val;
        diff[r1][c2 + 1] -= val;
        diff[r2 + 1][c1] -= val;
        diff[r2 + 1][c2 + 1] += val;
    }

    // 還原二維陣列，時間複雜度為 O(N * M)
    vector<vector<long long>> recover() const {
        vector<vector<long long>> grid(n + 1, vector<long long>(m + 1, 0));
        for (int i = 1; i <= n; ++i) {
            for (int j = 1; j <= m; ++j) {
                grid[i][j] = diff[i][j] 
                           + grid[i - 1][j] 
                           + grid[i][j - 1] 
                           - grid[i - 1][j - 1];
            }
        }
        return grid;
    }
};

int main() {
    // 提升 C++ I/O 效率
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 測試範例：3 x 3 網格
    int n = 3, m = 3;
    vector<vector<long long>> grid(n + 1, vector<long long>(m + 1, 0));
    
    // 初始化原網格數據
    // 1 2 3
    // 4 5 6
    // 7 8 9
    grid[1] = {0, 1, 2, 3};
    grid[2] = {0, 4, 5, 6};
    grid[3] = {0, 7, 8, 9};

    // 1. 測試二維前綴和
    PrefixSum2D pf(grid);
    cout << "Subgrid (2,2) to (3,3) Sum: " << pf.query(2, 2, 3, 3) << "\n"; // 預期：5+6+8+9 = 28

    // 2. 測試二維差分
    DifferenceArray2D da(n, m);
    da.update(1, 1, 2, 2, 5);  // 將 [(1,1), (2,2)] 區域全部加 5
    da.update(2, 2, 3, 3, 10); // 將 [(2,2), (3,3)] 區域全部加 10
    
    vector<vector<long long>> final_grid = da.recover();
    cout << "Recovered Grid after updates:\n";
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= m; ++j) {
            cout << final_grid[i][j] << " ";
        }
        cout << "\n";
    }
    // 預期輸出：
    // 5 5 0 
    // 5 15 10 
    // 0 10 10 

    return 0;
}
```

### 2.2 Java 實作範本

```java
import java.io.*;
import java.util.*;

public class Main {
    // =========================================================================
    // 1. 二維前綴和類別 (2D Prefix Sums)
    // =========================================================================
    public static class PrefixSum2D {
        private final int n, m;
        private final long[][] pref;

        // 傳入 1-based 二維陣列，大小為 (n+1) x (m+1)，第 0 行與第 0 列不使用
        public PrefixSum2D(long[][] grid) {
            if (grid == null || grid.length == 0 || grid[0].length == 0) {
                this.n = 0;
                this.m = 0;
                this.pref = new long[0][0];
                return;
            }
            this.n = grid.length - 1;
            this.m = grid[0].length - 1;
            this.pref = new long[n + 1][m + 1];

            for (int i = 1; i <= n; i++) {
                for (int j = 1; j <= m; j++) {
                    pref[i][j] = pref[i - 1][j] 
                               + pref[i][j - 1] 
                               - pref[i - 1][j - 1] 
                               + grid[i][j];
                }
            }
        }

        // 查詢子矩陣 [(r1, c1), (r2, c2)] 的區間和，時間複雜度為 O(1)
        public long query(int r1, int c1, int r2, int c2) {
            if (r1 > r2 || c1 > c2 || r1 < 1 || c1 < 1 || r2 > n || c2 > m) {
                return 0; // 防禦性邊界處理
            }
            return pref[r2][c2] 
                 - pref[r1 - 1][c2] 
                 - pref[r2][c1 - 1] 
                 + pref[r1 - 1][c1 - 1];
        }
    }

    // =========================================================================
    // 2. 二維差分陣列類別 (2D Difference Array)
    // =========================================================================
    public static class DifferenceArray2D {
        private final int n, m;
        private final long[][] diff;

        // 初始化一個 n x m 的 1-based 差分陣列，實際分配大小為 (n+2) x (m+2) 以防越界
        public DifferenceArray2D(int n, int m) {
            this.n = n;
            this.m = m;
            this.diff = new long[n + 2][m + 2];
        }

        // 將子矩陣 [(r1, c1), (r2, c2)] 的所有元素加上 val，時間複雜度為 O(1)
        public void update(int r1, int c1, int r2, int c2, long val) {
            if (r1 > r2 || c1 > c2 || r1 < 1 || c1 < 1 || r2 > n || c2 > m) {
                return;
            }
            diff[r1][c1] += val;
            diff[r1][c2 + 1] -= val;
            diff[r2 + 1][c1] -= val;
            diff[r2 + 1][c2 + 1] += val;
        }

        // 還原二維陣列，時間複雜度為 O(N * M)
        public long[][] recover() {
            long[][] grid = new long[n + 1][m + 1];
            for (int i = 1; i <= n; i++) {
                for (int j = 1; j <= m; j++) {
                    grid[i][j] = diff[i][j] 
                               + grid[i - 1][j] 
                               + grid[i][j - 1] 
                               - grid[i - 1][j - 1];
                }
            }
            return grid;
        }
    }

    public static void main(String[] args) throws IOException {
        // 使用 BufferedReader/BufferedWriter 進行高效 I/O
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(System.out));

        int n = 3, m = 3;
        long[][] grid = new long[n + 1][m + 1];
        
        // 1 2 3
        // 4 5 6
        // 7 8 9
        grid[1] = new long[]{0, 1, 2, 3};
        grid[2] = new long[]{0, 4, 5, 6};
        grid[3] = new long[]{0, 7, 8, 9};

        // 1. 測試二維前綴和
        PrefixSum2D pf = new PrefixSum2D(grid);
        bw.write("Subgrid (2,2) to (3,3) Sum: " + pf.query(2, 2, 3, 3) + "\n"); // 28

        // 2. 測試二維差分
        DifferenceArray2D da = new DifferenceArray2D(n, m);
        da.update(1, 1, 2, 2, 5);
        da.update(2, 2, 3, 3, 10);
        
        long[][] finalGrid = da.recover();
        bw.write("Recovered Grid after updates:\n");
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                bw.write(finalGrid[i][j] + " ");
            }
            bw.write("\n");
        }
        bw.flush();
    }
}
```

### 2.3 Python 實作範本

```python
import sys

# =========================================================================
# 1. 二維前綴和類別 (2D Prefix Sums)
# =========================================================================
class PrefixSum2D:
    def __init__(self, grid):
        """
        傳入 1-based 二維陣列，大小為 (n+1) x (m+1)，第 0 行與第 0 列不使用
        """
        if not grid or not grid[0]:
            self.n = 0
            self.m = 0
            self.pref = []
            return
        
        self.n = len(grid) - 1
        self.m = len(grid[0]) - 1
        self.pref = [[0] * (self.m + 1) for _ in range(self.n + 1)]
        
        for i in range(1, self.n + 1):
            for j in range(1, self.m + 1):
                self.pref[i][j] = (
                    self.pref[i - 1][j]
                    + self.pref[i][j - 1]
                    - self.pref[i - 1][j - 1]
                    + grid[i][j]
                )

    def query(self, r1: int, c1: int, r2: int, c2: int) -> int:
        """
        查詢子矩陣 [(r1, c1), (r2, c2)] 的區間和，時間複雜度為 O(1)
        """
        if r1 > r2 or c1 > c2 or r1 < 1 or c1 < 1 or r2 > self.n or c2 > self.m:
            return 0  # 防禦性邊界處理
        
        return (
            self.pref[r2][c2]
            - self.pref[r1 - 1][c2]
            - self.pref[r2][c1 - 1]
            + self.pref[r1 - 1][c1 - 1]
        )


# =========================================================================
# 2. 二維差分陣列類別 (2D Difference Array)
# =========================================================================
class DifferenceArray2D:
    def __init__(self, n: int, m: int):
        """
        初始化一個 n x m 的 1-based 差分陣列，實際分配大小為 (n+2) x (m+2) 以防越界
        """
        self.n = n
        self.m = m
        self.diff = [[0] * (m + 2) for _ in range(n + 2)]

    def update(self, r1: int, c1: int, r2: int, c2: int, val: int) -> None:
        """
        將子矩陣 [(r1, c1), (r2, c2)] 的所有元素加上 val，時間複雜度為 O(1)
        """
        if r1 > r2 or c1 > c2 or r1 < 1 or c1 < 1 or r2 > self.n or c2 > self.m:
            return
        
        self.diff[r1][c1] += val
        self.diff[r1][c2 + 1] -= val
        self.diff[r2 + 1][c1] -= val
        self.diff[r2 + 1][c2 + 1] += val

    def recover(self):
        """
        還原二維陣列，時間複雜度為 O(N * M)
        """
        grid = [[0] * (self.m + 1) for _ in range(self.n + 1)]
        for i in range(1, self.n + 1):
            for j in range(1, self.m + 1):
                grid[i][j] = (
                    self.diff[i][j]
                    + grid[i - 1][j]
                    + grid[i][j - 1]
                    - grid[i - 1][j - 1]
                )
        return grid


def main():
    # 測試數據
    n, m = 3, 3
    # 1-based grid 初始化
    grid = [
        [0, 0, 0, 0],
        [0, 1, 2, 3],
        [0, 4, 5, 6],
        [0, 7, 8, 9]
    ]

    # 1. 測試前綴和
    pf = PrefixSum2D(grid)
    print(f"Subgrid (2,2) to (3,3) Sum: {pf.query(2, 2, 3, 3)}") # 28

    # 2. 測試差分
    da = DifferenceArray2D(n, m)
    da.update(1, 1, 2, 2, 5)
    da.update(2, 2, 3, 3, 10)
    
    final_grid = da.recover()
    print("Recovered Grid after updates:")
    for row in final_grid[1:]:
        print(*(row[1:]))


if __name__ == "__main__":
    main()
```

---

## 3. 複雜度與防禦要點

在資訊競賽中，前綴和與差分往往是其他複雜演算法（如二分搜尋法、動態規劃）的基礎積木。為了確保程式碼在極端測資下不會獲得「WA (Wrong Answer)」或「RE (Runtime Error)」，請務必遵循以下防禦性設計要點。

### 3.1 複雜度分析
| 操作 | 時間複雜度 | 空間複雜度 | 適用場景 |
| :--- | :--- | :--- | :--- |
| **2D 前綴和建構** | $O(N \times M)$ | $O(N \times M)$ | 預先處理網格，為後續高頻查詢打底。 |
| **2D 前綴和區間查詢** | $O(1)$ | $O(1)$ | 需要在極短時間內獲取任何子矩形區間的和。 |
| **2D 差分單次區間修改** | $O(1)$ | $O(1)$ | 有高達 $10^5 \sim 10^6$ 次矩形加值修改，但查詢次數極少（通常只在最後查詢一次）。 |
| **2D 差分陣列還原** | $O(N \times M)$ | $O(N \times M)$ | 在所有區間修改操作結束後，一次性取得最终的網格狀態。 |

---

### 3.2 數值溢位防禦 (Numerical Overflow)
> [!IMPORTANT]
> 這是二維前綴和最常見的 WA 原因！
* **痛點**：即使原陣列 $grid[i][j]$ 的數值在 32 位元有號整數 `int` 的範圍內（例如每個元素最大為 $10^9$），當網格大小為 $2000 \times 2000$ 且進行累加時，最大可能的前綴和會高達 $2000 \times 2000 \times 10^9 = 4 \times 10^{15}$。這遠遠超出了 `int` 的上限（約 $2.14 \times 10^9$）。
* **解方**：
  * 在 **C++** 中，前綴和陣列 `pref` 與差分陣列 `diff` 必須宣告為 `long long`。
  * 在 **Java** 中，必須使用 `long` 陣列。
  * 在 **Python** 中，整數型態（`int`）會自動處理大數溢位，但需注意在記憶體與運算效能上的開銷。

---

### 3.3 1-based 索引設計的降維打擊
> [!TIP]
> 強烈建議在所有前綴和與差分的實作中，一律使用 **1-based 索引**。
* **原因**：若採用 0-based 索引，當前綴和建構或查詢面臨 $i-1$ 或 $j-1$ 的邊界情況時（例如查詢第 $0$ 列或第 $0$ 行），我們必須寫大量的 `if (i == 0)` 等邊界判斷程式碼，極易出錯且降低可讀性。
* **做法**：將前綴和與差分陣列的空間額外多開 $1 \sim 2$ 大小（即實際大小宣告為 $(N+2) \times (M+2)$），並將第 0 列與第 0 行初始化為 0。這樣一來，即使遇到 $i-1 = 0$ 的情況，也能直接安全存取 `pref[0][j]`，無須額外的邊界分支判斷。

---

### 3.4 邊界極端測資 (Edge Cases)
1. **$N=1$ 或 $M=1$**：
   * 當網格退化為單列（Row Vector）或單行（Column Vector）時，二維前綴和與差分應依然能正常運作。上述模板在設計上均完美相容 $N=1, M=1$ 的極端狀況。
2. **查詢與修改邊界越界**：
   * 在查詢函數 `query(r1, c1, r2, c2)` 中，當傳入的座標超出原陣列邊界，或 $r_1 > r_2$ 時，必須防禦性地直接返回 `0`。
   * 在差分 `update(r1, c1, r2, c2, val)` 中，當範圍超越 $N$ 或 $M$ 時，應直接過濾不合法區間，避免對 `diff[r2+1][c2+1]` 的賦值產生越界。
