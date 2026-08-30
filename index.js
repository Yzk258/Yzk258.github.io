const textContainer = document.querySelector('.top-text p');
const content = textContainer.textContent; // 获取原本的文字
textContainer.textContent = ''; // 清空内容

let i = 0;
function typing() {
  if (i < content.length) {
    // 每次往里塞一个字符（textContent 累加，避免 innerHTML 反复解析）
    textContainer.textContent += content.charAt(i);
    i++;
    setTimeout(typing, 100); // 100毫秒跳一个字
  }
}

typing();

function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.innerHTML = '·'; // 也可以用 '.' 或者自定义图片
    snowflake.style.position = 'fixed';
    snowflake.style.top = '-20px';
    snowflake.style.left = Math.random() * window.innerWidth + 'px'; // 随机水平位置
    snowflake.style.color = 'white';
    snowflake.style.opacity = Math.random(); // 随机透明度
    snowflake.style.fontSize = Math.random() * 10 + 20 + 'px'; // 随机大小
    snowflake.style.zIndex = '1000';
    snowflake.style.pointerEvents = 'none'; // 确保不影响鼠标点击页面内容

    document.body.appendChild(snowflake);

    // 使用 Web Animations API 让雪花动起来
    const animation = snowflake.animate([
        { transform: `translateY(0) translateX(0)` },
        { transform: `translateY(${window.innerHeight + 20}px) translateX(${Math.random() * 50}px)` }
    ], {
        duration: Math.random() * 3000 + 5000, // 5-8秒落完
        easing: 'linear'
    });

    // 动画完成后移除元素，防止页面堆积太多 div 变卡
    animation.onfinish = () => snowflake.remove();
}

// 每隔 80 毫秒生成一片雪花；页面切到后台时暂停，省 CPU
let snowflakeTimer = null;
let starTimer = null;

function restartAmbientTimers() {
    if (!snowflakeTimer) snowflakeTimer = setInterval(createSnowflake, 80);
    if (!starTimer) starTimer = setInterval(createOptimizedStar, 50);
}

function stopAmbientTimers() {
    clearInterval(snowflakeTimer); snowflakeTimer = null;
    clearInterval(starTimer); starTimer = null;
}

restartAmbientTimers();
document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAmbientTimers();
    else restartAmbientTimers();
});

// 1. 获取所有的目录链接和对应的章节（注意：网站介绍区块的 id 是 introduction）
const menuItems = document.querySelectorAll('.menu-item');
const sections = document.querySelectorAll('#poem, #introduction, #notes, #projects, #service3');

// 2. 配置观察器：当章节有 30% 进入视口时触发
const options = {
  root: null,
  threshold: 0.3
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // 移除所有激活状态
      menuItems.forEach(item => item.classList.remove('active'));
      
      // 给当前看到的章节对应的目录项加 active
      const activeId = entry.target.getAttribute('id');
      const activeMenu = document.querySelector(`.menu-item[href="#${activeId}"]`);
      if (activeMenu) activeMenu.classList.add('active');
    }
  });
}, options);

// 3. 开始观察每个章节
sections.forEach(section => observer.observe(section));

function createOptimizedStar() {
    const container = document.getElementById('star-container');
    const star = document.createElement('div');
    star.classList.add('star');

    // 随机位置
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    star.style.left = x + 'px';
    star.style.top = y + 'px';

    // 随机大小：2px 到 5px
    const size = Math.random() * 3 + 2;
    star.style.width = size + 'px';
    star.style.height = size + 'px';

    // 优化：给不同的星星赋予略微不同的色彩偏差
    // 黄金色系：#d4af37 (正金), #f9f1c0 (淡金), #ffdf00 (亮金)
    const goldTones = ['#d4af37', '#f9f1c0', '#ffdf00', '#fff'];
    const color = goldTones[Math.floor(Math.random() * goldTones.length)];
    star.style.boxShadow = `0 0 ${size*2}px ${color}, 0 0 ${size*4}px rgba(212, 175, 55, 0.3)`;

    // 随机动画时长
    const duration = Math.random() * 3 + 2;
    star.style.animationDuration = duration + 's';

    container.appendChild(star);
    setTimeout(() => star.remove(), duration * 1000);
}

