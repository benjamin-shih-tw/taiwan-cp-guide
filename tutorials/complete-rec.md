# 遞迴完全搜索與排列組合生成

<h4>1. 什麼是遞迴與完全搜索？（Exploring all possibilities）</h4>
          <p>在演算法中，<strong>遞迴（Recursion）</strong> 是一種透過「自己呼叫自己」來解決問題的技巧。它將一個巨大的問題，拆解成結構完全相同、但規模較小的子問題。當子問題小到最簡單的邊界情況（Base Case）時，就直接回傳答案並逐層返回。</p>
          <p>而<strong>完全搜索（Complete Search）</strong>，又稱為暴力窮舉或回溯法（Backtracking）。它的核心思想是：<strong>「像走迷宮一樣，窮舉所有可能的情況，找到符合條件的答案。」</strong> 當我們走到死胡同（不符合題目限制）時，就退回上一步（Backtrack），換另一條路繼續探索。這也是為什麼這種技巧通常與遞迴形影不離。</p>

          <h4>2. 生活化比喻：披薩配料與排隊問題</h4>
          <ul>
            <li>
              <strong>子集生成（Subsets）— 披薩配料選擇</strong>
              <p>想像你要點一份客製化披薩，有 $N$ 種配料（起司、火腿、鳳梨等）。對於每種配料，你只有兩種選擇：<strong>要（$1$）</strong> 或 <strong>不要（$0$）</strong>。若有 $3$ 種配料，總共有 $2^3 = 8$ 種不同的披薩組合。這就是 $O(2^N)$ 的子集生成問題！</p>
            </li>
            <li>
              <strong>排列生成（Permutations）— 拍大合照排座位</strong>
              <p>想像有 $N$ 個人要排成一列拍大合照。第 $1$ 個位置有 $N$ 種人選；第 $2$ 個位置有 $N-1$ 種人選...直到最後一個位置只剩 $1$ 個人選。總共有 $N 	imes (N-1) 	imes dots 	imes 1 = N!$ 種排法。這就是 $O(N!)$ 的排列生成問題！</p>
            </li>
          </ul>

          <h4>3. 經典 C++ 代碼模板</h4>
          <ul>
            <li>
              <strong>模板一：遞迴生成所有子集（Subset Generation） — $O(2^N)$</strong>
              <p>此模板展示如何透過遞迴，對陣列中的每個元素做出「選」與「不選」的二分決策，並生成所有可能的子集合：</p>
              <pre><code>#include &lt;iostream&gt;
#include &lt;vector&gt;
using namespace std;

int N;
vector&lt;int&gt; chosen; // 記錄當前子集

// index 代表當前考慮到第幾個元素 (0 ~ N-1)
void getSubsets(int index) {
    if (index == N) {
        // 邊界條件：已經對所有元素都做完決定了，印出當前子集
        cout &lt;&lt; "{ ";
        for (int x : chosen) cout &lt;&lt; x &lt;&lt; " ";
        cout &lt;&lt; "}\n";
        return;
    }
    
    // 決策 1：不選當前元素，直接看下一個
    getSubsets(index + 1);
    
    // 決策 2：選當前元素，加入 chosen 後看下一個，最後要「復原狀態」
    chosen.push_back(index + 1); // 假設元素為 1 ~ N
    getSubsets(index + 1);
    chosen.pop_back();           // 回溯：移出元素，還原現場
}</code></pre>
            </li>
            <li>
              <strong>模板二：遞迴生成全排列（Permutations） — $O(N!)$</strong>
              <p>此模板展示如何使用一個 <code>used</code> 布林陣列，記錄哪些元素已經被放入排好的佇列中，遞迴填滿每一個空位：</p>
              <pre><code>#include &lt;iostream&gt;
#include &lt;vector&gt;
using namespace std;

int N;
vector&lt;int&gt; current_permutation;
vector&lt;bool&gt; used; // 記錄元素是否已被使用

void getPermutations() {
    if (current_permutation.size() == N) {
        // 邊界條件：已經填滿 N 個位置，輸出排列
        for (int x : current_permutation) cout &lt;&lt; x &lt;&lt; " ";
        cout &lt;&lt; "\n";
        return;
    }
    
    for (int i = 1; i &lt;= N; i++) {
        if (!used[i]) {
            // 嘗試將 i 放入當前位置
            used[i] = true;
            current_permutation.push_back(i);
            
            getPermutations(); // 遞迴填寫下一個位置
            
            // 回溯：移出 i，重設為未使用，以供其他分支使用
            current_permutation.pop_back();
            used[i] = false;
        }
    }
}</code></pre>
            </li>
          </ul>

          <blockquote>
            <p><strong>💡 遞迴與完全搜索的「黃金剪枝法則」（Pruning）：</strong><br>
            當我們在遞迴過程中，發現當前狀態**已經絕對不可能**達到合法解（例如當前累加的和已經大於題目要求的最大值），我們應該立刻 <code>return</code>，不再往深處搜。這就叫做「剪枝」。優質的剪枝能讓你的程式在實戰中免於 TLE，是把暴力窮舉昇華成滿分演算法的靈魂所在！</p>
          </blockquote>