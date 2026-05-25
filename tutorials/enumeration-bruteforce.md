# 暴力枚舉與剪枝 (Complete Search & Pruning)

在資訊科學競賽（Competitive Programming）中，**「完全搜尋（Complete Search）」**與**「暴力枚舉（Brute Force）」**是解決問題最直觀、最不易出錯，同時也是最基礎的破局武器。當我們面對一個未知的難題，暴力法往往能為我們提供正確性驗證的基準（Stress Test 的對拍程式），或是幫助我們在無法想出高效演算法時，穩健地拿到局部測資的「保底分數（Subtasks）」。

然而，盲目的暴力搜索往往會帶來「狀態空間爆炸」的惡果，導致程式執行時間超出限制（TLE）。這時，我們需要引入**「剪枝（Pruning）」**技術，在遞迴搜尋樹中提早斬斷不可能產生解的分支，從而讓暴力法發揮出驚人的效率。

---

## 1. 核心觀念與基本原理

### A. 完全搜尋 (Complete Search) 與狀態空間
完全搜尋的核心精神是：**「不重、不漏地窮舉所有可能的狀態，並逐一檢驗其合法性，從而找出正確解或最佳解。」**
在設計枚舉演算法前，我們必須對**狀態空間（State Space）**的大小進行精準的數學評估。若狀態空間的大小為 $S$，則暴力法在沒有剪枝的情況下，時間複雜度通常與 $S$ 成正比。

以下為競賽中常見的狀態空間模型與其極限範圍（假設運算限制為 $10^8$ 次，約為 1 秒執行時間）：

1. **線性或區間枚舉**：$O(N)$ 或 $O(N^2)$。例如尋找陣列中的所有數對，通常適用於 $N \le 10^4 \sim 10^5$。
2. **子集合枚舉 (Subset)**：$O(2^N)$。每個元素有「選」與「不選」兩種狀態，一般適用於 $N \le 20 \sim 22$。
3. **排列枚舉 (Permutation)**：$O(N!)$。$N$ 個元素的所有排列順序，一般適用於 $N \le 10 \sim 11$。
4. **因數與質因數枚舉**：利用數學性質，可以將原本 $O(N)$ 的搜尋空間壓縮至 $O(\sqrt{N})$，大幅拓寬了可處理的數值範圍。

---

### B. 剪枝技術 (Pruning) — 讓搜尋樹「瘦身」
剪枝的本質是**「在遞迴搜尋（DFS / Backtracking）的過程中，提早判斷當前分支不可能產生答案，並立即回溯（Return），不再往下搜尋。」**這就像是將搜尋樹上枯死或無用的枝葉剪掉。

一個經典的搜尋樹剪枝示意如下：

```mermaid
graph TD
    Root((起點)) --> A((選擇 A))
    Root --> B((選擇 B))
    A --> C((狀態 C))
    A --> D((狀態 D))
    B --> E((狀態 E))
    E --> F[可行性剪枝: 不合法!]
    style F fill:#ffcccc,stroke:#ff3333,stroke-width:2px
    classDef pruned fill:#eee,stroke:#bbb,stroke-dasharray: 5 5;
    E -.-> G((狀態 G)) class G pruned;
    E -.-> H((狀態 H)) class H pruned;
```

我們通常將剪枝策略分為以下三大類型：

#### 1. 可行性剪枝 (Feasibility Pruning)
在搜尋的某個步驟中，如果發現當前的狀態已經**違反了題目設定的約束條件**（例如座標越界、剩餘容量為負數、已無法滿足特定規則），說明該分支往下絕對不可能有合法解。此時應立即中斷搜尋並回溯。
* **核心邏輯**：`if (當前狀態已不合法) return;`

#### 2. 最佳性剪枝 / 最優性剪枝 (Optimality Pruning)
在求「最小值」或「最大值」的問題中，我們會維護一個當前的全域最佳解 `best_ans`。如果在搜尋的中途，發現當前分支所累積的成本/代價已經**大於或等於** `best_ans`（以求最小化問題為例），那麼即使後面能找到可行解，也絕對無法超越已知的最佳解。此時應果斷回溯。
* **核心邏輯**：`if (當前累積成本 >= 已知最佳解) return;`

