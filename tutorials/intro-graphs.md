# 基礎圖論概念與建圖 (Intro to Graphs)

在資訊科學與演算法競賽中，**圖論 (Graph Theory)** 是極為重要的核心領域。無論是社群網路、地圖導航、網路路由，還是編譯器中的相依性分析，其底層皆是由點與邊所建構出來的「圖」結構。

本單元將從最基本的圖論定義開始，帶領大家理解圖的各種分類，深入探討兩種最核心的圖表示法：**鄰接矩陣 (Adjacency Matrix)** 與 **鄰接串列 (Adjacency List)** 的實作細節、時空複雜度權衡，並提供 C++、Java、Python 三種語言的完整實作範本。

---

## 1. 核心觀念與基本原理

### 圖的定義
在數學上，一個**圖 (Graph)** 通常記作 $G = (V, E)$：
- $V$ 是**頂點 (Vertex，或稱節點 Node)** 的集合。
- $E$ 是**邊 (Edge)** 的集合，每條邊連接兩個頂點。

### 基本分類與術語
根據邊的特性與結構限制，圖可以分為以下幾種：

1. **有向圖 (Directed Graph) 與 無向圖 (Undirected Graph)**：
   - **無向圖**：邊是雙向的。如果頂點 $u$ 與頂點 $v$ 相連，代表可以從 $u$ 走到 $v$，也可以從 $v$ 走到 $u$。我們將邊表示為無序對 $\{u, v\}$。
   - **有向圖**：邊是有方向性的。邊 $(u, v)$ 表示一條從 $u$ 指向 $v$ 的單向通路，此時 $u$ 稱為起點，$v$ 稱為終點。
   
2. **有權圖 (Weighted Graph) 與 無權圖 (Unweighted Graph)**：
   - **有權圖**：每條邊都附帶一個數值，稱為**權重 (Weight / Cost)**。例如在地圖中，權重可以代表兩個城市之間的距離或行車時間。
   - **無權圖**：邊僅代表連接關係，不具備權重（可視為所有邊的權重皆為 $1$）。

3. **度數 (Degree)**：
   - **無向圖**中，一個頂點的度數為與其相連的邊數。
   - **有向圖**中，頂點的度數分為**入度 (In-degree)**（指向該點的邊數）與**出度 (Out-degree)**（從該點指出去的邊數）。

4. **路徑 (Path) 與環 (Cycle)**：
   - **路徑**：一連串首尾相接的邊所構成的頂點序列。
   - **簡單路徑 (Simple Path)**：路徑上除了起點與終點外，其餘頂點皆不重複。
   - **環**：起點與終點相同的簡單路徑。

5. **連通性 (Connectivity)**：
   - 若無向圖中任意兩個頂點之間皆存在路徑相通，則稱該圖為**連通圖 (Connected Graph)**。

6. **樹的定義 (Tree Definition)**：
   一個**樹 (Tree)** 在圖論中被定義為一個**無向、無環且連通的圖**。
   樹具有以下幾個極為重要的等價性質（設頂點數為 $V$）：
   - $G$ 連通且恰好有 $V - 1$ 條邊。
   - $G$ 無環且恰好有 $V - 1$ 條邊。
   - 任意兩個頂點之間**恰好存在一條**簡單路徑。
   - 若在樹中任意加上一條邊，必定會產生環。

```mermaid
graph TD
    subgraph 無向有權圖 (Undirected Weighted Graph)
        A((0)) ---|5| B((1))
        A ---|2| C((2))
        B ---|8| D((3))
        C ---|3| D
    end
    
    subgraph 有向有權圖 (Directed Weighted Graph)
        E((0)) -->|5| F((1))
        E -->|2| G((2))
        F -->|8| H((3))
        G -->|3| H
    end
```

---

### 圖的表示法比較 (Graph Representations)
在程式中，我們主要使用兩種方式來儲存與表示圖：

#### A. 鄰接矩陣 (Adjacency Matrix)
鄰接矩陣使用一個大小為 $V \times V$ 的二維陣列（例如 `adj[V][V]`）來記錄頂點間的邊。
- 對於無權圖：`adj[u][v] = 1` 代表存在邊 $u \to v$；`adj[u][v] = 0` 代表無邊。
- 對於有權圖：`adj[u][v] = weight` 代表存在邊 $u \to v$ 且權重為 `weight`；對於不存在邊的兩點，通常初始化為一個代表無限大的值（如 $\infty$）。

