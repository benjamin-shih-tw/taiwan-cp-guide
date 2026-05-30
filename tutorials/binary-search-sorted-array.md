# 二分搜尋進階：二分答案與單調性優化

**簡介**
提到二分搜尋（Binary Search），沒有經過競程社會毒打的人，腦袋裡浮現的通常是：「喔！就是那個在排好序的陣列裡面，每次切一半找數字的演算法嘛，C++ 裡面叫 `std::lower_bound`。」

但到了競程的進階領域，二分搜尋的終極型態叫做 **「二分答案 (Binary Search on Answer)」**。
它的核心精神非常霸道：**「與其在那邊苦苦推導最佳解是怎麼湊出來的，不如我直接『猜』一個答案，然後去驗證這個答案行不行！」**

---

## 核心通靈時刻：單調性 (Monotonicity)

為什麼我們可以「猜」答案？因為這類問題的決策空間具有**單調性**。

想像一下，如果題目問你：「你最少需要幾秒才能搬完這些磚塊？」
這很難直接算對吧？但我如果換個問法：「給你 100 秒，你搬得完嗎？」你只要去模擬一次，很容易就能回答我 YES 或 NO。

* 如果 100 秒 **可以 (YES)** $\implies$ 那 101 秒、1000 秒一定也 **可以 (YES)**。
* 如果 99 秒 **不行 (NO)** $\implies$ 那 98 秒、1 秒一定也 **不行 (NO)**。

這就是單調性！整個答案的佈局會長得像這樣：`F F F F F T T T T T`（F = 不行，T = 可以）。
我們要找的「最少時間」，就是**第一個出現 T 的交界點**。既然有排序過（F 在前，T 在後），我們當然可以直接對「答案」進行二分搜尋！

---

## 經典問題建立直覺

Input:
N = 5, K = 3
Array = [2, 4, 7, 3, 5]

Output:
8
(切法為 [2, 4] | [7] | [3, 5]，總和分別是 6, 7, 8，最大值是 8，不可能切出更小的最大值了)

如果用一般的寫法會怎麼寫？

### 暴力解 (Brute Force)

🤤：「既然要切 K 段，那我們就寫一個遞迴 DFS，枚舉所有的切點，然後把每種切法的最大值記錄下來，最後取最小值吧～」

複雜度：相當於從 N-1 個空隙中選 K-1 個切點，組合數 $O(\binom{N-1}{K-1})$。遇到 N = $2 \times 10^5$，保證 TLE 炸爛到你阿嬤都不認得。

### DP 腦袋解

開一個二維 DP：`dp[i][k]` 代表前 i 個數字切 k 段的最佳解。
複雜度：時間 $O(N^2 K)$。N 太大一樣炸開。

---

### 二分答案解 (Binary Search on Answer)

我們不要去想「怎麼切」，我們直接猜答案（猜那個最大的總和 `mid`）！

**步驟拆解：**

1. **定義邊界：** * 最小的可能答案 `L` 是多少？極端情況下，我們切 N 段（每個數字自己一段），那最大總和就是陣列中的「最大值」。
* 最大的可能答案 `R` 是多少？極端情況下，我們只切 1 段，那最大總和就是「整個陣列的總和」。


2. **撰寫 `check(mid)` 函數：**
* 給你一個限制條件 `mid`，也就是規定「每一段的總和絕對不能超過 `mid`」。
* 你能不能用貪心法（Greedy）由左到右掃過去，只要加上目前的數字不會超過 `mid`，就繼續塞；超過了，就狠下心切斷，開新的一段。
* 最後看看切出來的段數有沒有 $\le K$。如果有，代表這個 `mid` 是可行的 (True)！



**code**

不考慮自己寫嗎…？為了防雷，這邊直接給你競程最標準、絕對不會陷入無窮迴圈的模板：