#### 3. 冗餘剪枝與對稱性剪枝 (Redundancy & Symmetry Pruning)
* **消除重複狀態**：若多條不同的搜尋路徑會導向完全等價的狀態，我們應利用 Hash 表或 Visited 陣列進行去重，只搜尋其中一條。
* **規定枚舉順序（排序優化）**：例如在枚舉組合（Combination）而非排列（Permutation）時，為了避免重複考慮 `{1, 2}` 與 `{2, 1}`，我們可以強制規定每次加入的元素索引必須遞增（即 $idx_{next} > idx_{curr}$）。
* **降序優先搜尋**：在背包或子集合和問題中，先將資料**由大到小排序**。因為數值較大的元素能讓我們累積的和更快地接近或超過目標限制，從而能更早地觸發「可行性剪枝」，大幅減少搜尋樹的深層節點數。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

### A. 二維網格搜尋與防禦性邊界檢查 (Grid Search)
此範本展示如何在二維網格中，利用 **方向向量 (Direction Vectors)** 與 **DFS 回溯** 進行目標字串的完全搜尋（類似經典的 Word Search 問題，在網格中尋找相鄰字符組成的特定單字，路徑中同一格子不可重複使用）。

#### C++ 實作範本

```cpp
#include <bits/stdc++.h>
using namespace std;

// 定義四方位移動向量：上、下、左、右
const int dr[] = {-1, 1, 0, 0};
const int dc[] = {0, 0, -1, 1};

class GridSearcher {
private:
    int R, C;
    vector<vector<char>> grid;
    vector<vector<bool>> visited;

    // 防禦性邊界與合法性檢查
    bool isValid(int r, int c) {
        return (r >= 0 && r < R && c >= 0 && c < C);
    }

    // 遞迴完全搜尋核心
    bool dfs(int r, int c, int wordIdx, const string& word) {
        // 可行性剪枝：邊界越界、已造訪過、或是字元不匹配
        if (!isValid(r, c) || visited[r][c] || grid[r][c] != word[wordIdx]) {
            return false;
        }

        // 成功基底條件：當前字元匹配且已達單字結尾
        if (wordIdx == word.length() - 1) {
            return true;
        }

        // 標記當前格點為已造訪，防止同一條路徑重複使用
        visited[r][c] = true;

        // 枚舉四個可能的方向
        for (int d = 0; d < 4; ++d) {
            int nr = r + dr[d];
            int nc = c + dc[d];
            // 若在鄰近分支尋找到答案，提早結束搜尋（最佳性剪枝）
            if (dfs(nr, nc, wordIdx + 1, word)) {
                return true;
            }
        }

        // 回溯：將狀態還原，供其他分支搜尋
        visited[r][c] = false;
        return false;
    }

public:
    bool exist(const vector<vector<char>>& board, const string& word) {
        if (board.empty() || board[0].empty() || word.empty()) return false;
        
        R = board.size();
        C = board[0].size();
        grid = board;
        visited.assign(R, vector<bool>(C, false));

        // 窮舉網格中的每一個格點作為起點
        for (int i = 0; i < R; ++i) {
            for (int j = 0; j < C; ++j) {
                if (dfs(i, j, 0, word)) {
                    return true;
                }
            }
        }
        return false;
    }
};

int main() {
    // 競程輸入輸出優化
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<vector<char>> board = {
        {'A', 'B', 'C', 'E'},
        {'S', 'F', 'C', 'S'},
        {'A', 'D', 'E', 'E'}
    };
    string word = "ABCCED";

    GridSearcher searcher;
    if (searcher.exist(board, word)) {
        cout << "找到單字路徑！\n";
    } else {
        cout << "未找到單字路徑。\n";
    }

    return 0;
}
```

#### Java 實作範本

