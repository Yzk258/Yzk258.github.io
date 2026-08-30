function showSection(sectionId) {
    // 隐藏所有 section
    document.querySelectorAll('.section').forEach(s => {s.style.display = 'none'; s.classList.remove('active');});
    // 显示对应的 section
    const target = document.getElementById(sectionId);
    if (target) {
        target.style.display = 'block';
        target.classList.add('active');
    } else {
        console.warn(`未找到 ID 为 ${sectionId} 的 section`);
    }

    // 更新侧边栏链接的样式（加亮当前选中的课程）
    // 注意：通过 hash 自动跳转时不存在点击事件，需做防御
    document.querySelectorAll('.course-list a').forEach(a => { a.style.color = ''; a.classList.remove('active'); });
    const clicked = (typeof event !== 'undefined' && event && event.target && event.target.style) ? event.target : null;
    if (clicked) clicked.style.color = 'var(--golden-color)';
}

// 搜索数据：由共享模块 search.js 消费（路径基于 subweb/*，两个子页面通用）
window.__SEARCH_ITEMS__ = [
    { title: "主页 · 资源中转站", url: "../../index.html", icon: "🏠", group: "快速导航", keywords: "home 首页 中转 hub resource" },
    { title: "项目库", url: "../projects/projects.html", icon: "🛠️", group: "快速导航", keywords: "projects 项目 代码 code" },
    { title: "学习资料库", url: "../study/study.html", icon: "📚", group: "快速导航", keywords: "study 学习 课程 course 资料" },
    { title: "更新日志", url: "../note/notes.md", icon: "📝", group: "快速导航", keywords: "log 日志 changelog notes" },
    { title: "关于我", url: "../aboutme/aboutme.html", icon: "🙋", group: "快速导航", keywords: "about 关于我 介绍" },
    { title: "个人主站", url: "https://yinzachary24.top/", icon: "🏰", group: "快速导航", keywords: "blog 博客 主站 yinzachary" },
    { title: "GitHub", url: "https://github.com/Yzk258", icon: "🐙", group: "快速导航", keywords: "github 源码 开源 仓库" },

    { title: "微积分A1", url: "../study/study.html#math1", icon: "📘", group: "课程资料", keywords: "calculus a1 math 微积分 数学" },
    { title: "线性代数（理科类）", url: "../study/study.html#matrix", icon: "📘", group: "课程资料", keywords: "linear algebra matrix 矩阵 线代 代数" },
    { title: "基础物理学1", url: "../study/study.html#jw1", icon: "📘", group: "课程资料", keywords: "physics 力学 热学 物理" },
    { title: "写作与沟通", url: "../study/study.html#write", icon: "📘", group: "课程资料", keywords: "writing 写作 沟通 论文" },
    { title: "英语阅读与写作b", url: "../study/study.html#english1", icon: "📘", group: "课程资料", keywords: "english reading 英语 阅读 精读" },

    { title: "微积分A2", url: "../study/study.html#math2", icon: "📘", group: "课程资料", keywords: "calculus a2 微积分 多元 级数" },
    { title: "基础物理学2", url: "../study/study.html#jw2", icon: "📘", group: "课程资料", keywords: "physics 电磁 光学 物理" },
    { title: "计算机程序设计基础python", url: "../study/study.html#python", icon: "📘", group: "课程资料", keywords: "python 编程 programming cs 程序设计" },
    { title: "基础物理实验1", url: "../study/study.html#jwsy1", icon: "📘", group: "课程资料", keywords: "physics lab 实验 误差" },
    { title: "工程图学基础", url: "../study/study.html#gt", icon: "📘", group: "课程资料", keywords: "drawing cad 制图 工程图" },
    { title: "英语听说b", url: "../study/study.html#english2", icon: "📘", group: "课程资料", keywords: "english listening 英语 听说 口语" },
    { title: "通识课（大一下）", url: "../study/study.html#general1", icon: "📘", group: "课程资料", keywords: "elective 通识 任选 general" },

    { title: "复变函数与数理方程", url: "../study/study.html#fb", icon: "📘", group: "课程资料", keywords: "complex analysis 复变 数理方程 傅里叶", featured: true },
    { title: "基础物理学3", url: "../study/study.html#jw3", icon: "📘", group: "课程资料", keywords: "physics 近代 原子 物理" },
    { title: "概率论与数理统计", url: "../study/study.html#probability", icon: "📘", group: "课程资料", keywords: "probability statistics 概率 统计", featured: true },
    { title: "离散数学1", url: "../study/study.html#discrete", icon: "📘", group: "课程资料", keywords: "discrete 离散 图论 集合 逻辑" },
    { title: "基础物理实验2", url: "../study/study.html#jwsy2", icon: "📘", group: "课程资料", keywords: "physics lab 实验" },
    { title: "足球专项", url: "../study/study.html#football", icon: "⚽", group: "课程资料", keywords: "football soccer 足球 体育" },
    { title: "通识课（大二上）", url: "../study/study.html#general2", icon: "📘", group: "课程资料", keywords: "elective 通识 任选 general" },

    { title: "量子力学", url: "../study/study.html#quantum", icon: "📘", group: "课程资料", keywords: "quantum 量子 薛定谔 qm" },
    { title: "核辐射物理与探测学", url: "../study/study.html#nuclear", icon: "📘", group: "课程资料", keywords: "nuclear radiation 核 辐射 探测" },
    { title: "数字电路与嵌入式系统", url: "../study/study.html#digital", icon: "📘", group: "课程资料", keywords: "digital embedded fpga 数电 嵌入式 电路" },
    { title: "数据结构", url: "../study/study.html#ds", icon: "📘", group: "课程资料", keywords: "data structure ds dsa algorithm 算法 链表", featured: true },
    { title: "计算机网络原理", url: "../study/study.html#network", icon: "📘", group: "课程资料", keywords: "network 网络 tcp ip 计网" },
    { title: "高等线性代数选讲", url: "../study/study.html#advanced-linear-algebra", icon: "📘", group: "课程资料", keywords: "advanced linear algebra 高等线代 矩阵" },
    { title: "健美专项", url: "../study/study.html#fitness", icon: "💪", group: "课程资料", keywords: "fitness 健身 体育 力量" }
];

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

