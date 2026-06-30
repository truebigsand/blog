---
title: 二阶方阵求逆公式
published: 2024-09-08
category: 数学
tags:
  - 数学
  - 推导
  - 矩阵
---

今天在某教材上看到一个二阶方阵的求逆公式 想推导一下
<del>（包不规范的 练练$\LaTeX$</del>
$$
\text{If}\space
\mathbf{M}=
\begin{bmatrix}
    a & b\\
    c & d
\end{bmatrix}
\text{, then}\space
\mathbf{M}^{-1}=\frac{1}{\det \mathbf{M}}
\begin{bmatrix}
    d & -b\\
    -c & a
\end{bmatrix}
$$
$\bold{Proof}\space\bold{1.14.514}$
$\text{Let}$
$$
\mathbf{M}=
\begin{bmatrix}
    a & b\\
    c & d
\end{bmatrix}
$$
$\text{we want to find}\space\mathbf{M}^{-1}\space\text{so that}$
$$
\mathbf{M}\mathbf{M}^{-1}=\mathbf{I}
$$
$\text{Let}$
$$
\mathbf{M}
\begin{bmatrix}
    x\\
    y
\end{bmatrix}
=
\begin{bmatrix}
    x_0\\
    y_0
\end{bmatrix}
\tag{*}
$$
$\text{which is equivalent as}$
$$
\begin{cases}
    ax+by=x_0\\
    cx+dy=y_0
\end{cases}
$$
$\text{solved as}$
$$
\begin{cases}
    x=\frac{d}{ad-bc}x_0+\frac{-b}{ad-bc}y_0\\
    y=\frac{-c}{ad-bc}x_0+\frac{a}{ad-bc}y_0
\end{cases}
$$
$\text{so we have}$
$$
\begin{aligned}
    \begin{bmatrix}
        x\\
        y
    \end{bmatrix}
    &=
    \begin{bmatrix}
        \frac{d}{ad-bc} & \frac{-b}{ad-bc}\\
        \frac{-c}{ad-bc} & \frac{a}{ad-bc}
    \end{bmatrix}
    \begin{bmatrix}
        x_0\\
        y_0
    \end{bmatrix}\\
    &=
    \frac{1}{ad-bc}
    \begin{bmatrix}
        d & -b\\
        -c & a
    \end{bmatrix}
    \begin{bmatrix}
        x_0\\
        y_0
    \end{bmatrix}\\
    &=
    \frac{1}{\det\mathbf{M}}
    \begin{bmatrix}
        d & -b\\
        -c & a
    \end{bmatrix}
    \begin{bmatrix}
        x_0\\
        y_0
    \end{bmatrix}
\end{aligned}
$$
$\text{back to}\space(*)\text{, we have}$
$$
\mathbf{M}
\frac{1}{\det\mathbf{M}}
\begin{bmatrix}
    d & -b\\
    -c & a
\end{bmatrix}
\begin{bmatrix}
    x_0\\
    y_0
\end{bmatrix}
=
\begin{bmatrix}
    x_0\\
    y_0
\end{bmatrix}
$$
$\text{so}$
$$
\mathbf{M}
\frac{1}{\det\mathbf{M}}
\begin{bmatrix}
    d & -b\\
    -c & a
\end{bmatrix}
=
\mathbf{I}
$$
$\text{here comes}$
$$
\mathbf{M}^{-1}=
\frac{1}{\det\mathbf{M}}
\begin{bmatrix}
    d & -b\\
    -c & a
\end{bmatrix}
$$
$\text{Q.E.D.}$
