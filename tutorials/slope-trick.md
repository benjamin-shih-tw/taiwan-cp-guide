# Slope Trick 優化技術

**Slope Trick** 是一種近年來在頂級競賽（如 Codeforces 2400+、USACO Platinum）中極其流行且威力無比的動態規劃（DP）優化神技。它主要針對「DP 狀態轉移函數是 **連續分段線性凸函數 (Piecewise Linear Convex Function)**」的問題，透過高效率的優先佇列（Priority Queue / Heap）動態維護函數的**斜率轉折點 (Slope Breakpoints)**，從而將傳統的 $\mathcal{O}(N^2)$ 或 $\mathcal{O}(N \log(\text{Range}))$ 複雜度直接最佳化至驚人的 $\mathcal{O}(N \log N)$。

---

## 1. 核心觀念與基本原理

*   **什麼是分段線性凸函數**：
    一個函數由若干條斜率為整數的線段首尾相連而成，且隨著自變數 $x$ 的增加，線段的斜率單調遞增（凸函數，即斜率由負變正）。例如：絕對值函數 $f(x) = |x - a|$ 就是一個最典型的分段線性凸函數（斜率在 $a$ 左側為 $-1$，右側為 $+1$，轉折點為 $a$）。
*   **斜率與轉折點的表示**：
    因為相鄰兩段的斜率差都是整數（通常變化量為 $1$），我們不需要存儲整個函數的解析式，只需要用一個集合維護所有**斜率發生變化的轉折點**。
    *   通常我們使用一個最大堆（Max-Heap）維護斜率 $\le 0$ 的轉折點集合 $L$，和一個最小堆（Min-Heap）維護斜率 $\ge 0$ 的轉折點集合 $R$。
    *   函數的最低點（斜率為 0 的區間）即為 $[ \max(L), \min(R) ]$。
*   **基本操作與維護**：
    當前函數為 $f(x)$，要加上一個新函數 $g(x) = |x - a|$：
    1. 若 $a < \max(L)$：說明新轉折點在最值區間的左側，左側斜率會發生改變。我們將 $a$ 推入左堆 $L$。此時為了保持平衡，需要將 $L$ 的堆頂彈出並推入右堆 $R$。同時，最值高度（最低點的函數值）需要累加 $\max(L) - a$。
    2. 若 $a > \min(R)$：說明新轉折點在右側。我們將 $a$ 推入右堆 $R$，然後將 $R$ 的堆頂彈出並推入左堆 $L$。最值高度累加 $a - \min(R)$。
    3. 若 $\max(L) \le a \le \min(R)$：說明 $a$ 落在最低點區間內，直接推入 $L$ 和 $R$ 各一個，最值不變。
*   **函數的平移 (Shift)**：
    如果轉移涉及「滑動窗口」或「前綴最值」，相當於函數左右拉伸。這可以通過給堆維護一個**全局偏移量 (Tag / Offset)** 在 $\mathcal{O}(1)$ 時間內完成。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

以下實作示範：解決經典的 **「序列單調化最小代價」** 問題（例如 Codeforces 713C）。給定一個整數序列 $A$，每次操作可以將某個元素 $+1$ 或 $-1$，求將序列變為**嚴格單調遞增**序列的最小代價。
> **轉化技巧**：將 $A_i$ 變為 $A_i - i$，問題即轉化為將新序列變為**非嚴格單調遞增**序列的最小代價。此時的 DP 函數即為連續凸函數，適用 Slope Trick。

### C++ 實作範本

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <cmath>

using namespace std;

long long solve_slope_trick(const vector<long long>& A) {
    int n = A.size();
    // 維護斜率 <= 0 的轉折點的最大堆
    priority_queue<long long> L;
    long long min_val = 0; // 最低點的函數值

    for (int i = 0; i < n; i++) {
        long long val = A[i] - i; // 嚴格遞增轉化為非嚴格遞增

        if (!L.empty() && val < L.top()) {
            // val 落在左側斜率小於 0 的區間
            min_val += L.top() - val; // 累加差值
            L.push(val);             // 插入新的轉折點
            L.push(val);             // 插入兩次，因為斜率變化量為 2
            L.pop();                 // 彈出最大值以維持右側斜率的平衡
        } else {
            L.push(val);
        }
    }
    return min_val;
}
```

### Java 實作範本

```java
import java.util.*;

public class SlopeTrick {
    public static long solve(long[] A) {
        int n = A.length;
        // 最大堆，維護左側轉折點
        PriorityQueue<Long> L = new PriorityQueue<>(Collections.reverseOrder());
        long minVal = 0;

        for (int i = 0; i < n; i++) {
            long val = A[i] - i;

            if (!L.isEmpty() && val < L.peek()) {
                minVal += L.peek() - val;
                L.offer(val);
                L.offer(val);
                L.poll();
            } else {
                L.offer(val);
            }
        }
        return minVal;
    }
}
```

### Python 實作範本

```python
import heapq

def solve_slope_trick(A):
    n = len(A)
    # Python 預設為最小堆，因此存入負值來模擬最大堆
    L = []
    min_val = 0

    for i in range(n):
        val = A[i] - i
        
        # 由於 L 中存的是負數，-L[0] 即為原本的最大值
        if L and val < -L[0]:
            min_val += -L[0] - val
            heapq.heappush(L, -val)
            heapq.heappush(L, -val)
            heapq.heappop(L)
        else:
            heapq.heappush(L, -val)
            
    return min_val
```

---

## 3. 複雜度與防禦要點

*   **時間複雜度**：$\mathcal{O}(N \log N)$。
    每個元素僅會進行常數次的堆（優先佇列）推入與彈出操作，完全避免了傳統 DP 的狀態維護，效率極高。
*   **防禦要點**：
    *   **溢位防禦**：
        在累積最小代價 `min_val` 時，差值之和極易超出 32 位元整數上限，**必須使用 64 位元整數 (C++ 的 `long long`，Java 的 `long`)** 來防止數值溢位。
    *   **最大堆與最小堆模擬**：
        Python 的 `heapq` 預設為最小堆，在模擬最大堆時需乘上 `-1`。務必在取出、比較以及累加最值時進行相應的符號轉換，否則會導致計算邏輯完全相反。
    *   **平移標記的下傳**：
        若問題涉及動態區間平移，在對堆頂進行比較或彈出前，必須先加上（或減去）全局平移偏移量 `tag`，以確保轉折點物理座標的正確性。
