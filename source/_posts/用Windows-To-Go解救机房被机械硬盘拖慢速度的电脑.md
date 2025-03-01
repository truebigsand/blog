---
title: 用Windows To Go解救机房被机械硬盘拖慢速度的电脑
date: 2024-05-26 20:33:10
cover: https://s2.loli.net/2024/05/26/k8JlYcRTBjbVEqt.png
top_img: https://s2.loli.net/2024/05/26/k8JlYcRTBjbVEqt.png
categories:
- 技术
tags:
- 技术
- 硬盘
- Windows To Go
---

社团课上找到机房电脑缓慢的根源了——硬盘
有同学带了块移动固态硬盘 并成功从外接USB盘启动了电脑 速度直接起飞
机房电脑CPU是10代i3 理论上性能不差 但是被1TB的希捷机械盘极大地拖慢了速度

于是立刻买了块新固态硬盘准备装系统带机房去用
本来打算整个118GB的傲腾装系统的 那样速度肯定更起飞 但是要500多块钱 实在太贵了（
后来还是决定买个便宜的SATA 硬盘盒加硬盘一共100到手 上午买的下午就到了（京东就是快啊）
买的是128GB的长城GW560（买的时候小脑烧了都没看颗粒和TBW 后来发现是TLC就放心了 有80TBW 按比例来看比1TB 600TBW还高一点（）
硬盘盒是个不知名的 支持SATA3.0
到手后按照标准流程格成NTFS先测个性能再说

测试结果：
``` plain
------------------------------------------------------------------------------
CrystalDiskMark 8.0.4 Shizuku Edition x64 (C) 2007-2021 hiyohiyo
                                  Crystal Dew World: https://crystalmark.info/
------------------------------------------------------------------------------
* MB/s = 1,000,000 bytes/s [SATA/600 = 600,000,000 bytes/s]
* KB = 1000 bytes, KiB = 1024 bytes

[Read]
  SEQ    1MiB (Q=  8, T= 1):   384.064 MB/s [    366.3 IOPS] < 21765.43 us>
  SEQ    1MiB (Q=  1, T= 1):   371.158 MB/s [    354.0 IOPS] <  2823.47 us>
  RND    4KiB (Q= 32, T= 1):    21.640 MB/s [   5283.2 IOPS] <  6020.22 us>
  RND    4KiB (Q=  1, T= 1):    20.802 MB/s [   5078.6 IOPS] <   196.72 us>

[Write]
  SEQ    1MiB (Q=  8, T= 1):   361.390 MB/s [    344.6 IOPS] < 23093.08 us>
  SEQ    1MiB (Q=  1, T= 1):   357.076 MB/s [    340.5 IOPS] <  2920.76 us>
  RND    4KiB (Q= 32, T= 1):    26.940 MB/s [   6577.1 IOPS] <  4827.29 us>
  RND    4KiB (Q=  1, T= 1):    25.727 MB/s [   6281.0 IOPS] <   158.92 us>

Profile: Default
   Test: 1 GiB (x1) [F: 0% (0/119GiB)]
   Mode: [Admin]
   Time: Measure 5 sec / Interval 5 sec 
   Date: 2024/05/25 19:26:52
     OS: Windows 11 Enterprise [10.0 Build 22621] (x64)
Comment: Great Wall GW560 128GB
```
性能差强人意 虽然没有达到标称的读取540MB/s 写入400MB/s 并且被NVME盘薄纱也是必然的
（一开始由于插USB速度太慢导致被识别成USB2.0测出来速度还不如大号U盘）

之后干正事 装个Windows 10
因为之前用过一个U盘做安装介质 就直接用那个U盘了
用U盘启动之后正常进安装流程 选择要装的磁盘的时候才发现Windows不支持在USB连接的硬盘上装系统：（
于是使用Windows To Go 用了知名工具`WTGA`
装了第一次进系统的时候桌面是黑屏 只有个任务栏在哪闪 重启之后又重新让创建账户了
但每次都在创建账户的时候出错 要么就是直接重启
试了半天之后终于想到用`Dism++`导出主系统的驱动再让`WTGA`在部署的时候把这些驱动加上 果然一遍过了
之后愉快地设置系统 但是任务管理器突然寄了 打开就闪退 搜了一堆没啥用的解决方案之后终于找到个能用的
`sfc /SCANNOW` 扫完一遍之后立竿见影 直接好了（后来又有这种情况的时候用`sfc`扫也没用了 但是重启就好了）
之后用火绒顶掉Windows Defender的过程中还出了几次问题 但通过重装软件也解决了
有趣的是Windows To Go的系统和我的主系统一直在争夺引导权 但是由于我一直用Ubuntu的`grub`做引导经常需要重新调一下
顺便说下DiskGenius自带的启动顺序管理器还挺好用的

最终搞到凌晨12:20多算是差不多了 装软件就下次再说吧 效果等下周实际使用之后回来补充