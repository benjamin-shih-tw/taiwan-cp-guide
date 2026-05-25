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
}`,
    codeJava: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        // BufferedReader 與 StringTokenizer 提供超快速輸入讀取
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st;
        // PrintWriter 提供高效的輸出緩衝
        PrintWriter out = new PrintWriter(new BufferedOutputStream(System.out));
        
        // 範例：讀取一行資料
        String line = br.readLine();
        if (line != null) {
            st = new StringTokenizer(line);
            // 在此開始您的解題邏輯
        }
        
        // 結束時必須 flush() 否則可能遺漏輸出
        out.flush();
    }
}`,
    codePython: `import sys

def solve():
    # sys.stdin.read 實作極速檔案整包讀取
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    
    # 在此開始您的解題邏輯
    # 範例：print(input_data[0])
    
if __name__ == '__main__':
    solve()`
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
};`,
    codeJava: `import java.io.*;
import java.util.*;

class DSU {
    int[] parent;
    int[] sz;

    public DSU(int n) {
        parent = new int[n + 1];
        sz = new int[n + 1];
        for (int i = 0; i <= n; i++) {
            parent[i] = i;
            sz[i] = 1;
        }
    }

    public int find(int v) {
        if (v == parent[v]) return v;
        return parent[v] = find(parent[v]); // 路徑壓縮
    }

    public boolean union(int a, int b) {
        a = find(a);
        b = find(b);
        if (a != b) {
            if (sz[a] < sz[b]) {
                int temp = a; a = b; b = temp; // 按大小啟發式合併
            }
            parent[b] = a;
            sz[a] += sz[b];
            return true;
        }
        return false;
    }
}`,
    codePython: `class DSU:
    def __init__(self, n):
        self.parent = list(range(n + 1))
        self.sz = [1] * (n + 1)

    def find(self, v):
        if v == self.parent[v]:
            return v
        self.parent[v] = self.find(self.parent[v]) # 路徑壓縮
        return self.parent[v]

    def union(self, a, b):
        a = self.find(a)
        b = self.find(b)
        if a != b:
            if self.sz[a] < self.sz[b]:
                a, b = b, a # 按大小啟發式合併
            self.parent[b] = a
            self.sz[a] += self.sz[b]
            return True
        return False`
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
};`,
    codeJava: `class SegmentTree {
    int n;
    long[] tree;
    long[] lazy;

    public SegmentTree(int n) {
        this.n = n;
        tree = new long[4 * n];
        lazy = new long[4 * n];
    }

    private void pull(int node) {
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    private void push(int node, int l, int r) {
        if (lazy[node] == 0) return;
        int mid = (l + r) / 2;
        tree[2 * node] += lazy[node] * (mid - l + 1);
        lazy[2 * node] += lazy[node];
        tree[2 * node + 1] += lazy[node] * (r - mid);
        lazy[2 * node + 1] += lazy[node];
        lazy[node] = 0;
    }

    public void update(int node, int l, int r, int ql, int qr, long val) {
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

    public long query(int node, int l, int r, int ql, int qr) {
        if (ql <= l && r <= qr) return tree[node];
        push(node, l, r);
        int mid = (l + r) / 2;
        long sum = 0;
        if (ql <= mid) sum += query(2 * node, l, mid, ql, qr);
        if (qr > mid) sum += query(2 * node + 1, mid + 1, r, ql, qr);
        return sum;
    }
}`,
    codePython: `class SegmentTree:
    def __init__(self, n):
        self.n = n
        self.tree = [0] * (4 * n)
        self.lazy = [0] * (4 * n)

    def pull(self, node):
        self.tree[node] = self.tree[2 * node] + self.tree[2 * node + 1]

    def push(self, node, l, r):
        if self.lazy[node] == 0:
            return
        mid = (l + r) // 2
        self.tree[2 * node] += self.lazy[node] * (mid - l + 1)
        self.lazy[2 * node] += self.lazy[node]
        self.tree[2 * node + 1] += self.lazy[node] * (r - mid)
        self.lazy[2 * node + 1] += self.lazy[node]
        self.lazy[node] = 0

    def update(self, node, l, r, ql, qr, val):
        if ql <= l and r <= qr:
            self.tree[node] += val * (r - l + 1)
            self.lazy[node] += val
            return
        self.push(node, l, r)
        mid = (l + r) // 2
        if ql <= mid:
            self.update(2 * node, l, mid, ql, qr, val)
        if qr > mid:
            self.update(2 * node + 1, mid + 1, r, ql, qr, val)
        self.pull(node)

    def query(self, node, l, r, ql, qr):
        if ql <= l and r <= qr:
            return self.tree[node]
        self.push(node, l, r)
        mid = (l + r) // 2
        res = 0
        if ql <= mid:
            res += self.query(2 * node, l, mid, ql, qr)
        if qr > mid:
            res += self.query(2 * node + 1, mid + 1, r, ql, qr)
        return res`
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
};`,
    codeJava: `class FenwickTree {
    int n;
    long[] bit;

    public FenwickTree(int n) {
        this.n = n;
        bit = new long[n + 1];
    }

    private int lowbit(int x) {
        return x & (-x);
    }

    public void add(int idx, long val) {
        for (; idx <= n; idx += lowbit(idx)) {
            bit[idx] += val;
        }
    }

    public long query(int idx) {
        long sum = 0;
        for (; idx > 0; idx -= lowbit(idx)) {
            sum += bit[idx];
        }
        return sum;
    }

    public long query(int l, int r) {
        if (l > r) return 0;
        return query(r) - query(l - 1);
    }
}`,
    codePython: `class FenwickTree:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 1)

    def lowbit(self, x):
        return x & (-x)

    def add(self, idx, val):
        while idx <= self.n:
            self.bit[idx] += val
            idx += self.lowbit(idx)

    def query(self, idx):
        s = 0
        while idx > 0:
            s += self.bit[idx]
            idx -= self.lowbit(idx)
        return s

    def query_range(self, l, r):
        if l > r:
            return 0
        return self.query(r) - self.query(l - 1)`
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
  },
  {
    id: "sparse-table",
    title: "稀疏表 (Sparse Table / RMQ)",
    category: "Data Structure",
    desc: "用於靜態區間極值查詢 (RMQ) 的高效演算法。在 $O(N \\log N)$ 時間內完成預處理後，能以 $O(1)$ 時間回答任何區間的最值查詢，在無修改的情況下效率遠勝線段樹。",
    code: `#include <bits/stdc++.h>
