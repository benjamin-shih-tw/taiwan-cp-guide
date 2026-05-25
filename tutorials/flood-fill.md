# Flood Fill 連通域搜尋

在競賽程式（Competitive Programming）與演算法面試中，**Flood Fill（連通域搜尋，或稱洪水填充演算法）** 是一個極為基礎且應用廣泛的圖論演算法。它被廣泛應用於二維網格圖（Grid Graph）上的連通分量（Connected Components）計算、島嶼面積統計、封閉區域判定以及可達性分析（Reachability）。

本教學將帶領你深入理解 Flood Fill 的核心觀念，並透過 **深度優先搜尋（DFS）** 與 **廣度優先搜尋（BFS）** 兩種經典思維，建構出高效且穩健的二維網格搜尋程式碼。

---

## 1. 核心觀念與基本原理

### 1.1 網格圖與圖論的對應關係
在二維網格中，我們可以將每一個「格子（Cell）」視為圖論中的一個**頂點（Vertex）**，而相鄰格子之間的通路則視為**邊（Edge）**。
* **網格大小**：通常以 $R$（列數，Rows）與 $C$（行數，Columns）表示。每一個格子的座標可以寫成 $(r, c)$，其中 $0 \le r < R$ 且 $0 \le c < C$。
* **連通關係**：
  * **四連通（4-connectivity）**：每個格子只能與其**上、下、左、右**四個相鄰格子連通。
  * **八連通（8-connectivity）**：除了上下左右外，還包含**左上、東北、西南、右下**四個對角線方向。

### 1.2 搜尋策略：DFS 與 BFS
Flood Fill 的本質就是從某個起點開始，遍歷所有與該起點連通且符合特定條件（例如：同為陸地、同色、未被造訪）的格子。

1. **深度優先搜尋（DFS, Depth-First Search）**
   * **特點**：利用「遞迴」或「自建堆疊（Stack）」一路深入探索，直到碰到邊界或無法前進時再回溯。
   * **優點**：實作極為簡潔、程式碼量小。
   * **缺點**：若連通域極大（例如 $10^5$ 等級的格子連成一條長蛇），遞迴深度過深會導致**系統堆疊溢出（Stack Overflow）**。

2. **廣度優先搜尋（BFS, Breadth-First Search）**
   * **特點**：利用「佇列（Queue）」以起點為中心，一層一層向外擴散探索。
   * **優點**：不會有堆疊溢出的風險；且在無權重網格中，BFS 走過的搜尋路徑即為**最短路徑**。
   * **缺點**：需要額外的佇列空間，且程式碼實作稍微冗長。

### 1.3 方向向量（Direction Vectors）
為了避免寫出四個或八個冗長且重複的 `if-else` 判斷式，競賽中我們統一使用**方向向量**來處理相鄰格子的座標轉移。

* **四向轉移向量**：
  $$\Delta r = \{-1, 1, 0, 0\}, \quad \Delta c = \{0, 0, -1, 1\}$$
  ```cpp
  // C++ 範例
  const int dr[] = {-1, 1, 0, 0};
  const int dc[] = {0, 0, -1, 1};
  
  for (int i = 0; i < 4; ++i) {
      int nr = r + dr[i];
      int nc = c + dc[i];
      // 進行邊界與合法性檢查...
  }
  ```

* **八向轉移向量**：
  $$\Delta r = \{-1, -1, -1, 0, 0, 1, 1, 1\}, \quad \Delta c = \{-1, 0, 1, -1, 1, -1, 0, 1\}$$
  ```cpp
  const int dr[] = {-1, -1, -1, 0, 0, 1, 1, 1};
  const int dc[] = {-1, 0, 1, -1, 1, -1, 0, 1};
  ```

### 1.4 座標合法性驗證（Boundary Verification）
在存取網格陣列之前，必須確保新座標 $(nr, nc)$ 沒有超出陣列邊界，否則會引發越界錯誤（Out of Bounds / Segmentation Fault）。
標準檢查邏輯如下：
```cpp
bool isValid(int r, int c, int R, int C) {
    return r >= 0 && r < R && c >= 0 && c < C;
}
```

### 1.5 造訪標記（Visited Tracking）
為了避免無限循環（例如 A 走向 B，B 又走回 A），我們必須記錄哪些格子已經被造訪過：
1. **輔助陣列法**：宣告一個與網格同等大小的布林陣列 `visited[R][C]`。
2. **原地修改法（In-place Modification）**：若題目允許修改輸入資料，我們可以直接在網格中將已搜尋過的格子改成特定字元或數值（例如將代表陸地的 `1` 直接改成 `0` 或 `#`）。此方法能節省大量的記憶體空間，但在多階段搜尋或需要還原網格時需謹慎使用。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

