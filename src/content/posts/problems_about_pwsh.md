---
title: 有关VScode powershell配置虚拟环境时遇到的小问题
description: 有关VScode powershell配置虚拟环境时遇到的小问题
pubDatetime: 2026-09-29T00:30:00+08:00   # 必须带时区
tags: ["技术笔记", "debug", "powershell"]
featured: false      # true 会置顶
draft: false         # true 则不参与构建
---
# 有关VScode powershell配置虚拟环境时遇到的小问题

深夜，尝试在笔记本某个工作区上配置python3.12的虚拟环境，结果虚拟环境venv创建好了，文件都在，但是死活启动不了。

翻来覆去睡不着，想着到底是哪里出了问题，因为就在不久前（7~8月份），刚建完一个venv并正常启动做了点简单的数据分析，理应来讲不可能这么快就出新问题。

当时报错提示：

```
.\.venv\Scripts\Activate.ps1 : 无法加载文件 xx\.venv\Scripts\Activate.ps1。未对文件 xx\.venv\Scripts\Activate.ps1 进行数字签名。无法在当前系统上运行该脚本。有关运行脚本和设置执行策略的详
细信息，请参阅 https:/go.microsoft.com/fwlink/?LinkID=135170 中的 about_Execution_Policies。
所在位置 行:1 字符: 1

+ .\.venv\Scripts\Activate.ps1
+ 
    + CategoryInfo          : SecurityError: (:) []，PSSecurityException
    + FullyQualifiedErrorId : UnauthorizedAccess
```

后来发现原来是电脑Windows系统自带的pwsh版本过于老旧，导致在启动虚拟环境的bat以及ps1脚本时因权限问题无法正常运行。然后用`$PSVersionTable.PSVersion`查了查，发现果不其然版本高达5.1😅。

所以屁颠屁颠跑去win官网上下了份最新（7.6.6）的msi安装包，配置在VScode中，再次启动发现成了！绿色的(.venv)酱浮现在我的终端。

而且值得一提的是，如果使用的是command prompt，就不会有这个权限相关问题，直接输入`.\.venv\Scripts\Activate.bat`即可正常启动虚拟环境，可能这就是为什么前后两次启动差异如此之大，为什么上次使用时没有因为版本过久无法使用的原因。

---

未完待续

To be continued。。。
