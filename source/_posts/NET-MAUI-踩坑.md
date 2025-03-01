---
title: .NET MAUI 踩坑
cover: https://s2.loli.net/2023/07/08/G6JLgTxsiAzr7dC.png
top_img: https://s2.loli.net/2023/07/08/G6JLgTxsiAzr7dC.png
date: 2023-07-08 20:13:12
categories: 
- 技术
tags:
- 技术
- 踩坑
- .NET
- MAUI
- C#
---

时隔数月 皮燕又痒了 想搞搞Android开发
由于不熟悉Android Studio的操作和Java/Kotlin 所以优先选择熟悉的VS-.NET-MAUI-C#
在这里记录一些遇到的问题 以便以后参考

## 教程
MSDN的文档过于零散 这里按照一般项目开发的顺序整理 具体细节参考[MSDN](https://learn.microsoft.com/zh-cn/dotnet/maui)
### 在VS中创建示例项目
略
### 修改App Identifier（你也不想看到com.examplecompany.appname的包名罢）
1. 修改`.csproj`文件中的`ApplicationId`节点
2. 如果进行安卓开发 则修改`AndroidManifest.xml`中的`manifest`节点的`package`属性和`manifest.application`节点的`android:label`属性为合适的值
### 更改应用图标
1. 在网上找到或制作自己的应用图标（最好是SVG格式） 放到合适的目录（如`Resources/AppIcon`）
2. 修改`.csproj`文件中的`MauiIcon`节点的属性 其中
    - `Include`为背景图片 如`Resources\AppIcon\appicon.svg` **[必选]**
    - `ForegroundFile`为前景图片 如`Resources\AppIcon\appiconfg.svg` [可选]
    - `TintColor`为前景色 如`White` [可选]
    - `Color`为背景色 如`#512BD4` [可选]
    - `BaseSize`为标准大小 如`128,128` [可选]
3. 修改开屏图片 即`.csproj`文件中`MauiSplashScreen`节点的属性 其中
    - `Include` 为开屏图片 如`Resources\Splash\splash.svg`
    - `Color`为背景色 如`#512BD4` [可选]
    - `BaseSize`为标准大小 如`128,128` [可选]

## 问题
### MAUI:错误 APT2000 系统找不到指定的文件
- 原因：工作目录中含有中文
- 解决方案：将项目移动至**不含中文字符**的目录（可能引发下面一个问题）
- 参考自：https://www.cnblogs.com/z415353144/p/15957583.html

### error APT2126: file not found
- 原因：移动项目后缓存依然是原来的目录（从LOG中可以看出）
- 解决方案：**清理**、重新生成项目
- 参考自：https://github.com/dotnet/maui/issues/5956

### 更改全局appicon后安卓生成出错
- 原因：没有更新`AndroidManifest.xml`中Application icon
- 解决方案：在VS中打开`AndroidManifest.xml`并更改Application icon的值
或编辑`AndroidManifest.xml`并将`manifest.application`节点的`android:icon`属性更改为合适的值（如`@mipmap/appicon`）

### uses-sdk:minSdkVersion 19 cannot be smaller than version 21 declared in library
- 原因：我也不知道为什么反正就是Android SDK版本出问题了
- 解决方案：更改`.csproj`文件中`<SupportedOSPlatformVersion Condition="$([MSBuild]::GetTargetPlatformIdentifier('$(TargetFramework)')) == 'android'">19.0</SupportedOSPlatformVersion>`的值为合适的值 并修改`AndroidManifest.xml`中`manifest.uses-sdk`节点的`android:minSdkVersion` `android:targetSdkVersion`属性的值 使之匹配`.csproj`文件中的值

### DisplayAlert方法卡住
- 原因：不到
- 解决方案：不要使用.Wait()