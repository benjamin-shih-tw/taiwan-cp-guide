# 二分搜尋進階：二分答案與單調性優化

二分搜尋（Binary Search）在演算法競賽中，其應用範疇遠不止於「在有序陣列中尋找特定元素」。它的本質是在**具有單調性（Monotonicity）的決策空間中，尋找可行與不可行的邊界**。當我們將這個思想應用於求解最佳化問題時，便誕生了極具威力的技術——**二分答案（Binary Search on Answer / Bisection on Monotonic Functions）**。

---

## 1. 核心觀念與基本原理

### 1.1 單調性（Monotonicity）與二分搜尋的本質

對於一個定義在定義域 $D$ 上的判定函數 $P(x) \in \{\text{True}, \text{False}\}$，如果對於任意的 $a, b \in D$ 且 $a \le b$，皆滿足：
$$P(b) = \text{True} \implies P(a) = \text{True}$$
或者反之：
$$P(a) = \text{True} \implies P(b) = \text{True}$$
則稱函數 $P(x)$ 具有**單調性**。

一旦判定問題具有單調性，答案空間就會被劃分為涇渭分明的兩個部分（例如前半段全是 $\text{True}$，後半段全是 $\text{False}$）。此時，我們不需要遍歷所有可能的答案，而是可以透過「每次折半」的方式，在 $O(\log(\text{值域}))$ 的時間複雜度內精確定位出**可行與不可行的分界點**。

```
狀態空間分佈圖（最大化最小值）：
[ True, True, True, True, True, False, False, False ]
                            ^
                         關鍵邊界（最後一個 True）
```

---

### 1.2 二分答案（Binary Search on Answer）

許多最優化問題（如：「求某個指標的最大值」或「求某個指標的最小值」）很難直接一步求解，但**判定給定的答案是否可行**卻非常簡單。

二分答案的核心步驟如下：
1. **確定單調性**：證明當答案為 $x$ 可行時，所有比 $x$ 小（或大）的答案也必定可行。
2. **確定值域區間 $[L, R]$**：找出答案的下界 $L$ 與上界 $R$，確保最優解必定落在此區間內。
3. **撰寫判定函數 `check(mid)`**：實作一個高效的演算法（通常是貪心法、動態規劃或圖論算法），用以判斷當答案為 `mid` 時是否合法。
4. **區間縮減**：根據 `check(mid)` 的回傳值，將搜尋區間折半，直到區間收斂。

#### 模式一：最大化最小值（Maximize the Minimum）
這種問題的判定函數性質通常為 `[True, True, ..., True, False, False, ...]`。我們要尋找的是**最後一個滿足條件的合理值**。

*   **區間更新邏輯**：
    *   若 `check(mid) == true`，代表 `mid` 是可行的，我們希望嘗試更大的值，故將左邊界右移：`l = mid`。
    *   若 `check(mid) == false`，代表 `mid` 太大了不可行，我們必須嘗試更小的值，故將右邊界左移：`r = mid - 1`。
*   **中間值計算**：由於 `l = mid` 可能會導致在區間長度為 2（即 `r = l + 1`）時陷入死迴圈，因此 `mid` 必須向上取整：
    $$\text{mid} = l + \frac{r - l + 1}{2}$$

#### 模式二：最小化最大值（Minimize the Maximum）
這種問題的判定函數性質通常為 `[False, False, ..., True, True, True]`。我們要尋找的是**第一個滿足條件的合理值**。

*   **區間更新邏輯**：
    *   若 `check(mid) == true`，代表 `mid` 是可行的，但我們希望尋找更小、更優的答案，故將右邊界左移：`r = mid`。
    *   若 `check(mid) == false`，代表 `mid` 太小了不可行，答案必然更大，故將左邊界右移：`l = mid + 1`。
*   **中間值計算**：此時 `mid` 採用一般的向下取整即可：
    $$\text{mid} = l + \frac{r - l}{2}$$

---

### 1.3 離散型二分搜尋 vs 連續型二分搜尋

根據答案所在的數域，二分搜尋可分為**離散型（整數）**與**連續型（實數）**：

| 特性 | 離散型二分搜尋（Discrete） | 連續型二分搜尋（Continuous） |
| :--- | :--- | :--- |
| **答案類型** | 整數（如：個數、索引、陣列長度） | 實數（如：幾何距離、速度、機率） |
| **區間調整** | `l = mid + 1` 或 `r = mid - 1` (排除 `mid`) | `l = mid` 或 `r = mid` (無法排除點) |
| **收斂條件** | `l < r` 或 `l <= r` 區間完全重合 | `r - l > eps`（精度限制）或固定迭代次數 |
| **死迴圈風險** | 極高，需注意 `mid` 向上/向下取整 | 低，但須防範浮點數精度缺陷造成的死鎖 |

