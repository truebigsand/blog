---
title: CentOS 7 非LVM分区扩容
date: 2025-02-02 15:45:29
categories: 
- 技术
tags:
- 技术
- CentOS
- 磁盘
- 分区
---

起因是跑在服务器上的CentOS的硬盘爆了 在ESXi中扩容后没有反应 需要到系统中进行设置
安装系统时图方便没有用LVM 顺便一提现在网上搜索`CentOS 分区扩容`全是基于LVM的 并且文章也是互相Copy😡😡😡
其实非LVM的扩容反而更简单

### 步骤
查看现有分区类型及大小
``` bash
df -lh
```
进入分区编辑（以sda为例）
``` bash
fdisk /dev/sda
```
根据操作提示 删除最后一个分区并在原地（一般只需使用默认起始位置 若自行更改过则记录原分区起始位置并填入）新建一个分区 保存并退出

刷新分区信息
``` bash
partprobe /dev/sda
```

刷新分区：（填入之前创建的分区号 此处位sda3）
- 若为ext2/ext3/ext4文件系统 则使用`resize2fs /dev/sda3`
- 若为xfs文件系统 则使用`xfs_growfs /dev/sda3`

大功告成 可以使用`df -lh`或`lsblk`查看现在的分区信息