// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages 用户主页仓库：https://yzk258.github.io
// 因为仓库名形如 <user>.github.io，站点直接挂在根路径，因此 base 保持 '/'。
export default defineConfig({
  site: 'https://yzk258.github.io',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  devToolbar: {
    enabled: false,
  },
});