以下我們以經典題目 **「求最大島嶼面積（Max Area of Island）」** 為例，展示如何使用 DFS 與 BFS 實作完整的 Flood Fill 演算法。
* 網格中 `1` 代表陸地（可通行），`0` 代表水域（不可通行）。
* 連通方向為**四連通**。
* 我們需要找出並回傳所有相連的 `1` 中，面積最大（包含最密集的 `1` 的數量）的島嶼大小。

### 2.1 C++ 實作範本

在 C++ 中，我們提供高效的 `std::vector` 與標準 `std::queue` 實作。為了避免全局變數污染，我們將搜尋演算法封裝於類別中。

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>

using namespace std;

class FloodFillSolver {
private:
    // 四向移動向量
    const int dr[4] = {-1, 1, 0, 0};
    const int dc[4] = {0, 0, -1, 1};

    // 檢查座標是否在網格內
    bool isValid(int r, int c, int R, int C) {
        return r >= 0 && r < R && c >= 0 && c < C;
    }

    // 1. 遞迴 DFS 實作
    int dfs(int r, int c, vector<vector<int>>& grid, vector<vector<bool>>& visited) {
        int R = grid.size();
        int C = grid[0].size();
        visited[r][c] = true;
        int area = 1; // 當前格子計為 1 單位面積

        for (int i = 0; i < 4; ++i) {
            int nr = r + dr[i];
            int nc = c + dc[i];

            if (isValid(nr, nc, R, C) && grid[nr][nc] == 1 && !visited[nr][nc]) {
                area += dfs(nr, nc, grid, visited);
            }
        }
        return area;
    }

    // 2. 疊代 BFS 實作
    int bfs(int startR, int startC, const vector<vector<int>>& grid, vector<vector<bool>>& visited) {
        int R = grid.size();
        int C = grid[0].size();
        queue<pair<int, int>> q;

        q.push({startR, startC});
        visited[startR][startC] = true;
        int area = 0;

        while (!q.empty()) {
            auto [r, c] = q.front();
            q.pop();
            area++;

            for (int i = 0; i < 4; ++i) {
                int nr = r + dr[i];
                int nc = c + dc[i];

                if (isValid(nr, nc, R, C) && grid[nr][nc] == 1 && !visited[nr][nc]) {
                    visited[nr][nc] = true; // 放入佇列時立即標記，避免重複加入
                    q.push({nr, nc});
                }
            }
        }
        return area;
    }

public:
    // 主求解函式
    int getMaxIslandArea(vector<vector<int>>& grid, bool useBFS = false) {
        if (grid.empty() || grid[0].empty()) return 0;

        int R = grid.size();
        int C = grid[0].size();
        vector<vector<bool>> visited(R, vector<bool>(C, false));
        int maxArea = 0;

        for (int r = 0; r < R; ++r) {
            for (int c = 0; c < C; ++c) {
                // 當遇到未造訪的陸地時，啟動連通域搜尋
                if (grid[r][c] == 1 && !visited[r][c]) {
                    int currentArea = 0;
                    if (useBFS) {
                        currentArea = bfs(r, c, grid, visited);
                    } else {
                        currentArea = dfs(r, c, grid, visited);
                    }
                    maxArea = max(maxArea, currentArea);
                }
            }
        }
        return maxArea;
    }
};

int main() {
    // 快速輸入輸出優化
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 測試範例網格
    vector<vector<int>> grid = {
        {0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0},
        {0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0},
        {0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0},
        {0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0},
        {0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0},
        {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0},
        {0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0},
        {0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0}
    };

    FloodFillSolver solver;
    cout << "最大島嶼面積 (DFS): " << solver.getMaxIslandArea(grid, false) << "\n";
    cout << "最大島嶼面積 (BFS): " << solver.getMaxIslandArea(grid, true) << "\n";

    return 0;
}
```

---

### 2.2 Java 實作範本

Java 的實作中，我們使用 `Queue` 搭配 `LinkedList` 或 `ArrayDeque` 進行 BFS 遍歷。為了避免封裝型別（Boxed Types）頻繁建立造成的效能損耗，我們可以使用一維整數編碼來儲存座標對。

```java
import java.util.Queue;
import java.util.ArrayDeque;

public class FloodFillSolver {
    // 四向移動向量
    private static final int[] DR = {-1, 1, 0, 0};
    private static final int[] DC = {0, 0, -1, 1};

    private boolean isValid(int r, int c, int R, int C) {
        return r >= 0 && r < R && c >= 0 && c < C;
    }

