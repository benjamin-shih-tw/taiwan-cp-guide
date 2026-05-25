# 基礎貪婪演算法 (Intro to Greedy)

在程式競賽與演算法設計中，**貪婪演算法 (Greedy Algorithm)** 是一種非常直觀且強大的問題解決策略。它的核心哲學是：「**在每一步選擇中，都採取當前狀態下最好或最優的決策（局部最佳選擇），並期望藉此能引導至全域最佳解。**」

許多初學者在面對問題時，往往會「憑直覺寫貪心，憑測資吃 WA (Wrong Answer)」。貪婪演算法的實作難度通常不高，但**如何證明當前的貪婪策略是正確的**，才是掌握這個單元的精髓所在。本教材將從基本原理出發，深入解析經典的「區間排程問題 (Interval Scheduling)」，並介紹如何使用「交換論證法 (Exchange Argument)」進行嚴謹的證明。

---

## 1. 核心觀念與基本原理

### 1.1 貪婪演算法的兩大核心性質

一個問題若能使用貪婪演算法求解，通常必須具備以下兩個關鍵性質：

1. **貪婪選擇性質 (Greedy Choice Property)**
   我們可以藉由做出**局部最佳選擇（Locally Optimal Choice）**來達到**全域最佳解（Globally Optimal Solution）**。換句話說，當我們做了一個貪婪選擇後，問題可以被化簡為一個規模更小的子問題，而不需要回頭修改先前的選擇（這與動態規劃或回溯法不同，貪婪演算法不進行「後悔」與「多路嘗試」）。

2. **最佳子結構 (Optimal Substructure)**
   一個問題的最佳解包含其子問題的最佳解。也就是說，子問題的最佳化可以保證原問題的最佳化。

### 1.2 經典案例：區間排程問題 (Interval Scheduling)

**【問題描述】**
給定 $N$ 個區間，每個區間 $i$ 由開始時間 $s_i$ 與結束時間 $e_i$ 組成（滿足 $s_i < e_i$）。我們希望從中選擇**最多數量**的區間，使得所選的區間彼此互不重疊（意即若選擇了區間 $i$ 與區間 $j$，則必滿足 $s_j \ge e_i$ 或 $s_i \ge e_j$）。

#### 失敗的貪婪策略與反例

在找出正確的策略之前，我們先來看看幾個直覺但**錯誤**的貪婪嘗試：

* **嘗試一：每次選擇開始時間最早的區間（Earliest Start Time）**
  * *策略*：依據開始時間 $s_i$ 升冪排序，優先選擇最先開始的區間。
  * *反例*：考慮區間 $[0, 100]$、$[1, 2]$、$[2, 3]$。
    若依此策略，會選取 $[0, 100]$，接著因為重疊，無法再選取其他區間，總數為 $1$。然而最佳解應為選取 $[1, 2]$ 與 $[2, 3]$，總數為 $2$。
  * *失敗原因*：最早開始的區間可能長度極長，進而「阻塞」了後續許多短區間。

* **嘗試二：每次選擇區間長度最短的區間（Shortest Interval）**
  * *策略*：依據長度 $e_i - s_i$ 升冪排序，優先選擇耗時最短的區間。
  * *反例*：考慮區間 $[0, 3]$、$[2, 5]$、$[4, 7]$。
    長度最短的是 $[2, 5]$（長度為 $3$），若選取它，則會與 $[0, 3]$ 和 $[4, 7]$ 重疊，導致總數僅能為 $1$。然而最佳解應為選取 $[0, 3]$ 與 $[4, 7]$，總數為 $2$。
  * *失敗原因*：雖然短區間佔用的時間少，但若它恰好位於中間，會同時與左側和右側的區間發生衝突。

