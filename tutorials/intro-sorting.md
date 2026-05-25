# 基礎排序與自訂比較 (Introduction to Sorting and Custom Comparison)

在演算法競賽與實際軟體開發中，**排序 (Sorting)** 是最基礎且最重要的運算之一。許多進階演算法（例如二分搜尋、雙指標、貪心演算法、離散化，以及幾何演算法中的掃描線）都必須建立在已排序的資料之上。本教學將帶領你深入理解排序的核心觀念、C++ `std::sort` 的高效原理，以及如何在 C++、Java 與 Python 中實作基礎與自訂比較排序。

---

## 1. 核心觀念與基本原理

### 為什麼需要排序？
將一組無序的資料整理成具有單調性（遞增或遞減）的序列，能大幅降低後續查詢與處理的時間複雜度。例如：
- 在無序陣列中尋找一個數需要 $O(N)$ 的時間。
- 在已排序陣列中利用**二分搜尋 (Binary Search)** 只需要 $O(\log N)$ 的時間。

### 比較類排序的理論下界
在計算機科學中，**基於比較 (Comparison-based)** 的排序演算法，其時間複雜度的理論下界為 $\Omega(N \log N)$。這是因為 $N$ 個元素共有 $N!$ 種不同的排列方式，每次兩兩比較最多只能將可能性的範圍縮小一半（決策樹的二元分支），因此定位到唯一正確排列的比較次數至少為：
$$\log_2(N!) \approx N \log_2 N - N \log_2 e = \Theta(N \log N)$$
常見的 $O(N \log N)$ 比較排序演算法包括：**快速排序 (Quick Sort)**、**合併排序 (Merge Sort)** 與**堆積排序 (Heap Sort)**。

### 為什麼 `std::sort` 如此高效？——內省排序 (Introsort)
C++ 標準函式庫中的 `std::sort` 實作通常不是單一的排序演算法，而是結合了多種演算法優點的**內省排序 (Introsort)**。它的設計哲學是「在不同的資料規模與狀態下，採用最適當的演算法」：

1. **快速排序 (Quick Sort)**：
   作為主要的排序骨架。快速排序在平均情況下常數極小、速度極快，但在基準值 (Pivot) 選擇不佳時，最壞情況的時間複雜度會退化至 $O(N^2)$。
2. **堆積排序 (Heap Sort)**：
   為了防止快速排序退化，內省排序會監控遞迴的深度。當遞迴深度超過設定的閾值（通常為 $2 \lfloor \log_2 N \rfloor$）時，演算法會自動切換為堆積排序。堆積排序雖然常數較大，但保證最壞情況下的時間複雜度仍為 $O(N \log N)$。
3. **插入排序 (Insertion Sort)**：
   當分割出來的子陣列長度非常小（通常小於 16 或 32 個元素）時，演算法會切換至插入排序。因為在資料量極小時，插入排序的常數優勢遠大於 $O(N \log N)$ 演算法的遞迴開銷；且對於幾乎有序的陣列，插入排序能接近 $O(N)$ 的高效表現。

透過這種動態調整，`std::sort` 同時具備了快速排序的超快平均速度、堆積排序的最壞情況保障，以及插入排序在小資料量下的極低開銷。

### 穩定排序 vs. 不穩定排序 (Stable vs. Unstable Sort)
- **穩定排序 (Stable Sort)**：若排序前後，鍵值相同的元素其**相對順序保持不變**，則稱該排序為穩定排序。常見的穩定排序有：合併排序 (Merge Sort)、插入排序 (Insertion Sort)、Timsort。
- **不穩定排序 (Unstable Sort)**：不保證相同鍵值元素的相對順序。常見的有：快速排序 (Quick Sort)、堆積排序 (Heap Sort)、選擇排序 (Selection Sort)。

在 C++ 中：
- `std::sort` 是**不穩定**排序。
- 如果你的應用場景需要保證相同元素的相對順序（例如：先按分數排序，分數相同時保留原本輸入的先後順序），應使用 `std::stable_sort`。

### 自訂比較與嚴格弱序 (Strict Weak Ordering)
當我們需要排序結構體（例如點座標、學生資料）或需要非標準的排序順序（例如奇數排在偶數前面）時，就必須自訂比較規則。

