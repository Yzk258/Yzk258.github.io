---
title: 运行项目时遇到的 Integrity level 错误问题
description: 记录了在运行某个项目时遇到的 Integrity level 错误问题及其解决方法
pubDatetime: 2026-10-01T18:30:00+08:00   # 必须带时区
tags: ["技术笔记", "操作系统", "operating system", "integrity level"]
featured: false      # true 会置顶
draft: false         # true 则不参与构建
---

# 运行项目时遇到的 Integrity level 错误问题

> “龙生龙，凤生凤，老鼠生儿会打洞。”——《三字经》

## 背景

9.30在修改我的rustagent项目时，在运行时遇到了一个奇怪的错误：

```
Microsoft Edge 未响应，因为现有实例正在以提升的权限运行。是否要用普通权限重启现有实例？
```

之前从来没有碰见过这类问题，因为平时接触到的web项目基本都是三件套完成的，无论动态静态直接双击html等相关文件就可以运行，但是rustagent项目背景是基于rust语言的，运行时需要使用cargo run命令来启动项目简介打开浏览器访问，然而就在运行时却遇到了上述错误提示。

奇怪的是，之前在运行rustagent项目时并没有遇到过这个问题，而这次莫名其妙就蹦了个错误窗口出来，很难不让人深究，于是乎我开始尝试寻找这个问题的根源。

