---
title: 学校OJ探索
cover: https://s2.loli.net/2024/06/15/aZU2qG45iOB6A9F.png
top_img: https://s2.loli.net/2024/06/15/aZU2qG45iOB6A9F.png
date: 2024-04-26 22:55:54
categories:
- 技术
tags:
- 技术
- 生活
- 学校
- OJ
---

社团课上与同学玩学校OJ 并尝试对评测机进行一些探索 为了方便就用python代码了
已知学校OJ使用的是氦星人系统 评测机禁用了`os`模块 导致一开始没法进行系统调用 遂尝试读写文件 发现居然是可以的
（`socket`模块依赖`os`模块 导致暂时只能通过OJ的测试功能获取代码输出）
先尝试硬写大量数据以搞爆评测机 发现会报`File too large`错误 于是放弃
根据平时使用经验（做题时的报错）得知评测机为`Linux`系统 使用Python3.8
然后尝试向`/tmp`目录写文件 发现可以持久化保存 并且另一位同学也能读取到（顺便根据多次实验发现能读取到的概率大约50% 推测有两个评测机负载均衡）
之后尝试读取`/proc`等以获取系统信息 如下
| 信息 | 来源 | 值 |
|:---:|:---:|:---:|
| CPU | `/proc/cpuinfo` | Intel(R) Xeon(R) Gold 5120 CPU @ 2.20GHz |
| 内存 | `/proc/meminfo` | 16GB |
| 硬盘分区 | `/proc/partitions` | 104857600 blocks (sda)... （按1KB/block则为100GB） |
| 启动镜像 | `/proc/cmdline` | vmlinuz-3.10.0-1127.10.1.el7.x86_64 |
| 内核版本 | `/proc/version` | Linux version 3.10.0-1127.10.1.el7.x86_64 (mockbuild@kbuilder.bsys.centos.org) |
| GCC版本 | `/proc/version` | gcc version 4.8.5 20150623 (Red Hat 4.8.5-39) (GCC) |
| 运行时间 | `/proc/uptime` | 运行：788.4天；空闲：784.2天/核心（空闲率99.46%） |

回家后同学发现可以使用`posix`模块进行系统调用 并且该模块没有被禁用 于是打开新世界的大门

首先肯定是是`ls` 当前目录包含`source`、`source.c`、`input`、`core.xxxxx`等文件
其中`source`就是python代码的源文件 `cat`后发现评测时会在提交的python代码前加上如下代码：
``` python
import random
import sys
sys.modules["os"] = None
```
`source.c`和`core.xxxxx`分别是C++程序的源代码和编译后的程序
input则为测试输入



../../../rwl/okcall.h -> HUSTOJ

后记：
C++没禁用系统调用 这下舍近求远了