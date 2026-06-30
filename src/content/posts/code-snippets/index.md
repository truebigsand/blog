---
title: 代码片段
published: 2023-07-06
category: 技术
tags:
  - 技术
  - .NET
  - C#
  - C++
  - Python
---

一些`-study`项目中有用的代码片段

## [C++]生成GUID(仅Windows下可用)
```cpp
#include <objbase.h>

GUID CreateGuid() {
    GUID guid;
    if (CoCreateGuid(&guid) == S_OK) {
        return guid;
    }
    throw exception("generate guid failed!");
}

string GuidToString(const GUID& guid) {
    char buf[64] = { 0 };
    snprintf(buf, sizeof(buf),
        "{%08X-%04X-%04X-%02X%02X-%02X%02X%02X%02X%02X%02X}",
        guid.Data1, guid.Data2, guid.Data3,
        guid.Data4[0], guid.Data4[1], guid.Data4[2], guid.Data4[3],
        guid.Data4[4], guid.Data4[5], guid.Data4[6], guid.Data4[7]);
    return string(buf);
}
```

## [C++]高斯消元
```cpp
#include <vector>
class Matrix : public std::vector<std::vector<double> > {
public:
	void Init(int row, int col) {
		assign(row, vector<double>());
		for (int i = 0; i < row; i++) {
			at(i).assign(col, 0);
		}
	}
};
/*要求系数矩阵可逆
此处A为增广矩阵，即A[i][n]为第i个方程右边的常数bi
运行结束后A[i][n]为第i个未知数的值 */
void gauss_elimination(std::vector<std::vector<double> >& A, int n) {
	int i, j, k, r;
	//消元过程
	for (i = 0; i < n; i++) {
		//选一行r并与第i行交换
		r = i;
		for (j = i + 1; j < n; j++) {
			if (fabs(A[j][i]) > fabs(A[r][i])) {
				r = j;
			}
		}
		if (r != i) {
			for (j = 0; j <= n; j++) {
				std::swap(A[r][j], A[i][j]);
			}
		}
		//与第i+1至第n行进行消元
		for (k = i + 1; k < n; k++) {
			double f = A[k][i] / A[i][i];
			for (j = i; j <= n; j++) {
				A[k][j] -= f * A[i][j];
			}
		}
	}
	//回代过程
	for (i = n - 1; i >= 0; i--) {
		for (j = i + 1; j < n; j++) {
			A[i][n] -= A[j][n] * A[i][j];
		}
		A[i][n] /= A[i][i];
	}
}
```

## [C++]多项式拟合
```cpp
#include <iostream>

// 高斯消元，定义在上一节
void gauss_elimination(std::vector<std::vector<double> >& A, int n)
inline bool fequal(double a, double b) {
	return fabs(a - b) < 1e-6;
}
void fxformatprint(std::vector<std::vector<double> > a, int n) {
	bool first = 1;
	int last = 0;
	std::cout << std::fixed << "f(x)=";
	for (int i = 0; i < n; i++) {
		if (fequal(a[i][n], 0)) {
			continue;
		}
		last = i;
		if (a[i][n] > 0 && !first) {
			std::cout << '+';
		}
		if (!fequal(a[i][n], 1)) {
			if (fequal(a[i][n], -1)) {
				std::cout << '-';
			}
			else {
				std::cout << a[i][n];
			}
		}
		if (n - (i + 1) > 1) {
			std::cout << "x^" << n - (i + 1);
		}
		else if (n - (i + 1) == 1) {
			std::cout << "x";
		}
		first = 0;
	}
	if (fequal(a[last][n], -1)) {
		std::cout << 1;
	}
}
// 仅支持{(1, a1),(2, a2),...,(n, an)}的数据
int main() {
    std::vector<std::vector<double> > a;
    int n;
	std::cin >> n;
    a.assign(row, vector<double>());
    for (int i = 0; i < row; i++) {
        a.at(i).assign(col, 0);
    }
	for (int i = 0; i < n; i++) {
		std::cin >> a[i][n];
	}
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < n; j++) {
			a[i][j] = pow(i + 1, n - (j + 1));
		}
	}
    // 高斯消元
	gauss_elimination(a, n);
    // 多项式输出
	fxformatprint(a, n);
	return 0;
}
```

