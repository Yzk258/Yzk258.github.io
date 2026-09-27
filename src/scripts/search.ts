/**
 * 站内搜索 —— 由旧站点 search.js 迁移而来。
 *
 * 保留了原实现的全部核心逻辑：
 *   · 三级匹配：标题命中 > 关键词命中 > 模糊（按字符顺序）匹配
 *   · 模糊匹配的评分规则（连续字符加分、词首加分、跨度惩罚）
 *   · 命中字符高亮、键盘上下选择 / 回车打开 / Esc 关闭
 *   · 中文输入法 composition 事件处理（避免拼音阶段就触发搜索）
 *   · 分组渲染、无输入时的"快速跳转 + 猜你想找"
 *
 * 改动之处：
 *   · 运行时注入 CSS → 改为组件内的作用域样式
 *   · 数据来自 window.__SEARCH_ITEMS__（页面注入），不再手写清单
 *   · 面板定位改为跟随输入框的固定定位，避免被 header 的 overflow 裁剪
 */

export interface SearchItem {
  title: string;
  url: string;
  group: string;
  icon?: string;
  keywords?: string;
  featured?: boolean;
  quick?: boolean;
}

interface MatchResult {
  score: number;
  indices: number[] | null;
}

interface RenderedEntry {
  item: SearchItem;
  indices: number[] | null;
  group: string;
}

/** 转义 HTML，避免把手输内容当作标签渲染 */
function escapeHtml(text: string): string {
  return text.replace(/[&<>]/g, (char) => {
    if (char === '&') return '&amp;';
    if (char === '<') return '&lt;';
    return '&gt;';
  });
}

/** 把命中的字符用 <mark> 包起来 */
function highlight(text: string, indices: number[] | null): string {
  if (!indices || indices.length === 0) return escapeHtml(text);
  const set = new Set(indices);
  let out = '';
  let inMark = false;
  for (let i = 0; i < text.length; i += 1) {
    const hit = set.has(i);
    if (hit && !inMark) {
      out += '<mark>';
      inMark = true;
    }
    if (!hit && inMark) {
      out += '</mark>';
      inMark = false;
    }
    const char = text[i];
    out += char === '&' ? '&amp;' : char === '<' ? '&lt;' : char === '>' ? '&gt;' : char;
  }
  if (inMark) out += '</mark>';
  return out;
}

/**
 * 模糊匹配：按顺序在文本中依次找到查询串的每个字符，
 * 连续命中与出现在词首的位置得分更高。
 * 返回 null 表示无法按顺序匹配。
 */
function fuzzyMatch(text: string, query: string): MatchResult | null {
  let cursor = 0;
  let prev = -2;
  let first = -1;
  let last = 0;
  let score = 0;
  const indices: number[] = [];

  for (const char of query) {
    const found = text.indexOf(char, cursor);
    if (found === -1) return null;
    if (first === -1) first = found;
    last = found;
    indices.push(found);
    score += found === prev + 1 ? 8 : 3;
    if (found === 0 || /[\s·（）()\-/_]/.test(text[found - 1] ?? '')) score += 6;
    prev = found;
    cursor = found + 1;
  }

  // 命中字符跨度越大，得分越低
  score -= Math.max(0, last - first - query.length + 1) * 0.6;
  return { score, indices };
}

function matchItem(query: string, item: SearchItem): MatchResult | null {
  const title = item.title.toLowerCase();
  const titleIndex = title.indexOf(query);
  if (titleIndex !== -1) {
    const indices: number[] = [];
    for (let i = titleIndex; i < titleIndex + query.length; i += 1) indices.push(i);
    return { score: 500 - titleIndex * 2 + (titleIndex === 0 ? 150 : 0), indices };
  }

  const keywords = (item.keywords ?? '').toLowerCase();
  const keywordIndex = keywords.indexOf(query);
  if (keywordIndex !== -1) return { score: 300 - keywordIndex, indices: null };

  return fuzzyMatch(title, query);
}

const MAX_RESULTS = 12;

