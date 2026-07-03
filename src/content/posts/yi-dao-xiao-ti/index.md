---
title: 一道小题
published: 2025-03-08
category: 数学
tags:
  - 数学
---

本来是想用markdown写了再复制到PPT里的 但是这byd PowerPoint不支持 也不能白写 就放着吧
## 题目
$f(x)=a(x-1)-\ln x+1$，$a\le 2$ 且 $x>1$，求证 $f(x)<e^{x-1}$ 恒成立
即证 $g(x)=e^{x-1}-a(x-1)+\ln x-1>0$ 恒成立
将 $g(x)$ 看作 $G(a)=(1-x)a+(e^{x-1}+\ln x-1)$
$\because 1-x<0$
$\therefore G(a)$ 单调递减，$g(x)\ge G(2)=e^{x-1}-2x+\ln x+1$
令 $h(x)=e^{x-1}-2x+\ln x+1$
即证 $h(x)>0$ 恒成立

## 方法一：直接求导
$h'(x)=e^{x-1}-2+\frac{1}{x}$
$h''(x)=e^{x-1}-\frac{1}{x^2}$ 单调递增
$\therefore h''(x)>h''(1)=0$
$\therefore h'(x)$ 单调递增
$\therefore h'(x)>h'(1)=0$
$\therefore h(x)$ 单调递增
$\therefore h(x)>h(1)=0$ 得证

## 方法二：同构
即证 $e^{x-1}-(x-1)+\ln x-x>0$
即证 $e^{x-1}-(x-1)>x-\ln x$
即证 $e^{x-1}-(x-1)>e^{\ln x}-\ln x$
令 $p(x)=e^x-x$
即证 $p(x-1)>p(\ln x)$
又$\because p'(x)=e^x-1>0$，$p(x)$ 单调递增
即证 $x-1>\ln x$
$q(x)=x-\ln x-1$，$q'(x)=1-\frac{1}{x}>0$，$q(x)>q(1)=0$，$x-1>\ln x$
上式显然成立
