#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
数据采集系统后端
提供数据源配置、模拟数据生成和API接口服务

主要功能：
1. 配置并管理不同类型的数据源
2. 生成模拟数据用于演示
3. 提供RESTful API接口
4. 支持实时数据爬取
"""

from flask import Flask, render_template, jsonify, request
import requests
from bs4 import BeautifulSoup
import time
from datetime import datetime
import random

app = Flask(__name__)

# 数据源配置
# 可以根据需要扩展更多数据源类型
# name: 显示名称
# parser: 解析器类型，用于后续扩展不同的解析逻辑
DATA_SOURCES = {
    'academic': {
        'name': '学术论文',
        'parser': 'academic'
    },
    'report': {
        'name': '调查报告',
        'parser': 'report'
    },
    'book': {
        'name': '专业书籍',
        'parser': 'book'
    },
    'policy': {
        'name': '政策文件',
        'parser': 'policy'
    },
    'standard': {
        'name': '法规标准',
        'parser': 'standard'
    }
}

# 模拟数据模板
# 用于生成不同类型的模拟数据
# titles: 标题模板列表
# fields: 领域列表
# sizes: 文件大小范围
DATA_TEMPLATES = {
    'academic': {
        'titles': [
            '深度学习在{}中的应用研究',
            '基于{}的{}模型研究',
            '{}在{}中的应用',
            '{}技术的最新进展',
            '{}系统的设计与实现'
        ],
        'fields': [
            '计算机视觉', '自然语言处理', '机器学习', '人工智能', '数据挖掘',
            '图像识别', '语音识别', '推荐系统', '知识图谱', '强化学习'
        ],
        'sizes': ['1.2MB', '2.5MB', '3.8MB', '4.2MB', '5.6MB']
    },
    'report': {
        'titles': [
            '{}年度{}发展报告',
            '{}行业{}分析报告',
            '{}市场{}调查报告',
            '{}技术{}白皮书',
            '{}领域{}研究报告'
        ],
        'fields': [
            '人工智能', '大数据', '云计算', '物联网', '区块链',
            '数字经济', '智能制造', '智慧城市', '数字化转型', '产业升级'
        ],
        'sizes': ['3.5MB', '4.8MB', '6.2MB', '7.5MB', '8.9MB']
    },
    'book': {
        'titles': [
            '{}入门与实践',
            '{}开发指南',
            '{}技术详解',
            '{}实战教程',
            '{}高级编程'
        ],
        'fields': [
            'Python', 'Java', 'C++', 'JavaScript', 'Go',
            '深度学习', '机器学习', '数据分析', 'Web开发', '移动开发'
        ],
        'sizes': ['12.3MB', '15.7MB', '18.9MB', '22.4MB', '25.8MB']
    },
    'policy': {
        'titles': [
            '{}发展规划纲要',
            '{}发展指导意见',
            '{}实施方案',
            '{}管理办法',
            '{}实施细则'
        ],
        'fields': [
            '人工智能', '数字经济', '科技创新', '产业升级', '数字化转型',
            '智慧城市', '智能制造', '数据安全', '隐私保护', '网络安全'
        ],
        'sizes': ['0.8MB', '1.2MB', '1.5MB', '1.8MB', '2.1MB']
    },
    'standard': {
        'titles': [
            '{}安全标准',
            '{}技术规范',
            '{}实施指南',
            '{}评估标准',
            '{}管理规范'
        ],
        'fields': [
            '数据', '网络', '系统', '应用', '服务',
            '安全', '质量', '性能', '接口', '测试'
        ],
        'sizes': ['0.5MB', '0.8MB', '1.1MB', '1.3MB', '1.6MB']
    }
}

def generate_random_data(source_type):
    """
    生成随机模拟数据
    
    Args:
        source_type (str): 数据源类型，必须是DATA_SOURCES中定义的类型之一
        
    Returns:
        dict: 包含生成的模拟数据，格式如下：
            {
                'title': str,  # 文档标题
                'size': str,   # 文件大小
                'image_url': str  # 预览图片URL
            }
    """
    template = DATA_TEMPLATES[source_type]
    title = random.choice(template['titles'])
    fields = random.sample(template['fields'], title.count('{}'))
    title = title.format(*fields)
    size = random.choice(template['sizes'])
    
    return {
        'title': title,
        'size': size,
        'image_url': f'https://paperswithcode.com/media/thumbnails/tasks/task-{random.choice(["image-classification", "object-detection", "text-generation", "machine-translation", "speech-recognition"])}.jpg'
    }

@app.route('/')
def index():
    """首页路由，返回主页面"""
    return render_template('index.html')

@app.route('/crawl', methods=['POST'])
def crawl():
    """
    数据爬取API接口
    
    请求方法：POST
    请求参数：
        source (str): 数据源类型
        
    返回数据：
        成功：
            {
                'results': [
                    {
                        'time': str,     # 爬取时间
                        'source': str,    # 数据源名称
                        'title': str,     # 文档标题
                        'size': str,      # 文件大小
                        'image_url': str  # 预览图片URL
                    },
                    ...
                ]
            }
        失败：
            {
                'error': str  # 错误信息
            }
    """
    source = request.json.get('source')
    if source not in DATA_SOURCES:
        return jsonify({'error': 'Invalid data source'}), 400

    try:
        # 模拟真实爬取延迟
        time.sleep(random.uniform(0.3, 0.8))
        
        # 根据不同数据源生成不同数量的数据
        source_config = {
            'academic': (1, 2),  # 学术论文爬取较慢
            'report': (2, 3),    # 报告相对较快
            'book': (1, 2),      # 书籍爬取较慢
            'policy': (2, 4),    # 政策文件较快
            'standard': (3, 5)   # 标准文件最快
        }
        
        num_range = source_config.get(source, (1, 2))
        num_results = random.randint(*num_range)
        results = []
        
        for _ in range(num_results):
            paper = generate_random_data(source)
            result = {
                'time': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'source': DATA_SOURCES[source]['name'],
                'title': paper['title'],
                'size': paper['size'],
                'image_url': paper['image_url']
            }
            results.append(result)

        return jsonify({'results': results})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True) 