export function mountSearch(): void {
  const root = document.querySelector<HTMLElement>('[data-search]');
  if (!root) return;

  const input = root.querySelector<HTMLInputElement>('[data-search-input]');
  const panel = root.querySelector<HTMLElement>('[data-search-panel]');
  const listEl = root.querySelector<HTMLElement>('[data-search-list]');
  const footerEl = root.querySelector<HTMLElement>('[data-search-footer]');
  const clearBtn = root.querySelector<HTMLButtonElement>('[data-search-clear]');
  const trigger = root.querySelector<HTMLButtonElement>('[data-search-trigger]');
  const indexEl = document.getElementById('search-index-data');
  if (!input || !panel || !listEl || !footerEl || !clearBtn || !indexEl) return;

  let items: SearchItem[] = [];
  try {
    items = JSON.parse(indexEl.textContent ?? '[]') as SearchItem[];
  } catch {
    items = [];
  }
  if (items.length === 0) return;

  let rendered: RenderedEntry[] = [];
  let active = 0;
  let debounceId: number | undefined;

  const isOpen = () => root.dataset.open === 'true';

  /** 只在窄屏把输入框做成弹层，宽屏始终可见 */
  const isOverlayLayout = () => window.matchMedia('(max-width: 820px)').matches;

  /** 面板用固定定位跟随输入框，避免被 header 的裁剪区域切掉 */
  function positionPanel() {
    if (isOverlayLayout()) {
      panel!.style.left = 'var(--gutter)';
      panel!.style.right = 'var(--gutter)';
      panel!.style.width = '';
      return;
    }
    const rect = input!.getBoundingClientRect();
    panel!.style.left = `${rect.left}px`;
    panel!.style.width = `${rect.width}px`;
    panel!.style.right = 'auto';
  }

  function open() {
    positionPanel();
    root.dataset.open = 'true';
    input!.setAttribute('aria-expanded', 'true');
    // 窄屏下输入框处于隐藏状态时不可聚焦，需等它显示出来再放开键盘访问
    if (isOverlayLayout()) {
      input!.removeAttribute('aria-hidden');
      input!.removeAttribute('tabindex');
    }
  }

  function close() {
    root.dataset.open = 'false';
    input!.setAttribute('aria-expanded', 'false');
    if (isOverlayLayout()) {
      input!.setAttribute('aria-hidden', 'true');
      input!.setAttribute('tabindex', '-1');
    }
  }

  function syncInputState() {
    const has = input!.value.trim().length > 0;
    clearBtn!.hidden = !has;
    root.dataset.hasText = String(has);
  }

  function renderEntries(entries: RenderedEntry[], footerText: string) {
    rendered = entries;
    active = 0;

    const groups = new Map<string, RenderedEntry[]>();
    for (const entry of entries) {
      const key = entry.group || '结果';
      const bucket = groups.get(key);
      if (bucket) bucket.push(entry);
      else groups.set(key, [entry]);
    }

    const frag = document.createDocumentFragment();
    let flatIndex = 0;
    for (const [group, groupEntries] of groups) {
      const label = document.createElement('div');
      label.className = 'msd-group-label';
      label.textContent = group;
      frag.appendChild(label);

      for (const entry of groupEntries) {
        const link = document.createElement('a');
        link.className = 'msd-item';
        link.href = entry.item.url;
        link.setAttribute('role', 'option');
        link.setAttribute('aria-selected', 'false');
        link.style.setProperty('--d', `${Math.min(flatIndex * 22, 220)}ms`);

        const icon = document.createElement('span');
        icon.className = 'msd-icon';
        icon.textContent = entry.item.icon ?? '🔗';

        const title = document.createElement('span');
        title.className = 'msd-title';
        title.innerHTML = highlight(entry.item.title, entry.indices);

        const enter = document.createElement('span');
        enter.className = 'msd-enter';
        enter.setAttribute('aria-hidden', 'true');
        enter.textContent = '↵';

        link.append(icon, title, enter);
        const index = flatIndex;
        link.addEventListener('mouseenter', () => setActive(index));
        frag.appendChild(link);
        flatIndex += 1;
      }
    }

    listEl!.replaceChildren(frag);
    footerEl!.innerHTML =
      `<span>${escapeHtml(footerText)}</span>` +
      '<span class="msd-keys"><kbd>↑</kbd><kbd>↓</kbd> 选择 <kbd>↵</kbd> 打开 <kbd>Esc</kbd> 关闭</span>';
    setActive(0);
  }

  function renderEmpty(query: string) {
    rendered = [];
    listEl!.innerHTML =
      '<div class="msd-empty"><span class="msd-empty-icon" aria-hidden="true">🔍</span>' +
      `没有找到与 “<b>${escapeHtml(query)}</b>” 相关的结果<br>试试更短的关键词，比如 “数据” 或 “ds”</div>`;
    footerEl!.innerHTML = '<span>0 个结果</span><span class="msd-keys"><kbd>Esc</kbd> 关闭</span>';
  }

  function setActive(index: number) {
    const els = listEl!.querySelectorAll<HTMLElement>('.msd-item');
    if (els.length === 0) return;
    active = (index + els.length) % els.length;
    els.forEach((el, i) => {
      const on = i === active;
      el.classList.toggle('active', on);
      el.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    els[active].scrollIntoView({ block: 'nearest' });
  }

  function runSearch() {
    const query = input!.value.trim().toLowerCase();
    if (!query) {
      showQuickLinks();
      return;
    }
    const scored: { entry: RenderedEntry; score: number }[] = [];
    for (const item of items) {
      const result = matchItem(query, item);
      if (result) {
        scored.push({
          entry: { item, indices: result.indices, group: item.group },
          score: result.score,
        });
      }
    }
    scored.sort((a, b) => b.score - a.score);

    if (scored.length === 0) renderEmpty(query);
    else {
      renderEntries(
        scored.slice(0, MAX_RESULTS).map((item) => item.entry),
        `${scored.length} 个结果`,
      );
    }
    open();
  }

  function showQuickLinks() {
    const quick = items
      .filter((item) => item.quick)
      .map((item) => ({ item, indices: null, group: '快速跳转' }));
    const featured = items
      .filter((item) => item.featured && !item.quick)
      .map((item) => ({ item, indices: null, group: '猜你想找' }));
    renderEntries([...quick, ...featured], `共收录 ${items.length} 个条目 · 输入关键词搜索`);
    open();
  }

  function focusInput() {
    open();
    input!.focus();
    input!.select();
  }

  // ---- 事件绑定 ----
  input.addEventListener('input', (event) => {
    if ((event as InputEvent).isComposing) return;
    syncInputState();
    scheduleSearch();
  });

  // 中文输入法：拼音阶段不搜索，选词结束后再搜
  input.addEventListener('compositionend', () => {
    syncInputState();
    scheduleSearch();
  });

  input.addEventListener('focus', () => {
    if (input!.value.trim()) runSearch();
    else showQuickLinks();
  });

  input.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActive(active + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActive(active - 1);
        break;
      case 'Enter': {
        event.preventDefault();
        const entry = rendered[active];
        if (entry) {
          close();
          window.location.href = entry.item.url;
        }
        break;
      }
      case 'Escape':
        close();
        input!.blur();
        break;
      default:
        break;
    }
  });

  clearBtn.addEventListener('click', () => {
    input!.value = '';
    syncInputState();
    input!.focus();
    showQuickLinks();
  });

  trigger?.addEventListener('click', () => {
    if (isOpen()) {
      close();
      return;
    }
    // 先让弹层显示出来再聚焦：隐藏元素无法获得焦点
    open();
    requestAnimationFrame(() => input!.focus());
  });

  document.addEventListener('click', (event) => {
    if (!root.contains(event.target as Node)) close();
  });

  document.addEventListener('keydown', (event) => {
    const target = event.target as HTMLElement | null;
    const tag = (target?.tagName ?? '').toLowerCase();
    const typing = tag === 'input' || tag === 'textarea' || target?.isContentEditable === true;

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      focusInput();
    } else if (event.key === '/' && !typing) {
      event.preventDefault();
      focusInput();
    }
  });

  window.addEventListener('resize', () => {
    if (isOpen()) positionPanel();
  });

  // 页面滚动时面板是固定定位，需跟随输入框重新定位
  window.addEventListener('scroll', () => {
    if (isOpen()) positionPanel();
  });

  function scheduleSearch() {
    window.clearTimeout(debounceId);
    debounceId = window.setTimeout(() => {
      if (input!.value.trim()) runSearch();
      else showQuickLinks();
    }, 90);
  }

  syncInputState();

  // 窄屏初始状态下输入框藏在弹层里，先标记为不可访问，
  // 由 open() / close() 负责切换
  if (isOverlayLayout()) {
    input.setAttribute('aria-hidden', 'true');
    input.setAttribute('tabindex', '-1');
  }
}
