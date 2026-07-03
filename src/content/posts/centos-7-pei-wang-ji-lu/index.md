---
title: CentOS 7 配网记录
published: 2024-07-11
category: 技术
tags:
  - 技术
  - CentOS
  - 网络
---

最近给家里吃灰的NUC5装了CentOS7（之前重装Windows给我玩坏了 而且配置实在不太跑得动） 记录一下配网的常用操作
## 步骤
找到网卡名称
``` bash
ip address # 可简写为ip a
```
临时联网
``` bash
wpa_supplicant -B -i <网卡名称> -c <(wpa_passphrase <WiFi名称> <WiFi密码>)
dhclient <网卡名称>
```
使用`NetworkManager`接管网络配置
``` bash
yum -y install NetworkManager-wifi

systemctl start NetworkManager.service
systemctl enable NetworkManager.service
# 以上两行或chkconfig NetworkManager on

nmcli device set <网卡名称> managed yes

nmcli connection delete <WiFi名称>

nmcli device wifi connect <WiFi名称> password <WiFi密码>

nmcli connection modify <WiFi名称> ipv4.addresses 192.168.1.114/24
nmcli connection modify <WiFi名称> ipv4.gateway 192.168.1.1
nmcli connection modify <WiFi名称> ipv4.method manual
nmcli connection modify <WiFi名称> ipv4.dns "8.8.8.8"

nmcli connection up <WiFi名称>

cat /etc/sysconfig/network-scripts/ifcfg-<WiFi名称>
ip addr show <网卡名称>

systemctl restart NetworkManager
```
