---
title: C++编译期计算的探索
published: 2023-08-07
category: 技术
tags:
  - 技术
  - 编译期计算
  - C++
---

先放个代码在这 解释下次再说吧（摸了

```cpp
#include <iostream>
#include <utility>
#include <array>

namespace compiling {
#define DEF_BINARY_OP(NAME, OP)\
    template <auto N1, auto N2>\
    struct NAME##_t : std::bool_constant<N1 == N2> {};\
    template <auto N1, auto N2>\
    constexpr auto NAME##_v = NAME##_t<N1, N2>::value;
    DEF_BINARY_OP(less_than, <)
    DEF_BINARY_OP(less_than_or_equals, <=)
    DEF_BINARY_OP(greater_than, >)
    DEF_BINARY_OP(greater_than_or_equals, >=)
    DEF_BINARY_OP(equals, ==)
    DEF_BINARY_OP(not_equals, !=)

    template<typename value_type, int N>
    struct factorial_t : std::integral_constant<value_type, N * factorial_t<value_type, N - 1>::value> {};
#define SPECIALIZE_FACTORIAL_T(N, V) template <typename value_type> struct factorial_t<value_type, N> : std::integral_constant<value_type, V> {};
    SPECIALIZE_FACTORIAL_T(0, 0)
    SPECIALIZE_FACTORIAL_T(1, 1)
    template<typename value_type, int N>
    constexpr auto factorial_v = factorial_t<value_type, N>::value;
    template<typename value_type, auto ...N>
    constexpr auto _gen_factorial(std::index_sequence<N...>) {
        return std::array<value_type, sizeof...(N)>{factorial_t<value_type, N>::value...};
    }
    template<typename value_type, int N>
    constexpr auto gen_factorial() {
        return _gen_factorial<value_type>(std::make_index_sequence<N>{});
    }

    template<typename value_type, int N>
    struct fib_t : std::integral_constant<value_type, fib_t<value_type, N - 1>::value + fib_t<value_type, N - 2>::value> {};
#define SPECIALIZE_FIB_T(N, V) template<typename value_type> struct fib_t<value_type, N> : std::integral_constant<value_type, V> {};
    SPECIALIZE_FIB_T(0, 0)
    SPECIALIZE_FIB_T(1, 1)
    SPECIALIZE_FIB_T(2, 1)
    template<typename value_type, int N>
    constexpr auto fib_v = fib_t<value_type, N>::value;

    template<typename value_type, auto ...N>
    constexpr auto _gen_fib(std::index_sequence<N...>) {
        return std::array<value_type, sizeof...(N)>{fib_t<value_type, N>::value...};
    }

    template<typename value_type, int N>
    constexpr auto gen_fib() {
        return _gen_fib<value_type>(std::make_index_sequence<N>{});
    }

    template<int N, int INDEX>
    struct is_prime_t {
        // byd不能短路求值是吧
        // constexpr static bool value = INDEX * INDEX > N || N % INDEX != 0 && is_prime_t<N, INDEX + 1>::value;
        constexpr static bool get() {
            if constexpr (INDEX * INDEX > N) {
                return true;
            } else {
                return N % INDEX != 0 && is_prime_t<N, INDEX + 1>::get();
            }
        }
    };

    template<int INDEX>
    struct is_prime_t<2, INDEX> {
        constexpr static bool get() {
            return true;
        }
    };

    template<int N>
    constexpr bool is_prime_v = is_prime_t<N, 2>::get();

    template<auto ...N>
    constexpr auto _gen_prime(std::index_sequence<N...>) {
        return std::array<bool, sizeof...(N)>{is_prime_t<N, 2>::get()...};
    }

    template<int N>
    constexpr auto gen_prime() {
        return _gen_prime(std::make_index_sequence<N>{});
    }
}
void compiling_test() {
    // ==========static test==========
    // 19! = 121645100408832000
    static_assert(compiling::gen_factorial<long long, 20>()[19] == 121645100408832000ll);
    // 991 is a prime
    static_assert(compiling::gen_prime<1000>()[991] == true);
    // const string concat
    static_assert(std::is_same_v<concat<symbol("Hello"), symbol(" "), symbol("world"), symbol("!")>, symbol("Hello world!")>);
}
```