// 提高生成频率，营造满天星斗的感觉（由 restartAmbientTimers 统一管理）



window.addEventListener('DOMContentLoaded', () => {
    const biaoqing = document.querySelector('.biaoqingbao');
    let isDragging = false;
    let startX, startY;
    let xOffset = 0, yOffset = 0;
    let lastMouseX = 0; // 用于计算移动速度

    biaoqing.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - xOffset;
        startY = e.clientY - yOffset;
        
        // 抓取时取消过渡，保证拖动实时跟随
        biaoqing.style.transition = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        // 计算当前移动方向和速度
        // 如果 e.clientX > lastMouseX，说明向右移动，倾斜正角度
        const mouseVelocity = e.clientX - lastMouseX;
        const tilt = mouseVelocity * 0.5; // 0.5 是系数，数值越大晃得越凶
        
        // 限制最大倾斜度，防止转晕了
        const constrainedTilt = Math.max(Math.min(tilt, 15), -15);

        xOffset = e.clientX - startX;
        yOffset = e.clientY - startY;

        // 应用位移 + 倾斜
        biaoqing.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0) rotate(${constrainedTilt}deg)`;
        
        lastMouseX = e.clientX;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        
        // 松开鼠标：恢复 CSS 过渡，让它弹回 0 度
        // 注意：这里我们保留坐标位置，只让角度复原，或者根据需求全部归零
        biaoqing.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        // 如果你希望它停在原地但正过来：
        biaoqing.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0) rotate(0deg)`;
        
        // 如果你希望它像挂件一样弹回初始右下角，就取消注释下面这行：
        xOffset = 0; yOffset = 0; biaoqing.style.transform = `translate3d(0, 0, 0) rotate(0deg)`;
    });
});

// 滚动监听：rAF 节流 + passive，避免高频重排
const topElement = document.getElementById('top');
let scrollTicking = false;
window.addEventListener('scroll', function() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
        // 当向下滚动超过 200 像素时切换
        topElement.classList.toggle('is-sidebar', window.scrollY > 200);
        scrollTicking = false;
    });
}, { passive: true });


