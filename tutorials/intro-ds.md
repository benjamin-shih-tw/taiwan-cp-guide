# 基礎資料結構：動態陣列、pair、struct

在演算法競賽中，高效且正確地管理與組織資料是解題的關鍵第一步。當靜態陣列（Static Array）的固定長度無法滿足動態變化的資料需求，或者我們需要處理多維度、多欄位的複雜數據時，**動態陣列（Dynamic Array）**、**配對（Pair/Tuple）** 與 **自訂結構體（Struct/Class）** 便成為最核心的工具。

本教學將深入探討這三種基礎資料結構的底層原理、適用場景，並提供 C++、Java 與 Python 的完整實作範本，幫助讀者掌握結構化資料的儲存與多條件自訂排序。

---

## 1. 核心觀念與基本原理

### 1.1 動態陣列 (Dynamic Array)

傳統的靜態陣列在宣告時必須確定大小，且在執行期無法隨意改變。然而，許多競賽題目的輸入大小是動態的（例如：給定 $N$ 個操作，每次往陣列末端加入一個元素）。這時我們需要「動態陣列」。

#### 底層運作原理：倍增擴容 (Double Resizing)
動態陣列（如 C++ 的 `std::vector`、Java 的 `ArrayList`、Python 的 `list`）在實作上，底層依然是**連續的實體記憶體空間**。它的核心機制如下：
1. **大小 (Size)**：目前陣列中實際儲存的元素個數。
2. **容量 (Capacity)**：底層記憶體目前最大可容納的元素個數。
3. **擴容機制**：當 `Size` 即將超過 `Capacity` 時，動態陣列會執行以下步驟：
   - 申請一塊全新且更大的記憶體空間（通常是原本容量的 $1.5$ 或 $2$ 倍）。
   - 將舊空間的所有資料複製到新空間。
   - 釋放原本的舊記憶體空間。
   - 將新元素插入新空間。

```
初始狀態 (Size = 2, Capacity = 2):
[ A, B ] (底層記憶體)

當插入元素 C 時，偵測到容量不足，觸發倍增擴容 (新 Capacity = 4):
1. 申請新記憶體: [  ,  ,  ,  ]
2. 複製舊元素  : [ A, B,  ,  ]
3. 插入新元素  : [ A, B, C,  ] (Size = 3, Capacity = 4)
```

#### 均攤時間複雜度 (Amortized Complexity)
雖然單次「複製舊元素」的操作需要 $O(N)$ 的時間，本質上是因為擴容發生頻率極低，每次擴容都會讓容量翻倍。
若我們連續進行 $N$ 次尾端插入操作，總共經歷的複製次數為 $1 + 2 + 4 + 8 + \dots + N \approx 2N$ 次。均攤下來，**單次尾端插入的時間複雜度為均攤 $O(1)$**（Amortized $O(1)$）。

> [!TIP]
> **效能優化防禦**：如果我們在程式執行初期就已經知道資料的最終總數 $N$，可以先呼叫 `reserve(N)`（C++）或指定初始容量（Java），直接省去中間所有因擴容產生的記憶體申請與資料複製開銷！

---

### 1.2 配對與多元組 (Pair & Tuple)

在演算法競賽中，我們經常需要將兩個或多個相關聯的資料綁定在一起。例如：
- 二維平面上的座標：`(x, y)`
- 圖論中帶權重的邊：`(weight, next_node)`
- 區間問題中的左界與右界：`(left, right)`

#### 為什麼使用 `std::pair` / `std::tuple`？
1. **開發快速**：不需要寫冗長的結構體宣告，直接寫 `pair<int, int>` 即可。
2. **天然的字典序比較**：這兩種資料結構都內建了比較運算子。
   - 對於 `pair`，比較規則為：先比較第一元素（`first`），若相同再比較第二元素（`second`）。
   - 對於 `tuple`，則依序從第一個元素比較到最後一個元素。
   - 這在需要「預設排序」的場景非常強大，例如我們只需要將點座標先按 $x$ 座標從小到大排序，$x$ 相同時再按 $y$ 座標從小到大排序，此時直接對 `vector<pair<int, int>>` 進行排序即可，不需額外撰寫比較函式。

---

