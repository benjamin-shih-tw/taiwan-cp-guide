# 快速傅立葉變換與數論變換 (FFT & NTT)

**快速傅立葉變換（Fast Fourier Transform, FFT）** 與 **數論變換（Number Theoretic Transform, NTT）** 是以 **$\mathcal{O}(N \log N)$ 時間**求解「多項式乘法（卷積 Convolution）」的頂級代數演算法。

---

## 1. 核心觀念與基本原理

*   **多項式的係數與點值表示法**：
    *   **係數表示法 (Coefficient Representation)**：標準多項式表示法。直接進行多項式乘法需要 $\mathcal{O}(N^2)$。
    *   **點值表示法 (Point-value Representation)**：用平面上 $N+1$ 個不同的點唯一確定一個 $N$ 次多項式。在點值表示法下，多項式乘法只需 $\mathcal{O}(N)$ 線性時間。
*   **對數級變換加速**：
    *   **FFT (快速傅立葉變換)**：利用**單位複數根 (Roots of Unity)** 的對稱性與週期性，以分治法（Cooley-Tukey 演算法）在 $\mathcal{O}(N \log N)$ 內完成係數與點值的雙向轉換。
    *   **NTT (數論變換)**：為防止複數運算產生的浮點數精度誤差，改用**模數的原根 (Primitive Root)** 代替複數根，在整數有限群（Finite Field）上執行卷積運算，完全避免精度丟失。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

### C++ 實作範本 (FFT)

```cpp
#include <vector>
#include <complex>
#include <cmath>
#include <algorithm>

using namespace std;

typedef complex<double> cd;
const double PI = acos(-1);

// 蝴蝶優化 FFT (Cooley-Tukey)
void fft(vector<cd>& a, bool invert) {
    int n = a.size();
    for (int i = 1, j = 0; i < n; i++) {
        int bit = n >> 1;
        for (; j & bit; bit >>= 1) j ^= bit;
        j ^= bit;
        if (i < j) swap(a[i], a[j]);
    }
    for (int len = 2; len <= n; len <<= 1) {
        double ang = 2 * PI / len * (invert ? -1 : 1);
        cd wlen(cos(ang), sin(ang));
        for (int i = 0; i < n; i += len) {
            cd w(1);
            for (int j = 0; j < len / 2; j++) {
                cd u = a[i + j], v = a[i + j + len / 2] * w;
                a[i + j] = u + v;
                a[i + j + len / 2] = u - v;
                w *= wlen;
            }
        }
    }
    if (invert) {
        for (auto& x : a) x /= n;
    }
}
```

### Java 實作範本 (FFT)

```java
import java.util.*;

public class FFT {
    public static class Complex {
        double r, i;
        public Complex(double real, double imag) {
            r = real;
            i = imag;
        }
        public Complex plus(Complex b) {
            return new Complex(this.r + b.r, this.i + b.i);
        }
        public Complex minus(Complex b) {
            return new Complex(this.r - b.r, this.i - b.i);
        }
        public Complex times(Complex b) {
            return new Complex(this.r * b.r - this.i * b.i, this.r * b.i + this.i * b.r);
        }
    }

    public static void fft(Complex[] a, boolean invert) {
        int n = a.length;
        for (int i = 1, j = 0; i < n; i++) {
            int bit = n >> 1;
            while ((j & bit) != 0) {
                j ^= bit;
                bit >>= 1;
            }
            j ^= bit;
            if (i < j) {
                Complex temp = a[i];
                a[i] = a[j];
                a[j] = temp;
            }
        }
        for (int len = 2; len <= n; len <<= 1) {
            double ang = 2 * Math.PI / len * (invert ? -1 : 1);
            Complex wlen = new Complex(Math.cos(ang), Math.sin(ang));
            for (int i = 0; i < n; i += len) {
                Complex w = new Complex(1, 0);
                for (int j = 0; j < len / 2; j++) {
                    Complex u = a[i + j];
                    Complex v = a[i + j + len / 2].times(w);
                    a[i + j] = u.plus(v);
                    a[i + j + len / 2] = u.minus(v);
                    w = w.times(wlen);
                }
            }
        }
        if (invert) {
            for (int i = 0; i < n; i++) {
                a[i].r /= n;
                a[i].i /= n;
            }
        }
    }
}
```

### Python 實作範本 (FFT)

```python
import cmath

def fft(a, invert):
    n = len(a)
    j = 0
    for i in range(1, n):
        bit = n >> 1
        while j & bit:
            j ^= bit
            bit >>= 1
        j ^= bit
        if i < j:
            a[i], a[j] = a[j], a[i]
            
    length = 2
    while length <= n:
        ang = 2 * cmath.pi / length * (-1 if invert else 1)
        wlen = cmath.rect(1, ang)
        for i in range(0, n, length):
            w = 1
            for j in range(length // 2):
                u = a[i + j]
                v = a[i + j + length // 2] * w
                a[i + j] = u + v
                a[i + j + length // 2] = u - v
                w *= wlen
        length <<= 1
        
    if invert:
        for i in range(n):
            a[i] /= n
```

---

## 3. 複雜度與防禦要點
*   **時間複雜度**：$\mathcal{O}(N \log N)$。
*   **防禦要點**：
    *   **2 的整數冪長度**：FFT 的分治法**要求陣列長度 $N$ 必須是 2 的整數次冪**。在運算前，一律必須對陣列補 $0$ 擴展至最近的 $2^k$。
    *   **精度丟失**：複數運算使用的是浮點數，當多項式次數極高時，可能會產生微小的浮點誤差。在輸出答案時應進行四捨五入（例如 `(int)(a[i].real() + 0.5)`）。