* **優點**：
  - 查詢任意兩點之間是否有邊只需 $O(1)$ 時間。
  - 實作直觀，非常適合用於頂點數較小（例如 $V \le 1000$）且邊數接近 $V^2$ 的**稠密圖 (Dense Graph)**。
* **缺點**：
  - 空間複雜度高達 $O(V^2)$，與邊數無關。當圖為**稀疏圖 (Sparse Graph)**（如 $V = 10^5, E = 10^5$）時，會耗費巨大記憶體甚至導致記憶體限制超限 (MLE)。
  - 遍歷某個頂點的所有鄰居需要 $O(V)$ 的時間，因為必須掃描整列。

#### B. 鄰接串列 (Adjacency List)
鄰接串列為每一個頂點維護一個列表 (List 或 Dynamic Array / Vector)，儲存該頂點所指出的所有邊資訊。
- 對於無權圖：`adj[u]` 儲存所有與 $u$ 相鄰的頂點編號。
- 對於有權圖：`adj[u]` 儲存一個包含 `(鄰居頂點, 權重)` 的結構體或對組 (pair)。

* **優點**：
  - 空間複雜度為 $O(V + E)$，僅與頂點與邊的實際數量成正比，極度節省記憶體。
  - 遍歷某頂點 $u$ 的所有鄰居僅需 $O(\text{deg}(u))$ 的時間，非常高效，是大多數圖論演算法（如 DFS、BFS、Dijkstra 等）的首選建圖方式。
* **缺點**：
  - 查詢任意兩點 $u$ 與 $v$ 是否相連需要遍歷 `adj[u]`，最壞情況需要 $O(\text{deg}(u))$ 的時間。

#### 複雜度與效能對照表

| 操作 / 指標 | 鄰接矩陣 (Adjacency Matrix) | 鄰接串列 (Adjacency List) |
| :--- | :--- | :--- |
| **儲存空間 (Space Complexity)** | $O(V^2)$ | $O(V + E)$ |
| **加入一條邊 (Add Edge)** | $O(1)$ | $O(1)$ |
| **查詢兩點是否相連 ($u \to v$)** | $O(1)$ | $O(\text{deg}(u))$ |
| **遍歷頂點 $u$ 的所有鄰居** | $O(V)$ | $O(\text{deg}(u))$ |
| **適用場景** | 頂點數小 ($V \le 1000$)、稠密圖 | 大規模圖、稀疏圖（演算法競賽常態） |

---

## 2. 三種語言實作範本 (C++ / Java / Python)

以下範本演示了如何同時使用**鄰接矩陣**與**鄰接串列**建構**無向有權圖**與**有向有權圖**，並進行圖的遍歷（鄰接矩陣使用 BFS，鄰接串列使用 DFS）。

### C++ 實作範本

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <iomanip>

using namespace std;

// 鄰接串列的邊結構體
struct Edge {
    int to;
    int weight;
};

// 1. 鄰接矩陣類別
class AdjacencyMatrixGraph {
private:
    int V;
    bool isDirected;
    vector<vector<int>> adjMatrix;
    
public:
    static const int INF = 1e9; // 代表無邊的無限大值

    AdjacencyMatrixGraph(int vertices, bool directed) : V(vertices), isDirected(directed) {
        adjMatrix.assign(V, vector<int>(V, INF));
        for (int i = 0; i < V; ++i) {
            adjMatrix[i][i] = 0; // 頂點到自身的距離為 0
        }
    }

    // 新增邊 (u -> v, 權重 w)
    void addEdge(int u, int v, int weight) {
        adjMatrix[u][v] = weight;
        if (!isDirected) {
            adjMatrix[v][u] = weight; // 若為無向圖，需雙向加邊
        }
    }

    // 印出鄰接矩陣
    void printGraph() {
        cout << "--- 鄰接矩陣 (Adjacency Matrix) ---" << endl;
        for (int i = 0; i < V; ++i) {
            for (int j = 0; j < V; ++j) {
                if (adjMatrix[i][j] == INF) {
                    cout << setw(6) << "INF";
                } else {
                    cout << setw(6) << adjMatrix[i][j];
                }
            }
            cout << endl;
        }
    }

