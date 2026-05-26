# 字尾陣列與字尾自動機 (Suffix Array & Suffix Automaton)

在字串演算法的世界中，**字尾陣列 (Suffix Array, SA)** 與 **字尾自動機 (Suffix Automaton, SAM)** 是解決複雜字串匹配、子字串統計與結構分析的兩大終極大招。它們能以 $\mathcal{O}(N)$ 或 $\mathcal{O}(N \log N)$ 的極致時間複雜度分析字串的所有字尾。

---

## 1. 核心觀念與基本原理

*   **字尾陣列 (Suffix Array, SA)**：
    *   **定義**：給定一個長度為 $N$ 的字串 $S$。將 $S$ 的所有字尾（共 $N$ 個）按字典序從小到大排序，字尾陣列 `sa[i]` 記錄的是排序後第 $i$ 小的字尾在原字串中的起始下標。
    *   **倍增算法 (Prefix Doubling)**：利用基數排序，每次將長度為 $2^k$ 的字尾排名組合成長度為 $2^{k+1}$ 的雙關鍵字進行排序，可在 $\mathcal{O}(N \log N)$ 內穩健完成。
    *   **最長公共字首陣列 (LCP Array / Height)**：`height[i]` 表示排名第 $i$ 的字尾與排名第 $i-1$ 的字尾的 **最長公共字首 (LCP)** 長度。利用 Kasai 演算法，可以在 $\mathcal{O}(N)$ 時間內求出 `height` 陣列。
*   **字尾自動機 (Suffix Automaton, SAM)**：
    *   **定義**：SAM 是一個強大的有向無環圖 (DAG)，它能以 $\mathcal{O}(N)$ 的空間與時間，接受且僅接受給定字串 $S$ 的所有子字串。
    *   **等價類 (endpos / right)**：若多個子字串在 $S$ 中出現的結束位置集合完全相同，則歸為同一個等價類（SAM 中的一個狀態節點）。
    *   **家譜樹 (Parent Tree / Link)**：節點間通過當前等價類的最長後綴鏈（link）相連，形成一棵樹狀結構，是子字串計數的核心。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

以下實作示範：使用 **倍增算法 (Prefix Doubling)** 來建構字尾陣列 (SA) 並求出最長公共字首 (LCP/Height) 陣列。

### C++ 實作範本

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

class SuffixArray {
public:
    string s;
    int n;
    vector<int> sa;
    vector<int> rnk;
    vector<int> height;

    SuffixArray(const string& src) : s(src), n(src.length()) {
        sa.resize(n);
        rnk.resize(n);
        height.resize(n);
        build_sa();
        build_lcp();
    }

private:
    void build_sa() {
        vector<int> tmp(n), c(max(256, n), 0);
        for (int i = 0; i < n; i++) c[rnk[i] = s[i]]++;
        for (int i = 1; i < 256; i++) c[i] += c[i - 1];
        for (int i = n - 1; i >= 0; i--) sa[--c[s[i]]] = i;

        for (int k = 1; k < n; k <<= 1) {
            int p = 0;
            vector<int> y(n);
            for (int i = n - k; i < n; i++) y[p++] = i;
            for (int i = 0; i < n; i++) if (sa[i] >= k) y[p++] = sa[i] - k;

            fill(c.begin(), c.end(), 0);
            for (int i = 0; i < n; i++) c[rnk[i]]++;
            for (int i = 1; i < n; i++) c[i] += c[i - 1];
            for (int i = n - 1; i >= 0; i--) sa[--c[rnk[y[i]]]] = y[i];

            tmp[sa[0]] = 0;
            p = 1;
            for (int i = 1; i < n; i++) {
                int a = sa[i], b = sa[i - 1];
                int a_next = (a + k < n) ? rnk[a + k] : -1;
                int b_next = (b + k < n) ? rnk[b + k] : -1;
                if (rnk[a] == rnk[b] && a_next == b_next) {
                    tmp[a] = p - 1;
                } else {
                    tmp[a] = p++;
                }
            }
            rnk = tmp;
            if (p >= n) break;
        }
    }

    void build_lcp() {
        int k = 0;
        for (int i = 0; i < n; i++) {
            if (rnk[i] == 0) {
                height[0] = 0;
                continue;
            }
            if (k) k--;
            int j = sa[rnk[i] - 1];
            while (i + k < n && j + k < n && s[i + k] == s[j + k]) {
                k++;
            }
            height[rnk[i]] = k;
        }
    }
};
```

### Java 實作範本

```java
import java.util.*;

public class SuffixArray {
    public String s;
    public int n;
    public int[] sa;
    public int[] rnk;
    public int[] height;

    public SuffixArray(String src) {
        this.s = src;
        this.n = src.length();
        this.sa = new int[n];
        this.rnk = new int[n];
        this.height = new int[n];
        buildSA();
        buildLCP();
    }

