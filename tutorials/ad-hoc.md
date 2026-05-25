# Ad-hoc 雜題與思維引導

在競爭性程式設計（Competitive Programming, CP）中，**Ad-hoc（中譯通常為「雜題」或「即興發揮題」）** 是一類無法直接套用特定演算法模板（例如線段樹、Dijkstra 演算法、動態規劃等）的題目。這類題目沒有固定的解題公式，而是高度依賴**邏輯推理**、**規律觀察**、**不變量分析**與**分類討論**。

Ad-hoc 題目在各大程式設計競賽（如 Codeforces、AtCoder、ICPC）中佔有極大的比例，通常做為考驗參賽者純粹思維能力與數學直覺的關鍵。本篇教學將系統化地整理如何面對這類「無招勝有招」的題目，並提供經典的 Ad-hoc 演算法範例——**Boyer-Moore 多數投票演算法（Boyer-Moore Majority Vote Algorithm）**。

---

## 1. 核心觀念與基本原理

### 什麼是 Ad-hoc 題目？
Ad-hoc 題目最大的特點是：**「題目本身就是解法本身」**。一旦你洞察出題目背後隱藏的數學性質或物理規律，程式碼實作往往出奇地簡單，甚至只需要幾行；但如果沒有看穿這個性質，即使寫了幾百行複雜的資料結構，也難以通過時限。

### 解鎖 Ad-hoc 的思維工具箱

當我們面對一道毫無頭緒的 Ad-hoc 題目時，可以主動嘗試以下幾種常見的思維切入點：

#### ① 小數據手推與規律觀察 (Pattern Observation on Small Cases)
當問題的規模 $N$ 很大（例如 $N \le 10^9$）時，直接模擬顯然會逾時。此時，我們可以**將問題縮小**，手動模擬 $N = 1, 2, 3, 4, 5$ 的情況。
* **做法**：畫出圖形、列出所有可能的狀態變化。
* **目的**：尋找週期的出現、對稱性、或是某種數列規律（如費氏數列、二進位規律等）。

#### ② 不變量分析 (Invariant Method)
在許多「操作類」題目中（例如：給定一個陣列，每次可以選擇兩個相鄰元素進行某種變換，問能否達到目標狀態），我們必須尋找在所有允許的操作下，**「永遠保持不變的性質」**。
* **常見的不變量**：
  * **奇偶性 (Parity)**：例如，每次操作只能改變元素值 $\pm 2$，則該元素的奇偶性是不變量。
  * **總和或餘數 (Sum or Modulo)**：某些操作可能改變元素的值，但所有元素的總和對某個數 $M$ 取模的結果保持不變。
  * **逆序對的奇偶性 (Parity of Inversions)**：在拼圖或排列移動問題中（如經典的八數碼問題），每次合法移動所改變的逆序對奇偶性具有特定規律。

#### ③ 極端值分析 (Extremal Principle)
將注意力集中在系統的**邊界或極端元素**上。例如：
* 考慮整個陣列中**最大**或**最小**的元素。
* 考慮幾何問題中最左邊、最右邊、最上面或最下面的點。
* **原因**：極端元素所受到的限制通常最多，或者它們的性質最單純，往往是打破僵局的突破口。

#### ④ 逆向思考 (Backward Induction / Reverse Operations)
如果從「初始狀態 $\to$ 目標狀態」的決策分支非常龐大且難以評估，不妨嘗試**從「目標狀態 $\to$ 初始狀態」逆向推導**。
* **優勢**：有時候，逆向操作的選擇是唯一確定的（確定性決策），或者逆向的狀態限制比正向更強，能大幅減少分支。

#### ⑤ 分類討論 (Case-by-case Analysis)
當問題看起來極度複雜時，試著將其拆解為數個**互斥且完備**的子狀況（Mutually Exclusive and Collectively Exhaustive, MECE）。
* **技巧**：分類時應從最簡單、最極端的狀況開始排除（例如 $N=1, N=2$、奇數與偶數、正數與負數），逐步化簡問題。