using namespace std;

struct SparseTable {
    int n;
    vector<vector<int>> st;
    vector<int> lg;

    SparseTable(const vector<int>& a) {
        n = a.size();
        int max_log = 32 - __builtin_clz(n);
        st.assign(n, vector<int>(max_log));
        lg.assign(n + 1, 0);
        
        for (int i = 2; i <= n; i++) lg[i] = lg[i / 2] + 1;
        for (int i = 0; i < n; i++) st[i][0] = a[i];
        
        for (int j = 1; (1 << j) <= n; j++) {
            for (int i = 0; i + (1 << j) <= n; i++) {
                st[i][j] = max(st[i][j - 1], st[i + (1 << (j - 1))][j - 1]);
            }
        }
    }

    // 查詢 [L, R] 區間最大值 (0-indexed)
    int query(int L, int R) {
        int len = R - L + 1;
        int k = lg[len];
        return max(st[L][k], st[R - (1 << k) + 1][k]);
    }
};`
  },
  {
    id: "lca-binary-lifting",
    title: "最近公共祖先 (LCA - 倍增法)",
    category: "Graph Theory",
    desc: "利用倍增法 (Binary Lifting) 計算樹上兩個節點的最近公共祖先。在 $O(N \\log N)$ 時間內完成 DFS 與倍增表預處理後，每次查詢僅需 $O(\\log N)$。",
    code: `#include <bits/stdc++.h>
using namespace std;

struct LCA {
    int n, l;
    vector<vector<int>> adj;
    int timer;
    vector<int> tin, tout;
    vector<vector<int>> up;

    LCA(int n, int root) : n(n), adj(n + 1) {
        l = Math.ceil(log2(n + 1)) + 1;
        tin.resize(n + 1);
        tout.resize(n + 1);
        up.assign(n + 1, vector<int>(l + 1));
        timer = 0;
    }