在 C++ 中，傳遞給 `std::sort` 的比較判定準則（不論是自訂函式、仿函式，還是 Lambda 運算式）**必須滿足「嚴格弱序 (Strict Weak Ordering)」**。它包含以下四個數學性質：
1. **反自反性 (Irreflexivity)**：對於任意元素 $x$，`comp(x, x)` 必須為 `false`。
2. **非對稱性 (Asymmetry)**：若 `comp(x, y)` 為 `true`，則 `comp(y, x)` 必須為 `false`。
3. **傳遞性 (Transitivity)**：若 `comp(x, y)` 為 `true` 且 `comp(y, z)` 為 `true`，則 `comp(x, z)` 必須為 `true`。
4. **不可區分性的傳遞性 (Transitivity of Equivalence)**：定義「等價」關係為 `!comp(x, y) && !comp(y, x)`。若 $x$ 與 $y$ 等價，且 $y$ 與 $z$ 等價，則 $x$ 與 $z$ 必須等價。

> [!WARNING]
> **極重要陷阱**：在實作 C++ 比較函式時，**切勿使用 `<=` 或 `>=` 代替 `<` 或 `>`**！
> 如果你寫了 `a <= b`，那麼當兩個元素的值相等時（即 $a = b$），`comp(a, a)` 將返回 `true`，這直接違反了**反自反性**。這會導致 `std::sort` 內部在劃分區間時，基準元素無法正確定位，指針會不斷移動直到發生記憶體越界，最終導致**執行期錯誤 (Runtime Error / Segmentation Fault)**。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

以下我們使用一個具體的競程場景來展示三種語言的實作。
**任務目標**：
1. 對基本數值陣列與動態陣列進行遞增、遞減排序。
2. 自訂一個 `Point` 結構（包含 `x` 與 `y`），並按照以下規則排序：
   - 第一關鍵字（主鍵）：`x` 座標**遞增**（從小到大）。
   - 第二關鍵字（副鍵）：若 `x` 座標相同，則按 `y` 座標**遞減**（從大到小）。

### C++ 實作範本

C++ 的 `std::sort` 位於 `<algorithm>` 標頭檔中，接受兩個迭代器作為區間，並可選擇性傳入第三個參數作為自訂比較器。

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <functional> // 包含 std::greater

// 定義二維點結構體
struct Point {
    int x;
    int y;
};

// 1. 全域比較函式：排序 Point (x 遞增，x 相等時 y 遞減)
// 務必滿足嚴格弱序 (Strict Weak Ordering)，當 a 與 b 等價時必須返回 false
bool comparePoints(const Point& a, const Point& b) {
    if (a.x != b.x) {
        return a.x < b.x; // x 較小者排在前面 (遞增)
    }
    return a.y > b.y; // x 相等時，y 較大者排在前面 (遞減)
}

// 2. 在結構體內部載入小於運算子 (Operator Overloading)
// 這是讓 Point 可以直接使用 std::sort(v.begin(), v.end()) 的常見做法
struct PointWithOp {
    int x;
    int y;

    // 必須為 const 函式，且參數為 const 參照
    bool operator<(const PointWithOp& other) const {
        if (x != other.x) {
            return x < other.x;
        }
        return y > other.y;
    }
};

