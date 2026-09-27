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

export function initPost() {
  if (typeof document === "undefined") return;
  if (!document.getElementById("post-body")) return;
  initProgressBar();
  initCopyButtons();
  initHeadingAnchors();
  initImageZoom();
  initBackToTop();
}