    void add_edge(int u, int v) {
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    void dfs(int v, int p) {
        tin[v] = ++timer;
        up[v][0] = p;
        for (int i = 1; i <= l; ++i) {
            up[v][i] = up[up[v][i - 1]][i - 1];
        }
        for (int to : adj[v]) {
            if (to != p) dfs(to, v);
        }
        tout[v] = ++timer;
    }

    bool is_ancestor(int u, int v) {
        return tin[u] <= tin[v] && tout[u] >= tout[v];
    }

    int get_lca(int u, int v) {
        if (is_ancestor(u, v)) return u;
        if (is_ancestor(v, u)) return v;
        for (int i = l; i >= 0; --i) {
            if (!is_ancestor(up[u][i], v)) {
                u = up[u][i];
            }
        }
        return up[u][0];
    }

    void init(int root) {
        dfs(root, root);
    }
};`
  },
  {
    id: "mo-algorithm",
    title: "莫隊算法 (Mo's Algorithm)",
    category: "Basic",
    desc: "經典的區間查詢離線優化算法。當無單點修改且能以 $O(1)$ 從 $[l, r]$ 擴展至鄰近區間時，莫隊算法透過將詢問離線分塊排序，能將單次查詢平均降至 $O(N\\sqrt{N})$。",
    code: `#include <bits/stdc++.h>
using namespace std;

// 莫隊詢問結構體
struct Query {
    int l, r, id, block;
    bool operator<(const Query& other) const {
        if (block != other.block) return block < other.block;
        return (block & 1) ? (r < other.r) : (r > other.r); // 奇偶化排序優化
    }
};

int main() {
    int n, q;
    cin >> n >> q;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];

    int block_sz = max(1, (int)(n / sqrt(q)));
    vector<Query> queries(q);
    for (int i = 0; i < q; i++) {
        cin >> queries[i].l >> queries[i].r;
        queries[i].l--; queries[i].r--; // 轉 0-indexed
        queries[i].id = i;
        queries[i].block = queries[i].l / block_sz;
    }
    
    sort(queries.begin(), queries.end());

    int cur_l = 0, cur_r = -1;
    long long current_ans = 0; // 維護區間當前的答案
    vector<long long> ans(q);
    vector<int> freq(1000005, 0); // 頻率計數

    auto add = [&](int idx) {
        // 區間擴展邏輯：加入 a[idx] 到區間中並更新答案
        freq[a[idx]]++;
        if (freq[a[idx]] == 1) current_ans++; // 範例：計算相異數個數
    };

    auto remove = [&](int idx) {
        // 區間收縮邏輯：將 a[idx] 從區間中移除並更新答案
        freq[a[idx]]--;
        if (freq[a[idx]] == 0) current_ans--;
    };

    for (const auto& qry : queries) {
        while (cur_l > qry.l) add(--cur_l);
        while (cur_r < qry.r) add(++cur_r);
        while (cur_l < qry.l) remove(cur_l++);
        while (cur_r > qry.r) remove(cur_r--);
        ans[qry.id] = current_ans;
    }

    for (int i = 0; i < q; i++) cout << ans[i] << "\\n";
    return 0;
}`
  },
  {
    id: "dsu-on-tree",
    title: "樹上啟發式合併 (DSU on Tree)",
    category: "Graph Theory",
    desc: "用於解決樹上子樹查詢問題的高效算法。利用輕重子樹的概念，每次遍歷完輕子樹後清空資訊，保留重子樹資訊不予清空，使得每個節點被統計的次數降至 $O(\\log N)$，整體時間複雜度為 $O(N \\log N)$，空間複雜度為 $O(N)$。",
    code: `#include <bits/stdc++.h>
using namespace std;

// 樹上啟發式合併 (小到大合併)
struct DSUonTree {
    int n;
    vector<vector<int>> adj;
    vector<int> sz, col, cnt, ans;
    int max_cnt, val_sum; // 維護子樹內部的統計資訊
    vector<int> big;      // 標記重兒子

    DSUonTree(int n, const vector<int>& c) : n(n), adj(n + 1), col(c), sz(n + 1), cnt(100005, 0), ans(n + 1), big(n + 1, 0) {}

