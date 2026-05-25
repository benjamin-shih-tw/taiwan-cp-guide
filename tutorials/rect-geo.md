# 矩陣與幾何模擬 (Matrix and Grid Simulation)

在程式競賽（Competitive Programming）中，**矩陣與幾何模擬**（通常簡稱為 **Grid Simulation** 或 **Rect-Geo**）是極為常見的基礎主題。這類題目通常不涉及複雜的圖論或動態規劃，而是著重於**程式實作的嚴謹度、邊界條件的處理，以及座標變換的數學邏輯**。

常見的題型包括：矩陣順時針/逆時針旋轉、鏡像對稱、網格走訪（如螺旋走訪、蛇行走訪）、障礙物移動模擬等。本文將系統性地介紹二維網格的建模、方向向量的妙用、矩陣旋轉與鏡像的數學推導，並提供高效率且防禦性極佳的 C++、Java、Python 實作範本。

---

## 1. 核心觀念與基本原理

### 1.1 二維網格建模與座標系統

在數學中，我們習慣使用笛卡爾座標系 $(x, y)$，其中 $x$ 軸向右為正，$y$ 軸向上為正。然而，在電腦科學與程式競賽中，二維網格通常以**列（Row）**與**行（Column）**組成的二維陣列（2D Array）表示：

*   **Row ($r$)**：對應垂直方向，**向下**為正，範圍為 $0 \le r < N$。
*   **Column ($c$)**：對應水平方向，**向右**為正，範圍為 $0 \le c < M$。

因此，網格中的某個位置通常表示為 `grid[r][c]`（即第 $r$ 列第 $c$ 行），而非數學上的 $(x, y)$。如果題目給定的是笛卡爾座標 $(x, y)$，通常需要進行轉換：
*   橫座標 $x$ 對應行索引 $c$（若原點在左下角，則需注意 $y$ 的映射關係）。
*   縱座標 $y$ 對應列索引 $r$。

> [!IMPORTANT]
> 建議在實作模擬題時，一律使用 `r` (Row) 和 `c` (Column) 來命名變數，避免混用 `x` 與 `y`。混用 `x` 與 `y` 極易在轉置或邊界判定時引發 Bug。

---

### 1.2 方向向量 (Direction Vectors) 的妙用

在網格模擬中，我們經常需要從當前格 `(r, c)` 移動到相鄰的格子。傳統的做法是寫多個 `if-else` 分支分別處理上、下、左、右，這會導致程式碼冗長且極易出錯。

**方向向量**是將各個方向的座標變化量（位移）預先儲存在陣列中。以常見的**順時針四方向**為例：

| 方向 | 列變化量 ($\Delta r$) | 行變化量 ($\Delta c$) | 索引 ($d$) |
| :--- | :---: | :---: | :---: |
| 右 (Right) | $0$ | $+1$ | $0$ |
| 下 (Down) | $+1$ | $0$ | $1$ |
| 左 (Left) | $0$ | $-1$ | $2$ |
| 上 (Up) | $-1$ | $0$ | $3$ |

我們可以將其定義為：
```cpp
// 順時針四方向：右、下、左、上
const int dr[] = {0, 1, 0, -1};
const int dc[] = {1, 0, -1, 0};
```

當前座標為 `(r, c)`，若要朝方向 `d` 移動，新座標即為：
$$\text{next\_r} = r + dr[d]$$
$$\text{next\_c} = c + dc[d]$$

#### 方向向量的強大優勢：
1.  **旋轉極為簡單**：若要**順時針旋轉 90 度**，只需將方向索引更新為 `d = (d + 1) % 4`；若要**逆時針旋轉 90 度**，則是 `d = (d + 3) % 4`（加上 $3$ 等同於減去 $1$ 並防止負數模除）。
2.  **求相反方向**：相反方向的索引為 `d_opposite = (d + 2) % 4`。
3.  **擴充至八方向**：只需將陣列長度增至 8，加入對角線的變化量即可。

---

### 1.3 網格邊界防禦與越界判定

在造訪相鄰節點時，**越界檢查（Boundary Check）**是防禦性程式設計的第一道防線。我們必須確保新座標 `(next_r, next_c)` 滿足：
$$0 \le \text{next\_r} < N \quad \text{且} \quad 0 \le \text{next\_c} < M$$

> [!WARNING]
> **短路求值（Short-circuit Evaluation）原則**：
> 在判斷邊界與造訪陣列時，必須**先檢查邊界，再造訪陣列**。例如：
> `if (next_r >= 0 && next_r < N && next_c >= 0 && next_c < M && !visited[next_r][next_c])`
> 若將 `!visited[next_r][next_c]` 寫在最前面，當座標越界時，會直接引發記憶體存取違規（Out of Bounds Runtime Error）。

