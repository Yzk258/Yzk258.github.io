---
title: 代码块与提示框的写法
description: frontmatter 怎么写、代码块如何加文件名和高亮行、提示框有哪几种。留着当速查。
pubDatetime: 2026-09-26T14:00:00+08:00
tags: ["写作", "格式"]
---

这篇是格式速查，写文章时对照着看。

## frontmatter

每篇文章开头的字段，只有 `title`、`description`、`pubDatetime` 是必填：

```yaml title="src/content/posts/example.md"
---
title: 文章标题
description: 一两句话的摘要，会显示在列表页和搜索结果里
pubDatetime: 2026-09-26T14:00:00+08:00   # 必须带时区
tags: ["标签一", "标签二"]
featured: false        # 设为 true 会置顶到首页
draft: false           # 设为 true 则不参与构建
---

正文从这里开始。
```

> [!CAUTION]
> `pubDatetime` 一定要带时区（`+08:00`）。
> 只写日期会被当成 UTC 零点，在东八区显示成前一天。

## 代码块

普通代码块会按语言自动高亮，配色跟站点主题一致：

```ts
export function getReadingMinutes(markdown: string): number {
  const cjkCount = (markdown.match(CJK_RE) ?? []).length;
  const minutes = cjkCount / 300;
  return Math.max(1, Math.round(minutes));
}
```

加 `title="文件名"` 会显示文件名标签：

```js title="src/utils/format.js"
export const formatDate = date =>
  new Intl.DateTimeFormat("zh-CN", { dateStyle: "long" }).format(date);
```

用注释标记可以高亮某一行或某个词：

```bash
npm install     # [!code highlight]
npm run dev
```

```js
const answer = 42; // [!code word:42]
```

## 提示框

用的是 GitHub 的提示语法 —— 引用块后面紧跟 `[!类型]`。
支持五种类型：`NOTE`、`TIP`、`IMPORTANT`、`WARNING`、`CAUTION`。

```md
> [!NOTE]
> 普通提示，用于补充说明。

> [!TIP]
> 小技巧或建议。

> [!IMPORTANT]
> 重要信息，别忽略。

> [!WARNING]
> 警告，做错了可能有后果。

> [!CAUTION]
> 注意事项。
```

实际效果：

> [!NOTE]
> 普通提示，用于补充说明。

> [!TIP]
> 小技巧或建议。

> [!IMPORTANT]
> 重要信息，别忽略。

> [!WARNING]
> 警告，做错了可能有后果。

> [!CAUTION]
> 注意事项。

标题可以自己写，写在类型后面：

```md
> [!NOTE] 自定义标题
> 正文内容。
```

> [!NOTE] 自定义标题
> 正文内容。

在类型后加 `-` 可以让提示框默认折叠，加 `+` 则默认展开：

```md
> [!TIP]- 点开才看
> 折叠起来的内容。
```

## 图片

放在 `src/content/posts/` 同级目录下引用，构建时会被处理：

```md
![图片说明](./images/demo.png)
```

文章里的图片点一下可以放大，按 `Esc` 关闭。

## 标题层级

正文里用 `##` 和 `###`。这两个层级的标题会自动出现在目录里，
鼠标移到标题上会出现锚点链接，方便分享某一节的地址。