### 1.3 自訂結構體 (Struct / Class)

雖然 `pair` 與 `tuple` 非常方便，但當資料的維度達到 3 個或以上，或者各個欄位有強烈的物理意義時，過度使用 `tuple` 會成為災難。
例如，若使用 `tuple<string, int, int, int>` 來表示學生的「姓名、國文、數學、英文成績」，我們在程式碼中必須寫 `std::get<2>(student)` 來取得數學成績。這不僅降低了程式碼的可讀性，更極易寫錯下標而導致 bug。

#### 什麼時候該用 `struct`？
當資料滿足以下任一條件時，應果斷使用 `struct`（或 Java/Python 的自訂類別）：
1. 欄位數量大於等於 3 個。
2. 欄位具有明確的名稱語意（如 `id`、`score`、`name`）。
3. 需要自訂複雜且非預設字典序的排序規則。
4. 需要在結構體內定義建構子或輔助函式。

---

### 1.4 整合應用：多欄位結構的自訂排序 (Custom Sorting)

在 CP 中，最經典的應用場景就是**多欄位自訂排序**。
假設我們要處理一批學生的成績資料，排序規則如下：
1. 依**總分**從大到小排序（降序）。
2. 若總分相同，依**國文成績**從大到小排序（降序）。
3. 若國文成績仍相同，依**姓名字典序**從小到大排序（升序）。

我們可以使用兩種方式來實現自訂排序：
* **方法一：重載小於運算子 (`operator<`)**
  在結構體內部定義 `<` 運算子，讓結構體本身具備「預設大小關係」，可以直接使用 `sort(v.begin(), v.end())`。
* **方法二：自訂比較函式 (Comparator / Lambda)**
  在呼叫排序函式時，傳入一個自訂的比較函式或 Lambda 表達式。這種方式彈性極大，適合在同一個程式中需要根據不同場景進行不同排序時使用。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

以下實作範本將完整演示：
1. 動態陣列的宣告、尾端增刪、容量預分配、與三種遍歷方式。
2. `Pair` / `Tuple` 的基本使用與查詢。
3. 自訂結構體/類別，並實現上述的**多欄位學生成績排序任務**。

### 2.1 C++ 實作範本

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <tuple>

using namespace std;

// 定義學生的自訂結構體
struct Student {
    string name;
    int chinese;
    int math;
    int id;

    // 建構子，方便初始化
    Student(string n, int c, int m, int i) : name(n), chinese(c), math(m), id(i) {}

    // 計算總分
    int get_total() const {
        return chinese + math;
    }

    // 方法一：重載小於運算子 (operator<)，用於定義結構體的「預設排序規則」
    // 注意：必須是 const 函式，且參數為 const 參照
    bool operator<(const Student& other) const {
        int total = get_total();
        int other_total = other.get_total();

        // 1. 總分降序
        if (total != other_total) {
            return total > other_total; 
        }
        // 2. 國文成績降序
        if (chinese != other.chinese) {
            return chinese > other.chinese;
        }
        // 3. 姓名升序 (字典序)
        return name < other.name;
    }
};

