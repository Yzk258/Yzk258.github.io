/**
 * 文章页的交互：阅读进度条、代码块复制、标题锚点、图片放大、回到顶部。
 *
 * 用 astro:page-load 而不是一次性绑定 —— 主题启用了 ClientRouter，
 * 站内跳转是局部替换 DOM，脚本不会重新执行，所以要每次都重新初始化。
 */

/**
 * 文案从 #post-body 的 data 属性读取，由页面注入 i18n 结果，
 * 这样改语言不用动这个文件。
 */
function getLabels() {
  const body = document.getElementById("post-body");
  return {
    copy: body?.dataset.copyLabel ?? "复制",
    copied: body?.dataset.copiedLabel ?? "已复制",
    copyFailed: body?.dataset.copyFailedLabel ?? "复制失败",
    linkToHeading: body?.dataset.linkToHeadingLabel ?? "链接到本节",
  };
}

function initProgressBar() {
  const existing = document.getElementById("reading-progress");
  if (existing) existing.remove();

  const bar = document.createElement("div");
  bar.id = "reading-progress";
  bar.setAttribute("aria-hidden", "true");
  bar.className = "fixed top-0 z-50 h-0.5 w-0 bg-accent";
  document.body.appendChild(bar);

  const update = () => {
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const ratio = height > 0 ? (scrollTop / height) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(0, ratio))}%`;
  };

  update();
  document.addEventListener("scroll", update, { passive: true });
}

function initCopyButtons() {
  const labels = getLabels();
  const blocks = document.querySelectorAll<HTMLPreElement>(
    "#post-body pre:not([data-copy-ready])"
  );

  for (const block of blocks) {
    block.dataset.copyReady = "true";

    const button = document.createElement("button");
    button.type = "button";
    button.className =
      "copy-code absolute end-2 top-2 rounded border border-border bg-background px-2 py-1 text-xs leading-4 text-foreground";
    button.textContent = labels.copy;
    button.setAttribute("aria-label", labels.copy);

    const wrapper = document.createElement("div");
    wrapper.className = "relative";
    block.parentNode?.insertBefore(wrapper, block);
    wrapper.appendChild(block);
    wrapper.appendChild(button);

    button.addEventListener("click", async () => {
      const code = block.querySelector("code");
      try {
        await navigator.clipboard.writeText(code?.innerText ?? "");
        button.textContent = labels.copied;
      } catch {
        // 剪贴板不可用（例如非安全上下文）时明确告知，不假装成功
        button.textContent = labels.copyFailed;
      }
      window.setTimeout(() => {
        button.textContent = labels.copy;
      }, 1200);
    });
  }
}

function initHeadingAnchors() {
  const labels = getLabels();
  const headings = document.querySelectorAll<HTMLHeadingElement>(
    "#post-body h2:not([data-anchor-ready]), #post-body h3:not([data-anchor-ready])"
  );

  for (const heading of headings) {
    if (!heading.id) continue;
    heading.dataset.anchorReady = "true";
    heading.classList.add("group");

    const link = document.createElement("a");
    link.href = `#${heading.id}`;
    link.className =
      "heading-link ms-2 text-muted-foreground no-underline opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100";
    link.setAttribute(
      "aria-label",
      `${labels.linkToHeading}：${heading.textContent}`
    );

    const mark = document.createElement("span");
    mark.setAttribute("aria-hidden", "true");
    mark.textContent = "#";
    link.appendChild(mark);
    heading.appendChild(link);
  }
}

