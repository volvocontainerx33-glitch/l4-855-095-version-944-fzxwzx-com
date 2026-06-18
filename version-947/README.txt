部署说明
========

1. 本 ZIP 已生成纯静态电影网站，共解析影片 2000 部。
2. 所有 HTML 页面均已插入百度统计代码，代码不会作为页面文字显示。
3. ZIP 包不包含 JPG 图片。请将 1.jpg 到 150.jpg 放在网站顶级目录，与 index.html 同级。
4. 第 N 部影片使用图片 X.jpg，其中 X = ((N - 1) % 150) + 1。
5. 详情页播放器使用 assets/site.js 与 assets/hls-dru42stk.js 初始化 HLS 播放。
6. 入口页面：index.html、categories.html、ranking.html、search.html。
