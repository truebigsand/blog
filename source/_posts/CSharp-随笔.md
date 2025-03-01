---
title: C#随笔
date: 2023-06-22 20:57:57
categories: 
- 技术
tags:
- 技术
- .NET
- C#
---

最近写项目的时候用到这样一段代码
```C#
Console.WriteLine(
    string.Join('\n', (await api.Download(3174))
        .Split('\n')
        .Where(
            line => !string.IsNullOrWhiteSpace(line)
        )
    )
);
```
理想情况下中间打算写成`.Where(!string.IsNullOrWhiteSpace)`
但是C#好像不支持这样的运算符重载
于是写一个函数处理一下
```C#
public static class Functional
{
    public static Func<T, bool> Not<T>(Func<T, bool> func)
    {
        return (T para) =>
        {
            return !func(para);
        };
    }
}
```
然后就可以做到这样的效果
```C#
Console.WriteLine(
    string.Join('\n', (await api.Download(3174))
        .Split('\n')
        .Where(
            Functional.Not<string>(string.IsNullOrWhiteSpace)
        )
    )
);
```
PS: 不知道为什么C#推不出来泛型的类型 必须手动加上`<string>`
ASS: 打算扩充一下Functional类 做成常用库