// 搜索数据：由共享模块 search.js 消费（模糊匹配 / 键盘导航 / Ctrl+K）
window.__SEARCH_ITEMS__ = [
    { title: "主页 · 资源中转站", url: "index.html", icon: "🏠", group: "快速导航", keywords: "home 首页 中转 hub resource" },
    { title: "项目库", url: "subweb/projects/projects.html", icon: "🛠️", group: "快速导航", keywords: "projects 项目 代码 code" },
    { title: "学习资料库", url: "subweb/study/study.html", icon: "📚", group: "快速导航", keywords: "study 学习 课程 course 资料" },
    { title: "更新日志", url: "subweb/note/notes.md", icon: "📝", group: "快速导航", keywords: "log 日志 changelog notes" },
    { title: "关于我", url: "subweb/aboutme/aboutme.html", icon: "🙋", group: "快速导航", keywords: "about 关于我 介绍" },
    { title: "个人主站", url: "https://yinzachary24.top/", icon: "🏰", group: "快速导航", keywords: "blog 博客 主站 yinzachary" },
    { title: "GitHub", url: "https://github.com/Yzk258", icon: "🐙", group: "快速导航", keywords: "github 源码 开源 仓库" },

    { title: "微积分A1", url: "subweb/study/study.html#math1", icon: "📘", group: "课程资料", keywords: "calculus a1 math 微积分 数学" },
    { title: "线性代数（理科类）", url: "subweb/study/study.html#matrix", icon: "📘", group: "课程资料", keywords: "linear algebra matrix 矩阵 线代 代数" },
    { title: "基础物理学1", url: "subweb/study/study.html#jw1", icon: "📘", group: "课程资料", keywords: "physics 力学 热学 物理" },
    { title: "写作与沟通", url: "subweb/study/study.html#write", icon: "📘", group: "课程资料", keywords: "writing 写作 沟通 论文" },
    { title: "英语阅读与写作b", url: "subweb/study/study.html#english1", icon: "📘", group: "课程资料", keywords: "english reading 英语 阅读 精读" },

    { title: "微积分A2", url: "subweb/study/study.html#math2", icon: "📘", group: "课程资料", keywords: "calculus a2 微积分 多元 级数" },
    { title: "基础物理学2", url: "subweb/study/study.html#jw2", icon: "📘", group: "课程资料", keywords: "physics 电磁 光学 物理" },
    { title: "计算机程序设计基础python", url: "subweb/study/study.html#python", icon: "📘", group: "课程资料", keywords: "python 编程 programming cs 程序设计" },
    { title: "基础物理实验1", url: "subweb/study/study.html#jwsy1", icon: "📘", group: "课程资料", keywords: "physics lab 实验 误差" },
    { title: "工程图学基础", url: "subweb/study/study.html#gt", icon: "📘", group: "课程资料", keywords: "drawing cad 制图 工程图" },
    { title: "英语听说b", url: "subweb/study/study.html#english2", icon: "📘", group: "课程资料", keywords: "english listening 英语 听说 口语" },
    { title: "通识课（大一下）", url: "subweb/study/study.html#general1", icon: "📘", group: "课程资料", keywords: "elective 通识 任选 general" },

    { title: "复变函数与数理方程", url: "subweb/study/study.html#fb", icon: "📘", group: "课程资料", keywords: "complex analysis 复变 数理方程 傅里叶", featured: true },
    { title: "基础物理学3", url: "subweb/study/study.html#jw3", icon: "📘", group: "课程资料", keywords: "physics 近代 原子 物理" },
    { title: "概率论与数理统计", url: "subweb/study/study.html#probability", icon: "📘", group: "课程资料", keywords: "probability statistics 概率 统计", featured: true },
    { title: "离散数学1", url: "subweb/study/study.html#discrete", icon: "📘", group: "课程资料", keywords: "discrete 离散 图论 集合 逻辑" },
    { title: "基础物理实验2", url: "subweb/study/study.html#jwsy2", icon: "📘", group: "课程资料", keywords: "physics lab 实验" },
    { title: "足球专项", url: "subweb/study/study.html#football", icon: "⚽", group: "课程资料", keywords: "football soccer 足球 体育" },
    { title: "通识课（大二上）", url: "subweb/study/study.html#general2", icon: "📘", group: "课程资料", keywords: "elective 通识 任选 general" },

    { title: "量子力学", url: "subweb/study/study.html#quantum", icon: "📘", group: "课程资料", keywords: "quantum 量子 薛定谔 qm" },
    { title: "核辐射物理与探测学", url: "subweb/study/study.html#nuclear", icon: "📘", group: "课程资料", keywords: "nuclear radiation 核 辐射 探测" },
    { title: "数字电路与嵌入式系统", url: "subweb/study/study.html#digital", icon: "📘", group: "课程资料", keywords: "digital embedded fpga 数电 嵌入式 电路" },
    { title: "数据结构", url: "subweb/study/study.html#ds", icon: "📘", group: "课程资料", keywords: "data structure ds dsa algorithm 算法 链表", featured: true },
    { title: "计算机网络原理", url: "subweb/study/study.html#network", icon: "📘", group: "课程资料", keywords: "network 网络 tcp ip 计网" },
    { title: "高等线性代数选讲", url: "subweb/study/study.html#advanced-linear-algebra", icon: "📘", group: "课程资料", keywords: "advanced linear algebra 高等线代 矩阵" },
    { title: "健美专项", url: "subweb/study/study.html#fitness", icon: "💪", group: "课程资料", keywords: "fitness 健身 体育 力量" }
];