* **嘗試三：每次選擇與其他區間重疊次數最少的區間（Fewest Conflicts）**
  * *策略*：計算每個區間與其他多少個區間發生重疊（衝突數），優先選擇衝突數最小的區間。
  * *反例*：這是一個非常經典且具啟發性的反例。考慮以下 $10$ 個區間：
    * 輔助的短區間組：$P = [0.5, 1.5]$，$Q = [0.5, 1.5]$，$U = [8.5, 9.5]$，$V = [8.5, 9.5]$
    * 主線區間組：$A = [1, 3]$，$B = [3, 5]$，$C = [5, 7]$，$D = [7, 9]$
    * 長區間組：$X = [2, 6]$，$Y = [4, 8]$
    
    我們來計算每個區間的衝突數（重疊次數）：
    * $P, Q$：彼此重疊，且與 $A$ 重疊 $\implies$ 衝突數為 $2$。
    * $U, V$：彼此重疊，且與 $D$ 重疊 $\implies$ 衝突數為 $2$。
    * $B, C$：僅與長區間 $X, Y$ 重疊 $\implies$ 衝突數為 $2$。
    * $A$：與 $P, Q, X$ 重疊 $\implies$ 衝突數為 $3$。
    * $D$：與 $U, V, Y$ 重疊 $\implies$ 衝突數為 $3$。
    * $X$：與 $A, B, C, Y$ 重疊 $\implies$ 衝突數為 $4$。
    * $Y$：與 $B, C, D, X$ 重疊 $\implies$ 衝突數為 $4$。
    
    若採用「衝突數最少優先」策略：
    1. 演算法首先會從衝突數為 $2$ 的區間中做出選擇，假設選取了 $P$。這會排除與 $P$ 重疊的 $A$ 與 $Q$。
    2. 接著在剩下的區間中，繼續選擇衝突數最小者。例如選取 $U$，排除 $D$ 與 $V$。
    3. 此時剩下 $\{B, C, X, Y\}$，其中 $B$ 與 $C$ 衝突數為 $2$。選取 $B$ 會排除 $X$ 與 $Y$。
    4. 最後選取剩餘且無衝突的 $C$。
    5. 最終選取的集合為 $\{P, U, B, C\}$，總數為 $4$。
    
    然而，**最佳解**其實是選取 $\{P, B, C, D, U\}$（利用 $A$ 與 $D$ 斷開的地方，巧妙避開 $X$ 與 $Y$），總數為 $5$！
  * *失敗原因*：只關注衝突的數量，忽略了衝突發生的「時機」與「結構關係」。

#### 正確的貪婪策略：每次選擇結束時間最早的區間（Earliest Finish Time）

* **策略**：將所有區間依據結束時間 $e_i$ 進行升冪排序。接著由左至右掃描，只要當前區間的開始時間 $s_i$ 大於或等於上一個已選擇區間的結束時間，就選取該區間。
* **直覺思考**：結束時間越早，代表留給後續區間的剩餘時間越多，因此能容納更多區間。

---

### 1.3 貪婪正確性證明：交換論證法 (Exchange Argument)

我們將使用「**交換論證法**」來證明「結束時間最早優先」策略的正確性。

**【定理】**
「結束時間最早優先」策略所得到的區間集合，其大小等於全域最佳解的大小。

**【證明】**
設貪婪演算法選擇的區間集合為 $G = \{g_1, g_2, \dots, g_k\}$，且已依結束時間排序：$f(g_1) \le f(g_2) \le \dots \le f(g_k)$。
設某個最佳解的區間集合為 $O = \{o_1, o_2, \dots, o_m\}$，亦依結束時間排序：$f(o_1) \le f(o_2) \le \dots \le f(o_m)$。
因為 $O$ 是最佳解，顯然有 $k \le m$。我們只要能證明 $k = m$，即可說明貪婪解亦是最佳解。

我們使用數學歸納法證明一個核心命題：「**貪婪解在每一步的結束時間都領先（不遲於）最佳解**」，即：
$$\text{對於所有 } i \le k，\text{皆滿足 } f(g_i) \le f(o_i)$$

* **基底步驟 (Base Case)**：
  對於 $i = 1$，貪婪演算法在第一步必定選擇全體區間中結束時間最早的區間，因此顯然有 $f(g_1) \le f(o_1)$。

* **歸納步驟 (Inductive Step)**：
  假設當 $i = r-1$ 時命題成立，即 $f(g_{r-1}) \le f(o_{r-1})$。
  我們要證明當 $i = r$ 時，仍有 $f(g_r) \le f(o_r)$。
  
  因為最佳解 $O$ 是一個合法的無重疊區間集合，所以第 $r$ 個區間的開始時間必須大於或等於第 $r-1$ 個區間的結束時間：
  $$s(o_r) \ge f(o_{r-1})$$
  根據歸納假設，$f(g_{r-1}) \le f(o_{r-1})$，因此：
  $$s(o_r) \ge f(g_{r-1})$$
  這說明區間 $o_r$ 在貪婪演算法選擇完 $g_{r-1}$ 後，**依然是一個可被選取的合法候選區間**。
  
  由於貪婪演算法在第 $r$ 步時，必定會在所有合法的候選區間中，選擇**結束時間最早**的那一個（即 $g_r$），因此 $g_r$ 的結束時間絕對不會晚於 $o_r$ 的結束時間：
  $$f(g_r) \le f(o_r)$$
  歸納步驟成立。

