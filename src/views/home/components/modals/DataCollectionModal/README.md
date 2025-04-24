# 数据采集系统

一个现代化的数据采集和展示系统，支持多数据源、实时统计和可视化展示。

## 功能特点

- 支持多种数据源采集
- 实时数据统计和展示
- 24小时趋势图可视化
- 现代化UI设计
- 响应式布局
- 实时爬取速度监控

## 技术栈

### 后端
- Python 3.7+
- Flask
- BeautifulSoup4

### 前端
- HTML5
- CSS3
- JavaScript
- ECharts 5.4.3

## 快速开始

### 环境要求
- Python 3.7 或更高版本
- pip 包管理器

### 安装步骤

1. 克隆项目
```bash
git clone [项目地址]
cd [项目目录]
```

2. 创建虚拟环境（推荐）
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

3. 安装依赖
```bash
pip install -r requirements.txt
```

4. 启动服务
```bash
python app.py
```

5. 访问系统
打开浏览器访问 `http://localhost:5000`

## 项目结构

```
project/
├── app.py              # 后端主程序
├── requirements.txt    # 项目依赖
├── static/            # 静态资源
│   └── css/
│       └── style.css  # 样式文件
├── templates/         # 模板文件
│   └── index.html    # 主页面
└── README.md         # 项目说明
```

## API文档

### 数据爬取接口

**请求URL：** `/crawl`

**请求方法：** POST

**请求参数：**

| 参数名 | 类型 | 必选 | 说明 |
|--------|------|------|------|
| source | string | 是 | 数据源类型 |

支持的数据源类型：
- academic: 学术论文
- report: 调查报告
- book: 专业书籍
- policy: 政策文件
- standard: 法规标准

**返回示例：**

```json
{
    "results": [
        {
            "time": "2024-03-18 15:30:45",
            "source": "学术论文",
            "title": "深度学习在计算机视觉中的应用研究",
            "size": "1.2MB",
            "image_url": "https://example.com/image.jpg"
        }
    ]
}
```

## 自定义配置

### 数据源配置

在 `app.py` 中的 `DATA_SOURCES` 字典中添加新的数据源：

```python
DATA_SOURCES = {
    'new_source': {
        'name': '新数据源',
        'parser': 'custom_parser'
    }
}
```

### 数据模板配置

在 `DATA_TEMPLATES` 字典中添加新的数据模板：

```python
DATA_TEMPLATES = {
    'new_source': {
        'titles': ['标题模板1 {}', '标题模板2 {}'],
        'fields': ['领域1', '领域2'],
        'sizes': ['1.0MB', '2.0MB']
    }
}
```

## 开发指南

### 添加新数据源

1. 在 `DATA_SOURCES` 中注册新数据源
2. 在 `DATA_TEMPLATES` 中添加对应的数据模板
3. 在前端添加相应的数据源选项
4. 实现对应的数据解析逻辑（如需要）

### 自定义爬取逻辑

修改 `generate_random_data` 函数或添加新的数据生成函数：

```python
def custom_data_generator(source_type):
    # 实现自定义的数据生成逻辑
    pass
```

### 前端定制

1. 修改 `static/css/style.css` 自定义样式
2. 在 `templates/index.html` 中调整布局和组件
3. 调整 ECharts 配置自定义图表显示

## 注意事项

1. 本项目目前使用模拟数据，如需对接真实数据源，请修改相应的数据获取逻辑
2. 建议在生产环境中使用 gunicorn 或 uwsgi 等 WSGI 服务器
3. 注意处理并发请求和错误情况
4. 建议添加日志记录和监控机制

