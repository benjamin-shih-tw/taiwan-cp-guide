// 台灣競程修練指南 (Taiwan CP Guide) - 演算法代碼模板庫數據
// 採全域物件載入，方便單檔 HTML 連接

const TEMPLATE_DATA = [
  {
    id: "cpp-fast-io",
    title: "C++ 競程標準標頭檔與快速 I/O",
    category: "Basic",
    desc: "台灣競程選手最常用的標準起手式，關閉串流同步以加速輸入輸出，並提供常用的巨集（macro）定義與常數。",
    code: `#include <bits/stdc++.h>
using namespace std;

// 常用簡寫與巨集
#define int long long
#define pii pair<int, int>
#define F first
#define S second
#define pb push_back
#define SZ(x) (int)(x).size()
#define ALL(x) (x).begin(), (x).end()
#define REP(i, n) for(int i = 0; i < n; ++i)
#define REP1(i, a, b) for(int i = a; i <= b; ++i)

// 快速 I/O 優化
void fast_io() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
}

signed main() {
    fast_io();
    
    // 在此開始您的解題邏輯
    
    return 0;
}`
  },
  {
    id: "disjoint-set-union",
    title: "並查集 (Disjoint Set Union, DSU)",
    category: "Data Structure",
    desc: "支援集合合併與元素所屬集合查詢的高效資料結構。此模板包含「路徑壓縮（Path Compression）」與「啟發式合併（Union by Size）」，使操作的攤還時間複雜度幾近為 $O(\\alpha(N))$。",
    code: `#include <bits/stdc++.h>
using namespace std;

struct DSU {
    vector<int> parent, sz;
    
    // 初始化 N 個節點
    DSU(int n) {
        parent.resize(n + 1);
        sz.assign(n + 1, 1);
        for (int i = 0; i <= n; i++) parent[i] = i;
    }
    
    // 尋找代表節點（路徑壓縮）
    int find_set(int v) {
        if (v == parent[v]) return v;
        return parent[v] = find_set(parent[v]);
    }
    
    // 合併兩個集合（按大小啟發式合併）
    bool union_sets(int a, int b) {
        a = find_set(a);
        b = find_set(b);
        if (a != b) {
            if (sz[a] < sz[b]) swap(a, b);
            parent[b] = a;
            sz[a] += sz[b];
            return true; // 合併成功
        }
        return false; // 已在同一個集合中
    }
};`
  },
  {
    id: "segment-tree-lazy",
    title: "線段樹與懶標記 (Segment Tree with Lazy Tag)",
    category: "Data Structure",
    desc: "經典區間查詢與區間修改（區間加值、區間求和）線段樹模板。包含延遲標記（Lazy Propagation）下放技術，確保每次區間操作在 $O(\\log N)$ 時間內完成。",
    code: `#include <bits/stdc++.h>
using namespace std;

struct SegmentTree {
    int n;
    vector<int> tree, lazy;

    SegmentTree(int n) : n(n) {
        tree.assign(4 * n, 0);
        lazy.assign(4 * n, 0);
    }

    // 向上更新節點資訊
    void pull(int node) {
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    // 懶標記下放
    void push(int node, int l, int r) {
        if (lazy[node] == 0) return;
        int mid = (l + r) / 2;
        
        // 更新左子節點
        tree[2 * node] += lazy[node] * (mid - l + 1);
        lazy[2 * node] += lazy[node];
        
        // 更新右子節點
        tree[2 * node + 1] += lazy[node] * (r - mid);
        lazy[2 * node + 1] += lazy[node];
        
        // 清除當前節點標記
        lazy[node] = 0;
    }

    // 區間加值修改: [ql, qr] 加上 val
    void update(int node, int l, int r, int ql, int qr, int val) {
        if (ql <= l && r <= qr) {
            tree[node] += val * (r - l + 1);
            lazy[node] += val;
            return;
        }
        push(node, l, r);
        int mid = (l + r) / 2;
        if (ql <= mid) update(2 * node, l, mid, ql, qr, val);
        if (qr > mid) update(2 * node + 1, mid + 1, r, ql, qr, val);
        pull(node);
    }

    // 區間求和查詢: [ql, qr] 區間和
    int query(int node, int l, int r, int ql, int qr) {
        if (ql <= l && r <= qr) return tree[node];
        push(node, l, r);
        int mid = (l + r) / 2;
        int sum = 0;
        if (ql <= mid) sum += query(2 * node, l, mid, ql, qr);
        if (qr > mid) sum += query(2 * node + 1, mid + 1, r, ql, qr);
        return sum;
    }
};`
  },
  {
    id: "fenwick-tree",
    title: "樹狀陣列 (Fenwick Tree / BIT)",
    category: "Data Structure",
    desc: "比起線段樹，樹狀陣列在空間與常數上極具優勢，實作程式碼極短。支援單點修改與前綴和查詢（藉此推導出區間查詢），時間複雜度為 $O(\\log N)$，使用 lowbit 運算實現。",
    code: `#include <bits/stdc++.h>
using namespace std;

struct FenwickTree {
    int n;
    vector<int> bit;

    FenwickTree(int n) : n(n) {
        bit.assign(n + 1, 0);
    }

    // 取得二進位最低位的 1 (lowbit)
    int lowbit(int x) {
        return x & (-x);
    }

    // 單點修改：將 index 為 idx 的值加上 val
    void add(int idx, int val) {
        for (; idx <= n; idx += lowbit(idx)) {
            bit[idx] += val;
        }
    }

    // 前綴和查詢：查詢 [1, idx] 的區間和
    int query(int idx) {
        int sum = 0;
        for (; idx > 0; idx -= lowbit(idx)) {
            sum += bit[idx];
        }
        return sum;
    }

    // 區間和查詢：查詢 [l, r] 的區間和
    int query(int l, int r) {
        if (l > r) return 0;
        return query(r) - query(l - 1);
    }
};`
  },
  {
    id: "monotonic-queue",
    title: "單調佇列 (Monotonic Queue) / 滑動視窗最大值",
    category: "Data Structure",
    desc: "維護一個雙端佇列 (deque)，其內部元素的值保持單調遞減。能在 $O(1)$ 時間內查詢區間極值，每個元素最多進出佇列一次，均攤時間複雜度為 $O(N)$，是滑動視窗最大/最小值與單調 DP 優化之核心神兵。",
    code: `#include <bits/stdc++.h>
using namespace std;

// 滑動視窗最大值 (Sliding Window Maximum)
// 維護 deque 中的索引，使其對應的陣列值由大到小單調遞減
vector<int> max_sliding_window(const vector<int>& nums, int k) {
    vector<int> res;
    deque<int> dq; // 儲存陣列的索引 (index)
    
    for (int i = 0; i < nums.size(); ++i) {
        // 1. 移除超出滑動視窗範圍的過期索引 (左端)
        if (!dq.empty() && dq.front() < i - k + 1) {
            dq.pop_front();
        }
        
        // 2. 維護單調性：將所有小於等於當前元素的索引從右端彈出
        while (!dq.empty() && nums[dq.back()] <= nums[i]) {
            dq.pop_back();
        }
        
        // 3. 將當前索引壓入佇列
        dq.push_back(i);
        
        // 4. 當視窗大小達到 k 時，記錄當前最大值 (即佇列最前端對應的元素)
        if (i >= k - 1) {
            res.push_back(nums[dq.front()]);
        }
    }
    return res;
}`
  },
  {
    id: "heavy-light-decomposition",
    title: "樹鏈剖分 (Heavy-Light Decomposition, HLD)",
    category: "Data Structure",
    desc: "將樹結構拆解為數條重鏈與輕邊，使得樹上路徑修改與查詢可轉化為區間操作。搭配線段樹，樹上路徑修改/查詢與 LCA 求解之時間複雜度均為 $O(\\log^2 N)$。此處提供完整樹上節點區間修改、區間查詢及 LCA 實作。",
    code: `#include <bits/stdc++.h>
using namespace std;

// 樹鏈剖分 (Heavy-Light Decomposition) 與線段樹維護
struct HLD {
    int n, timer;
    vector<vector<int>> adj;
    vector<int> parent, depth, sz, heavy, head, tin, tout, rev_tin;
    
    // 線段樹用於維護重鏈上的區間值
    struct SegTree {
        int sz_tree;
        vector<int> val, lazy;
        SegTree(int n) {
            sz_tree = n;
            val.assign(4 * n, 0);
            lazy.assign(4 * n, 0);
        }
        void push(int node, int l, int r) {
            if (lazy[node] == 0) return;
            int mid = (l + r) / 2;
            val[2 * node] += lazy[node] * (mid - l + 1);
            lazy[2 * node] += lazy[node];
            val[2 * node + 1] += lazy[node] * (r - mid);
            lazy[2 * node + 1] += lazy[node];
            lazy[node] = 0;
        }
        void update(int node, int l, int r, int ql, int qr, int add) {
            if (ql <= l && r <= qr) {
                val[node] += add * (r - l + 1);
                lazy[node] += add;
                return;
            }
            push(node, l, r);
            int mid = (l + r) / 2;
            if (ql <= mid) update(2 * node, l, mid, ql, qr, add);
            if (qr > mid) update(2 * node + 1, mid + 1, r, ql, qr, add);
            val[node] = val[2 * node] + val[2 * node + 1];
        }
        int query(int node, int l, int r, int ql, int qr) {
            if (ql <= l && r <= qr) return val[node];
            push(node, l, r);
            int mid = (l + r) / 2;
            int sum = 0;
            if (ql <= mid) sum += query(2 * node, l, mid, ql, qr);
            if (qr > mid) sum += query(2 * node + 1, mid + 1, r, ql, qr);
            return sum;
        }
    } *seg;

    HLD(int n) : n(n), timer(0), adj(n + 1), parent(n + 1), depth(n + 1),
                 sz(n + 1), heavy(n + 1, 0), head(n + 1), tin(n + 1), tout(n + 1), rev_tin(n + 1) {
        seg = new SegTree(n + 1);
    }

    void add_edge(int u, int v) {
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    // 第一遍 DFS: 計算子樹大小、深度、父節點並找出重子節點
    void dfs_sz(int u, int p, int d) {
        parent[u] = p;
        depth[u] = d;
        sz[u] = 1;
        int max_c_sz = 0;
        for (int v : adj[u]) {
            if (v == p) continue;
            dfs_sz(v, u, d + 1);
            sz[u] += sz[v];
            if (sz[v] > max_c_sz) {
                max_c_sz = sz[v];
                heavy[u] = v;
            }
        }
    }

    // 第二遍 DFS: 進行樹鏈剖分，建立 DFS 序並記錄重鏈鏈頭
    void dfs_hld(int u, int h) {
        head[u] = h;
        tin[u] = ++timer;
        rev_tin[timer] = u;
        if (heavy[u]) {
            dfs_hld(heavy[u], h); // 優先走重子節點，使重鏈在 DFS 序中連續
        }
        for (int v : adj[u]) {
            if (v == parent[u] || v == heavy[u]) continue;
            dfs_hld(v, v); // 輕邊節點做為新重鏈的鏈頭
        }
        tout[u] = timer;
    }

    void decompose(int root = 1) {
        dfs_sz(root, 0, 1);
        dfs_hld(root, root);
    }

    // 樹上路徑修改：將 u 到 v 路徑上所有節點的值加上 val
    void update_path(int u, int v, int val) {
        while (head[u] != head[v]) {
            if (depth[head[u]] > depth[head[v]]) swap(u, v);
            seg->update(1, 1, n, tin[head[v]], tin[v], val);
            v = parent[head[v]];
        }
        if (depth[u] > depth[v]) swap(u, v);
        seg->update(1, 1, n, tin[u], tin[v], val);
    }

    // 樹上路徑查詢：查詢 u 到 v 路徑上所有節點的值總和
    int query_path(int u, int v) {
        int sum = 0;
        while (head[u] != head[v]) {
            if (depth[head[u]] > depth[head[v]]) swap(u, v);
            sum += seg->query(1, 1, n, tin[head[v]], tin[v]);
            v = parent[head[v]];
        }
        if (depth[u] > depth[v]) swap(u, v);
        sum += seg->query(1, 1, n, tin[u], tin[v]);
        return sum;
    }

    // 樹上子樹修改：將以 u 為根的子樹中所有節點的值加上 val
    void update_subtree(int u, int val) {
        seg->update(1, 1, n, tin[u], tout[u], val);
    }

    // 樹上子樹查詢：查詢以 u 為根的子樹中所有節點的值總和
    int query_subtree(int u) {
        return seg->query(1, 1, n, tin[u], tout[u]);
    }

    // 求解最近公共祖先 (LCA)
    int get_lca(int u, int v) {
        while (head[u] != head[v]) {
            if (depth[head[u]] > depth[head[v]]) swap(u, v);
            v = parent[head[v]];
        }
        return depth[u] < depth[v] ? u : v;
    }
};`
  },
  {
    id: "kmp-string",
    title: "KMP 字串匹配演算法 (Knuth-Morris-Pratt)",
    category: "Basic",
    desc: "在時間複雜度 $O(N + M)$ 內，在文本字串 S 中尋找模式字串 P 的所有匹配起點。核心思想為預先計算 P 的 Pi 陣列（最長相同前後綴），在失配時跳過無用比較，達到線性時間的高效比對。",
    code: `#include <bits/stdc++.h>
using namespace std;

// KMP 字串匹配
struct KMP {
    string p;
    vector<int> pi;
    
    KMP(const string& pattern) : p(pattern) {
        int m = p.size();
        pi.assign(m, 0);
        for (int i = 1; i < m; ++i) {
            int j = pi[i - 1];
            while (j > 0 && p[i] != p[j]) {
                j = pi[j - 1];
            }
            if (p[i] == p[j]) {
                j++;
            }
            pi[i] = j;
        }
    }
    
    // 在文本 S 中尋找 P 的所有出現位置，回傳匹配起點的 index 列表
    vector<int> search(const string& s) {
        vector<int> occurrences;
        int n = s.size();
        int m = p.size();
        if (m == 0) return {};
        
        int j = 0; // 模式字串 P 的指針
        for (int i = 0; i < n; ++i) {
            while (j > 0 && s[i] != p[j]) {
                j = pi[j - 1]; // 失配時，根據 pi 陣列移動指針
            }
            if (s[i] == p[j]) {
                j++;
            }
            if (j == m) {
                occurrences.push_back(i - m + 1); // 成功匹配，記錄起點
                j = pi[j - 1]; // 繼續尋找下一個匹配
            }
        }
        return occurrences;
    }
};`
  },
  {
    id: "trie",
    title: "字典樹 (Trie / Prefix Tree)",
    category: "Data Structure",
    desc: "高效儲存與檢索字串集合的樹狀結構。可用於快速查詢單詞是否存在、或者是否存在以給定字串為前綴的字串。每次插入或查詢的時間複雜度僅與字串長度 $L$ 成正比 $O(L)$。",
    code: `#include <bits/stdc++.h>
using namespace std;

// 字典樹 (Trie / 前綴樹)
struct Trie {
    struct TrieNode {
        TrieNode* child[26];
        int count; // 記錄以該節點結尾的字串個數
        int prefix_count; // 記錄通過該節點的字串個數 (用於前綴字首查詢)
        
        TrieNode() : count(0), prefix_count(0) {
            for (int i = 0; i < 26; ++i) {
                child[i] = nullptr;
            }
        }
    };
    
    TrieNode* root;
    
    Trie() {
        root = new TrieNode();
    }
    
    // 插入字串 (限小寫英文字母)
    void insert(const string& word) {
        TrieNode* curr = root;
        for (char c : word) {
            int idx = c - 'a';
            if (curr->child[idx] == nullptr) {
                curr->child[idx] = new TrieNode();
            }
            curr = curr->child[idx];
            curr->prefix_count++;
        }
        curr->count++;
    }
    
    // 查詢字串是否存在
    bool search(const string& word) {
        TrieNode* curr = root;
        for (char c : word) {
            int idx = c - 'a';
            if (curr->child[idx] == nullptr) return false;
            curr = curr->child[idx];
        }
        return curr->count > 0;
    }
    
    // 查詢是否存在以 prefix 為前綴的字串
    bool starts_with(const string& prefix) {
        TrieNode* curr = root;
        for (char c : prefix) {
            int idx = c - 'a';
            if (curr->child[idx] == nullptr) return false;
            curr = curr->child[idx];
        }
        return curr->prefix_count > 0;
    }
};`
  },
  {
    id: "dijkstra-shortest-path",
    title: "Dijkstra 最短路徑演算法 (Priority Queue 優化)",
    category: "Graph Theory",
    desc: "求解單源非負權重圖最短路徑的標準做法。透過 C++ `std::priority_queue` 進行加速，時間複雜度優化至 $O(M \\log N)$，其中 $N$ 為頂點數，$M$ 為邊數。",
    code: `#include <bits/stdc++.h>
using namespace std;

const int INF = 1e18; // 使用極大值代表不可達

struct Edge {
    int to, weight;
};

// Dijkstra 演算法
// graph: 鄰接串列，start: 起點，dist: 用於儲存最短距離的陣列
void dijkstra(int start, const vector<vector<Edge>>& graph, vector<int>& dist) {
    int n = graph.size();
    dist.assign(n, INF);
    
    // 優先佇列：儲存 pair <距離, 節點編號>，預設由小到大排序
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    
    dist[start] = 0;
    pq.push({0, start});
    
    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        
        // 剪枝：如果拿出來的距離大於當前已知最短距離，跳過
        if (d > dist[u]) continue;
        
        // 鬆弛操作 (Relaxation)
        for (const auto& edge : graph[u]) {
            int v = edge.to;
            int w = edge.weight;
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
}`
  },
  {
    id: "kruskal-mst",
    title: "Kruskal 最小生成樹演算法 (結合 DSU)",
    category: "Graph Theory",
    desc: "藉由貪心策略與並查集 (DSU) 高效尋找無向加權圖的最小生成樹 (MST)。演算法先將所有邊依照權重從小到大排序，再依次選邊加入，避開環路。時間複雜度為 $O(M \\log M)$。",
    code: `#include <bits/stdc++.h>
using namespace std;

struct Edge {
    int u, v, weight;
    
    // 依照邊權排序的比較運算子
    bool operator<(const Edge& other) const {
        return weight < other.weight;
    }
};

struct DSU {
    vector<int> parent;
    DSU(int n) {
        parent.resize(n + 1);
        for(int i = 0; i <= n; ++i) parent[i] = i;
    }
    int find_set(int v) {
        if (v == parent[v]) return v;
        return parent[v] = find_set(parent[v]);
    }
    bool union_sets(int a, int b) {
        a = find_set(a);
        b = find_set(b);
        if (a != b) {
            parent[b] = a;
            return true;
        }
        return false;
    }
};

// 回傳最小生成樹的總權重，若不連通回傳 -1
// n: 頂點數, edges: 所有無向邊
int kruskal(int n, vector<Edge>& edges, vector<Edge>& mst_edges) {
    sort(edges.begin(), edges.end());
    DSU dsu(n);
    int total_weight = 0;
    int edges_used = 0;
    
    for (const auto& edge : edges) {
        if (dsu.union_sets(edge.u, edge.v)) {
            total_weight += edge.weight;
            mst_edges.push_back(edge);
            edges_used++;
            if (edges_used == n - 1) break;
        }
    }
    
    if (edges_used != n - 1) return -1; // 圖不連通，無法生成 MST
    return total_weight;
}`
  },
  {
    id: "dinic-max-flow",
    title: "Dinic 高速網路最大流演算法",
    category: "Graph Theory",
    desc: "網路流必學的高效算法，用於求解起點 S 到終點 T 的最大流量。利用 BFS 建立分層圖，再利用 DFS 進行深度搜尋以尋找增廣路，配合「當前弧優化」使最壞時間複雜度為 $O(N^2 M)$。對於二分圖最大匹配，其實質時間複雜度能優化至 $O(M \\sqrt{N})$，效率極佳。",
    code: `#include <bits/stdc++.h>
using namespace std;

// Dinic 高速網路最大流
struct Dinic {
    struct Edge {
        int to;
        int cap;  // 剩餘容量
        int flow; // 已用流量
        int rev;  // 反向邊在鄰接串列中的索引
    };

    int n;
    vector<vector<Edge>> adj;
    vector<int> level;
    vector<int> ptr; // 當前弧優化指針

    Dinic(int n) : n(n), adj(n), level(n), ptr(n) {}

    // 新增一條有向邊從 u 到 v，容量為 cap
    void add_edge(int from, int to, int cap) {
        adj[from].push_back({to, cap, 0, (int)adj[to].size()});
        adj[to].push_back({from, 0, 0, (int)adj[from].size() - 1}); // 有向邊對應容量為 0 的反向邊
    }

    // 利用 BFS 建立分層圖，回傳是否能到達終點 T
    bool bfs(int s, int t) {
        fill(level.begin(), level.end(), -1);
        level[s] = 0;
        queue<int> q;
        q.push(s);
        while (!q.empty()) {
            int v = q.front();
            q.pop();
            for (auto& edge : adj[v]) {
                if (edge.cap - edge.flow > 0 && level[edge.to] == -1) {
                    level[edge.to] = level[v] + 1;
                    q.push(edge.to);
                }
            }
        }
        return level[t] != -1;
    }

    // 利用 DFS 尋找增廣路並發送流量 (當前弧優化)
    int dfs(int v, int t, int pushed) {
        if (pushed == 0) return 0;
        if (v == t) return pushed;
        for (int& cid = ptr[v]; cid < adj[v].size(); ++cid) {
            auto& edge = adj[v][cid];
            int tr = edge.to;
            if (level[v] + 1 != level[tr] || edge.cap - edge.flow == 0) continue;
            int tr_push = dfs(tr, t, min(pushed, edge.cap - edge.flow));
            if (tr_push == 0) continue;
            edge.flow += tr_push;
            adj[tr][edge.rev].flow -= tr_push;
            return tr_push;
        }
        return 0;
    }

    // 計算起點 s 到終點 t 的最大流
    int max_flow(int s, int t) {
        int flow = 0;
        while (bfs(s, t)) {
            fill(ptr.begin(), ptr.end(), 0); // 重置當前弧指針
            while (int pushed = dfs(s, t, 1e18)) {
                flow += pushed;
            }
        }
        return flow;
    }
};`
  }
];