    void add_edge(int u, int v) {
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    // 第一遍 DFS：計算重兒子 big 與子樹大小 sz
    void dfs_sz(int v, int p) {
        sz[v] = 1;
        int max_s = -1;
        for (int to : adj[v]) {
            if (to != p) {
                dfs_sz(to, v);
                sz[v] += sz[to];
                if (sz[to] > max_s) {
                    max_s = sz[to];
                    big[v] = to;
                }
            }
        }
    }

    // 新增/移除節點資訊
    void add(int v, int p, int x, int keep_val) {
        cnt[col[v]] += x;
        // 在此根據 cnt[col[v]] 更新當前的統計資訊 (如 max_cnt 等)
        for (int to : adj[v]) {
            if (to != p && to != keep_val) {
                add(to, v, x, keep_val);
            }
        }
    }

    // 第二遍 DFS：啟發式統計
    void dfs_solve(int v, int p, bool keep) {
        // 1. 先遞迴解決所有輕兒子，且不保留其資訊 (keep = false)
        for (int to : adj[v]) {
            if (to != p && to != big[v]) {
                dfs_solve(to, v, false);
            }
        }
        // 2. 遞迴解決重兒子，並保留其資訊 (keep = true)
        if (big[v]) {
            dfs_solve(big[v], v, true);
        }
        // 3. 再次遍歷所有輕兒子，將其資訊加入當前統計
        add(v, p, 1, big[v]);
        
        // 4. 此時已收集完子樹 v 的所有資訊，記錄答案
        ans[v] = max_cnt; // 範例：記錄該子樹最大頻率等資訊
        
        // 5. 若此節點是輕兒子，需要將其所有貢獻在統計陣列中扣除
        if (!keep) {
            add(v, p, -1, 0);
            max_cnt = 0; // 重置統計狀態
        }
    }

    void solve(int root) {
        dfs_sz(root, 0);
        dfs_solve(root, 0, true);
    }
};`
  },
  {
    id: "aho-corasick",
    title: "AC 自動機 (Aho-Corasick Automaton)",
    category: "Data Structure",
    desc: "用於多模式字串匹配的經典演算法。結合了 Trie 字典樹與 KMP 的 fail 指標思想，在 $O(\\sum \\|P_i\\|)$ 的時間內建構出狀態自動機，能以 $O(\\|T\\|)$ 的時間完成對文本串中所有模式串的搜尋。",
    code: `#include <bits/stdc++.h>
using namespace std;

struct AhoCorasick {
    static const int ALPHABET_SIZE = 26;
    struct Node {
        int next[ALPHABET_SIZE];
        int fail;
        int cnt; // 此節點代表的字串出現次數
        Node() {
            fill(next, next + ALPHABET_SIZE, 0);
            fail = 0;
            cnt = 0;
        }
    };

    vector<Node> trie;

    AhoCorasick() {
        trie.push_back(Node()); // 根節點
    }

    // 插入字串
    void insert(const string& s) {
        int u = 0;
        for (char c : s) {
            int idx = c - 'a';
            if (!trie[u].next[idx]) {
                trie[u].next[idx] = trie.size();
                trie.push_back(Node());
            }
            u = trie[u].next[idx];
        }
        trie[u].cnt++;
    }

    // 建構 fail 指標 (BFS)
    void build() {
        queue<int> q;
        for (int i = 0; i < ALPHABET_SIZE; i++) {
            if (trie[0].next[i]) {
                q.push(trie[0].next[i]);
            }
        }
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (int i = 0; i < ALPHABET_SIZE; i++) {
                if (trie[u].next[i]) {
                    trie[trie[u].next[i]].fail = trie[trie[u].fail].next[i];
                    q.push(trie[u].next[i]);
                } else {
                    trie[u].next[i] = trie[trie[u].fail].next[i]; // 路徑壓縮優化
                }
            }
        }
    }

    // 查詢文本串 s 中模式串的匹配總次數
    int query(const string& s) {
        int u = 0, ans = 0;
        for (char c : s) {
            int idx = c - 'a';
            u = trie[u].next[idx];
            int temp = u;
            while (temp && trie[temp].cnt != -1) {
                ans += trie[temp].cnt;
                trie[temp].cnt = -1; // 避免重複統計
                temp = trie[temp].fail;
            }
        }
        return ans;
    }
};`
  },
  {
    id: "convex-hull-andrew",
    title: "二維凸包 (Andrew's Monotone Chain)",
    category: "Basic",
    desc: "計算二維平面點集最小凸多邊形的 Andrew 演算法（單調鏈法）。其效率與穩定性優於 Graham Scan。先按 $x$ 座標、再按 $y$ 座標排序，分別構造上下凸包。時間複雜度為 $O(N \\log N)$。",
    code: `#include <bits/stdc++.h>