---

### 1.4 矩陣幾何轉換數學推導

#### A. 順時針旋轉 90 度
假設原始矩陣 $A$ 的大小為 $N \times M$（$N$ 列 $M$ 行），旋轉後的新矩陣 $B$ 大小必然為 $M \times N$。
我們來推導任意元素 $A[r][c]$ 旋轉後在新矩陣 $B$ 中的新座標 $(r', c')$：

1. 旋轉後，原本的「列」會變成新矩陣的「行」，且順序倒過來。原本的第 $r$ 列會變成新矩陣的倒數第 $r$ 行，即新行索引 $c' = N - 1 - r$。
2. 原本的「行」會變成新矩陣的「列」。原本的第 $c$ 行會變成新矩陣的第 $c$ 列，即新列索引 $r' = c$。

因此，我們得到映射關係式：
$$B[c][N - 1 - r] = A[r][c]$$

我們可以寫出雙層迴圈進行無腦賦值。

#### B. 鏡像翻轉 (Mirroring)
鏡像不改變矩陣的維度，依然是 $N \times M$。

*   **水平翻轉（Horizontal Mirroring，左右對調）**：
    列索引不變，行索引對稱互換。
    $$B[r][M - 1 - c] = A[r][c]$$
*   **垂直翻轉（Vertical Mirroring，上下對調）**：
    行索引不變，列索引對稱互換。
    $$B[N - 1 - r][c] = A[r][c]$$

---

## 2. 三種語言實作範本 (C++ / Java / Python)

以下提供完整的程式碼範本，包含兩大核心任務：
1.  **任務 A**：將 $N \times M$ 矩陣順時針旋轉 90 度（回傳新矩陣）。
2.  **任務 B**：以螺旋順序（Spiral Order）走訪 $N \times M$ 網格，並使用方向向量與防禦性邊界檢查。

### 2.1 C++ 實作範本

```cpp
#include <iostream>
#include <vector>

using namespace std;

// ==========================================
// 任務 A: 順時針旋轉 2D 矩陣 90 度
// = nullptr/empty 安全性防禦已包含
// ==========================================
vector<vector<int>> rotateMatrix90(const vector<vector<int>>& matrix) {
    if (matrix.empty() || matrix[0].empty()) {
        return {};
    }
    int N = matrix.size();
    int M = matrix[0].size();
    
    // 旋轉後的維度為 M x N
    vector<vector<int>> rotated(M, vector<int>(N));
    
    for (int r = 0; r < N; ++r) {
        for (int c = 0; c < M; ++c) {
            rotated[c][N - 1 - r] = matrix[r][c];
        }
    }
    return rotated;
}

// ==========================================
// 任務 B: 螺旋走訪 N x M 矩陣
// = 使用方向向量 (dr, dc) 與防禦性邊界檢查
// ==========================================
vector<int> spiralTraversal(const vector<vector<int>>& matrix) {
    if (matrix.empty() || matrix[0].empty()) {
        return {};
    }
    int N = matrix.size();
    int M = matrix[0].size();
    
    // 定義順時針四方向：右 (0,1)、下 (1,0)、左 (0,-1)、上 (-1,0)
    const int dr[] = {0, 1, 0, -1};
    const int dc[] = {1, 0, -1, 0};
    
    vector<vector<bool>> visited(N, vector<bool>(M, false));
    vector<int> result;
    result.reserve(N * M);
    
    int r = 0, c = 0; // 起始位置
    int d = 0;        // 起始方向為「右」
    
    for (int i = 0; i < N * M; ++i) {
        result.push_back(matrix[r][c]);
        visited[r][c] = true;
        
        // 預測下一步的座標
        int next_r = r + dr[d];
        int next_c = c + dc[d];
        
        // 防禦性邊界與造訪檢查
        if (next_r < 0 || next_r >= N || next_c < 0 || next_c >= M || visited[next_r][next_c]) {
            // 越界或已造訪，順時針旋轉 90 度
            d = (d + 1) % 4;
            next_r = r + dr[d];
            next_c = c + dc[d];
        }
        
        r = next_r;
        c = next_c;
    }
    
    return result;
}

int main() {
    // 測試資料：3 x 4 矩陣
    vector<vector<int>> grid = {
        {1,  2,  3,  4},
        {5,  6,  7,  8},
        {9, 10, 11, 12}
    };
    
    // 測試旋轉
    vector<vector<int>> rotated = rotateMatrix90(grid);
    cout << "--- 旋轉 90 度後矩陣 ---" << endl;
    for (const auto& row : rotated) {
        for (int val : row) {
            cout << val << " ";
        }
        cout << "\n";
    }
    
    // 測試螺旋走訪
    vector<int> spiral = spiralTraversal(grid);
    cout << "--- 螺旋走訪順序 ---" << endl;
    for (int val : spiral) {
        cout << val << " ";
    }
    cout << endl;
    
    return 0;
}
```

