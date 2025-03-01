---
title: CSharp随笔-癫疯之作
date: 2023-07-13 21:06:30
cover: https://s2.loli.net/2023/07/13/YWt7ZAgxSCf5G3n.png
top_img: https://s2.loli.net/2023/07/13/YWt7ZAgxSCf5G3n.png
categories: 
- 技术
tags:
- 技术
- .NET
- C#
- 函数式
---

起因是写了这样一段代码
```C#
if (e.Action == System.Collections.Specialized.NotifyCollectionChangedAction.Add)
{
    string ipString = string.Join("，", e.NewItems.Cast<IWebSocketConnection>().Select(x => x.ConnectionInfo.ClientIpAddress));
    WeakReferenceMessenger.Default.Send<DisplayAlertMessage>(new("有新用户连接", ipString));
}
else if (e.Action == System.Collections.Specialized.NotifyCollectionChangedAction.Remove)
{
    string ipString = string.Join("，", e.OldItems.Cast<IWebSocketConnection>().Select(x => x.ConnectionInfo.ClientIpAddress));
    WeakReferenceMessenger.Default.Send<DisplayAlertMessage>(new("有用户断开连接", ipString));
}
else
{
    throw new InvalidOperationException("不支持此类操作");
}
```
这里显然是可以复用一下的 而我又正好想到了C#的新特性 模式匹配
于是有了下面这段@#%&$%$%&#@%&
```C#
WeakReferenceMessenger.Default.Send<DisplayAlertMessage>(((Func<(string, System.Collections.IList), (string, string)>)(t => (t.Item1, string.Join("，", t.Item2.Cast<IWebSocketConnection>().Select(x => x.ConnectionInfo.ClientIpAddress)))))(e.Action switch
{
    System.Collections.Specialized.NotifyCollectionChangedAction.Add => ("有新用户连接", e.NewItems),
    System.Collections.Specialized.NotifyCollectionChangedAction.Remove => ("有用户断开连接", e.OldItems),
    _ => throw new InvalidOperationException("不支持此类操作")
}).ToDisplayAlertMessage());
internal static class ValueTupleExtensions // C#不能把Tuple展开成多个参数 :(
{
    public static DisplayAlertMessage ToDisplayAlertMessage(this ValueTuple<string, string> tuple)
    {
        return new DisplayAlertMessage(tuple.Item1, tuple.Item2);
    }
}
```