using namespace std;

struct Point {
    double x, y;
    bool operator<(const Point& other) const {
        if (x != other.x) return x < other.x;
        return y < other.y;
    }
};

// 叉積 (Cross Product)：計算向量 AB 與 AC 的轉向
// 回傳正值代表逆時針（左轉），負值代表順時針（右轉），0 代表共線
double cross_product(const Point& O, const Point& A, const Point& B) {
    return (A.x - O.x) * (B.y - O.y) - (A.y - O.y) * (B.x - O.x);
}

// 構造凸包
vector<Point> convex_hull(vector<Point>& pts) {
    int n = pts.size(), k = 0;
    if (n <= 3) return pts;
    vector<Point> hull(2 * n);

    sort(pts.begin(), pts.end());

    // 1. 構造下凸包
    for (int i = 0; i < n; ++i) {
        while (k >= 2 && cross_product(hull[k - 2], hull[k - 1], pts[i]) <= 0) {
            k--;
        }
        hull[k++] = pts[i];
    }

    // 2. 構造上凸包
    for (int i = n - 2, t = k + 1; i >= 0; i--) {
        while (k >= t && cross_product(hull[k - 2], hull[k - 1], pts[i]) <= 0) {
            k--;
        }
        hull[k++] = pts[i];
    }

    hull.resize(k - 1); // 移除重複的起點
    return hull;
};`
  },
  {
    id: "xor-basis",
    title: "XOR 線性基 (XOR Basis)",
    category: "Data Structure",
    desc: "用於解決子集 XOR 異或最大值/最小值/第 K 小值的高效工具。線性基是一組數的集合，它們可以通過 XOR 運算組合出原數組所有子集所能 XOR 出的所有值，且大小最大僅為 64（對應 64 位整數）。",
    code: `#include <bits/stdc++.h>
using namespace std;

struct LinearBasis {
    vector<long long> basis;
    int max_bit;

    LinearBasis(int max_b = 62) : max_bit(max_b) {
        basis.assign(max_b + 1, 0);
    }

    // 插入一個數到線性基中。若成功插入回傳 true，代表該數與現有基線性無關
    bool insert(long long val) {
        for (int i = max_bit; i >= 0; i--) {
            if ((val >> i) & 1) {
                if (!basis[i]) {
                    basis[i] = val;
                    return true;
                }
                val ^= basis[i];
            }
        }
        return false;
    }

    // 查詢子集最大 XOR 和
    long long query_max() {
        long long ans = 0;
        for (int i = max_bit; i >= 0; i--) {
            if ((ans ^ basis[i]) > ans) {
                ans ^= basis[i];
            }
        }
        return ans;
    }

    // 查詢子集最小 XOR 和 (排除 0)
    long long query_min() {
        for (int i = 0; i <= max_bit; i++) {
            if (basis[i]) return basis[i];
        }
        return 0;
    }
};`
  },
  {
    id: "gaussian-elimination",
    title: "高斯消去法 (Gaussian Elimination)",
    category: "Basic",
    desc: "求解多元一次方程組的經典代數演算法。通過矩陣的初等行變換，在 $O(N^3)$ 時間內將係數矩陣化為簡化行階梯形矩陣，從而判定方程組是唯一解、無解還是無窮多解。此模板支援實數域運算。",
    code: `#include <bits/stdc++.h>
using namespace std;

const double EPS = 1e-9;