---

### 2.2 Java 實作範本

```java
import java.util.ArrayList;
import java.util.List;

public class RectGeoSimulation {

    // ==========================================
    // 任務 A: 順時針旋轉 2D 矩陣 90 度
    // ==========================================
    public static int[][] rotateMatrix90(int[][] matrix) {
        if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
            return new int[0][0];
        }
        int N = matrix.length;
        int M = matrix[0].length;
        
        // 新矩陣維度為 M x N
        int[][] rotated = new int[M][N];
        
        for (int r = 0; r < N; r++) {
            for (int c = 0; c < M; c++) {
                rotated[c][N - 1 - r] = matrix[r][c];
            }
        }
        return rotated;
    }

    // ==========================================
    // 任務 B: 螺旋走訪 N x M 矩陣
    // ==========================================
    public static List<Integer> spiralTraversal(int[][] matrix) {
        List<Integer> result = new ArrayList<>();
        if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
            return result;
        }
        int N = matrix.length;
        int M = matrix[0].length;
        
        // 方向向量：右、下、左、上
        int[] dr = {0, 1, 0, -1};
        int[] dc = {1, 0, -1, 0};
        
        boolean[][] visited = new boolean[N][M];
        int r = 0, c = 0; // 起始位置
        int d = 0;        // 起始方向：右
        
        int totalCells = N * M;
        for (int i = 0; i < totalCells; i++) {
            result.add(matrix[r][c]);
            visited[r][c] = true;
            
            int nextR = r + dr[d];
            int nextC = c + dc[d];
            
            // 邊界檢查與造訪檢查
            if (nextR < 0 || nextR >= N || nextC < 0 || nextC >= M || visited[nextR][nextC]) {
                d = (d + 1) % 4; // 轉向
                nextR = r + dr[d];
                nextC = c + dc[d];
            }
            
            r = nextR;
            c = nextC;
        }
        
        return result;
    }

    public static void main(String[] args) {
        int[][] grid = {
            {1,  2,  3,  4},
            {5,  6,  7,  8},
            {9, 10, 11, 12}
        };

        // 測試旋轉
        int[][] rotated = rotateMatrix90(grid);
        System.out.println("--- 旋轉 90 度後矩陣 ---");
        for (int[] row : rotated) {
            for (int val : row) {
                System.out.print(val + " ");
            }
            System.out.println();
        }

        // 測試螺旋走訪
        List<Integer> spiral = spiralTraversal(grid);
        System.out.println("--- 螺旋走訪順序 ---");
        for (int val : spiral) {
            System.out.print(val + " ");
        }
        System.out.println();
    }
}
```

---

### 2.3 Python 實作範本

```python
from typing import List

# ==========================================
# 任務 A: 順時針旋轉 2D 矩陣 90 度
# ==========================================
def rotate_matrix_90(matrix: List[List[int]]) -> List[List[int]]:
    if not matrix or not matrix[0]:
        return []
    
    N = len(matrix)
    M = len(matrix[0])
    
    # 建立 M x N 的新矩陣
    rotated = [[0] * N for _ in range(M)]
    
    for r in range(N):
        for c in range(M):
            rotated[c][N - 1 - r] = matrix[r][c]
            
    return rotated

# ==========================================
# 任務 B: 螺旋走訪 N x M 矩陣
# ==========================================
def spiral_traversal(matrix: List[List[int]]) -> List[int]:
    if not matrix or not matrix[0]:
        return []
    
    N = len(matrix)
    M = len(matrix[0])
    
    # 方向向量：右、下、左、上
    dr = [0, 1, 0, -1]
    dc = [1, 0, -1, 0]
    
    visited = [[False] * M for _ in range(N)]
    result = []
    
    r, c = 0, 0  # 起始點
    d = 0        # 起始方向：右
    
    for _ in range(N * M):
        result.append(matrix[r][c])
        visited[r][c] = True
        
        # 預測下一步
        next_r = r + dr[d]
        next_c = c + dc[d]
        
        # 邊界與造訪判斷
        if not (0 <= next_r < N and 0 <= next_c < M) or visited[next_r][next_c]:
            d = (d + 1) % 4  # 順時針旋轉
            next_r = r + dr[d]
            next_c = c + dc[d]
            
        r = next_r
        c = next_c
        
    return result

# 測試用例
if __name__ == "__main__":
    grid = [
        [1,  2,  3,  4],
        [5,  6,  7,  8],
        [9, 10, 11, 12]
    ]
    
    # 測試旋轉
    rotated = rotate_matrix_90(grid)
    print("--- 旋轉 90 度後矩陣 ---")
    for row in rotated:
        print(" ".join(map(str, row)))
        
    # 測試螺旋走訪
    spiral = spiral_traversal(grid)
    print("--- 螺旋走訪順序 ---")
    print(" ".join(map(str, spiral)))
```