    // 使用廣度優先搜尋 (BFS) 進行圖遍歷
    void bfs(int start) {
        vector<bool> visited(V, false);
        queue<int> q;

        visited[start] = true;
        q.push(start);

        cout << "鄰接矩陣 BFS 遍歷順序 (從 " << start << " 開始): ";
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            cout << u << " ";

            for (int v = 0; v < V; ++v) {
                // 若相連且非自身，且尚未被造訪
                if (adjMatrix[u][v] != INF && u != v && !visited[v]) {
                    visited[v] = true;
                    q.push(v);
                }
            }
        }
        cout << endl;
    }
};

// 2. 鄰接串列類別
class AdjacencyListGraph {
private:
    int V;
    bool isDirected;
    vector<vector<Edge>> adjList;

    // DFS 輔助函式
    void dfsHelper(int u, vector<bool>& visited) {
        visited[u] = true;
        cout << u << " ";

        for (const auto& edge : adjList[u]) {
            if (!visited[edge.to]) {
                dfsHelper(edge.to, visited);
            }
        }
    }

public:
    AdjacencyListGraph(int vertices, bool directed) : V(vertices), isDirected(directed) {
        adjList.resize(V);
    }

    // 新增邊 (u -> v, 權重 w)
    void addEdge(int u, int v, int weight) {
        adjList[u].push_back({v, weight});
        if (!isDirected) {
            adjList[v].push_back({u, weight}); // 若為無向圖，需雙向加邊
        }
    }

    // 印出鄰接串列
    void printGraph() {
        cout << "--- 鄰接串列 (Adjacency List) ---" << endl;
        for (int i = 0; i < V; ++i) {
            cout << "頂點 " << i << ":";
            for (const auto& edge : adjList[i]) {
                cout << " -> (指向: " << edge.to << ", 權重: " << edge.weight << ")";
            }
            cout << endl;
        }
    }

    // 使用深度優先搜尋 (DFS) 進行圖遍歷
    void dfs(int start) {
        vector<bool> visited(V, false);
        cout << "鄰接串列 DFS 遍歷順序 (從 " << start << " 開始): ";
        dfsHelper(start, visited);
        cout << endl;
    }
};

int main() {
    /*
      範例輸入圖結構：
      5 個頂點 (0 ~ 4)，6 條邊
      (0, 1, 5), (0, 2, 2), (1, 3, 8), (2, 3, 3), (2, 4, 7), (3, 4, 1)
    */
    int V = 5;
    
    // ================= 無向圖測試 =================
    cout << "=== 無向圖測試 (Undirected Graph) ===" << endl;
    AdjacencyMatrixGraph matrixGraphUndirected(V, false);
    AdjacencyListGraph listGraphUndirected(V, false);

    vector<vector<int>> edges = {
        {0, 1, 5}, {0, 2, 2}, {1, 3, 8}, {2, 3, 3}, {2, 4, 7}, {3, 4, 1}
    };

    for (const auto& edge : edges) {
        matrixGraphUndirected.addEdge(edge[0], edge[1], edge[2]);
        listGraphUndirected.addEdge(edge[0], edge[1], edge[2]);
    }

    matrixGraphUndirected.printGraph();
    listGraphUndirected.printGraph();

    matrixGraphUndirected.bfs(0);
    listGraphUndirected.dfs(0);

    cout << endl;

    // ================= 有向圖測試 =================
    cout << "=== 有向圖測試 (Directed Graph) ===" << endl;
    AdjacencyMatrixGraph matrixGraphDirected(V, true);
    AdjacencyListGraph listGraphDirected(V, true);

    for (const auto& edge : edges) {
        matrixGraphDirected.addEdge(edge[0], edge[1], edge[2]);
        listGraphDirected.addEdge(edge[0], edge[1], edge[2]);
    }

    matrixGraphDirected.printGraph();
    listGraphDirected.printGraph();

    matrixGraphDirected.bfs(0);
    listGraphDirected.dfs(0);

    return 0;
}
```

---

### Java 實作範本

```java
import java.util.*;

public class GraphDemo {

    // 鄰接串列的邊類別
    static class Edge {
        int to;
        int weight;

        Edge(int to, int weight) {
            this.to = to;
            this.weight = weight;
        }
    }

    // 1. 鄰接矩陣類別
    static class AdjacencyMatrixGraph {
        private final int V;
        private final boolean isDirected;
        private final int[][] adjMatrix;
        public static final int INF = 1_000_000_000; // 代表無邊

