# 雙指標演算法 (Two Pointers)

雙指標（Two Pointers）是資訊科學競賽與面試中最常用且最高效的基礎演算法技巧之一。它通常用於**線性結構（如陣列、鏈結串列、字串）**上，透過維護兩個不同位置的指標同步移動，將原本暴力的 $O(N^2)$ 雙層迴圈優化至線性 $O(N)$ 的時間複雜度。

---

## 1. 核心思想與優化原理

在暴力解法中，我們通常需要使用雙層迴圈遍歷所有可能的左右邊界組合，運算次數為 $\frac{N(N-1)}{2}$，時間複雜度為 $O(N^2)$。

然而，在許多問題中，左右指標的移動具有**「單調性」**（例如：當右邊界向右移動時，滿足條件的左邊界只可能向右移動，絕不可能向左退回）。雙指標技巧正是利用了這種單調性，讓左右指標都**只往同一個方向前進，不回頭**。因為每個指標最多都只走 $N$ 步，所以總時間複雜度能神奇地降低到 $O(N)$！

根據指標的移動方向，雙指標主要分為以下兩大類：

### A. 對向雙指標（Collision Pointers / 碰撞指標）
* **特徵**：兩個指標分別初始化在數組的**最左端（頭）**與**最右端（尾）**，並向中間靠攏，直到兩指標相遇。
* **經典應用**：雙向反轉字串、判斷迴文字串、有序陣列的兩數之和（Two Sum II）。

### B. 同向雙指標（Sliding Window / 滑動視窗）
* **特徵**：兩個指標都初始化在數組的**左端**，且兩者都只向右移動。通常一個指標作為「右邊界（探針）」，另一個作為「左邊界（追趕者）」，兩者之間的區間就像一個滑動的視窗。
* **經典應用**：求滿足特定條件的最長/最短子陣列、不重複字元的最長子字串。

---

## 2. 實戰範例：有序陣列兩數之和

> **【問題描述】**
> 給定一個已經**由小到大排序**的整數陣列 `nums` 和一個目標值 `target`。請在陣列中找出兩個數，使得它們相加等於 `target`。假設每組輸入剛好只有一組解，且不能重複使用同一個位置的元素。
>
> **【雙指標解法】**
> 維護 `left` 指向陣列首端（最小元素），`right` 指向尾端（最大元素）：
> - 若 `nums[left] + nums[right] == target`，即找到答案，直接返回。
> - 若和**大於** `target`，說明目前的和太大，應將右指標向左移動 (`right--`) 以減小和。
> - 若和**小於** `target`，說明目前的和太小，應將左指標向右移動 (`left++`) 以增大和。

---

## 3. 三大語言範本程式碼 (C++ / Java / Python)

請閱讀並對照以下兩數之和（Two Sum II）的生產級雙指標實作範本：

```cpp
// C++ 雙指標實作範本
#include <bits/stdc++.h>
using namespace std;

pair<int, int> two_sum_ordered(const vector<int>& nums, int target) {
    int left = 0;
    int right = nums.size() - 1;
    
    while (left < right) {
        int current_sum = nums[left] + nums[right];
        if (current_sum == target) {
            return {left, right}; // 找到解，回傳 0-indexed 索引
        } else if (current_sum > target) {
            right--; // 和太大，將右端指標往左移
        } else {
            left++;  // 和太小，將左端指標往右移
        }
    }
    return {-1, -1}; // 無解情況
}
```

```java
// Java 雙指標實作範本
import java.util.*;

class TwoPointers {
    public static int[] twoSumOrdered(int[] nums, int target) {
        int left = 0;
        int right = nums.length - 1;
        
        while (left < right) {
            int currentSum = nums[left] + nums[right];
            if (currentSum == target) {
                return new int[]{left, right}; // 找到解，返回索引
            } else if (currentSum > target) {
                right--; // 和太大，右指標左移
            } else {
                left++;  // 和太小，左指標右移
            }
        }
        return new int[]{-1, -1};
    }
}
```

```python
# Python 雙指標實作範本
def two_sum_ordered(nums, target):
    """
    雙指標尋找有序陣列中兩數之和等於 target 的索引
    """
    left = 0
    right = len(nums) - 1
    
    while left < right:
        current_sum = nums[left] + nums[right]
        if current_sum == target:
            return left, right # 找到解
        elif current_sum > target:
            right -= 1 # 和太大，右指標左移
        else:
            left += 1  # 和太小，左指標右移
            
    return -1, -1
```

---

## 4. 複雜度與邊界防禦

* **時間複雜度**：$O(N)$。在 `while` 迴圈中，每次疊代不是 `left` 增加 $1$ 就是 `right` 減少 $1$。因此，兩個指標總移動次數最多為 $N$ 次，時間複雜度呈線性。
* **空間複雜度**：$O(1)$。僅需額外維護常數個指標變數，不佔用任何額外記憶體。
* **防禦要點**：
  1. 避免迴圈死鎖或越界：指標更新必須嚴格朝著單調方向移動。
  2. 防範指針相撞越界：`while` 迴圈終止條件必須是 `left < right`，切忌寫成 `left <= right` 造成同一個元素被重複相加兩次。
