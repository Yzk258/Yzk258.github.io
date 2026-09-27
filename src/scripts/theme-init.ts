/**
 * 主题初始化 —— 必须在 <head> 中同步执行，避免深色模式下的白屏闪烁（FOUC）。
 * 通过 <script is:inline> 内联进 HTML，不能改成外部模块。
 *
 * data-theme 属性的取值只可能是 'light' 或 'dark'：
 * theme.ts 会把 'auto' 解析成系统当前偏好后再写入，
 * 这样 CSS 侧只需处理两套值，逻辑集中在这一处。
 */
export const themeInit = `(function(){try{
var K='yzk-theme';
var s=localStorage.getItem(K)||'auto';
var sys=window.matchMedia('(prefers-color-scheme: dark)');
var resolved=(s==='auto')?(sys.matches?'dark':'light'):s;
document.documentElement.dataset.theme=resolved;
document.documentElement.dataset.themePref=s;
}catch(e){}})();`;

export const THEME_STORAGE_KEY = 'yzk-theme';
