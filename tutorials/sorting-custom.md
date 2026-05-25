# 自訂比較與結構體排序 (Custom Comparators and Struct Sorting)

在程式設計競賽（CP）中，我們經常需要對複雜的資料進行排序，例如二維平面上的點、線段、活動區間、或是包含多種屬性的物件（如學生資料）。標準的升序排序（從小到大）已無法滿足需求，因此我們必須學會如何**自訂比較規則**。

自訂比較的核心在於理解與遵守**嚴格弱序 (Strict Weak Ordering)** 的數學原理，否則極易在競賽中引發超時（TLE）、記憶體區段錯誤（Segmentation Fault）或結果錯誤（WA）。本篇教學將深入探討自訂比較的核心原理、常見陷阱，並提供 C++、Java 與 Python 三種語言的頂級實作範本。

---

## 1. 核心觀念與基本原理

### 什麼是嚴格弱序 (Strict Weak Ordering)？
在 C++ 的 `std::sort`、Java 的 `Arrays.sort` / `Collections.sort`，以及 Python 的 `list.sort` 中，我們定義的二元關係運算子（通常是 `<`）必須滿足數學上的**嚴格弱序**。若以運算子 `f(x, y)`（代表 `x < y`）來表示，它必須嚴格遵守以下四個性質：

1. **非自反性 (Irreflexivity)**：
   對於任何元素 $x$，`f(x, x)` 必須為 **假 (false)**。也就是說，一個元素不能小於它自己。
2. **非對稱性 (Asymmetry)**：
   如果 `f(x, y)` 為真，那麼 `f(y, x)` 必須為 **假 (false)**。
3. **遞移性 (Transitivity)**：
   如果 `f(x, y)` 為真且 `f(y, z)` 為真，那麼 `f(x, z)` 必須為 **真 (true)**。
4. **等價關係的遞移性 (Transitivity of Equivalence)**：
   我們定義「$x$ 與 $y$ 等價」（記作 $x \equiv y$），若且唯若 `!f(x, y) && !f(y, x)`（即 $x$ 不小於 $y$ 且 $y$ 不小於 $x$）。
   如果 $x \equiv y$ 且 $y \equiv z$，那麼 $x \equiv z$ 必須為真。

> [!IMPORTANT]
> **最常見的致命錯誤：在 C++ 中使用 `<=` 代替 `<`**
> 
> 如果在自訂 `<` 運算子時，兩元素相等時回傳了 `true`（例如寫成 `a.val <= b.val`），就會違反**非自反性**。
> `std::sort` 底層（通常是 Introsort）的雙指標掃描會因此失效，導致指標越界，最終引發 **記憶體區段錯誤 (Segmentation Fault)** 或無窮迴圈。

---

### 多條件排序的邏輯構建
在實際問題中，我們常遇到「多層級」的排序需求。例如有學生結構體，其屬性包含：
1. **成績 (Grade)**：由高到低排序（降序）。
2. **年齡 (Age)**：若成績相同，則年齡由小到大排序（升序）。
3. **姓名 (Name)**：若成績與年齡皆相同，則姓名依字典序由小到大排序（升序）。

我們可以用以下樹狀的邏輯來定義 `a` 與 `b` 的大小關係：
- 若 `a.grade != b.grade`，則 `a.grade > b.grade`（因為是降序）。
- 否則（成績相同），若 `a.age != b.age`，則 `a.age < b.age`（升序）。
- 否則（成績與年齡皆相同），比較 `a.name < b.name`（升序）。

在 C++ 中，除了傳統的 `if-else` 寫法，我們還能利用標準庫的 `std::tie` 產生臨時的 `std::tuple`，它會自動進行多欄位的字典序比較，程式碼極其優雅且不易出錯。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

下面的範本展示了如何建立一個 `Student` 結構體（含姓名、成績、年齡），讀入資料後，分別使用**預設排序（運算子多載 / Comparable 介面）**與**動態自訂排序（Lambda / Comparator）**，依據上述的「成績降序 $\to$ 年齡升序 $\to$ 姓名升序」進行排序。

