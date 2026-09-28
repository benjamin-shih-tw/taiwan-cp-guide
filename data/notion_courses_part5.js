window.NOTION_COURSES = window.NOTION_COURSES || [];
window.NOTION_COURSES.push(...[
  {
    "id": "37e92ab76d4080458956cccda1cb88b5",
    "title": "00-12 Time Complexity",
    "details": "",
    "difficulty": 1,
    "domain": "00 Fundamentals",
    "content": "",
    "notionUrl": "https://app.notion.com/p/37e92ab76d4080458956cccda1cb88b5"
  },
  {
    "id": "3e892ab76d40812aa397cb8b7dc9cb85",
    "title": "01-01 Simulation with Arrays & Strings",
    "details": "Coming soon",
    "difficulty": null,
    "domain": "01 Complete Search & Simulation",
    "content": "",
    "notionUrl": "https://app.notion.com/p/3e892ab76d40812aa397cb8b7dc9cb85"
  },
  {
    "id": "3e892ab76d4081e9aacdce6b86ed8be8",
    "title": "01-04 Casework / Ad Hoc",
    "details": "",
    "difficulty": null,
    "domain": "01 Complete Search & Simulation",
    "content": "",
    "notionUrl": "https://app.notion.com/p/3e892ab76d4081e9aacdce6b86ed8be8"
  },
  {
    "id": "3e892ab76d40816dbdc7f9cd010bfc59",
    "title": "01-05 Meet-in-the-Middle",
    "details": "Coming soon",
    "difficulty": null,
    "domain": "01 Complete Search & Simulation",
    "content": "",
    "notionUrl": "https://app.notion.com/p/3e892ab76d40816dbdc7f9cd010bfc59"
  },
  {
    "id": "33092ab76d4080e79badf5a1f860fc8c",
    "title": "04-01 Prefix Sums & Difference Arrays",
    "details": "差分 + 前綴",
    "difficulty": 3,
    "domain": "04 Prefix Sums",
    "notionUrl": "https://app.notion.com/p/33092ab76d4080e79badf5a1f860fc8c",
    "content": "## prefix sum 前綴和\nkind of data structure ? 反正運作原理如下圖：\n![](https://prod-files-secure.s3.us-west-2.amazonaws.com/18192ab7-6d40-8113-8b36-0003bf3444bb/ca47a9cd-602b-4865-9510-d7489bdc240a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46626HTXBTL%2F20260927%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260927T150616Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFUaCXVzLXdlc3QtMiJHMEUCIQC7Td5gKKQeH%2BbUITBtZ%2FjV4xXg0lbmKiQz8SlueyK9GwIgHYa7C1uepEMnXvS2GsS5qRSewZHtWgQ%2BrbCjPxpC5poq%2FwMIHhAAGgw2Mzc0MjMxODM4MDUiDJ7q4XCtv%2FdjmpkLdircAw2JT6UpCnomXJVLZAJgJNcTTGs8asycrKgznKcRicv2V5AhOw%2FLzTlFW4FIzGXkkfYfPj%2BHCvRa88NytNoZ%2BQ5gIwSDVa2tMHdmxntyvU7UkdxrmJ5SwaEmqGSmli%2ByOq%2BYZ6HfOprZBpCKj7ARdZMSZQ7YyijUBLFhxtlvGQMDamWrC5A2vY7ht4NapzuzMN0lzur%2BHZWIczVxZm%2FYSGLVzYmEMY4O1oC0K90%2Bd6jHYUZxxiKOc0SCQABO%2BEfzDKqpSRHcaLEkXVuYMNAIxJobGyb%2FBdtGl8dGvLvFY3%2BH16DLlt3sh%2BRpTfLSXnf54zB6sy5H7HSPmD8e7jaW7D5q%2Fxd8GCHrniEvAvWi4vT%2BdO6uQ3yvNIGeUSbvNle1%2FtH5aTRdP4yB4rz7mH3vY8TS5JhCSuMvjUjSeoZoOiDyZC3dwQmHY%2FiTmniHgDOiojb9oKktC1ahKtbHtrO%2BU%2B8cZv95oXySm94vbuEsxVij%2F6YAM4MYoD5YL09zVCoqbeNnsa6OX04j9UVkFyHyoE8UFj4pCVOcmjN9S75sAg51EuBqgoQWRSYo7nOEDpaO265c7IHbv1aLA91JV0mkNAUzgFnVktslUEDkX6KDgzSZYe5GbJVLiL%2FxJ1syMImn5NUGOqUBLWRLv%2BirJmte%2BMYyAr7%2BraqOPqIoUFUgFEWcb2FWDuSsHxNr8AUfHUyCrMiL9LZqPRVvM33VU9zSB6FxUp%2BPnCBwSbi3WqJPHaAQpcy9LxTMTduH3eW8lRmiHIvkaMDkVR3hNRhHFDIpdYbu%2BfusHgrGxEO8OaYaXInidALJW54AK4uOoxfqDXZvkKTIv07VaAgCgZpEmcJPSc5m9se2ZrZS2u2X&X-Amz-Signature=01d7f31ae2183f6efb3c1cb942717bf976ddf03a678f3ea75f9dea5d7461e705&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)\n<details>\n<summary>怎麼寫 寫寫看</summary>\n\t```c++\n    int n;\n    cin >> n;\n    vector<int> v(n);\n    for(int i = 1 ; i <= n ; i++) cin >> v[i];\n    vector<int> pref(n+1);\n    pref[0] = 0;\n    for(int i = 1 ; i <= n ; i++)\n        pref[i] = pref[i-1] + v[i];\n\n\t```\n</details>\n### 可以幹嘛？\n<callout icon=\"👉\" color=\"yellow\">\n\t**例題**:[CSES - Static Range Sum Queries](https://cses.fi/problemset/task/1646)\n\t給定一個 n 還有 q ( n 暴力解會炸的那種範圍）\n\t接下來有 n 個數字 q 筆詢問\n\t請輸出每筆詢問當中 `v[l] ~ v[r]` 的總和\n\t<details>\n\t<summary>範測：</summary>\n\t\tInput:\n\t\t```plain text\n8 4\n3 2 4 5 1 1 5 3\n2 4\n5 6\n1 8\n3 3\n\t\t```\n\t\tOutput:\n\t\t```plain text\n11\n2\n24\n4\n\t\t```\n\t</details>\n</callout>\n如果用一般的寫法會怎麼寫？\n1. **暴力解**\n就每一次 q 都跑一個 `for(int i = l ; i ≤ r ; i++)`去加總sum\n<details>\n<summary>code</summary>\n\t```c++\n#include <bits/stdc++.h>\nusing namespace std;\nint main()\n{\n    long long n, q;\n    cin >> n >> q;\n    vector<long long> v(n, 0);\n    for (long long i = 0; i < n; i++)\n        cin >> v[i];\n    vector<pair<long long, long long>> p(q);\n    for (long long i = 0; i < q; i++)\n    {\n        cin >> p[i].first;\n        cin >> p[i].second;\n    }\n    long long in = 0;\n    for (long long i = 0; i < q; i++)\n    {\n        long long count = 0;\n        for (long long i = p[in].first; i <= p[in].second; i++)\n            count += v[i - 1];\n        cout << count << endl;\n        in++;\n    }\n}\n\t```\n</details>\n<details>\n<summary>複雜度：</summary>\n\t$`O(nq)`$ 一定炸\n\t<empty-block/>\n</details>\n<details>\n<summary>result</summary>\n\t必須炸開\n\t![](https://prod-files-secure.s3.us-west-2.amazonaws.com/18192ab7-6d40-8113-8b36-0003bf3444bb/948ad64c-3399-436d-86e9-f1657665a454/Screenshot_2026-03-27_at_1.40.56_PM.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46626HTXBTL%2F20260927%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260927T150616Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFUaCXVzLXdlc3QtMiJHMEUCIQC7Td5gKKQeH%2BbUITBtZ%2FjV4xXg0lbmKiQz8SlueyK9GwIgHYa7C1uepEMnXvS2GsS5qRSewZHtWgQ%2BrbCjPxpC5poq%2FwMIHhAAGgw2Mzc0MjMxODM4MDUiDJ7q4XCtv%2FdjmpkLdircAw2JT6UpCnomXJVLZAJgJNcTTGs8asycrKgznKcRicv2V5AhOw%2FLzTlFW4FIzGXkkfYfPj%2BHCvRa88NytNoZ%2BQ5gIwSDVa2tMHdmxntyvU7UkdxrmJ5SwaEmqGSmli%2ByOq%2BYZ6HfOprZBpCKj7ARdZMSZQ7YyijUBLFhxtlvGQMDamWrC5A2vY7ht4NapzuzMN0lzur%2BHZWIczVxZm%2FYSGLVzYmEMY4O1oC0K90%2Bd6jHYUZxxiKOc0SCQABO%2BEfzDKqpSRHcaLEkXVuYMNAIxJobGyb%2FBdtGl8dGvLvFY3%2BH16DLlt3sh%2BRpTfLSXnf54zB6sy5H7HSPmD8e7jaW7D5q%2Fxd8GCHrniEvAvWi4vT%2BdO6uQ3yvNIGeUSbvNle1%2FtH5aTRdP4yB4rz7mH3vY8TS5JhCSuMvjUjSeoZoOiDyZC3dwQmHY%2FiTmniHgDOiojb9oKktC1ahKtbHtrO%2BU%2B8cZv95oXySm94vbuEsxVij%2F6YAM4MYoD5YL09zVCoqbeNnsa6OX04j9UVkFyHyoE8UFj4pCVOcmjN9S75sAg51EuBqgoQWRSYo7nOEDpaO265c7IHbv1aLA91JV0mkNAUzgFnVktslUEDkX6KDgzSZYe5GbJVLiL%2FxJ1syMImn5NUGOqUBLWRLv%2BirJmte%2BMYyAr7%2BraqOPqIoUFUgFEWcb2FWDuSsHxNr8AUfHUyCrMiL9LZqPRVvM33VU9zSB6FxUp%2BPnCBwSbi3WqJPHaAQpcy9LxTMTduH3eW8lRmiHIvkaMDkVR3hNRhHFDIpdYbu%2BfusHgrGxEO8OaYaXInidALJW54AK4uOoxfqDXZvkKTIv07VaAgCgZpEmcJPSc5m9se2ZrZS2u2X&X-Amz-Signature=69e15c357fd162e2136729d6f5cd92dea044f026badc261ba2c5a6dfe74103e9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)\n\t<empty-block/>\n</details>\n<empty-block/>\n1. **前綴和解**\n先預處理前綴和陣列，每一次去查詢 `pref[r] - pref[l-1]` 之類的\n<details>\n<summary>code</summary>\n\t不考慮自己寫嗎…？\n\t```c++\n#include <bits/stdc++.h>\nusing namespace std;\nint main()\n{\n    long long n, q;\n    cin >> n >> q;\n    vector<long long> v(n + 1, 0);\n \n    for (long long i = 1; i <= n; i++)\n        cin >> v[i];\n \n    vector<long long> p(n + 1, 0);\n \n    for (long long i = 1; i <= n; i++)\n        p[i] = p[i - 1] + v[i];\n \n    while (q--)\n    {\n        long long a, b;\n        cin >> a >> b;\n        cout << p[b] - p[a - 1] << endl;\n    }\n}\n\t```\n</details>\n<details>\n<summary>複雜度：</summary>\n\t$`O(n)`$ 不會炸\n\t<empty-block/>\n</details>\n<details>\n<summary>result</summary>\n\t![](https://prod-files-secure.s3.us-west-2.amazonaws.com/18192ab7-6d40-8113-8b36-0003bf3444bb/cf08ab5f-4b61-453e-a54f-b999b00ff948/Screenshot_2026-03-27_at_1.42.52_PM.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46626HTXBTL%2F20260927%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260927T150616Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFUaCXVzLXdlc3QtMiJHMEUCIQC7Td5gKKQeH%2BbUITBtZ%2FjV4xXg0lbmKiQz8SlueyK9GwIgHYa7C1uepEMnXvS2GsS5qRSewZHtWgQ%2BrbCjPxpC5poq%2FwMIHhAAGgw2Mzc0MjMxODM4MDUiDJ7q4XCtv%2FdjmpkLdircAw2JT6UpCnomXJVLZAJgJNcTTGs8asycrKgznKcRicv2V5AhOw%2FLzTlFW4FIzGXkkfYfPj%2BHCvRa88NytNoZ%2BQ5gIwSDVa2tMHdmxntyvU7UkdxrmJ5SwaEmqGSmli%2ByOq%2BYZ6HfOprZBpCKj7ARdZMSZQ7YyijUBLFhxtlvGQMDamWrC5A2vY7ht4NapzuzMN0lzur%2BHZWIczVxZm%2FYSGLVzYmEMY4O1oC0K90%2Bd6jHYUZxxiKOc0SCQABO%2BEfzDKqpSRHcaLEkXVuYMNAIxJobGyb%2FBdtGl8dGvLvFY3%2BH16DLlt3sh%2BRpTfLSXnf54zB6sy5H7HSPmD8e7jaW7D5q%2Fxd8GCHrniEvAvWi4vT%2BdO6uQ3yvNIGeUSbvNle1%2FtH5aTRdP4yB4rz7mH3vY8TS5JhCSuMvjUjSeoZoOiDyZC3dwQmHY%2FiTmniHgDOiojb9oKktC1ahKtbHtrO%2BU%2B8cZv95oXySm94vbuEsxVij%2F6YAM4MYoD5YL09zVCoqbeNnsa6OX04j9UVkFyHyoE8UFj4pCVOcmjN9S75sAg51EuBqgoQWRSYo7nOEDpaO265c7IHbv1aLA91JV0mkNAUzgFnVktslUEDkX6KDgzSZYe5GbJVLiL%2FxJ1syMImn5NUGOqUBLWRLv%2BirJmte%2BMYyAr7%2BraqOPqIoUFUgFEWcb2FWDuSsHxNr8AUfHUyCrMiL9LZqPRVvM33VU9zSB6FxUp%2BPnCBwSbi3WqJPHaAQpcy9LxTMTduH3eW8lRmiHIvkaMDkVR3hNRhHFDIpdYbu%2BfusHgrGxEO8OaYaXInidALJW54AK4uOoxfqDXZvkKTIv07VaAgCgZpEmcJPSc5m9se2ZrZS2u2X&X-Amz-Signature=740a0acfba7e4dce61f745409100403fb69de4187110397e50447b61e67bded7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)\n</details>\n<empty-block/>\n[e339. 前綴和練習 - 高中生程式解題系統](https://zerojudge.tw/ShowProblem?problemid=e339) {color=\"green_bg\"}\n[CSES - Static Range Sum Queries](https://cses.fi/problemset/task/1646/) {color=\"yellow_bg\"}\n[CSES - Forest Queries](https://cses.fi/problemset/task/1652) {color=\"red_bg\"}\n<empty-block/>\n## 差分 difference array\n旨在解決以下問題的慢速\n我現在要多次將\nl \\~ r 加上 5 剪掉 4 之類的操作\n然後最後要求區間和 \n<callout icon=\"👉\" color=\"yellow\">\n\t**例題**:[Corporate Flight Bookings - LeetCode](https://leetcode.com/problems/corporate-flight-bookings/description/)\n\t我要多次在 l\\~r 加上 a\n\t最後求每一個的結果總和\n\t<details>\n\t<summary>範測：</summary>\n\t\tInput:\n\t\t```plain text\nbookings = [[1,2,10],[2,3,20],[2,5,25]], n = 5\n\t\t```\n\t\tOutput:\n\t\t```plain text\n[10,55,45,25,25]\n\t\t```\n\t</details>\n</callout>\n對就像上面那題，那要怎麼搞呢？\n先想想看前綴和的特性\n![](https://prod-files-secure.s3.us-west-2.amazonaws.com/18192ab7-6d40-8113-8b36-0003bf3444bb/ca47a9cd-602b-4865-9510-d7489bdc240a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46626HTXBTL%2F20260927%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260927T150616Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFUaCXVzLXdlc3QtMiJHMEUCIQC7Td5gKKQeH%2BbUITBtZ%2FjV4xXg0lbmKiQz8SlueyK9GwIgHYa7C1uepEMnXvS2GsS5qRSewZHtWgQ%2BrbCjPxpC5poq%2FwMIHhAAGgw2Mzc0MjMxODM4MDUiDJ7q4XCtv%2FdjmpkLdircAw2JT6UpCnomXJVLZAJgJNcTTGs8asycrKgznKcRicv2V5AhOw%2FLzTlFW4FIzGXkkfYfPj%2BHCvRa88NytNoZ%2BQ5gIwSDVa2tMHdmxntyvU7UkdxrmJ5SwaEmqGSmli%2ByOq%2BYZ6HfOprZBpCKj7ARdZMSZQ7YyijUBLFhxtlvGQMDamWrC5A2vY7ht4NapzuzMN0lzur%2BHZWIczVxZm%2FYSGLVzYmEMY4O1oC0K90%2Bd6jHYUZxxiKOc0SCQABO%2BEfzDKqpSRHcaLEkXVuYMNAIxJobGyb%2FBdtGl8dGvLvFY3%2BH16DLlt3sh%2BRpTfLSXnf54zB6sy5H7HSPmD8e7jaW7D5q%2Fxd8GCHrniEvAvWi4vT%2BdO6uQ3yvNIGeUSbvNle1%2FtH5aTRdP4yB4rz7mH3vY8TS5JhCSuMvjUjSeoZoOiDyZC3dwQmHY%2FiTmniHgDOiojb9oKktC1ahKtbHtrO%2BU%2B8cZv95oXySm94vbuEsxVij%2F6YAM4MYoD5YL09zVCoqbeNnsa6OX04j9UVkFyHyoE8UFj4pCVOcmjN9S75sAg51EuBqgoQWRSYo7nOEDpaO265c7IHbv1aLA91JV0mkNAUzgFnVktslUEDkX6KDgzSZYe5GbJVLiL%2FxJ1syMImn5NUGOqUBLWRLv%2BirJmte%2BMYyAr7%2BraqOPqIoUFUgFEWcb2FWDuSsHxNr8AUfHUyCrMiL9LZqPRVvM33VU9zSB6FxUp%2BPnCBwSbi3WqJPHaAQpcy9LxTMTduH3eW8lRmiHIvkaMDkVR3hNRhHFDIpdYbu%2BfusHgrGxEO8OaYaXInidALJW54AK4uOoxfqDXZvkKTIv07VaAgCgZpEmcJPSc5m9se2ZrZS2u2X&X-Amz-Signature=01d7f31ae2183f6efb3c1cb942717bf976ddf03a678f3ea75f9dea5d7461e705&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)\n你前面的加上 n 你是不是也會加上 n \n你前面減去 n 你也會啊 所以他有 連續影響性\n那要怎麼應用在例題上？\n1. 暴力解\n\t這邊就不示範了\n\t**~~反正一定會炸 TLE~~**\n2. 差分解\n\t我們觀察到區間加值的動作其實只要在你開始的地方加上 n 再從你結束的地方減掉 n ⇒ <span color=\"red\">***A***</span>\n\t形成一個 <span color=\"green\">**差分陣列 **</span>\n\t然後再對他跑一次 <span color=\"yellow\">前綴和 </span>就可以得到要的結果了 而且 <span color=\"red\">***A ***</span>操作只需要 $`O(1)`$ 量級的複雜度\n\t然後 <span color=\"yellow\">前綴和 </span>只要 $`O(n)`$ 所以總複雜度就是 $`O(n)`$\n\t<details>\n\t<summary>code</summary>\n\t\t```c++\nclass Solution {\npublic:\n    vector<int> corpFlightBookings(vector<vector<int>>& bookings, int n) {\n        vector<int> v(n+1,0);\n        for(int i = 0 ; i < bookings.size() ; i++){\n            int s = bookings[i][0]; // 起始點\n            int e = bookings[i][1]; // 終點\n            s--,e--; // 0 indexed\n            int a = bookings[i][2]; // 要加的值\n            v[s] += a,v[e+1] -= a; // 製作差分陣列 O(1 * bookings.size())\n        }\n        vector<int> pref(n,0); \n        pref[0] = v[0];\n        for(int i = 1 ; i < n ; i++){\n            pref[i] = pref[i-1] + v[i]; // O(n)\n        }\n        return pref;\n    }\n};\n\t\t```\n\t</details>\n\t<details>\n\t<summary>複雜度</summary>\n\t\t$`O(n)`$\n\t</details>\n\t<details>\n\t<summary>result</summary>\n\t\t![](https://prod-files-secure.s3.us-west-2.amazonaws.com/18192ab7-6d40-8113-8b36-0003bf3444bb/843fdb2e-058a-45e0-b68b-21b46a3f4dee/Screenshot_2026-03-27_at_1.59.00_PM.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46626HTXBTL%2F20260927%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260927T150616Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFUaCXVzLXdlc3QtMiJHMEUCIQC7Td5gKKQeH%2BbUITBtZ%2FjV4xXg0lbmKiQz8SlueyK9GwIgHYa7C1uepEMnXvS2GsS5qRSewZHtWgQ%2BrbCjPxpC5poq%2FwMIHhAAGgw2Mzc0MjMxODM4MDUiDJ7q4XCtv%2FdjmpkLdircAw2JT6UpCnomXJVLZAJgJNcTTGs8asycrKgznKcRicv2V5AhOw%2FLzTlFW4FIzGXkkfYfPj%2BHCvRa88NytNoZ%2BQ5gIwSDVa2tMHdmxntyvU7UkdxrmJ5SwaEmqGSmli%2ByOq%2BYZ6HfOprZBpCKj7ARdZMSZQ7YyijUBLFhxtlvGQMDamWrC5A2vY7ht4NapzuzMN0lzur%2BHZWIczVxZm%2FYSGLVzYmEMY4O1oC0K90%2Bd6jHYUZxxiKOc0SCQABO%2BEfzDKqpSRHcaLEkXVuYMNAIxJobGyb%2FBdtGl8dGvLvFY3%2BH16DLlt3sh%2BRpTfLSXnf54zB6sy5H7HSPmD8e7jaW7D5q%2Fxd8GCHrniEvAvWi4vT%2BdO6uQ3yvNIGeUSbvNle1%2FtH5aTRdP4yB4rz7mH3vY8TS5JhCSuMvjUjSeoZoOiDyZC3dwQmHY%2FiTmniHgDOiojb9oKktC1ahKtbHtrO%2BU%2B8cZv95oXySm94vbuEsxVij%2F6YAM4MYoD5YL09zVCoqbeNnsa6OX04j9UVkFyHyoE8UFj4pCVOcmjN9S75sAg51EuBqgoQWRSYo7nOEDpaO265c7IHbv1aLA91JV0mkNAUzgFnVktslUEDkX6KDgzSZYe5GbJVLiL%2FxJ1syMImn5NUGOqUBLWRLv%2BirJmte%2BMYyAr7%2BraqOPqIoUFUgFEWcb2FWDuSsHxNr8AUfHUyCrMiL9LZqPRVvM33VU9zSB6FxUp%2BPnCBwSbi3WqJPHaAQpcy9LxTMTduH3eW8lRmiHIvkaMDkVR3hNRhHFDIpdYbu%2BfusHgrGxEO8OaYaXInidALJW54AK4uOoxfqDXZvkKTIv07VaAgCgZpEmcJPSc5m9se2ZrZS2u2X&X-Amz-Signature=1a98418beba1ad062e994ba57025f48e5b97f57d914f7be582a919c7d1b95b0f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)\n\t</details>\n[Car Pooling - LeetCode](https://leetcode.com/problems/car-pooling/description/) {color=\"yellow_bg\"}\n<empty-block/>"
  },
  {
    "id": "3e892ab76d4081dea137ee9bb24bddf9",
    "title": "04-02 More Prefix Sums / 2D Prefix Sums",
    "details": "",
    "difficulty": null,
    "domain": "04 Prefix Sums",
    "content": "",
    "notionUrl": "https://app.notion.com/p/3e892ab76d4081dea137ee9bb24bddf9"
  },
  {
    "id": "3e892ab76d4081ee95dceb60f0c01c7e",
    "title": "05-02 Greedy with Sorting",
    "details": "",
    "difficulty": null,
    "domain": "05 Greedy",
    "content": "",
    "notionUrl": "https://app.notion.com/p/3e892ab76d4081ee95dceb60f0c01c7e"
  },
  {
    "id": "2e392ab76d40801c8e05e50e3ef06c86",
    "title": "06-03 Flood Fill",
    "details": "圖的種類",
    "difficulty": 3,
    "domain": "06 Graphs",
    "content": "",
    "notionUrl": "https://app.notion.com/p/2e392ab76d40801c8e05e50e3ef06c86"
  },
  {
    "id": "33092ab76d408043b128e639a17c2484",
    "title": "06-05 Topological Sort",
    "details": "最短路演算法",
    "difficulty": 6,
    "domain": "06 Graphs",
    "content": "",
    "notionUrl": "https://app.notion.com/p/33092ab76d408043b128e639a17c2484"
  },
  {
    "id": "33092ab76d40804a8ddae8a9c6090a1f",
    "title": "06-06 DSU & Minimum Spanning Tree",
    "details": "最小生成樹",
    "difficulty": 6,
    "domain": "06 Graphs",
    "content": "",
    "notionUrl": "https://app.notion.com/p/33092ab76d40804a8ddae8a9c6090a1f"
  },
  {
    "id": "33092ab76d40802f813ed4ca344b6864",
    "title": "06-07 SCC & Condensation",
    "details": "聯通分量介紹",
    "difficulty": 6,
    "domain": "06 Graphs",
    "notionUrl": "https://app.notion.com/p/33092ab76d40802f813ed4ca344b6864",
    "content": "接下來這邊要介紹的是有向圖中**強連通分量 SCC**、無向圖中的**橋與割點**，以及之後可以幹嘛 \n# Connected Component 連通分量\n## 簡介\n何謂***連通分量***，講白話就是 **「一群可以彼此走得到的點」**\n但是這個東西在 ***有向圖*** 跟 ***無向圖*** 上意義差很多：\n1. **無向圖** ⇒ 兩個點如果有路徑連起來 就在同一個連通分量\n2. **有向圖** ⇒ 兩個點 u,v 必須 ***u 走得到 v 而且 v 也走得到 u*** 才算同一個 ***強*** 連通分量\n<details>\n<summary>為什麼要分這兩種？</summary>\n\t因為在有向圖上 「u 到 v 走得到」不代表「v 到 u 走得到」\n\t例如 u → v 是一條單行道 你過得去但是回不來 那就不算 ***強*** 連通\n\t無向圖就沒這問題 邊本來就雙向的\n</details>\n## 例題\n一樣 我們先不要碰演算法 先用例子建立直覺\n<details>\n<summary>看圖 (有向圖)</summary>\n\t想像有 6 個點 編號 1\\~6 邊如下：\n\t![](https://prod-files-secure.s3.us-west-2.amazonaws.com/18192ab7-6d40-8113-8b36-0003bf3444bb/7eb91ff5-6d27-42c6-bc3f-c5217d1fa382/Screenshot_2026-04-15_at_8.21.31_AM.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W3UL3LBJ%2F20260927%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260927T150617Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFcaCXVzLXdlc3QtMiJHMEUCIDx51e7MLpoTibCNBeMKhIlrvVeMRnZepIsAGgN%2F%2F4p3AiEA0yQA7%2BkMjgUsdvAJxhmERqpPs3MPQECu%2B3KM67WgkmIq%2FwMIIBAAGgw2Mzc0MjMxODM4MDUiDFn7Klhs%2FP6lz0JY8ircA%2BzoJEL56%2ByW6oSd6O8si3rHJcMCr1hjG1Od1glybQHkEsmub7dMYKj%2B8UjlwYfP9YflUvhpd1o6Sb89Ar9902UY2PU7dDPgW9vz7ajmqRiVR%2BMuRO2e9%2FOVcXaq68myNEwYeV2m0%2BTp4FMMLFY2I7JHwqx4bxyj3xi3hJUzavntTbEiEIcsIaGoKOPJS4566sRJbKQxz4hnyFTQ2pXQrFRKSUG4fyf8mFqqsfcxuF7sDnv6%2FBTi5VRiStVdoWG%2FOijQwVy1DlB0lQ5XQNAJmICrrFg6NKseAzzpxVadzgiyjkG3oW%2Ff4ynbYoIlrYVDlF6l2HI3ksZ1%2F3cigfynPAJc6xcZimZu08Z08yjDu6hct3YokvowpfmyIvSwWsC92Q%2BSlA51hapsM4ArIWUvCu4Wt%2Btjnsk%2FShGgJCf0F8cUSu1CY%2BpV9AcYuWfnSNrxdPpBCJGijTjNrEYXi8DeQeuRoiXVORUtaKHPxgxOyXcdFQwjb11s8PKfR3uULju8movsEoOhxO8G1t5aLcNR9ZSe3sk1xtAcU4eaulBQ0O6egq2mDE1Yf1n8U3Lv6t6mqNUjMVn3ntKc4unRBAFowX0g%2F53M%2BPS%2FDrMySfxwEIBgnaUy4XnZ0UjfVNJTMP3e5NUGOqUBQic%2BWU8Lv3efDZa6jskFQ85Ed3DnHpJotaaLyQ8%2FARQ0Ck2z8clIR2lmXh96YX%2BhQwrqBIncRIvLL2pWdQeqqf3Nj3UXhsY6p7H3dNx97YXkUYnu2HWaaXXsQuzDj1oh8qeV9x8q5xrqzG7D6w7AMLfjBWzk%2BGdiQQqjzjth8LaTV7xmdgY5CarKqSG7VniRDlqwBewUWhuA2%2Fn%2B%2FdnkCODeVBEr&X-Amz-Signature=178a36c1128d61ad9f9c46bb857a58e0311d255eed773bc2b6ecf3aa637e75eb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)\n</details>\n看完上面那張圖 回答幾個問題：\n1. 1, 2, 3 三個點是不是 **可以互相到達**？\n2. 4 可以走到 1 嗎？1 可以走回 4 嗎？\n3. 5, 6 是不是可以互相到達？\n<details>\n<summary>Answer</summary>\n\t1. 是 1→2→3→1 形成環 互相可達 ⇒ 同一個 SCC\n\t2. 4 可以走到 1（4→2→3→1）但 1 走不回 4 ⇒ 不同 SCC\n\t3. 是 5↔6 互相可達 ⇒ 同一個 SCC\n\t所以這張圖的 SCC 有：\n\t- \\{1, 2, 3\\}\n\t- \\{4\\}\n\t- \\{5, 6\\}\n</details>\n看完是不是很直覺？問題是當點數一大\n⇒ N ≤ $`10^5`$ 的時候 你不可能用眼睛分\n所以我們需要\n## 演算法\n<callout icon=\"➡️\" color=\"yellow\">\n\t在進入噁心的內容前 有幾個 ***超級重要*** 的觀念要先建立\n\t1. **DFS 時間戳** (dfn / discovery time)\n\t2. **DFS 樹** (tree edge / back edge / cross edge)\n\t3. [存圖的方法](https://www.notion.so/2e392ab76d4080a894fed635920f9c3c#33192ab76d40807ba369cbf4e7149c54) (一樣)\n\t下面會解釋\n</callout>\n<empty-block/>\n### 前置觀念 1：DFS 時間戳\n當我們對一張圖跑 DFS 的時候 每個點 **第一次被訪問到** 的時間 我們叫他 `dfn[u]` (discovery number)\n```c++\nint timer = 0, dfn[mxn];\nvoid dfs(int u){\n\tdfn[u] = ++timer;\n\tfor(int v : g[u]) if(!dfn[v]) dfs(v);\n}\n```\n超簡單對吧 就是 ***誰先被走到誰的編號就比較小***\n<details>\n<summary>有什麼用？</summary>\n\t有了 dfn 之後 我們可以快速判斷「誰是誰的祖先」「這條邊是樹邊還是非樹邊」 諸如此類\n\tSCC、橋、割點 全部都靠這個\n</details>\n### 前置觀念 2：DFS 樹\n當你對一張圖跑 DFS 的時候 你走過的邊會自然形成一棵 **DFS 樹**\n那些**沒被走的邊** 我們會分類：\n<details>\n<summary>有向圖的邊種類</summary>\n\t- **Tree edge**：DFS 走過的邊 形成 DFS 樹\n\t- **Back edge**：從子孫指向祖先的邊（會形成環！）\n\t- **Forward edge**：從祖先指向非直接子孫的邊\n\t- **Cross edge**：跨在不同子樹之間的邊（兩端沒有祖孫關係）\n\t在 SCC 演算法中我們主要關心 **back edge** 和 **cross edge**\n</details>\n<details>\n<summary>無向圖的邊種類</summary>\n\t無向圖只有兩種：\n\t- **Tree edge**\n\t- **Back edge**\n\t沒有 forward / cross edge（為什麼？因為無向 你 DFS 時不可能跨子樹 那條邊一定會在某邊先被走到）\n</details>\n好 觀念建好了 開始演算法吧\n<empty-block/>\n---\n### 1. SCC ⇒ Tarjan 演算法\n講真的 SCC 有兩種寫法：**Tarjan** 和 **Kosaraju**\n這邊只講 Tarjan 因為他**只跑一次 DFS 就搞定** 比較帥\n#### 核心思想\n<callout icon=\"💡\" color=\"blue_bg\">\n\t**SCC 的數學特徵**：一個 SCC 在 DFS 樹上 一定是某個子樹（或子樹的一部分） 而這個子樹的 ***最高點*** 我們叫他 **根**\n\t我們只要找出每個 SCC 的根 就能切出所有 SCC\n</callout>\n為了找到 SCC 的根 Tarjan 引入了一個新概念叫 `low[u]`\n<details>\n<summary>low\\[u\\] 是什麼</summary>\n\t`low[u]` = u 和 u 的子樹中 **能透過一條 back edge 回到的最早 dfn**\n\t白話：我從 u 出發 走 DFS 樹的子樹 然後最多跳一條非樹邊 我能回到 dfn 多小的點\n\t- 如果 `low[u] == dfn[u]` ⇒ u 就是某個 SCC 的根\n\t- 否則 ⇒ u 還能往上跳 不是根\n</details>\n#### 完整流程\n1. DFS 每個點 算 dfn 和 low\n2. 用一個 stack 記錄「目前還沒分到 SCC 的點」\n3. 對於 u 的每個鄰居 v：\n\t- 如果 v 還沒訪問 ⇒ 遞迴 dfs(v) 然後 `low[u] = min(low[u], low[v])`\n\t- 如果 v 還在 stack 中 ⇒ `low[u] = min(low[u], dfn[v])` (back edge / cross edge)\n\t- 如果 v 已經被分到別的 SCC 了 ⇒ 跳過\n4. 回溯時 如果 `low[u] == dfn[u]` ⇒ 把 stack 上 u 以上的所有點 pop 出來 組成一個 SCC\n<details>\n<summary>蛤？為什麼要用 stack？</summary>\n\t因為一個 SCC 的所有點在 DFS 過程中 一定是 ***連續*** 被訪問的（祖先先進 子孫後出）\n\t所以用 stack 來「暫存」一群還沒確定 SCC 歸屬的點 當我們找到根 u 的時候\n\t就把 stack 從頂端往下 pop 直到 pop 出 u 為止\n\t這些 pop 出來的點就是同一個 SCC\n</details>\n<details>\n<summary>為什麼回溯時 low\\[u\\] == dfn\\[u\\] 就代表 u 是根？</summary>\n\t想想看 `low[u] == dfn[u]` 代表什麼：\n\t**u 和 u 的子樹 沒有任何一條 back edge 能回到 u 的祖先**\n\t也就是說 u 上面那塊和 u 這塊「斷開」了 走不回去\n\t所以 u 就是這個 SCC 能往上爬的最高點 ⇒ 根\n</details>\n#### code (1-indexed)<br> {toggle=\"true\"}\n\t```c++\nconst int mxn = 1e5+5;\nvector<int> g[mxn];\nint dfn[mxn], low[mxn], scc_id[mxn], timer = 0, scc_cnt = 0;\nbool in_stk[mxn];\nstack<int> stk;\n\nvoid tarjan(int u){\n\tdfn[u] = low[u] = ++timer;\n\tstk.push(u);\n\tin_stk[u] = true;\n\tfor(int v : g[u]){\n\t\tif(!dfn[v]){\n\t\t\ttarjan(v);\n\t\t\tlow[u] = min(low[u], low[v]);\n\t\t}\n\t\telse if(in_stk[v]){\n\t\t\tlow[u] = min(low[u], dfn[v]);\n\t\t}\n\t}\n\tif(low[u] == dfn[u]){\n\t\tscc_cnt++;\n\t\twhile(true){\n\t\t\tint x = stk.top(); stk.pop();\n\t\t\tin_stk[x] = false;\n\t\t\tscc_id[x] = scc_cnt;\n\t\t\tif(x == u) break;\n\t\t}\n\t}\n}\n\t```\n\t觀察一下\n\t<columns>\n\t\t<column>\n\t\t\t1. `dfn[u] = low[u] = ++timer;` <span color=\"red\">**初始化兩個都是 timer**</span>\n\t\t</column>\n\t\t<column>\n\t\t\t<details>\n\t\t\t<summary>why</summary>\n\t\t\t\t因為一開始 u 還沒走子樹 自己就是自己能回到的最早點\n\t\t\t</details>\n\t\t</column>\n\t</columns>\n\t<columns>\n\t\t<column>\n\t\t\t1. 走到 ***已經訪問過的*** 鄰居 v 時 要檢查 `in_stk[v]`\n\t\t</column>\n\t\t<column>\n\t\t\t<details>\n\t\t\t<summary>why?</summary>\n\t\t\t\t如果 v 已經被分到別的 SCC 那就是 cross edge 不能用來更新 low\n\t\t\t\t只有還在 stack 上的 v 才代表「v 還和我同一個 SCC 候選」\n\t\t\t</details>\n\t\t</column>\n\t</columns>\n\t1. 用 `dfn[v]` 而不是 `low[v]` 更新 (back edge 那行)\n\t<details>\n\t<summary>why？</summary>\n\t\t這裡有兩種寫法 用 `dfn[v]` 或 `low[v]` 都可以得到正確的 SCC 結果\n\t\t但用 `dfn[v]` 比較安全 因為這樣 `low[u]` 真的就是「能回到最早的 dfn」的定義\n\t\t很多教材都會教 `dfn[v]` 我們也用這個\n\t</details>\n#### summary\n<details>\n<summary>複雜度？</summary>\n\t$`O(V+E)`$ 一次 DFS 走完整張圖 每個邊只訪問一次\n\t非常快 是這類問題的標準解\n</details>\n<details>\n<summary>什麼時候用 SCC？</summary>\n\t1. 找有向圖的所有 SCC\n\t2. **縮點** ⇒ 把 SCC 縮成一個點 整張圖變成 DAG ⇒ 可以跑 DAG DP 等等\n\t3. **2-SAT** ⇒ 布林滿足性問題 (進階 之後講)\n</details>\n---\n### 2. 縮點 (SCC Condensation)\n這是 SCC 最爽的應用\n<callout icon=\"💡\" color=\"green_bg\">\n\t把每個 SCC 看成一個「超級點」 SCC 之間的邊就變成超級點之間的邊\n\t**結果**：原本有環的有向圖 變成一個 DAG！\n</callout>\n<details>\n<summary>為什麼縮完一定是 DAG？</summary>\n\t反證法：假設縮完還有環 那這個環上的所有 SCC 應該要合併成一個更大的 SCC\n\t（因為環上的點互相可達）\n\t這就矛盾了 所以縮完一定無環 ⇒ DAG\n</details>\n#### 建縮點圖\n```c++\nvector<int> dag[mxn]; // SCC 縮點後的圖\nfor(int u = 1 ; u <= n ; u++){\n\tfor(int v : g[u]){\n\t\tif(scc_id[u] != scc_id[v]){\n\t\t\tdag[scc_id[u]].push_back(scc_id[v]);\n\t\t}\n\t}\n}\n```\n<details>\n<summary>需要去重邊嗎？</summary>\n\t看題目\n\t- 如果只是要在 DAG 上跑 DP / 拓撲排序 ⇒ 不一定要去重\n\t- 如果要算邊數或精準的圖結構 ⇒ 要 用 set 或排序去重\n</details>\n#### 縮點之後可以幹嘛？\n<details>\n<summary>常見應用</summary>\n\t1. **DAG 上最長路** ⇒ 拓撲排序 + DP\n\t2. **計算每個 SCC 內部點數** ⇒ scc_size\\[\\] 預處理\n\t3. **判斷強連通性** ⇒ 看 scc_cnt 是不是等於 1\n\t4. **必經點 / 必經邊問題** ⇒ 用 SCC 簡化圖再分析\n</details>\n#### 經典題：CSES Planets and Kingdoms\n題意：給有向圖 求每個 SCC\n做法：直接套 Tarjan 把 scc_id 印出來 沒了\n<details>\n<summary>稍微難一點的：CSES Coin Collector</summary>\n\t題意：有向圖 每個點有金幣 你可以任意走 求最多能拿多少金幣\n\t做法：\n\t1. Tarjan 找 SCC 計算每個 SCC 的金幣總和 (因為 SCC 內可以隨便走 所以全部都能拿)\n\t2. 縮點建 DAG\n\t3. DAG 上跑最長路 (DP)\n\t這就是 SCC + 縮點的標準應用\n</details>\n<empty-block/>\n---\n### 三個常見錯誤\n寫 Tarjan SCC 最容易踩的雷 一次列給你\n<table header-row=\"true\">\n<tr>\n<td>錯誤</td>\n<td>後果</td>\n<td>怎麼避免</td>\n</tr>\n<tr>\n<td>忘記 in_stk\\[\\] 檢查</td>\n<td>把已經是別的 SCC 的點納入 low 計算 結果錯</td>\n<td>遇到已訪問過的 v 一定要先 check in_stk\\[v\\]</td>\n</tr>\n<tr>\n<td>用 low\\[v\\] 而非 dfn\\[v\\]</td>\n<td>有些 case 會錯 (雖然大部分對)</td>\n<td>記住標準寫法 用 dfn\\[v\\]</td>\n</tr>\n<tr>\n<td>遞迴爆 stack</td>\n<td>大圖 RE</td>\n<td>大圖記得開 ulimit 或寫 iterative 版</td>\n</tr>\n</table>\n<empty-block/>\n---\n<empty-block/>\n下一講：Connected Component 2 ⇒ **無向圖的橋與割點** (一樣是 Tarjan 但細節不同)\n<empty-block/>"
  },
  {
    "id": "33092ab76d40803f9b93ca26e064c1bf",
    "title": "06-08 Bridges, Articulation Points & BCC",
    "details": "演算法們",
    "difficulty": 8,
    "domain": "06 Graphs",
    "notionUrl": "https://app.notion.com/p/33092ab76d40803f9b93ca26e064c1bf",
    "content": "接下來這邊要介紹的是**無向圖**中的「脆弱連接」 也就是拿掉它 圖就會裂開的 ***邊*** 和 ***點***\n# Bridge & Articulation Point 橋與割點\n## 簡介\n上一講我們討論的是有向圖的 SCC 這個概念\n這一講换到 ***無向圖*** 看一個不一樣但是一樣超重要的東西：\n1. **橋 (Bridge)** ⇒ 一條邊 如果將它刪掉 原本連通的圖就會被切成兩塊\n2. **割點 (Articulation Point)** ⇒ 一個點 如果將它刪掉（連同它接的邊） 原本連通的圖就會被切成多塊\n<callout icon=\"⚠️\" color=\"red_bg\">\n\t橋和割點 ***只在無向圖談*** 有向圖不討論這個\n</callout>\n<details>\n<summary>為什麼要關心這個？</summary>\n\t1. 網路拓撲學 ⇒ 哪些連線一斷 整個網路就環\n\t2. 路網規劃 ⇒ 哪些路口是關鍵路口\n\t3. 競賽上 ⇒ 很多進階題都要先找到橋/割點再做後續處理\n</details>\n## 例題\n一樣 先不要碰演算法 先看圖找感覺\n<details>\n<summary>看圖 (無向圖)</summary>\n\t6 個點的無向圖：\n\t```javascript\n1 - 2\n2 - 3\n3 - 1   (1,2,3 形成一個三角形)\n3 - 4   (這是關鍵邊)\n4 - 5\n5 - 6\n4 - 6   (4,5,6 形成一個三角形)\n\t```\n\t![](https://prod-files-secure.s3.us-west-2.amazonaws.com/18192ab7-6d40-8113-8b36-0003bf3444bb/87f0db0c-627f-412a-a22a-2df467dc477e/Screenshot_2026-04-15_at_10.26.52_AM.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V6S7XTF2%2F20260927%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260927T150617Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJIMEYCIQCGr4gEHsH9fW1DUoBKSM71cdv91jsP%2BZ6JeoATsRbdwgIhAOFzyVjryqukdpBYRrVesQy4EXyTLMF5NJrGfaHvJ%2FjaKv8DCB0QABoMNjM3NDIzMTgzODA1IgzddmHnQ7PblVVhTU0q3AMad4RP%2BGJxJRYIgpuA1TW0ZrSVl1orpkS7if3KOKPzk94zx8eombAOMnEreqxXUPDav0qnC0UdTANPwqcfr3KmWkCG6Zg4WcrVyneLlRlhwCpUUu3AcBhkWzE%2FCqhIL4aS2OJF76WAiRFB5LhbxkFQhhNgMl3VijX%2FaJBqIWfEfKg6xZHWsjeKHPK0f21TZX9gi8sCVMNBJ0uduGFi8MztaGr8mb8YAr2h2raXDcFOpzUlaouJELvcmkyF%2B19qoUcMRy6sOagXoB9%2FLbKI%2Br7fx9ZxKB6VF3zPvBcFKvgPqmqxOk%2FUeIc%2FRDpeldJ0A8s5vy%2Btt0dFI3HVONWqw0HiRvIzXgq1Rae3zAxE3Aebfdly%2FwUvlDTRaBDNqGoBgi8UZ44SBUcCoIoa2CNo3QF5XEKCMw9mG2dlA%2BzYpqFivOXmxQnCnABiVDgTkc%2BIn%2B7CI3%2Fris6aAFyX2yXsn%2BKcpwvsgAZxlyMbr6UqcG1jH9yICeFB3%2Fwqk2T1lEfqdbQP90h%2F3DHScr0pthn51vT1%2Bx10lIjb4UP0hB58d8fOPdlCH7QcrJqyLp1NftFucZK5gHS7t7Bt45ZOuMNzC1S0QHXz%2BcvKxQSsyLXClrNslIGfxveXpwMl1oI4EzDhi%2BTVBjqkAfuka0rftX9IZUiiNLGYatKS%2Fv4Lgoz0itxxoNWIV63ty%2FDhbVUl86bAykRLijgOA2y233%2F0G%2Ff43wqFmb2Okc7Gf5tihHjzV%2B93KXOexzIIIHvnCF3BgpEC5txiDPthal87kaAMIvLpf4p%2BtX9hA7LqSS81w5z%2Fzw%2BBPjvfo7xf3SiUfVb8no7XUg8HQraAzvvSM1LZGMkzYuqIgUAYNed0JPKv&X-Amz-Signature=47d4b0a47dfc7933fd901aa89155a711fa9942f052bf6e359b89e4f9127f1617&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)\n</details>\n<empty-block/>\n看完上面那張圖 回答幾個問題：\n1. 如果我刪掉 **3-4** 這條邊 會怎樣？\n2. 如果我刪掉 **1-2** 這條邊 會怎樣？\n3. 如果我拿掉 **點 3** (連同它的邊) 會怎樣？\n4. 如果我拿掉 **點 1** 會怎樣？\n<details>\n<summary>Answer</summary>\n\t1. 圖裂成兩塊：\\{1,2,3\\} 和 \\{4,5,6\\} ⇒ **3-4 是橋**\n\t2. 圖還是連通的（1 和 2 還可以透過 3 連接）⇒ **1-2 不是橋**\n\t3. 圖裂成兩塊：\\{1,2\\} 和 \\{4,5,6\\} ⇒ **點 3 是割點**\n\t4. 圖還是連通的（2 和 3 還相連）⇒ **點 1 不是割點**\n\t所以這張圖：\n\t- 唯一的橋：3-4\n\t- 唯一的割點：3 和 4\n</details>\n<empty-block/>\n看到這邊你應該能感覺到 橋和割點是不一樣的概念 但是有關聯\n<details>\n<summary>這兩個是不是一樣的東西？</summary>\n\t<span color=\"red\">**不一樣！**</span>\n\t- 橋的兩端點不一定是割點（長得像一條長長的鴻 ←→→→→→→→→ 這種）\n\t- 割點不一定接着橋（例如三個三角形中間共享一個點 那個點是割點 但連著它的沒一個是橋）\n\t但是**演算法寫法高度相似** 都是 Tarjan + dfn / low\n</details>\n## 演算法\n<callout icon=\"➡️\" color=\"yellow\">\n\t需要先看一下 [Lecture_8-1 \\|Graph\\| Connected Component 1](https://www.notion.so/33092ab76d40802f813ed4ca344b6864) 中的 dfn / low 與 DFS 樹那邊 不然這邊會看不太懂\n</callout>\n記得上一講說的嗎？**無向圖的 DFS 樹只有 tree edge 和 back edge** 這個特質讓事情變得簡單許多\n<empty-block/>\n---\n### 1. 橋 (Bridge) → Tarjan\n#### 核心思想\n<callout icon=\"💡\" color=\"blue_bg\">\n\t一條 tree edge `(u, v)`（v 是 u 的子）是橋 〈=〉 **v 的子樹中 沒有任何一條 back edge 能跳回到 u 或 u 的祖先**\n\t換句話說：v 這邊被「完全孤立」了 所以這條邊一拆 就沒法從 v 的子樹走回 u\n</callout>\n用 dfn / low 怎麼表達這件事？\n<details>\n<summary>關鍵條件</summary>\n\t**`low[v] > dfn[u]`** 〈=〉 (u, v) 是橋\n\t為什麼？記得 `low[v]` 是 v 和 v 的子樹能透過 back edge 回到最早的 dfn 嗎？\n\t- 如果 `low[v] > dfn[u]` ⇒ v 的子樹造成的最早 dfn 都比 u 還晚 代表「**v 一點都跳不回 u 以上**」\n\t- 那這條邊離開 u 往 v 走 就是「唯一可以連接上下兩部分的邊」 ⇒ 是橋\n\t- 反之如果 `low[v] <= dfn[u]` 代表 v 的子樹能跳回 u 或 u 的祖先 那表示有「造橋」可以邊路走 不是橋\n</details>\n<details>\n<summary>為什麼是嚴格大於 不是 ≥？</summary>\n\t如果 `low[v] == dfn[u]` 代表 v 的子樹「能剛好跳回 u」\n\t那代表除了 (u,v) 這條 tree edge 以外 還有另一條 back edge 可以連接 u 和 v 的子樹\n\t所以拆掉 (u,v) 還有路走 不是橋\n</details>\n#### 警告：重邊 (multi-edge)\n<callout icon=\"⚠️\" color=\"red_bg\">\n\t這邊有個超常見的雷 一定要踩一次\n</callout>\n如果 u 和 v 之間有兩條以上的邊 (multi-edge) 那這些邊 ***一條都不是橋***\n<details>\n<summary>為什麼？</summary>\n\t拆掉其中一條 還有另一條可以走 圖還是連通的 所以不是橋\n</details>\n但是原本的 Tarjan 不會正確處理這件事 因為它會誤以為「這條邊是 back edge」然後更新 low\n解法：**記那條邊的編號 不要走回來**\n<details>\n<summary>怎麼寫？</summary>\n\t寫 DFS 的時候 傳一個 `parent_edge_id` 參數\n\t檢查鄰居邊的編號 如果跟 parent_edge_id 一樣 就 skip\n\t不要用 `if(v == parent)` 的寫法 那個有 multi-edge 的時候會 bug\n</details>\n#### code (1-indexed)<br> {toggle=\"true\"}\n\t```c++\nconst int mxn = 1e5+5;\nvector<pair<int,int>> g[mxn]; // {v, edge_id}\nint dfn[mxn], low[mxn], timer = 0;\nvector<pair<int,int>> bridges;\n\nvoid tarjan(int u, int parent_edge){\n\tdfn[u] = low[u] = ++timer;\n\tfor(auto [v, eid] : g[u]){\n\t\tif(eid == parent_edge) continue; // 不走回來那條邊\n\t\tif(!dfn[v]){\n\t\t\ttarjan(v, eid);\n\t\t\tlow[u] = min(low[u], low[v]);\n\t\t\tif(low[v] > dfn[u]){\n\t\t\t\tbridges.push_back({u, v});\n\t\t\t}\n\t\t}\n\t\telse{\n\t\t\tlow[u] = min(low[u], dfn[v]);\n\t\t}\n\t}\n}\n\n// 主程式中\nfor(int i = 1 ; i <= n ; i++)\n\tif(!dfn[i]) tarjan(i, -1);\n\t```\n\t觀察一下\n\t<columns>\n\t\t<column>\n\t\t\t1. 邊是 `pair<int,int>` 存 `{鄰居, 邊編號}`\n\t\t</column>\n\t\t<column>\n\t\t\t<details>\n\t\t\t<summary>why</summary>\n\t\t\t\t要讓模型能處理 multi-edge 必須用邊編號 而不是鄰居點編號來識別「不走回來那條」\n\t\t\t</details>\n\t\t</column>\n\t</columns>\n\t<columns>\n\t\t<column>\n\t\t\t1. <span color=\"red\">**嚴格大於**</span> `low[v] > dfn[u]`\n\t\t</column>\n\t\t<column>\n\t\t\t<details>\n\t\t\t<summary>不能是 ≥？</summary>\n\t\t\t\t上面講過 重要到我要再說一次 是嚴格大於\n\t\t\t</details>\n\t\t</column>\n\t</columns>\n\t1. `tarjan(i, -1)` 起始沒有 parent edge\n#### summary\n<details>\n<summary>複雜度？</summary>\n\t$`O(V+E)`$ 一次 DFS\n</details>\n<empty-block/>\n---\n### 2. 割點 (Articulation Point) → Tarjan\n#### 核心思想\n這邊要分成兩個 case 有點煩 但只要記就會\n<callout icon=\"💡\" color=\"blue_bg\">\n\t**Case 1 — 根節點 (DFS 起點)**：u 是割點 〈=〉 u 在 DFS 樹上 **有超過一個子點**\n\t**Case 2 — 非根節點**：u 是割點 〈=〉 u 有某個子點 v 滿足 **`low[v] >= dfn[u]`**\n</callout>\n<details>\n<summary>Case 1 為什麼？</summary>\n\t記住 根節點沒有祖先 所以不能使用 low 那個條件\n\t但是如果根只有一個子點 拿掉根以後 這個子點還是連通的 不是割點\n\t如果根有兩個以上子點 這些子點之間只能透過根連接 拿掉根就裂開了 是割點\n</details>\n<details>\n<summary>Case 2 為什麼是 ≥ 不是 ＞？</summary>\n\t這跟橋最大差別所在！\n\t- `low[v] >= dfn[u]` 代表 v 的子樹頂多只能跳回 u **本身** 跳不到 u 的任何祖先\n\t- 那如果拿掉 u 這個點 v 這邊就變孤島 是割點✅\n\t- 包含 `low[v] == dfn[u]` 這種「刚好能跳到 u」的 case 因為 u 被拿掉了 這個 back edge 也沒用\n\t- 但是橋不同 橋是拿掉「邊」 拿掉邊不會拿掉 u 本身 所以 u 還可以幫忙連接\n</details>\n<callout icon=\"⚠️\" color=\"red_bg\">\n\t**最重要的差別**：橋是 `low[v] > dfn[u]`（严格） 割點是 `low[v] >= dfn[u]`（可等於）\n\t這個一定要記住\n</callout>\n#### code (1-indexed)<br> {toggle=\"true\"}\n\t```c++\nconst int mxn = 1e5+5;\nvector<int> g[mxn];\nint dfn[mxn], low[mxn], timer = 0;\nbool is_cut[mxn];\n\nvoid tarjan(int u, int parent){\n\tdfn[u] = low[u] = ++timer;\n\tint child = 0;\n\tfor(int v : g[u]){\n\t\tif(!dfn[v]){\n\t\t\tchild++;\n\t\t\ttarjan(v, u);\n\t\t\tlow[u] = min(low[u], low[v]);\n\t\t\tif(parent != -1 && low[v] >= dfn[u]){\n\t\t\t\tis_cut[u] = true;\n\t\t\t}\n\t\t}\n\t\telse if(v != parent){\n\t\t\tlow[u] = min(low[u], dfn[v]);\n\t\t}\n\t}\n\tif(parent == -1 && child > 1){\n\t\tis_cut[u] = true; // 根節點有超過一個子樹\n\t}\n}\n\n// 主程式中\nfor(int i = 1 ; i <= n ; i++)\n\tif(!dfn[i]) tarjan(i, -1);\n\t```\n\t觀察一下\n\t<columns>\n\t\t<column>\n\t\t\t1. 重點是 `child` 計數子點個數 (DFS 樹上)\n\t\t</column>\n\t\t<column>\n\t\t\t<details>\n\t\t\t<summary>why</summary>\n\t\t\t\t因為根節點要看子點數 不能用 low 條件\n\t\t\t</details>\n\t\t</column>\n\t</columns>\n\t<columns>\n\t\t<column>\n\t\t\t1. 根與非根是不同檢查\n\t\t</column>\n\t\t<column>\n\t\t\t<details>\n\t\t\t<summary>為什麼要分？</summary>\n\t\t\t\t因為根沒有祖先 所以 low 那個條件在根上沒意義\n\t\t\t\t你可以手模一下：根只有一個子點 但子點的 low 一定是 dfn\\[根\\] 這樣會誤判\n\t\t\t</details>\n\t\t</column>\n\t</columns>\n\t1. 這邊用 `v != parent` 是因為 **假設沒有 multi-edge** 如果有 要改成邊編號的寫法\n#### 三個常見陸型雷\n<table header-row=\"true\">\n<tr>\n<td>錯誤</td>\n<td>後果</td>\n<td>怎麼避免</td>\n</tr>\n<tr>\n<td>橋用 ≥ 割點用 ＞</td>\n<td>答案一堆錯</td>\n<td>記「邊严格 點可等於」</td>\n</tr>\n<tr>\n<td>沒處理 multi-edge</td>\n<td>該是橋的不是橋</td>\n<td>邊用邊編號 不要用 v == parent</td>\n</tr>\n<tr>\n<td>忘了根節點的特殊 case</td>\n<td>根被誤判為割點</td>\n<td>分 case 1, case 2 處理</td>\n</tr>\n</table>\n#### summary\n<details>\n<summary>複雜度？</summary>\n\t$`O(V+E)`$ 一次 DFS\n</details>\n<empty-block/>\n---\n### 橋 vs 割點 大亂鬥\n這個一定要看\n<table header-row=\"true\">\n<tr>\n<td>項目</td>\n<td>橋 (Bridge)</td>\n<td>割點 (Articulation Point)</td>\n</tr>\n<tr>\n<td>對象</td>\n<td>邊</td>\n<td>點</td>\n</tr>\n<tr>\n<td>關鍵條件</td>\n<td>`low[v] > dfn[u]`</td>\n<td>`low[v] >= dfn[u]`</td>\n</tr>\n<tr>\n<td>大於還是 ≥</td>\n<td><span color=\"red\">**严格 ＞**</span></td>\n<td><span color=\"green\">**可等於 ≥**</span></td>\n</tr>\n<tr>\n<td>根節點的特殊 case</td>\n<td>不需要（邊沒有根的概念）</td>\n<td>要 看子樹個數是否 \\> 1</td>\n</tr>\n<tr>\n<td>multi-edge</td>\n<td>變不是橋 要用邊編號</td>\n<td>不受影響（點還是點）</td>\n</tr>\n<tr>\n<td>複雜度</td>\n<td>$`O(V+E)`$</td>\n<td>$`O(V+E)`$</td>\n</tr>\n</table>\n<details>\n<summary>一句話記憶</summary>\n\t**橋用严格大於 割點可等於 並且割點要處理根**\n\t這句背起來 考試不會混\n</details>\n<empty-block/>\n---\n### 進階：邊雙連通分量 (Edge BCC)\n<callout icon=\"➡️\" color=\"yellow\">\n\t這部分是 bonus 不急學 但是 IOI 有時候會考 記存在就好\n</callout>\n把原圖中「所有橋」都刪掉之後 剩下的每一個連通分量 叫作 **邊雙連通分量**\n<details>\n<summary>特性</summary>\n\t1. 同一個 BCC 中任意兩點 都有「至少兩條邊不重複」的路徑\n\t2. 把每個 BCC 縮成一個點 原圖變成一棵 ***樹***（只剩橋）\n\t\t這棵樹叫 **bridge tree**\n</details>\n<details>\n<summary>什麼時候用？</summary>\n\t任何「路徑上不重複邊」的問題 都可以考慮轉到 bridge tree 上\n\t例如：這條邊是不是某兩個 query 點之間必經的 之類的\n</details>\n<empty-block/>\n---\n<empty-block/>\n下一講：~~Connected Component 3 (如果有的話)~~ 可能是 **2-SAT** 或者直接進 String\n<empty-block/>"
  },
  {
    "id": "3e892ab76d4081d49132d6cc34d59c79",
    "title": "06-09 Functional Graphs",
    "details": "Coming soon",
    "difficulty": null,
    "domain": "06 Graphs",
    "content": "",
    "notionUrl": "https://app.notion.com/p/3e892ab76d4081d49132d6cc34d59c79"
  },
  {
    "id": "33092ab76d4080b5be7beaa7cd896ef1",
    "title": "07-01 Introduction to Trees",
    "details": "樹 基礎",
    "difficulty": 3,
    "domain": "07 Trees",
    "content": "",
    "notionUrl": "https://app.notion.com/p/33092ab76d4080b5be7beaa7cd896ef1"
  },
  {
    "id": "33092ab76d40808086f8e08bc241b356",
    "title": "07-02 Euler Tour Technique",
    "details": "樹 進階知識",
    "difficulty": 8,
    "domain": "07 Trees",
    "content": "",
    "notionUrl": "https://app.notion.com/p/33092ab76d40808086f8e08bc241b356"
  },
  {
    "id": "3e892ab76d4081f4a3ebea631573b28c",
    "title": "07-03 Tree DP",
    "details": "",
    "difficulty": null,
    "domain": "07 Trees",
    "content": "",
    "notionUrl": "https://app.notion.com/p/3e892ab76d4081f4a3ebea631573b28c"
  },
  {
    "id": "3e892ab76d408102aec4ce3bc4fe29b0",
    "title": "07-04 Binary Lifting & LCA",
    "details": "",
    "difficulty": null,
    "domain": "07 Trees",
    "content": "",
    "notionUrl": "https://app.notion.com/p/3e892ab76d408102aec4ce3bc4fe29b0"
  },
  {
    "id": "3e892ab76d40814d9dc6d44031417468",
    "title": "07-05 Rerooting DP",
    "details": "Coming soon",
    "difficulty": null,
    "domain": "07 Trees",
    "content": "",
    "notionUrl": "https://app.notion.com/p/3e892ab76d40814d9dc6d44031417468"
  },
  {
    "id": "3e892ab76d408191a979d9f33c5f58c4",
    "title": "08-02 Knapsack DP",
    "details": "Coming soon",
    "difficulty": null,
    "domain": "08 Dynamic Programming",
    "content": "",
    "notionUrl": "https://app.notion.com/p/3e892ab76d408191a979d9f33c5f58c4"
  },
  {
    "id": "3e892ab76d408178b59ff292e87b9256",
    "title": "08-03 Paths on Grids",
    "details": "Coming soon",
    "difficulty": null,
    "domain": "08 Dynamic Programming",
    "content": "",
    "notionUrl": "https://app.notion.com/p/3e892ab76d408178b59ff292e87b9256"
  },
  {
    "id": "3e892ab76d4081ce9465cfa5633c9550",
    "title": "08-04 Longest Increasing Subsequence",
    "details": "",
    "difficulty": null,
    "domain": "08 Dynamic Programming",
    "content": "",
    "notionUrl": "https://app.notion.com/p/3e892ab76d4081ce9465cfa5633c9550"
  },
  {
    "id": "3e892ab76d4081b58001c57a495e4220",
    "title": "08-05 Bitmask DP",
    "details": "",
    "difficulty": null,
    "domain": "08 Dynamic Programming",
    "content": "",
    "notionUrl": "https://app.notion.com/p/3e892ab76d4081b58001c57a495e4220"
  },
  {
    "id": "3e892ab76d408121a81cee03805638ff",
    "title": "08-06 Range DP",
    "details": "",
    "difficulty": null,
    "domain": "08 Dynamic Programming",
    "content": "",
    "notionUrl": "https://app.notion.com/p/3e892ab76d408121a81cee03805638ff"
  },
  {
    "id": "3e892ab76d4081feb932e92efcede2f4",
    "title": "08-07 Digit DP",
    "details": "",
    "difficulty": null,
    "domain": "08 Dynamic Programming",
    "content": "",
    "notionUrl": "https://app.notion.com/p/3e892ab76d4081feb932e92efcede2f4"
  },
  {
    "id": "33092ab76d40809c9543d94c24efa37a",
    "title": "09-01 Monotonic Stack",
    "details": "單調棧",
    "difficulty": 4,
    "domain": "09 Data Structures & Range Queries",
    "content": "",
    "notionUrl": "https://app.notion.com/p/33092ab76d40809c9543d94c24efa37a"
  },
  {
    "id": "3e892ab76d4081c9a9f7dd9ac7bbb034",
    "title": "09-02 Fenwick Tree (BIT)",
    "details": "Coming soon",
    "difficulty": null,
    "domain": "09 Data Structures & Range Queries",
    "content": "",
    "notionUrl": "https://app.notion.com/p/3e892ab76d4081c9a9f7dd9ac7bbb034"
  },
  {
    "id": "33092ab76d4080199eaafc456a0f2fb7",
    "title": "09-03 Segment Tree",
    "details": "線段樹",
    "difficulty": 7,
    "domain": "09 Data Structures & Range Queries",
    "notionUrl": "https://app.notion.com/p/33092ab76d4080199eaafc456a0f2fb7",
    "content": "## 前情提要 兼 先備知識 {toggle=\"true\"}\n\t<page url=\"https://app.notion.com/p/3c392ab76d4080b3bcf2e6bc50d3ca8c\">二分樹編號</page>\n\t<page url=\"https://app.notion.com/p/3c392ab76d4080688f95c73ccee1a0f0\">對資料結構一定了解</page>\n# 為什麼要用線段樹,用途\n---\n> 用途如下…\n### 先帶入個題目：[CSES - Static Range Sum Queries](https://cses.fi/problemset/task/1646)\n這大家都寫過大家都會對吧\n### 那如果今天*換個要求* {toggle=\"true\"}\n\t[CSES - Static Range Minimum Queries](https://cses.fi/problemset/task/1647)\n<empty-block/>\n### 如果現在又*加了個操作* {toggle=\"true\"}\n\t[CSES - Dynamic Range Sum Queries](https://cses.fi/problemset/task/1648)\n<empty-block/>\n### 一樣*換個要求* {toggle=\"true\"}\n\t[CSES - Dynamic Range Minimum Queries](https://cses.fi/problemset/task/1649)\n<empty-block/>\n---\n> 為什麼要用線段樹\n所以可以明顯看得出來線段樹最基礎且明顯的用途就是解決各種 range 問題\n詳細來說就是：\n範圍（單點/區間）修改（設值/加值） 範圍（單點/區間）查詢（sum/min/max/xor…)\n那要會寫 2     \\*       2      \\*       2         \\*        3 種不同的線段樹\n$`真好玩`$** **$`真刺激`$\n<table>\n<colgroup>\n<col width=\"239.66666666666666\">\n<col width=\"239.66666666666666\">\n<col width=\"239.66666666666666\">\n</colgroup>\n<tr>\n<td>修改/查詢</td>\n<td>單點</td>\n<td>區間</td>\n</tr>\n<tr>\n<td>單點</td>\n<td>一般陣列解決</td>\n<td>線段樹 BIT</td>\n</tr>\n<tr>\n<td>區間</td>\n<td>線段樹</td>\n<td>線段樹</td>\n</tr>\n</table>\n先這樣就好 我相信沒有人會用以前的方法解了對吧 因為這樣複雜度一定爆\n~~需要證明嗎？~~\n---\n但沒事 今天會逐步拆解 並且教會你所有的解法\n# 引入概念\n我們前面已經提過 <mention-page url=\"https://app.notion.com/p/33092ab76d4080199eaafc456a0f2fb7#3c392ab76d4080f1a416c09f01620c4b\">前情提要 兼 先備知識</mention-page> 想必這和線段樹的概念和實作必然有緊密關聯\n我們先看個題：\n[Courses - Codeforces](https://codeforces.com/edu/course/2/lesson/4/2/practice/contest/273278/problem/C)\n## 我們想想解法：\n<details>\n<summary>**Brute Force**</summary>\n\t直接硬寫給他然後爆給他看\n\t```c++\n// Edited by Gemini\n#include <iostream>\n#include <vector>\n\nusing namespace std;\n\nint main() {\n    // 優化 I/O 速度\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n\n    int n, m;\n    cin >> n >> m;\n\n    vector<int> a(n);\n    for (int i = 0; i < n; i++) {\n        cin >> a[i];\n    }\n\n    while (m--) {\n        int type;\n        cin >> type;\n        if (type == 1) {\n            int i, v;\n            cin >> i >> v;\n            a[i] = v; // O(1) 直接更新\n        } else if (type == 2) {\n            int x;\n            cin >> x;\n            int ans = -1;\n            \n            // O(n) 線性搜尋第一個 >= x 的元素\n            for (int j = 0; j < n; j++) {\n                if (a[j] >= x) {\n                    ans = j;\n                    break;\n                }\n            }\n            cout << ans << \"\\n\";\n        }\n    }\n\n    return 0;\n}\n\t```\n</details>\n<details>\n<summary>🧠</summary>\n\t我們想想喔 我們是否可以用一種二分樹的概念\n\t把數列打到一棵二元樹的最底\n\t然後怎麼決定他們上面的節點數值呢？\n\t我們取 max\n\t也就是說最後會長這樣\n\t*~~喔那個 ‘ ‘’ 是因為 graph editor 的問題當作沒看到就好~~*\n\t<embed src=\"\"></embed>\n\t### 觀察\n\t---\n\t而且因為他是 max 所以就會有一個很好的性質：\n\t- 我今天要找的是第一個 ≥ x 的數字 \n\t- 假設我在左邊就遇到了一個 ≥ x 的數字 → 代表我根本不用走到右邊啊 因為我答案要越左越好\n\t- 那如果我做邊都沒有遇到一個 ≥ x 的數字那我就往右邊找 重複遞迴這個操作就可以得到最後的答案 啊如果跑到最右邊了都沒有 ≥ x 的數字那就回傳<span color=\"red\">**沒有**</span>\n\t那具體要怎麼在我們的 BST 上面跑呢：\n\t我們從**根節點**開始遞迴：\n\t- 如果當前節點 now 所代表的值 v\\[now\\] ≥ x 的話那就往他的左子節點 now\\*2 跑\n\t- 反觀如果 v\\[now\\] \\< x 的話那就代表說左邊都不再可能有 ≥ x 的值了 我們就回傳<span color=\"red\">**沒有 **</span>然後去跑右子節點 now\\*2+1 \n\t- 重複直到跑到葉節點然後把他的 idx 輸出出來\n\t---\n</details>\n## 小結論\n那這題我們不急著實作出來 \n這題的作用主要在於說我們觀察到了可以利用**二元樹**的性質 維護**題目要求的資訊**讓我們的\n<details>\n<summary>**複雜度壓下來**</summary>\n\t$`有一點嚴謹的證明`$：\n\t因為我每一次找的時候都只會找整個樹高 而樹的葉節點（最底層）有 n 個\n\t啊我每一次會讓我往上一層的節點數量 $`÷2`$ 所以觀察得知我的樹高會是 $`log_2N`$ \n\t也就是說我每一次查詢從最上面跑到最下面時都只會跑過 $`logN`$ 量級的節點數量 \n\t而我總共有 $`Q`$ 筆詢問\n\t複雜度即為明顯的 $`O(QlogN)`$\n\tMUCH BETTER THAN THE BRUTE FORCE ONE($`O(QN)`$)\n\t在 Q , N ≤ 2e5 的情況下大約是\n\t$`O(2e5 * 5)`$ = $`O(1e6)`$ 一般來說題目的時限完全是跑得完 🥳\n</details>\n---\n# 單點修改 區間查詢 {toggle=\"true\"}\n\t<table>\n\t<colgroup>\n\t<col width=\"239.66666666666666\">\n\t<col width=\"239.66666666666666\">\n\t<col width=\"239.66666666666666\">\n\t</colgroup>\n<tr>\n<td>修改/查詢</td>\n<td>單點</td>\n<td>區間</td>\n</tr>\n<tr>\n<td>單點</td>\n<td>~~一般陣列解決~~</td>\n<td><span color=\"green\">**線段樹**</span> BIT</td>\n</tr>\n<tr>\n<td>區間</td>\n<td>線段樹</td>\n<td>線段樹</td>\n</tr>\n\t</table>\n\t也就是線段樹<span color=\"green\">**最基礎**</span>的題目：\n\t[CSES - Dynamic Range Sum Queries](https://cses.fi/problemset/task/1648)\n\t我們知道如果暴力解一定炸\n\t那麼經過前面的<mention-page url=\"https://app.notion.com/p/33092ab76d4080199eaafc456a0f2fb7#3c492ab76d408015862cd4a07d0f3f6f\">引入概念</mention-page> 這邊就直接帶入線段樹的概念和解法\n\t啊寫一寫**~~哇操太多了~~** 我們直接開個新頁面\n\t<page url=\"https://app.notion.com/p/3c492ab76d40800ba2f5dd6bfd0026c1\">線段樹解法</page>\n\t<page url=\"https://app.notion.com/p/3c592ab76d4080e89bd3cc843caaa034\">應用層面…</page>\n# 區間修改 單點查詢 {toggle=\"true\"}\n\t<table>\n\t<colgroup>\n\t<col width=\"239.66666666666666\">\n\t<col width=\"239.66666666666666\">\n\t<col width=\"239.66666666666666\">\n\t</colgroup>\n<tr>\n<td>修改/查詢</td>\n<td>單點</td>\n<td>區間</td>\n</tr>\n<tr>\n<td>單點</td>\n<td>~~一般陣列解決~~</td>\n<td><span color=\"gray\">**~~線段樹~~**</span> BIT</td>\n</tr>\n<tr>\n<td>區間</td>\n<td><span color=\"green\">**線段樹**</span></td>\n<td>線段樹</td>\n</tr>\n\t</table>\n\t也就是線段樹<span color=\"green\">**偏進階**</span>的題目：\n\t[CSES - Dynamic Range Sum Queries](https://cses.fi/problemset/task/1648)\n\t我們知道如果暴力解一定炸\n\t那麼經過前面的<mention-page url=\"https://app.notion.com/p/33092ab76d4080199eaafc456a0f2fb7#3c492ab76d408015862cd4a07d0f3f6f\">引入概念</mention-page> 這邊就直接帶入線段樹的概念和解法\n\t啊寫一寫**~~哇操太多了~~** 我們直接開個新頁面\n\t<page url=\"https://app.notion.com/p/3c592ab76d4080679159f46e58253aab\">線段樹解法</page>"
  },
  {
    "id": "3e892ab76d40811faaedc77ac94b29e9",
    "title": "09-04 Sparse Table & RMQ",
    "details": "Coming soon",
    "difficulty": null,
    "domain": "09 Data Structures & Range Queries",
    "content": "",
    "notionUrl": "https://app.notion.com/p/3e892ab76d40811faaedc77ac94b29e9"
  },
  {
    "id": "33092ab76d40806a80b9c4a4d2d3fec0",
    "title": "10-01 Math Fundamentals",
    "details": "數論基礎",
    "difficulty": 3,
    "domain": "10 Math",
    "notionUrl": "https://app.notion.com/p/33092ab76d40806a80b9c4a4d2d3fec0",
    "content": "接下來要介紹的是競賽中常用的數學基礎工具 包括位元運算、模運算、GCD、質數篩、排列組合\n# Math 數論基礎\n## 簡介\n競賽程式用到的數學跟學校教的有一點不一樣\n主要是因為我們要在 ***電腦上算*** 所以會碰到幾個學校不會教的東西：\n1. **位元運算** ⇒ 用二進位的角度思考問題\n2. **模運算** ⇒ 因為數字太大要取餘數\n3. **快速冪** ⇒ 如何快速算 $`a^n`$ \n4. **質數 / 篩法** ⇒ 批量判斷質數\n5. **排列組合** ⇒ 算方案數\n## 位元運算 Bitwise\n先來最基本的 你可能在 C++ 中見過這些運算子但不知道在幹嘛\n### 基本運算子\n<table header-row=\"true\">\n<tr>\n<td>運算</td>\n<td>符號</td>\n<td>功能</td>\n<td>例子</td>\n</tr>\n<tr>\n<td>AND</td>\n<td>`a & b`</td>\n<td>兩個都是 1 才是 1</td>\n<td>`5 & 3 = 1` (101 & 011 = 001)</td>\n</tr>\n<tr>\n<td>OR</td>\n<td>`a \\| b`</td>\n<td>其中一個是 1 就是 1</td>\n<td>`5 \\| 3 = 7` (101 \\| 011 = 111)</td>\n</tr>\n<tr>\n<td>XOR</td>\n<td>`a ^ b`</td>\n<td>不同才是 1</td>\n<td>`5 ^ 3 = 6` (101 \\^ 011 = 110)</td>\n</tr>\n<tr>\n<td>NOT</td>\n<td>`~a`</td>\n<td>全部翻轉</td>\n<td>`~5 = -6` (要小心 跟補數有關)</td>\n</tr>\n<tr>\n<td>左移</td>\n<td>`a << k`</td>\n<td>乘以 $`2^k`$</td>\n<td>`3 << 2 = 12` (3 \\* 4)</td>\n</tr>\n<tr>\n<td>右移</td>\n<td>`a >> k`</td>\n<td>除以 $`2^k`$ (下取整)</td>\n<td>`12 >> 2 = 3`</td>\n</tr>\n</table>\n### 常用技巧\n<details>\n<summary>判斷第 k 個 bit 是不是 1</summary>\n\t```c++\nif (n & (1 << k))  // 第 k 個 bit 是 1\n\t```\n\t原理：`1 << k` 只有第 k 個 bit 是 1 其他都是 0 跟 n 做 AND 就只會留下第 k 個 bit\n</details>\n<details>\n<summary>拿掉最低位的 1 (lowbit)</summary>\n\t```c++\nn & (n - 1)   // 拿掉最低位的 1\nn & (-n)      // 只留最低位的 1 (BIT 用這個)\n\t```\n\t例如 `n = 12 = 1100` ⇒ `n & (n-1) = 1100 & 1011 = 1000`\n</details>\n<details>\n<summary>判斷是不是 2 的次方</summary>\n\t```c++\nif (n > 0 && (n & (n - 1)) == 0)  // 是 2 的次方\n\t```\n\t為什麼？因為 2 的次方的二進位只有一個 1 拿掉就變 0\n</details>\n<details>\n<summary>枚舉所有子集 (狀壓 DP 用)</summary>\n\t```c++\nfor (int mask = 0; mask < (1 << n); mask++) {\n\t// mask 代表一個子集\n\tfor (int i = 0; i < n; i++) {\n\t\tif (mask & (1 << i)) {\n\t\t\t// 第 i 個元素在子集中\n\t\t}\n\t}\n}\n\t```\n\t复雜度 $`O(2^n \\cdot n)`$ 所以 n 要小 (通常 n ≤ 20)\n</details>\n<details>\n<summary>__builtin 可以做什麼</summary>\n\t```c++\n__builtin_popcount(x)     // x 的二進位中有幾個 1\n__builtin_clz(x)          // 前導 0 的個數 (count leading zeros)\n__builtin_ctz(x)          // 後導 0 的個數 (count trailing zeros)\n__builtin_parity(x)       // 1 的個數是奇數還偶數 (1=奇)\n\t```\n\tlong long 版要加 `ll` 後綴：`__builtin_popcountll(x)`\n</details>\n<empty-block/>\n---\n## 輾轉相除法 GCD\n求兩個數的最大公因數\n### 核心\n$`gcd(a, b) = gcd(b, a \\% b)`$ 遞迴下去 當 `a == 0` 的時候 `gcd = b`\n<details>\n<summary>為什麼對？</summary>\n\t如果 d 是 a 和 b 的公因數 那 d 也是 b 和 a%b 的公因數\n\t反過來也成立 所以兩者的公因數集合完全相同\n</details>\n#### code<br> {toggle=\"true\"}\n\t```c++\nint gcd(int a, int b) {\n\treturn b == 0 ? a : gcd(b, a % b);\n}\n\t```\n\t其實 C++17 以後有 `__gcd(a, b)` 或 `#include <numeric>` 的 `gcd(a, b)` 可以直接用\n#### 延伸：LCM\n$`lcm(a, b) = \\frac{a \\times b}{gcd(a, b)}`$\n<details>\n<summary>小心溢位</summary>\n\t寫成 `a / gcd(a, b) * b` 而不是 `a * b / gcd(a, b)` 不然中間乘積可能 overflow\n</details>\n#### 延伸：擴展歐幾里得 (ExtGCD)\n給 a, b 求 x, y 使得 $`ax + by = gcd(a, b)`$\n<details>\n<summary>什麼時候用？</summary>\n\t1. 求模反元 (跟費馬小定理功能一樣 但不需要 p 是質數)\n\t2. 解線性同餘方程式\n\t3. 中國餘數定理 (CRT)\n</details>\n#### code<br> {toggle=\"true\"}\n\t```c++\nint extgcd(int a, int b, int &x, int &y) {\n\tif (b == 0) { x = 1; y = 0; return a; }\n\tint x1, y1;\n\tint g = extgcd(b, a % b, x1, y1);\n\tx = y1;\n\ty = x1 - (a / b) * y1;\n\treturn g;\n}\n\t```\n\t可以驗證：代入 `a=6, b=4` 應該得到 `x=-1, y=1` 因為 `6*(-1) + 4*1 = -2 + 4... 不對` 也就是 `6*1 + 4*(-1) = 2 = gcd(6,4)` 你自己試試看\n<empty-block/>\n---\n## Modulo 模運算\n這個超重要 競賽題目超愛出「答案對 $`10^9+7`$ 取模」\n### 基本規則\n<callout icon=\"💡\" color=\"blue_bg\">\n\t同餘下 加減乘都可以正常做 但是 <span color=\"red\">**除法不行**</span>\n\t- `(a + b) % p = (a%p + b%p) % p`\n\t- `(a * b) % p = (a%p * b%p) % p`\n\t- `(a - b) % p = (a%p - b%p + p) % p` ← 要加 p 避免變負\n\t- `(a / b) % p = ???` ⇒ 要用「模反元」\n</callout>\n### 常用模運算工具\n#### code<br> {toggle=\"true\"}\n\t```c++\nconst int MOD = 1e9 + 7;\nint mad(int a, int b) { return (a + b) % MOD; }\nint msb(int a, int b) { return (a - b + MOD) % MOD; }\nint mul(int a, int b) { return 1LL * a * b % MOD; }\n\t```\n\t<columns>\n\t\t<column>\n\t\t\t注意 `1LL * a * b` 避免 int 乘法 overflow\n\t\t</column>\n\t\t<column>\n\t\t\t<details>\n\t\t\t<summary>why 1LL</summary>\n\t\t\t\ta, b 都是 int 乘起來可能超過 $`2^{31}`$ 加 1LL 強制提升為 long long\n\t\t\t</details>\n\t\t</column>\n\t</columns>\n### 快速冪 (超常用)\n求 $`a^n \\mod p`$ 暴力乘 n 次是 $`O(n)`$ 太慢 用倍增法可以做到 $`O(\\log n)`$\n<callout icon=\"💡\" color=\"blue_bg\">\n\t核心思想：把 n 寫成二進位 然後逐位乘上去\n\t例如 $`a^{13} = a^{1101_2} = a^8 \\cdot a^4 \\cdot a^1`$\n</callout>\n#### code<br> {toggle=\"true\"}\n\t```c++\nint pw(int a, int b, int mod = MOD) {\n\tint res = 1;\n\ta %= mod;\n\twhile (b > 0) {\n\t\tif (b & 1) res = 1LL * res * a % mod;\n\t\ta = 1LL * a * a % mod;\n\t\tb >>= 1;\n\t}\n\treturn res;\n}\n\t```\n\t觀察一下\n\t<columns>\n\t\t<column>\n\t\t\t1. `b & 1` 判斷最低位是不是 1\n\t\t</column>\n\t\t<column>\n\t\t\t<details>\n\t\t\t<summary>why</summary>\n\t\t\t\t跟位元運算那邊一樣 判斷第 0 個 bit\n\t\t\t</details>\n\t\t</column>\n\t</columns>\n\t<columns>\n\t\t<column>\n\t\t\t1. `b >>= 1` 每次右移一位\n\t\t</column>\n\t\t<column>\n\t\t\t<details>\n\t\t\t<summary>why</summary>\n\t\t\t\t每輪處理一個 bit 總共處理 log(b) 個\n\t\t\t</details>\n\t\t</column>\n\t</columns>\n### 模反元 (模下的除法)\n我們定義 $`a^{-1}`$ 為滿足 $`a \\times a^{-1} \\equiv 1 \\pmod{p}`$ 的數\n<callout icon=\"⚠️\" color=\"red_bg\">\n\t$`a^{-1}`$ 不一定存在！例如 p=4, a=2 就沒有反元\n\t但如果 <span color=\"green\">**p 是質數**</span> 而且 <span color=\"green\">**a % p ≠ 0**</span> 那 $`a^{-1}`$ 一定存在\n</callout>\n<details>\n<summary>為什麼？費馬小定理</summary>\n\t費馬小定理：如果 p 是質數 那 $`a^{p-1} \\equiv 1 \\pmod{p}`$\n\t移項：$`a \\times a^{p-2} \\equiv 1 \\pmod{p}`$\n\t所以 $`a^{-1} = a^{p-2} \\mod p`$ ← 用快速冪算\n</details>\n#### code<br> {toggle=\"true\"}\n\t```c++\nint inv(int a) { return pw(a, MOD - 2); }\n\n// 模下的除法\nint mdiv(int a, int b) { return mul(a, inv(b)); }\n\t```\n\t就這樣 超簡單\n<empty-block/>\n---\n## 質數篩\n給一個範圍 C 問哪些是質數\n### 單個判斷 $`O(\\sqrt{C})`$\n```c++\nbool isPrime(int n) {\n\tif (n < 2) return false;\n\tfor (int i = 2; i * i <= n; i++)\n\t\tif (n % i == 0) return false;\n\treturn true;\n}\n```\n### 埃氏篩 (大量判斷) $`O(n \\log \\log n)`$\n<callout icon=\"💡\" color=\"blue_bg\">\n\t思想：從 2 開始 每找到一個質數 就把它的所有倍數全部標記為非質數\n</callout>\n#### code<br> {toggle=\"true\"}\n\t```c++\nconst int C = 1e7;\nvector<bool> isp(C+1, true);\nisp[0] = isp[1] = false;\nfor (int i = 2; i <= C; i++) {\n\tif (isp[i]) {\n\t\tfor (int j = i+i; j <= C; j += i)\n\t\t\tisp[j] = false;\n\t}\n}\n\t```\n\t觀察：內層迴圈只在 `isp[i] == true`（i 是質數）的時候才跑 這就是埃氏篩跟純暴力的差別\n<details>\n<summary>可以篩到多大？</summary>\n\t- $`C \\leq 10^6`$ ⇒ 約調級數篩 也可以\n\t- $`C \\leq 10^7`$ ⇒ 埃氏篩就是標準答案\n\t- $`C \\leq 10^9`$ 但只問一個 ⇒ 用 $`O(\\sqrt{C})`$\n\t- $`C \\leq 10^{18}`$ ⇒ Miller-Rabin (進階 之後再說)\n</details>\n### 質因數分解\n一個數 C 的質因數最多可以有幾個？$`O(\\log C)`$ 個\n#### code (暴力分解)<br> {toggle=\"true\"}\n\t```c++\nvector<pair<int,int>> factorize(int n) {\n\tvector<pair<int,int>> res;\n\tfor (int i = 2; i * i <= n; i++) {\n\t\tif (n % i == 0) {\n\t\t\tint cnt = 0;\n\t\t\twhile (n % i == 0) { n /= i; cnt++; }\n\t\t\tres.push_back({i, cnt});\n\t\t}\n\t}\n\tif (n > 1) res.push_back({n, 1});\n\treturn res;\n}\n\t```\n\t複雜度 $`O(\\sqrt{C})`$ 跟判斷質數一樣\n<details>\n<summary>如果要分解很多次？</summary>\n\t先蓋完埃氏篩 然後對每個數用最小質因子拆\n\t在篩的時候順便記 `spf[i]` = i 的最小質因子\n\t然後分解時一直除 `spf[n]` 直到 n = 1\n\t每次分解 $`O(\\log C)`$\n</details>\n<empty-block/>\n---\n## 排列組合\n計算方案數的核心工具 競賽超愛考\n### 階乘預處理\n計算組合數 $`C(n, k) = \\frac{n!}{k!(n-k)!}`$ 需要階乘和階乘反元\n#### code<br> {toggle=\"true\"}\n\t```c++\nconst int mxn = 2e5+5;\nint fac[mxn], ifac[mxn];\n\nvoid precompute() {\n\tfac[0] = 1;\n\tfor (int i = 1; i < mxn; i++)\n\t\tfac[i] = mul(fac[i-1], i);\n\t\n\tifac[mxn-1] = inv(fac[mxn-1]);\n\tfor (int i = mxn-2; i >= 0; i--)\n\t\tifac[i] = mul(ifac[i+1], i+1);\n}\n\t```\n\t<columns>\n\t\t<column>\n\t\t\t為什麼 `ifac` 要倍序算？\n\t\t</column>\n\t\t<column>\n\t\t\t<details>\n\t\t\t<summary>why</summary>\n\t\t\t\t因為 `inv()` 要跑快速冪 $`O(\\log p)`$ 很慢 如果每個都算是 $`O(n \\log p)`$\n\t\t\t\t但如果只算 `inv(fac[mxn-1])` 然後用 $`ifac[i] = ifac[i+1] \\times (i+1)`$ 倒推\n\t\t\t\t就只要 1 次 inv + $`O(n)`$ 乘法 超快\n\t\t\t</details>\n\t\t</column>\n\t</columns>\n### 組合數 C(n, k)\n```c++\nint C(int n, int k) {\n\tif (k < 0 || k > n) return 0;\n\treturn mul(fac[n], mul(ifac[k], ifac[n-k]));\n}\n```\n### 常見排列組合公式\n<table header-row=\"true\">\n<tr>\n<td>問題</td>\n<td>公式</td>\n</tr>\n<tr>\n<td>n 個事物取 k 個 (不考慮順序)</td>\n<td>$`C(n, k)`$</td>\n</tr>\n<tr>\n<td>n 個事物取 k 個 (考慮順序)</td>\n<td>$`P(n, k) = \\frac{n!}{(n-k)!}`$</td>\n</tr>\n<tr>\n<td>重複組合 (n 種取 k 個 可重複)</td>\n<td>$`H(n, k) = C(n+k-1, k)`$</td>\n</tr>\n<tr>\n<td>n 個球放 k 個相異箱 (球相異 箱相異)</td>\n<td>$`k^n`$</td>\n</tr>\n</table>\n<details>\n<summary>重複組合 H 為什麼是這個公式？</summary>\n\t想像成「n 種飲料取 k 杯」 可以用「隔板法」\n\t把 k 個球和 n-1 個隔板排在一起 總共 n+k-1 個位置中選 k 個放球\n</details>\n<empty-block/>\n---"
  },
  {
    "id": "33092ab76d408075bf02c0aecbacaf15",
    "title": "10-02 Number Theory & Modular Arithmetic",
    "details": "數論進階",
    "difficulty": 7,
    "domain": "10 Math",
    "notionUrl": "https://app.notion.com/p/33092ab76d408075bf02c0aecbacaf15",
    "content": "# 數論 \n> 基本上數論的事情和題目都是跟 ***模運算 ***有關\n## 模運算基礎東西 {toggle=\"true\"}\n\t**加減乘**\n\t```c++\nconst int mod = 1e9 + 7;\nint mad(int a, int b) {\n  a += b;\n  if (a >= mod) a -= mod;\n  return a;\n}\nint mub(int a, int b) {\n  if (a >= b) return a - b;\n  else return a + mod - b;\n}\nint mul(int a, int b) {\n  return 1ll * a * b % mod;\n}\n\t```\n\t**除**\n\t```c++\n參考模逆元\n等等再說\n\t```\n## 質數篩 {toggle=\"true\"}\n\t質數篩 顧名思義就是要篩出某範圍內的所有質數\n\t那麼當然有很多方法\n\t<details>\n\t<summary>1 Brute Force</summary>\n\t\t暴力判斷\n\t\t我們寫類似這種的東西：\n\t\t```c++\nbool isPrime(int N) {\n    for (int i = 2; i <= N - 1; i++) { // 檢查整個區間 [2, N - 1]\n        if(N % i == 0) {\n            return false;\n        }\n    }\n    return true;\n}\n\n\t\t```\n\t\t<details>\n\t\t<summary>複雜度顯然為 </summary>\n\t\t\t$`O(N)`$\n\t\t</details>\n\t\t$`太慢了太慢了`$…\n\t</details>\n\t<details>\n\t<summary>2 </summary>\n\t\t我們觀察 \n\t\t$`N = p * q`$ 當 $`p`$ 整除 $`N`$ → 那麼 $`q`$ 也可以整除 $`N`$ 啊 所以沒必要重複判斷 $`N`$ % $`q`$\n\t\t並且當 $`i`$ 已經不是 $`N`$ 的因數了 那麼 $`N/i`$ 也不會是啊\n\t\t而且根據 $`N = p * q`$ ⇒ $`p`$ 上升 $`q`$ 必下降 且交點在 $`p=q=\\sqrt{N}`$\n\t\t所以我們只要判斷到 $`[2,\\sqrt{N}]`$ 就好了 也可以說是判斷到 $`i * i ≤ N`$ 就好了不然如果回圈跑到 `i < sqrt(N)` 會有**浮點危機**…\n\t\t實作：\n\t\t```c++\nbool isprime(int n){\n\t\tfor(int i = 2 ; i * i <= n ; i++){\n\t\t\t\tif(n % i == 0) return 0;\n\t\t}\n\t\treturn 1;\n}\n\t\t```\n\t</details>\n\t<details>\n\t<summary>3 埃式篩</summary>\n\t\t我們看看剛剛的 2 法 如果有 Q 筆詢問問說某個數字是不是質數的話我們的複雜度\n\t\t會是：$`O(Q\\sqrt{N})`$ ***對吧***\n\t\t那改成考慮用建表的方式先把誰是質數誰不是標示好 然後每一次查詢 $`O(1)`$ 解就好了\n\t\t作法：\n\t\t> 如果把非質數都標示起來 其他就都是質數\n\t\t假設我們知道一個數 $`p`$ 是質數 我們可以把它到 $`N`$ 以前的倍數 $`(2p , 3p , 4p … )`$都標為非質數。最後剩下的就都是質數。\n\t\t實作：\n\t\t```c++\nbool prime[mxn+10]; // 每一項初始化為 1 (True)\nvoid pre(){\n\t\tprime[0] = 0,prime[1] = 0; // 國小數學\n\t\tfor(int i = 2 ; i * i <= mxn ; i++){\n\t\t\t\tif(prime[i]){\n\t\t\t\t\t\tfor(int j = i+i ; j <= mxn ; j += i){\n\t\t\t\t\t\t\t\tprime[j] = 0;\t\t\t\t\n\t\t\t\t\t\t}\n\t\t\t\t}\n\t\t}\n}\n\t\t```\n\t\t<details>\n\t\t<summary>**動畫：**</summary>\n\t\t\t[AlgoVista — 看見演算法](https://benjamin-shih-tw.github.io/algovista-algorithm-library/?lesson=prime-sieve)\n\t\t</details>\n\t\t<details>\n\t\t<summary>**們：**</summary>\n\t\t\t![](https://prod-files-secure.s3.us-west-2.amazonaws.com/18192ab7-6d40-8113-8b36-0003bf3444bb/1048b6c0-ff46-428a-8695-032a095150d9/Sieve_of_Eratosthenes_animation.gif?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U4SGEWUB%2F20260927%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260927T150616Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIHBsenmYTa6UbVyyQvsy9%2BnMLJVZua4yPvbUY0T7iNrSAiEA2Kd2lSDBNIkp45%2F3d5erwtImhK3N5OlybRgfk6pSjK8q%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDH7S%2BRbgTHP89vJhISrcA7do8OnkpnVC5IPeNcIvMFUggA9kNU2Pf8bwp%2BWTPAOfOlXhZ7f6CUl6tTQy6XLJlGf%2FTxieR1pAwOIrmO%2FUfrRkmtsIVXYv2RakCvcji1%2BAA2xus%2F3jd5sdq1ao%2BnoswJNKRlwApZOW%2Fb9sY%2FtJM2StqLWikhSor4JciYj4j%2Bt8mUv%2BrINK6ZZ0SQzpVlcAr9dVvG0IyI3ta3Mvy3uYYG60heHbGPJj%2BqhUjLsWOsYbtrY8L97kZL9cTpJBAqxQhRGOOV9WUQ%2F5eGcitfrvcd7YOOWIFcsnOd6VSYWFvnAN87eDPMgBgNX8PcFPPLtfANxfrXVjBHd5NQ%2F6QkqbPcUpT6bfkRia7FrAzh63sFoIVelSO%2FW9G3qiWOsqm%2FVqJfex6v5OTPiBiDZqSLYlXLI7r6BXePJ%2BDRbgso44sK5qW3diIOzVTpaMeHGeUoc0Y5e9UTCCaZtMBkdcJMutzz2i1r6IhiHIWe6pkD6AF%2FSbPpaVW5ktuGlRRL5Ph6Deodg7sMqKVC6cUPVsaJn67%2Fs2fAP46xwNS7t3scOfmIAZ%2BbzxP%2Bt9gOl511gd4nITUSiQIzxOn1g1Ic4H6qJAj7UcDD%2FHyZ7d8BTMqFLwA237pakHvdU7W4IUQ%2BHHMOiL5NUGOqUB1MPQF7o8lz4mVk3tryRZJS%2BKJGNGCapGugB4cvhXkbjIMvqgu5ov4P0dq5OcNy5Cncgd%2FqBj1zeMTda%2F9bXC%2Fg4k5stXNj4JsL0Kr9fXx0WRhsp7I2RQxWs4LYgS6ML%2Bsv6aHm1%2BdT55LgvviOI%2BwXF4QTrAnDBUrJWwPZ1QhyAcXrzNpgzocuz7%2BMqFg9rlqtf5jnl1HHEyKqFVBmjb7W%2BnSgv7&X-Amz-Signature=42d203e81f3e236c92fc61d1d364b472a523610c869dffcfaa7b393154eef188&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)\n\t\t</details>\n\t\t複雜度大解密：\n\t\t\t建表：時間→$`O(N\\cdot \\log \\log \\sqrt{N})`$ 空間→$`O(N)`$\n\t\t\t查詢：$`O(Q)`$\n\t</details>\n## 找因數 {toggle=\"true\"}\n\t太簡單了 直接看 code\n\t```c++\n// edited by Gemini ...\n#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    long long n;\n    cin >> n;\n    \n    vector<long long> f;\n    for (long long i = 1; i * i <= n; ++i) {\n        if (n % i == 0) {\n            f.push_back(i);\n            if (i * i != n) f.push_back(n / i);\n        }\n    }\n    \n    sort(f.begin(), f.end());\n    \n    for (long long x : f) cout << x << \" \";\n}\n\n\t```\n## 快速冪 {toggle=\"true\"}\n\t如果想算 $`a^b`$ 要怎麼搞\n\t<details>\n\t<summary>1 brute force $`O(b)`$</summary>\n\t\t```c++\nint cnt = 0;\nwhile(cnt < b){\n\t\ta *= b;\n}\n\t\t```\n\t</details>\n\t<details>\n\t<summary>2 壓複雜度 $`O(log b)`$</summary>\n\t\t我們考慮看看壓到線性以下的方法\n\t\t其一即為 壓成 $`log`$\n\t\t常見壓成 $`log`$ 的方法有兩種\n\t\t\t**一種為運用 **$`2^n`$** 的概念**\n\t\t\t**一種為運用 二分搜的方式一直 **$`n/2`$** 我也不太會講**\n\t\t這邊用的是 $`2^n`$ 的概念：\n\t\t<callout icon=\"💡\">\n\t\t\t<span color=\"yellow\">**我們利用 **</span>$`2^n = 2^{n-1} \\times 2^{n-1}`$<span color=\"yellow\">** 的拆解概念，可以進一步延伸出利用位元或是遞迴來加速計算的想法。當我們要計算 **</span>$`a^b`$<span color=\"yellow\">** 時，如果每次都把指數 **</span>$`b`$<span color=\"yellow\">** 減 1，時間複雜度會是 **</span>$`O(b)`$<span color=\"yellow\">**；但如果我們改用「折半」的想法，就能將時間複雜度降到 **</span>$`O(\\log b)`$<span color=\"yellow\">**。**</span>\n\t\t\t<span color=\"yellow\">**也就是說 我算完 **</span>$`a^b`$<span color=\"yellow\">** 後我去遞迴算 **</span>$`a^{b/2}`$<span color=\"yellow\">** ⇒ 因為 **</span>$`a^b = a^{b/2} * a^{b/2}`$\n\t\t\t\t<span color=\"yellow\">**我算 **</span>$`a^{b/2}`$<span color=\"yellow\">** 時繼續算 **</span>$`a^{b/4}`$\n\t\t\t\t<span color=\"yellow\">**然後這樣 可以壓成 **</span>$`O(logb)`$\n\t\t\t\t<details>\n\t\t\t\t<summary><span color=\"yellow\">問題</span></summary>\n\t\t\t\t\t如果 b 是奇數呢 這樣 ÷2 不會損失資源嗎？\n\t\t\t\t\t答案是 $`會`$ 啊 所以要考量進去：\n\t\t\t\t\t\t如果 `b % 2 == 1` 的話我們就先幫要回傳回去的答案 \n\t\t\t\t\t\t\\*$`= a`$\n\t\t\t\t\t\t再乘上 $`a^{b/2}`$ \\* $`a^{b/2}`$\n\t\t\t\t</details>\n\t\t\t<span color=\"yellow\">**小練習：**</span>\n\t\t\t\t<span color=\"yellow\">請用紙筆推導以下次方的算法過程和遞迴過程：</span>\n\t\t\t\t\t1. $`2^6`$\n\t\t\t\t\t2. $`5^8`$\n\t\t\t\t\t3. $`3^9`$\n\t\t\t<span color=\"yellow\">**現場解答**</span>\n\t\t\t<span color=\"yellow\">**程式碼實作範例**</span>\n\t\t\t```c++\nlong long power(long long a, long long b) {\n    if (b == 0) return 1; // 國中數學\n  \n    long long x = power(a, b / 2); \n    \n    if (b % 2 == 0) {\n        return x * x;    \n    } else {\n        return x * x * a; // 如果 b 次方是奇數\n    }\n}\n\n\t\t\t```\n\t\t\t<span color=\"yellow\">**重點整理**</span>\n\t\t\t- <span color=\"yellow\">**運作方式**</span><span color=\"yellow\">：每次迴圈或遞迴都讓指數減半（</span>$`b / 2`$<span color=\"yellow\">），因此最多只需要進行 </span>$`\\log_2 b`$<span color=\"yellow\"> 次計算。</span>\n\t\t\t- <span color=\"yellow\">**適用情境**</span><span color=\"yellow\">：當 </span>$`b`$<span color=\"yellow\"> 非常大（例如 </span>$`10^{18}`$<span color=\"yellow\"> 這種級別）時，線性方法會逾時，必須使用這種 </span>$`O(\\log b)`$<span color=\"yellow\"> 的方法來優化。</span>\n\t\t\t<span color=\"yellow\">**我習慣的寫法 （**</span><span color=\"yellow\">**~~就看想怎麼寫就怎麼寫~~**</span>\n\t\t\t```c++\nlong long power(long long a, long long b){\n    long long res = 1;\n    while (b > 0) {\n        if (b & 1) res = res * a;\n        a = a * a;\n        b >>= 1;\n    }\n    return res;\n}\n\t\t\t```\n\t\t</callout>\n\t</details>\n## **輾轉相除法,GCD** {toggle=\"true\"}\n\t> 眾所皆知他用來算最大公因數\n\t原理可以自己查\n\t直接看一眼實作就好\n\t```c++\nint GCD(int a, int b) {\n  if (a > b) swap(a, b);\n  if (!a) return b;\n  else return GCD(b, a % b);\n}\n\t```\n\t這東西不重要到我後來都沒在寫了因為基本上編譯器都支援 \n\t```c++\nstd::gcd(a,b)\n\t```\n\t這個東西\n\t所以直接硬剛就好了\n\t**~~但還是要會寫和知道原理就是了~~**\n## **LCM** {toggle=\"true\"}\n\t> 眾所皆知 LCM(a,b) = a \\* b / gcd(a,b)\n\t真的就這樣而已…\n\t```c++\nint lcm(int a,int b){\n\t\treturn a * b / gcd(a,b);\n}\n\t```\n## 排列組合 相關東西 {toggle=\"true\"}\n\t### 階乘\n\t首先題目通常會用到 $`n! | n ≤ 1e7`$ 之類的東西\n\t所以有點基本常識就知道需要取 mod \n\t不然你 n = 10 再上去就炸了\n\t**應用的話應該大家都會我就不廢話**\n\t實作上會用建表的方式 先把 `fac[i]` 建好 → 代表 $`i!`$\n\t```c++\nint fac[mxn];\nfac[0] = 1;\nfor (int i = 1; i < mxn; i++) {\n\t  fac[i] = (fac[i-1] * i) % mod;\n}\n\t```\n\t### 問題\n\t不是啊可是如果我要算\n\t$`C(n,k)`$ 我又不能寫：\n\t```c++\nint C(int n,int k){\n\t\treturn fac[n] / (fac[k] * fac[n-k]);\n}\n// 欸幹這是錯的喔\n\t```\n\t因為都已經取模過了除法會壞掉\n\t<page url=\"https://app.notion.com/p/3d392ab76d4080bfb9beefb2110d5322\">詳細原因</page>\n\t所以需要改成先建表模逆元：\n\t```c++\nint inv(int x){\n\t\treturn power(x,mod-2);\n}\nifac[mxn-1] = inv(fac[mxn-1]);\nfor (int i = mxn-2; i >= 0; i--) {\n\t  ifac[i] = (ifac[i+1] * i+1) % mod;\n}\n\t```\n\t再算\n\t```c++\nint C(int n,int k){\n\t\treturn fac[n] * ifac[k] % mod * ifac[n-k] % mod;\n}\n// 欸幹這才是對的喔\n\t```\n<empty-block/>"
  },
  {
    "id": "3e892ab76d4081cfb499c9e8ab05a172",
    "title": "10-03 Combinatorics",
    "details": "Coming soon",
    "difficulty": null,
    "domain": "10 Math",
    "content": "",
    "notionUrl": "https://app.notion.com/p/3e892ab76d4081cfb499c9e8ab05a172"
  },
  {
    "id": "3e892ab76d40814a87f5d65fd9b9e353",
    "title": "10-04 Matrix Exponentiation",
    "details": "Coming soon",
    "difficulty": null,
    "domain": "10 Math",
    "content": "",
    "notionUrl": "https://app.notion.com/p/3e892ab76d40814a87f5d65fd9b9e353"
  },
  {
    "id": "33092ab76d40802e8b3fe81a23b44576",
    "title": "11-01 Geometry Basics",
    "details": "計算幾何介紹",
    "difficulty": 8,
    "domain": "11 Geometry",
    "content": "",
    "notionUrl": "https://app.notion.com/p/33092ab76d40802e8b3fe81a23b44576"
  },
  {
    "id": "3e892ab76d40810f8e8ec16f2dc7a6ee",
    "title": "11-03 Convex Hull",
    "details": "Coming soon",
    "difficulty": null,
    "domain": "11 Geometry",
    "content": "",
    "notionUrl": "https://app.notion.com/p/3e892ab76d40810f8e8ec16f2dc7a6ee"
  },
  {
    "id": "33092ab76d408067a9b3c3459edb680a",
    "title": "12-01 String Basics",
    "details": "字串基礎知識",
    "difficulty": 2,
    "domain": "12 Strings",
    "content": "",
    "notionUrl": "https://app.notion.com/p/33092ab76d408067a9b3c3459edb680a"
  },
  {
    "id": "33092ab76d4080e396c2d21276ba88db",
    "title": "12-02 String Hashing",
    "details": "字串演算法",
    "difficulty": 7,
    "domain": "12 Strings",
    "content": "",
    "notionUrl": "https://app.notion.com/p/33092ab76d4080e396c2d21276ba88db"
  },
  {
    "id": "3e892ab76d4081f8ad7aedb667c615ba",
    "title": "12-03 Suffix Structures",
    "details": "Coming soon",
    "difficulty": null,
    "domain": "12 Strings",
    "content": "",
    "notionUrl": "https://app.notion.com/p/3e892ab76d4081f8ad7aedb667c615ba"
  }
]);