## [C++]斗地主牌型解析(?)
```cpp
const int CardTypeCount = 13;
enum CardType {
	Single,
	Double,
	Triple,
	TripleSingle,
	TripleDouble,
	Straight,
	DoubleStraight,
	TripleStraight,
	PlaneWithSingle,
	PlaneWithDouble,
	Bomb,
	SuperBomb,
	BombDouble,
};
std::map<std::multiset<int>, CardType> CardTypeMap{
	{std::multiset<int>({4}),CardType::Bomb},
	{std::multiset<int>({4,2}),CardType::BombDouble},

	{std::multiset<int>({3}),CardType::Triple},
	{std::multiset<int>({3,1}),CardType::TripleSingle},
	{std::multiset<int>({3,2}),CardType::TripleDouble},

	{std::multiset<int>({3,3}),CardType::TripleStraight},
	{std::multiset<int>({3,3,3}),CardType::TripleStraight},
	{std::multiset<int>({3,3,3,3}),CardType::TripleStraight},
	{std::multiset<int>({3,3,3,3,3}),CardType::TripleStraight},

	{std::multiset<int>({3,3,1,1}),CardType::PlaneWithSingle},
	{std::multiset<int>({3,3,3,1,1,1}),CardType::PlaneWithSingle},

	{std::multiset<int>({3,3,2,2}),CardType::PlaneWithDouble},
	{std::multiset<int>({3,3,3,2,2,2}),CardType::PlaneWithDouble},

	{std::multiset<int>({2}),CardType::Double},

	{std::multiset<int>({2,2,2}),CardType::DoubleStraight},
	{std::multiset<int>({2,2,2,2}),CardType::DoubleStraight},
	{std::multiset<int>({2,2,2,2,2}),CardType::DoubleStraight},
	{std::multiset<int>({2,2,2,2,2,2}),CardType::DoubleStraight},
	{std::multiset<int>({2,2,2,2,2,2,2}),CardType::DoubleStraight},
	{std::multiset<int>({2,2,2,2,2,2,2,2}),CardType::DoubleStraight},

	{std::multiset<int>({1}),CardType::Single},
	{std::multiset<int>({1,1}),CardType::Double},

	{std::multiset<int>({1,1,1,1,1}),CardType::Straight},
	{std::multiset<int>({1,1,1,1,1,1}),CardType::Straight},
	{std::multiset<int>({1,1,1,1,1,1,1}),CardType::Straight},
	{std::multiset<int>({1,1,1,1,1,1,1,1}),CardType::Straight},
	{std::multiset<int>({1,1,1,1,1,1,1,1,1}),CardType::Straight},
	{std::multiset<int>({1,1,1,1,1,1,1,1,1,1}),CardType::Straight},
	{std::multiset<int>({1,1,1,1,1,1,1,1,1,1,1}),CardType::Straight},
	{std::multiset<int>({1,1,1,1,1,1,1,1,1,1,1,1}),CardType::Straight},
	{std::multiset<int>({1,1,1,1,1,1,1,1,1,1,1,1,1}),CardType::Straight},
};
class CardToken {
private:
	std::string BaseString;
	CardType Type;
	template<class T>
	std::multiset<std::pair<int, T>> Count(std::vector<T> v) {
		constexpr int tmpsize = std::numeric_limits<T>::max() - std::numeric_limits<T>::min();
		int tmp[tmpsize];
		memset(tmp, 0, sizeof(tmp));
		for (int i = 0; i < v.size(); i++) {
			tmp[v[i]]++;
		}
		std::multiset<pair<int, T>> ans;
		for (int i = 0; i < tmpsize; i++) {
			if (tmp[i] != 0) {
				ans.insert(pair<int, T>(tmp[i], i));
			}
		}
		return ans;
	}
	template<class T>
	CardType GetCardTypeByCountResult(std::multiset<std::pair<int, T>> CountResult) {
		std::multiset<int> times, cards;
		for (typename std::multiset<std::pair<int, T>>::const_iterator iter = CountResult.begin(); iter != CountResult.end(); iter++) {
			times.insert(iter->first);
			cards.insert(iter->second);
		}
		CardType ans = CardTypeMap[times];
		if (ans == CardType::Double && cards.count('S') && cards.count('L')) {
			ans = CardType::SuperBomb;
		}
		return ans;
	}
public:
	CardToken(std::string BaseString) :BaseString(BaseString) {};
	CardToken() { BaseString = ""; }

	CardType GetCardType()const { return Type; }
	void SetCardType(CardType Type) {
		if (Type >= CardTypeCount || Type < 0) {
			throw "CardType undefined!";
		}
		this->Type = Type;
	}
	std::string GetBaseString()const { return BaseString; }
	void SetBaseString(const std::string& BaseString) {
		this->BaseString = BaseString;
		this->Type = GetCardTypeByCountResult(Count(std::vector<char>(BaseString.begin(), BaseString.end())));
	}
};
//3-10(X is 10),JQK,small and large king
//const std::string SortedCards = "3456789XJQK12SL";
```