> [!TIP]
> **連續型二分搜尋的「固定迭代次數法」：**
> 在實數二分搜尋中，使用 `while (r - l > eps)` 有時會因為浮點數精度流失（如當 `l` 和 `r` 非常接近時，由於精度限制 `r - l > eps` 恆成立）而導致超時（TLE）。
> 實戰中更推薦**固定迭代次數**（例如迴圈執行 100 次）。每次迭代區間減半，100 次迭代後的區間範圍為原來的 $2^{-100} \approx 10^{-30}$，這已遠遠超出雙精度浮點數 `double` 的有效精度（約 15-17 位有效數字），既精準又絕對安全。
> ```cpp
> double l = 0.0, r = 1e9;
> for (int iter = 0; iter < 100; iter++) {
>     double mid = l + (r - l) / 2.0;
>     if (check(mid)) l = mid;
>     else r = mid;
> }
> ```

---

## 2. 經典問題實作範本

我們以經典問題**「憤怒的牛 (Aggressive Cows)」**為例。
*   **問題描述**：給定 $N$ 個在一直線上的牛欄位置 $x_1, x_2, \dots, x_N$。要將 $C$ 隻牛安置在這些牛欄中，使得任意兩隻牛之間的**最小距離最大化**。求這個最大的最小距離。
*   **解題思路**：
    *   若最小距離為 $d$ 時可以安置所有牛，則當距離小於 $d$ 時也必定可以（滿足單調性）。
    *   `check(d)` 判定函數：使用貪心法。將第一隻牛放在第一個牛欄，依序尋找下一個距離當前牛欄 $\ge d$ 的牛欄放置下一隻牛。如果能放滿 $C$ 隻牛，則返回 `true`，否則返回 `false`。

以下為 C++、Java、Python 三種語言的完整實作範本，均採用標準的 CP 競賽結構。

### 2.1 C++ 實作範本

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

// 判定函數：在相鄰牛隻距離至少為 d 的限制下，能否成功放入 C 隻牛
bool check(long long d, const vector<long long>& positions, int C) {
    int count = 1; // 第一隻牛固定放在第一個牛欄
    long long last_position = positions[0];
    
    for (size_t i = 1; i < positions.size(); ++i) {
        if (positions[i] - last_position >= d) {
            count++;
            last_position = positions[i];
            if (count >= C) {
                return true;
            }
        }
    }
    return false;
}

void solve() {
    int N, C;
    if (!(cin >> N >> C)) return;
    
    vector<long long> positions(N);
    for (int i = 0; i < N; ++i) {
        cin >> positions[i];
    }
    
    // 排序是進行貪心判定的前提
    sort(positions.begin(), positions.end());
    
    // 二分答案的值域範圍
    long long l = 1; // 最小可能的距離
    long long r = positions[N - 1] - positions[0]; // 最大可能的距離
    long long ans = 0;
    
    // 最大化最小值模式：尋找最後一個滿足 check 的值
    while (l <= r) {
        long long mid = l + (r - l) / 2;
        if (check(mid, positions, C)) {
            ans = mid;     // 記錄當前可行解
            l = mid + 1;   // 嘗試尋找更大距離
        } else {
            r = mid - 1;   // 當前距離太大，調小區間
        }
    }
    
    cout << ans << "\n";
}

int main() {
    // 高效輸入輸出優化
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    int t;
    if (cin >> t) {
        while (t--) {
            solve();
        }
    }
    return 0;
}
```

---

### 2.2 Java 實作範本

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.StringTokenizer;

public class Main {
    // 判定函數：以距離 d 為最小限制，能否安置 C 隻牛
    private static boolean check(long d, long[] positions, int C) {
        int count = 1;
        long lastPosition = positions[0];
        
        for (int i = 1; i < positions.length; i++) {
            if (positions[i] - lastPosition >= d) {
                count++;
                lastPosition = positions[i];
                if (count >= C) {
                    return true;
                }
            }
        }
        return false;
    }

    public static void main(String[] args) throws IOException {
        // 使用 BufferedReader 與 StringTokenizer 進行快速 I/O
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st;
        
        String line = br.readLine();
        if (line == null) return;
        int t = Integer.parseInt(line.trim());
        
        while (t-- > 0) {
            // 跳過可能的空行
            do {
                line = br.readLine();
            } while (line != null && line.trim().isEmpty());
            
            if (line == null) break;
            st = new StringTokenizer(line);
            int N = Integer.parseInt(st.nextToken());
            int C = Integer.parseInt(st.nextToken());
            
            long[] positions = new long[N];
            st = new StringTokenizer(br.readLine());
            for (int i = 0; i < N; i++) {
                positions[i] = Long.parseLong(st.nextToken());
            }
            
            Arrays.sort(positions);
            
            long l = 1;
            long r = positions[N - 1] - positions[0];
            long ans = 0;
            
            while (l <= r) {
                long mid = l + (r - l) / 2;
                if (check(mid, positions, C)) {
                    ans = mid;
                    l = mid + 1; // 尋找更大可能
                } else {
                    r = mid - 1;
                }
            }
            System.out.println(ans);
        }
    }
}
```

