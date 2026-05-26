# 數論基礎 (Number Theory)

數論是競賽程式中數學版塊的核心基石。

---

## 1. 核心觀念與基本原理

*   **歐幾里得演算法 (GCD) — $\mathcal{O}(\log(\min(A, B)))$**：
    $$\gcd(a, b) = \gcd(b, a \bmod b)$$
*   **擴充歐幾里得演算法 (EXGCD)**：
    求解貝祖等式 $ax + by = \gcd(a, b)$，是計算**模反元素 (Modular Inverse)** 的核心方法。
*   **線性篩質數 (Sieve of Eratosthenes / Euler's Sieve) — $\mathcal{O}(N)$**：
    以線性時間複雜度篩出 $[1, N]$ 區間內的所有質數。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

```cpp
#include <vector>
using namespace std;

// 擴充歐幾里得
long long extgcd(long long a, long long b, long long& x, long long& y) {
    if (b == 0) { x = 1; y = 0; return a; }
    long long x1, y1;
    long long gcd = extgcd(b, a % b, x1, y1);
    x = y1;
    y = x1 - (a / b) * y1;
    return gcd;
}

// 模反元素 (要求 a, m 互質)
long long mod_inverse(long long a, long long m) {
    long long x, y;
    long long g = extgcd(a, m, x, y);
    if (g != 1) return -1; // 不存在
    return (x % m + m) % m;
}

// 歐拉線性篩
vector<int> euler_sieve(int n) {
    vector<int> primes;
    vector<bool> is_prime(n + 1, true);
    is_prime[0] = is_prime[1] = false;
    for (int i = 2; i <= n; i++) {
        if (is_prime[i]) primes.push_back(i);
        for (int p : primes) {
            if (i * p > n) break;
            is_prime[i * p] = false;
            if (i % p == 0) break; // 每個合數只被其最小質因數篩去
        }
    }
    return primes;
}
```

```java
import java.util.*;

class NumberTheory {
    public static long extgcd(long a, long b, long[] xy) {
        if (b == 0) { xy[0] = 1; xy[1] = 0; return a; }
        long[] xy1 = new long[2];
        long gcd = extgcd(b, a % b, xy1);
        xy[0] = xy1[1];
        xy[1] = xy1[0] - (a / b) * xy1[1];
        return gcd;
    }
}
```

```python
def extgcd(a, b):
    if b == 0:
        return a, 1, 0
    g, x1, y1 = extgcd(b, a % b)
    x = y1
    y = x1 - (a // b) * y1
    return g, x, y
```

---

## 3. 複雜度與防禦要點
*   **時間與空間複雜度**：GCD/EXGCD 為 $\mathcal{O}(\log(\min(A, B)))$，篩法時間與空間均為 $\mathcal{O}(N)$。
*   **防禦要點**：
    *   **除以零**：在進行 `a % b` 前務必確保 $b \ne 0$。
    *   **模數非素數**：模反元素只有在 $a$ 與 $m$ 互質時存在。若 $m$ 是合數，不能直接用費馬小定理 $a^{m-2} \bmod m$ 計算逆元，必須使用 EXGCD。
