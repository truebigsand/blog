---
title: 一些定积分的几何意义及计算
published: 2024-03-31
category: 数学
tags:
  - 数学
  - 定积分
---

# 定积分
## 一重积分
$$\int_{a}^{b}f(x)dx$$
几何意义：曲线 $f(x)$ 与 $x$ 轴围成的曲边梯形的有向面积
物理意义：以 $f(x)$ 为线密度函数的曲线在 $[a,b]$ 上的质量

计算时可使用**牛顿-莱布尼茨公式**
$$\int_{a}^{b}f(x)dx=F(b)-F(a)$$
其中 $F(x)$ 为 $f(x)$ 的原函数，即 $F'(x)=f(x)$

## 二重积分
$$\iint_{D}f(x,y)d\sigma$$
几何意义：曲面 $f(x,y)$ 与 $xy$ 平面围成的柱体的有向面积
物理意义：
- 以 $f(x,y)$ 为面密度函数的平面在区域 $D$ 上的质量
- 以 $f(x,y)$ 为压强函数的平面在区域 $D$ 上受到的压力

计算时可在平面直角坐标系中画出 $D$ ，确定 $x$ 和 $y$ 的范围（根据实际情况选定一个量表示另一个量的范围），将二重积分化为两个嵌套的一重积分，即
$$\iint_{D}f(x,y)d\sigma=\int_{a}^{b}\int_{\phi(x)}^{\psi(x)}f(x,y)dydx$$
或
$$\iint_{D}f(x,y)d\sigma=\int_{a}^{b}\int_{\phi(y)}^{\psi(y)}f(x,y)dxdy$$
然后从内向外依次求解

也可以化为极坐标形式进行计算，即换元 $(x,y)\to (r\cos\theta,r\sin\theta)$ （注意此时 $dxdy\to \boldsymbol{r}drd\theta$ ），在平面极坐标系中画出 $D$ ，确定 $r$ 和 $\theta$ 的范围，于是有
$$\iint_{D}f(x,y)d\sigma=\iint_{D}g(r,\theta)d\sigma=\int_{a}^{b}\int_{\phi(\theta)}^{\psi(\theta)}g(r,\theta)rdrd\theta$$

## 三重积分
$$\iiint_{\Omega}f(x,y,z)$$
几何意义：曲体 $f(x,y,z)$ 与 $xyz$ 三维体围成的四维体的“体积”
物理意义：以 $f(x,y,z)$ 为体密度函数的物体在 $\Omega$ 上的质量

计算方法可以类比二重积分，这里不再赘述（其实是因为我不会:-）

## 曲线积分
### 第一类曲线积分（对弧长）
$$\int_{L}f(x,y)ds$$
根据几何关系，有
$$ds=\sqrt{(dx)^2+(dy)^2}$$
对于一般的曲线，由参数方程 $x=\phi(t),y=\psi(t)$ 给出（其中 $t \in [a,b]$ ），则有
$$ds=\sqrt{(\phi'(t)dt)^2+(\psi'(t)dt)^2}=\sqrt{(\phi'(t))^2+(\psi'(t))^2}\space dt$$
于是可化为一般的定积分
$$\int_{L}f(x,y)ds=\int_{a}^{b}f(\phi(t),\psi(t))\sqrt{(\phi'(t))^2+(\psi'(t))^2}\space dt$$

对于由函数 $y=y(x)$ 给出的曲线（其中 $x \in [a,b]$ ），则有
$$ds=\sqrt{(dx)^2+(dy)^2}=\sqrt{1+(\frac{dy}{dx})^2}\space dx=\sqrt{1+(y'(x))^2}\space dx$$
也可化为一般的定积分
$$\int_{L}f(x,y)ds=\int_{a}^{b}f(x,y(x))\sqrt{1+(y'(x))^2}\space dx$$

特别地，若令 $f(x,y)=1$ ，则得到**弧长公式**
$$l=\int_{L}dx=\int_{a}^{b}\sqrt{1+(y'(x))^2}\space dx$$