    private void buildSA() {
        int[] tmp = new int[n];
        int m = Math.max(256, n);
        int[] c = new int[m];

        for (int i = 0; i < n; i++) {
            rnk[i] = s.charAt(i);
            c[rnk[i]]++;
        }
        for (int i = 1; i < 256; i++) c[i] += c[i - 1];
        for (int i = n - 1; i >= 0; i--) sa[--c[s.charAt(i)]] = i;

        for (int k = 1; k < n; k <<= 1) {
            int p = 0;
            int[] y = new int[n];
            for (int i = n - k; i < n; i++) y[p++] = i;
            for (int i = 0; i < n; i++) {
                if (sa[i] >= k) y[p++] = sa[i] - k;
            }

            Arrays.fill(c, 0);
            for (int i = 0; i < n; i++) c[rnk[i]]++;
            for (int i = 1; i < n; i++) c[i] += c[i - 1];
            for (int i = n - 1; i >= 0; i--) sa[--c[rnk[y[i]]]] = y[i];

            tmp[sa[0]] = 0;
            p = 1;
            for (int i = 1; i < n; i++) {
                int a = sa[i], b = sa[i - 1];
                int aNext = (a + k < n) ? rnk[a + k] : -1;
                int bNext = (b + k < n) ? rnk[b + k] : -1;
                if (rnk[a] == rnk[b] && aNext == bNext) {
                    tmp[a] = p - 1;
                } else {
                    tmp[a] = p++;
                }
            }
            System.arraycopy(tmp, 0, rnk, 0, n);
            if (p >= n) break;
        }
    }

    private void buildLCP() {
        int k = 0;
        for (int i = 0; i < n; i++) {
            if (rnk[i] == 0) {
                height[0] = 0;
                continue;
            }
            if (k > 0) k--;
            int j = sa[rnk[i] - 1];
            while (i + k < n && j + k < n && s.charAt(i + k) == s.charAt(j + k)) {
                k++;
            }
            height[rnk[i]] = k;
        }
    }
}
```

### Python 實作範本

```python
class SuffixArray:
    def __init__(self, s):
        self.s = s
        self.n = len(s)
        self.sa = [0] * self.n
        self.rnk = [0] * self.n
        self.height = [0] * self.n
        self._build_sa()
        self._build_lcp()

    def _build_sa(self):
        n = self.n
        c = [0] * max(256, n)
        
        # 初始基數排序 (長度為 1)
        for i in range(n):
            self.rnk[i] = ord(self.s[i])
            c[self.rnk[i]] += 1
        for i in range(1, 256):
            c[i] += c[i - 1]
        for i in range(n - 1, -1, -1):
            c[ord(self.s[i])] -= 1
            self.sa[c[ord(self.s[i])]] = i

        k = 1
        while k < n:
            p = 0
            y = [0] * n
            for i in range(n - k, n):
                y[p] = i
                p += 1
            for i in range(n):
                if self.sa[i] >= k:
                    y[p] = self.sa[i] - k
                    p += 1

            c = [0] * max(256, n)
            for i in range(n):
                c[self.rnk[i]] += 1
            for i in range(1, n):
                c[i] += c[i - 1]
            for i in range(n - 1, -1, -1):
                idx = self.rnk[y[i]]
                c[idx] -= 1
                self.sa[c[idx]] = y[i]

            tmp = [0] * n
            tmp[self.sa[0]] = 0
            p = 1
            for i in range(1, n):
                a, b = self.sa[i], self.sa[i - 1]
                a_next = self.rnk[a + k] if a + k < n else -1
                b_next = self.rnk[b + k] if b + k < n else -1
                if self.rnk[a] == self.rnk[b] and a_next == b_next:
                    tmp[a] = p - 1
                else:
                    tmp[a] = p
                    p += 1
            self.rnk = tmp
            if p >= n:
                break
            k <<= 1

    def _build_lcp(self):
        n = self.n
        k = 0
        for i in range(n):
            if self.rnk[i] == 0:
                self.height[0] = 0
                continue
            if k > 0:
                k -= 1
            j = self.sa[self.rnk[i] - 1]
            while i + k < n and j + k < n and self.s[i + k] == self.s[j + k]:
                k += 1
            self.height[self.rnk[i]] = k
```

---

## 3. 複雜度與防禦要點

*   **時間複雜度**：
    *   倍增算法建構 SA：$\mathcal{O}(N \log N)$。
    *   Kasai 算法建構 Height/LCP：$\mathcal{O}(N)$。
*   **防禦要點**：
    *   **哨兵字元 (Sentinel Character)**：
        在多個字串拼接求 LCP 時，應在字串中間與末尾拼接**不同的且未曾在字串中出現過的極小字元**（如 `$`、`#`）。否則在排序時，邊界外的記憶體越界，或者不同字串的後綴重疊會導致錯誤的 Height 計算。
    *   **陣列越界防禦**：
        在 `a + k < n` 等倍增索引跳躍中，必須嚴格檢查是否超出字串長度 $N$，若越界則應給予預設的最小值（如 `-1`）表示空字串，防止存取記憶體非法地址。
