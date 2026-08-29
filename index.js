const textContainer = document.querySelector('.top-text p');
const content = textContainer.innerHTML; // 获取原本的文字
textContainer.innerHTML = ''; // 清空内容

let i = 0;
function typing() {
  if (i < content.length) {
    // 每次往里塞一个字符
    textContainer.innerHTML += content.charAt(i);
    i++;
    setTimeout(typing, 100); // 30毫秒跳一个字
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

// 每隔 200 毫秒生成一片雪花
setInterval(createSnowflake, 80);

// 1. 获取所有的目录链接和对应的章节
const menuItems = document.querySelectorAll('.menu-item');
const sections = document.querySelectorAll('#introduce, #poem, #introduction, #notes, #projects, #service3');

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

// 提高生成频率，营造满天星斗的感觉
setInterval(createOptimizedStar, 50);



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

window.addEventListener('scroll', function() {
    const topElement = document.getElementById('top');
    // 当向下滚动超过 200 像素时切换
    if (window.scrollY > 200) {
        topElement.classList.add('is-sidebar');
    } else {
        topElement.classList.remove('is-sidebar');
    }
});


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