int main() {
    // 優化標準輸入輸出，CP 必備
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // ==========================================
    // Part 1: std::vector (動態陣列) 的基礎操作
    // ==========================================
    vector<int> vec;
    
    // 預分配容量以優化效能
    vec.reserve(100); 

    // 尾端插入與刪除
    vec.push_back(10);
    vec.push_back(20);
    vec.push_back(30);
    vec.pop_back(); // 移除 30

    // 遍歷方式一：傳統下標遍歷 (Index-based)
    for (size_t i = 0; i < vec.size(); ++i) {
        // vec[i] 支援 O(1) 隨機存取
    }

    // 遍歷方式二：Range-based for loop (最常用，具備防禦性)
    for (const auto& val : vec) {
        // 使用 const reference 避免不必要的複製
    }

    // ==========================================
    // Part 2: std::pair 與 std::tuple 的使用
    // ==========================================
    // pair 的使用
    pair<int, string> p = {1, "Dijkstra"};
    // C++17 結構化綁定 (Structured Binding)
    auto [p_id, p_name] = p; 

    // tuple 的使用
    tuple<int, double, string> t = {10, 3.14, "Pi"};
    int t_id = get<0>(t);
    double t_val = get<1>(t);

    // ==========================================
    // Part 3: 結構體自訂多欄位排序
    // ==========================================
    vector<Student> students;
    students.reserve(5);
    
    students.emplace_back("Alice", 90, 85, 1);
    students.emplace_back("Bob", 85, 90, 2);
    students.emplace_back("Carol", 90, 85, 3); // 與 Alice 總分、國文皆同，但姓名升序排在 Alice 後面
    students.emplace_back("Dave", 70, 80, 4);
    students.emplace_back("Eve", 95, 95, 5);

    // 使用重載的 operator< 進行排序
    sort(students.begin(), students.end());

    cout << "--- 預設排序結果 (使用 operator<) ---\n";
    for (const auto& s : students) {
        cout << s.name << " | 總分: " << s.get_total() 
             << " | 國文: " << s.chinese << " | 數學: " << s.math << "\n";
    }

    // 方法二：使用自訂的 Lambda 比較函式進行排序 (不依賴 operator<)
    // 假設我們在另一個場景，只想單純「先按數學降序，再按姓名升序」排序
    sort(students.begin(), students.end(), [](const Student& a, const Student& b) {
        if (a.math != b.math) {
            return a.math > b.math; // 數學降序
        }
        return a.name < b.name;     // 姓名升序
    });

    cout << "\n--- 特定排序結果 (使用 Lambda) ---\n";
    for (const auto& s : students) {
        cout << s.name << " | 數學: " << s.math << "\n";
    }

    return 0;
}
```

---

### 2.2 Java 實作範本

```java
import java.io.*;
import java.util.*;

public class Main {
    
    // ==========================================
    // 定義學生的自訂類別
    // ==========================================
    static class Student implements Comparable<Student> {
        String name;
        int chinese;
        int math;
        int id;

        public Student(String name, int chinese, int math, int id) {
            this.name = name;
            this.chinese = chinese;
            this.math = math;
            this.id = id;
        }

        public int getTotal() {
            return this.chinese + this.math;
        }

        // 實作 Comparable 介面的 compareTo 方法，定義預設排序規則
        @Override
        public int compareTo(Student other) {
            int thisTotal = this.getTotal();
            int otherTotal = other.getTotal();

            // 1. 總分降序
            if (thisTotal != otherTotal) {
                return Integer.compare(otherTotal, thisTotal); // 降序：other 與 this 對調
            }
            // 2. 國文成績降序
            if (this.chinese != other.chinese) {
                return Integer.compare(other.chinese, this.chinese);
            }
            // 3. 姓名升序 (字典序)
            return this.name.compareTo(other.name);
        }
    }

    // ==========================================
    // Java 中沒有內建的 Pair，通常在 CP 中我們自行實作一個輕量級的 Pair 類別
    // ==========================================
    static class Pair<F extends Comparable<F>, S extends Comparable<S>> implements Comparable<Pair<F, S>> {
        F first;
        S second;

        public Pair(F first, S second) {
            this.first = first;
            this.second = second;
        }

        @Override
        public int compareTo(Pair<F, S> other) {
            int compFirst = this.first.compareTo(other.first);
            if (compFirst != 0) {
                return compFirst;
            }
            return this.second.compareTo(other.second);
        }
    }

    public static void main(String[] args) throws IOException {
        // 使用 BufferedReader/BufferedWriter 進行高效輸入輸出，CP 必備
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(System.out));

        // ==========================================
        // Part 1: ArrayList (動態陣列) 的基礎操作
        // ==========================================
        // 初始化時建議指定初始容量以優化效能
        ArrayList<Integer> list = new ArrayList<>(100); 

        // 尾端插入與刪除
        list.add(10);
        list.add(20);
        list.add(30);
        list.remove(list.size() - 1); // 移除尾端元素 (30)

        // 遍歷方式一：傳統下標遍歷
        for (int i = 0; i < list.size(); i++) {
            int val = list.get(i); // O(1) 隨機存取
        }

        // 遍歷方式二：增強型 for 迴圈 (Foreach)
        for (int val : list) {
            // 唯讀遍歷，防禦性高
        }

