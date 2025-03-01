---
title: 「RAV Endpoint Protection」我测你的码
date: 2023-02-04 19:48:55
categories: 
- 日常
tags:
- 捆绑软件
- 电脑
- 技术
---

## 经过
在爬一个app的api时 无意间发现了一个奇怪的东西
```
s1 = 3dd69923c5041f4259b5a81b4cd17226
s2 = 13cwmSwE72FR83aziyDpZxLPptygJpqcE6
```
当我复制s1的内容再粘贴时 会变成s2的内容
剪贴板的内容也是s2
于是我很快进行了一些测试 得出了这样的结论
当复制的内容中有一行文字以s1开头时 复制的内容中所有的s1都会被替换为s2
写成代码是这样
```C#
var s1 = "3dd69923c5041f4259b5a81b4cd17226";
var s2 = "13cwmSwE72FR83aziyDpZxLPptygJpqcE6";
if (text.Split('\n').Any(line => line.StartWith(s1)))
{
    text = text.replace(s1, s2);
}
```

为了进行更多的测试 我重启了电脑
这时候就没有这个问题了
当我打开QQ后 这个问题又出现了 于是我断定是QQ搞的鬼
但另一个我不得不注意到的是 打开QQ和登录时有明显的卡顿 甚至假死了一会
按理说我的电脑还没有差到这种地步（事实上性能还可以 而且这是刚开机的时候）
我又联想到刚才翻Geek看程序列表时发现的一个新东西 「RAV Endpoint Protection」

在进行了一些搜索之后 我又断定就是这个B搞的问题
网友对于这个东西的评价是「比360还毒的流氓软件」（这个东西表面上也是一个杀毒软件）
占用很大的资源 而且不好删掉
基本上都是在下载Cheat Engine和BitComet的时候被捆绑安装的
看到这里我就瞬间理解了 因为我早上刚好装了新版本的BitComet
从而带来了这个东西

用一些常规手段将其删除后 我又重启了电脑
这一次再也没有出现这个问题了

## 总结
「RAV Endpoint Protection」傻逼
捆绑安装的流氓软件之流傻逼
一切损害用户正常使用体验的应用/厂商傻逼