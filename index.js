const textContainer = document.querySelector('.poem');
const content = textContainer.innerHTML; // 获取原本的文字
textContainer.innerHTML = ''; // 清空内容

let i = 0;
function typing() {
  if (i < content.length) {
    // 每次往里塞一个字符
    textContainer.innerHTML += content.charAt(i);
    i++;
    setTimeout(typing, 30); // 30毫秒跳一个字
  }
}
typing();