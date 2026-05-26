# 賽局與博弈論 (Game Theory & Sprague-Grundy Theorem)

在競賽程式中，博弈論主要研究的是 **公平組合遊戲 (Impartial Combinatorial Games, ICG)**。這類問題的終極利器是 **Sprague-Grundy (SG) 定理**，它將所有複雜的公平組合遊戲轉化為經典的 **Nim 遊戲**，並用位元 XOR 運算給出完美的必勝策略判定。

---

## 1. 核心觀念與基本原理

*   **公平組合遊戲 (ICG) 的特徵**：
    1. 遊戲有兩位玩家，輪流進行操作。
    2. 在任意規則狀態下，兩位玩家可以採取的合法操作集合完全相同（與玩家身份無關）。
    3. 遊戲在有限步數內必定結束（無環），且不能進行操作的玩家判定為輸（通常稱為普通玩法 Normal Play）。
*   **必勝態 (N-position) 與必敗態 (P-position)**：
    *   **P-position (Previous-player-winning)**：前一個操作完的人必勝，即**當前輪到的人必敗**。所有終端狀態（無法操作的狀態）皆為 P-state。
    *   **N-position (Next-player-winning)**：下一個要操作的人必勝，即**當前輪到的人必勝**。
    *   **轉移規則**：
        1. 若一個狀態的所有後繼狀態都是 N-state，則該狀態為 P-state。
        2. 若一個狀態存在至少一個後繼狀態是 P-state，則該狀態為 N-state。
*   **Sprague-Grundy (SG) 函數與定理**：
    *   **定義**：對於遊戲中的任意狀態 $x$，其 SG 值定義為：
        $$SG(x) = \text{mex}(\{ SG(y) \mid x \to y \})$$
        其中 $x \to y$ 表示從狀態 $x$ 一步轉移到狀態 $y$。
    *   **mex (Minimum Excludant)** 函數：集合中未出現的**最小非負整數**。例如 $\text{mex}(\{0, 1, 3\}) = 2$。
    *   **SG 定理**：
        若一個遊戲由多個**獨立的子遊戲**（如多堆石子）組成，則整個遊戲的某個狀態的 SG 值，等於各子遊戲獨立狀態之 SG 值的 **XOR 異或和**：
        $$SG(\text{Game}) = SG(\text{Sub}_1) \oplus SG(\text{Sub}_2) \oplus \dots \oplus SG(\text{Sub}_k)$$
        *   若 $SG(\text{Game}) \neq 0$，則當前為 **N-state (必勝)**。
        *   若 $SG(\text{Game}) = 0$，則當前為 **P-state (必敗)**。

---

## 2. 三種語言實作範本 (C++ / Java / Python)

以下實作示範：透過記憶化遞迴（DFS）動態計算任意遊戲狀態的 SG 值。以經典「石子取子遊戲」為例：每次可取 $S = \{1, 3, 4\}$ 顆石子，給定 $N$ 顆石子，求當前狀態的 SG 值並判定勝負。

### C++ 實作範本

```cpp
#include <iostream>
#include <vector>
#include <unordered_set>
#include <algorithm>

using namespace std;

class SGCalculator {
private:
    vector<int> memo;
    vector<int> moves; // 可行的合法移動步數 (如 {1, 3, 4})

public:
    SGCalculator(const vector<int>& allowed_moves, int max_state) {
        moves = allowed_moves;
        memo.assign(max_state + 1, -1);
    }

    int get_sg(int x) {
        if (x < 0) return 0;
        if (memo[x] != -1) return memo[x];

        unordered_set<int> successor_sgs;
        for (int m : moves) {
            if (x >= m) {
                successor_sgs.insert(get_sg(x - m));
            }
        }

        // 計算 mex
        int mex = 0;
        while (successor_sgs.count(mex)) {
            mex++;
        }

        return memo[x] = mex;
    }

    bool is_winning_state(int x) {
        return get_sg(x) != 0;
    }
};
```

### Java 實作範本

```java
import java.util.*;

public class SGCalculator {
    private int[] memo;
    private List<Integer> moves;

    public SGCalculator(List<Integer> allowedMoves, int maxState) {
        this.moves = allowedMoves;
        this.memo = new int[maxState + 1];
        Arrays.fill(this.memo, -1);
    }

    public int getSG(int x) {
        if (x < 0) return 0;
        if (memo[x] != -1) return memo[x];

        Set<Integer> successorSGs = new HashSet<>();
        for (int m : moves) {
            if (x >= m) {
                successorSGs.add(getSG(x - m));
            }
        }

        int mex = 0;
        while (successorSGs.contains(mex)) {
            mex++;
        }

        return memo[x] = mex;
    }

    public boolean isWinningState(int x) {
        return getSG(x) != 0;
    }
}
```

### Python 實作範本

```python
import sys
sys.setrecursionlimit(300000)

class SGCalculator:
    def __init__(self, allowed_moves, max_state):
        self.moves = allowed_moves
        self.memo = [-1] * (max_state + 1)

    def get_sg(self, x):
        if x < 0:
            return 0
        if self.memo[x] != -1:
            return self.memo[x]

        successor_sgs = set()
        for m in self.moves:
            if x >= m:
                successor_sgs.add(self.get_sg(x - m))

        mex = 0
        while mex in successor_sgs:
            mex += 1

        self.memo[x] = mex
        return mex

    def is_winning_state(self, x):
        return self.get_sg(x) != 0
```

---

## 3. 複雜度與防禦要點

*   **時間複雜度**：
    若總狀態數為 $V$，每個狀態的轉移邊數為 $E$，則使用記憶化遞迴求出所有狀態的 SG 值的總複雜度為 $\mathcal{O}(V + E)$。
*   **防禦要點**：
    *   **終端狀態 SG 設定**：
        無合法操作的終端狀態其後繼狀態集為空，$\text{mex}(\emptyset) = 0$。因此，所有**無法操作的死局其 SG 值必然為 0**。
    *   **無效轉移防止**：
        在狀態轉移時，必須加上嚴格的防禦邊界（例如 `x >= m`），防止遞迴進入負數索引狀態或非法遊戲局勢。
    *   **記憶化與遞迴深度**：
        當狀態上限較大時，遞迴可能導致 stack overflow（尤其是 Python）。可考慮使用迭代遞推（由小到大 DP）來代替遞迴。
