---
title: 运行 modsmith 时遇到的完整性级别问题
description: 记录一次从 Edge 权限提示入手，最终查到项目目录完整性级别为 Low 的排查经历
pubDatetime: 2026-10-01T00:30:00+08:00
tags: ["技术笔记", "操作系统", "operating system", "integrity level", "debug"]
featured: false
draft: false
---

# 运行 modsmith 时遇到的完整性级别问题

## 问题是怎么出现的

9 月 30 日，我在修改自己的 modsmith 项目。像往常一样运行程序时，Edge 突然弹出了这样一条提示：

```text
Microsoft Edge 未响应，因为现有实例正在以提升的权限运行。是否要用普通权限重启现有实例？
```

此前运行同一个项目并没有遇到过这个弹窗，所以我起初以为是最近的代码改动引起了问题。提示里提到“提升的权限”，但当时我还不知道权限差异出在浏览器、启动它的进程，还是项目所在的目录。

## 绕了一圈的排查

我先从最容易怀疑的地方下手：把 Git 版本退回去，尝试降级 PowerShell，又调整和优化了项目代码本体。结果这些办法都没能解决问题。代码退回后现象仍在，也让我开始怀疑，问题可能不在这次提交里。

后来我查到了 Windows 的**完整性级别**（Integrity Level）。它和通常说的“有没有管理员权限”有关，但不是同一个开关。Windows 会给进程和某些文件、目录标记完整性级别，常见的有 Low、Medium、High；普通用户启动的进程通常是 Medium。低完整性进程对较高完整性对象的访问会受到限制，而从带有 Low 标签的可执行文件启动进程，也可能让新进程以 Low 级别运行。

于是我检查了项目相关路径的完整性级别，发现它显示为 **Low**。我先把发现的 Low 标签改成 **Medium**，以为到这里就结束了；继续往上查看却发现，项目的父目录，以及再往上参与继承的父目录，也带着 Low 标签。只改项目当前目录，没处理这条继承链，后续创建的子项仍可能继承到 Low。最后，我沿着项目所在的目录链，把查到的这些 Low 标签逐一调整为 Medium。

## 这次真正需要检查什么

如果以后再遇到类似现象，我会先分别看**正在运行的进程**和**项目路径**，而不是只盯着报错窗口。下面是可用于排查的命令示例，路径要换成自己的项目位置：

```powershell
# 查看当前终端进程的完整性级别；在输出中找 Mandatory Label
whoami /groups

# 查看项目目录及其父目录的完整性标签和继承情况
icacls "D:\path\to\modsmith"
icacls "D:\path\to"
```

`icacls` 输出中的 `Low Mandatory Level` 表示低完整性标签；如果要修改目录，可以针对**确认有问题的目录**使用下面的命令。 `(OI)(CI)` 表示让文件和子目录继承这个标签：

```powershell
icacls "D:\path\to\modsmith" /setintegritylevel "(OI)(CI)M"
```

这只是命令示例，并不是我当时逐条执行过的命令记录。修改前应先确认目标路径和现有标签；如果上层目录仍为 Low，或已有子项带着单独设置的 Low 标签，还需要继续检查。不要为了省事，把无关目录或整个磁盘的完整性级别一起改掉。

回头看，Edge 的提示给了我“权限上下文不一致”的线索，却不能仅凭这一条提示断定根因。真正让我换方向的是：Git 回退、PowerShell 降级和代码调整都无效，而项目目录及其父目录确实存在 Low 标签。这次问题也提醒我，遇到运行环境里的权限异常时，要把目录继承和进程完整性级别一起纳入排查。

参考资料：[Microsoft：Mandatory Integrity Control](https://learn.microsoft.com/en-us/windows/win32/secauthz/mandatory-integrity-control)、[Microsoft：icacls 命令](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/icacls)。

