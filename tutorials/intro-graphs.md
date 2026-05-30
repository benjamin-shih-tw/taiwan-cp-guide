# 圖論入門：概念與建圖 (Intro to Graphs)

> 本講義內容同步自 Notion「coding course」。

## Lecture

# Graph theory圖論
## 基礎介紹
圖，是由

<details>
<summary>**節點**</summary>

</details>

<details>
<summary>**邊**</summary>

</details>

<details>
<summary>**邊權**</summary>

</details>

所組成
## 怎麼存圖
一般來說分成三種做法
### 鄰接矩陣
那通常這個是最基礎的做法 也是在數據量大起來以後**最差的做法**
那方法為 假如我有 n 個點 那麼我就在有邊 u → v 的時候更新**鄰接表**的`第[u][v]項`為權重
### 實作方法： 
```c++
int n,m;
cin >> n >> m;
vector<vector<int>> matrix(n+1,vector<int>(n+1,0));

while(m--){
int u,v,w;
cin >> u >> v >> w;
matrix[u][v] = w;
}
```
那麼應該很明顯可以看到說這裡的空間複雜度是 $`O(n^2)`$ 所以才說是 **最差的做法**
### 應用： 
這種還是主要用在量級很小的情況下
還有 Floyd-Warshall algorithm 的算法當中
~~（可以說這東西就是為了此演算法而生的）~~
### 鄰接表
這是最常用的方法，其做法如下：
我們拿一個二維陣列來儲存每一個節點 i 的鄰居
**這邊可能有點稍難 但懂了以後就簡單了** 
常見的做法如下：
```c++
const int mxn = 2e5+10;
vector<int> g[mxn];
```
那麼 g\[i\] ⇒ 會是一個 `vector<int>` 存的是所有 i 的鄰居
![](https://prod-files-secure.s3.us-west-2.amazonaws.com/18192ab7-6d40-8113-8b36-0003bf3444bb/976d239b-bb40-4a12-8451-a9f30b3f11e8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TS2U4FIR%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T094852Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBEaCXVzLXdlc3QtMiJGMEQCIBsuzhycr64VTB0Qgg0zHdnZlDIhhmAFrcR9T18PULROAiAUiHzhRuJgsS459yLktUPDILvXHECarvpHRKzTeuqY8yqIBAja%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMF2uqztqCHXdxk2NqKtwDD1Oj5ZxILUWpWpPN%2FQymci9PZZQqVYg%2BexFsX44ba9LRfsXrS2n8hqYn1n%2F7aXsivhFTje%2FSrtfU6HHmMv3F5gRFzCvunFnJukVGnqMW2%2F2hQ7YmrEA3WwNMPg8hYcjrmxCLawxUJlMYN6hIzincwG7BdvgJRpmjdOymYM7yFeT3kMTrnZ0btLNhzQipv6VDgXhw79AWClFbXbJNUOWUCBKlteyW76Cnkd45YhJUNtt%2BTnfWweN1KOTywldMUomDfO%2BgXVHHLlxiYe8sbX4u5%2BHXP%2Br4K50bKDzIr7vnIiL9%2FCYLmCZ3VtLmvqsSV9C5Q8eAxYPVsf0sfwJySkpZMjVi0%2FUZFae2BlblcogTgn4qKuvtWesiTzftx7rIBp%2F5vsuCddFZo8FEuVXN0An7Nt7HLNGdQLGStXk%2FPuK7ZiEkEQB%2FUW8%2Bsyz9lUecfNf0x%2BGaMqg08fKWvE8u7B%2FJ7Ph%2B9rH60dJzIqSyvLYRdWCdRowd1IlSuWidskw%2BDh3A2wbtsz2hHMgTfCDaX7hmHr94nDNk%2BadcLwbeCR3aHBHveOeWYdLwzCmeYMMCWqZp9Xcx%2B2WHpX29UHpmFi8iOXhvWTKdneHUX2BAkm5dl8bv8MDH7L8Lpyn3QMEwxtLq0AY6pgHYdsnawFwCdigzp6qJ%2F%2BCUvYV17KvhDZtUtA6ZTqHmIXev40NcGeJXtxrwyslcRT1ooyARinAdN6JONFJFe%2BbtfLRsRnM2Iy6XtaFPIXN0ConqImRmSnZ7dJITSeA7DpoGz6OGBuVmES9rNhBK54exgl8xZt7KqbYDvwRF87IeYPgHnSKSXIOU%2FXvKXzOcBqcDQ7mspEDG5sk9HEgZuHos3PB3BX7x&X-Amz-Signature=aa835b5d19b47b5f0838f630c97c46656bd079d114b8c89636f608b9e7783e0e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)
```javascript
假設我要存底下那張圖
input:
1 2
2 3
3 4 
4 2
5 2

```
![](https://prod-files-secure.s3.us-west-2.amazonaws.com/18192ab7-6d40-8113-8b36-0003bf3444bb/2710ebb1-d70f-46d4-ba1c-c227b2d61f23/Screenshot_2026-04-18_at_2.52.01_PM.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TS2U4FIR%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T094852Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBEaCXVzLXdlc3QtMiJGMEQCIBsuzhycr64VTB0Qgg0zHdnZlDIhhmAFrcR9T18PULROAiAUiHzhRuJgsS459yLktUPDILvXHECarvpHRKzTeuqY8yqIBAja%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMF2uqztqCHXdxk2NqKtwDD1Oj5ZxILUWpWpPN%2FQymci9PZZQqVYg%2BexFsX44ba9LRfsXrS2n8hqYn1n%2F7aXsivhFTje%2FSrtfU6HHmMv3F5gRFzCvunFnJukVGnqMW2%2F2hQ7YmrEA3WwNMPg8hYcjrmxCLawxUJlMYN6hIzincwG7BdvgJRpmjdOymYM7yFeT3kMTrnZ0btLNhzQipv6VDgXhw79AWClFbXbJNUOWUCBKlteyW76Cnkd45YhJUNtt%2BTnfWweN1KOTywldMUomDfO%2BgXVHHLlxiYe8sbX4u5%2BHXP%2Br4K50bKDzIr7vnIiL9%2FCYLmCZ3VtLmvqsSV9C5Q8eAxYPVsf0sfwJySkpZMjVi0%2FUZFae2BlblcogTgn4qKuvtWesiTzftx7rIBp%2F5vsuCddFZo8FEuVXN0An7Nt7HLNGdQLGStXk%2FPuK7ZiEkEQB%2FUW8%2Bsyz9lUecfNf0x%2BGaMqg08fKWvE8u7B%2FJ7Ph%2B9rH60dJzIqSyvLYRdWCdRowd1IlSuWidskw%2BDh3A2wbtsz2hHMgTfCDaX7hmHr94nDNk%2BadcLwbeCR3aHBHveOeWYdLwzCmeYMMCWqZp9Xcx%2B2WHpX29UHpmFi8iOXhvWTKdneHUX2BAkm5dl8bv8MDH7L8Lpyn3QMEwxtLq0AY6pgHYdsnawFwCdigzp6qJ%2F%2BCUvYV17KvhDZtUtA6ZTqHmIXev40NcGeJXtxrwyslcRT1ooyARinAdN6JONFJFe%2BbtfLRsRnM2Iy6XtaFPIXN0ConqImRmSnZ7dJITSeA7DpoGz6OGBuVmES9rNhBK54exgl8xZt7KqbYDvwRF87IeYPgHnSKSXIOU%2FXvKXzOcBqcDQ7mspEDG5sk9HEgZuHos3PB3BX7x&X-Amz-Signature=755c41b1a66d83d43df97ec47b6f876dca9b84dc43ea8567982637b749178c03&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)
```c++
m條邊
while(m--){
int u,v;
cin >> u >> v;
g[u].push_back(v);
g[v].push_back(u);
}
```

帶邊權呢？
```javascript
假設我要存底下那張圖
input:
1 2 4 (1 -> 2 weight = 4) 
2 3 3 
3 4 6 
4 2 1
5 2 8
```
![](https://prod-files-secure.s3.us-west-2.amazonaws.com/18192ab7-6d40-8113-8b36-0003bf3444bb/27698168-665d-4607-9cfb-98c620c5ad0d/Screenshot_2026-04-18_at_2.53.31_PM.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TS2U4FIR%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T094852Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBEaCXVzLXdlc3QtMiJGMEQCIBsuzhycr64VTB0Qgg0zHdnZlDIhhmAFrcR9T18PULROAiAUiHzhRuJgsS459yLktUPDILvXHECarvpHRKzTeuqY8yqIBAja%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMF2uqztqCHXdxk2NqKtwDD1Oj5ZxILUWpWpPN%2FQymci9PZZQqVYg%2BexFsX44ba9LRfsXrS2n8hqYn1n%2F7aXsivhFTje%2FSrtfU6HHmMv3F5gRFzCvunFnJukVGnqMW2%2F2hQ7YmrEA3WwNMPg8hYcjrmxCLawxUJlMYN6hIzincwG7BdvgJRpmjdOymYM7yFeT3kMTrnZ0btLNhzQipv6VDgXhw79AWClFbXbJNUOWUCBKlteyW76Cnkd45YhJUNtt%2BTnfWweN1KOTywldMUomDfO%2BgXVHHLlxiYe8sbX4u5%2BHXP%2Br4K50bKDzIr7vnIiL9%2FCYLmCZ3VtLmvqsSV9C5Q8eAxYPVsf0sfwJySkpZMjVi0%2FUZFae2BlblcogTgn4qKuvtWesiTzftx7rIBp%2F5vsuCddFZo8FEuVXN0An7Nt7HLNGdQLGStXk%2FPuK7ZiEkEQB%2FUW8%2Bsyz9lUecfNf0x%2BGaMqg08fKWvE8u7B%2FJ7Ph%2B9rH60dJzIqSyvLYRdWCdRowd1IlSuWidskw%2BDh3A2wbtsz2hHMgTfCDaX7hmHr94nDNk%2BadcLwbeCR3aHBHveOeWYdLwzCmeYMMCWqZp9Xcx%2B2WHpX29UHpmFi8iOXhvWTKdneHUX2BAkm5dl8bv8MDH7L8Lpyn3QMEwxtLq0AY6pgHYdsnawFwCdigzp6qJ%2F%2BCUvYV17KvhDZtUtA6ZTqHmIXev40NcGeJXtxrwyslcRT1ooyARinAdN6JONFJFe%2BbtfLRsRnM2Iy6XtaFPIXN0ConqImRmSnZ7dJITSeA7DpoGz6OGBuVmES9rNhBK54exgl8xZt7KqbYDvwRF87IeYPgHnSKSXIOU%2FXvKXzOcBqcDQ7mspEDG5sk9HEgZuHos3PB3BX7x&X-Amz-Signature=5d9a9f0c159e537afde472c68ed377b46689546ccb9f9bfb2415d6ac51c02961&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)
```c++
m條邊
要同時改存圖方法
pair => {鄰居,邊權}
while(m--){
int u,v,w;
cin >> u >> v >> w;
g[u].push_back({v,w});
g[v].push_back({u,w});
}
```
### 邊集數組

## 圖的種類

## DFS,BFS
![](https://prod-files-secure.s3.us-west-2.amazonaws.com/18192ab7-6d40-8113-8b36-0003bf3444bb/9ec5fcf3-9cd1-49c0-989a-f6b89f5c46ed/1_GT9oSo0agIeIj6nTg3jFEA.gif?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TS2U4FIR%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T094852Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBEaCXVzLXdlc3QtMiJGMEQCIBsuzhycr64VTB0Qgg0zHdnZlDIhhmAFrcR9T18PULROAiAUiHzhRuJgsS459yLktUPDILvXHECarvpHRKzTeuqY8yqIBAja%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMF2uqztqCHXdxk2NqKtwDD1Oj5ZxILUWpWpPN%2FQymci9PZZQqVYg%2BexFsX44ba9LRfsXrS2n8hqYn1n%2F7aXsivhFTje%2FSrtfU6HHmMv3F5gRFzCvunFnJukVGnqMW2%2F2hQ7YmrEA3WwNMPg8hYcjrmxCLawxUJlMYN6hIzincwG7BdvgJRpmjdOymYM7yFeT3kMTrnZ0btLNhzQipv6VDgXhw79AWClFbXbJNUOWUCBKlteyW76Cnkd45YhJUNtt%2BTnfWweN1KOTywldMUomDfO%2BgXVHHLlxiYe8sbX4u5%2BHXP%2Br4K50bKDzIr7vnIiL9%2FCYLmCZ3VtLmvqsSV9C5Q8eAxYPVsf0sfwJySkpZMjVi0%2FUZFae2BlblcogTgn4qKuvtWesiTzftx7rIBp%2F5vsuCddFZo8FEuVXN0An7Nt7HLNGdQLGStXk%2FPuK7ZiEkEQB%2FUW8%2Bsyz9lUecfNf0x%2BGaMqg08fKWvE8u7B%2FJ7Ph%2B9rH60dJzIqSyvLYRdWCdRowd1IlSuWidskw%2BDh3A2wbtsz2hHMgTfCDaX7hmHr94nDNk%2BadcLwbeCR3aHBHveOeWYdLwzCmeYMMCWqZp9Xcx%2B2WHpX29UHpmFi8iOXhvWTKdneHUX2BAkm5dl8bv8MDH7L8Lpyn3QMEwxtLq0AY6pgHYdsnawFwCdigzp6qJ%2F%2BCUvYV17KvhDZtUtA6ZTqHmIXev40NcGeJXtxrwyslcRT1ooyARinAdN6JONFJFe%2BbtfLRsRnM2Iy6XtaFPIXN0ConqImRmSnZ7dJITSeA7DpoGz6OGBuVmES9rNhBK54exgl8xZt7KqbYDvwRF87IeYPgHnSKSXIOU%2FXvKXzOcBqcDQ7mspEDG5sk9HEgZuHos3PB3BX7x&X-Amz-Signature=4270aaf4815a1c49f81b7703cfcfbe38f7c372d773f260c1314605a984b98592&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)
在了解完幾種常用的圖論知識之後，接下來要介紹後面最常用到的兩個好用的圖上**搜尋法：**
1. **深度優先搜尋 DFS 上左圖**
那可以看到說其實 DFS 很明顯就是 ***先走到最深的點之後再回頭 ***不斷重複
故稱為 **深**度優先搜尋 
那它的用途是 ⇒ 當你有走遍一棵**樹**時最常用 因為 樹不會有環 所以你一定可以走到一個最深的點 因此使用 DFS 就一定可以走遍所有節點
那通常都是使用遞迴的方式去處理 DFS 寫成 code 大概長這樣：

<details>
<summary>**code**</summary>

```c++
void dfs(int now){
for(auto nxt : g[now]){
dfs(nxt,now);
}
}
```
沒錯 就是如此之短，那麼實際上每一行在做什麼呢？
```c++
void dfs(int now){
這裡當然就是定義一個 void 函式代表不會有回傳值
然後取名為 "dfs" 並且讀入一個 now 變數 也就是起始的該節點
```
```c++
for(auto nxt : g[now]){
這裡的用途是枚舉他的所有鄰居 並且自動取名為 nxt
```
為什麼可以像上面這樣寫請參見
- **<mention-page url="https://www.notion.so/33192ab76d40807ba369cbf4e7149c54">怎麼存圖</mention-page>**** **
- **<mention-page url="https://www.notion.so/2f192ab76d4080c9be6ed280acd4c862"/>**
```c++
dfs(nxt,now);
這邊就是遞迴下去繼續跑他的子節點 並且重複一樣的動作
```

</details>

那麼他到底可以做到什麼？以下舉兩個小例子
1. **深度**

2. **子樹大小**
> 例題：[CSES - Subordinates](https://cses.fi/problemset/task/1674/)
> 他給你各個節點間的關係，叫你算每個節點下的子樹大小為多大
> <details>
> <summary>Input:</summary>
> ```plain text
> 5
> 1 1 2 3
> ```
> </details>
> <details>
> <summary>Output:</summary>
> ```plain text
> 4 1 1 0 0
> ```
> </details>

那其實只要在 DFS 上面動一點手腳就可以了：
我在每一次 `dfs(nxt,now)` 後面加上 `sz[now] += sz[nxt] `就可以了（sz\[i\] ⇒ i 的子樹大小）

<details>
<summary>**code**</summary>

```c++
#include <bits/stdc++.h>
using namespace std;
const int mxn = 2e5+10;
vector<int> g[mxn];
int sz[mxn];
 
void dfs(int now,int par){
    sz[now] = 1;
    for(auto nxt : g[now]){
        if(nxt == par) continue;
        dfs(nxt,now);
        sz[now] += sz[nxt];
    }
    return;
}
int main(){
    ios::sync_with_stdio(0); cin.tie(0);
    
    int n;
    cin >> n;
    for(int i = 2 ; i <= n ; i++){
        int u;
        cin >> u;
        g[u].push_back(i);
        g[i].push_back(u);
    }
    dfs(1,0);
    for(int i = 1;  i <= n ;i++){
        cout << sz[i]-1 << " ";
    }
}

```

</details>

<details>
<summary>**複雜度 **</summary>

$`O(n)`$

</details>

<details>
<summary>**result**</summary>

![](https://prod-files-secure.s3.us-west-2.amazonaws.com/18192ab7-6d40-8113-8b36-0003bf3444bb/1da4d04b-f99d-41c4-b1e7-1d7e4fa3b329/Screenshot_2026-03-28_at_10.45.22_AM.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TS2U4FIR%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T094852Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBEaCXVzLXdlc3QtMiJGMEQCIBsuzhycr64VTB0Qgg0zHdnZlDIhhmAFrcR9T18PULROAiAUiHzhRuJgsS459yLktUPDILvXHECarvpHRKzTeuqY8yqIBAja%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMF2uqztqCHXdxk2NqKtwDD1Oj5ZxILUWpWpPN%2FQymci9PZZQqVYg%2BexFsX44ba9LRfsXrS2n8hqYn1n%2F7aXsivhFTje%2FSrtfU6HHmMv3F5gRFzCvunFnJukVGnqMW2%2F2hQ7YmrEA3WwNMPg8hYcjrmxCLawxUJlMYN6hIzincwG7BdvgJRpmjdOymYM7yFeT3kMTrnZ0btLNhzQipv6VDgXhw79AWClFbXbJNUOWUCBKlteyW76Cnkd45YhJUNtt%2BTnfWweN1KOTywldMUomDfO%2BgXVHHLlxiYe8sbX4u5%2BHXP%2Br4K50bKDzIr7vnIiL9%2FCYLmCZ3VtLmvqsSV9C5Q8eAxYPVsf0sfwJySkpZMjVi0%2FUZFae2BlblcogTgn4qKuvtWesiTzftx7rIBp%2F5vsuCddFZo8FEuVXN0An7Nt7HLNGdQLGStXk%2FPuK7ZiEkEQB%2FUW8%2Bsyz9lUecfNf0x%2BGaMqg08fKWvE8u7B%2FJ7Ph%2B9rH60dJzIqSyvLYRdWCdRowd1IlSuWidskw%2BDh3A2wbtsz2hHMgTfCDaX7hmHr94nDNk%2BadcLwbeCR3aHBHveOeWYdLwzCmeYMMCWqZp9Xcx%2B2WHpX29UHpmFi8iOXhvWTKdneHUX2BAkm5dl8bv8MDH7L8Lpyn3QMEwxtLq0AY6pgHYdsnawFwCdigzp6qJ%2F%2BCUvYV17KvhDZtUtA6ZTqHmIXev40NcGeJXtxrwyslcRT1ooyARinAdN6JONFJFe%2BbtfLRsRnM2Iy6XtaFPIXN0ConqImRmSnZ7dJITSeA7DpoGz6OGBuVmES9rNhBK54exgl8xZt7KqbYDvwRF87IeYPgHnSKSXIOU%2FXvKXzOcBqcDQ7mspEDG5sk9HEgZuHos3PB3BX7x&X-Amz-Signature=8dd0c17bc54a8330e87d8d51104698b2044434248a927bdf18227a5ed2958e57&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

</details>

2. **廣度優先搜尋 BFS ****上右圖**
可以看到他和 DFS 差在於說它的目標在**廣度****，**會先把所有距離為 1 的子節點全部遍列完後再往下一層，而實作方面比較麻煩 可能要先看看示意圖：
![](https://prod-files-secure.s3.us-west-2.amazonaws.com/18192ab7-6d40-8113-8b36-0003bf3444bb/c329f842-1fd3-4fd8-b679-6e2db854b4a1/Breadth-First-Tree-Traversal.gif?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TS2U4FIR%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T094852Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBEaCXVzLXdlc3QtMiJGMEQCIBsuzhycr64VTB0Qgg0zHdnZlDIhhmAFrcR9T18PULROAiAUiHzhRuJgsS459yLktUPDILvXHECarvpHRKzTeuqY8yqIBAja%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMF2uqztqCHXdxk2NqKtwDD1Oj5ZxILUWpWpPN%2FQymci9PZZQqVYg%2BexFsX44ba9LRfsXrS2n8hqYn1n%2F7aXsivhFTje%2FSrtfU6HHmMv3F5gRFzCvunFnJukVGnqMW2%2F2hQ7YmrEA3WwNMPg8hYcjrmxCLawxUJlMYN6hIzincwG7BdvgJRpmjdOymYM7yFeT3kMTrnZ0btLNhzQipv6VDgXhw79AWClFbXbJNUOWUCBKlteyW76Cnkd45YhJUNtt%2BTnfWweN1KOTywldMUomDfO%2BgXVHHLlxiYe8sbX4u5%2BHXP%2Br4K50bKDzIr7vnIiL9%2FCYLmCZ3VtLmvqsSV9C5Q8eAxYPVsf0sfwJySkpZMjVi0%2FUZFae2BlblcogTgn4qKuvtWesiTzftx7rIBp%2F5vsuCddFZo8FEuVXN0An7Nt7HLNGdQLGStXk%2FPuK7ZiEkEQB%2FUW8%2Bsyz9lUecfNf0x%2BGaMqg08fKWvE8u7B%2FJ7Ph%2B9rH60dJzIqSyvLYRdWCdRowd1IlSuWidskw%2BDh3A2wbtsz2hHMgTfCDaX7hmHr94nDNk%2BadcLwbeCR3aHBHveOeWYdLwzCmeYMMCWqZp9Xcx%2B2WHpX29UHpmFi8iOXhvWTKdneHUX2BAkm5dl8bv8MDH7L8Lpyn3QMEwxtLq0AY6pgHYdsnawFwCdigzp6qJ%2F%2BCUvYV17KvhDZtUtA6ZTqHmIXev40NcGeJXtxrwyslcRT1ooyARinAdN6JONFJFe%2BbtfLRsRnM2Iy6XtaFPIXN0ConqImRmSnZ7dJITSeA7DpoGz6OGBuVmES9rNhBK54exgl8xZt7KqbYDvwRF87IeYPgHnSKSXIOU%2FXvKXzOcBqcDQ7mspEDG5sk9HEgZuHos3PB3BX7x&X-Amz-Signature=ee1c0ea944af4183f040d2c1a87e5ad7e62697c013db34313e933b3842d15edd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)
我們開一個 queue 來記錄我們要走的下一個節點是誰，只要 queue 還沒空掉，我們就把最前面的拔出來，並且遍列 ***拿出來的那個節點 ***的鄰居 有點抽象，所以直接看code

<details>
<summary>code</summary>

```c++
1 void bfs(int start){
2     queue<int> q;
3     q.push(start);
4     while(q.size()){
5         auto now = q.front(); q.pop();
6         for(auto nxt : g[now]){
7             q.push(nxt);
8         }
9     }
10 }
```
1. 那麼 start 就是你要開始的那個節點
2. 這邊開一個 queue 用來記錄節點
3. 那我們當然要先把初始節點丟到queue裡面
4. 接下來這行代表只要 queue 裡面還有東西的話
5. 這邊把 q 最前面的值取出來 並且直接 pop 掉
6. 這邊和 dfs的那邊一樣
7. 那 dfs 是直接遞迴 這邊改成把下一個要搞的節點 丟進來 q 裡面 就不用管遞迴了

</details>

## Lecture
