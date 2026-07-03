---
title: 一些简谐运动的运动学方程推导
published: 2025-02-22
category: 数学
tags:
  - 数学
  - 物理
  - 推导
---

## 从能量角度出发
理想情况下无能量损失 得到方程
$$
\frac{1}{2}mv^2+\frac{1}{2}kx^2=E_0
$$
微分形式
$$
m\left(\frac{\mathrm dx}{\mathrm dt}\right)^2+kx^2=2E_0
$$
分离变量
$$
\sqrt{\frac{m}{2E_0-kx^2}}\mathrm dx=\mathrm dt
$$
两边积分
$$
\sqrt{\frac{m}{2E_0}}\int{\frac{1}{\sqrt{1-\frac{k}{2E_0}x^2}}\mathrm dx}=\int{\mathrm dt}
$$
换元令
$$
u=\sqrt{\frac{k}{2E_0}}x
$$
则
$$
\sqrt{\frac{m}{k}}\int{\frac{1}{\sqrt{1-u^2}}\mathrm du}=\int{\mathrm dt}
$$
即
$$
\sqrt{\frac{m}{k}}(\arcsin{u}+C_1)=t+C_2
$$
回代得
$$
\sqrt{\frac{m}{k}}\left(\arcsin{\sqrt{\frac{k}{2E_0}}x}+C_1\right)=t+C_2
$$
注意到 $\sqrt{\frac{m}{k}}$ 为常数，故可合并常数
$$
\sqrt{\frac{m}{k}}\left(\arcsin{\sqrt{\frac{k}{2E_0}}x}+\varphi\right)=t
$$
整理得
$$
x=\sqrt{\frac{2E_0}{k}}\sin{\left(\sqrt{\frac{k}{m}}t+\varphi\right)}
$$
由此可得简谐运动最大振幅 $A=\sqrt{\frac{2E_0}{k}}$ ，周期 $T=2\pi\sqrt{\frac{m}{k}}$ ，初相位 $\varphi$

## 从受力角度出发
根据简谐运动回复力定义 得到方程
$$
-kx=ma
$$
即
$$
kx+mx''=0
$$
特征方程
$$
k+m\lambda^2=0
$$
得到
$$
\lambda=\pm\sqrt{\frac{k}{m}}i
$$
于是有
$$
% \begin{align*}
    x=C_1 e^{\lambda_1 t}+C_2 e^{\lambda_2 t}\\
%     &=C_1\left(\cos\sqrt{\frac{k}{m}}t+i\sin\sqrt{\frac{k}{m}}t\right)+C_2\left(\cos{-\sqrt{\frac{k}{m}}}t+i\sin{-\sqrt{\frac{k}{m}}}t\right)\\
%     &=(C_1+C_2)\cos\sqrt{\frac{k}{m}}t+(C_1-C_2)i\sin\sqrt{\frac{k}{m}}t
% \end{align*}
$$
由于
$$
x\in\R
$$
所以
$$
x=\overline{x}
$$
即
$$
C_1 e^{\lambda_1 t}+C_2 e^{\lambda_2 t}=\overline{C_1}e^{-\lambda_1 t}+\overline{C_2}e^{-\lambda_2 t}
$$
又因为
$$
\lambda_1+\lambda_2=0
$$
故
$$
C_1=\overline{C_2}
$$
不妨设
$$
C_1=re^{i\varphi},\space C_2=re^{-i\varphi}
$$
所以
$$
\begin{aligned}
    x&=re^{\lambda_1 t+\varphi}+re^{\lambda_2 t-\varphi}\\
    &=re^{\lambda_1 t+\varphi}+re^{-(\lambda_1 t+\varphi)}\\
    &=2r\cos{(\lambda_1 t+\varphi)}
\end{aligned}
$$
即可得
$$
x=x_0\cos{\left(\sqrt{\frac{k}{m}}t+\varphi\right)}
$$
显然和上一个方法的结果是自洽的