        public AdjacencyMatrixGraph(int vertices, boolean directed) {
            this.V = vertices;
            this.isDirected = directed;
            this.adjMatrix = new int[V][V];
            for (int i = 0; i < V; i++) {
                Arrays.fill(adjMatrix[i], INF);
                adjMatrix[i][i] = 0; // 頂點到自身的距離為 0
            }
        }

        public void addEdge(int u, int v, int weight) {
            adjMatrix[u][v] = weight;
            if (!isDirected) {
                adjMatrix[v][u] = weight; // 若為無向圖，雙向加邊
            }
        }

        public void printGraph() {
            System.out.println("--- 鄰接矩陣 (Adjacency Matrix) ---");
            for (int i = 0; i < V; i++) {
                for (int j = 0; j < V; j++) {
                    if (adjMatrix[i][j] == INF) {
                        System.out.printf("%6s", "INF");
                    } else {
                        System.out.printf("%6d", adjMatrix[i][j]);
                    }
                }
                System.out.println();
            }
        }

        public void bfs(int start) {
            boolean[] visited = new boolean[V];
            Queue<Integer> queue = new LinkedList<>();

            visited[start] = true;
            queue.offer(start);

            System.out.print("鄰接矩陣 BFS 遍歷順序 (從 " + start + " 開始): ");
            while (!queue.isEmpty()) {
                int u = queue.poll();
                System.out.print(u + " ");

                for (int v = 0; v < V; v++) {
                    if (adjMatrix[u][v] != INF && u != v && !visited[v]) {
                        visited[v] = true;
                        queue.offer(v);
                    }
                }
            }
            System.out.println();
        }
    }

    // 2. 鄰接串列類別
    static class AdjacencyListGraph {
        private final int V;
        private final boolean isDirected;
        private final List<List<Edge>> adjList;

        public AdjacencyListGraph(int vertices, boolean directed) {
            this.V = vertices;
            this.isDirected = directed;
            this.adjList = new ArrayList<>(V);
            for (int i = 0; i < V; i++) {
                adjList.add(new ArrayList<>());
            }
        }

        public void addEdge(int u, int v, int weight) {
            adjList.get(u).add(new Edge(v, weight));
            if (!isDirected) {
                adjList.get(v).add(new Edge(u, weight)); // 若為無向圖，雙向加邊
            }
        }

        public void printGraph() {
            System.out.println("--- 鄰接串列 (Adjacency List) ---");
            for (int i = 0; i < V; i++) {
                System.out.print("頂點 " + i + ":");
                for (Edge edge : adjList.get(i)) {
                    System.out.print(" -> (指向: " + edge.to + ", 權重: " + edge.weight + ")");
                }
                System.out.println();
            }
        }

        private void dfsHelper(int u, boolean[] visited) {
            visited[u] = true;
            System.out.print(u + " ");
            for (Edge edge : adjList.get(u)) {
                if (!visited[edge.to]) {
                    dfsHelper(edge.to, visited);
                }
            }
        }

        public void dfs(int start) {
            boolean[] visited = new boolean[V];
            System.out.print("鄰接串列 DFS 遍歷順序 (從 " + start + " 開始): ");
            dfsHelper(start, visited);
            System.out.println();
        }
    }

    public static void main(String[] args) {
        int V = 5;
        int[][] edges = {
            {0, 1, 5}, {0, 2, 2}, {1, 3, 8}, {2, 3, 3}, {2, 4, 7}, {3, 4, 1}
        };

        // ================= 無向圖測試 =================
        System.out.println("=== 無向圖測試 (Undirected Graph) ===");
        AdjacencyMatrixGraph matrixGraphUndirected = new AdjacencyMatrixGraph(V, false);
        AdjacencyListGraph listGraphUndirected = new AdjacencyListGraph(V, false);

        for (int[] edge : edges) {
            matrixGraphUndirected.addEdge(edge[0], edge[1], edge[2]);
            listGraphUndirected.addEdge(edge[0], edge[1], edge[2]);
        }

        matrixGraphUndirected.printGraph();
        listGraphUndirected.printGraph();

        matrixGraphUndirected.bfs(0);
        listGraphUndirected.dfs(0);

        System.out.println();

        // ================= 有向圖測試 =================
        System.out.println("=== 有向圖測試 (Directed Graph) ===");
        AdjacencyMatrixGraph matrixGraphDirected = new AdjacencyMatrixGraph(V, true);
        AdjacencyListGraph listGraphDirected = new AdjacencyListGraph(V, true);

        for (int[] edge : edges) {
            matrixGraphDirected.addEdge(edge[0], edge[1], edge[2]);
            listGraphDirected.addEdge(edge[0], edge[1], edge[2]);
        }

        matrixGraphDirected.printGraph();
        listGraphDirected.printGraph();

        matrixGraphDirected.bfs(0);
        listGraphDirected.dfs(0);
    }
}
```

---

### Python 實作範本

```python
from collections import deque