```java
import java.io.*;
import java.util.*;

public class GridSearch {
    // 定義方向向量
    private static final int[] DR = {-1, 1, 0, 0};
    private static final int[] DC = {0, 0, -1, 1};
    
    private int R, C;
    private char[][] grid;
    private boolean[][] visited;
    
    private boolean isValid(int r, int c) {
        return r >= 0 && r < R && c >= 0 && c < C;
    }
    
    private boolean dfs(int r, int c, int wordIdx, String word) {
        // 可行性剪枝：防禦越界、已造訪、字元不合
        if (!isValid(r, c) || visited[r][c] || grid[r][c] != word.charAt(wordIdx)) {
            return false;
        }
        
        // 成功終止條件
        if (wordIdx == word.length() - 1) {
            return true;
        }
        
        visited[r][c] = true; // 標記
        
        for (int d = 0; d < 4; d++) {
            int nr = r + DR[d];
            int nc = c + DC[d];
            if (dfs(nr, nc, wordIdx + 1, word)) {
                return true; // 提早剪枝回傳
            }
        }
        
        visited[r][c] = false; // 回溯
        return false;
    }
    
    public boolean exist(char[][] board, String word) {
        if (board == null || board.length == 0 || board[0].length == 0 || word == null || word.isEmpty()) {
            return false;
        }
        R = board.length;
        C = board[0].length;
        grid = board;
        visited = new boolean[R][C];
        
        for (int i = 0; i < R; i++) {
            for (int j = 0; j < C; j++) {
                if (dfs(i, j, 0, word)) {
                    return true;
                }
            }
        }
        return false;
    }

    public static void main(String[] args) {
        char[][] board = {
            {'A', 'B', 'C', 'E'},
            {'S', 'F', 'C', 'S'},
            {'A', 'D', 'E', 'E'}
        };
        String word = "ABCCED";
        
        GridSearch searcher = new GridSearch();
        if (searcher.exist(board, word)) {
            System.out.println("找到單字路徑！");
        } else {
            System.out.println("未找到單字路徑。");
        }
    }
}
```

#### Python 實作範本

```python
import sys

# 設定最大遞迴深度，防禦深層遞迴崩潰
sys.setrecursionlimit(2000)

class GridSearch:
    def __init__(self):
        self.dr = [-1, 1, 0, 0]
        self.dc = [0, 0, -1, 1]
        self.R = 0
        self.C = 0
        self.grid = []
        self.visited = []

    def is_valid(self, r: int, c: int) -> bool:
        return 0 <= r < self.R and 0 <= c < self.C

    def dfs(self, r: int, c: int, word_idx: int, word: str) -> bool:
        # 可行性剪枝
        if not self.is_valid(r, c) or self.visited[r][c] or self.grid[r][c] != word[word_idx]:
            return False
        
        # 成功終止條件
        if word_idx == len(word) - 1:
            return True
            
        self.visited[r][c] = True # 標記已造訪
        
        # 搜尋四個方位
        for d in range(4):
            nr = r + self.dr[d]
            nc = c + self.dc[d]
            if self.dfs(nr, nc, word_idx + 1, word):
                return True # 提早回傳
                
        self.visited[r][c] = False # 回溯
        return False

    def exist(self, board: list[list[str]], word: str) -> bool:
        if not board or not board[0] or not word:
            return False
        self.R = len(board)
        self.C = len(board[0])
        self.grid = board
        self.visited = [[False] * self.C for _ in range(self.R)]
        
        for i in range(self.R):
            for j in range(self.C):
                if self.dfs(i, j, 0, word):
                    return True
        return False

if __name__ == "__main__":
    board = [
        ['A', 'B', 'C', 'E'],
        ['S', 'F', 'C', 'S'],
        ['A', 'D', 'E', 'E']
    ]
    word = "ABCCED"
    
    searcher = GridSearch()
    if searcher.exist(board, word):
        print("找到單字路徑！")
    else:
        print("未找到單字路徑。")
```

---

### B. 高效因數枚舉 (Factor Enumeration)
本範本在 $O(\sqrt{N})$ 時間複雜度內枚舉 $N$ 的所有正因數，並做足安全邊界防禦與排序。

#### C++ 實作範本

