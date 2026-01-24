/**
 * Spark UI - 交互逻辑脚本
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("Spark UI 已加载");

    // 1. 按钮点击涟漪效果 (Ripple Effect)
    const createRipple = (event) => {
        const button = event.currentTarget;
        const circle = document.createElement("span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
        circle.classList.add("ripple");

        const ripple = button.getElementsByClassName("ripple")[0];
        if (ripple) { ripple.remove(); }
        button.appendChild(circle);
    };

    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => btn.addEventListener('click', createRipple));

    // 2. 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 3. 滚动时导航栏添加阴影 (粘性页眉效果)
    const header = document.querySelector('.nav-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('header-active');
            } else {
                header.classList.remove('header-active');
            }
        });
    }

    // 4. 输入框浮动标签动画补丁
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('is-focused');
        });
        input.addEventListener('blur', () => {
            if (input.value === "") {
                input.parentElement.classList.remove('is-focused');
            }
        });
    });
});