int main() {
    // 快速輸入輸出最佳化
    std::ios_base::sync_with_stdio(false);
    std::cin.tie(NULL);

    // ====================================================
    // 一、 基本排序：原生靜態陣列 (Static Array)
    // ====================================================
    int arr[] = {5, 2, 9, 1, 5, 6};
    int n = sizeof(arr) / sizeof(arr[0]);

    // 預設為遞增排序 (原址排序)
    std::sort(arr, arr + n);
    std::cout << "原生陣列遞增排序後: ";
    for (int i = 0; i < n; i++) {
        std::cout << arr[i] << (i == n - 1 ? "" : " ");
    }
    std::cout << "\n";

    // ====================================================
    // 二、 基本排序與逆序：動態陣列 (std::vector)
    // ====================================================
    std::vector<int> vec = {5, 2, 9, 1, 5, 6};

    // 1. 預設遞增排序
    std::sort(vec.begin(), vec.end());

    // 2. 遞減排序 (方法 A：使用 std::greater<T> 比較器)
    std::sort(vec.begin(), vec.end(), std::greater<int>());
    std::cout << "Vector 遞減排序後 (std::greater): ";
    for (int val : vec) {
        std::cout << val << " ";
    }
    std::cout << "\n";
    
    // 遞減排序 (方法 B：先遞增排序，再反轉)
    std::sort(vec.begin(), vec.end());
    std::reverse(vec.begin(), vec.end());

    // ====================================================
    // 三、 自訂結構體排序 (Custom Struct Sorting)
    // ====================================================
    std::vector<Point> points = {{2, 3}, {1, 4}, {2, 5}, {1, 2}};

    // 方法 A：傳入全域自訂比較函式
    std::sort(points.begin(), points.end(), comparePoints);

    std::cout << "方法 A 排序結果 (x 遞增，y 遞減):\n";
    for (const auto& p : points) {
        std::cout << "(" << p.x << ", " << p.y << ") ";
    }
    std::cout << "\n";

    // 方法 B：使用 Lambda 運算式 (現代 C++ 競程最推薦寫法，直觀且不需宣告全域函式)
    std::vector<Point> points2 = {{2, 3}, {1, 4}, {2, 5}, {1, 2}};
    std::sort(points2.begin(), points2.end(), [](const Point& a, const Point& b) {
        if (a.x != b.x) {
            return a.x < b.x;
        }
        return a.y > b.y;
    });

    // 方法 C：使用結構體內定義的運算子多載
    std::vector<PointWithOp> pointsWithOp = {{2, 3}, {1, 4}, {2, 5}, {1, 2}};
    std::sort(pointsWithOp.begin(), pointsWithOp.end()); // 會自動調用 operator<

    std::cout << "方法 C 排序結果:\n";
    for (const auto& p : pointsWithOp) {
        std::cout << "(" << p.x << ", " << p.y << ") ";
    }
    std::cout << "\n";

    return 0;
}
```

---

### Java 實作範本

Java 對於原生型別陣列使用 `Arrays.sort()`，對於物件集合則使用 `Collections.sort()` 或 `List.sort()`。物件的自訂排序可透過實作 `Comparable` 介面（定義自然順序）或傳入 `Comparator` 實作。

```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class SortingDemo {

    // 定義自訂類別，並實作 Comparable 介面以提供預設的排序規則
    static class Point implements Comparable<Point> {
        int x;
        int y;

        public Point(int x, int y) {
            this.x = x;
            this.y = y;
        }

        // 實作 Comparable 介面的 compareTo 方法
        // 傳回值規範：負數表示 this < other；正數表示 this > other；0 表示相等
        // 規則：x 遞增，x 相等時 y 遞減
        @Override
        public int compareTo(Point other) {
            if (this.x != other.x) {
                // 建議使用 Integer.compare 避免相減溢位
                return Integer.compare(this.x, other.x); // x 遞增
            }
            return Integer.compare(other.y, this.y); // y 遞減 (注意 other 與 this 的位置相反)
        }

        @Override
        public String toString() {
            return "(" + x + ", " + y + ")";
        }
    }

    public static void main(String[] args) {
        // ====================================================
        // 一、 基本排序：原生型別陣列 (Primitive Array)
        // ====================================================
        int[] arr = {5, 2, 9, 1, 5, 6};
        
        // 預設遞增排序 (內部使用雙基準快速排序，時間複雜度平均 O(N log N))
        Arrays.sort(arr);
        System.out.print("原生陣列遞增排序後: ");
        for (int val : arr) {
            System.out.print(val + " ");
        }
        System.out.println();

        // 警告：Java 原始型別陣列「無法」直接透過 Collections.reverseOrder() 進行遞減排序
        // 若要遞減排序，必須轉換為包裝類別 Integer[] 陣列
        Integer[] arrObj = {5, 2, 9, 1, 5, 6};
        Arrays.sort(arrObj, Collections.reverseOrder());
        System.out.print("包裝類別陣列遞減排序後: ");
        System.out.println(Arrays.toString(arrObj));

        // ====================================================
        // 二、 基本排序：動態陣列 (List / ArrayList)
        // ====================================================
        List<Integer> list = new ArrayList<>(Arrays.asList(5, 2, 9, 1, 5, 6));

        // 1. 遞增排序
        Collections.sort(list);

        // 2. 遞減排序
        list.sort(Collections.reverseOrder());
        System.out.println("List 遞減排序後: " + list);

        // ====================================================
        // 三、 自訂類別排序 (Custom Class Sorting)
        // ====================================================
        List<Point> points = new ArrayList<>();
        points.add(new Point(2, 3));
        points.add(new Point(1, 4));
        points.add(new Point(2, 5));
        points.add(new Point(1, 2));

        // 方法 A：利用類別本身實作的 Comparable 介面 (自然排序)
        Collections.sort(points);
        System.out.println("方法 A (Comparable 介面) 排序結果: " + points);

        // 方法 B：使用 Lambda 運算式自訂 Comparator
        // 規則：x 遞增，x 相等時 y 遞減
        List<Point> points2 = new ArrayList<>(Arrays.asList(
            new Point(2, 3), new Point(1, 4), new Point(2, 5), new Point(1, 2)
        ));
        points2.sort((a, b) -> {
            if (a.x != b.x) {
                return Integer.compare(a.x, b.x);
            }
            return Integer.compare(b.y, a.y); // y 遞減
        });
        System.out.println("方法 B (Lambda) 排序結果: " + points2);

        // 方法 C：使用 Java 8+ 的 Comparator.comparing 鏈式組合 (簡潔且可讀性高)
        List<Point> points3 = new ArrayList<>(Arrays.asList(
            new Point(2, 3), new Point(1, 4), new Point(2, 5), new Point(1, 2)
        ));
        points3.sort(
            Comparator.comparing((Point p) -> p.x) // 先按 x 遞增
                      .thenComparing((Point p) -> p.y, Comparator.reverseOrder()) // 再按 y 遞減
        );
        System.out.println("方法 C (鏈式比較器) 排序結果: " + points3);
    }
}
```

---

### Python 實作範本

Python 的排序設計非常優雅，提供了 `list.sort()`（原地排序）與 `sorted()`（傳回新列表）兩種方式。Python 使用穩定排序演算法 **Timsort**，自訂排序主要透過 `key` 參數指定一個映射函數。

```python
import functools