```cpp
#include <bits/stdc++.h>
using namespace std;

// 高效因數枚舉，時間複雜度 O(sqrt(N))
vector<long long> get_factors(long long n) {
    vector<long long> factors;
    if (n <= 0) return factors;
    
    // 安全防禦：使用 i <= n / i 代替 i * i <= n，防止當 i 接近 2^31 時 i * i 溢位
    for (long long i = 1; i <= n / i; ++i) {
        if (n % i == 0) {
            factors.push_back(i);
            
            // 完全平方數防禦：當 i != n / i 時才存入另一個對稱因數，避免重複
            if (i != n / i) {
                factors.push_back(n / i);
            }
        }
    }
    
    // 依大小排序 (O(F log F)，F 為因數個數，F 對於 10^12 以內的數通常極小)
    sort(factors.begin(), factors.end());
    return factors;
}

int main() {
    long long n = 100000000000LL; // 10^11
    vector<long long> ans = get_factors(n);
    
    cout << n << " 的因數個數為: " << ans.size() << "\n";
    cout << "前五個因數分別為: ";
    for (int i = 0; i < min(5, (int)ans.size()); ++i) {
        cout << ans[i] << " ";
    }
    cout << "\n";
    return 0;
}
```

#### Java 實作範本

```java
import java.util.*;

public class FactorEnumeration {
    // 高效因數枚舉，時間複雜度 O(sqrt(N))
    public static List<Long> getFactors(long n) {
        List<Long> factors = new ArrayList<>();
        if (n <= 0) return factors;
        
        // 防溢位迴圈設計
        for (long i = 1; i <= n / i; i++) {
            if (n % i == 0) {
                factors.add(i);
                
                // 處理完全平方數避免重複
                if (i != n / i) {
                    factors.add(n / i);
                }
            }
        }
        
        // 排序後回傳
        Collections.sort(factors);
        return factors;
    }

    public static void main(String[] args) {
        long n = 100000000000L;
        List<Long> ans = getFactors(n);
        
        System.out.println(n + " 的因數個數為: " + ans.size());
        System.out.print("前五個因數分別為: ");
        for (int i = 0; i < Math.min(5, ans.size()); i++) {
            System.out.print(ans.get(i) + " ");
        }
        System.out.println();
    }
}
```

#### Python 實作範本

```python
def get_factors(n: int) -> list[int]:
    """
    高效因數枚舉模板，時間複雜度 O(sqrt(N))
    """
    if n <= 0:
        return []
        
    factors = []
    i = 1
    # 相當於 i * i <= n 且無溢位問題（Python 自動支援大數）
    while i * i <= n:
        if n % i == 0:
            factors.append(i)
            # 處理完全平方數
            if i != n // i:
                factors.append(n // i)
        i += 1
        
    factors.sort()
    return factors

if __name__ == "__main__":
    n = 100000000000
    ans = get_factors(n)
    print(f"{n} 的因數個數為: {len(ans)}")
    print(f"前五個因數分別為: {ans[:5]}")
```

---

### C. 條件子集合檢查與遞迴剪枝 (Subset Sum with Pruning)
給定一個含有 $N$ 個正整數的陣列 $A$ 與目標值 $K$，判斷是否存在一個子集合（每個元素最多選取一次），使其元素和恰好等於 $K$。
本範本整合了**「降序排序優化」**、**「可行性剪枝」**與**「後綴剩餘和剪枝」**，將原本 $O(2^N)$ 的搜索空間進行最大幅度的極致壓縮。

#### C++ 實作範本

