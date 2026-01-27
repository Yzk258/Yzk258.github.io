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
setInterval(createSnowflake, 200);

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