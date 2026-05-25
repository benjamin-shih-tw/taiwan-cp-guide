# 關聯式容器：std::set 與 std::map

在競賽程式（Competitive Programming, CP）中，我們經常需要動態地維護一個集合，並在其中進行快速的插入、刪除與查詢。C++ 標準函式庫（STL）提供的 `std::set` 與 `std::map` 就是為了解決這類問題而生的強大工具。

本教學將深入探討這兩種關聯式容器的核心原理、底層的紅黑樹結構、常見的應用場景（如動態去重、頻率統計與區間查詢），並提供 C++、Java 與 Python 的完整實作範本與競賽防禦要點。

---

## 1. 核心觀念與基本原理

### 什麼是 set 與 map？
* **`std::set`（集合）**：一個儲存「不重複元素」且「會自動排序」的容器。
* **`std::map`（對照表 / 關聯陣列）**：一個儲存「鍵值對（Key-Value Pair）」的容器。其中每個「鍵（Key）」都是唯一的，且容器會根據鍵的大小自動排序。

### 底層結構：紅黑樹（Red-Black Tree）
`std::set` 與 `std::map` 的底層皆是由**自平衡二元搜尋樹（Self-balancing Binary Search Tree）**中的**紅黑樹（Red-Black Tree）**所實作。
* **紅黑樹的特性**：
  1. 每個節點不是紅色就是黑色。
  2. 根節點是黑色。
  3. 所有葉子節點（NIL 節點）都是黑色。
  4. 如果一個節點是紅色的，則它的兩個子節點都是黑色的（即不會有連續的紅色節點）。
  5. 從任一節點到其所有後代葉子節點的簡單路徑上，均包含相同數目的黑色節點（這保證了樹的平衡度，最長路徑不超過最短路徑的兩倍）。
* **時間複雜度保證**：
  由於紅黑樹高度始終維持在 $O(\log N)$，因此不論是**插入（Insertion）**、**刪除（Deletion）**還是**搜尋（Search）**，其最壞情況與均攤時間複雜度皆為 $O(\log N)$。

### 關聯式容器與雜湊容器的對比
在選擇容器時，我們常會拿 `std::set` / `std::map` 與基於雜湊表（Hash Table）的 `std::unordered_set` / `std::unordered_map` 進行比較：

| 特性 | `std::set` / `std::map` | `std::unordered_set` / `std::unordered_map` |
| :--- | :--- | :--- |
| **底層結構** | 紅黑樹（平衡二元搜尋樹） | 雜湊表（Hash Table） |
| **元素順序** | 有序（依 Key 由小到大，可自訂比較器） | 無序 |
| **單次操作時間複雜度** | 嚴格 $O(\log N)$ | 平均 $O(1)$，最壞 $O(N)$（當發生嚴重雜湊衝突時） |
| **空間複雜度** | $O(N)$，但節點記憶體開銷較大（指標與顏色標記） | $O(N)$ |
| **支援操作** | 區間查詢、找前驅/後繼元素（`lower_bound`/`upper_bound`） | 僅支援單點查詢 |

> [!TIP]
> **競賽防禦指南**：在 Codeforces 等平台中，使用 `unordered_map` 時常會被刻意構造的測試資料（Anti-hash test cases）卡到最壞複雜度 $O(N)$ 而導致 TLE（Time Limit Exceeded）。因此，除非有自訂雜湊函數（Safe Hash），否則在不確定測資強度時，使用嚴格 $O(\log N)$ 的 `std::set` 或 `std::map` 是更安全的防禦性選擇。

### 核心應用場景
1. **動態去重（Dynamic De-duplication）**：
   在資料流輸入的過程中，隨時維持一個不重複的元素集合。若新進元素已存在則忽略。
2. **數值頻率統計（Value Frequency Counts）**：
   利用 `map` 的 Key 儲存元素，Value 儲存出現次數。相較於用陣列直接計數，`map` 可以處理數值範圍極大（例如 $1 \le A_i \le 10^9$）但元素總量 $N$ 較小（如 $N \le 2 \times 10^5$）的情況。
3. **快速二分搜尋與區間查詢（Quick Range Lookups）**：
   利用 `lower_bound`（尋找大於或等於給定值的第一個元素）與 `upper_bound`（尋找大於給定值的第一個元素）來動態尋找元素的最接近邊界。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