# 1. 鄰接矩陣類別
class AdjacencyMatrixGraph:
    INF = 10**9  # 代表無邊

    def __init__(self, vertices: int, directed: bool):
        self.V = vertices
        self.is_directed = directed
        self.matrix = [[self.INF] * self.V for _ in range(self.V)]
        for i in range(self.V):
            self.matrix[i][i] = 0  # 頂點到自身的距離為 0

    def add_edge(self, u: int, v: int, weight: int):
        self.matrix[u][v] = weight
        if not self.is_directed:
            self.matrix[v][u] = weight  # 若為無向圖，雙向加邊

    def print_graph(self):
        print("--- 鄰接矩陣 (Adjacency Matrix) ---")
        for i in range(self.V):
            row = []
            for j in range(self.V):
                if self.matrix[i][j] == self.INF:
                    row.append(f"{'INF':>6}")
                else:
                    row.append(f"{self.matrix[i][j]:>6d}")
            print(" ".join(row))

    def bfs(self, start: int):
        visited = [False] * self.V
        queue = deque([start])
        visited[start] = True
        
        result = []
        while queue:
            u = queue.popleft()
            result.append(str(u))
            
            for v in range(self.V):
                if self.matrix[u][v] != self.INF and u != v and not visited[v]:
                    visited[v] = True
                    queue.append(v)
        print(f"鄰接矩陣 BFS 遍歷順序 (從 {start} 開始): " + " ".join(result))


# 2. 鄰接串列類別
class AdjacencyListGraph:
    def __init__(self, vertices: int, directed: bool):
        self.V = vertices
        self.is_directed = directed
        self.adj_list = [[] for _ in range(self.V)]

    def add_edge(self, u: int, v: int, weight: int):
        self.adj_list[u].append((v, weight))
        if not self.is_directed:
            self.adj_list[v].append((u, weight))  # 若為無向圖，雙向加邊

    def print_graph(self):
        print("--- 鄰接串列 (Adjacency List) ---")
        for i in range(self.V):
            edges_str = "".join([f" -> (指向: {to}, 權重: {w})" for to, w in self.adj_list[i]])
            print(f"頂點 {i}:{edges_str}")

    def dfs(self, start: int):
        visited = [False] * self.V
        result = []

        def dfs_helper(u: int):
            visited[u] = True
            result.append(str(u))
            for to, _ in self.adj_list[u]:
                if not visited[to]:
                    dfs_helper(to)

        dfs_helper(start)
        print(f"鄰接串列 DFS 遍歷順序 (從 {start} 開始): " + " ".join(result))


if __name__ == "__main__":
    V = 5
    edges = [
        (0, 1, 5), (0, 2, 2), (1, 3, 8), (2, 3, 3), (2, 4, 7), (3, 4, 1)
    ]

    # ================= 無向圖測試 =================
    print("=== 無向圖測試 (Undirected Graph) ===")
    matrix_graph_undirected = AdjacencyMatrixGraph(V, False)
    list_graph_undirected = AdjacencyListGraph(V, False)

    for u, v, w in edges:
        matrix_graph_undirected.add_edge(u, v, w)
        list_graph_undirected.add_edge(u, v, w)

    matrix_graph_undirected.print_graph()
    list_graph_undirected.print_graph()

    matrix_graph_undirected.bfs(0)
    list_graph_undirected.dfs(0)

    print()

    # ================= 有向圖測試 =================
    print("=== 有向圖測試 (Directed Graph) ===")
    matrix_graph_directed = AdjacencyMatrixGraph(V, True)
    list_graph_directed = AdjacencyListGraph(V, True)

    for u, v, w in edges:
        matrix_graph_directed.add_edge(u, v, w)
        list_graph_directed.add_edge(u, v, w)

    matrix_graph_directed.print_graph()
    list_graph_directed.print_graph()

    matrix_graph_directed.bfs(0)
    list_graph_directed.dfs(0)