        // ==========================================
        // Part 2: 自訂 Pair 的排序與查詢
        // ==========================================
        ArrayList<Pair<Integer, String>> pairList = new ArrayList<>();
        pairList.add(new Pair<>(2, "Dijkstra"));
        pairList.add(new Pair<>(1, "Kruskal"));
        pairList.add(new Pair<>(2, "Bellman"));

        // 排序，會自動使用 Pair 實作的 compareTo (第一元素升序，相同則第二元素升序)
        Collections.sort(pairList);

        // ==========================================
        // Part 3: 結構體自訂多欄位排序
        // ==========================================
        ArrayList<Student> students = new ArrayList<>();
        students.add(new Student("Alice", 90, 85, 1));
        students.add(new Student("Bob", 85, 90, 2));
        students.add(new Student("Carol", 90, 85, 3));
        students.add(new Student("Dave", 70, 80, 4));
        students.add(new Student("Eve", 95, 95, 5));

        // 方法一：使用類別預設的 Comparable 排序
        Collections.sort(students);

        bw.write("--- 預設排序結果 (Comparable) ---\n");
        for (Student s : students) {
            bw.write(s.name + " | 總分: " + s.getTotal() 
                     + " | 國文: " + s.chinese + " | 數學: " + s.math + "\n");
        }

        // 方法二：使用自訂 Comparator 進行多條件流式排序
        // 假設我們要「先按數學成績降序，再按國文成績升序」排序
        students.sort(
            Comparator.comparingInt((Student s) -> s.math).reversed() // 數學降序
                      .thenComparingInt(s -> s.chinese)               // 國文升序
        );

        bw.write("\n--- 特定排序結果 (Comparator) ---\n");
        for (Student s : students) {
            bw.write(s.name + " | 數學: " + s.math + " | 國文: " + s.chinese + "\n");
        }

        bw.flush();
    }
}
```

---

### 2.3 Python 實作範本

```python
import sys
from dataclasses import dataclass

def main():
    # 優化輸入，適合處理大量測資
    input = sys.stdin.read

    # ==========================================
    # Part 1: list (動態陣列) 的基礎操作
    # ==========================================
    # Python 中的 list 天然就是一個動態陣列，會自動擴容
    arr = []

    # 尾端插入與刪除
    arr.append(10)
    arr.append(20)
    arr.append(30)
    arr.pop()  # 移除尾端元素 (30)

    # 遍歷方式一：傳統下標遍歷
    for i in range(len(arr)):
        val = arr[i] # O(1) 隨機存取

    # 遍歷方式二：直接遍歷元素 (Python 推薦)
    for val in arr:
        pass

    # ==========================================
    # Part 2: Tuple (元組) 的基本使用與比較
    # ==========================================
    # Python 的 tuple 天然支援字典序比較，常在 CP 中當作 pair 使用
    p1 = (2, "Dijkstra")
    p2 = (1, "Kruskal")
    p3 = (2, "Bellman")

    tuples_list = [p1, p2, p3]
    # 預設排序：先比第一個元素，相同再比第二個元素
    tuples_list.sort() 

    # ==========================================
    # Part 3: 結構體自訂多欄位排序
    # ==========================================
    # 使用 dataclass 定義結構化資料，語法最簡潔 (Python 3.7+)
    @dataclass
    class Student:
        name: str
        chinese: int
        math: int
        id: int

        @property
        def total(self) -> int:
            return self.chinese + self.math

    students = [
        Student("Alice", 90, 85, 1),
        Student("Bob", 85, 90, 2),
        Student("Carol", 90, 85, 3),
        Student("Dave", 70, 80, 4),
        Student("Eve", 95, 95, 5)
    ]

    # Python 自訂排序核心技巧：使用 key 函式與 lambda 運算式
    # 規則：
    # 1. 總分降序：對數值取負號 (-x.total)
    # 2. 國文降序：對數值取負號 (-x.chinese)
    # 3. 姓名升序：字串無法取負號，保持原樣即可 (x.name)
    students.sort(key=lambda x: (-x.total, -x.chinese, x.name))

    print("--- 預設排序結果 (Multi-key Lambda) ---")
    for s in students:
        print(f"{s.name} | 總分: {s.total} | 國文: {s.chinese} | 數學: {s.math}")

    # 特定排序：僅按「數學降序，再按姓名升序」排序
    students.sort(key=lambda x: (-x.math, x.name))

    print("\n--- 特定排序結果 ---")
    for s in students:
        print(f"{s.name} | 數學: {s.math}")

