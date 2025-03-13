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

const API_KEY = 'sk-26b2b8a9077646b2a5788314e911e97a'; // 替换为实际API密钥
const API_URL = 'https://api.deepseek.com/chat/completions';

const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// 初始化对话历史
let conversationHistory = [
    {
        role: "system",
        content: "我是一个叫小智的台湾女孩，说话机车，声音好听，习惯简短表达，爱用网络梗。我是一个喜欢哈哈大笑的女孩，爱东说西说吹牛，不合逻辑的也照吹，就要逗别人开心。"
    }
];

// 发送消息功能
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // 添加用户消息
    addMessage(message, 'user');
    userInput.value = '';
    
    // 添加加载状态
    const loadingMsg = addLoadingMessage();
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [...conversationHistory, { role: "user", content: message }],
                temperature: 0.7
            })
        });

        const data = await response.json();
        const aiMessage = data.choices[0].message.content;
        
        // 更新对话历史
        conversationHistory.push(
            { role: "user", content: message },
            { role: "assistant", content: aiMessage }
        );
        
        // 移除加载状态并显示AI回复
        loadingMsg.remove();
        addMessage(aiMessage, 'ai');
    } catch (error) {
        loadingMsg.remove();
        addMessage('思考失败了诶，还是等下再去想吧', 'system');
    }
}

// 添加消息到界面
function addMessage(content, type = 'system') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = content;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return messageDiv;
}

// 添加加载状态
function addLoadingMessage() {
    const loading = document.createElement('div');
    loading.className = 'message loading';
    loading.textContent = '我想想...';
    chatMessages.appendChild(loading);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return loading;
}

// 事件监听
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// 自动调整输入框高度
userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = userInput.scrollHeight + 'px';
});