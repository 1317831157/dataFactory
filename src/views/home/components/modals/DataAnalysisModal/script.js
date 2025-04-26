document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    const keywordFilter = document.querySelector('.keyword-filter');
    const modelTraining = document.querySelector('.model-training');
    const resultCards = document.querySelectorAll('.result-card');
    const flowItems = document.querySelectorAll('.flow-item');

    // 数据源到目标的映射关系
    const sourceToTargets = {
        law: ['robot', 'vision'],
        paper: ['microscope', 'satellite'],
        report: ['agriculture', 'landslide'],
        policy: ['robot', 'agriculture'],
        book: ['star', 'satellite']
    };

    // 数据源到分类的映射关系
    const sourceToCategories = {
        law: ['robot', 'vision'],
        paper: ['microscope', 'satellite'],
        report: ['agriculture', 'landslide'],
        policy: ['robot', 'agriculture'],
        book: ['star', 'satellite']
    };

    // 分类结果统计
    const categoryStats = {
        robot: { count: 0, confidence: 0 },
        agriculture: { count: 0, confidence: 0 },
        landslide: { count: 0, confidence: 0 },
        vision: { count: 0, confidence: 0 },
        microscope: { count: 0, confidence: 0 },
        satellite: { count: 0, confidence: 0 },
        star: { count: 0, confidence: 0 }
    };

    // 关键词提取动画
    function initKeywordExtraction() {
        const keywordCloud = document.querySelector('.keyword-cloud');
        const progressFill = document.querySelector('.progress-fill');
        const keywords = [
            "机器学习", "深度学习", "神经网络", "数据挖掘",
            "自然语言处理", "计算机视觉", "图像识别", "模式识别",
            "特征提取", "分类算法", "回归分析", "聚类分析"
        ];

        let currentIndex = 0;
        const totalKeywords = keywords.length;

        function addKeyword() {
            if (currentIndex < totalKeywords) {
                const keyword = document.createElement('div');
                keyword.className = 'keyword';
                keyword.textContent = keywords[currentIndex];
                keyword.style.animationDelay = `${currentIndex * 0.2}s`;
                
                // 添加关键词权重
                const weight = Math.random() * 0.5 + 0.5;
                keyword.style.fontSize = `${weight * 1.2 + 0.8}rem`;
                keyword.style.opacity = weight;
                
                keywordCloud.appendChild(keyword);

                // 更新进度条
                const progress = ((currentIndex + 1) / totalKeywords) * 100;
                progressFill.style.width = `${progress}%`;

                currentIndex++;
                setTimeout(addKeyword, 500);
            }
        }

        addKeyword();
    }

    // 神经网络可视化
    function initNeuralNetwork() {
        const neuralNetwork = document.querySelector('.neural-network');
        const layers = 4; // 增加层数
        const neuronsPerLayer = [4, 8, 8, 4]; // 增加神经元数量
        const width = neuralNetwork.offsetWidth;
        const height = neuralNetwork.offsetHeight;

        // 创建神经元
        for (let layer = 0; layer < layers; layer++) {
            const layerWidth = width / (layers + 1);
            const x = layerWidth * (layer + 1);
            
            for (let i = 0; i < neuronsPerLayer[layer]; i++) {
                const neuron = document.createElement('div');
                neuron.className = 'neuron';
                const y = (height / (neuronsPerLayer[layer] + 1)) * (i + 1);
                neuron.style.left = `${x}px`;
                neuron.style.top = `${y}px`;
                neuron.style.animationDelay = `${Math.random() * 2}s`;
                
                // 添加激活状态
                neuron.dataset.activation = Math.random().toFixed(2);
                neuralNetwork.appendChild(neuron);

                // 创建连接
                if (layer < layers - 1) {
                    for (let j = 0; j < neuronsPerLayer[layer + 1]; j++) {
                        const nextY = (height / (neuronsPerLayer[layer + 1] + 1)) * (j + 1);
                        const connection = document.createElement('div');
                        connection.className = 'connection';
                        connection.style.width = `${layerWidth}px`;
                        connection.style.left = `${x}px`;
                        connection.style.top = `${y}px`;
                        connection.style.transform = `rotate(${Math.atan2(nextY - y, layerWidth) * 180 / Math.PI}deg)`;
                        connection.style.animationDelay = `${Math.random() * 3}s`;
                        
                        // 添加权重
                        connection.dataset.weight = (Math.random() * 2 - 1).toFixed(2);
                        neuralNetwork.appendChild(connection);
                    }
                }
            }
        }
    }

    // 预处理步骤动画
    function initPreprocessing() {
        const steps = document.querySelectorAll('.preprocessing-step');
        let currentStep = 0;

        function processNextStep() {
            if (currentStep < steps.length) {
                steps[currentStep].classList.add('completed');
                currentStep++;
                setTimeout(processNextStep, 1000);
            }
        }

        processNextStep();
    }

    // 更新分类指标
    function updateClassificationMetrics() {
        const metrics = {
            accuracy: 0,
            precision: 0,
            recall: 0
        };

        const interval = setInterval(() => {
            if (metrics.accuracy < 0.95) {
                metrics.accuracy += 0.01;
                metrics.precision += 0.01;
                metrics.recall += 0.01;

                document.querySelector('.metric-value:nth-child(2)').textContent = 
                    `${Math.round(metrics.accuracy * 100)}%`;
                document.querySelector('.metric-value:nth-child(4)').textContent = 
                    `${Math.round(metrics.precision * 100)}%`;
                document.querySelector('.metric-value:nth-child(6)').textContent = 
                    `${Math.round(metrics.recall * 100)}%`;
            } else {
                clearInterval(interval);
            }
        }, 100);
    }

    // 更新混淆矩阵
    function updateConfusionMatrix() {
        const matrix = document.querySelector('.confusion-matrix');
        const categories = ['robot', 'agriculture', 'landslide', 'vision', 'microscope', 'satellite', 'star'];
        
        // 创建表头
        categories.forEach(category => {
            const header = document.createElement('div');
            header.className = 'matrix-cell';
            header.textContent = category.substring(0, 3);
            matrix.appendChild(header);
        });

        // 创建矩阵内容
        categories.forEach(category => {
            categories.forEach(predicted => {
                const cell = document.createElement('div');
                cell.className = 'matrix-cell';
                cell.textContent = Math.floor(Math.random() * 10);
                matrix.appendChild(cell);
            });
        });
    }

    // 更新分类结果
    function updateCategoryStats() {
        const categories = Object.keys(categoryStats);
        let currentIndex = 0;

        function updateNextCategory() {
            if (currentIndex < categories.length) {
                const category = categories[currentIndex];
                const stats = categoryStats[category];
                
                // 模拟数据增长
                stats.count += Math.floor(Math.random() * 5) + 1;
                stats.confidence = Math.min(0.95, stats.confidence + 0.05);

                // 更新UI
                const card = document.querySelector(`.result-card[data-category="${category}"]`);
                if (card) {
                    card.querySelector('.count').textContent = stats.count;
                    card.querySelector('.confidence').textContent = 
                        `${Math.round(stats.confidence * 100)}%`;
                }

                currentIndex++;
                setTimeout(updateNextCategory, 500);
            }
        }

        updateNextCategory();
    }

    // 数据分类动画
    function initClassificationAnimation() {
        const processSection = document.querySelector('.process-section');
        const animationContainer = document.createElement('div');
        animationContainer.className = 'classification-animation';
        animationContainer.innerHTML = `
            <div class="data-particles"></div>
            <div class="classification-lines"></div>
            <div class="category-bubbles"></div>
        `;
        processSection.appendChild(animationContainer);

        // 创建数据粒子
        function createDataParticles() {
            const particlesContainer = document.querySelector('.data-particles');
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'data-particle';
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                particle.style.animationDelay = `${Math.random() * 2}s`;
                particlesContainer.appendChild(particle);
            }
        }

        // 创建分类线
        function createClassificationLines() {
            const linesContainer = document.querySelector('.classification-lines');
            const categories = ['robot', 'agriculture', 'landslide', 'vision', 'microscope', 'satellite', 'star'];
            
            categories.forEach(category => {
                const line = document.createElement('div');
                line.className = 'classification-line';
                line.dataset.category = category;
                linesContainer.appendChild(line);
            });
        }

        // 创建类别气泡
        function createCategoryBubbles() {
            const bubblesContainer = document.querySelector('.category-bubbles');
            const categories = ['robot', 'agriculture', 'landslide', 'vision', 'microscope', 'satellite', 'star'];
            
            categories.forEach(category => {
                const bubble = document.createElement('div');
                bubble.className = 'category-bubble';
                bubble.dataset.category = category;
                bubble.innerHTML = `<i class="fas fa-${getCategoryIcon(category)}"></i>`;
                bubblesContainer.appendChild(bubble);
            });
        }

        // 获取类别图标
        function getCategoryIcon(category) {
            const icons = {
                robot: 'robot',
                agriculture: 'leaf',
                landslide: 'mountain',
                vision: 'eye',
                microscope: 'microscope',
                satellite: 'satellite',
                star: 'star'
            };
            return icons[category] || 'circle';
        }

        createDataParticles();
        createClassificationLines();
        createCategoryBubbles();
    }

    // 处理卡片点击
    cards.forEach(card => {
        card.addEventListener('click', () => {
            // 重置所有状态
            cards.forEach(c => c.classList.remove('active'));
            resultCards.forEach(rc => rc.classList.remove('active'));
            document.querySelector('.keyword-cloud').innerHTML = '';
            document.querySelector('.neural-network').innerHTML = '';
            document.querySelector('.progress-fill').style.width = '0';
            document.querySelectorAll('.preprocessing-step').forEach(step => 
                step.classList.remove('completed'));
            document.querySelector('.confusion-matrix').innerHTML = '';
            document.querySelector('.classification-animation')?.remove();
            Object.keys(categoryStats).forEach(category => {
                categoryStats[category] = { count: 0, confidence: 0 };
            });
            
            // 激活当前卡片
            card.classList.add('active');
            
            // 开始关键词提取
            setTimeout(() => {
                initKeywordExtraction();
                
                // 开始预处理
                setTimeout(() => {
                    initPreprocessing();
                    
                    // 开始分类
                    setTimeout(() => {
                        initClassificationAnimation();
                        updateClassificationMetrics();
                        updateConfusionMatrix();
                        updateCategoryStats();
                        
                        // 激活对应的结果卡片
                        const source = card.dataset.source;
                        const categories = sourceToCategories[source];
                        if (categories) {
                            setTimeout(() => {
                                categories.forEach(category => {
                                    const resultCard = document.querySelector(
                                        `.result-card[data-category="${category}"]`
                                    );
                                    if (resultCard) {
                                        resultCard.classList.add('active');
                                    }
                                });
                            }, 1000);
                        }
                    }, 3000);
                }, 1000);
            }, 500);
        });
    });

    // 数据流自动循环高亮
    function initDataFlowAnimation() {
        let currentIndex = 0;

        function highlightNext() {
            flowItems.forEach(item => item.classList.remove('active'));
            flowItems[currentIndex].classList.add('active');
            currentIndex = (currentIndex + 1) % flowItems.length;
        }

        highlightNext();
        setInterval(highlightNext, 2000);
    }

    // 页面加载完成后初始化动画
    initDataFlowAnimation();
}); 