---

### 經典範例：Boyer-Moore 多數投票演算法

為了解釋「巧妙的線性時間規律觀察」，我們來看一個非常著名的 Ad-hoc 問題：**多數元素問題（Majority Element）**。

> **問題描述**：  
> 給定一個長度為 $N$ 的陣列，保證其中存在一個「多數元素」，其出現次數**嚴格大於** $\lfloor N/2 \rfloor$。請設計一個時間複雜度為 $O(N)$、空間複雜度為 $O(1)$ 的演算法找出這個元素。

#### 直覺的思考與瓶頸
1. **暴力法**：雙重迴圈統計每個元素出現次數，時間複雜度 $O(N^2)$，空間複雜度 $O(1)$。
2. **雜湊表（Hash Map）**：統計頻率，時間複雜度 $O(N)$，空間複雜度 $O(N)$。但這違反了空間複雜度 $O(1)$ 的限制。
3. **排序法**：排序後直接取中間的元素 `array[N/2]`。時間複雜度 $O(N \log N)$，空間複雜度 $O(1)$（若使用原地排序）。

#### 巧妙的 Ad-hoc 觀察：Boyer-Moore 演算法
Boyer-Moore 演算法的核心思維是**「消除法（Elimination）」**。

想像這是一場多政黨的投票選舉，如果我們**每次挑選兩個不同的候選人票，將它們成對抵消（同時丟棄）**，那麼最後剩下沒有被抵消掉的候選人，必定就是那個得票數過半的「多數黨」。

##### 演算法步驟：
我們維護兩個變數：
1. `candidate`：當前假設的候選人。
2. `count`：該候選人的「淨票數」（支持票減去抵消票）。

遍歷整個陣列，對於每個元素 `x`：
* 如果當前 `count == 0`，代表之前的票已經全部抵消完了。我們重新將當前元素 `x` 設為新候選人 `candidate = x`，並將票數設為 `count = 1`。
* 否則，如果 `x == candidate`，代表該候選人獲得一張支持票，`count++`。
* 否則（即 `x != candidate`），代表遇到一個不同的元素，發生一次抵消，`count--`。

遍歷結束後，`candidate` 所指向的元素就是答案。

##### 為什麼這是對的？（直觀證明）
設多數元素的出現次數為 $K$，其他所有元素的總出現次數為 $M$。根據題目定義，多數元素的數量嚴格過半，即：
$$K > M \implies K - M \ge 1$$
在最壞的情況下，所有其他非多數元素都聯合起來去抵消多數元素，由於非多數元素總共只有 $M$ 個，它們最多也只能抵消掉 $M$ 個多數元素。抵消完後，依然會至少剩下 $K - M \ge 1$ 個多數元素。因此，最後活下來的 candidate 必然是多數元素。

> [!NOTE]  
> 若題目**不保證**陣列中一定存在多數元素（出現次數大於 $\lfloor N/2 \rfloor$），則在演算法結束後，必須**再進行一次遍歷（Second Pass）**，統計該 `candidate` 的真實出現次數，以驗證其是否真的合法。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

以下提供 Boyer-Moore 多數投票演算法的完整實作模板。程式碼中包含完整的標準輸入輸出處理與「二次遍歷驗證機制」，使其能適用於更一般的 CP 競賽場景。

### C++ 實作範本

