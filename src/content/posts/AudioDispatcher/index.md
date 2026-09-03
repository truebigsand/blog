---
title: AudioDispatcher - Windows 多音频设备输出工具
published: 2026-09-03
image: screenshot.png
category: 技术
tags:
  - .NET
  - C#
  - WPF
  - 软件
---

先放张截图
众所周知 Windows原生不能将音频同时输出到多个设备
导致不能愉快地组建桌面音响系统
常用的解决方案是使用高级音频工作台 如[VoiceMeeter](https://vb-audio.com/Voicemeeter/index.htm)
然而VoiceMeeter也有bug 连接至HDMI音频设备 熄屏后再启动就会异常高占用一个CPU核
况且我也不需要这么重量级的功能 （一下给我音频设备列表加一堆设备可还行
于是决定自己~~用AI~~写一个 根治问题

::github{repo="truebigsand/AudioDispatcher"}

项目采用 .NET 10 + WPF（虽然任务栏图标好像是WinForm的
需要先安装[VB-Cable虚拟音频设备](https://vb-audio.com/Cable/)（首次运行应该会有提示
（虽然还是用了VB-Audio家的东西 你的下一款VoiceMeeter何必是VoiceMeeter
下个版本准备把虚拟音频设备也自己搓了