# 定義自訂類別
class Point:
    def __init__(self, x: int, y: int):
        self.x = x
        self.y = y

    # 定義 __lt__ (less than) 魔術方法，使物件支援預設的比較運算子
    # 規則：x 遞增，x 相等時 y 遞減
    def __lt__(self, other):
        if self.x != other.x:
            return self.x < other.x
        return self.y > other.y

    def __repr__(self):
        return f"({self.x}, {self.y})"

def main():
    # ====================================================
    # 一、 基本排序：列表 (List)
    # ====================================================
    arr = [5, 2, 9, 1, 5, 6]

    # 1. 原地排序 (In-place sort, 會修改原列表，不產生額外記憶體開銷)
    arr.sort()
    print("原地遞增排序後:", arr)

    # 2. 傳回新列表 (Out-of-place sort, 不會修改原列表)
    arr2 = [5, 2, 9, 1, 5, 6]
    sorted_arr = sorted(arr2)
    print("原列表未變:", arr2)
    print("傳回的新列表:", sorted_arr)

    # 3. 遞減排序 (傳入 reverse=True)
    arr.sort(reverse=True)
    print("遞減排序後:", arr)

    # ====================================================
    # 二、 自訂類別排序 (Custom Class Sorting)
    # ====================================================
    
    # 方法 A：利用類別定義的 __lt__ 運算子進行排序 (預設自然排序)
    points = [Point(2, 3), Point(1, 4), Point(2, 5), Point(1, 2)]
    points.sort()
    print("方法 A (利用 __lt__ 魔術方法):", points)

    # 方法 B：使用 lambda 函數與 key 參數 (最推薦的 Pythonic 寫法)
    # 利用元組 (Tuple) 兩兩比較的特性：
    # 規則為 x 遞增 (直接用 p.x)，x 相等時 y 遞減 (對數值加上負號 -p.y)
    points2 = [Point(2, 3), Point(1, 4), Point(2, 5), Point(1, 2)]
    points2.sort(key=lambda p: (p.x, -p.y))
    print("方法 B (Lambda + 元組鍵值映射):", points2)

    # 方法 C：當比較邏輯極為複雜，無法簡單用負號或單一 key 表示時，
    # 可使用 functools.cmp_to_key 將傳統比較函數轉換為 key 函數。
    # 比較函數的規範：a < b 傳回負數；a > b 傳回正數；a == b 傳回 0
    def compare_points(a, b):
        if a.x != b.x:
            return -1 if a.x < b.x else 1
        if a.y != b.y:
            return 1 if a.y < b.y else -1  # y 遞減 (a.y 較大時要排在前面，故回傳負數)
        return 0

    points3 = [Point(2, 3), Point(1, 4), Point(2, 5), Point(1, 2)]
    points3.sort(key=functools.cmp_to_key(compare_points))
    print("方法 C (使用 cmp_to_key 轉換):", points3)

if __name__ == "__main__":
    main()