* **總結步驟**：
  現在假設 $k < m$，意即最佳解包含比貪婪解更多的區間。
  既然當 $i = k$ 時滿足 $f(g_k) \le f(o_k)$，且在最佳解中，下一個區間 $o_{k+1}$ 與 $o_k$ 不重疊，因此：
  $$s(o_{k+1}) \ge f(o_k) \ge f(g_k)$$
  這意味著 $o_{k+1}$ 的開始時間晚於或等於貪婪解最後一個區間 $g_k$ 的結束時間。
  因此，$o_{k+1}$ 對於貪婪演算法而言是一個合法的可選區間。
  然而，貪婪演算法卻在選擇完 $g_k$ 後就停止了，這說明此時已無任何合法區間可選，與 $o_{k+1}$ 可被選取產生**矛盾**。
  
  因此，假設 $k < m$ 不成立，必定有 $k = m$。
  我們證明了貪婪演算法所選出的區間數量與最佳解完全相同，正確性得證。 $\blacksquare$

---

## 2. 三種語言實作範本 (C++ / Java / Python)

以下提供三種主流競爭性程式設計語言的完整實作範本。
這些範本皆採用高效的輸入輸出（Fast I/O）設計，並包含自訂結構與排序比較器。

### C++ 實作範本

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

// 定義區間結構體
struct Interval {
    int start;
    int end;
    int id; // 記錄原始編號，以便後續擴充輸出具體選擇了哪些區間
};

// 排序比較函式
// 優先按照結束時間（end time）由小到大排序；若結束時間相同，則按開始時間排序
bool compareInterval(const Interval& a, const Interval& b) {
    if (a.end != b.end) {
        return a.end < b.end;
    }
    return a.start < b.start;
}

int main() {
    // 最佳化標準輸入輸出流的效能
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;

    vector<Interval> intervals(n);
    for (int i = 0; i < n; ++i) {
        cin >> intervals[i].start >> intervals[i].end;
        intervals[i].id = i + 1;
    }

    // 步驟 1：依據結束時間進行升冪排序
    sort(intervals.begin(), intervals.end(), compareInterval);

    // 步驟 2：貪婪掃描，選擇互不重疊的區間
    int count = 0;
    int last_end_time = -2e9; // 初始化為極小值，確保第一個區間一定能被選取

    for (int i = 0; i < n; ++i) {
        // 如果當前區間的開始時間大於或等於上一個選取區間的結束時間
        // 【防禦要點】若題目定義「端點重合視為重疊」，則應將 >= 改為 >
        if (intervals[i].start >= last_end_time) {
            count++;
            last_end_time = intervals[i].end;
        }
    }

    // 輸出最大不重疊區間數
    cout << count << "\n";

    return 0;
}
```

### Java 實作範本

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.StringTokenizer;

public class Main {
    // 定義區間類別，並實作 Comparable 介面以支援排序
    static class Interval implements Comparable<Interval> {
        int start;
        int end;
        int id;

        public Interval(int start, int end, int id) {
            this.start = start;
            this.end = end;
            this.id = id;
        }

        // 比較規則：結束時間由小到大排序；若結束時間相同，則按開始時間排序
        @Override
        public int compareTo(Interval other) {
            if (this.end != other.end) {
                return Integer.compare(this.end, other.end);
            }
            return Integer.compare(this.start, other.start);
        }
    }

    public static void main(String[] args) throws IOException {
        // 使用 BufferedReader 與 StringTokenizer 實現快速輸入
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        String line = reader.readLine();
        if (line == null) return;
        
        StringTokenizer tokenizer = new StringTokenizer(line);
        int n = Integer.parseInt(tokenizer.nextToken());

        Interval[] intervals = new Interval[n];
        for (int i = 0; i < n; i++) {
            line = reader.readLine();
            if (line == null) break;
            tokenizer = new StringTokenizer(line);
            int start = Integer.parseInt(tokenizer.nextToken());
            int end = Integer.parseInt(tokenizer.nextToken());
            intervals[i] = new Interval(start, end, i + 1);
        }

        // 步驟 1：依結束時間排序
        Arrays.sort(intervals);

        // 步驟 2：貪婪選取
        int count = 0;
        int lastEndTime = Integer.MIN_VALUE; // 初始化極小值

        for (int i = 0; i < n; i++) {
            // 【防禦要點】若不允許端點重疊，將 >= 改為 >
            if (intervals[i].start >= lastEndTime) {
                count++;
                lastEndTime = intervals[i].end;
            }
        }

        System.out.println(count);
    }
}
```

