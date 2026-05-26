# 掃描線演算法 (Sweep Line Algorithm)

**掃描線演算法 (Sweep Line Algorithm)** 是一種將「二維幾何求和/交集問題」轉化為「一維動態線段維護」的幾何降維技術。

---

## 1. 核心觀念與基本原理

*   **降維與事件點激發**：
    *   設想一根垂直於 $x$ 軸的虛擬掃描線，從左向右水平滑動。
    *   **事件點 (Event points)**：當掃描線遇到一個矩形的「左邊界」時，將該區間的 $y$ 範圍加入維護；當遇到「右邊界」時，將該區間從維護中移出。
    *   **線段樹維護縱向長度**：利用**線段樹**配合離散化，在掃描線從左到右滑動的過程中，動態更新與查詢目前 $y$ 軸上有多少長度被覆蓋，從而求出矩形面積聯集。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

```cpp
#include <vector>
#include <algorithm>
using namespace std;

struct Event {
    int x, y1, y2, type; // type: +1 (左邊), -1 (右邊)
    bool operator<(const Event& other) const { return x < other.x; }
};

// 掃描線求矩形聯集面積的核心框架
long long sweep_line_area(vector<Event>& events, const vector<int>& y_coords) {
    sort(events.begin(), events.end());
    // 實務上在此處使用「線段樹」動態維護被覆蓋的 y_coords 區間長度
    return 0; // 示意框架
}
```

```java
import java.util.*;

class SweepLine {
    static class Event implements Comparable<Event> {
        int x, y1, y2, type;
        public int compareTo(Event o) { return Integer.compare(this.x, o.x); }
    }
}
```

```python
def sweep_line_area(events):
    events.sort(key=lambda x: x[0]) # 依 x 座標排序
    # 離散化 y 座標後配合線段樹維護
    pass
```

---

## 3. 複雜度與防禦要點
*   **時間與空間複雜度**：時間 $\mathcal{O}(N \log N)$。
*   **防禦要點**：
    *   **座標離散化**：幾何座標的值域通常極大，在將 $y$ 軸區間加入線段樹前，一律必須對 $y$ 座標進行離散化（去重並排序），否則無法建構線段樹。
