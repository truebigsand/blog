---
title: 【解决方案】FFmpeg推流速度过快
published: 2024-06-10
category: 技术
tags:
  - 技术
  - FFmpeg
---

FFmpeg使用视频源进行推流时，处理速度往往会快于实际帧率，而默认设置下处理完了一段就直接上传，因此速度会过快
解决方法：使用`-re`参数
> ref: https://stackoverflow.com/questions/48479141/understanding-ffmpeg-re-parameter
> It's useful for real-time output when ffmpeg is able to process a source at a speed faster than real-time. In that scenario, ffmpeg may send output at that faster rate and the receiver may not be able to or want to buffer and queue its input.