```cpp
#include <bits/stdc++.h>
using namespace std;

class SubsetSumPruning {
private:
    vector<long long> nums;
    long long target;
    vector<long long> suffix_sums; // 後綴和陣列，用於「剩餘值剪枝」

    // DFS 遞迴核心：當前考慮決策第 index 個元素，當前累積和為 curr_sum
    bool dfs(int index, long long curr_sum) {
        // 1. 成功基底條件：當前累積和恰好等於目標值
        if (curr_sum == target) {
            return true;
        }
        
        // 2. 可行性剪枝：因為元素皆為正數，一旦累積和超出目標，後續無論如何選都不可能成功
        if (curr_sum > target) {
            return false;
        }
        
        // 3. 後綴和剪枝：如果「當前和 + 剩餘的所有數字之和」依然小於目標，直接放棄該分支
        if (index >= nums.size() || curr_sum + suffix_sums[index] < target) {
            return false;
        }

        // 4. 決策分支（排序優化：優先考慮數值較大者，使其儘早觸發可行性剪枝）
        // 分支 A：選擇 nums[index]
        if (dfs(index + 1, curr_sum + nums[index])) {
            return true;
        }
        
        // 分支 B：不選擇 nums[index]
        if (dfs(index + 1, curr_sum)) {
            return true;
        }

        return false;
    }

public:
    bool hasSubsetSum(const vector<long long>& input_nums, long long k) {
        if (k == 0) return true; // 空集合之和為 0
        if (input_nums.empty()) return false;
        
        nums = input_nums;
        target = k;
        
        // 降序排序（由大到小）：這是讓可行性剪枝發揮極致威力的關鍵
        sort(nums.begin(), nums.end(), greater<long long>());
        
        // 預處理後綴和 (Suffix Sums)
        int n = nums.size();
        suffix_sums.assign(n + 1, 0);
        for (int i = n - 1; i >= 0; --i) {
            suffix_sums[i] = suffix_sums[i + 1] + nums[i];
        }

        return dfs(0, 0);
    }
};

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<long long> A = {24, 13, 8, 5, 3, 2, 1};
    long long target = 37;

    SubsetSumPruning solver;
    if (solver.hasSubsetSum(A, target)) {
        cout << "存在符合條件的子集合！\n";
    } else {
        cout << "不存在符合條件的子集合。\n";
    }

    return 0;
}
```

#### Java 實作範本

```java
import java.io.*;
import java.util.*;

public class SubsetSumPruning {
    private Long[] nums;
    private long target;
    private long[] suffixSums;

    private boolean dfs(int index, long currSum) {
        if (currSum == target) {
            return true;
        }
        // 1. 可行性剪枝
        if (currSum > target) {
            return false;
        }
        // 2. 後綴和剪枝
        if (index >= nums.length || currSum + suffixSums[index] < target) {
            return false;
        }

        // 3. 決策分支出發（降序排列，優先做大數抉擇）
        if (dfs(index + 1, currSum + nums[index])) {
            return true;
        }
        if (dfs(index + 1, currSum)) {
            return true;
        }

        return false;
    }

    public boolean hasSubsetSum(long[] inputNums, long k) {
        if (k == 0) return true;
        if (inputNums == null || inputNums.length == 0) return false;

        int n = inputNums.length;
        this.nums = new Long[n];
        for (int i = 0; i < n; i++) {
            this.nums[i] = inputNums[i];
        }
        this.target = k;

        // 排序優化：降序排序
        Arrays.sort(this.nums, Collections.reverseOrder());

        // 預處理後綴和
        this.suffixSums = new long[n + 1];
        for (int i = n - 1; i >= 0; i--) {
            this.suffixSums[i] = this.suffixSums[i + 1] + this.nums[i];
        }

        return dfs(0, 0);
    }

    public static void main(String[] args) {
        long[] A = {24, 13, 8, 5, 3, 2, 1};
        long target = 37;

        SubsetSumPruning solver = new SubsetSumPruning();
        if (solver.hasSubsetSum(A, target)) {
            System.out.println("存在符合條件的子集合！");
        } else {
            System.out.println("不存在符合條件的子集合。");
        }
    }
}
```

#### Python 實作範本

