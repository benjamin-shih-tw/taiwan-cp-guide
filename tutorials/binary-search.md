# 二分搜尋演算法 (Binary Search)

二分搜尋（Binary Search）是演算法領域中「以時間換取極致效率」的代表作。它能在對數時間 **$O(\log N)$** 內，在一個已經**排好序（Sorted）**的集合中快速定位目標值。更重要的是，在資訊科學競賽中，它常被用於**「二分搜答案」**技巧，將複雜的「求解問題」轉化為簡單的「判定問題」，是突破許多中高階題目的關鍵破局點。

---

## 1. 核心思想與折半原理

想像你在玩一個「猜數字遊戲」，範圍是 $1$ 到 $100$，答案是 $37$。
* 如果你用暴力法從 $1$ 開始一個一個猜，最壞需要猜 $100$ 次。
* 如果你每次都猜**中間值**：
  1. 「我猜 $50$」 $\to$ 「太大了！」（答案在 $[1, 49]$ 之間）
  2. 「我猜 $25$」 $\to$ 「太小了！」（答案在 $[26, 49]$ 之間）
  3. 「我猜 $37$」 $\to$ 「恭喜答對！」（只花了 $3$ 次）

這正是二分搜尋的精髓：**利用資料的單調性，每次比對後都將問題的搜尋範圍折半（砍掉一半不符合條件的區間）。** 

---

## 2. 二分搜尋的兩大應用場景

### A. 陣列元素檢索 (Binary Search on Array)
在有序陣列中尋找目標值是否存在，或查找首個大於等於目標值的位置（C++ 中的 `std::lower_bound` 邏輯）。

### B. 二分搜答案 (Binary Search on Answer)
這是競程中最核心的高階應用。若一個問題的答案範圍落在區間 $[L, R]$，且該問題具有**「單調性」**（例如：若長度 $X$ 可以滿足條件，則大於 $X$ 的所有長度也一定滿足條件；反之若不行，則更短的也不行）。

我們可以二分列舉答案 `mid`，並寫一個簡單的 `check(mid)` 判定函數：
* 若 `check(mid)` 回傳 `true`，說明答案可能還能更優，搜尋範圍縮小至 $[mid, R]$。
* 若 `check(mid)` 回傳 `false`，說明這個答案不可行，搜尋範圍縮小至 $[L, mid-1]$。

---

## 3. 三大語言範本程式碼 (C++ / Java / Python)

以下提供在有序陣列中尋找目標值的經典二分搜尋實作範本：

```cpp
// C++ 二分搜尋實作範本
#include <bits/stdc++.h>
using namespace std;

// 在有序陣列 nums 中尋找 target，返回其 0-indexed 索引，若不存在返回 -1
int binary_search_basic(const vector<int>& nums, int target) {
    int left = 0;
    int right = nums.size() - 1;
    
    while (left <= right) {
        // 防止 (left + right) 相加時產生 int 溢位
        int mid = left + (right - left) / 2;
        
        if (nums[mid] == target) {
            return mid; // 找到目標，直接返回索引
        } else if (nums[mid] < target) {
            left = mid + 1; // 目標在右半邊，縮小左邊界
        } else {
            right = mid - 1; // 目標在左半邊，縮小右邊界
        }
    }
    return -1; // 搜尋範圍耗盡，未找到目標
}
```

```java
// Java 二分搜尋實作範本
class BinarySearch {
    // 在升序陣列 nums 中尋找 target，若不存在返回 -1
    public static int binarySearch(int[] nums, int target) {
        int left = 0;
        int right = nums.length - 1;
        
        while (left <= right) {
            // 安全防禦防溢位計算中點
            int mid = left + (right - left) / 2;
            
            if (nums[mid] == target) {
                return mid; // 找到目標
            } else if (nums[mid] < target) {
                left = mid + 1; // 往右半部收縮
            } else {
                right = mid - 1; // 往左半部收縮
            }
        }
        return -1;
    }
}
```

```python
# Python 二分搜尋實作範本
def binary_search(nums, target):
    """
    在已排序陣列 nums 中進行對數時間二分搜尋目標 target
    """
    left = 0
    right = len(nums) - 1
    
    while left <= right:
        # Python 內建支援無限大整數，但採用防溢位寫法是良好的跨語言習慣
        mid = left + (right - left) // 2
        
        if nums[mid] == target:
            return mid # 找到目標
        elif nums[mid] < target:
            left = mid + 1 # 搜尋右半區
        else:
            right = mid - 1 # 搜尋左半區
            
    return -1
```

---

## 4. 複雜度與防禦要點

* **時間複雜度**：$O(\log N)$。每次搜尋範圍縮減一半，最多疊代 $\log_2 N$ 次。
* **空間複雜度**：$O(1)$。僅使用常數個邊界變數。
* **溢位防禦 (Integer Overflow)**：
  在計算中點時，傳統教科書常寫成 `int mid = (left + right) / 2;`。在競程中，如果陣列極大，`left + right` 的值可能會超出 $32$ 位元有號整數上限（`2^31 - 1`）產生負數溢位，導致陣列存取越界崩潰。
  **安全防禦公式為**：`int mid = left + (right - left) / 2;`。
* **無窮迴圈防禦 (Infinite Loop)**：
  若將搜尋區間寫成 `[left, right)`，或在指標轉移時使用 `left = mid` 或 `right = mid`，在區間縮小至只剩兩個元素時極易陷入死鎖。
  確保在開區間/閉區間的框架下：
  - 若 `left <= right` 則每次縮減必須為 `left = mid + 1` 與 `right = mid - 1`，確保區間有在單調收縮。