### C++ 實作範本

C++ 支援在結構體內部多載 `operator<`，也支援傳入 Lambda 運算式作為 `std::sort` 的第三個參數。

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <tuple>

// 定義學生結構體
struct Student {
    std::string name;
    int grade;
    int age;

    // 1. 結構體內部的運算子多載 (operator<) - 定義預設排序規則
    // 預設規則：先按姓名字典序升序，再按年齡升序，最後按成績降序
    bool operator<(const Student& other) const {
        if (name != other.name) {
            return name < other.name;
        }
        if (age != other.age) {
            return age < other.age;
        }
        return grade > other.grade;
    }
};

// 2. 外部比較函式：多條件排序（成績降序 -> 年齡升序 -> 姓名升序）
// 使用傳統 if-else 邏輯
bool compareStudentsClassic(const Student& a, const Student& b) {
    if (a.grade != b.grade) {
        return a.grade > b.grade; // 成績降序
    }
    if (a.age != b.age) {
        return a.age < b.age;     // 年齡升序
    }
    return a.name < b.name;       // 姓名升序
}

// 3. 外部比較函式：利用 std::tie 簡化多條件比較
// std::tie 會自動產生 tuple 引用，並依據 tuple 的預設字典序進行比較
bool compareStudentsTie(const Student& a, const Student& b) {
    // 技巧：將降序欄位取負值（僅適用於數值），或在 tie 中手動處理。
    // 為了安全起見，我們將需要升序與降序的欄位對應包裝：
    // 由於 tuple 預設是升序比較，我們可以將 grade 乘上 -1 來達到降序效果
    return std::tie(b.grade, a.age, a.name) < std::tie(a.grade, b.age, b.name);
}

int main() {
    // 優化輸入輸出效能 (快讀)
    std::ios_base::sync_with_stdio(false);
    std::cin.tie(nullptr);

    int n;
    if (!(std::cin >> n)) return 0;

    std::vector<Student> students(n);
    for (int i = 0; i < n; ++i) {
        std::cin >> students[i].name >> students[i].grade >> students[i].age;
    }

    // 複製三份以展示不同的排序方式
    auto students_default = students;
    auto students_classic = students;
    auto students_lambda = students;

    // A. 預設排序 (使用結構體內的 operator<)
    std::sort(students_default.begin(), students_default.end());

    // B. 使用外部自訂比較函式 (Classic)
    std::sort(students_classic.begin(), students_classic.end(), compareStudentsClassic);

    // C. 使用 Lambda 運算式動態自訂排序（成績降序 -> 年齡升序 -> 姓名升序）
    std::sort(students_lambda.begin(), students_lambda.end(), [](const Student& a, const Student& b) {
        if (a.grade != b.grade) {
            return a.grade > b.grade;
        }
        if (a.age != b.age) {
            return a.age < b.age;
        }
        return a.name < b.name;
    });

    // 輸出以 Lambda 排序後的結果
    std::cout << "[Sorted by Grade (desc), Age (asc), Name (asc)]:\n";
    for (const auto& s : students_lambda) {
        std::cout << s.name << " " << s.grade << " " << s.age << "\n";
    }

    return 0;
}
```

---

### Java 實作範本

Java 透過實作 `Comparable<T>` 介面定義自然排序，或使用 `Comparator<T>` 介面來傳遞動態排序規則。

```java
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.StringTokenizer;

// 實作 Comparable 介面以定義預設排序
class Student implements Comparable<Student> {
    String name;
    int grade;
    int age;

    public Student(String name, int grade, int age) {
        this.name = name;
        this.grade = grade;
        this.age = age;
    }

    // 1. 預設比較規則（姓名升序 -> 年齡升序 -> 成績降序）
    @Override
    public int compareTo(Student other) {
        int nameCompare = this.name.compareTo(other.name);
        if (nameCompare != 0) {
            return nameCompare;
        }
        if (this.age != other.age) {
            return Integer.compare(this.age, other.age);
        }
        return Integer.compare(other.grade, this.grade); // 降序
    }
}