function updateClock() {
    const now = new Date();
    
    // 自定义格式：小时:分钟:秒
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const timeString = `${hours}:${minutes}:${seconds}`;
    document.getElementById('clock').innerText = timeString;
}
    // 每 1000 毫秒（1秒）执行一次
setInterval(updateClock, 1000);
  // 页面加载后立即执行一次，避免 1 秒的空白
updateClock();

// ============ 移动端汉堡菜单 ============
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

function closeNavMenu() {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
}

navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
});

// 点击菜单里的链接后自动收起面板（下拉按钮本身除外）
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        if (link.classList.contains('dropbtn')) return;
        closeNavMenu();
    });
});

// 点击菜单外区域收起面板
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
        closeNavMenu();
    }
});

// 窗口切回桌面尺寸时清理状态
window.addEventListener('resize', () => {
    if (window.innerWidth > 1100) closeNavMenu();
});

// ============ 好玩的 API 卡片 ============
const API_TIMEOUT = 6000;

async function fetchJson(url, timeout = API_TIMEOUT) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } finally {
        clearTimeout(timer);
    }
}

// 点击/回车触发 loader；seq 防止连续点击时旧响应覆盖新响应
function bindApiCard(id, loader) {
    const card = document.getElementById(id);
    if (!card) return;
    let seq = 0;
    const run = () => {
        const my = ++seq;
        loader(my, () => my === seq);
    };
    card.addEventListener('click', run);
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            run();
        }
    });
    run();
}

bindApiCard('api-card-hitokoto', async (my, isCurrent) => {
    const textEl = document.getElementById('api-hitokoto-text');
    const fromEl = document.getElementById('api-hitokoto-from');
    if (!textEl || !fromEl) return;
    textEl.textContent = '加载中…';
    fromEl.textContent = '一言 · Hitokoto';
    try {
        const d = await fetchJson('https://v1.hitokoto.cn/?c=a&c=b&c=d&c=i&c=k&max_length=30');
        if (!isCurrent()) return;
        textEl.textContent = `「${d.hitokoto}」`;
        fromEl.textContent = d.from_who ? `—— ${d.from_who}「${d.from}」` : (d.from ? `——「${d.from}」` : '—— 一言');
    } catch {
        if (!isCurrent()) return;
        textEl.textContent = '一言 API 开小差了…';
        fromEl.textContent = '再点一下试试';
    }
});

bindApiCard('api-card-dog', async (my, isCurrent) => {
    const img = document.getElementById('api-dog-img');
    if (!img) return;
    img.classList.add('api-loading');
    try {
        const d = await fetchJson('https://dog.ceo/api/breeds/image/random');
        if (!isCurrent()) return;
        img.onload = () => img.classList.remove('api-loading');
        img.src = d.message;
    } catch {
        if (!isCurrent()) return;
        img.classList.remove('api-loading');
    }
});

bindApiCard('api-card-poem', async (my, isCurrent) => {
    const textEl = document.getElementById('api-poem-text');
    const fromEl = document.getElementById('api-poem-from');
    if (!textEl || !fromEl) return;
    textEl.textContent = '加载中…';
    fromEl.textContent = '今日诗词 · JinRiShiCi';
    try {
        const d = await fetchJson('https://v1.jinrishici.com/all.json');
        if (!isCurrent()) return;
        textEl.textContent = `「${d.content}」`;
        fromEl.textContent = d.author ? `—— ${d.author}《${d.origin}》` : `——《${d.origin}》`;
    } catch {
        if (!isCurrent()) return;
        textEl.textContent = '诗仙暂时不在家…';
        fromEl.textContent = '再点一下试试';
    }
});