---
title: C++函数模板偏特化问题较为美观的一种解决方案
published: 2024-07-07
category: 技术
tags:
  - 技术
  - 函数模板
  - C++
---

C++函数模板偏特化问题较为美观的一种解决方案
使`std::enable_if_t`作为`int`并带上默认值
``` cpp
template <typename T, typename std::enable_if_t<std::is_integral_v<T>, int> = 0>
void foo(T x) {
    std::cout << "is integral\n";
}

template <typename T, typename std::enable_if_t<std::is_floating_point_v<T>, int> = 0>
void foo(T x) {
    std::cout << "is floating point\n";
}
```
