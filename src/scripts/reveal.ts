/**
 * 滚动揭示：给 [data-reveal] 元素在进入视口时加上 .is-visible。
 * 只触发一次，触发后立即取消观察，避免反复重放动画。
 *
 * 注意：这里不再使用旧站点每 50ms 生成 DOM 节点的做法，
 * 每个元素只在合适时机加一个 class，滚动过程中没有持续计算。
 */
const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');

if (targets.length > 0) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    for (const el of targets) el.classList.add('is-visible');
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );

    for (const el of targets) observer.observe(el);
  }
}