```

---

## 3. 複雜度與防禦要點

### 複雜度分析與比較

各語言內建排序演算法的性能指標如下表：

| 語言 | 預設排序演算法 | 最優時間複雜度 | 平均時間複雜度 | 最壞時間複雜度 | 額外空間複雜度 | 穩定性 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **C++** | `std::sort` (內省排序 Introsort) | $O(N \log N)$ | $O(N \log N)$ | $O(N \log N)$ | $O(\log N)$ (遞迴堆疊) | 不穩定 (Unstable) |
| **C++** | `std::stable_sort` (合併排序) | $O(N)$ 或 $O(N \log N)$ | $O(N \log N)$ | $O(N \log N)$ | $O(N)$ (輔助陣列) | 穩定 (Stable) |
| **Java** | `Arrays.sort(primitive[])` (雙基準快排) | $O(N)$ | $O(N \log N)$ | $O(N^2)$ (最壞退化) | $O(\log N)$ (遞迴堆疊) | 不穩定 (Unstable) |
| **Java** | `Collections.sort()` / `Arrays.sort(Object[])` (Timsort) | $O(N)$ | $O(N \log N)$ | $O(N \log N)$ | $O(N)$ | 穩定 (Stable) |
| **Python** | `list.sort()` / `sorted()` (Timsort) | $O(N)$ | $O(N \log N)$ | $O(N \log N)$ | $O(N)$ | 穩定 (Stable) |

---

### 防禦性程式設計與避坑要點

#### 1. 嚴格弱序 (Strict Weak Ordering) 致命崩潰
在 C++ 中，如果你的自訂比較函式在兩元素相等的狀況下返回了 `true`（例如寫成 `a <= b` 或 `a >= b`），這會違反反自反性 `comp(x, x) == false`。
- **後果**：當陣列中包含大量相同元素時，`std::sort` 內部基準分割指標會發生越界，導致 **Segmentation Fault** 或 **Runtime Error**。
- **防禦手段**：在比較函式中，**永遠只使用 `<` 或 `>`**。若兩元素等價，務必傳回 `false`。

#### 2. Java `Arrays.sort` 被惡意測資卡死 (TLE)
在 Codeforces 或 AtCoder 等競程平台中，Java 選手常遇到 `Arrays.sort(int[])` 逾時的狀況。這是因為該方法使用的是 **Dual-Pivot Quicksort**，在面對特定精心構造的「抗快排測資 (Anti-hash/Anti-sort cases)」時，會直接退化成 $O(N^2)$。當 $N = 10^5$ 時，$10^{10}$ 次運算會立刻超時。
- **防禦手段 A：隨機打亂法 (Shuffle)**
  在進行排序前，利用 Fisher-Yates 演算法將陣列元素隨機打亂，即可在數學上保證快排的最壞情況不會發生。
  ```java
  void safeSort(int[] arr) {
      java.util.Random rand = new java.util.Random();
      for (int i = arr.length - 1; i > 0; i--) {
          int j = rand.nextInt(i + 1);
          int temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
      }
      Arrays.sort(arr);
  }
  ```
- **防禦手段 B：轉換為包裝類別物件**
  將 `int[]` 宣告或轉換為 `Integer[]`，並使用 `Arrays.sort(Integer[])`。因為物件排序在 Java 中使用的是 **Timsort**，保證最壞情況仍為 $O(N \log N)$。

#### 3. 減法比較器與數值溢位 (Numerical Overflow)
有些開發者在自訂比較時，喜歡偷懶寫成減法形式，例如在 Java 中寫出 `(a, b) -> a.val - b.val`，或是 C++ 中寫出 `return a.val - b.val < 0;`。
- **後果**：若 `a.val` 為極大正數（例如 `2e9`），而 `b.val` 為極大負數（例如 `-2e9`），相減結果 `4e9` 會發生 **32位元有號整數溢位**，變成負數 `-294967296`。這會導致比較器給出完全相反的判斷，進而讓排序結果混亂甚至引起程式崩潰。
- **防禦手段**：
  - C++：一律使用明確的關係運算子：`return a.val < b.val;`。
  - Java：一律使用包裝類別提供的安全比較器：`Integer.compare(a.val, b.val)` 或 `Long.compare(a.val, b.val)`。

#### 4. 浮點數排序中的特殊值 (NaN)
當排序包含浮點數（`double` 或 `float`）的陣列時，若資料中包含 `NaN` (Not a Number)，由於 `NaN` 與任何數（包括自己）進行大小比較都會傳回 `false`，這會直接破壞嚴格弱序。
- 在 Java 中，這會拋出 `IllegalArgumentException: Comparison method violates its general contract!`。
- **防禦手段**：在排序前排除或過濾掉所有的 `NaN` 值，或是在比較器中顯式處理 `Double.isNaN()` 的優先級。

#### 5. 邊界狀況 (Edge Cases)
- **$N = 0$ 或 $N = 1$**：這屬於最基本的邊界情況。三大語言的標準庫排序均有優良防禦，傳入空陣列或單元素陣列會安全地直接返回，不會發生越界。
- **所有元素皆相同**：這也是一個常見的邊界測資。如前文所述，在 C++ 中必須保證等價元素返回 `false`，否則會因無法停止分割而崩潰；而 Java/Python 的穩定排序在面對全部相同元素時，可達到極佳的 $O(N)$ 優化效率。
