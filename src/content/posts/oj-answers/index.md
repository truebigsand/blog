---
title: OJ答案
published: 2024-05-29
image: https://s2.loli.net/2024/06/15/gZCAI1sNexP3QSM.png
category: 技术
tags:
  - 学校
  - OJ
  - Python
---

为造福同学 将OJ中Python课程答案公布于此
OJ网址：https://oj.nsfz.net
## 章节1：输入、输出及赋值
### 1120 nsfz欢迎你
``` python
print('nsfz')
print('欢迎你')
```
### 1381 你的名字
``` python
name = input()
print('你好', name)
```
### 1119 A+B问题
``` python
a = int(input())
b = int(input())
print(a + b)
```
## 章节2：顺序结构
### 1003 混合运算
``` python
a, b=map(int, input().split())
print((a + b) * (a - b))
```
### 1001 求一个数的立方
``` python
a = int(input())
print(a ** 3)
```
### 1008 求长方形面积和周长
``` python
a, b = map(int, input().split())
print(a * b, (a + b) * 2)
```
### 1122 计算线段长度
``` python
x1, y1 = map(int, input().split())
x2, y2 = map(int, input().split())
distance = ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5
print('%.3f'%distance)
```
### 254 细菌繁殖
``` python
a = int(input())
print(10 * (2 ** (a - 1)))
```
### 1007 求商和余数
``` python
a, b = map(int, input().split())
print(a // b, a % b, end=' ')
print('%.1f'%(a / b))
```
### 1133 分离数位
``` python
x = int(input())
a = x // 100
b = x // 10 % 10
c = x % 10
print(a, b, c)
```
### 255 鸡兔同笼
``` python
a = int(input())
b = int(input())
print(2*a-b//2, b//2-a)
```
### 256 分糖果
``` python
a = list(map(int, input().split()))

for i in range(5):
    a[(i + 4) % 5] += a[i] // 3
    a[(i + 1) % 5] += a[i] // 3
    a[i] //= 3

print(a[0], a[1], a[2], a[3], a[4])
```
### 257 是0？是1？
``` python
a, b, c = map(int, input().split())
condition = a % 2 == 1 and b % 2 == 1 and c % 2 == 1
print(int(condition))
```
## 章节3：关系、逻辑运算与选择语句
### 1012 判断奇偶数
``` python
x = int(input())

if x % 2 == 0:
    print('是')
else:
    print('不是')
```
### 1014 两数比大小
``` python
a, b = map(int, input().split())

if a > b:
    print(a)
else:
    print(b)
```
### 1018 恐龙园买门票
``` python
h = float(input())

if h < 1.3:
    print(60)
else:
    print(120)
```
### 1130 心系南方灾区
``` python
from math import ceil
a,b = map(int, input().split())
print(ceil(a/b))
```
### 1013 判断闰年
``` python
a = int(input())

if a % 400 == 0 or (a % 4 == 0 and a % 100 != 0):
    print('RUN!')
else:
    print('NO RUN!')
```
### 267 左邻右舍
``` python
n, x = map(int, input().split())

a, b = x - 1, x + 1
if a == 0:
    a = n
if b == n + 1:
    b = 1
print(min(a, b), max(a, b))
```
### 1366 出租车计费
``` python
w = float(input())

if w <= 3:
    print('8.0')
elif w <= 10:
    print('%.1f'%(8+(w-3)*1.8))
else:
    print('%.1f'%(8+7*1.8+(w-10)*2.4))
```
### 1010 三个数的大小关系
``` python
a, b, c = map(int, input().split())

if a < b < c:
    print('Yes')
else:
    print('No')
```
### 1370 BMI指数
``` python
a, b = map(float, input().split())

x = b / (a * a)
if x <= 18.4:
    print('偏瘦')
elif x <= 23.9:
    print('正常')
elif x <= 27.9:
    print('过重')
else:
    print('肥胖')
```
### 272 加油卡充值
``` python
n = int(input())

if n >= 5000:
    print('%.2f'%(n+n*0.05))
elif n >= 3000:
    print('%.2f'%(n+n*0.04))
elif n >= 1000:
    print('%.2f'%(n+n*0.03))
else:
    print('%.2f'%n)
```
### 266 **解方程
``` python
a, b, c = map(int, input().split())

if a == 0:
    if b == 0:
        if c == 0:
            print('任意实数')
        else:
            print('无解')
    else:
        print('%.1f'%(-c / b))
else:
    delta = b * b - 4 * a * c
    if delta > 0:
        print('%.1f'%((-b-delta**0.5)/2/a), end=' ')
        print('%.1f'%((-b+delta**0.5)/2/a))
    elif delta == 0:
        print('%.1f'%(-b/2/a))
    else:
        print('无解')
```
### ss13 **统计每月天数
``` python
l1 = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
l2 = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

a, b = map(int, input().split())
if a % 400 == 0 or a % 4 == 0 and a % 100 != 0:
    print(l2[b])
else:
    print(l1[b])
```
## 章节4：循环语句for
### 1436 输出多行\*\*\*\*\*\*
``` python
n = int(input())
for i in range(n):
    print('******')
```
### 1437 输出n个自然数
``` python
n = int(input())
for i in range(1, n + 1):
    print(i, end=' ')
```
### 1020 求解1+2+3+...+n
``` python
n = int(input())
print(n * (n + 1) // 2)
```
### 1021 求1+3+5+...+n
``` python
n = int(input())
print((1 + n) * ((n - 1) // 2 + 1) // 2)
```
### 1022 求2+4+6+...+n
``` python
n = int(input())
print((2 + n) * ((n - 2) // 2 + 1) // 2)
```
### 1023 求1+1/2+1/3+...+1/n
``` python
n = int(input())
ans = 0.0
for i in range(1, n + 1):
    ans += 1 / i
print('%.3f'%ans)
```
### 1025 求1\*1+2\*2+...+n\*n
``` python
n = int(input())
ans = 0
for i in range(1, n + 1):
    ans += i ** 2
print(ans)
```
### 1124 分别求奇数和偶数和
``` python
n = int(input())
ans1, ans2 = 0, 0
for i in range(n):
    t = int(input())
    if t % 2 == 0:
        ans2 += t
    else:
        ans1 += t;
print(ans1)
print(ans2)
```
### 1382 求约数和
``` python
n = int(input())
ans = 0
for i in range(1, n + 1):
    if n % i == 0:
        ans += i
print(ans)
```
### 1026 求n!
``` python
n = int(input())
ans = 1
for i in range(1, n + 1):
    ans *= i
print(ans)
```
### 1131 **判奇偶求和
``` python
n = int(input())
ans = 0
if n % 2 == 1:
    for i in range(1, n + 1):
        if i % 2 == 0:
            ans += i
else:
    for i in range(1, n + 1):
        if n % i == 0:
            ans += i
print(ans)
```
### 1027 **求1!+2!+...+n!
``` python
def factorial(n: int):
    ans = 1;
    for i in range(1, n + 1):
        ans *= i
    return ans

n = int(input())
ans = 0
for i in range(1, n + 1):
    ans += factorial(i)
print(ans)
```
### 273 **住宿费
``` python
n = int(input())
if n % 4 == 1:
    print((n // 4 - 2)* 140 + 3 * 120)
elif n % 4 == 2:
    print((n // 4 - 1) * 140 + 2 * 120)
elif n % 4 == 3:
    print((n // 4) * 140 + 120)
else:
    print(n // 4 * 140)
```
## 章节5：循环语句while
### 1442 理财
``` python
n = 1.0
t = 0
while True:
    n *= 1.035
    t += 1
    if n >= 2:
        print(t)
        break
```
### 1443 折纸的厚度
``` python
i = 1
while 0.00008 * (2 ** i) <= 8844.43:
    i += 1
print(i)
```
### 1126 求1+1/2+1/3+…+1/n>X的n最小值
``` python
n = int(input())
s = 0
for i in range(1, 100000000):
    s += 1 / i
    if s > n:
        print(i)
        break
```
### 1132 至少多少
``` python
n = int(input())
s = 0
for i in range(1, 10000000):
    s += i * 2 - 1
    if s >= n:
        print(i)
        break
```
### 1125 角谷猜想
``` python
n = int(input())
step = 0
while n != 1:
    if n % 2 == 0:
        n //= 2
    else:
        n = n * 3 + 1
    step += 1
print(step)
```
### 1444 统计整数个数
``` python
ans = 0
while True:
    n = int(input())
    if n == 0:
        break
    ans += 1
print(ans)
```
### 1367 根据AQI值判断城市的空气质量
``` python
while True:
    n = int(input())
    if n == -1:
        exit(0)
    if n <= 100:
        print('优良')
    else:
        print('污染')
```
### 1439 辗转相除法求最大公约数
``` python
import math
a, b = map(int, input().split())
print(math.gcd(a, b))
```
### 1445 求最大公约数
``` python
from math import gcd

a, b, c = map(int, input().split())

print(gcd(gcd(a, b), c))
```
### 1445 求最大公约数
``` python
import math
a , b = map(int, input().split())
print(a * b // math.gcd(a, b))
```
### 1369 **猜数游戏
此题无法提交 不用写
## 章节6：列表list
### 1052 排序输出
``` python
l = []
while True:
    s = input()
    if int(s) == -1:
        break
    l.append(int(s))

l.sort()

for i in l:
    print(i)
exit(0)
```
### 1435 评委评分
``` python
n = int(input())
l = []
for i in range(n):
    l.append(int(input()))

l.sort()

print(sum(l[1:-1]) / (n - 2))
```
### 282 统计数字个数
``` python
s = input()

l = [0 for i in range(10)]

for c in s:
    l[ord(c) - ord('0')] += 1

print(' '.join(map(str, l)))
```
### 1051 求平均年龄
``` python
l = []
while (n := int(input())) != 0:
    l.append(n)

print('%.2f'%(sum(l) / len(l)))
```
### 1438 求平均身高
``` python
n = int(input())
l = []
for i in range(n):
    l.append(float(input()))

print('%.2f'%(sum(l) / len(l)))
```
### 1050 寻找数m
``` python
l = map(int, input().split())
m = int(input())
ans = 0
for i in l:
    if i == m:
        ans += 1
print(ans)
```
## 章节7：自定义函数
### 1446 组合数
``` python
def fac(n):
    s = 1
    for i in range(1, n + 1):
        s *= i
    return s
n, m = map(int, input().split())
print(fac(n) // fac(m) // fac(n - m))
```
### 1112 绝对素数
``` python
def is_prime(n: int):
    i = 2
    while i ** 2 <= n:
        if n % i == 0:
            return False
        i += 1
    return True

for i in range(11, 100):
    if is_prime(i) and is_prime(int(''.join(reversed(str(i))))):
        print(i)
```
### 1129 求三角形周长
``` python
def dist(x1, y1, x2, y2):
    return ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5

x1, y1, x2, y2, x3, y3 = map(int, input().split())

ans = dist(x1, y1, x2, y2) + dist(x1, y1, x3, y3) + dist(x2, y2, x3, y3)

print('%.2f' % ans)
```
### 1118 姐妹数对
``` python

def cond(x, y):
    return (x + y) % 3 == 0 or (x + y) % 7 == 0

n = int(input())

ans = 0

for i in range(1, n + 1):
    for j in range(i + 1, n + 1):
        if cond(i, j):
            ans += 1

print(ans)
```
## 章节8：算法基础
### 1363 递归法求斐波拉契数列第n项的值
``` python
def f(n):
    if n == 1 or n == 2:
        return 1
    return f(n - 1) + f(n - 2)
n = int(input())
print(f(n))
```
### 1447 递归求n!
``` python
import math
n =  int(input())
print(math.factorial(n))
```
### 1448 递归法实现辗转相除算法
``` python
import math
a, b = map(int, input().split())
print(math.gcd(a, b))
```
### 1028 枚举法求水仙花数
``` python
m, n = map(int, input().split())
f = True
for i in range(m, n + 1):
    if i == sum(map(lambda x: (ord(x) - ord('0')) ** 3, str(i))):
        print(i, end=' ')
        f = False
if f:
    print('no')
```
### 1031 枚举法求完美数
``` python
def get_divisors_sum(n):
    s = 0
    for i in range(1, int(n ** 0.5) + 1):
        if n % i == 0:
            s += i
            if i * i != n and i != 1:
                s += n // i
    return s

m, n = map(int, input().split())

for i in range(m, n + 1):
    if i == get_divisors_sum(i):
        print(i, end=' ')
```
### 1362 递推法求斐波拉契数列第n项的值
``` python
n = int(input())
a, b = 1, 1
if n <= 2:
    print(1)
    exit(0)
for i in range(n - 2):
    a, b = b, a + b
print(b)
```
### 1101 汉诺塔
``` python
n = int(input())

def get_other(a, b):
    l = ['A', 'B', 'C']
    l.remove(a)
    l.remove(b)
    return l[0]

def move(n: int, src: str, dest: str):
    if n == 1:
        print(f'{src} To {dest}')
        return
    move(n - 1, src, get_other(src, dest))
    print(f'{src} To {dest}')
    move(n - 1, get_other(src, dest), dest)

move(n, 'A', 'C')
```
### 1440 二分查找
``` python
n = int(input())

l, r = 1, 1000

cnt = 0

while l < r and l != r - 1:
    m = (l + r) // 2
    cnt += 1
    if n > m:
        l = m
    elif n < m:
        r = m
    else:
        break

print(cnt)
```
