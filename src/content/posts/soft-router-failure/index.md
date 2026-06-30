---
title: 失败的软路由记录
published: 2026-06-30
category: 技术
tags:
  - 网络
  - 软路由
  - NUC
  - ImmortalWrt
  - PVE
---

今天上午面试结束 也就是综评搞完了 终于是完全解放了

中午回来想着把NUC再整整 搞个心心念念的软路由玩玩

先装了个PVE试试 上来就给我卡住了 因为没法联网而我又不能熟练地在原始Linux环境下配网 于是打算根据经验先装个NetworkManager（这里很神奇地能够联网因为我捣鼓着整出了把电脑连的WiFi通过以太网接口共享给NUC的操作） 结果就踩坑了 因为PVE自带的vmbr0桥接网络接口似乎和NetworkManager不兼容 然后也不知道怎么办就直接给NetworkManager卸了 之后又跟着各种教程用ip/ifup/ifdown试了半天（也包括问DeepSeek 但这家伙信息实在太不准了）

之后大概是重置了一下什么东西就能连上了（这时候还是网线直连电脑和NUC的情况）

总算登上PVE了 Web界面看着很舒服 就是初始内存就占了不少 CPU也有不少占用 又玩了会决定上个LXC装Tailscale（虽然我也不知道有啥用） 于是又开始踩各种坑

首先是鬼脑发力想到用Tailscale共享网段得要桥接模式啊 然后询问ai发现似乎WiFi连接没法这么搞（网口被我连电脑用了 家里也不太方便想出租屋那样直接连到路由器上）现在搞清楚了是因为WiFi协议默认只有3个MAC地址 在桥接情况下无法标识完整的包信息 开启四地址模式可以解决但得看设备是否支持

之后为这个玩意又试了半天 突然想起来我好像只是想搞个软路由来着 于是决定直接在NUC上装软路由系统 不要什么PVE了

选定了ImmortalWrt系统 安装也费大劲了 官网提供的img镜像需要在PE下直接写到NUC的硬盘上 用的微PE正好又没有写盘工具 幸亏NUC的USB接口丰富 我直接拿U盘拷进去了一个写盘工具就成了（这里还有个小坑 那个写盘工具必须要先把分区全部清空 否则会报错并且没有任何信息）

终于进系统了 这时候发现这个ImmortalWrt系统也是非常精简啊 啥工具也没有 装初始包只能通过网页上传 这时候又被那个网线直连电脑的问题困住了

最终时间实在不早了 下定决心把旧路由器拿过来当交换机用 明天再试试

（这个旧路由器不支持IPv6和WiFi6 纯fw一个 孱弱的上游连接能力导致我都没法放我房间当个AP用 不过就网口来说有1WAN 4LAN的千兆口 内网交换还是能用的）

（当AP失败还有个原因是家里没预留网线导致不能有线组网 这个旧路由器又不能连WiFi6的无线 暂时只能连2.4G的）

把旧路由器桥接到主网络（虽然只能是2.4G的） 然后就能直接从电脑上访问ImmortalWrt的管理页面了

不得不说软路由系统占用确实小 内存占用90MB 磁盘占用40MB

* * *

第二天：

得益于之前配好了路由器桥接和NUC的IP NUC连上路由器就能从其他局域网设备访问了 但发现NUC还不能连通互联网 于是先联网

在默认的br-lan接口中添加网关为主路由IP 添加DNS就可以了

之后从包管理器页面 `apk update` 一下就可以直接安装 `luci-app-openclash` 了

（这里依旧踩坑 因为忘了重启导致试了很多办法都无法在页面中看到OpenClash的目录项）

之后手动下载clash meta内核并放到 `/etc/openclash/core` 目录下 重命名为 `clash_meta` 再 `chmod 755 clash_meta` 就可以启动了

按照相关教程配置OpenClash的模式

最后还是不知道怎么回事 把其他设备网关指向NUC之后仍然无法联网

依旧时间不早了 决定直接摆烂 明天装回Windows直接用图形界面的Clash Meta/Verge得了

* * *

第三天：

装Windows本来是这几天最简单的一次尝试 但我灵机一动准备整个精简版系统

由于网上找不到合适的 我直接用NTLite自己裁了个精简版（虽然并没有精简多少） 顺便把买来的时候备份的一些驱动装上了

之后下载Clash并打开TUN模式 可惜还是不行

又试了下Windows的网络共享和桥接（网桥） 可能还是没搞明白 总之就是要么连不上网要么连上了但Clash不起作用

可能是NUC5的8265网卡的兼容性问题

（中间包括用第三方小工具进行转发 也是不行）

* * *

总之就是少碰跟硬件相关的东西 我还是适合在功能完好的电脑上搞一些软件开发（我是不是以前也得出过这个结论）

# 一些经验

## 联网

参考[刷入并配置immortalwrt进行上网](https://ghost-sam1222.github.io/ghostsam.github.io/post/shua-ru-bing-pei-zhi-immortalwrt-jin-xing-shang-wang.html)

概要：在默认的br-lan接口中添加网关为主路由IP 添加DNS

## 换源

```shellscript
sed -e 's,https://downloads.immortalwrt.org,https://mirrors.cernet.edu.cn/immortalwrt,g'  -e 's,https://mirrors.vsean.net/openwrt,https://mirrors.cernet.edu.cn/immortalwrt,g' -i.bak /etc/apk/repositories.d/distfeeds.list
```

## 安装OpenClash

注意：装好了一定要重启！！！否则可能在面板里看不到OpenClash目录项