if __name__ == "__main__":
    main()
```

---

## 3. 複雜度與防禦要點

### 3.1 複雜度分析

| 資料結構 / 操作 | 時間複雜度 | 備註 |
| :--- | :--- | :--- |
| **動態陣列隨機存取 (Random Access)** | $O(1)$ | 依賴記憶體連續性，極其快速。 |
| **動態陣列尾端插入/刪除** | 均攤 $O(1)$ | 偶爾因擴容而達到單次最壞 $O(N)$。 |
| **動態陣列任意位置插入/刪除** | $O(N)$ | 需要對插入點之後的所有元素進行記憶體平移。 |
| **自訂結構排序 (Sorting)** | $O(N \log N)$ | 底層使用 TimSort (Java/Python) 或 Introsort (C++)。 |

---

### 3.2 防禦性程式設計與常見陷阱 (Defence & Pitfalls)

#### 陷阱一：C++ 自訂比較運算子的「嚴格弱序 (Strict Weak Ordering)」
在 C++ 中使用 `std::sort` 時，自訂的比較函式或 `operator<` **必須符合嚴格弱序**。也就是說，**當兩個元素完全相等時，比較函式必須返回 `false`**。

> [!WARNING]
> **致命程式錯誤 (Runtime Error)**：
> 如果你在寫比較函式時，將條件寫成了 `a.score >= b.score` 或 `a.score <= b.score`（包含等號），這會破壞嚴格弱序的公理。在資料量較大時，`std::sort` 的底層指標會因為無法正確判斷邊界而發生越界，導致 **區段錯誤 (Segmentation Fault / RE)**。
> 
> * **錯誤示範**：`bool operator<(const Element& other) { return val <= other.val; }`
> * **正確示範**：`bool operator<(const Element& other) { return val < other.val; }`

#### 陷阱二：動態陣列擴容導致的「疊代器失效 (Iterator Invalidation)」
在 C++ 中，當我們使用疊代器（Iterator）或指標遍歷 `vector` 的過程中，如果對其進行了 `push_back` 或 `insert` 等可能觸發擴容的操作，原先指向 `vector` 內部元素的疊代器將會**全部失效**（因為底層記憶體已經被搬移並釋放）。繼續存取這些疊代器會引發未定義行為（UB）。

> [!TIP]
> **防禦守則**：切忌在遍歷同一個動態陣列的迴圈中直接進行會改變陣列大小的操作。若有需要，應將待加入的元素暫存於另一個臨時陣列中，等遍歷結束後再進行合併。

#### 陷阱三：多筆測資下全域動態陣列的「記憶體殘留 (Memory Leak / MLE)」
在競賽中，為了加速，我們常會宣告全域變數。如果宣告了全域的 `vector`，且題目有多組測試資料：
* 呼叫 `vec.clear()` 只會將 `size` 歸零，但底層佔用的 `capacity` **依然存在，記憶體並不會釋放**！
* 當多組測資累積下來，可能會因為累積的龐大容量而導致 **記憶體超限 (Memory Limit Exceeded, MLE)**。

```cpp
// 防禦方案：真正釋放 vector 記憶體的方法
vector<int>().swap(vec); // 利用一個空的暫時 vector 與 vec 交換，徹底釋放空間
// 或者在 C++11 中呼叫：
vec.shrink_to_fit();
```

#### 陷阱四：數值相減做比較的溢位風險 (Numerical Overflow)
在 Java 中寫自訂比較器時，有些新手為了省事會直接寫：
```java
// 潛在溢位風險！
public int compare(Student a, Student b) {
    return a.score - b.score; 
}
```
若 `a.score` 為極大正數，且 `b.score` 為極小負數，兩者相減的結果會發生**整數溢位 (Integer Overflow)**，導致正負號顛倒，排序結果徹底錯亂。
* **防禦方案**：一律使用 `Integer.compare(a.score, b.score)`，其底層使用 `<` 和 `>` 進行邏輯判斷，絕對安全。