public class Main {
    public static void main(String[] args) throws IOException {
        // 使用 BufferedReader 與 StringTokenizer 進行快速 I/O
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        PrintWriter writer = new PrintWriter(System.out);
        StringTokenizer tokenizer = null;

        String line = reader.readLine();
        if (line == null) return;
        tokenizer = new StringTokenizer(line);
        int n = Integer.parseInt(tokenizer.nextToken());

        Student[] students = new Student[n];
        for (int i = 0; i < n; i++) {
            tokenizer = new StringTokenizer(reader.readLine());
            String name = tokenizer.nextToken();
            int grade = Integer.parseInt(tokenizer.nextToken());
            int age = Integer.parseInt(tokenizer.nextToken());
            students[i] = new Student(name, grade, age);
        }

        // A. 預設排序 (使用 compareTo)
        Arrays.sort(students);

        // B. 動態自訂排序（成績降序 -> 年齡升序 -> 姓名升序）
        // 做法一：使用傳統 Lambda 寫法，邏輯直觀且效能優異
        Arrays.sort(students, (a, b) -> {
            if (a.grade != b.grade) {
                return Integer.compare(b.grade, a.grade); // 成績降序
            }
            if (a.age != b.age) {
                return Integer.compare(a.age, b.age);     // 年齡升序
            }
            return a.name.compareTo(b.name);             // 姓名升序
        });

        // 做法二：使用 Comparator 鏈式 API（語意清晰，但物件包裝可能有微小常數開銷）
        // Arrays.sort(students, Comparator
        //     .comparingInt((Student s) -> s.grade).reversed()
        //     .thenComparingInt(s -> s.age)
        //     .thenComparing(s -> s.name)
        // );

        writer.println("[Sorted by Grade (desc), Age (asc), Name (asc)]:");
        for (Student s : students) {
            writer.println(s.name + " " + s.grade + " " + s.age);
        }
        writer.flush();
    }
}
```

---

### Python 實作範本

Python 的 `sort()` 與 `sorted()` 只支援關鍵字參數 `key`。`key` 函式為每個元素回傳一個「特徵值」，Python 會直接對這些特徵值進行升序比較。

> [!TIP]
> **Python 中多條件混合升降序的妙招**
> 
> 對於數值型變數，我們可以直接加上負號 `-` 來實現降序。例如，`(-grade, age)` 會對 `grade` 降序、`age` 升序。
> 但對於字串（如姓名），我們無法使用 `-name`。此時若必須對字串降序，或者遇到更複雜的比較邏輯，應使用 `functools.cmp_to_key` 將傳統的比較函式（回傳負數/零/正數）轉換為 `key`。

```python
import sys
from functools import cmp_to_key

class Student:
    def __init__(self, name: str, grade: int, age: int):
        self.name = name
        self.grade = grade
        self.age = age

    def __repr__(self):
        return f"{self.name} {self.grade} {self.age}"

# 傳統比較函式：若 a < b 回傳負數，a > b 回傳正數，相等回傳 0
# 此方法極為通用，適用於無法直接用 - 號反轉的複雜比較（如字串降序）
def compare_students(a: Student, b: Student) -> int:
    if a.grade != b.grade:
        return 1 if a.grade < b.grade else -1 # grade 降序：a.grade 較小則排後面
    if a.age != b.age:
        return -1 if a.age < b.age else 1     # age 升序
    if a.name != b.name:
        return -1 if a.name < b.name else 1   # name 升序
    return 0

