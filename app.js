// 时间更新
setInterval(() => {
    document.getElementById('datetime').innerHTML = new Date().toLocaleString();
}, 1000);

// 生成空白框
document.addEventListener('DOMContentLoaded', () => {
    const contentWrapper = document.querySelector('.content-wrapper');
    const columnsCount =5; // 改为3列
    const rowsCount = 4;
    const emptyBoxCount = columnsCount * rowsCount; // 总数12个
    
    for (let i = 0; i < emptyBoxCount; i++) {
        const emptyBox = document.createElement('div');
        emptyBox.className = 'glass-container empty-box';
        emptyBox.innerHTML = `
            <img src="https://img.picui.cn/free/2025/03/08/67cba48cb1f5f.png" 
                 alt="网站Logo" 
                 style="width: 80px; height: 80px; margin-bottom: 10px; border-radius: 8px;">
        `;
        contentWrapper.appendChild(emptyBox);
    }
});

// 底部导航控制
window.addEventListener('scroll', () => {
    const footer = document.querySelector('footer');
    const scrollPosition = window.innerHeight + window.pageYOffset;
    const documentHeight = document.documentElement.scrollHeight;
    
    footer.classList.toggle('active', documentHeight - scrollPosition < 200);
});

// 添加在文件末尾
setInterval(() => {
    const wrapper = document.querySelector('.content-wrapper');
    document.body.setAttribute('data-width', wrapper.offsetWidth);
}, 100);