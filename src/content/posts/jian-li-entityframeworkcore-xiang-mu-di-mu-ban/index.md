---
title: 建立EntityFrameworkCore项目的模板
published: 2026-05-16
category: 技术
tags:
  - .NET
  - EntityFrameworkCore
  - PostgreSQL
  - Aspire
---

建立通用 `AppHost`项目

先在 `Program.cs`中配置好数据库连接

```csharp
builder.AddNpgsqlDbContext<TasksContext>("Default-PostgreSQL", configureDbContextOptions: option =>
{
});
```

然后在 `appsettings.json`中添加数据库连接字符串

```json
{
  // ...
  "ConnectionStrings": {
    "Default-PostgreSQL": "..."
  }
}
```

编写 `DbContext` 如下

```csharp
using Microsoft.EntityFrameworkCore;

public class ExampleContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<ExampleRecordType> Records { get; set; }
}

```

使用 `dotnet-tools`初始化数据库（建立初始化迁移）

```powershell
dotnet ef migrations add InitialCreate
dotnet database update
```