def main():
    # 快速 I/O
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    
    n = int(input_data[0])
    students = []
    idx = 1
    for _ in range(n):
        name = input_data[idx]
        grade = int(input_data[idx+1])
        age = int(input_data[idx+2])
        students.append(Student(name, grade, age))
        idx += 3

    # 方法一：利用元組 (Tuple) 進行 key 排序（最推薦，Pythonic 且執行快速）
    # 因為 grade 是數值，我們可以直接用 -s.grade 實現降序；age 和 name 則是升序
    students.sort(key=lambda s: (-s.grade, s.age, s.name))

    # 輸出結果
    sys.stdout.write("[Sorted by Grade (desc), Age (asc), Name (asc)]:\n")
    for s in students:
        sys.stdout.write(f"{s.name} {s.grade} {s.age}\n")

    # 方法二：展示 cmp_to_key 的用法（適用於更複雜的自訂排序）
    # students_complex = sorted(students, key=cmp_to_key(compare_students))

if __name__ == '__main__':
    main()
```

---

## 3. 複雜度與防禦要點

### 複雜度分析
- **時間複雜度 (Time Complexity)**：
  - 排序的基本複雜度為 $\mathcal{O}(N \log N)$ 次比較。
  - **重要細節**：總時間複雜度其實是 $\mathcal{O}(T_{\text{compare}} \cdot N \log N)$，其中 $T_{\text{compare}}$ 是每一次比較的複雜度。
  - 若比較的物件是長度為 $L$ 的字串，每次比較最壞需要 $\mathcal{O}(L)$ 的時間。因此，字串陣列的排序總時間複雜度會上升至 $\mathcal{O}(L \cdot N \log N)$。若 $L$ 較大，極易導致 TLE，需特別小心。
- **空間複雜度 (Space Complexity)**：
  - C++ `std::sort` 使用內省排序 (Introsort)，其輔助空間複雜度為遞迴深度 $\mathcal{O}(\log N)$。
  - Java（對於物件）和 Python 使用 Timsort，這是一種穩定排序，最壞情況下的輔助空間複雜度為 $\mathcal{O}(N)$。

### 防禦性編程與常見陷阱

1. **避免使用減法來代替比較（Java/C++ 溢位陷阱）**：
   在比較整數時，有人會為了簡寫而使用減法，例如 `return a.val - b.val;`。
   這在 CP 中是非常危險的！如果 `a.val` 是一個很大的正數，而 `b.val` 是一個極大的負數，兩者相減會引發 **整數溢位 (Integer Overflow)**，使正負號反轉，進而得到錯誤的排序結果。
   *防禦手段*：一律使用 `a.val < b.val ? -1 : (a.val > b.val ? 1 : 0)` 或標準庫內建的比較方法，如 Java 的 `Integer.compare(a, b)`。

2. **C++ 中的參數傳遞優化**：
   在寫 C++ 的自訂比較函式或 Lambda 時，參數務必加上 `const` 與參照符號 `&`，例如 `[](const Student& a, const Student& b)`。
   若少了 `&`，每次比較都會完整複製一次結構體，如果結構體內部含有 `std::string` 或大陣列，將會造成嚴重的記憶體頻寬消耗，常數時間會暴增數倍，導致原本演算法正確卻離奇 TLE。

3. **排序穩定性 (Stability)**：
   - **穩定排序 (Stable Sort)**：若兩個元素相等，排序後它們的相對順序保持不變。
   - C++ 的 `std::sort` 是**不穩定**的。如果你需要穩定排序（例如：在先前的排序基礎上進行第二輪排序），必須使用 `std::stable_sort`。
   - Java 的 `Arrays.sort`（物件類型）與 Python 的 `list.sort` 底層是 Timsort，兩者皆為**穩定排序**。

4. **浮點數比較精度問題**：
   若排序是以浮點數（`double` 或 `float`）作為依據，直接使用 `==` 判斷相等可能會因為精度誤差失準，違反嚴格弱序的等價遞移性。
   *防禦手段*：引入一個微小的誤差值 $\epsilon$（常設為 `1e-9`），當 $|a - b| < \epsilon$ 時視為相等；或者盡可能將浮點數乘上 $10^k$ 轉換為整數進行比較。
