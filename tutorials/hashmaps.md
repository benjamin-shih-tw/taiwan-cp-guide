# 雜湊表應用 (Hashmaps)

雜湊表（在 C++ 中為 `unordered_map` / `unordered_set`）是競賽程式中進行 **$\mathcal{O}(1)$ 平均時間**動態鍵值檢索的最核心容器。

---

## 1. 核心觀念與基本原理

*   **底層拉鍊法與定址法**：
    底層依賴 Hash Function 將鍵值對應到陣列索引上。
*   **最壞情況 TLE 危機**：
    由於雜湊表是基於雜湊映射，若測資刻意針對雜湊函數製造大量**雜湊碰撞 (Hash Collision)**，雜湊表的操作時間複雜度會直接退化為最差的 **$\mathcal{O}(N)$**！這在 Codeforces 等支援 Hack 的平台中，會被精心構造的數據打到無情超時（TLE）。
*   **防禦策略**：在 C++ 中手寫自訂雜湊函數，並引入高精度的**時間戳隨機數 (SplitMix64 等隨機數種子)** 進行擾動，使得測資製造者無法預測雜湊規律。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

```cpp
#include <iostream>
#include <unordered_map>
#include <chrono>
using namespace std;

// C++ 安全隨機化自訂雜湊函數 (防 Hack)
struct custom_hash {
    static uint64_t splitmix64(uint64_t x) {
        x += 0x9e3779b97f4a7c15;
        x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9;
        x = (x ^ (x >> 27)) * 0x94d049bb133111eb;
        return x ^ (x >> 31);
    }
    size_t operator()(uint64_t x) const {
        static const uint64_t FIXED_RANDOM = chrono::steady_clock::now().time_since_epoch().count();
        return splitmix64(x + FIXED_RANDOM);
    }
};

void safe_map_demo() {
    unordered_map<long long, int, custom_hash> safe_map;
    safe_map[123456] = 1;
}
```

```java
import java.util.HashMap;

class SafeHashMapDemo {
    public static void demo() {
        // Java HashMap 底層在發生碰撞退化時，會自動將鏈結串列轉化為紅黑樹 (Treeify)
        // 這使其最壞情況的查找複雜度依然能維持在優秀的 O(log N)，天然防禦惡意 Hack。
        HashMap<Long, Integer> map = new HashMap<>();
        map.put(123456L, 1);
    }
}
```

```python
import random

class SafeHash:
    def __init__(self):
        # Python dict 的雜湊在不同運行環境下預設會加入隨機鹽 (Hash Salt)
        # 但在有些平台中依然存在被 Hack 的可能，可藉由與隨機數異或 (XOR) 進行防禦。
        self.RANDOM = random.randint(1, 1 << 30)
        self.d = {}
    def put(self, key, val):
        self.d[key ^ self.RANDOM] = val
    def get(self, key):
        return self.d.get(key ^ self.RANDOM, None)
```

---

## 3. 複雜度與防禦要點
*   **時間複雜度**：平均 $\mathcal{O}(1)$，最差可退化至 $\mathcal{O}(N)$（無隨機化保護下）。
*   **防禦要點**：
    *   在 C++ 競程中，凡是使用 `unordered_map` / `unordered_set` 處理長整數或大量輸入，**一律必須手寫隨機 custom_hash**，以免被無情超時。
