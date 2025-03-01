---
title: 【解决方案】Visual Studio写C/C++时没有语法高亮
top_img: https://s2.loli.net/2023/04/05/9f4s1dgCz5Kj3bS.png
cover: https://s2.loli.net/2023/04/05/zSn2H64EaYbuZV9.png
date: 2023-04-05 19:24:07
categories:
- 技术
tags:
- 技术
- Visual Studio
---

最近突然用VS写了一下C，发现没有语法高亮了，非常难受，如图
![](https://s2.loli.net/2023/04/05/zSn2H64EaYbuZV9.png)
解决方案如下
在 `工具->选项->文本编辑器->C/C++->高级`中
将`禁用语义着色`设为`False`
然后就恢复了
![](https://s2.loli.net/2023/04/05/9f4s1dgCz5Kj3bS.png)