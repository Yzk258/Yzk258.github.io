import { defineConfig, envField, svgoOptimizer } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
// 提示框用 GitHub 的引用块语法（> [!NOTE]），rehype-callouts 直接解析
// blockquote 节点，因此不需要 remark-directive 这类指令解析插件。
import rehypeCallouts from "rehype-callouts";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import config from "./astro-paper.config";

export default defineConfig({
  site: config.site.url,
  integrations: [mdx(), sitemap()],
  markdown: {
    processor: unified({
      remarkPlugins: [
        remarkMath,
        // 这两个必须配成一对：
        // remark-toc 默认只认标题为 "Contents"/"toc" 的标题，
        // 所以要把中文标题显式传进去，否则它找不到插入位置、目录会是空的。
        [remarkToc, { heading: "目录" }],
        [
          remarkCollapse,
          {
            test: "目录",
            // 默认文案是 "Open 目录"，这里换成纯中文
            summary: () => "目录",
          },
        ],
      ],
      rehypePlugins: [rehypeCallouts, rehypeKatex],
    }),
    shikiConfig: {
      /*
       * 浅色与深色不是同一套配色，这是特意为之：
       * Catppuccin Latte 偏柔和，10 种 token 色里 8 种对比度低于 4.5:1
       * （最差 2.34:1），注释色也只有 3.49:1，代码会看不清；
       * Mocha 则 10 种全部达标（5.81–11.34:1）。
       * 试过的浅色主题里只有 github-light 系列注释色也达标，
       * 其中 github-light-default 的整体对比度更好，
       * 所以浅色用它，深色继续用与站点一致的 Mocha。
       */
      themes: { light: "github-light-default", dark: "catppuccin-mocha" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});
