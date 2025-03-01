---
title: .NET 7中System.IO.Compression的性能测试
cover: https://s2.loli.net/2023/06/10/Pqoy9g7wX1E5FdO.png
top_img: https://s2.loli.net/2023/06/10/Pqoy9g7wX1E5FdO.png
date: 2023-06-10 21:37:01
categories: 
- 技术
tags:
- 技术
- .NET
- C#
---

之前我对一个字符串格式的文本文档进行了整理 将其转换为了二进制文件 其格式如下
| field (per row) | type | size |
| :----: | :----: | :----: |
| field1 | int64 | 8byte |
| field2 | int64 | 8byte |

这不仅使得体积从约16GB减小到约10GB 还大幅提升了读取和检索的速度
从在WSL1中使用cat+grep最高300MB/s的速度
提升到用C写一个简单的程序进行读取的最高约1GB/s的速度
最近 为了进一步压缩体积 我决定对其进行压缩

当然 一切的前提是便于检索数据 即可以通过流式方法读取数据
于是我决定使用GZip 一方面GZip是比较广泛的压缩格式
另一方面C#在`System.IO.Compression`中提供了`GZipStream` 便于读取
同时也可以用这个进行压缩
# 压缩测试
`GZipStream`提供了`CompressionLevel`的选项 包括`Optimal` `Fastest` `SmallestSize`和`NoComression`
为了选择使用哪个等级压缩 我写了一个简单的基准测试来比较 代码如下
```C#
static void Compress(CompressionLevel compressionLevel)
{
    Console.WriteLine($"input file: {rawFile}");
    Console.WriteLine($"output file: {gzFile}");
    using var inputStream = File.OpenRead(rawFile);
    using var outputStream = File.OpenWrite(gzFile);
    using var gzipStream = new GZipStream(outputStream, compressionLevel);
    var sw = Stopwatch.StartNew();
    inputStream.CopyTo(gzipStream);
    var seconds = sw.Elapsed.TotalSeconds;
    Console.WriteLine($"Time used: {seconds}s");
    long rawSize = new FileInfo(rawFile).Length;
    long compressedSize = new FileInfo(gzFile).Length;
    Console.WriteLine($"Compressed {rawSize} bytes to {compressedSize} bytes, compression ratio: {Math.Round((double)compressedSize / rawSize, 5) * 100}%");
    Console.WriteLine($"Average speed: " +
        $"Read: {Math.Round((double)rawSize / 1024 / 1024 / seconds, 3)}MB/s, " +
        $"Write: {Math.Round((double)compressedSize / 1024 / 1024 / seconds, 3)}MB/s");
}
static void Main(string[] args)
{
    foreach (var compressionLevel in Enum.GetValues<CompressionLevel>())
    {
        Console.WriteLine($"====================[{compressionLevel}]====================");
        Compress(compressionLevel);
        Console.WriteLine();
    }
}
```

使用NativeAot编译后运行得到结果
测试平台:
CPU: Intel(R) Core(TM) i7-10750H CPU @ 2.60GHz
RAM Size: 16GB
OS Version: Win11 22H2 22621.1778
测试结果:
```plain
====================[Optimal]====================
input file: D:\Files\裤子\qq8e.bin
output file: D:\Files\裤子\qq8e.gz
Time used: 263.0331656s
Compressed 11519053264 bytes to 5577536686 bytes, compression ratio: 48.42%
Average speed: Read: 41.764MB/s, Write: 20.222MB/s

====================[Fastest]====================
input file: D:\Files\裤子\qq8e.bin
output file: D:\Files\裤子\qq8e.gz
Time used: 133.5304461s
Compressed 11519053264 bytes to 5577536686 bytes, compression ratio: 48.42%
Average speed: Read: 82.269MB/s, Write: 39.835MB/s

====================[NoCompression]====================
input file: D:\Files\裤子\qq8e.bin
output file: D:\Files\裤子\qq8e.gz
Time used: 30.9754716s
Compressed 11519053264 bytes to 11520778240 bytes, compression ratio: 100.01500000000001%
Average speed: Read: 354.649MB/s, Write: 354.702MB/s

====================[SmallestSize]====================
input file: D:\Files\裤子\qq8e.bin
output file: D:\Files\裤子\qq8e.gz
```
SmallestSize实在等不及了 根据任务管理器的数据估算Read在2MB/s Write在200KB/s
照这个速度要91.55小时才能压缩完

根据数据 选择Fastest即可满足需求

# 读取并检索
先写一个读取原始二进制数据的代码
```C#
var BatchSize = Prompt.Input<int>("Please enter batch size", 65536);
using var inputStream = File.OpenRead(rawFile);
byte[] bytes = new byte[BatchSize * 16];
long target = 114514L;
var sw = Stopwatch.StartNew();
while (inputStream.Read(bytes) > 0)
{
    for (int i = 0; i < BatchSize; i++)
    {
        long field1 = BitConverter.ToInt64(bytes, i * 16);
        long field2 = BitConverter.ToInt64(bytes, i * 16 + 8);
        if (uid == target)
        {
            double seconds = sw.Elapsed.TotalSeconds;
            Console.WriteLine($"field1: {field1}, field2: {field2}");
            Console.WriteLine($"time used: {seconds}s");
            Console.WriteLine($"average speed: {Math.Round((double)inputStream.Position / 1024 / 1024 / sw.Elapsed.TotalSeconds, 3)}MB/s");
            goto found;
        }
    }
}
Console.WriteLine("Not found!");
```
BatchSize为65536时 速度达到了约1500MB/s

再看看压缩后的数据
代码差异不大 只不过把`FileStream`改成`GZipStream`
可惜的是 这时Read的速度只有约25MB/s 几乎不能使用
然而我又发现 无论压缩时选用的ComressionLevel是什么(即使是NoCompression)
读取时速度都是这么慢 可能是我代码写得有点问题 但由于时间原因无法深入研究

# 总结
寄