// 每隔 80 毫秒生成一片雪花；切到后台时暂停，省 CPU
let ambientTimer1 = setInterval(createSnowflake, 80);
let ambientTimer2 = setInterval(createOptimizedStar, 50);

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        clearInterval(ambientTimer1); ambientTimer1 = null;
        clearInterval(ambientTimer2); ambientTimer2 = null;
    } else {
        if (!ambientTimer1) ambientTimer1 = setInterval(createSnowflake, 80);
        if (!ambientTimer2) ambientTimer2 = setInterval(createOptimizedStar, 50);
    }
});

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

// 提高生成频率，营造满天星斗的感觉

function toggleSubMenu(header) {
    // 找到当前点击的学期组
    const group = header.parentElement;
    
    // 如果你希望每次只展开一个学期，可以取消下面这段注释：
    /*
    document.querySelectorAll('.semester-group').forEach(item => {
        if (item !== group) item.classList.remove('active');
    });
    */

    // 切换当前组的 active 状态
    group.classList.toggle('active');
}

// 页面加载与 hash 变化时统一处理跳转（站内搜索跳转同一页面时不触发 reload）
function handleHashNavigation() {
    const hash = window.location.hash.replace('#', '');

    if (hash) {
        showSection(hash);

        const activeLink = document.querySelector(`.course-list a[href="#${hash}"]`);
        if (activeLink) {
            const group = activeLink.closest('.semester-group');
            if (group) {
                group.classList.add('active');
            }
            activeLink.classList.add('active');
            activeLink.style.color = 'var(--golden-color)';
        }
    } else {
        showSection('default-view');
    }
}

window.addEventListener('DOMContentLoaded', handleHashNavigation);
window.addEventListener('hashchange', handleHashNavigation);