---
title: Powershell美化
date: 2023-08-04 20:28:58
cover: https://s2.loli.net/2023/09/17/lRO6Tpsb1mHxEui.png
top_img: https://s2.loli.net/2023/09/17/lRO6Tpsb1mHxEui.png
categories: 
- 技术
tags:
- 技术
- Powershell
- 美化
---

最近看了B站的一个视频 受到启发 准备给电脑终端美化一下
因为我把`Windows Terminal`作为终端默认程序 所以和窗口相关的就不用刻意美化了（本来就很好看）

### 安装`Oh My Posh`
跟着官网的教程走就可以了 非常简单
```powershell
winget install JanDeDobbeleer.OhMyPosh -s winget
```
之后一定要重启一下终端来加载环境变量PATH
然后我们会发现终端开始的信息成了这样
![](https://s2.loli.net/2023/08/04/up1GesCOQAE3aif.png)
显然是字体出了问题

### 安装字体
这里推荐[Nerd Fonts](https://www.nerdfonts.com/) 这是将各种图标符号整合到常用代码字体的一个项目 到下载页面选择一个喜欢的字体用就可以了（这里使用JetBrainsMono Nerd Font）
安装好后从`Windows Terminal`的设置页面选择刚才的字体就可以了
![](https://s2.loli.net/2023/08/04/GRAYS7EvZJyXUdb.png)

### 终端适配
在终端中打开PROFILE文件
```powershell
code $PROFILE
```
把下面的内容复制进去
```powershell
oh-my-posh init pwsh | Invoke-Expression
```
然后保存

### VSCode适配
修改VSCode的`settings.json`中`terminal.integrated.fontFamily`的值为刚才的字体名称
