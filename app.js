// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 星空背景特效
    function createStarfield() {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = 0;
        canvas.style.left = 0;
        canvas.style.zIndex = -1;
        document.body.prepend(canvas);
        
        const ctx = canvas.getContext('2d');
        let stars = [];
        
        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            stars = Array(200).fill().map(() => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 3,
                o: Math.random() * 0.5 + 0.5
            }));
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach(star => {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.o})`;
                ctx.fill();
                star.x += (Math.random() - 0.5) * 0.3;
                star.y += (Math.random() - 0.5) * 0.3;
            });
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resize);
        resize();
        animate();
    }

    // 元素拖拽特效
    function makeDraggable(selector) {
        let isDown = false;
        let startX, startY, initialX, initialY;
        
        const element = document.querySelector(selector);
        
        element.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.clientX;
            startY = e.clientY;
            initialX = element.offsetLeft;
            initialY = element.offsetTop;
            element.style.cursor = 'grabbing';
            element.style.transition = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            element.style.left = `${initialX + dx}px`;
            element.style.top = `${initialY + dy}px`;
        });

        document.addEventListener('mouseup', () => {
            isDown = false;
            element.style.cursor = 'grab';
            element.style.transition = 'transform 0.3s ease';
        });
    }

    // 滚动视差特效
    function addScrollEffects() {
        const cards = document.querySelectorAll('.card');
        window.addEventListener('scroll', () => {
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const offset = (rect.top / window.innerHeight) * 50;
                card.style.transform = `perspective(1000px) rotateX(${offset}deg) rotateY(${-offset}deg)`;
            });
        });
    }

    // 初始化所有特效
    createStarfield();
    makeDraggable('.card');
    addScrollEffects();
});

// 音频可视化特效（需要页面有<audio>元素）
function initAudioVisualizer() {
    const audio = document.createElement('audio');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.style.position = 'fixed';
    canvas.style.bottom = '20px';
    canvas.style.right = '20px';
    canvas.width = 200;
    canvas.height = 80;
    document.body.appendChild(canvas);

    audio.src = 'your-audio-file.mp3';
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audio);
    
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function visualize() {
        analyser.getByteFrequencyData(dataArray);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制频谱
        dataArray.forEach((value, i) => {
            const height = value / 255 * canvas.height;
            ctx.fillStyle = `hsl(${i / bufferLength * 360}, 70%, 50%)`;
            ctx.fillRect(i * (canvas.width / bufferLength), canvas.height - height, 
                        canvas.width / bufferLength, height);
        });
        requestAnimationFrame(visualize);
    }

    // 添加控制按钮
    const audioControl = document.createElement('button');
    audioControl.textContent = '🎵 播放音乐';
    audioControl.style.position = 'fixed';
    audioControl.style.bottom = '20px';
    audioControl.style.left = '20px';
    audioControl.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            visualize();
            audioControl.textContent = '⏸️ 暂停音乐';
        } else {
            audio.pause();
            audioControl.textContent = '🎵 播放音乐';
        }
    });
    document.body.appendChild(audioControl);
}

// 调用音频可视化（需要提供音频文件）
// initAudioVisualizer();