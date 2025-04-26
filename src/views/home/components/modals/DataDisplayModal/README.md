# 学术数据分析可视化平台

## 项目简介

这是一个基于 Streamlit 开发的学术数据分析可视化平台，用于展示和分析学术论文、数据集等研究资源的统计信息。该平台提供了直观的数据可视化界面，支持实时数据筛选和趋势分析。

## 功能特点

- 📊 实时数据统计展示
- 📈 论文发布趋势分析
- 🔍 研究领域数据筛选
- 📑 最新更新动态展示
- 💡 交互式数据可视化
- 🌙 深色主题界面设计

## 技术栈

- Python 3.8+
- Streamlit 1.32.0
- Plotly 5.18.0
- Pandas 2.2.0
- NumPy 1.26.3

## 安装说明

1. 克隆项目到本地：
```bash
git clone [项目地址]
cd [项目目录]
```

2. 创建并激活虚拟环境（推荐）：
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

3. 安装依赖：
```bash
pip install -r requirements.txt
```

## 运行方法

1. 确保已安装所有依赖
2. 在项目根目录下运行：
```bash
streamlit run app.py
```
3. 浏览器将自动打开应用页面，默认地址为 http://localhost:8501

## 项目结构

```
project/
│
├── app.py              # 主应用程序文件
├── requirements.txt    # 项目依赖文件
└── README.md          # 项目说明文档
```

## 代码结构说明

主应用程序 (app.py) 的结构如下：

1. **配置部分**
   - 页面设置
   - CSS样式定义
   - 全局变量设置

2. **数据处理**
   - 数据生成函数
   - 数据预处理逻辑

3. **界面组件**
   - 侧边栏设置
   - 主页面布局
   - 可视化图表

4. **交互功能**
   - 领域筛选
   - 数据更新
   - 统计计算

## 自定义开发

### 添加新的数据源

修改 `generate_daily_data()` 函数或创建新的数据获取函数：

```python
def get_real_data():
    # 添加实际数据获取逻辑
    pass
```

### 添加新的可视化图表

在主页面部分添加新的图表：

```python
# 添加新的图表
fig_new = go.Figure()
# 配置图表数据和样式
st.plotly_chart(fig_new, use_container_width=True)
```

### 修改样式

在 CSS 样式部分添加或修改样式定义：

```python
st.markdown("""
<style>
    /* 添加新的样式 */
    .new-class {
        property: value;
    }
</style>
""", unsafe_allow_html=True)
```

## 注意事项

1. 确保 Python 环境版本兼容
2. 所有依赖都已正确安装
3. 运行时保持网络连接
4. 注意数据处理性能优化

## 常见问题

1. **运行时显示 "No module named 'streamlit'"**
   - 解决：检查是否已安装依赖 `pip install streamlit`

2. **页面无法加载**
   - 解决：检查网络连接和端口占用情况

3. **数据不显示**
   - 解决：检查数据生成函数是否正常运行

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 版本历史

- v1.0.0 (2024-03-xx)
  - 初始版本发布
  - 基础功能实现
  - 深色主题界面

## 许可证

[选择适当的许可证]

## 联系方式

[您的联系信息]

## 致谢

感谢所有贡献者的付出！ 