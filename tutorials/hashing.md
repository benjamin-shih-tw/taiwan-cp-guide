# 字串雜湊 (String Hashing)

**字串雜湊 (String Hashing)** 是一種能以 **$\mathcal{O}(1)$ 時間**動態查詢任意子字串是否相等的黑科技。

---

## 1. 核心觀念與基本原理

*   **多項式滾動雜湊 (Polynomial Rolling Hash)**：
    將一個長度為 $N$ 的字串 $S$ 視為一個 $P$ 進位的超大整數，並對模數 $M$ 取模：
    $$\text{Hash}(S) = \left( \sum_{i=1}^{N} S[i] \cdot P^{N-i} \right) \bmod M$$
*   **子字串雜湊值獲取**：
    預處理前綴雜湊值陣列 $H_i$ 與 $P$ 的次方表 $P^i$，即可在 $\mathcal{O}(1)$ 取得子字串 $S[L..R]$ 的雜湊值：
    $$\text{Hash}(S[L..R]) = \left( H_R - H_{L-1} \cdot P^{R-L+1} \right) \bmod M$$
*   **碰撞防範**：選擇合適的素數基底 $P$（如 $131$ 或 $313$）與大素數模數 $M$（如 $10^9+7$ 或 $10^9+9$），或者直接採用**雙雜湊 (Double Hash)** 以免被精心設計的測資毒打。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

```cpp
#include <string>
#include <vector>
using namespace std;

class StringHash {
private:
    int n;
    long long P = 313;
    long long M = 1000000007;
    vector<long long> h, p_pow;
public:
    StringHash(const string& s) {
        n = s.length();
        h.assign(n + 1, 0);
        p_pow.assign(n + 1, 1);
        for (int i = 0; i < n; i++) {
            h[i + 1] = (h[i] * P + s[i]) % M;
            p_pow[i + 1] = (p_pow[i] * P) % M;
        }
    }
    long long get_hash(int l, int r) {
        long long val = (h[r + 1] - h[l] * p_pow[r - l + 1]) % M;
        return (val + M) % M;
    }
};
```

```java
class StringHash {
    private int n;
    private long P = 313;
    private long M = 1000000007;
    private long[] h, pPow;
    public StringHash(String s) {
        n = s.length();
        h = new long[n + 1];
        pPow = new long[n + 1];
        pPow[0] = 1;
        for (int i = 0; i < n; i++) {
            h[i + 1] = (h[i] * P + s.charAt(i)) % M;
            pPow[i + 1] = (pPow[i] * P) % M;
        }
    }
    public long getHash(int l, int r) {
        long val = (h[r + 1] - h[l] * pPow[r - l + 1]) % M;
        return (val + M) % M;
    }
}
```

```python
class StringHash:
    def __init__(self, s: str):
        self.n = len(s)
        self.P = 313
        self.M = 1000000007
        self.h = [0] * (self.n + 1)
        self.p_pow = [1] * (self.n + 1)
        for i in range(self.n):
            self.h[i + 1] = (self.h[i] * self.P + ord(s[i])) % self.M
            self.p_pow[i + 1] = (self.p_pow[i] * self.P) % self.M
            
    def get_hash(self, l: int, r: int) -> int:
        val = (self.h[r + 1] - self.h[l] * self.p_pow[r - l + 1]) % self.M
        return (val + self.M) % self.M
```

---

## 3. 複雜度與防禦要點
*   **時間與空間複雜度**：預處理 $\mathcal{O}(N)$，單次查詢 $\mathcal{O}(1)$。
*   **防禦要點**：
    *   **生日悖論 (Birthday Paradox)**：單雜湊的碰撞概率在 $N \approx \sqrt{M}$ 時大幅上升，建議採用**雙雜湊**（開兩個不同的模數如 $10^9+7$ 和 $10^9+9$）進行防禦。