我們將展示如何實作以下經典競賽任務：
1. 輸入 $N$ 個元素，動態插入集合並去重。
2. 統計每個元素出現的次數。
3. 查詢某個元素是否存在。
4. 尋找第一個大於或等於指定值的元素（二分搜尋）。
5. 刪除指定元素（並示範 `multiset` 刪除單一元素的防禦寫法）。

### C++ 實作範本

```cpp
#include <iostream>
#include <set>
#include <map>
#include <vector>
#include <algorithm>

using namespace std;

// 為了提高 I/O 效率，競賽中建議開啟 Fast I/O
void fast_io() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
}

int main() {
    fast_io();

    // ==========================================
    // 1. std::set 基本操作 (動態去重與有序查詢)
    // ==========================================
    set<int> my_set;
    
    // 插入元素 (會自動去重且排序)
    my_set.insert(5);
    my_set.insert(3);
    my_set.insert(8);
    my_set.insert(5); // 重複插入，將被忽略

    cout << "Set elements (sorted and unique): ";
    for (int x : my_set) {
        cout << x << " "; // 輸出: 3 5 8
    }
    cout << "\n";

    // 查詢元素是否存在
    int target = 5;
    if (my_set.count(target)) {
        cout << target << " exists in the set.\n";
    } else {
        cout << target << " does not exist in the set.\n";
    }

    // 刪除元素
    my_set.erase(5);
    cout << "After erasing 5, set contains:";
    for (int x : my_set) cout << " " << x; // 輸出: 3 8
    cout << "\n";

    // 二分搜尋：lower_bound 與 upper_bound
    my_set.insert(10);
    my_set.insert(15); // 目前集合：{3, 8, 10, 15}
    
    // lower_bound(x) 回傳第一個「大於或等於 x」的迭代器
    auto it1 = my_set.lower_bound(9);
    if (it1 != my_set.end()) {
        cout << "First element >= 9: " << *it1 << "\n"; // 輸出: 10
    }

    // upper_bound(x) 回傳第一個「嚴格大於 x」的迭代器
    auto it2 = my_set.upper_bound(10);
    if (it2 != my_set.end()) {
        cout << "First element > 10: " << *it2 << "\n"; // 輸出: 15
    }

    // ==========================================
    // 2. std::map 基本操作 (頻率統計)
    // ==========================================
    map<string, int> freq_map;
    vector<string> items = {"apple", "banana", "apple", "cherry", "banana", "apple"};

    // 動態統計次數
    for (const string& item : items) {
        freq_map[item]++;
    }

    cout << "\nFrequency count (sorted by key):\n";
    for (auto const& [key, val] : freq_map) {
        cout << key << ": " << val << "\n";
    }

    // 查詢鍵是否存在
    string query_key = "banana";
    auto map_it = freq_map.find(query_key);
    if (map_it != freq_map.end()) {
        cout << query_key << " found with frequency: " << map_it->second << "\n";
    }

    // ==========================================
    // 3. std::multiset 防禦性刪除範例
    // ==========================================
    multiset<int> my_multiset = {2, 4, 4, 4, 6};

    // 錯誤示範：直接傳入數值會刪除「所有」該數值的節點
    // my_multiset.erase(4); // 這會把三個 4 全部刪光！

    // 正確防禦寫法：僅刪除「單一個」4
    auto find_it = my_multiset.find(4);
    if (find_it != my_multiset.end()) {
        my_multiset.erase(find_it); // 傳入迭代器，只刪除該迭代器指向的單一節點
    }

    cout << "\nMultiset after deleting ONE '4': ";
    for (int x : my_multiset) cout << x << " "; // 輸出: 2 4 4 6
    cout << "\n";

    return 0;
}
```

### Java 實作範本

在 Java 中，對應紅黑樹實作的容器為 `java.util.TreeSet` 與 `java.util.TreeMap`。

