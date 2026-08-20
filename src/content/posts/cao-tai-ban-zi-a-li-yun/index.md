---
title: 草台班子阿里云
published: 2026-08-13
draft: true
category: 技术
tags:
  - 阿里云
  - ESA
  - MCP
  - 吐槽
  - AI记录
---

前情提要:我把博客搬到了阿里云 ESA(Edge Security Acceleration,就是阿里云版的"边缘安全加速"),又开了个 AI 助手(ZCode)想让它直接查 ESA 的监控数据。于是花了整整一天,和阿里云这个草台班子斗智斗勇。

先说结论:东西最后是跑通了,但过程之草台,值得记录下来给大家避雷。

## 起因

我的博客域名的 DNS 是 Cloudflare 管的,但站点本身套了阿里云 ESA(其实这两家现在都能看到这个域名的记录,堪称赛博双修)。既然流量数据都在 ESA 这边,我就想让 AI 助手帮我查流量、PV、请求数,别每次想看数据都得开网页点半天。

思路很简单:阿里云官方有 MCP server,本地起一个 proxy,AI 就能直接调阿里云 API。建个 RAM 子用户,授个只读权限,完事。

## 坑一:老接口,新接口,傻傻分不清楚

先说 DCDN。阿里云老的全站加速(DCDN)和新的 ESA 长得几乎一模一样,监控接口也长得一模一样——**除了一个细节:老接口根本调不通**。

我按 DCDN 的文档去调,报错 `DcdnServiceNotFound`。意思是:你没开通 DCDN 服务。可我明明开通的是 ESA 啊?阿里云你是把两个产品当同一个卖的,监控 API 却不互通?

答案:ESA 的监控必须走新版端点 `esa.cn-hangzhou.aliyuncs.com`。注意,不是 `esa.aliyuncs.com`——**这个端点根本不存在**。官网文档里写的端点地址,你直接抄,是抄不到的。我也不知道该说什么好。

## 坑二:官方仓库里根本没有监控工具

打开阿里云官方的 mcp-server-esa 仓库,心想这回总该齐全了吧?结果翻了一圈:部署、DNS、证书管理,工具倒是有,**监控数据工具一个没有**。

好家伙,域名控制台里最大的功能就是看监控,你的 MCP server 反而不做监控。合着这仓库是给"部署工具"部门交差用的。

没办法,只能自己写。好在我要的接口不多,拿 FastMCP 把 `DescribeSiteTimeSeriesData`(流量/请求/PV)、`DescribeSiteTopData`(按国家/IP/状态码 TOP)、WAF 和 DDoS 那几个接口封装了一下,本地起了个 MCP server,秒上线。

## 坑三:官方 proxy 在 Windows 上直接死锁(最大的坑)

工具写好了,接上阿里云官方的 alibabacloud-mcp-proxy,启动,连接 `/mcp` 端点——**挂起,永久挂起,连超时都没有**。

一开始我以为是我配置问题,折腾了俩小时。后来发现不对:`/sse` 端点完全正常,4.5 秒返回 15 个工具,就是 `/mcp` 死。

扒源码一看,笑得我肚子疼。proxy 里有个 `session_marker.find_agent_pid()`,用于标识会话进程,实现是:

```python
subprocess.check_output(["ps", ...])
```

**在 Windows 上执行 `ps`**。是的,阿里云在 Windows 平台上跑 `ps` 命令查询 Windows 的 PID,而且 `check_output` **没设超时**,查不到就永远挂着。更妙的是,这个同步调用还跑在 asyncio 事件循环的线程里,一挂,整个 proxy 直接死锁。

Git Bash 环境里的 MSYS `ps` 去查 Windows PID,查不到,不退出,不报错,就愣着。什么降级处理、平台判断、超时保护,统统没有。我猜他们在 Linux/Mac 上测试过,然后就当全世界都用 Unix 了。

排查过程里我还试过给本地打一个 `timeout=5` 的补丁绕过,好使是好使,但修完一想:官方这 bug 就摆在那,不如顺手提个 PR 修了,惠及后人。

## 顺手修了个 PR

给 [aliyun/alibabacloud-api-mcp-server](https://github.com/aliyun/alibabacloud-api-mcp-server) 提了 [PR #29](https://github.com/aliyun/alibabacloud-api-mcp-server/pull/29):`find_agent_pid()` 改用 **psutil** 统一跨平台 API,Windows 和 Unix 一套代码,大约 160ms 出结果,彻底消灭 subprocess 挂起风险。`.exe` 后缀和大小写也做了归一化处理。测试 7+121 全过。

期间还踩了个小坑:GitHub 的 `api.github.com` 得直连,走代理反而超时;而 `git push` 和 `gh` 又得走代理。一台机器,两套网络姿势,也不知道是谁的锅。

## 草台班子总结

回头盘一下这一天的战果:

- 老产品 DCDN 没开通,报错也不说清楚该用哪个产品 → 草台
- 文档里的端点 `esa.aliyuncs.com` 不存在 → 草台
- 官方 MCP 仓库没有监控工具 → 草台
- 官方 proxy 在 Windows 上执行 `ps` 且无超时,直接死锁 → 相当草台
- 但最后:我自己的工具 + 官方 proxy 的 `/sse` 端点,跑通了 → 能跑

这就是阿里云:你说它不行吧,它啥都有;你说它行吧,处处是坑。好消息是,我现在跟 AI 说一句"查一下最近 7 天流量",数据就来了。这大概就是草台班子的浪漫吧。

再见了您嘞。