```cpp
#include <iostream>
#include <vector>
#include <optional>

using namespace std;

class Solution {
public:
    /**
     * 尋找陣列中的多數元素（出現次數 > N / 2）
     * @param nums 輸入的整數陣列
     * @return 若存在則返回該元素，否則返回 std::nullopt
     */
    optional<int> findMajorityElement(const vector<int>& nums) {
        if (nums.empty()) return nullopt;

        int candidate = 0;
        int count = 0;

        // 第一階段：Boyer-Moore 投票過濾候選人
        for (int x : nums) {
            if (count == 0) {
                candidate = x;
                count = 1;
            } else if (x == candidate) {
                count++;
            } else {
                count--;
            }
        }

        // 第二階段：驗證該候選人是否真的出現大於 N / 2 次
        int actual_count = 0;
        for (int x : nums) {
            if (x == candidate) {
                actual_count++;
            }
        }

        if (actual_count > nums.size() / 2) {
            return candidate;
        }
        return nullopt;
    }
};

int main() {
    // 優化標準 I/O 速度，CP 必備
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (cin >> n) {
        vector<int> nums(n);
        for (int i = 0; i < n; ++i) {
            cin >> nums[i];
        }

        Solution solver;
        auto result = solver.findMajorityElement(nums);

        if (result.has_value()) {
            cout << result.value() << "\n";
        } else {
            cout << -1 << "\n"; // 若無多數元素，輸出 -1
        }
    }
    return 0;
}
```

---

### Java 實作範本

```java
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.util.StringTokenizer;

public class Main {
    
    public static class Solution {
        /**
         * 尋找陣列中的多數元素（出現次數 > N / 2）
         * @param nums 輸入的整數陣列
         * @return 若存在則返回該元素，否則返回 Integer.MIN_VALUE 作為無解標記
         */
        public int findMajorityElement(int[] nums) {
            if (nums == null || nums.length == 0) {
                return Integer.MIN_VALUE;
            }

            int candidate = 0;
            int count = 0;

            // 第一階段：Boyer-Moore 投票
            for (int x : nums) {
                if (count == 0) {
                    candidate = x;
                    count = 1;
                } else if (x == candidate) {
                    count++;
                } else {
                    count--;
                }
            }

            // 第二階段：驗證
            int actualCount = 0;
            for (int x : nums) {
                if (x == candidate) {
                    actualCount++;
                }
            }

            if (actualCount > nums.length / 2) {
                return candidate;
            }
            return Integer.MIN_VALUE;
        }
    }

    public static void main(String[] args) throws IOException {
        // 使用 BufferedReader 快讀以提升效能
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        String line = reader.readLine();
        if (line == null) return;
        
        int n = Integer.parseInt(line.trim());
        int[] nums = new int[n];
        
        line = reader.readLine();
        if (line != null) {
            StringTokenizer tokenizer = new StringTokenizer(line);
            for (int i = 0; i < n; i++) {
                if (tokenizer.hasMoreTokens()) {
                    nums[i] = Integer.parseInt(tokenizer.nextToken());
                }
            }
        }

        Solution solver = new Solution();
        int result = solver.findMajorityElement(nums);
        
        if (result != Integer.MIN_VALUE) {
            System.out.println(result);
        } else {
            System.out.println(-1);
        }
    }
}
```

---

### Python 實作範本

```python
import sys

class Solution:
    def find_majority_element(self, nums: list[int]) -> int | None:
        """
        尋找陣列中的多數元素（出現次數 > N / 2）
        :param nums: 輸入的整數陣列
        :return: 若存在則返回該元素，否則返回 None
        """
        if not nums:
            return None
            
        candidate = None
        count = 0
        
        # 第一階段：Boyer-Moore 投票
        for x in nums:
            if count == 0:
                candidate = x
                count = 1
            elif x == candidate:
                count += 1
            else:
                count -= 1
                
        # 第二階段：驗證
        actual_count = sum(1 for x in nums if x == candidate)
        
        if actual_count > len(nums) // 2:
            return candidate
        return None

def main():
    # 快速讀取所有輸入
    input_data = sys.stdin.read().split()
    if not input_data:
        return
        
    n = int(input_data[0])
    nums = [int(x) for x in input_data[1:n+1]]
    
    solver = Solution()
    result = solver.find_majority_element(nums)
    
    if result is not None:
        print(result)
    else:
        print(-1)

if __name__ == '__main__':
    main()
```

---