```java
import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        // Fast I/O 初始化
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        PrintWriter pw = new PrintWriter(new BufferedWriter(new OutputStreamWriter(System.out)));

        // ==========================================
        // 1. TreeSet 基本操作 (對應 std::set)
        // ==========================================
        TreeSet<Integer> treeSet = new TreeSet<>();

        // 插入元素 (自動去重與排序)
        treeSet.add(5);
        treeSet.add(3);
        treeSet.add(8);
        treeSet.add(5); // 重複插入被忽略

        pw.print("TreeSet elements: ");
        for (int x : treeSet) {
            pw.print(x + " "); // 輸出: 3 5 8
        }
        pw.println();

        // 查詢是否存在
        if (treeSet.contains(5)) {
            pw.println("5 exists in TreeSet.");
        }

        // 刪除元素
        treeSet.remove(5);

        // 二分搜尋 (Java TreeSet 提供的方法非常直觀)
        treeSet.add(10);
        treeSet.add(15); // 目前集合: {3, 8, 10, 15}

        // ceiling(x) 回傳第一個「大於或等於 x」的元素 (對應 lower_bound)
        Integer ceilVal = treeSet.ceiling(9);
        pw.println("First element >= 9: " + ceilVal); // 輸出: 10

        // higher(x) 回傳第一個「嚴格大於 x」的元素 (對應 upper_bound)
        Integer highVal = treeSet.higher(10);
        pw.println("First element > 10: " + highVal); // 輸出: 15

        // floor(x) 回傳第一個「小於或等於 x」的元素
        // lower(x) 回傳第一個「嚴格小於 x」的元素

        // ==========================================
        // 2. TreeMap 基本操作 (對應 std::map)
        // ==========================================
        TreeMap<String, Integer> treeMap = new TreeMap<>();
        String[] items = {"apple", "banana", "apple", "cherry", "banana", "apple"};

        for (String item : items) {
            treeMap.put(item, treeMap.getOrDefault(item, 0) + 1);
        }

        pw.println("\nTreeMap frequency count (sorted):");
        for (Map.Entry<String, Integer> entry : treeMap.entrySet()) {
            pw.println(entry.getKey() + ": " + entry.getValue());
        }

        // 查詢 Key 是否存在
        if (treeMap.containsKey("banana")) {
            pw.println("banana frequency: " + treeMap.get("banana"));
        }

        // 必須手動 flush 確保資料輸出
        pw.flush();
    }
}
```

### Python 實作範本

> [!NOTE]
> Python 標準函式庫中的 `set` 與 `dict` 是基於**雜湊表（Hash Table）**實作的，其單次操作平均複雜度為 $O(1)$。
> 若要在 Python 中實現類似紅黑樹的 **$O(\log N)$ 有序集合操作**（例如求 `lower_bound`），在競賽中有兩種主要做法：
> 1. 如果插入操作不多，可以使用一個已經排序好的 `list`，並使用 `bisect` 模組進行二分搜尋。
> 2. 如果需要高頻率的動態插入與排序查詢，可以使用第三方庫 `sortedcontainers` 中的 `SortedList`（許多主流 CP 平台如 LeetCode、Codeforces 已支援）。若平台不支援，則需手寫 Treap 或使用分塊（Sqrt Decomposition）等技巧。
> 
> 以下範本同時示範**標準雜湊去重與頻率統計**，以及**使用 `bisect` 在有序 list 上模擬 lower_bound/upper_bound** 的技巧。

```python
import sys
import bisect

def main():
    # 讀取所有輸入以加快 I/O
    input = sys.stdin.read
    
    # ==========================================
    # 1. Python 標準 set 與 dict (基於雜湊表，O(1))
    # ==========================================
    # 去重
    my_set = set()
    my_set.add(5)
    my_set.add(3)
    my_set.add(8)
    my_set.add(5) # 重複插入自動忽略
    
    print(f"Set elements: {my_set}") # 無序輸出，例如 {3, 5, 8}
    
    if 5 in my_set:
        print("5 exists in set.")
        
    my_set.discard(5) # 刪除 5 (使用 discard 即使元素不存在也不會報錯)

    # 頻率統計 (dict)
    items = ["apple", "banana", "apple", "cherry", "banana", "apple"]
    freq_dict = {}
    for item in items:
        freq_dict[item] = freq_dict.get(item, 0) + 1
        
    print("\nFrequency count:")
    for key in sorted(freq_dict.keys()): # 手動排序輸出
        print(f"{key}: {freq_dict[key]}")

    # ==========================================
    # 2. 使用 bisect 模擬有序集合與二分搜尋 (O(log N))
    # ==========================================
    # 注意：在動態插入時，使用 list.insert(index, val) 的複雜度為 O(N)
    # 若插入次數少、查詢多，此方法非常實用
    ordered_list = [3, 8, 10, 15] # 必須維持遞增順序
    
    # 模擬 lower_bound: 第一個 >= 9 的元素
    # bisect_left(list, x) 回傳第一個 >= x 的插入位置
    idx1 = bisect.bisect_left(ordered_list, 9)
    if idx1 < len(ordered_list):
        print(f"\nFirst element >= 9: {ordered_list[idx1]}") # 輸出: 10
        
    # 模擬 upper_bound: 第一個 > 10 的元素
    # bisect_right(list, x) 回傳第一個 > x 的插入位置
    idx2 = bisect.bisect_right(ordered_list, 10)
    if idx2 < len(ordered_list):
        print(f"First element > 10: {ordered_list[idx2]}") # 輸出: 15

if __name__ == '__main__':
    main()
```