```python
class SubsetSumPruning:
    def __init__(self):
        self.nums = []
        self.target = 0
        self.suffix_sums = []

    def _dfs(self, index: int, curr_sum: int) -> bool:
        if curr_sum == self.target:
            return True
        # 1. 可行性剪枝
        if curr_sum > self.target:
            return False
        # 2. 後綴和剪枝
        if index >= len(self.nums) or curr_sum + self.suffix_sums[index] < self.target:
            return False

        # 3. 決策分支（降序排序後優先選擇較大值）
        if self._dfs(index + 1, curr_sum + self.nums[index]):
            return True
        if self._dfs(index + 1, curr_sum):
            return True

        return False

    def has_subset_sum(self, input_nums: list[int], k: int) -> bool:
        if k == 0:
            return True
        if not input_nums:
            return False
            
        # 排序優化：降序排序
        self.nums = sorted(input_nums, reverse=True)
        self.target = k
        
        # 預處理後綴和
        n = len(self.nums)
        self.suffix_sums = [0] * (n + 1)
        for i in range(n - 1, -1, -1):
            self.suffix_sums[i] = self.suffix_sums[i + 1] + self.nums[i]
            
        return self._dfs(0, 0)

if __name__ == "__main__":
    A = [24, 13, 8, 5, 3, 2, 1]
    target = 37
    
    solver = SubsetSumPruning()
    if solver.has_subset_sum(A, target):
        print("存在符合條件的子集合！")
    else:
        print("不存在符合條件的子集合。")
```

---

## 3. 複雜度與防禦要點

### A. 複雜度精密估算
在競程中，雖然暴力枚舉與剪枝的最壞時間複雜度（Worst Case）往往無法得到多項式時間級別的改善（例如子集合和問題最壞仍是 $O(2^N)$），但我們關注的是**「均攤」**或**「實際狀態數」**。

* **二維網格搜尋**：最壞時間複雜度為 $O(R \times C \times 4^L)$，其中 $L$ 是搜尋的單字長度。但在實作中，一旦發生第一個字元不匹配，便會以 $O(1)$ 的效率被「可行性剪枝」攔截。因此，實際運作的常數極小。
* **因數枚舉**：時間複雜度穩定為 $O(\sqrt{N} + F \log F)$。當 $N \le 10^{12}$ 時，$\sqrt{N} \le 10^6$，可以在數毫秒內極速完成。
* **子集合遞迴剪枝**：加上「降序排序」、「可行性剪枝」與「後綴和剩餘值剪枝」後，實際搜尋狀態往往能被壓縮數百至數萬倍。在競程實測中，原本只能通過 $N \le 22$ 的暴力法，往往能在 0.5 秒內順利跑完 $N \le 40$ 且解答高度分布不均的測資。

---

### B. 競程防禦要點 (Bug-Prevention Checklist)

#### 1. 整數溢位 (Integer Overflow)
* **因數枚舉中的乘法溢位**：傳統寫法 `for (int i = 1; i * i <= n; i++)`。當 $N$ 大於 $2 \times 10^9$ 時，`i * i` 會在 $32$-bit 有號整數中溢位成負數，引發死循環（無窮迴圈）。
  * **防禦對策**：使用 `i <= n / i` 作為迴圈終止條件，或將變數聲明為 `long long` (C++) / `long` (Java)。
* **累積求和溢位**：子集合累加和或因數和可能會超出 $32$-bit 整數範圍。
  * **防禦對策**：全面採用 $64$-bit 整數類型存儲和運算。

#### 2. 遞迴系統堆疊溢位 (Stack Overflow)
* 在 C++、Java 或 Python 中，深層遞迴會消耗大量的系統調用棧（System Stack）。
  * **防禦對策**：
    * C++：一般現代競賽平台（如 Codeforces、AtCoder）已開放與實體記憶體同等大小的系統棧，但如果是在本地編譯，請留意系統限制。
    * Python：預設遞迴上限為 1000。請務必引入 `sys` 並執行 `sys.setrecursionlimit(200000)` 來擴大遞迴深度上限。

#### 3. 極端邊界與特例防禦
* **$N = 0$ 或 $N = 1$ 的特例**：因數枚舉中，若輸入為 $1$，需確保不會加入重複的因數。
* **完全平方數重複處理**：如 $N = 36$，當枚舉至 $6$ 時，$36 / 6 = 6$，若沒有加入 `i != n / i` 判斷，因數集合將會出現重複的 $6$。
* **目標值 $K = 0$**：需確認當 `K = 0` 時，程式碼能否正確判定「空集合（和為 0）」為合法的子集合。