    // 1. 遞迴 DFS 實作
    private int dfs(int r, int c, int[][] grid, boolean[][] visited) {
        int R = grid.length;
        int C = grid[0].length;
        visited[r][c] = true;
        int area = 1;

        for (int i = 0; i < 4; ++i) {
            int nr = r + DR[i];
            int nc = c + DC[i];

            if (isValid(nr, nc, R, C) && grid[nr][nc] == 1 && !visited[nr][nc]) {
                area += dfs(nr, nc, grid, visited);
            }
        }
        return area;
    }

    // 2. 疊代 BFS 實作（使用一維編碼：r * C + c 節約記憶體分配）
    private int bfs(int startR, int startC, int[][] grid, boolean[][] visited) {
        int R = grid.length;
        int C = grid[0].length;
        Queue<Integer> queue = new ArrayDeque<>();

        queue.offer(startR * C + startC);
        visited[startR][startC] = true;
        int area = 0;

        while (!queue.isEmpty()) {
            int curr = queue.poll();
            int r = curr / C;
            int c = curr % C;
            area++;

            for (int i = 0; i < 4; ++i) {
                int nr = r + DR[i];
                int nc = c + DC[i];

                if (isValid(nr, nc, R, C) && grid[nr][nc] == 1 && !visited[nr][nc]) {
                    visited[nr][nc] = true; // 必須在加入佇列時立刻標記
                    queue.offer(nr * C + nc);
                }
            }
        }
        return area;
    }

    // 主求解方法
    public int getMaxIslandArea(int[][] grid, boolean useBFS) {
        if (grid == null || grid.length == 0 || grid[0].length == 0) {
            return 0;
        }

        int R = grid.length;
        int C = grid[0].length;
        boolean[][] visited = new boolean[R][C];
        int maxArea = 0;

        for (int r = 0; r < R; ++r) {
            for (int c = 0; c < C; ++c) {
                if (grid[r][c] == 1 && !visited[r][c]) {
                    int currentArea;
                    if (useBFS) {
                        currentArea = bfs(r, c, grid, visited);
                    } else {
                        currentArea = dfs(r, c, grid, visited);
                    }
                    maxArea = Math.max(maxArea, currentArea);
                }
            }
        }
        return maxArea;
    }

    public static void main(String[] args) {
        int[][] grid = {
            {0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0},
            {0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0},
            {0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0},
            {0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0}
        };

        FloodFillSolver solver = new FloodFillSolver();
        System.out.println("最大島嶼面積 (DFS): " + solver.getMaxIslandArea(grid, false));
        System.out.println("最大島嶼面積 (BFS): " + solver.getMaxIslandArea(grid, true));
    }
}
```

---

### 2.3 Python 實作範本

Python 在競賽中需要特別注意 `sys.setrecursionlimit` 以防止遞迴爆棧。此外，使用雙端佇列 `collections.deque` 可以實現 $O(1)$ 的佇列操作。

```python
import sys
from collections import deque

# 提高遞迴深度上限，防止大網格 DFS 導致系統崩潰
sys.setrecursionlimit(200000)

class FloodFillSolver:
    def __init__(self):
        # 四向移動向量
        self.dr = [-1, 1, 0, 0]
        self.dc = [0, 0, -1, 1]

    def _is_valid(self, r: int, c: int, R: int, C: int) -> bool:
        return 0 <= r < R and 0 <= c < C

    # 1. 遞迴 DFS 實作
    def _dfs(self, r: int, c: int, grid: list[list[int]], visited: list[list[bool]]) -> int:
        R, C = len(grid), len(grid[0])
        visited[r][c] = True
        area = 1

        for i in range(4):
            nr = r + self.dr[i]
            nc = c + self.dc[i]

            if self._is_valid(nr, nc, R, C) and grid[nr][nc] == 1 and not visited[nr][nc]:
                area += self._dfs(nr, nc, grid, visited)
        
        return area

    # 2. 疊代 BFS 實作
    def _bfs(self, start_r: int, start_c: int, grid: list[list[int]], visited: list[list[bool]]) -> int:
        R, C = len(grid), len(grid[0])
        queue = deque([(start_r, start_c)])
        visited[start_r][start_c] = True
        area = 0

        while queue:
            r, c = queue.popleft()
            area += 1

            for i in range(4):
                nr = r + self.dr[i]
                nc = c + self.dc[i]

                if self._is_valid(nr, nc, R, C) and grid[nr][nc] == 1 and not visited[nr][nc]:
                    visited[nr][nc] = True  # 放入佇列時立即標記，避免重複造訪
                    queue.append((nr, nc))
        
        return area

    # 主求解方法
    def get_max_island_area(self, grid: list[list[int]], use_bfs: bool = False) -> int:
        if not grid or not grid[0]:
            return 0

        R, C = len(grid), len(grid[0])
        visited = [[False] * C for _ in range(R)]
        max_area = 0

        for r in range(R):
            for c in range(C):
                if grid[r][c] == 1 and not visited[r][c]:
                    if use_bfs:
                        current_area = self._bfs(r, c, grid, visited)
                    else:
                        current_area = self._dfs(r, c, grid, visited)
                    max_area = max(max_area, current_area)
                    
        return max_area