---

### 2.3 Python 實作範本

```python
import sys

def check(d: int, positions: list, C: int) -> bool:
    """判定函數：在兩隻牛的最小距離至少為 d 時，能否塞下 C 隻牛"""
    count = 1
    last_position = positions[0]
    
    for i in range(1, len(positions)):
        if positions[i] - last_position >= d:
            count += 1
            last_position = positions[i]
            if count >= C:
                return True
    return False

def solve():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    
    iterator = iter(input_data)
    try:
        t_cases = int(next(iterator))
    except StopIteration:
        return
    
    out = []
    for _ in range(t_cases):
        N = int(next(iterator))
        C = int(next(iterator))
        
        positions = []
        for _ in range(N):
            positions.append(int(next(iterator)))
            
        # 排序以進行貪心模擬
        positions.sort()
        
        # 二分搜尋邊界
        l = 1
        r = positions[-1] - positions[0]
        ans = 0
        
        # 二分答案核心
        while l <= r:
            mid = l + (r - l) // 2
            if check(mid, positions, C):
                ans = mid
                l = mid + 1  # 嘗試更大可能
            else:
                r = mid - 1
        out.append(str(ans))
        
    print('\n'.join(out))

if __name__ == '__main__':
    solve()
```

---

## 3. 複雜度與防禦要點

### 3.1 複雜度分析
*   **時間複雜度**：
    *   **排序階段**：$O(N \log N)$。
    *   **二分搜尋階段**：設值域大小為 $V = X_{\max} - X_{\min}$，二分搜尋總共需要迭代 $\log_2(V)$ 次。每一次 `check(mid)` 函數內部需要 $O(N)$ 遍歷，故二分搜尋階段的時間複雜度為 $O(N \log V)$。
    *   **總時間複雜度**：$O(N \log N + N \log V)$。通常在競賽中 $N \le 10^5$, $V \le 10^9$，此演算法可輕鬆在 1 秒內通過。
*   **空間複雜度**：$O(1)$ 或 $O(N)$，主要取決於儲存牛欄位置的陣列以及排序演算法輔助空間，對記憶體極度友好。

---

### 3.2 數值溢位防範 (Numerical Overflow)
*   **防範 `mid` 計算溢位**：
    不要寫成 `mid = (l + r) / 2`。如果 $l$ 與 $r$ 的數量級達到 $10^9$（如坐標大範圍），兩者相加會超過 32 位元有號整數的上限（`2,147,483,647`），導致溢位變為負數。
    > [!IMPORTANT]
    > 應始終使用安全寫法：`mid = l + (r - l) / 2`。
*   **64 位元整數宣告**：
    若問題的判定過程涉及「木材總長度累加」（如木材砍伐問題）或「多個數值相加」，累加總和極易超越 32 位元整數。C++ 中必須使用 `long long`，Java 應使用 `long`。

---

### 3.3 邊界情況與防禦設計 (Edge Cases)

1.  **極端輸入 $N=2$ 或 $C=2$**：
    確保邊界初始值安全，例如當 $C=2$ 時，最佳解顯然是兩端點位置的距離 `positions[N-1] - positions[0]`，二分搜尋應能準確收斂至該值。
2.  **死迴圈（Infinite Loop）防範**：
    在整數二分搜尋中，當 `l` 和 `r` 的距離為 1（例如 `l = 3`, `r = 4`）時，若程式碼中寫了 `l = mid` 且 `mid = l + (r - l) / 2`，此時 `mid = 3 + 0 = 3`。若 `check(3)` 為 `true`，區間將更新為 `l = 3`。這會導致搜尋區間毫無變化，程式陷入無窮死迴圈。
    *   **防禦策略**：
        1. 採用**「記錄答案型」**寫法（如本章範本所示）：
           ```cpp
           while (l <= r) {
               long long mid = l + (r - l) / 2;
               if (check(mid)) {
                   ans = mid;   // 先行記錄可行解
                   l = mid + 1; // 強制區間縮減，避免死迴圈
               } else {
                   r = mid - 1; // 強制區間縮減
               }
           }
           ```
        2. 採用**「左閉右開」**或**「精確無漏」**更新，但須根據取整方向嚴格配對。

3.  **連續型二分搜尋的 $\epsilon$ (eps) 精度設定**：
    *   如果題目要求答案精確到小數點後第 $K$ 位，通常將 `eps` 設為 $10^{-(K+2)}$ 以防浮點誤差。
    *   **保險起見，強烈建議直接使用固定次數的迴圈（如 100 次）**，這能保證完美的精確度與執行效率，徹底杜絕浮點數死鎖。
