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