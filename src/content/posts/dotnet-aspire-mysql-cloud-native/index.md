---
title: 从.NET Aspire看MySQL在云原生时代的退位
published: 2026-04-07
category: 技术
tags:
  - .NET
  - Aspire
  - MySQL
  - 云原生
  - PostgreSQL
---

# 介绍

![image-JWXs.png](/images/image-JWXs.png)

图源：[https://db-engines.com/en/ranking\_trend](https://db-engines.com/en/ranking_trend)

作为常年稳居 `DB-Engines` 榜单前三的 `MySQL` 自然不必过多介绍 可以说是它推动了关系型数据库的普及

`.NET Aspire` （在 2025 年 11 月发布的 Aspire 13 版本中，微软正式将其名称从`.NET Aspire`更改为`Aspire`）是新兴的开源应用平台，旨在简化云原生及分布式应用的开发、部署与运维。

这两者的"强强联手"想必能碰撞出明亮的技术火花，是云原生领域的又一力作。然而事实真的如此吗？

# 记录

准备将`.NET Aspire` 示例项目通过 `EF Core`连接到本地`MySQL` 数据库时 在[Aspire官网](https://aspire.dev)的Integrations中只找到了 `Aspire.Pomelo.EntityFrameworkCore.MySql` 这一个支持包

连官方社区的 `Community.Toolkit` 都谈不上 仅仅是一个第三方组织 `Pomelo` 的包 而且一看仓库最新commit都是8个月前了 nuget上也还是.NET8的包抱着试一试的心态还是装上了 并尝试与本地.NET10环境强行兼容

果然还是寄了

```log
warning NU1608: 检测到的包版本在依赖项约束之外: Pomelo.EntityFrameworkCore.MySql 9.0.0 需要 Microsoft.EntityFrameworkCore.Relational (>= 9.0.0 && <= 9.0.999)，但版本 Microsoft.EntityFrameworkCore.Relational 10.0.5 已解决。
```

但这个Warning其实不是直接原因 实际上的Error是`Method not found: 'System.String Microsoft.EntityFrameworkCore.Diagnostics.AbstractionsStrings.ArgumentIsEmpty(System.Object)'`

到API Reference里查了一下发现一个神奇的breaking change

[Entity Framework Core 9.0](https://learn.microsoft.com/en-us/dotnet/api/microsoft.entityframeworkcore.diagnostics.abstractionsstrings.argumentisempty?view=efcore-9.0)

```csharp
public static string ArgumentIsEmpty(object? argumentName);
```

[Entity Framework Core 10.0](https://learn.microsoft.com/en-us/dotnet/api/microsoft.entityframeworkcore.diagnostics.abstractionsstrings.argumentisempty?view=efcore-10.0)

```csharp
public static string ArgumentIsEmpty { get; }
```

可以看出`ArgumentIsEmpty` 的签名不声不响地从方法变成了属性 并且文档中并没有相关说明

而相关包因故没有跟上这个变化 从而导致使用命令行工具`dotnet-ef` 初始化数据库时出错

核心包`Pomelo.EntityFrameworkCore.MySql` 的issue列表中 最新一条即为吐槽更新不及时导致无法连接到新版MySQL实例

# 总结

社区生态活跃度是衡量一个项目或框架的重要指标 像这样的"无人管理"反映了MySQL在Aspire中的边缘化 以至于在整个关系型数据库和云原生领域的淡化

> MySQL 本来就是仓促赶出来的半成品，至今如此
>
> 它甚至不能保证你数据不会丢

> MySQL 一个事务都有致命深坑的垃圾数据库还是尽早抛弃的好

群友的态度也说明了问题

是时候转到PostgreSQL了
