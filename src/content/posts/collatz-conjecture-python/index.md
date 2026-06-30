---
title: 一些Python模拟角谷猜想的性能测试
published: 2024-06-15
image: https://s2.loli.net/2024/06/15/t8XaFrjlY5PTZIC.png
category: 技术
tags:
  - 技术
  - Python
---

## 公共部分
``` python
def solve(n):
    step = 0
    while n != 1:
        if n % 2 == 0:
            n //= 2
        else:
            n = 3 * n + 1
        step += 1
    return step
N = 1000000
```
## v1
没啥好说的 顺序求解
主要代码：
``` python
x = [i for i in range(1, N + 1)]
y = list(map(solve, x))
```
## v2
测试电脑为6C12T 故采用`max_workers=12`
主要代码：
``` python
from concurrent.futures import ThreadPoolExecutor
x = [i for i in range(1, N + 1)]
with ThreadPoolExecutor(max_workers=12) as e:
    y = list(e.map(solve, x))
```
## v3
主要代码：
``` python
import numpy as np
x = np.arange(1, N + 1, 1)
y = solve(x)
```
`np.vectorize`版：
``` python
import numpy as np
x = np.arange(1, N + 1, 1)
solve_vector = np.vectorize(solve)
y = solve_vector(x)
```
## 测试结果
`+njit`指给`solve()`函数加上了`@njit`标签
`+vectorize`指给`solve()`函数加上了`@vectorize()`标签
`numpy`不带`(vec)`指使用`numba`的`#vectorize()`标签而不使用`np.vectorize` 反之亦然 
| 版本 | 说明 | 最大内存占用 | 时间1 | 时间2 | 时间3 | 平均时间 |
|:---:|:----:|:----:|:----:|:----:|:----:|:----:|
| v1 | Serial | 106.1MB | 10272.937ms | 10022.724ms | 10065.625ms | 10120.429ms |
| v1.1 | Serial+njit | 119.6MB | 712.524ms | 699.496ms | 691.721ms | 701.247ms |
| v1.1p | Serial+njit | 105.8MB | 232.681ms | 239.268ms | 234.367ms | 235.439ms |
| v2 | ThreadPoolExecutor(12) | 1750.6MB | 43345.733ms | 44833.593ms | 40681.212ms | 42953.513ms |
| v2.1 | ThreadPoolExecutor(12)+njit | 2013.0MB | 17897.805ms | 16293.948ms | 16591.327ms | 16927.693ms |
| v3 | numpy(vec) | 108.8MB | 9986.405ms | 10205.962ms | 9894.202ms | 10028.856ms |
| v3.1 | numpy(vec)+njit | 115.1MB | 736.445ms | 796.545ms | 749.636ms | 760.875ms |
| v3.2 | numpy+vectorize | 93.2MB | 538.277ms | 532.579ms | 542.114ms | 537.657ms |
| v3.3 | numpy+vectorize+njit | 99.3MB | 932.287ms | 907.180ms | 927.224ms | 922.230ms |
| v3.3p | numpy+vectorize+njit | 92.7MB | 231.020ms | 227.666ms | 228.072ms | 228.919ms |

## 总结
用`numba`就完事了
最后放张算出来的图吧
![](https://s2.loli.net/2024/06/15/t8XaFrjlY5PTZIC.png)
