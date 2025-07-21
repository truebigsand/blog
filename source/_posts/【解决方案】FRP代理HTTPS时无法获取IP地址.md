---
title: 【解决方案】FRP代理HTTPS时无法获取IP地址
date: 2025-07-21 12:22:35
categories:
- 技术
tags:
- 技术
- 解决方案
- FRP
---

## 背景
通过FRP内网穿透本地的SpeedTest-X服务 HTTP访问时能获取正确的IP 但HTTPS访问时IP为`127.0.0.1`

## 解决方案
使用`Proxy Protocal`

``` toml
# frpc.toml
    [[proxies]]
    name = "web-https"
    type = "https"
    localIP = "127.0.0.1"
    localPort = 443
    customDomains = ...
    transport.proxyProtocolVersion = "v2" # 增加
```

``` conf
# web.conf
server
{
    listen 443 ssl proxy_protocol;
    listen [::]:443 ssl proxy_protocol;

    set_real_ip_from 127.0.0.1/32; # 此处根据实际情况填写错误的IP段
    real_ip_header proxy_protocol;
}
```