function showSection(sectionId) {
    // 1. 隐藏所有分区
    const sections = document.querySelectorAll('.section');
    sections.forEach(s => s.classList.remove('active'));

    // 2. 显示选中的分区
    document.getElementById(sectionId).classList.add('active');

    // 3. 更新导航栏激活状态
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
            
    // 找到点击的元素并加高亮 (通过事件对象或遍历)
    event.currentTarget.classList.add('active');
}

const searchInput = document.getElementById('searchInput');
const resultsList = document.getElementById('resultsList');

const data = [
    { title: "主页（为什么不直接从左边进呢？）", url: "./index.html", type: "web" },
    { title: "项目库（为什么不直接从左边进呢？）", url: "./subweb/projects/projects.html", type: "web" },
    { title: "学习资料库（为什么不直接从左边进呢？）", url: "./subweb/study/study.html", type: "web" },
    { title: "日志（为什么不直接从左边进呢？）", url: "./subweb/note/notes.md", type: "web" },

    // 大一上学期
    { title: "微积分A1", url: "./subweb/study/study.html#math1", type: "web" },
    { title: "线性代数（理科类）", url: "./subweb/study/study.html#matrix", type: "web" },
    { title: "基础物理学1", url: "./subweb/study/study.html#jw1", type: "web" },
    { title: "写作与沟通", url: "./subweb/study/study.html#write", type: "web" },
    { title: "英语阅读与写作b", url: "./subweb/study/study.html#english1", type: "web" },

    // 大一下学期
    { title: "微积分A2", url: "./subweb/study/study.html#math2", type: "web" },
    { title: "基础物理学2", url: "./subweb/study/study.html#jw2", type: "web" },
    { title: "计算机程序设计基础python", url: "./subweb/study/study.html#python", type: "web" },
    { title: "基础物理实验1", url: "./subweb/study/study.html#jwsy1", type: "web" },
    { title: "工程图学基础", url: "./subweb/study/study.html#gt", type: "web" },
    { title: "英语听说b", url: "./subweb/study/study.html#english2", type: "web" },
    { title: "通识课", url: "./subweb/study/study.html#general1", type: "web" },

    // 大二上学期
    { title: "复变函数与数理方程", url: "./subweb/study/study.html#fb", type: "web" },
    { title: "基础物理学3", url: "./subweb/study/study.html#jw3", type: "web" },
    { title: "概率论与数理统计", url: "./subweb/study/study.html#probability", type: "web" },
    { title: "离散数学1", url: "./subweb/study/study.html#discrete", type: "web" },
    { title: "基础物理实验2", url: "./subweb/study/study.html#jwsy2", type: "web" },
    { title: "足球专项", url: "./subweb/study/study.html#football", type: "web" },
    { title: "通识课", url: "./subweb/study/study.html#general2", type: "web" },

    // 大二下学期
    { title: "量子力学", url: "./subweb/study/study.html#quantum", type: "web" },
    { title: "核辐射物理与探测学", url: "./subweb/study/study.html#nuclear", type: "web" },
    { title: "数字电路与嵌入式系统", url: "./subweb/study/study.html#digital", type: "web" },
    { title: "数据结构", url: "./subweb/study/study.html#ds", type: "web" },
    { title: "计算机网络原理", url: "./subweb/study/study.html#network", type: "web" },
    { title: "高等线性代数选讲", url: "./subweb/study/study.html#advanced-linear-algebra", type: "web" },
    { title: "健美专项", url: "./subweb/study/study.html#fitness", type: "web" }


];

searchInput.addEventListener('input', (e) => {
    const value = e.target.value.trim().toLowerCase();
    
    if (!value) {
        resultsList.classList.remove('show');
        return;
    }

    const matched = data.filter(item => 
        item.title.toLowerCase().includes(value)
    );

    renderResults(matched);
});

function renderResults(results) {
    if (results.length === 0) {
        resultsList.innerHTML = `<div class="no-results">🔍 未找到相关结果</div>`;
    } else {
        resultsList.innerHTML = results.map(item => {
            let icon = "📄";
            let actionHtml = "";

            if (item.type === "web") {
                icon = "🌐";
                actionHtml = `<a href="${item.url}" target="_blank" class="btn">访问</a>`;
            } else if (item.type === "folder") {
                icon = "📁";
                actionHtml = `<a href="${item.url}" class="btn">打开</a>`;
            } else {
                const previewBtn = item.category === 'previewable' 
                    ? `<a href="${item.url}" target="_blank" class="btn">预览</a>` 
                    : "";
                actionHtml = `${previewBtn} <a href="${item.url}" download="${item.title}" class="btn">下载</a>`;
            }

            return `
                <div class="result-item">
                    <div class="result-info">${icon} ${item.title}</div>
                    <div class="action-btns">${actionHtml}</div>
                </div>
            `;
        }).join('');
    }
    resultsList.classList.add('show');
}

// 点击空白处关闭
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
        resultsList.classList.remove('show');
    }
});

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

// 每隔 200 毫秒生成一片雪花
setInterval(createSnowflake, 80);

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
setInterval(createOptimizedStar, 50);

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

// 可选：根据当前页面内容自动加亮二级菜单
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
    document.querySelectorAll('.course-list a').forEach(a => a.style.color = '');
    event.target.style.color = 'var(--golden-color)';
    
}

// 页面加载完成后自动处理 Hash 跳转
window.addEventListener('DOMContentLoaded', () => {
    // 获取 URL 中的 Hash 词（例如 "#ds" 变成 "ds"）
    const hash = window.location.hash.replace('#', '');

    if (hash) {
        // 1. 执行你已有的显示函数
        showSection(hash);

        // 2. 自动展开侧边栏对应的学期组 (Semester Group)
        const activeLink = document.querySelector(`.course-list a[href="#${hash}"]`);
        if (activeLink) {
            // 找到该链接所属的父级学期组，并添加 active 类使其展开
            const group = activeLink.closest('.semester-group');
            if (group) {
                group.classList.add('active'); 
            }
            
            // 3. 强行触发一次高亮
            activeLink.classList.add('active');
            activeLink.style.color = 'var(--golden-color)';
        }
    } else {
        // 如果没有 Hash，默认显示第一课
        showSection('default-view');
    }
});