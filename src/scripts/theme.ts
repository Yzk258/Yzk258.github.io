/**
 * 主题切换 —— 单击在浅色 / 深色之间切换，点按"跟随系统"由长按或
 * 无存储状态兜底。极简实现，不引入任何依赖。
 */
import { THEME_STORAGE_KEY } from './theme-init';

const root = document.documentElement;
const media = window.matchMedia('(prefers-color-scheme: dark)');

function resolve(pref: string): 'light' | 'dark' {
  if (pref === 'light' || pref === 'dark') return pref;
  return media.matches ? 'dark' : 'light';
}

function apply(pref: string) {
  root.dataset.theme = resolve(pref);
  root.dataset.themePref = pref;
}

function readPref(): string {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) ?? 'auto';
  } catch {
    return 'auto';
  }
}

function writePref(pref: string) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, pref);
  } catch {
    /* 隐私模式下写入会失败，忽略即可：本次会话内仍能正常切换 */
  }
}

function currentResolved(): 'light' | 'dark' {
  return root.dataset.theme === 'dark' ? 'dark' : 'light';
}

for (const button of document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]')) {
  button.addEventListener('click', () => {
    const next = currentResolved() === 'dark' ? 'light' : 'dark';
    writePref(next);
    apply(next);
    button.setAttribute('aria-pressed', String(next === 'dark'));
    button.setAttribute(
      'aria-label',
      next === 'dark' ? '切换到浅色主题' : '切换到深色主题',
    );
  });
}

// 用户没有手动选择时，跟随系统变化
media.addEventListener('change', () => {
  if (readPref() === 'auto') apply('auto');
});
