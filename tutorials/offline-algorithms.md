# CDQ 分治與離線演算法 (CDQ Divide & Conquer & Offline Algorithms)

在競賽程式中，很多問題如果被要求「在線（Online）」回答（即必須即時回答當前詢問才能讀取下一個），難度會非常高甚至無法在時限內解決。然而，如果題目允許**離線（Offline）**，即我們可以**讀入所有操作與詢問，將其重新排序、分組或建立時間線**後再進行批次處理，往往能將複雜的動態維護轉化為靜態處理，極大地簡化問題。其中最著名且威力強大的離線分治演算法就是 **CDQ 分治**。

---

## 1. 核心觀念與基本原理

*   **離線演算法的威力**：
    *   **莫隊演算法 (Mo's Algorithm)**：透過對區間詢問進行分塊排序，將區間指針的總移動步數優化到 $\mathcal{O}(N \sqrt{N})$。
    *   **時間線分治 (Segment Tree Offline / DSU with Rollbacks)**：將操作的存在時間區間插入線段樹中，透過 DFS 遍歷線段樹，並在回溯時撤銷操作。
*   **CDQ 分治 (CDQ Divide & Conquer)**：
    由陳丹琦提出，主要用於解決**多維偏序問題**，或者將**動態修改轉化為靜態查詢**。
    *   **以三維偏序（3D Partial Order）為例**：
        給定 $N$ 個三元組 $(a_i, b_i, c_i)$，求有多少對 $(i, j)$ 滿足 $a_i \le a_j$ 且 $b_i \le b_j$ 且 $c_i \le c_j$。
    *   **分治步驟**：
        1. **第一維 $a$ 排序**：將所有元素按 $a_i$ 從小到大排序。排序後，對於任意 $i < j$，第一維限制 $a_i \le a_j$ 自然滿足。
        2. **分治處理 $[L, R]$**：
           * 遞迴計算左半邊 $[L, mid]$ 和右半邊 $[mid+1, R]$ 的內部貢獻。
           * **計算左半邊對右半邊的貢獻**：這是 CDQ 的精髓。此時左半邊的所有 $a$ 值都小於等於右半邊。
        3. **雙指針與樹狀陣列處理第二、三維**：
           * 將左半邊和右半邊的元素分別按第二維 $b_i$ 從小到大排序。
           * 使用雙指針掃描：當右半邊指針走到 $j$ 時，將所有左半邊滿足 $b_i \le b_j$ 的元素的第三維 $c_i$ 插入到樹狀陣列（Fenwick Tree）中。
           * 在樹狀陣列中查詢小於等於 $c_j$ 的數量，累加到 $j$ 的答案中。
        4. **還原樹狀陣列**：左半邊掃描完後，必須**撤銷**在樹狀陣列中的所有修改（將剛才加的再減去），嚴禁使用全清空（如 `memset`），以確保分治的總時間複雜度。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

以下實作示範：使用 CDQ 分治求解經典的**三維偏序（3D Partial Order）**問題。

### C++ 實作範本

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

struct Element {
    int a, b, c;
    int id;
    int cnt;
    int ans;
};

// 樹狀陣列 (Fenwick Tree) 用於維護第三維 c
class Fenwick {
private:
    int size;
    vector<int> tree;
public:
    Fenwick(int n) : size(n), tree(n + 1, 0) {}

    void add(int i, int delta) {
        for (; i <= size; i += i & -i) tree[i] += delta;
    }

    int query(int i) {
        int sum = 0;
        for (; i > 0; i -= i & -i) sum += tree[i];
        return sum;
    }
};

int max_c = 0;
vector<Element> e;
Fenwick* bit;

// CDQ 分治
void cdq(int l, int r) {
    if (l == r) return;
    int mid = l + (r - l) / 2;
    cdq(l, mid);
    cdq(mid + 1, r);

    // 按第二維 b 進行雙指針歸併
    // 爲了保證複雜度，在內部進行 inplace 排序或手動歸併
    auto cmp_b = [](const Element& x, const Element& y) {
        if (x.b != y.b) return x.b < y.b;
        return x.c < y.c;
    };

    int i = l, j = mid + 1;
    vector<Element> temp;
    
    while (i <= mid && j <= r) {
        if (cmp_b(e[i], e[j])) {
            bit->add(e[i].c, e[i].cnt);
            temp.push_back(e[i++]);
        } else {
            e[j].ans += bit->query(e[j].c);
            temp.push_back(e[j++]);
        }
    }
    while (i <= mid) {
        bit->add(e[i].c, e[i].cnt);
        temp.push_back(e[i++]);
    }
    while (j <= r) {
        e[j].ans += bit->query(e[j].c);
        temp.push_back(e[j++]);
    }

    // 撤銷樹狀陣列中的修改（還原），防止複雜度退化
    for (int k = l; k <= mid; ++k) {
        bit->add(e[k].c, -e[k].cnt);
    }

    // 將排好序的數組覆蓋回去
    for (int k = 0; k < temp.size(); ++k) {
        e[l + k] = temp[k];
    }
}
```

### Java 實作範本

```java
import java.util.*;

public class CDQDivideAndConquer {
    public static class Element {
        int a, b, c;
        int id;
        int cnt;
        int ans;

        public Element(int a, int b, int c, int id, int cnt) {
            this.a = a;
            this.b = b;
            this.c = c;
            this.id = id;
            this.cnt = cnt;
            this.ans = 0;
        }
    }

    public static class Fenwick {
        int size;
        int[] tree;

        public Fenwick(int n) {
            this.size = n;
            this.tree = new int[n + 1];
        }

        public void add(int i, int delta) {
            for (; i <= size; i += i & -i) tree[i] += delta;
        }

        public int query(int i) {
            int sum = 0;
            for (; i > 0; i -= i & -i) sum += tree[i];
            return sum;
        }
    }

    private static Element[] e;
    private static Fenwick bit;

    public static void cdq(int l, int r) {
        if (l == r) return;
        int mid = l + (r - l) / 2;
        cdq(l, mid);
        cdq(mid + 1, r);

        List<Element> temp = new ArrayList<>();
        int i = l, j = mid + 1;

        while (i <= mid && j <= r) {
            if (e[i].b < e[j].b || (e[i].b == e[j].b && e[i].c <= e[j].c)) {
                bit.add(e[i].c, e[i].cnt);
                temp.add(e[i++]);
            } else {
                e[j].ans += bit.query(e[j].c);
                temp.add(e[j++]);
            }
        }
        while (i <= mid) {
            bit.add(e[i].c, e[i].cnt);
            temp.add(e[i++]);
        }
        while (j <= r) {
            e[j].ans += bit.query(e[j].c);
            temp.add(e[j++]);
        }

        // 撤銷樹狀陣列修改
        for (int k = l; k <= mid; k++) {
            bit.add(e[k].c, -e[k].cnt);
        }

        for (int k = 0; k < temp.size(); k++) {
            e[l + k] = temp.get(k);
        }
    }
}
```

### Python 實作範本

```python
class Element:
    def __init__(self, a, b, c, id_val, cnt):
        self.a = a
        self.b = b
        self.c = c
        self.id = id_val
        self.cnt = cnt
        self.ans = 0

class Fenwick:
    def __init__(self, n):
        self.size = n
        self.tree = [0] * (n + 1)

    def add(self, i, delta):
        while i <= self.size:
            self.tree[i] += delta
            i += i & -i

    def query(self, i):
        s = 0
        while i > 0:
            s += self.tree[i]
            i -= i & -i
        return s

# 全局變數模擬
e = []
bit = None

def cdq(l, r):
    global e, bit
    if l == r:
        return
    mid = l + (r - l) // 2
    cdq(l, mid)
    cdq(mid + 1, r)

    temp = []
    i = l
    j = mid + 1

    while i <= mid and j <= r:
        # 比較第二維 b (若相等則比較 c)
        if e[i].b < e[j].b or (e[i].b == e[j].b and e[i].c <= e[j].c):
            bit.add(e[i].c, e[i].cnt)
            temp.append(e[i])
            i += 1
        else:
            e[j].ans += bit.query(e[j].c)
            temp.append(e[j])
            j += 1
            
    while i <= mid:
        bit.add(e[i].c, e[i].cnt)
        temp.append(e[i])
        i += 1
    while j <= r:
        e[j].ans += bit.query(e[j].c)
        temp.append(e[j])
        j += 1

    # 撤銷樹狀陣列修改
    for k in range(l, mid + 1):
        bit.add(e[k].c, -e[k].cnt)

    # 覆蓋回原陣列
    for k in range(len(temp)):
        e[l + k] = temp[k]
```

---

## 3. 複雜度與防禦要點

*   **時間複雜度**：$\mathcal{O}(N \log^2 N)$。
    *   分治共 $\log N$ 層，每層涉及對第二維 $b$ 進行線性複雜度的歸併，以及在樹狀陣列中進行第三維的插入與查詢，每次樹狀陣列操作時間為 $\mathcal{O}(\log N)$。因此總時間複雜度為極為優秀的 $\mathcal{O}(N \log^2 N)$。
*   **防禦要點**：
    *   **相同元素去重 (De-duplication)**：
        如果多個元素的三個維度 $(a, b, c)$ 完全相同，在分治過程中如果被劃分到左、右兩個不同的子區間，**會導致右側區間的相同元素漏計左側區間的數量**。
        *   **解決方案**：在進行 CDQ 分治前，必須先將完全相同的元素進行**合併去重**，並記錄其出現次數 `cnt`。在樹狀陣列 add 時加上 `cnt`，即可完全避免此精度漏洞。
    *   **樹狀陣列的還原機制**：
        在每一層歸併完成後，必須遍歷剛才修改過的左半邊區間元素，在樹狀陣列中加回相應的負值。**絕對不可以直接調用 `memset` 或 `clear` 重新清空樹狀陣列**，否則單層複雜度會退化為 $\mathcal{O}(\text{Max\_Value})$，導致整個分治法超時崩潰。