```cpp
#include <bits/stdc++.h>
using namespace std;

int n, k;
vector<long long> v;

// 核心：判斷如果每一段的總和都不超過 mid，能不能在 k 段以內切完？
bool check(long long mid) {
    long long current_sum = 0;
    int chunks = 1; // 至少會有 1 段
    
    for (int i = 0; i < n; i++) {
        // 如果單一元素就超過 mid，代表這個 mid 根本不可能成立
        if (v[i] > mid) return false; 
        
        if (current_sum + v[i] > mid) {
            // 裝不下了，切斷！開啟新的一段
            chunks++;
            current_sum = v[i];
        } else {
            // 還裝得下，繼續塞
            current_sum += v[i];
        }
    }
    // 如果切出來的段數 <= k，代表這個 mid 條件夠寬鬆，是可行的
    return chunks <= k;
}

int main() {
    // 優化標準 I/O 速度
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    if (!(cin >> n >> k)) return 0;
    
    v.resize(n);
    long long max_val = 0, sum_val = 0;
    for (int i = 0; i < n; i++) {
        cin >> v[i];
        max_val = max(max_val, v[i]);
        sum_val += v[i];
    }

    // 1. 定義二分搜尋邊界
    long long L = max_val; // 答案不可能比陣列中的最大值還小
    long long R = sum_val; // 答案最大就是全部包成一段

    long long ans = R;

    // 2. 開始二分搜答案
    while (L <= R) {
        long long mid = L + (R - L) / 2; // 防溢位的寫法
        
        if (check(mid)) {
            // mid 可行！代表我們找到了 T。
            // 但我們想找「最小的 T」，所以先把答案記起來，然後往左邊 (更小) 逼近
            ans = mid;
            R = mid - 1;
        } else {
            // mid 不行！代表我們撞到 F 了。
            // 條件太嚴格，必須把 mid 放寬，往右邊找
            L = mid + 1;
        }
    }

    cout << ans << "\n";
    return 0;
}

```

複雜度：

* **時間複雜度：** `check()` 跑一次是 O(N)。二分搜尋會切 O(log(Sum)) 次。總時間 O(N log(Sum))。對於十萬級別的數據也是一瞬間就算完。
* **空間複雜度：** O(N)，只需存陣列。

**result**
穩如老狗，直接 AC。

---

## 常見錯誤與防禦要點 (Corner Cases)

二分答案的觀念超簡單，但實作時死在 `while` 迴圈細節裡的人多到數不清。

| 踩坑點 | 慘痛後果 | 為什麼會這樣？ & 怎麼避免 |
| --- | --- | --- |
| **無窮迴圈 (Infinite Loop)** | TLE 到死 | 如果你用 `while(L < R)` 的寫法，很容易在 `L = mid` 的時候卡死（因為整數除法會無條件捨去，`mid` 永遠貼近 `L`）。<br>

<br>**解法：** 乖乖用上面模板 `while(L <= R)` 搭配 `ans = mid; R = mid - 1;` 的寫法，邏輯最清晰，絕對不卡死。 |
| **右邊界 `R` 沒有開 `long long**` | WA 找半天 | 陣列總和隨便都會超過 `2e9`（32-bit int 的極限），`L`, `R`, `mid` 跟 `current_sum` 請一律乖乖開 `long long`。 |
| **左邊界 `L` 設為 0** | `check()` 爛掉 | 切陣列的問題，答案最小的極限就是陣列中的**最大元素**。如果你把 `L` 設為 0，當 `mid` 比陣列某個數字還小時，`check` 會無窮切段。記得判斷 `if (v[i] > mid) return false;`。 |

---

## 練習題地圖

從簡單到難，去通靈吧：

**必做題 (照順序)**

* CSES 1620 - Factory Machines ⇒ 經典的二分答案題，求最少時間製造出 $T$ 個產品（單調性：時間越多，能做的產品一定越多）。
* CSES 1085 - Array Division ⇒ 就是上面講的範例題，請不看 code 自己手刻一次。
* SPOJ AGGRCOW - Aggressive Cows ⇒ 超級經典的農場放牛題（最大化最小值）。給你幾個座標，放 $C$ 頭牛，讓牛跟牛之間的「最短距離」越大越好。

**進階 (有空再做)**

* LeetCode 410 - Split Array Largest Sum ⇒ 其實就是 Array Division，只是換個皮，適合拿來檢驗模板手速。
* Codeforces 1201C - Maximum Median ⇒ 二分答案結合數學貪心，求在只能加 $K$ 次的情況下，陣列的中位數最大可以是多少。
