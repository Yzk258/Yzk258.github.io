(function () {
  'use strict';

  const CSS = `
#resultsList { position: absolute; top: 100%; left: 0; right: 0; margin-top: 10px; z-index: 1400; }
.msd {
  background: rgba(16, 16, 20, 0.86);
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  border: 1px solid rgba(212, 175, 55, 0.28);
  border-radius: 14px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-6px) scale(0.985);
  transform-origin: top center;
  transition: opacity 0.18s ease, transform 0.2s cubic-bezier(0.2, 0.9, 0.3, 1.15), visibility 0.18s;
}
.msd-open .msd { opacity: 1; visibility: visible; transform: translateY(0) scale(1); }
.msd-scroll { max-height: min(440px, 62vh); overflow-y: auto; padding: 6px; scrollbar-width: thin; scrollbar-color: rgba(212, 175, 55, 0.4) transparent; }
.msd-scroll::-webkit-scrollbar { width: 6px; }
.msd-scroll::-webkit-scrollbar-thumb { background: rgba(212, 175, 55, 0.35); border-radius: 3px; }
.msd-group-label { font-size: 11px; font-weight: 700; letter-spacing: 0.14em; color: rgba(212, 175, 55, 0.8); padding: 10px 12px 4px; }
.msd-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 12px; border-radius: 9px;
  color: rgba(255, 255, 255, 0.82); text-decoration: none; font-size: 14px;
  animation: msdIn 0.22s ease both; animation-delay: var(--d, 0ms);
}
.msd-item .msd-icon { width: 20px; text-align: center; flex: none; }
.msd-item .msd-title { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.msd-item mark { background: transparent; color: #f0c14b; font-weight: 700; }
.msd-item .msd-enter { opacity: 0; transform: translateX(-4px); transition: 0.15s; color: rgba(212, 175, 55, 0.9); font-size: 12px; }
.msd-item.active { background: linear-gradient(90deg, rgba(212, 175, 55, 0.16), rgba(212, 175, 55, 0.04)); color: #fff; }
.msd-item.active .msd-enter { opacity: 1; transform: none; }
@keyframes msdIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: none; } }
.msd-footer {
  display: flex; justify-content: space-between; align-items: center; gap: 12px;
  padding: 8px 14px; border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03); font-size: 11px; color: rgba(255, 255, 255, 0.45);
}
.msd-keys { display: flex; align-items: center; gap: 3px; white-space: nowrap; }
.msd kbd { font-family: inherit; font-size: 10px; padding: 1px 5px; border-radius: 4px; border: 1px solid rgba(255, 255, 255, 0.16); background: rgba(255, 255, 255, 0.07); color: rgba(255, 255, 255, 0.6); }
.msd-empty { padding: 26px 16px; text-align: center; color: rgba(255, 255, 255, 0.55); font-size: 13px; line-height: 1.8; }
.msd-empty b { color: #f0c14b; }
.msd-empty .msd-empty-icon { font-size: 22px; display: block; margin-bottom: 8px; }
.msd-clear {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  width: 22px; height: 22px; border: none; border-radius: 50%;
  background: rgba(120, 120, 120, 0.28); color: #fff; font-size: 14px; line-height: 1;
  cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0;
}
.msd-clear:hover { background: rgba(212, 175, 55, 0.55); }
.msd-kbd {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  font-family: inherit; font-size: 10px; padding: 2px 7px; border-radius: 5px;
  border: 1px solid rgba(120, 120, 120, 0.4); background: rgba(255, 255, 255, 0.06);
  color: #888; pointer-events: none; transition: opacity 0.15s;
}
.search-container:focus-within .msd-kbd, .search-container.msd-has-text .msd-kbd { opacity: 0; }
#searchInput { padding-right: 64px; }
@media (max-width: 768px) {
  .msd-kbd { display: none; }
  #searchInput { padding-right: 40px; }
}
@media (prefers-reduced-motion: reduce) {
  .msd, .msd-item { transition: none; animation: none; }
}`;

  function injectStyles() {
    if (document.getElementById('msd-styles')) return;
    const style = document.createElement('style');
    style.id = 'msd-styles';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function escapeHtmlStr(s) {
    return s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  }

  function highlightText(text, indices) {
    if (!indices || !indices.length) return escapeHtmlStr(text);
    const set = new Set(indices);
    let out = '';
    let inMark = false;
    for (let i = 0; i < text.length; i++) {
      const hit = set.has(i);
      if (hit && !inMark) { out += '<mark>'; inMark = true; }
      if (!hit && inMark) { out += '</mark>'; inMark = false; }
      const ch = text[i];
      out += ch === '&' ? '&amp;' : ch === '<' ? '&lt;' : ch === '>' ? '&gt;' : ch;
    }
    if (inMark) out += '</mark>';
    return out;
  }

  function fuzzyIndices(text, query) {
    let ti = 0;
    let prev = -2;
    let first = -1;
    let last = 0;
    let score = 0;
    const indices = [];
    for (const ch of query) {
      const found = text.indexOf(ch, ti);
      if (found === -1) return null;
      if (first === -1) first = found;
      last = found;
      indices.push(found);
      score += found === prev + 1 ? 8 : 3;
      if (found === 0 || /[\s·（）()\-/_]/.test(text[found - 1])) score += 6;
      prev = found;
      ti = found + 1;
    }
    score -= Math.max(0, last - first - query.length + 1) * 0.6;
    return { indices, score };
  }

  function matchItem(query, item) {
    const t = item.title.toLowerCase();
    const idx = t.indexOf(query);
    if (idx !== -1) {
      const indices = [];
      for (let i = idx; i < idx + query.length; i++) indices.push(i);
      return { score: 500 - idx * 2 + (idx === 0 ? 150 : 0), indices };
    }
    const k = (item.keywords || '').toLowerCase();
    const ki = k.indexOf(query);
    if (ki !== -1) return { score: 300 - ki, indices: null };
    const fz = fuzzyIndices(t, query);
    if (fz) return { score: 100 + fz.score, indices: fz.indices };
    return null;
  }

  class ModernSearch {
    constructor(input, host, items) {
      this.input = input;
      this.host = host;
      this.items = items;
      this.rendered = [];
      this.active = 0;
      this.debounceId = null;

      this.container = input.closest('.search-container') || input.parentElement;
      this.buildUi();
      this.bindEvents();
    }

    buildUi() {
      this.host.innerHTML = '';
      this.panel = document.createElement('div');
      this.panel.className = 'msd';
      this.listEl = document.createElement('div');
      this.listEl.className = 'msd-scroll';
      this.listEl.setAttribute('role', 'listbox');
      this.footerEl = document.createElement('div');
      this.footerEl.className = 'msd-footer';
      this.panel.append(this.listEl, this.footerEl);
      this.host.appendChild(this.panel);

      this.clearBtn = document.createElement('button');
      this.clearBtn.type = 'button';
      this.clearBtn.className = 'msd-clear';
      this.clearBtn.textContent = '×';
      this.clearBtn.setAttribute('aria-label', '清空搜索');
      this.clearBtn.hidden = true;
      this.container.appendChild(this.clearBtn);

      this.kbdHint = document.createElement('kbd');
      this.kbdHint.className = 'msd-kbd';
      this.kbdHint.textContent = /mac|iphone|ipad/i.test(navigator.platform) ? '⌘ K' : 'Ctrl K';
      this.container.appendChild(this.kbdHint);

      this.input.setAttribute('aria-controls', this.host.id);
      this.input.setAttribute('aria-expanded', 'false');
    }

    bindEvents() {
      this.input.addEventListener('input', (e) => {
        if (e.isComposing) return;
        this.syncInputState();
        this.scheduleSearch();
      });
      this.input.addEventListener('compositionend', () => {
        this.syncInputState();
        this.scheduleSearch();
      });
      this.input.addEventListener('focus', () => {
        if (this.input.value.trim()) this.search();
        else this.showQuickLinks();
      });
      this.input.addEventListener('keydown', (e) => this.onKeydown(e));

      this.clearBtn.addEventListener('click', () => {
        this.input.value = '';
        this.syncInputState();
        this.input.focus();
        this.showQuickLinks();
      });

      document.addEventListener('click', (e) => {
        if (!this.container.contains(e.target)) this.close();
      });

      document.addEventListener('keydown', (e) => {
        const tag = (e.target.tagName || '').toLowerCase();
        const typing = tag === 'input' || tag === 'textarea' || e.target.isContentEditable;
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          this.focusInput();
        } else if (e.key === '/' && !typing) {
          e.preventDefault();
          this.focusInput();
        }
      });
    }

    syncInputState() {
      const has = this.input.value.trim().length > 0;
      this.clearBtn.hidden = !has;
      this.container.classList.toggle('msd-has-text', has);
    }

    focusInput() {
      this.input.focus();
      this.input.select();
    }

    scheduleSearch() {
      clearTimeout(this.debounceId);
      this.debounceId = setTimeout(() => {
        if (this.input.value.trim()) this.search();
        else this.showQuickLinks();
      }, 90);
    }

    onKeydown(e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); this.move(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); this.move(-1); }
      else if (e.key === 'Enter') { e.preventDefault(); this.choose(); }
      else if (e.key === 'Escape') { this.close(); this.input.blur(); }
    }

    search() {
      const q = this.input.value.trim().toLowerCase();
      if (!q) return this.showQuickLinks();
      const matches = [];
      for (const item of this.items) {
        const m = matchItem(q, item);
        if (m) matches.push({ item, score: m.score, indices: m.indices, group: item.group });
      }
      matches.sort((a, b) => b.score - a.score);
      this.active = 0;
      if (!matches.length) {
        this.rendered = [];
        this.renderEmpty(q);
      } else {
        this.render(matches.slice(0, 12), `${matches.length} 个结果`);
      }
      this.open();
    }

    showQuickLinks() {
      const entries = [
        ...this.items.filter(i => i.group === '快速导航').map(item => ({ item, indices: null, group: '快速跳转' })),
        ...this.items.filter(i => i.featured).map(item => ({ item, indices: null, group: '猜你想找' }))
      ];
      this.rendered = entries;
      this.active = 0;
      this.render(entries, `共收录 ${this.items.length} 个条目 · 输入关键词搜索`);
      this.open();
    }

    render(entries, footerText) {
      const frag = document.createDocumentFragment();
      const groups = new Map();
      for (const entry of entries) {
        const g = entry.group || '结果';
        if (!groups.has(g)) groups.set(g, []);
        groups.get(g).push(entry);
      }
      let flatIndex = 0;
      for (const [group, list] of groups) {
        const label = document.createElement('div');
        label.className = 'msd-group-label';
        label.textContent = group;
        frag.appendChild(label);
        for (const entry of list) {
          const a = document.createElement('a');
          a.className = 'msd-item';
          a.href = entry.item.url;
          a.setAttribute('role', 'option');
          a.setAttribute('aria-selected', 'false');
          a.style.setProperty('--d', Math.min(flatIndex * 22, 220) + 'ms');

          const icon = document.createElement('span');
          icon.className = 'msd-icon';
          icon.textContent = entry.item.icon || '🔗';
          const title = document.createElement('span');
          title.className = 'msd-title';
          title.innerHTML = highlightText(entry.item.title, entry.indices);
          const enter = document.createElement('span');
          enter.className = 'msd-enter';
          enter.textContent = '↵';
          a.append(icon, title, enter);

          const idx = flatIndex;
          a.addEventListener('mouseenter', () => this.setActive(idx));
          frag.appendChild(a);
          flatIndex++;
        }
      }
      this.listEl.innerHTML = '';
      this.listEl.appendChild(frag);
      this.footerEl.innerHTML =
        `<span>${footerText}</span>` +
        `<span class="msd-keys"><kbd>↑</kbd><kbd>↓</kbd> 选择 <kbd>↵</kbd> 打开 <kbd>Esc</kbd> 关闭</span>`;
      this.setActive(this.active);
    }

    renderEmpty(q) {
      this.listEl.innerHTML =
        `<div class="msd-empty"><span class="msd-empty-icon">🔍</span>` +
        `没有找到与 “<b>${escapeHtmlStr(q)}</b>” 相关的结果<br>试试更短的关键词，比如 “数据” 或 “ds”</div>`;
      this.footerEl.innerHTML =
        `<span>0 个结果</span><span class="msd-keys"><kbd>Esc</kbd> 关闭</span>`;
    }

    setActive(i) {
      const els = this.listEl.querySelectorAll('.msd-item');
      if (!els.length) return;
      this.active = (i + els.length) % els.length;
      els.forEach((el, k) => {
        el.classList.toggle('active', k === this.active);
        el.setAttribute('aria-selected', k === this.active ? 'true' : 'false');
      });
      els[this.active].scrollIntoView({ block: 'nearest' });
    }

    move(dir) {
      this.setActive(this.active + dir);
    }

    choose() {
      const entry = this.rendered[this.active];
      if (!entry) return;
      this.close();
      window.location.href = entry.item.url;
    }

    open() {
      this.host.classList.add('msd-open');
      this.input.setAttribute('aria-expanded', 'true');
    }

    close() {
      this.host.classList.remove('msd-open');
      this.input.setAttribute('aria-expanded', 'false');
    }
  }

  function init() {
    const input = document.getElementById('searchInput');
    const host = document.getElementById('resultsList');
    const items = window.__SEARCH_ITEMS__;
    if (!input || !host || !Array.isArray(items) || !items.length) return;
    injectStyles();
    new ModernSearch(input, host, items);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