## 3. 複雜度與防禦要點

### 複雜度分析

| 指標 | 複雜度 | 說明 |
| :--- | :--- | :--- |
| **時間複雜度 (Time Complexity)** | $\mathcal{O}(N)$ | 僅需對陣列進行兩次線性掃描（First Pass 篩選，Second Pass 驗證）。 |
| **空間複雜度 (Space Complexity)** | $\mathcal{O}(1)$ | 只使用了 `candidate` 與 `count` 兩個輔助變數，不隨輸入規模 $N$ 增加而成長。 |

### 防禦性程式設計與邊界處理 (Corner Cases)

在撰寫 Ad-hoc 程式碼時，由於沒有標準框架的保護，極易在邊界狀況崩潰。請務必在提交前檢查以下要點：

#### ① 數據極端小（如 $N = 1$ 或 $N = 2$）
* **問題**：對於 Boyer-Moore 演算法，若 $N=1$，若沒有處理好初始條件，可能導致 `count` 計算錯誤或指標越界。
* **防範**：在函式入口處增加強健性檢查（Robustness Check）：
  ```cpp
  if (nums.empty()) return nullopt;
  if (nums.size() == 1) return nums[0];
  ```

#### ② 溢位防範 (Numerical Overflow)
* **問題**：Ad-hoc 問題常涉及數值計算（如累積總和、乘積、或是奇偶抵消）。當 $N \le 10^5$，如果元素值接近 $10^9$，加總時很容易突破 32 位元有號整數（`int`）的上限 $2 \times 10^9$。
* **防範**：
  * 當題目涉及累加、乘法、或是排列組合時，應優先使用 **64 位元整數**（C++ 中的 `long long`，Java 中的 `long`）。
  * 在計算中間乘積時，要小心先乘後除的溢位，例如計算底層幾何面積或斜率時：
    ```cpp
    // 錯誤範例（會溢位）：
    long long area = dx * dy; 
    
    // 正確範例：
    long long area = static_cast<long long>(dx) * dy;
    ```

#### ③ 多數元素不存在的陷阱
* **問題**：有些題目保證有解，有些則沒有。如果題目沒有保證多數元素存在，省略「第二階段驗證」將會導致輸出錯誤的答案。
* **例子**：對於輸入 `[1, 2, 3]`，若不進行第二階段驗證，Boyer-Moore 演算法最後會輸出 `3`（因為最後一次迴圈 `count` 從 0 變 1），但 `3` 並沒有出現超過 $\lfloor 3/2 \rfloor = 1$ 次。
* **防禦**：永遠維持兩階段設計，確認所得候選人的真實出現頻率。

#### ④ 陣列索引與操作合法性
在許多 Ad-hoc 的「模擬變換」題目中，我們會寫出類似 `nums[i] = nums[i+1]` 的代碼。
* **防禦**：必須時刻注意 `i + 1 < N` 的邊界限制，防止 RE (Runtime Error) 造成罰時。

---

## 4. 實戰練習與思維訓練

要提升 Ad-hoc 的解題能力，最有效的方式就是進行「無主題隨機刷題」，強迫自己不依賴標籤思考。以下是推薦的訓練方向：

1. **Codeforces Div.2 A/B/C 題**：這類題目通常沒有高深的演算法，純粹考驗 Ad-hoc 觀察力與小數據手推。
2. **AtCoder Beginner Contest (ABC) C/D/E 題**：日本競賽風格偏向數學與巧妙的構造性（Constructive）問題，是訓練邏輯與不變量分析的極佳場所。
3. **經典思維題型**：
   * **構造題 (Constructive Algorithms)**：要求輸出任意一個符合特定奇特條件的陣列或矩陣。通常需要先畫出對稱圖案或特例。
   * **博弈題 (Game Theory / Impartial Games)**：觀察先手與後手在小數據下的必勝態（Winning State）與必敗態（Losing State），進而歸納出對稱性或奇偶性。
