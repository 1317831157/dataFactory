// 初始化趋势图表
const ctx = document.getElementById('trend-chart').getContext('2d');
const trendChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: Array.from({length: 24}, (_, i) => `${i}:00`),
        datasets: [{
            label: '处理数量',
            data: Array(24).fill(0),
            borderColor: '#4299e1',
            backgroundColor: 'rgba(66, 153, 225, 0.1)',
            tension: 0.4,
            fill: true
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                    color: '#718096'
                }
            },
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                    color: '#718096'
                }
            }
        }
    }
});

// 论文来源列表
const sources = [
    'arXiv',
    'IEEE Xplore',
    'ScienceDirect',
    'Springer',
    'ACM Digital Library'
];

// 论文主题标签
const topics = [
    '机器学习',
    '深度学习',
    '计算机视觉',
    '自然语言处理',
    '数据挖掘',
    '人工智能',
    '神经网络',
    '强化学习'
];

// 数据管理
class DataManager {
    constructor() {
        this.validPapers = [];
        this.formulaImages = [];
        this.trashData = [];
        this.currentFilter = 'all';
        
        this.initializeEventListeners();
        this.updateCounts();
    }
    
    initializeEventListeners() {
        // 标签切换
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
        
        // 过滤器切换
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchFilter(btn.dataset.filter));
        });
        
        // 清空垃圾箱
        document.getElementById('clear-trash').addEventListener('click', () => this.clearTrash());
    }
    
    switchTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
        
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === `${tab}-panel`);
        });
    }
    
    switchFilter(filter) {
        this.currentFilter = filter;
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        this.updateResults();
    }
    
    processData(data) {
        if (this.isValidPaper(data)) {
            this.validPapers.push({
                title: data.title,
                abstract: data.abstract,
                source: data.source,
                authors: data.authors,
                timestamp: new Date().toLocaleString(),
                wordCount: data.wordCount,
                imageCount: data.imageCount,
                formulaCount: data.formulaCount,
                topics: data.topics,
                type: 'valid',
                size: data.size
            });
        } else if (this.hasFormulaImage(data)) {
            this.formulaImages.push({
                title: `公式图片 ${this.formulaImages.length + 1}`,
                paperTitle: data.title,
                image: data.image,
                timestamp: new Date().toLocaleString(),
                type: 'formula',
                size: data.size
            });
        } else {
            this.trashData.push({
                title: data.title,
                content: data.content,
                timestamp: new Date().toLocaleString(),
                type: 'trash',
                reason: this.getTrashReason(data)
            });
        }
        
        this.updateUI();
    }
    
    isValidPaper(data) {
        // 判断是否为有效论文
        return data.content && data.content.length > 100 && !this.isTrash(data);
    }
    
    hasFormulaImage(data) {
        // 判断是否包含公式图片
        return data.image && data.image.includes('formula');
    }
    
    isTrash(data) {
        // 判断是否为垃圾数据
        return !data.content || data.content.length < 100;
    }
    
    getTrashReason(data) {
        if (!data.content) return '空内容';
        if (data.content.length < 100) return '内容过短';
        return '无效数据';
    }
    
    clearTrash() {
        if (!confirm('确定要清空垃圾箱吗？此操作不可恢复。')) return;
        this.trashData = [];
        this.updateUI();
    }
    
    updateUI() {
        this.updateValidPapers();
        this.updateFormulaImages();
        this.updateTrashList();
        this.updateCounts();
        this.updateResults();
    }
    
    updateValidPapers() {
        const validList = document.getElementById('valid-list');
        validList.innerHTML = '';
        
        this.validPapers.forEach((paper, index) => {
            const paperElement = document.createElement('div');
            paperElement.className = 'paper-card';
            paperElement.style.animationDelay = `${index * 0.1}s`;
            
            paperElement.innerHTML = `
                <div class="paper-main">
                    <div class="paper-header">
                        <div class="paper-title">${paper.title}</div>
                        <div class="paper-source">${paper.source}</div>
                    </div>
                    <div class="paper-meta">
                        <div class="meta-item">
                            <span class="meta-label">发布时间</span>
                            <span class="meta-value">${paper.timestamp}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">字数统计</span>
                            <span class="meta-value">${paper.wordCount.toLocaleString()} 字</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">图片数量</span>
                            <span class="meta-value">${paper.imageCount} 张</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">公式数量</span>
                            <span class="meta-value">${paper.formulaCount} 个</span>
                        </div>
                    </div>
                    <div class="paper-abstract">${paper.abstract}</div>
                    <div class="paper-tags">
                        ${paper.topics.map(topic => `
                            <span class="tag">${topic}</span>
                        `).join('')}
                    </div>
                </div>
                <div class="paper-side">
                    <div class="paper-preview">
                        ${paper.image ? `<img src="${paper.image}" alt="预览图">` : '暂无预览'}
                    </div>
                    <div class="paper-actions">
                        <button class="action-btn">查看</button>
                        <button class="action-btn">下载</button>
                    </div>
                </div>
            `;
            
            validList.appendChild(paperElement);
        });
    }
    
    updateFormulaImages() {
        const formulaList = document.getElementById('formula-list');
        formulaList.innerHTML = this.formulaImages.map(formula => `
            <div class="formula-card">
                <div class="formula-image">
                    <img src="${formula.image}" alt="公式图片">
                </div>
                <div class="formula-content">
                    <div class="card-title">${formula.title}</div>
                    <div class="card-meta">
                        <span>来自：${formula.paperTitle}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    updateTrashList() {
        const trashList = document.getElementById('trash-list');
        trashList.innerHTML = this.trashData.map(item => `
            <div class="list-item">
                <div class="result-info">
                    <div class="result-title">${item.title}</div>
                    <div class="result-meta">
                        <span>${item.timestamp}</span>
                        <span>原因：${item.reason}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    updateCounts() {
        document.getElementById('valid-count').textContent = `${this.validPapers.length} 篇`;
        document.getElementById('formula-count').textContent = `${this.formulaImages.length} 个`;
        document.getElementById('trash-count').textContent = `${this.trashData.length} 项`;
    }
    
    updateResults() {
        const resultsList = document.getElementById('process-results');
        let results = [];
        
        if (this.currentFilter === 'all' || this.currentFilter === 'valid') {
            results.push(...this.validPapers);
        }
        if (this.currentFilter === 'all' || this.currentFilter === 'formula') {
            results.push(...this.formulaImages);
        }
        if (this.currentFilter === 'all' || this.currentFilter === 'trash') {
            results.push(...this.trashData);
        }
        
        results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        resultsList.innerHTML = results.map(item => `
            <div class="result-item">
                <div class="result-info">
                    <div class="result-title">${item.title}</div>
                    <div class="result-meta">
                        <span>${item.timestamp}</span>
                        <span>${item.size ? item.size + 'KB' : ''}</span>
                    </div>
                </div>
                <span class="result-status status-${item.type}">${
                    item.type === 'valid' ? '可用' :
                    item.type === 'formula' ? '公式' : '垃圾'
                }</span>
            </div>
        `).join('');
    }
}

const dataManager = new DataManager();

// 生成随机论文数据
function generateMockPaper() {
    const wordCount = Math.floor(Math.random() * 5000) + 2000;
    const imageCount = Math.floor(Math.random() * 10) + 1;
    const formulaCount = Math.floor(Math.random() * 15) + 1;
    const size = Math.floor(Math.random() * 1000) + 500;
    
    // 随机选择2-4个主题标签
    const paperTopics = [...topics]
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3) + 2);
    
    return {
        title: `基于深度学习的${topics[Math.floor(Math.random() * topics.length)]}研究`,
        abstract: '本文提出了一种新的方法来解决在实际应用中常见的问题。通过实验证明，该方法在多个数据集上都取得了良好的效果。实验结果表明，与现有方法相比，本文提出的方法在准确率和效率上都有显著提升。',
        content: '模拟论文内容'.repeat(100),
        source: sources[Math.floor(Math.random() * sources.length)],
        authors: ['作者A', '作者B', '作者C'],
        wordCount,
        imageCount,
        formulaCount,
        topics: paperTopics,
        size,
        image: Math.random() > 0.5 ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' : null
    };
}

// 模拟数据更新
function updateStats() {
    // 更新处理速度
    const speed = Math.floor(Math.random() * 5);
    document.getElementById('process-speed').textContent = speed;

    // 更新总数据量
    const currentTotal = parseInt(document.getElementById('total-count').textContent);
    document.getElementById('total-count').textContent = currentTotal + speed;

    // 更新图表
    const currentHour = new Date().getHours();
    const currentData = trendChart.data.datasets[0].data;
    currentData[currentHour] += speed;
    trendChart.update();

    if (speed > 0) {
        for (let i = 0; i < speed; i++) {
            dataManager.processData(generateMockPaper());
        }
    }
}

// 启动定时更新
setInterval(updateStats, 1000); 