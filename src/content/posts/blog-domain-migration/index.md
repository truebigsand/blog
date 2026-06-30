---
title: 博客域名迁移
published: 2022-12-27
image: https://s2.loli.net/2023/04/05/8nGyVZXeou2lpOU.png
category: 日常
tags:
  - 大事件
  - 网站
  - 技术
---

今天想到[vercel](https://vercel.com)对[Next.js](https://nextjs.org/)的宣传，心血来潮想要把博客迁到vercel上，顺便测试一下[github pages](https://pages.github.com)和[vercel](https://vercel.com)的速度 感谢[17ce](http://www.17ce.com/)提供的测速服务
# 测速结果
## 使用Cloudflare CDN
### vercel
![http://www.17ce.com/site/http/20221227_5fb56cc085df11ed8cb737dbeefbfc25:1.html](https://s2.loli.net/2023/04/05/12mhACDOEVTciYS.png)
### github
![http://www.17ce.com/site/http/20221227_6b5e807085df11ed8cb737dbeefbfc25:1.html](https://s2.loli.net/2023/04/05/uxjKZMv5d7oYFWr.png)
## 不使用Cloudflare CDN
### vercel
![http://www.17ce.com/site/http/20221227_32c09b6085e211eda16def0f096a0469:1.html](https://s2.loli.net/2023/04/05/Tt2zsxIg6oPFlpu.png)
### github
![http://www.17ce.com/site/http/20221227_dbbca5b085e211ed8cb737dbeefbfc25:1.html](https://s2.loli.net/2023/04/05/14hpIaTHcZrdvwn.png)

# 结论
从结果可以看出，Cloudflare CDN起到了一定效果(尤其是境外地区)，但对于大陆地区没有显著效果
(不知道为什么vercel-cloudflare的结果有很多地方测不到)
最后还是决定把[https://blog.truebigsand.top](https://blog.truebigsand.top)给vercel-cloudflare

# 说说域名
<strong>truebigsand.top</strong>
在阿里云买的 top域名是综合最便宜的 9元首年 之后29一年
还算承担得起 准备一直续着
目前部署了一些api

# 已知的问题
Github Pages似乎每次更新都会充值自定义域名


# 「更新」: 使用[阿里云拨测](https://boce.aliyun.com/detect/http)
才发现阿里云还有这样的服务 挺好用的 (截图不整了)
## 使用Cloudflare CDN
### vercel
[https://boce.aliyun.com/detect/http/0d0a16f20c0a4cf9b746fca110fbf573](https://boce.aliyun.com/detect/http/0d0a16f20c0a4cf9b746fca110fbf573)
### github
[https://boce.aliyun.com/detect/http/f7cdca54674149e1bb1beaee3eec50ce](https://boce.aliyun.com/detect/http/f7cdca54674149e1bb1beaee3eec50ce)
## 不使用Cloudflare CDN
### vercel
[https://boce.aliyun.com/detect/http/8ca769ad5bb34c85bd75a35adf02d78f](https://boce.aliyun.com/detect/http/8ca769ad5bb34c85bd75a35adf02d78f)
### github
[https://boce.aliyun.com/detect/http/c2d4b3bf9ae14ebe912b7b9f708360c8](https://boce.aliyun.com/detect/http/c2d4b3bf9ae14ebe912b7b9f708360c8)

# 「更新2」
测 链接过期了 阿里云果然没这么好心
