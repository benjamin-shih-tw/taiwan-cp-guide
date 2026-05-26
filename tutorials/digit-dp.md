# 數位 DP (Digit DP)

**數位 DP (Digit DP)** 主要解決「求區間 $[L, R]$ 內滿足特定數位規則的整數個數」問題。

---

## 1. 核心觀念與基本原理

*   **前綴相減思想**：
    將區間問題轉化為前綴查詢：$\text{Ans}(L, R) = \text{Solve}(R) - \text{Solve}(L - 1)$。
*   **狀態搜尋設計（自頂向下記憶化搜尋）**：
    我們通常將數字轉為字串表示，並使用 DFS 自左至右填入數位。
    *   **限制狀態標記**：
        1.  `limit` (貼緊上界標記)：若當前填入的數位已經貼緊給定上限，則下一位所能選擇的最大數字將受限。
        2.  `lead` (前導零標記)：若前面填入的全是前導零，說明當前位數尚未真正開始，需要防範諸如「相鄰數位差」等規則被前導零干擾。
    *   **記憶化搜尋**：只有在 `!limit` 且 `!lead` 的狀態下才能進行 DP 記憶化，因為受限狀態不具有通用性。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

```cpp
#include <vector>
#include <string>
#include <cstring>
#include <algorithm>
using namespace std;

// 經典數位 DP：求不含數位 '4' 的正整數個數
class DigitDP {
private:
    string s;
    long long dp[20][2];
    long long dfs(int idx, bool limit, bool lead) {
        if (idx == s.length()) return 1;
        if (!limit && !lead && dp[idx][limit] != -1) return dp[idx][limit];
        
        int up = limit ? s[idx] - '0' : 9;
        long long ans = 0;
        for (int i = 0; i <= up; i++) {
            if (i == 4) continue; // 規則：不能為 4
            ans += dfs(idx + 1, limit && (i == up), lead && (i == 0));
        }
        if (!limit && !lead) dp[idx][limit] = ans;
        return ans;
    }
public:
    long long solve(long long n) {
        if (n < 0) return 0;
        s = to_string(n);
        memset(dp, -1, sizeof(dp));
        return dfs(0, true, true);
    }
};
```

```java
import java.util.*;

class DigitDP {
    private String s;
    private long[][] dp;
    
    private long dfs(int idx, boolean limit, boolean lead) {
        if (idx == s.length()) return 1;
        int limitIdx = limit ? 1 : 0;
        if (!limit && !lead && dp[idx][limitIdx] != -1) return dp[idx][limitIdx];
        
        int up = limit ? s.charAt(idx) - '0' : 9;
        long ans = 0;
        for (int i = 0; i <= up; i++) {
            if (i == 4) continue;
            ans += dfs(idx + 1, limit && (i == up), lead && (i == 0));
        }
        if (!limit && !lead) dp[idx][limitIdx] = ans;
        return ans;
    }
    public long solve(long n) {
        if (n < 0) return 0;
        s = Long.toString(n);
        dp = new long[s.length()][2];
        for (long[] row : dp) Arrays.fill(row, -1);
        return dfs(0, true, true);
    }
}
```

```python
class DigitDP:
    def __init__(self):
        self.s = ""
        self.dp = {}
        
    def _dfs(self, idx, limit, lead):
        if idx == len(self.s):
            return 1
        state = (idx, limit, lead)
        if state in self.dp:
            return self.dp[state]
            
        up = int(self.s[idx]) if limit else 9
        ans = 0
        for i in range(up + 1):
            if i == 4: continue
            ans += self._dfs(idx + 1, limit and (i == up), lead and (i == 0))
            
        self.dp[state] = ans
        return ans
        
    def solve(self, n):
        if n < 0: return 0
        self.s = str(n)
        self.dp = {}
        return self._dfs(0, True, True)
```

---

## 3. 複雜度與防禦要點
*   **時間與空間複雜度**：時間 $\mathcal{O}(\text{Len} \cdot 10)$，空間 $\mathcal{O}(\text{Len})$（即數位長度 $\log_{10}(R)$，為極佳的對數效率）。
*   **防禦要點**：
    *   **記憶化條件**：記憶化狀態陣列儲存時，**必須只在 `!limit` 且 `!lead` 下進行寫入與讀取**。否則會將受限的狀態錯誤地應用到非受限狀態上，導致計算偏小。