// 求解 N 元方程組，A 為 N x (N+1) 的增廣矩陣
// 回傳：0 代表無解，1 代表唯一解，2 代表有無限多個解
int gauss(vector<vector<double>>& a, vector<double>& ans) {
    int n = a.size();
    int m = a[0].size() - 1; // 變數數量
    
    int row = 0;
    for (int col = 0; col < m && row < n; ++col) {
        int pivot = row;
        for (int i = row + 1; i < n; ++i) {
            if (abs(a[i][col]) > abs(a[pivot][col])) {
                pivot = i;
            }
        }
        
        if (abs(a[pivot][col]) < EPS) continue;
        
        swap(a[pivot], a[row]);
        
        // 將 row 的首項係數變為 1
        for (int i = m; i >= col; --i) {
            a[row][i] /= a[row][col];
        }
        
        // 消去其它行的 col 列
        for (int i = 0; i < n; ++i) {
            if (i != row) {
                double factor = a[i][col];
                for (int j = col; j <= m; ++j) {
                    a[i][j] -= factor * a[row][j];
                }
            }
        }
        row++;
    }
    
    ans.assign(m, 0);
    for (int i = 0; i < row; ++i) {
        for (int j = 0; j < m; ++j) {
            if (abs(a[i][j] - 1.0) < EPS) {
                ans[j] = a[i][m];
                break;
            }
        }
    }
    
    // 檢查是否有 0 = 非零 的無解情況
    for (int i = row; i < n; ++i) {
        if (abs(a[i][m]) > EPS) return 0;
    }
    
    if (row < m) return 2; // 變數數大於獨立方程數，有無窮解
    return 1; // 唯一解
}`
  },
  {
    id: "tarjan-scc",
    title: "Tarjan 強連通分量 (SCC / 有向圖縮點)",
    category: "Graph Theory",
    desc: "在有向圖中，如果兩個節點能互相到達，說明它們強連通。Tarjan 演算法利用一次 DFS 遍歷以及棧，在 $O(V + E)$ 時間內找出所有強連通分量 (SCC)。常用於將有向圖「縮點」轉化為 DAG，以便進行動態規劃等後續分析。",
    code: `#include <bits/stdc++.h>
using namespace std;

struct Tarjan {
    int n;
    vector<vector<int>> adj;
    vector<int> dfn, low, scc;
    vector<bool> in_stack;
    stack<int> st;
    int timer, scc_cnt;
    vector<vector<int>> scc_nodes; // 儲存每個 SCC 內部的所有節點

    Tarjan(int n) : n(n), adj(n + 1), dfn(n + 1, 0), low(n + 1, 0), scc(n + 1, 0), in_stack(n + 1, false) {
        timer = scc_cnt = 0;
    }

    void add_edge(int u, int v) {
        adj[u].push_back(v);
    }

    void dfs(int u) {
        dfn[u] = low[u] = ++timer;
        st.push(u);
        in_stack[u] = true;

        for (int v : adj[u]) {
            if (!dfn[v]) {
                dfs(v);
                low[u] = min(low[u], low[v]);
            } else if (in_stack[v]) {
                low[u] = min(low[u], dfn[v]);
            }
        }

        // 找到一個 SCC 的根節點
        if (dfn[u] == low[u]) {
            scc_cnt++;
            vector<int> nodes;
            while (true) {
                int v = st.top();
                st.pop();
                in_stack[v] = false;
                scc[v] = scc_cnt;
                nodes.push_back(v);
                if (u == v) break;
            }
            scc_nodes.push_back(nodes);
        }
    }

    void solve() {
        for (int i = 1; i <= n; ++i) {
            if (!dfn[i]) dfs(i);
        }
    }
};`
  },
  {
    id: "segment-tree-basic",
    title: "基礎線段樹 (單點修改、區間查詢)",
    category: "Data Structure",
    desc: "最基本的線段樹實現。支援單點修改 (Point Update) 與區間求和/極值查詢 (Range Query)。由於沒有區間修改，因此不需要延遲標記 (Lazy Tag)，程式碼極為簡短且常數極小。時間複雜度為 $O(\\log N)$。",
    code: `#include <bits/stdc++.h>
using namespace std;

struct BasicSegTree {
    int n;
    vector<int> tree;

    BasicSegTree(int n) : n(n) {
        tree.assign(2 * n, 0);
    }

    // 單點修改：將位置 pos 的值修改為 val (0-indexed)
    void update(int pos, int val) {
        for (tree[pos += n] = val; pos > 1; pos >>= 1) {
            tree[pos >> 1] = tree[pos] + tree[pos ^ 1];
        }
    }

    // 區間求和查詢：計算 [l, r] 的區間和 (0-indexed, 閉區間)
    int query(int l, int r) {
        int res = 0;
        for (l += n, r += n + 1; l < r; l >>= 1, r >>= 1) {
            if (l & 1) res += tree[l++];
            if (r & 1) res += tree[--r];
        }
        return res;
    }
};`
  }
];