### Python 實作範本

```python
import sys

def main():
    # 使用 sys.stdin.read 進行批次快速輸入
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    
    n = int(input_data[0])
    intervals = []
    
    idx = 1
    for i in range(n):
        if idx >= len(input_data):
            break
        start = int(input_data[idx])
        end = int(input_data[idx+1])
        intervals.append((start, end, i + 1))
        idx += 2
        
    # 步驟 1：排序區間
    # key=lambda x: (x[1], x[0]) 代表優先比第二個元素（結束時間），再比第一個元素（開始時間）
    intervals.sort(key=lambda x: (x[1], x[0]))
    
    # 步驟 2：貪婪掃描
    count = 0
    last_end_time = -float('inf')
    
    for start, end, interval_id in intervals:
        # 如果當前區間的開始時間大於或等於上一個選取區間的結束時間
        # 【防禦要點】若不允許端點重疊，將 >= 改為 >
        if start >= last_end_time:
            count += 1
            last_end_time = end
            
    print(count)

if __name__ == '__main__':
    main()
```

---

## 3. 複雜度與防禦要點

### 3.1 複雜度分析

* **時間複雜度**：
  * **排序階段**：對 $N$ 個區間進行排序需要 $O(N \log N)$ 的時間。
  * **貪婪掃描階段**：排序後，我們只需對區間陣列進行一次線性掃描，複雜度為 $O(N)$。
  * **總時間複雜度**：$O(N \log N)$。這在競賽中通常能輕鬆通過 $N \le 2 \times 10^5$ 的測資（耗時約 0.1 ~ 0.2 秒）。

* **空間複雜度**：
  * 我們需要額外的陣列或向量來儲存這 $N$ 個區間的資訊，因此空間複雜度為 $O(N)$。

---

### 3.2 競賽防禦要點與陷阱迴避

在撰寫貪婪演算法程式碼時，請務必注意以下細節，以防在競賽中吃下意外的「WA」或「TLE」：

1. **端點重合的定義（防禦境界）**
   * 題目常會描述「若一個活動的結束時間恰好等於下一個活動的開始時間，是否可以被連續安排？」
   * 若**可以**：使用 `start >= last_end_time`。
   * 若**不行**：使用 `start > last_end_time`。
   * 這小小的等號差異是本題最常見的失分點，讀題時務必字字斟酌。

2. **時間範圍與溢位預防**
   * 一般情況下，時間點若在 $\pm 2 \times 10^9$ 以內，使用標準 32-bit 有號整數（C++ `int`，Java `int`）即可。
   * 但若題目中的時間跨度極大（例如以微秒為單位，或自紀元以來的秒數），或者需要對時間差進行累加運算，請果斷將型態提升至 **64-bit 有號整數**（C++ `long long`，Java `long`），以防數值溢位（Overflow）。

3. **初始化極小值的安全設定**
   * 在程式碼中，`last_end_time` 的初始值必須是一個絕對小於所有可能開始時間的數值。
   * 若區間時間可能為負數，直接初始化為 `0` 會導致負數時間區間被錯誤過濾。建議在 C++ 中使用 `-2e9` 或最小極值常數（`numeric_limits<int>::min()`），Java 中使用 `Integer.MIN_VALUE`，Python 中使用 `-float('inf')`。

4. **浮點數時間的精度陷阱**
   * 若時間點以浮點數（`float` 或 `double`）表示，切記**不要直接使用 `==` 進行相等判定**！
   * 浮點數存在嚴重的精度誤差，應引入誤差極值 $\epsilon$（通常設為 `1e-9`）。
   * 判定 $A \ge B$ 應寫為：`A - B > -1e-9`。

5. **極端輸入與邊界測資**
   * **$N = 1$**：確保程式能正確選出唯一的區間。
   * **所有區間完全相同**：確保排序演算法穩定，且能正確選出其中一個。
   * **包含無效區間**（如開始時間大於結束時間）：有些題目會混入髒資料，讀題時需確認是否需要預先過濾。