```

---

## 3. 複雜度與防禦要點

### 複雜度分析
- **鄰接矩陣**：
  - **時間複雜度**：建圖需初始化一個 $V \times V$ 的二維陣列，時間複雜度為 $O(V^2)$。每次新增一條邊為 $O(1)$。
  - **空間複雜度**：固定耗費 $O(V^2)$ 的記憶體。如果 $V = 10^5$，則 $V^2 = 10^{10}$ 個整數，會消耗約 40 GB 的記憶體，在競賽中必會造成記憶體超限 (MLE)。
- **鄰接串列**：
  - **時間複雜度**：初始化為 $O(V)$。每次新增邊（在 vector / list 尾端插入元素）為 $O(1)$。建圖總時間複雜度為 $O(V + E)$。
  - **空間複雜度**：僅儲存存在的邊，空間複雜度為 $O(V + E)$，對於 $V, E \le 2 \times 10^5$ 的大規模稀疏圖，佔用記憶體僅數十 MB，安全可靠。

---

### 避坑與防禦要點

#### 1. 頂點索引的 0-based 與 1-based 轉換
許多競賽題目中的頂點編號是從 $1$ 到 $V$（1-based），而多數程式語言的陣列/列表索引是從 $0$ 開始。
- **解決方案 A**：將陣列或鄰接串列的大小設為 $V + 1$，直接使用頂點的原始編號。這在競賽中非常常見且不易出錯。
- **解決方案 B**：讀入每條邊的頂點 $u$ 和 $v$ 時，將其手動減 $1$（即 `u--`, `v--`），將其轉換成符合 0-based 的索引。

#### 2. 重邊 (Multiple Edges) 與自環 (Self-loops)
- **重邊**：兩點之間存在多條邊。
  - 在**鄰接矩陣**中，後加入的邊會直接覆蓋先前的邊。如果是求最短路徑，我們通常只保留**權重最小**的那條邊：
    ```cpp
    void addEdge(int u, int v, int weight) {
        adjMatrix[u][v] = min(adjMatrix[u][v], weight);
    }
    ```
  - 在**鄰接串列**中，重邊會以多個獨立的元素存在於列表中，通常可以直接保留，但在特定演算法（如 Euler Path、或某些需要精簡邊數的算法）中需要去重或特別處理。
- **自環**：一條邊的起點與終點相同（即 $u \to u$）。
  - 對於自環，鄰接矩陣中 `adj[u][u]` 通常初始化為 $0$；如果題目允許自環且權重有影響，需根據題意判斷是否更新該值。

#### 3. 無邊狀態與數值溢位 (Integer Overflow)
在有權圖中，通常需要選擇一個數值來表示「兩點間無邊」或「無限大 ($\infty$)」。
- **防禦陷阱**：若將 $\infty$ 設為程式語言的整數最大值（例如 C++ 的 `INT_MAX` 或 Java 的 `Integer.MAX_VALUE`），當在執行 Floyd-Warshall 或 Dijkstra 演算法時，常會有類似 `dist[u] + weight` 的鬆弛操作。此時 `INT_MAX` 加上一個正權重會發生**整數溢位**，變成極小的負數，導致演算法產生完全錯誤的結果。
- **正確做法**：
  - 在 C++ 中，常使用 `1e9` (1,000,000,000) 或 `0x3f3f3f3f` (1,061,109,567) 作為 $\infty$。其特點是「兩者相加仍不會超過 32 位元有號整數的上限 (`2,147,483,647`)」。
  - 如果路徑上的權重累加可能非常大，必須將變數與 $\infty$ 設定為 64 位元整數（C++ 中的 `long long`，Java 中的 `long`，Python 則無此限但要注意效能），並將 $\infty$ 設為 `1e18`。

#### 4. 邊界情況 (Edge Cases)
- **$V = 1$（孤立點）**：圖中只有一個頂點，沒有任何邊。應確保程式碼的遍歷與建圖在此情況下不會發生陣列越界。
- **不連通圖**：若圖不連通，從單一頂點開始的 DFS/BFS 無法走訪到整張圖的所有節點。如果題目要求處理所有點，應使用外層迴圈遍歷所有頂點，當發現頂點未造訪過時，便啟動一次新的 DFS/BFS。