function initImageZoom() {
  const body = document.getElementById("post-body");
  if (!body) return;

  // 给正文图片加上可放大提示（跳过本身就在链接里的图片）
  for (const image of body.querySelectorAll<HTMLImageElement>("img")) {
    if (image.closest("a") || image.dataset.zoomReady) continue;
    image.dataset.zoomReady = "true";
    image.setAttribute("role", "button");
    image.setAttribute("tabindex", "0");
  }

  let overlay: HTMLDivElement | null = null;
  let lastFocused: Element | null = null;

  const close = () => {
    if (!overlay) return;
    overlay.remove();
    overlay = null;
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKey);
    (lastFocused as HTMLElement | null)?.focus?.();
    lastFocused = null;
  };

  const onKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") close();
  };

  const open = (src: string, alt: string) => {
    if (overlay) return;
    lastFocused = document.activeElement;

    overlay = document.createElement("div");
    overlay.className =
      "fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/80 p-4";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", alt || "图片预览");
    overlay.tabIndex = -1;

    const image = document.createElement("img");
    image.src = src;
    image.alt = alt;
    image.className = "max-h-[90vh] max-w-[92vw] object-contain";

    overlay.appendChild(image);
    overlay.addEventListener("click", close);
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    overlay.focus();
  };

  const activate = (target: EventTarget | null) => {
    const image = (target as HTMLElement | null)?.closest?.("img");
    if (!image || !body.contains(image) || image.closest("a")) return;
    open((image as HTMLImageElement).currentSrc || (image as HTMLImageElement).src, (image as HTMLImageElement).alt);
  };

  body.addEventListener("click", event => activate(event.target));
  body.addEventListener("keydown", event => {
    const key = (event as KeyboardEvent).key;
    if (key !== "Enter" && key !== " ") return;
    const image = (event.target as HTMLElement | null)?.closest?.("img");
    if (!image) return;
    event.preventDefault();
    activate(event.target);
  });

  // 站内跳转前收起浮层，避免它残留在下一个页面
  document.addEventListener(
    "astro:before-swap",
    () => {
      close();
    },
    { once: true }
  );
}

function initBackToTop() {
  const button = document.getElementById("back-to-top");
  if (!button || button.dataset.ready) return;
  button.dataset.ready = "true";

  const update = () => {
    button.classList.toggle("hidden", window.scrollY < 400);
  };
  button.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
  update();
  document.addEventListener("scroll", update, { passive: true });
}

/**
 * 右侧大纲目录：高亮当前阅读到的小节。
 *
 * 只在 xl（≥1280px）显示 —— 那是纯 CSS 控制的（见组件里的
 * `hidden xl:block`）。这里不额外判断视口宽度：目录被隐藏时
 * 计算依然成立，只是看不见；这样避免了 resize 监听的复杂度。
 *
 * 用「最后一条已经越过判定线的标题」作为当前项，而不是
 * IntersectionObserver：后者在快速滚动和锚点跳转时容易出现
 * 中间态，且同一时刻可能有多个标题相交，取舍规则反而更绕。
 */
function initTableOfContents() {
  const toc = document.getElementById("post-toc");
  if (!toc) return;

  /*
   * 判定线取视口上方 120px 处。
   * 太靠顶会让标题刚露头就高亮，太靠中则要滚过头才切换。
   */
  const OFFSET = 120;

  /* 每次读取都重新查询：站内跳转后 DOM 会换掉，缓存节点会失效 */
  const links = () =>
    toc.querySelectorAll<HTMLAnchorElement>("a[data-heading-id]");

  const updateActive = () => {
    const all = links();
    if (!all.length) return;

    let currentId: string | null = null;
    for (const link of all) {
      const id = link.dataset.headingId;
      if (!id) continue;
      const target = document.getElementById(id);
      if (!target) continue;
      if (target.getBoundingClientRect().top <= OFFSET) currentId = id;
      else break; // 标题按文档顺序排列，越过判定线之后无需再看
    }

    // 还没滚到第一个标题时，把第一条作为当前位置
    if (currentId === null) currentId = all[0]?.dataset.headingId ?? null;

    let active: HTMLAnchorElement | null = null;
    for (const link of all) {
      if (link.dataset.headingId === currentId) {
        link.setAttribute("aria-current", "location");
        active = link;
      } else {
        link.removeAttribute("aria-current");
      }
    }

    /*
     * 目录比视口高时会自己滚动，当前项可能滚出目录的可视范围，
     * 读者就看不出自己在哪了。这里把它带回视野。
     *
     * 只在「已经跑出去」时才动，避免每次滚动都触发无谓的
     * scrollIntoView（会造成抖动，也打断读者的手动滚动）。
     */
    if (active) {
      const box = toc.getBoundingClientRect();
      const item = active.getBoundingClientRect();
      const margin = 8;
      if (item.top < box.top + margin || item.bottom > box.bottom - margin) {
        active.scrollIntoView({ block: "nearest" });
      }
    }
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      updateActive();
      ticking = false;
    });
  };

  document.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  updateActive();
}

export function initPost() {
  if (typeof document === "undefined") return;
  if (!document.getElementById("post-body")) return;
  initProgressBar();
  initCopyButtons();
  initHeadingAnchors();
  initImageZoom();
  initBackToTop();
  initTableOfContents();
}