## [C++]分数类
```cpp
#pragma once
#include <sstream>

template<class Integer>
class FractionBase {
private:
	inline const Integer& gcd(const Integer& a, const Integer& b) {
		return b > 0 ? gcd(b, a % b) : a;
	}
	inline const Integer& lcm(const Integer& a, const Integer& b) {
		return a * b / gcd(a, b);
	}
	inline const Integer& pow(const Integer& a, int b) {
		Integer result = 1;
		for (int i = 1; i <= b; i++) {
			result *= a;
		}
		return result;
	}
	inline int GetDecimalLength(double a) {
		std::stringstream ss;
		ss << a - (int)a;
		return ss.str().length() - 2;
	}
	inline int GetDecimalLength(long double a) {
		std::stringstream ss;
		ss << a - (int)a;
		return ss.str().length() - 2;
	}
	inline void Simplify() {
		
		Integer gcdValue = gcd(numerator, denominator);
		numerator /= gcdValue;
		denominator /= gcdValue;
	}
	Integer numerator, denominator;
public:
	FractionBase(const Integer& numerator, const Integer& denominator):
		numerator(numerator), denominator(denominator) {
		Simplify();
	}
	FractionBase(double a) {
		(*this) = a;
	}
	FractionBase(long double a) {
		(*this) = a;
	}
	FractionBase(const Integer& a) {
		(*this) = a;
	}
	FractionBase() { }
	// 获取分子
	Integer& GetNumerator() { return numerator; }
	// 获取分母
	Integer& GetDenominator() { return denominator; }
	// 获取倒数
	inline FractionBase GetReversed() { return FractionBase(denominator, numerator); }

	void SetNumerator(Integer numerator) {
		this->numerator = numerator;
	}
	void SetDenominator(Integer deno) {
		if (deno == 0) {
			throw "The denominator cannot be 0!";
		}
		denominator = deno;
		//std::cout << denominator << ' ' << deno << std::endl;
	}
	
	FractionBase& operator=(FractionBase a) {
		numerator = a.numerator;
		denominator = a.denominator;
		Simplify();
		return *this;
	}
	FractionBase& operator=(const Integer& a) {
		SetNumerator(a);
		SetDenominator(1);
		Simplify();
		return *this;
	}
	FractionBase& operator=(double a) {
		int DecimalLength = GetDecimalLength(a);
		SetNumerator(a * pow(10, DecimalLength));
		SetDenominator(pow(10, DecimalLength));
		Simplify();
		return *this;
	}
	FractionBase& operator=(long double a) {
		int DecimalLength = GetDecimalLength(a);
		SetNumerator(a * pow(10, DecimalLength));
		SetDenominator(pow(10, DecimalLength));
		Simplify();
		return *this;
	}

	friend FractionBase operator+(FractionBase& a, FractionBase& b) {
		return FractionBase(a.GetNumerator() * b.GetDenominator() + a.GetDenominator() * b.GetNumerator(), a.GetDenominator() * b.GetDenominator());
	}
	friend FractionBase operator-(FractionBase& a, FractionBase& b) {
		return FractionBase(a.GetNumerator() * b.GetDenominator() - a.GetDenominator() * b.GetNumerator(), a.GetDenominator() * b.GetDenominator());
	}
	friend FractionBase operator*(FractionBase& a, FractionBase& b) {
		return FractionBase(a.GetNumerator() * b.GetNumerator(), a.GetDenominator() * b.GetDenominator());
	}
	friend FractionBase operator/(FractionBase& a, FractionBase& b) {
		return a * b.GetReversed();
	}
	friend FractionBase& operator+=(FractionBase& a, const FractionBase& b) { return a = a + b; }
	friend FractionBase& operator-=(FractionBase& a, const FractionBase& b) { return a = a - b; }
	friend FractionBase& operator*=(FractionBase& a, const FractionBase& b) { return a = a * b; }
	friend FractionBase& operator/=(FractionBase& a, const FractionBase& b) { return a = a / b; }

	friend bool operator>(const FractionBase& a, const FractionBase& b) {
		return a.GetNumerator() * b.GetDenominator() > a.GetDenominator() * b.GetNumerator();
	}
	friend bool operator<(const FractionBase& a, const FractionBase& b) {
		return a.GetNumerator() * b.GetDenominator() < a.GetDenominator() * b.GetNumerator();
	}
	friend bool operator==(const FractionBase& a, const FractionBase& b) {
		return a.GetNumerator() == b.GetNumerator() && a.GetDenominator() == b.GetDenominator();
	}
	friend bool operator>=(const FractionBase& a, const FractionBase& b) {
		return a > b || a == b;
	}
	friend bool operator<=(const FractionBase& a, const FractionBase& b) {
		return a < b || a == b;
	}
	friend bool operator!=(const FractionBase& a, const FractionBase& b) {
		return !(a == b);
	}

	template<class T>
	friend std::ostream& operator<<(std::ostream& os, FractionBase<T> a);
	template<class T>
	friend std::istream& operator>>(std::istream& is, FractionBase<T>& a);
};

template<class Integer>
std::ostream& operator<<(std::ostream& os, FractionBase<Integer> a) {
	return os << a.GetNumerator() << '/' << a.GetDenominator();
}
template<class Integer>
std::istream& operator>>(std::istream& is, FractionBase<Integer>& a) {
	Integer numerator, denominator;
	is >> numerator >> denominator;
	a.SetNumerator(numerator);
	a.SetDenominator(denominator);
	return is;
}

typedef FractionBase<int> frac;
```

