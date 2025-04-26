import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import numpy as np

# 设置页面配置
st.set_page_config(
    page_title="学术数据分析平台",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# 自定义CSS样式
st.markdown("""
<style>
    /* 全局样式 */
    .main {
        background: linear-gradient(to bottom, #1a1f3c, #151934);
        color: #FFFFFF;
    }
    .stApp {
        background: linear-gradient(to bottom, #1a1f3c, #151934);
    }
    
    /* 侧边栏样式 */
    .css-1d391kg {
        background-color: #1a1f3c;
    }
    .css-1v3fvcr {
        background-color: #1a1f3c;
    }
    
    /* 卡片样式 */
    div[data-testid="stMetric"] {
        background: linear-gradient(45deg, #1e2343, #232952);
        border-radius: 15px;
        padding: 20px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    div[data-testid="stMetric"] label {
        color: #8b8fa3;
    }
    div[data-testid="stMetric"] div {
        color: #ffffff;
        font-size: 24px;
        font-weight: 600;
    }
    
    /* 图表容器样式 */
    .chart-container {
        background: linear-gradient(45deg, #1e2343, #232952);
        border-radius: 15px;
        padding: 20px;
        margin: 10px 0;
    }
    
    /* 标题样式 */
    h1, h2, h3 {
        color: #ffffff;
        font-weight: 600;
    }
    
    /* 自定义卡片样式 */
    .custom-metric-container {
        background: linear-gradient(45deg, #1e2343, #232952);
        border-radius: 15px;
        padding: 20px;
        margin: 10px 0;
    }
    .metric-value {
        font-size: 24px;
        font-weight: 600;
        color: #ffffff;
    }
    .metric-label {
        font-size: 14px;
        color: #8b8fa3;
    }
    .trend-positive {
        color: #4CAF50;
    }
    .trend-negative {
        color: #FF5252;
    }
</style>
""", unsafe_allow_html=True)

# 侧边栏
with st.sidebar:
    st.markdown("""
        <div style='padding: 20px 0; text-align: center;'>
            <h2 style='color: #ffffff; font-size: 1.5em; margin-bottom: 20px;'>📊 数据源配置</h2>
        </div>
    """, unsafe_allow_html=True)
    
    # 添加Logo和版本信息
    st.markdown("""
        <div style='text-align: center; margin-bottom: 20px;'>
            <img src='https://www.python.org/static/community_logos/python-logo-generic.svg' width='120px'>
            <p style='color: #8b8fa3; font-size: 0.8em; margin-top: 10px;'>Version 1.0.0</p>
        </div>
    """, unsafe_allow_html=True)
    
    # 数据源选择
    st.markdown("""
        <div style='margin-bottom: 20px;'>
            <p style='color: #8b8fa3; font-size: 0.9em;'>选择数据来源</p>
        </div>
    """, unsafe_allow_html=True)
    
    # 使用自定义HTML来创建带图标的选项
    data_source_options = {
        "📚 学术论文": "academic_papers",
        "📊 调查报告": "survey_reports",
        "📖 专业书籍": "professional_books",
        "📜 政策文件": "policy_documents",
        "⚖️ 法规标准": "regulations"
    }
    
    data_source = st.selectbox(
        "",
        list(data_source_options.keys()),
        index=0,
        help="选择要分析的数据来源"
    )
    
    # 根据不同数据源显示不同的子类型
    if data_source == "📚 学术论文":
        paper_type = st.multiselect(
            "论文类型",
            ["期刊论文", "会议论文", "学位论文", "预印本"],
            default=["期刊论文"],
            help="选择论文类型"
        )
    elif data_source == "📊 调查报告":
        report_type = st.multiselect(
            "报告类型",
            ["行业报告", "市场调研", "用户研究", "技术评估"],
            default=["行业报告"],
            help="选择报告类型"
        )
    elif data_source == "📖 专业书籍":
        book_type = st.multiselect(
            "书籍类型",
            ["教材", "专著", "参考书", "技术手册"],
            default=["专著"],
            help="选择书籍类型"
        )
    elif data_source == "📜 政策文件":
        policy_type = st.multiselect(
            "政策类型",
            ["国家政策", "行业政策", "地方政策", "国际政策"],
            default=["国家政策"],
            help="选择政策类型"
        )
    elif data_source == "⚖️ 法规标准":
        standard_type = st.multiselect(
            "标准类型",
            ["国家标准", "行业标准", "企业标准", "国际标准"],
            default=["国家标准"],
            help="选择标准类型"
        )
    
    # 时间范围选择
    st.markdown("""
        <div style='margin: 20px 0;'>
            <p style='color: #8b8fa3; font-size: 0.9em;'>时间范围</p>
        </div>
    """, unsafe_allow_html=True)
    
    date_range = st.date_input(
        "",
        value=(pd.to_datetime('2023-01-01'), pd.to_datetime('2023-12-31')),
        help="选择要分析的时间范围"
    )
    
    # 研究领域选择
    st.markdown("""
        <div style='margin: 20px 0;'>
            <p style='color: #8b8fa3; font-size: 0.9em;'>研究领域</p>
        </div>
    """, unsafe_allow_html=True)
    
    fields = st.multiselect(
        "",
        ["计算机科学", "人工智能", "数据科学", "机器学习", "深度学习", "自然语言处理", "计算机视觉", "知识图谱"],
        default=["计算机科学", "人工智能", "数据科学"],
        help="选择要分析的研究领域"
    )
    
    # 数据更新按钮
    st.markdown("<div style='margin: 30px 0;'>", unsafe_allow_html=True)
    if st.button("更新数据", use_container_width=True):
        st.success("数据已更新！")
    
    # 添加导出选项
    st.markdown("""
        <div style='margin: 20px 0;'>
            <p style='color: #8b8fa3; font-size: 0.9em;'>导出选项</p>
        </div>
    """, unsafe_allow_html=True)
    
    export_format = st.selectbox(
        "",
        ["CSV", "Excel", "PDF", "JSON"],
        help="选择导出格式"
    )
    
    if st.button("导出数据", use_container_width=True):
        st.info(f"数据将以 {export_format} 格式导出")
    
    # 添加帮助信息
    with st.expander("使用帮助"):
        st.markdown("""
        1. 选择数据来源
        2. 设置时间范围
        3. 选择研究领域
        4. 点击更新按钮刷新数据
        5. 导出分析结果
        """)
    
    # 添加底部版权信息
    st.markdown("""
        <div style='position: fixed; bottom: 20px; left: 20px; right: 20px; text-align: center;'>
            <p style='color: #8b8fa3; font-size: 0.7em;'>© 2024 学术数据分析平台</p>
        </div>
    """, unsafe_allow_html=True)

# 模拟数据生成
def generate_trend_data():
    dates = pd.date_range(start='2023-01-01', end='2023-12-31', freq='M')
    data = {
        'date': dates,
        '论文数量': np.random.normal(1000, 100, len(dates)),
        '引用次数': np.random.normal(2000, 200, len(dates)),
        '增长率': np.random.normal(0.15, 0.05, len(dates))
    }
    return pd.DataFrame(data)

trend_data = generate_trend_data()

# 主页面
st.markdown("<h1 style='text-align: center; color: #ffffff; margin-bottom: 30px;'>学术研究数据分析</h1>", unsafe_allow_html=True)

# 顶部指标卡片
col1, col2, col3, col4 = st.columns(4)
with col1:
    st.markdown("""
        <div class='custom-metric-container'>
            <div class='metric-value'>52,489</div>
            <div class='metric-label'>文献总量</div>
            <div class='trend-positive'>↑ 12.5%</div>
        </div>
    """, unsafe_allow_html=True)
with col2:
    st.markdown("""
        <div class='custom-metric-container'>
            <div class='metric-value'>15,932</div>
            <div class='metric-label'>图文数据集</div>
            <div class='trend-positive'>↑ 8.3%</div>
        </div>
    """, unsafe_allow_html=True)
with col3:
    st.markdown("""
        <div class='custom-metric-container'>
            <div class='metric-value'>25.8%</div>
            <div class='metric-label'>数据覆盖率</div>
            <div class='trend-positive'>↑ 2.1%</div>
        </div>
    """, unsafe_allow_html=True)
with col4:
    st.markdown("""
        <div class='custom-metric-container'>
            <div class='metric-value'>8</div>
            <div class='metric-label'>数据源类型</div>
            <div class='trend-positive'>↑ 1</div>
        </div>
    """, unsafe_allow_html=True)

# 添加数据分布图表
st.markdown("<div class='chart-container'>", unsafe_allow_html=True)
fig = go.Figure()

# 模拟各类型数据分布
data_types = ['学术论文', '调查报告', '专业书籍', '政策文件', '法规标准']
data_counts = [25000, 12000, 8000, 4500, 3000]
data_icons = ['📚', '📊', '📖', '📜', '⚖️']

# 创建带图标的柱状图
fig = go.Figure(data=[
    go.Bar(
        x=[f"{icon} {type_}" for icon, type_ in zip(data_icons, data_types)],
        y=data_counts,
        marker_color=['#4CAF50', '#FF5252', '#2196F3', '#FFC107', '#9C27B0']
    )
])

fig.update_layout(
    title={
        'text': '各类型数据分布',
        'y':0.95,
        'x':0.5,
        'xanchor': 'center',
        'yanchor': 'top',
        'font': dict(color='white', size=20)
    },
    plot_bgcolor='rgba(0,0,0,0)',
    paper_bgcolor='rgba(0,0,0,0)',
    xaxis=dict(
        showgrid=False,
        showline=False,
        tickfont=dict(color='white')
    ),
    yaxis=dict(
        showgrid=True,
        gridwidth=1,
        gridcolor='rgba(255,255,255,0.1)',
        tickfont=dict(color='white')
    ),
    margin=dict(l=40, r=40, t=60, b=40)
)

st.plotly_chart(fig, use_container_width=True)
st.markdown("</div>", unsafe_allow_html=True)

# 添加数据详情表格
st.markdown("<div class='chart-container'>", unsafe_allow_html=True)
st.markdown("<h3 style='color: white;'>最新数据列表</h3>", unsafe_allow_html=True)

latest_data = pd.DataFrame({
    '标题': ['人工智能发展白皮书', '数据安全标准规范', '机器学习最新进展'],
    '类型': ['📊 调查报告', '⚖️ 法规标准', '📚 学术论文'],
    '数据量': [1250, 856, 2103],
    '更新日期': ['2024-01-15', '2024-01-14', '2024-01-13']
})

st.dataframe(
    latest_data,
    column_config={
        "标题": st.column_config.TextColumn("标题", width="medium"),
        "类型": st.column_config.TextColumn("类型", width="small"),
        "数据量": st.column_config.NumberColumn("数据量", format="%d"),
        "更新日期": st.column_config.DateColumn("更新日期"),
    },
    hide_index=True,
    use_container_width=True
)
st.markdown("</div>", unsafe_allow_html=True)