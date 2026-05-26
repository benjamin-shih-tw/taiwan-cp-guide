# 組合數學 (Combinatorics)

組合數學涉及排列組合、二項式係數及動態預處理。

---

## 1. 核心觀念與基本原理

*   **組合數 $C(N, K)$ 預處理**：
    在模數 $M$（通常為大質數 $10^9+7$）下，我們透過預處理階乘陣列 `fact[i]` 與階乘逆元 `invFact[i]`，可以在 **$\mathcal{O}(1)$ 時間**內線上查詢任意組合數：
    $$C(n, k) = \text{fact}[n] \cdot \text{invFact}[k] \cdot \text{invFact}[n-k] \bmod M$$
*   **乘法逆元遞推法**：
    使用階乘逆元從後向前遞推（$\mathcal{O}(N)$），是極其高效常數極小的經典模板。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

```cpp
#include <vector>
using namespace std;

class Combinatorics {
private:
    long long MOD = 1000000007;
    vector<long long> fact, inv;
    long long power(long long base, long long exp) {
        long long res = 1;
        base %= MOD;
        while (exp > 0) {
            if (exp % 2 == 1) res = (res * base) % MOD;
            base = (base * base) % MOD;
            exp /= 2;
        }
        return res;
    }
public:
    Combinatorics(int n) {
        fact.assign(n + 1, 1);
        inv.assign(n + 1, 1);
        for (int i = 1; i <= n; i++) fact[i] = (fact[i - 1] * i) % MOD;
        inv[n] = power(fact[n], MOD - 2); // 費馬小定理
        for (int i = n - 1; i >= 0; i--) {
            inv[i] = (inv[i + 1] * (i + 1)) % MOD; // 逆推
        }
    }
    long long nCr(int n, int r) {
        if (r < 0 || r > n) return 0;
        return fact[n] * inv[r] % MOD * inv[n - r] % MOD;
    }
};
```

```java
class Combinatorics {
    private long MOD = 1000000007;
    private long[] fact, inv;
    public Combinatorics(int n) {
        fact = new long[n + 1];
        inv = new long[n + 1];
        fact[0] = 1; inv[0] = 1;
        for (int i = 1; i <= n; i++) fact[i] = (fact[i - 1] * i) % MOD;
        inv[n] = power(fact[n], MOD - 2);
        for (int i = n - 1; i >= 0; i--) inv[i] = (inv[i + 1] * (i + 1)) % MOD;
    }
    private long power(long b, long e) {
        long r = 1; b %= MOD;
        while (e > 0) {
            if (e % 2 == 1) r = (r * b) % MOD;
            b = (b * b) % MOD; e /= 2;
        }
        return r;
    }
    public long nCr(int n, int r) {
        if (r < 0 || r > n) return 0;
        return fact[n] * inv[r] % MOD * inv[n - r] % MOD;
    }
}
```

```python
class Combinatorics:
    def __init__(self, n, mod=1000000007):
        self.mod = mod
        self.fact = [1] * (n + 1)
        self.inv = [1] * (n + 1)
        for i in range(1, n + 1):
            self.fact[i] = (self.fact[i - 1] * i) % self.mod
        self.inv[n] = pow(self.fact[n], self.mod - 2, self.mod)
        for i in range(n - 1, -1, -1):
            self.inv[i] = (self.inv[i + 1] * (i + 1)) % self.mod
            
    def nCr(self, n, r):
        if r < 0 or r > n:
            return 0
        return self.fact[n] * self.inv[r] % self.mod * self.inv[n - r] % self.mod
```

---

## 3. 複雜度與防禦要點
*   **時間複雜度**：預處理 $\mathcal{O}(N)$，單次查詢 $\mathcal{O}(1)$。
*   **防禦要點**：
    *   **越界條件**：在計算 $nCr$ 時，若 $r > n$ 或 $r < 0$，必須預防性特判回傳 $0$，否則會發生越界或錯誤。