## [C++]随机数生成器类(梅森旋转法)
从一个实际项目中抽出来的 所以使用了functional
```cpp
#pragma once
#include <functional>
#include <ctime>

class Random
{
private:
	int MTindex;
	long long MT[624];
	void csrand(int seed) {
		MTindex = 0;
		MT[0] = seed;
		for (int i = 1; i < 624; i++) {
			int t = 1812433253 * (MT[i - 1] ^ (MT[i - 1] >> 30)) + i;
			MT[i] = t & 0xffffffff;
		}
	}
	inline void generate() {
		for (int i = 0; i < 624; i++) {
			long long y = (MT[i] & 0x80000000) + (MT[(i + 1) % 624] & 0x7fffffff);
			MT[i] = MT[(i + 397) % 624] ^ (y >> 1);
			if (y % 2 == 1) MT[i] ^= 2147483647;
		}
	}
public:
	std::function<int()> RandInt = [this] {
		if (MTindex == 0) generate();
		int y = MT[MTindex];
		y = y ^ (y >> 11);
		y = y ^ ((y << 7) & 1636928640);
		y = y ^ ((y << 15) & 1022730752);
		y = y ^ (y >> 18);
		MTindex = (MTindex + 1) % 624;
		return y;
	};
	std::function<int(int, int)> RandIntEx = [this](int Min, int Max) {
		if (Min > Max) Min = Max;
		if (Min == Max) return Min;
		else return RandInt() % (Max - Min + 1) + Min;
	};
	std::function<long long()> RandLongLong = [this] {
		return ((long long)(RandInt()) << 31) + RandInt();
	};
	std::function<long long(long long, long long)> RandLongLongEx = [this](long long Min, long long Max) {
		if (Min > Max) Min = Max;
		if (Min == Max) return Min;
		else return RandLongLong() % (Max - Min + 1) + Min;
	};
	std::function<bool()> RandBool = [this] {
		return RandIntEx(0, 1);
	};
	std::function<char()> RandVisibleChar = [this] {
		return RandIntEx(32, 126);
	};
	std::function<char()> RandUpperLetter = [this] {
		return RandIntEx('A', 'Z');
	};
	std::function<char()> RandLowerLetter = [this] {
		return RandIntEx('a', 'z');
	};
	std::function<char()> RandLetter = [this] {
		return RandBool() ? RandUpperLetter() : RandLowerLetter();
	};
	std::function<char()> RandFormatChar = [this] {
		const char fmtc[5] = { '\n','\t','\r','\v','\f' };
		return fmtc[RandIntEx(0, 4)];
	};
	std::function<std::string(int)> RandWord = [this](int Length) {
		std::string result = "";
		for (int i = 0; i < Length; i++) {
			result = result + RandLetter();
		}
		return result;
	};
	std::function<std::string(int, int, int)> RandArticle = [this](int WordSum, int WordLengthMin = 1, int WordLengthMax = 10) {
		std::string result;
		result = RandWord(RandIntEx(WordLengthMin, WordLengthMax));
		for (int i = 1; i < WordSum; i++) {
			result = result + " " + RandWord(RandIntEx(WordLengthMin, WordLengthMax));
		}
		return result;
	};

	Random() {
		csrand((int)time(NULL));
	}
	~Random() {

	}
};
```