---

## 3. 複雜度與防禦要點

### 3.1 複雜度分析

| 操作 | 時間複雜度 | 空間複雜度 | 備註 |
| :--- | :---: | :---: | :--- |
| **矩陣旋轉 90 度** | $\mathcal{O}(N \times M)$ | $\mathcal{O}(N \times M)$ | 每個元素皆需移動一次。若為正方形矩陣且允許原地修改，可優化至 $\mathcal{O}(1)$ 輔助空間。 |
| **螺旋走訪** | $\mathcal{O}(N \times M)$ | $\mathcal{O}(N \times M)$ | 每個網格只會走訪一次。若不使用 `visited` 陣列，而改用邊界指針收縮，輔助空間可降至 $\mathcal{O}(1)$。 |

> [!TIP]
> **正方形矩陣的原地旋轉優化 ($\mathcal{O}(1)$ 輔助空間)**：
> 若矩陣為 $N \times N$，我們可以分兩步進行原地旋轉：
> 1.  **沿著主對角線轉置（Transpose）**：交換所有 $A[i][j]$ 與 $A[j][i]$（其中 $i < j$）。
> 2.  **水平鏡像翻轉（Reverse Rows）**：將每一行的元素左右翻轉。
> 這樣就不需要額外宣告一個 $N \times N$ 的空間！

---

### 3.2 數值溢位防範 (Numerical Overflow Prevention)

在標準網格大小（例如 $N, M \le 10^3$）的題型中，座標通常不會發生溢位。然而，在以下幾種延伸場景中需要高度警惕：

1.  **累加網格權重 / 前綴和**：
    如果每個網格 `grid[r][c]` 的值高達 $10^9$，在求取區域前綴和（2D Range Sum Query）或累加路徑權重時，總和會輕易超過 32 位元有號整數的上限（$2 \times 10^9$）。
    *   **防禦措施**：在 C++ 中應使用 `long long`；在 Java 中使用 `long`；在 Python 中雖然整數會自動擴展，但仍需注意大型矩陣運算的效率。
2.  **虛擬超大網格（Coordinate Compression）**：
    有些題目中網格的大小高達 $10^9 \times 10^9$，但障礙物或關鍵點的數量 $K \le 10^5$。此時若直接開辟二維陣列會造成 **MLE (Memory Limit Exceeded)**。
    *   **防禦措施**：必須改用**座標離散化（Coordinate Compression）**，將稀疏的幾何座標映射到緊湊的索引區間，或直接以雜湊表（Hash Map）儲存障礙物座標。

---

### 3.3 極端與邊界狀況 (Edge Cases)

在送出解答前，請務必手動或寫測資模擬以下三種極端狀況：

*   **$N = 1, M = 1$（單一網格）**：
    此時矩陣旋轉後維度依然是 $1 \times 1$。螺旋走訪應立即輸出該唯一元素並安全結束，絕不能因為查無下一步而陷入無窮迴圈。
*   **$N = 1, M > 1$（單列網格，水平線段）**：
    矩陣旋轉後必須變為 $M \times 1$ 的直立矩陣。螺旋走訪必須能在一列中由左至右順利走完，並在轉向時偵測到邊界而停止。
*   **$N > 1, M = 1$（單行網格，垂直線段）**：
    與水平線段相反，旋轉後變為 $1 \times N$ 的水平矩陣。螺旋走訪應由上至下線性完成。

在設計螺旋走訪時，使用我們提供的 `for (int i = 0; i < N * M; ++i)` 控制走訪總步數是極佳的防禦性寫法。相較於寫 `while` 迴圈並手動控制結束條件，這種寫法能夠**百分之百保證程式絕不會因為邏輯 Bug 而陷入死鎖的無窮迴圈**。