# 測試程式碼
if __name__ == "__main__":
    grid = [
        [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0],
        [0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0]
    ]

    solver = FloodFillSolver()
    print(f"最大島嶼面積 (DFS): {solver.get_max_island_area(grid, use_bfs=False)}")
    print(f"最大島嶼面積 (BFS): {solver.get_max_island_area(grid, use_bfs=True)}")
```

---

## 3. 複雜度與防禦要點

### 3.1 複雜度分析
不論是採用 DFS 或是 BFS，在精準的造訪標記機制下：
* **時間複雜度**：$\mathcal{O}(R \times C)$。
  網格中的每一個格子 $(r, c)$ 最多只會進入一次搜尋核心（進入遞迴或被加入佇列），並對其相鄰的四個方向進行常數次數的判定。因此，總運算時間與網格的總單元數呈線性關係。
* **空間複雜度**：$\mathcal{O}(R \times C)$。
  * **Visited 陣列**：佔用 $\mathcal{O}(R \times C)$ 的記憶體。如果使用原地修改，可優化至 $\mathcal{O}(1)$ 輔助空間。
  * **搜尋額外空間**：
    * **DFS (遞迴)**：在最壞情況下（網格完全連通或呈單一條長蛇狀），遞迴呼叫的系統堆疊深度可達 $\mathcal{O}(R \times C)$。
    * **BFS (佇列)**：佇列在網格呈斜向波浪式擴散時，單次最大排隊點數可達 $\mathcal{O}(R + C)$，最壞情況下亦為 $\mathcal{O}(R \times C)$ 級別。

### 3.2 競賽防禦與避坑指南

#### 1. 記憶體溢出與系統堆疊爆棧（Stack Overflow）
> [!WARNING]
> 在 C++ 與 Java 中，若網格大小達到 $1000 \times 1000 = 10^6$ 以上且全連通，標準遞迴 DFS 將消耗高達數百 MB 的系統堆疊空間，高機率在競賽平台上觸發 `Segmentation Fault` (C++) 或 `StackOverflowError` (Java)。
* **防禦對策**：
  * 對於極大規模的網格，優先使用**疊代式 BFS**。
  * 若必須使用 DFS，可自行利用 `std::stack` 改寫為**非遞迴版本（Explicit Stack）**，使變數配置在一般的記憶體堆（Heap）中而非系統堆疊。
  * 在 Python 中，請務必顯式呼叫 `sys.setrecursionlimit(200000)` 來調高上限。

#### 2. BFS 重複加入佇列導致的超時與記憶體耗盡
> [!IMPORTANT]
> 在實作 BFS 時，**必須在「將相鄰格子加入佇列的當下」立即將其標記為已造訪**（`visited[nr][nc] = true`），絕對不能等到「從佇列取出時」才標記。
* **為什麼？**：如果等到取出才標記，當某個格子有多個相鄰格子同時處於佇列中，它會被重複加入佇列多次。這會導致佇列中的元素指數級增長，瞬間引發系統記憶體耗盡（Memory Limit Exceeded）或執行超時（Time Limit Exceeded）。

#### 3. 數值溢出預防（Numerical Overflow）
在部分進階題目中，網格點可能不只是 `0` 與 `1`，而是包含大量數值的權重（例如求連通域內所有元素的權重總和）。
* **防禦對策**：
  * 若網格點數為 $10^5$，每格的權重上限為 $10^9$，則連通域的總和可能高達 $10^{14}$，遠超 32 位元整數（`int`）的上限。
  * 此時，計算累加面積或累加值的變數務必使用 **64 位元整數**：
    * **C++**：`long long`
    * **Java**：`long`
    * **Python**：內建整數自動支援大數，但仍需注意操作效率。

#### 4. 極端邊界測資（Edge Cases）
在提交程式碼前，務必確認你的實作能通過以下邊界情況：
* **最小網格**：$R = 1, C = 1$ 的情況。
* **無島嶼網格**：網格全部由水域 `0` 組成，應回傳 `0`。
* **全陸地網格**：網格全部由 `1` 組成，應正確回傳 $R \times C$。
* **空網格輸入**：傳入的網格長度為 `0`（例如 `grid = {}`），需優先攔截並回傳 `0`。