---

## 3. 複雜度與防禦要點

### 複雜度分析

| 操作 \ 容器 | `std::set` / `std::map` (紅黑樹) | `std::unordered_set` / `std::unordered_map` (雜湊表) |
| :--- | :--- | :--- |
| **插入 (Insert / Add)** | $O(\log N)$ | 平均 $O(1)$ / 最壞 $O(N)$ |
| **刪除 (Erase / Remove)** | $O(\log N)$ | 平均 $O(1)$ / 最壞 $O(N)$ |
| **單點查詢 (Find / Contains)** | $O(\log N)$ | 平均 $O(1)$ / 最壞 $O(N)$ |
| **二分查詢 (`lower_bound` 等)** | $O(\log N)$ | 不支援 |
| **空間複雜度 (Space Complexity)** | $O(N)$（每個節點有額外指標開銷） | $O(N)$（儲存雜湊桶與鏈結串列） |

### 競賽防禦與避坑指南

#### 1. 數值溢位防範 (Numerical Overflow)
* **問題**：若將數值頻率累加，或是將 map 的 Key / Value 用於求和計算，極易導致溢位。
* **防禦方法**：
  * 當計數器可能累加超過 $2^{31}-1 \approx 2 \times 10^9$ 時，`map` 的值型態（Value Type）必須使用 64-bit 整數（C++ `long long`, Java `long`, Python 預設支援無限精度整數）。
  * 範例：`map<string, long long> big_counter;`

#### 2. `multiset::erase` 的致命陷阱
* **陷阱**：在 C++ 中，`my_multiset.erase(val)` 會將所有值等於 `val` 的元素**全部刪除**。
* **防禦**：若只想刪除「一個」重複元素，必須先用 `find()` 尋找該元素的迭代器，並將迭代器傳入 `erase()` 中：
  ```cpp
  auto it = my_multiset.find(val);
  if (it != my_multiset.end()) {
      my_multiset.erase(it); // 只刪除此迭代器指向的單一節點
  }
  ```

#### 3. 迭代器失效 (Iterator Invalidation)
* 在進行 `set` / `map` 遍歷時，如果一邊遍歷一邊進行 `erase` 操作，會導致迭代器失效而造成 Runtime Error。
* **防禦**：C++ 中安全的刪除寫法：
  ```cpp
  for (auto it = my_set.begin(); it != my_set.end(); ) {
      if (*it % 2 == 0) {
          it = my_set.erase(it); // erase 會回傳下一個有效的迭代器
      } else {
          ++it;
      }
  }
  ```

#### 4. 自訂型態排序 (Custom Comparator)
* `std::set` 與 `std::map` 需要定義元素的「大小關係」（嚴格弱序，Strict Weak Ordering）以建立二元樹。
* 若使用自訂的 `struct` 或 `class` 作為 Key，必須過載 `operator<`：
  ```cpp
  struct Point {
      int x, y;
      bool operator<(const Point& other) const {
          if (x != other.x) return x < other.x;
          return y < other.y;
      }
  };
  set<Point> point_set; // 正常編譯與運作
  ```
  如果沒有定義過載運算子，編譯器將會報出極度複雜且難以閱讀的錯誤訊息。

#### 5. 邊界情況 (Edge Cases)
* **$N = 1$ 或空集合**：當集合為空或僅有一個元素時，調用 `lower_bound` 或 `upper_bound` 常會回傳 `end()`。在使用迭代器取值前，**務必**先判斷是否等於 `end()`，以防發生 Segment Fault。
