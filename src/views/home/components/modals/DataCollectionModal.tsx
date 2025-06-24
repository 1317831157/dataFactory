import React, { useState, useEffect, useRef } from "react"
import { Button, Statistic, Card, Row, Col, Divider } from "antd"
import * as echarts from "echarts"
import { dataCollectionApi } from "../../../../api/dataCollectModal"

interface DataCollectionModalProps {
  themeColor: string
  secondaryColor: string
}

// 数据源类型
type DataSourceType =
  | "academic"
  | "report"
  | "book"
  | "policy"
  | "standard"
  | null

// 模拟爬取的数据结构
interface CrawlResult {
  title: string
  source: string
  time: string
}

// 模拟数据标题
const MOCK_TITLES = [
  "人工智能在医疗健康领域的应用研究",
  "大数据技术在智慧城市中的实践探索",
  "区块链技术与供应链管理的创新融合",
  "云计算架构下的企业信息安全策略",
  "物联网技术在工业4.0中的关键作用",
  "5G技术赋能智能制造的发展路径",
  "数字孪生技术在产品设计中的应用",
  "人机交互技术的最新发展趋势分析",
  "自然语言处理在智能客服中的应用",
  "边缘计算在实时数据处理中的优势",
]

// 模拟数据来源
const MOCK_SOURCES = {
  academic: [
    "中国知网",
    "IEEE数据库",
    "Science Direct",
    "Springer",
    "ACM图书馆",
  ],
  report: ["麦肯锡研究", "德勤咨询", "波士顿咨询", "国家发改委", "行业协会"],
  book: [
    "科学出版社",
    "机械工业出版社",
    "清华大学出版社",
    "电子工业出版社",
    "人民邮电出版社",
  ],
  policy: [
    "国务院公报",
    "发改委政策",
    "工信部文件",
    "科技部规划",
    "地方政府公告",
  ],
  standard: ["国家标准", "行业标准", "ISO标准", "IEEE标准", "企业标准"],
}

const DataCollectionModal: React.FC<DataCollectionModalProps> = ({
  themeColor,
  secondaryColor,
}) => {
  // 数据源和爬取状态
  const [selectedSource, setSelectedSource] = useState<DataSourceType>(null)
  const [isCrawling, setIsCrawling] = useState(false)

  // 统计数据
  const [totalCount, setTotalCount] = useState(0)
  const [speedCounter, setSpeedCounter] = useState(0)
  const [trendData, setTrendData] = useState<number[]>(Array(24).fill(0))
  const [currentHour, setCurrentHour] = useState(new Date().getHours())

  // 各类型统计数据 - 使用空对象初始化，将根据后端返回数据动态填充
  const [counts, setCounts] = useState<Record<string, number>>({})

  // 爬取结果
  const [results, setResults] = useState<CrawlResult[]>([])

  // 图表相关引用
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // 初始化趋势图表
  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current)

      // 生成更真实的历史趋势数据
      const initialTrendData = Array(24)
        .fill(0)
        .map((_, index) => {
          const hour = (currentHour - 23 + index) % 24
          // 工作时间(8-18点)爬取量较大，其他时间较小
          if (hour >= 8 && hour <= 18) {
            return Math.floor(Math.random() * 30) + 10
          } else {
            return Math.floor(Math.random() * 10)
          }
        })
      setTrendData(initialTrendData)

      const option: echarts.EChartsOption = {
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: Array.from({ length: 24 }, (_, i) => `${i}:00`),
          axisLabel: {
            color: secondaryColor,
          },
          axisLine: {
            lineStyle: {
              color: `${secondaryColor}40`,
            },
          },
          splitLine: {
            lineStyle: {
              color: `${secondaryColor}20`,
            },
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            color: secondaryColor,
          },
          axisLine: {
            lineStyle: {
              color: `${secondaryColor}40`,
            },
          },
          splitLine: {
            lineStyle: {
              color: `${secondaryColor}20`,
            },
          },
        },
        series: [
          {
            data: initialTrendData,
            type: "line",
            smooth: true,
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: themeColor, // 渐变起始色
                  },
                  {
                    offset: 1,
                    color: "rgba(0, 255, 255, 0.1)", // 渐变结束色
                  },
                ],
              },
            },
            lineStyle: {
              color: themeColor,
              width: 3,
            },
            itemStyle: {
              color: themeColor,
              borderWidth: 2,
              borderColor: "#fff",
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: themeColor,
              },
            },
          },
        ],
      }

      chartInstance.current.setOption(option)
    }

    // 组件卸载时销毁图表实例和清除定时器
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose()
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [themeColor, secondaryColor, currentHour])

  // 更新趋势图表
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.setOption({
        series: [
          {
            data: trendData,
          },
        ],
      })
    }
  }, [trendData])

  // 窗口大小变化时重新调整图表大小
  useEffect(() => {
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize()
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // 初始化时获取统计数据
  useEffect(() => {
    fetchSourceStatistics()
  }, [])

  useEffect(() => {
    if (isCrawling) {
      startResultsPolling()
    }
  }, [isCrawling])
  // 获取数据源统计信息
  const fetchSourceStatistics = async () => {
    try {
      const response = await dataCollectionApi.getSourceStatistics()

      if (response && response.code === 200 && response.data) {
        // 直接使用后端返回的分类数据
        const apiCounts = response.data.counts || {}

        // 直接设置后端返回的分类数据，不进行映射
        setCounts(apiCounts)
        setTotalCount(response.data.totalCount || 0)
      }
    } catch (error) {
      console.error("获取数据源统计信息失败:", error)
    }
  }

  // 选择数据源处理函数
  const handleSelectSource = (source: DataSourceType) => {
    console.log("选择数据源:", source)
    setSelectedSource(source)
  }

  // 开始爬取数据处理函数
  const handleStartCrawling = async () => {
    if (!selectedSource) {
      alert("请先选择数据源！")
      return
    }
    // 启动结果轮询
    setIsCrawling(true)

    try {
      // 调用开始爬取API
      await dataCollectionApi.startCrawling({
        sourceType: selectedSource,
      })

      // 初始化一些数据，确保列表不为空
      const initialResults = []
      for (let i = 0; i < 10; i++) {
        initialResults.push({
          title: generateRealisticTitle(selectedSource),
          source: generateRealisticSource(selectedSource),
          time: new Date(Date.now() - i * 30000).toLocaleTimeString(),
        })
      }
      setResults(initialResults)

      // 启动统计定时器
      timerRef.current = setInterval(() => {
        updateStats()
      }, 1000)

      // 开始模拟数据爬取
      fetchData()
    } catch (error) {
      console.error("开始爬取失败:", error)
      setIsCrawling(false)
    }
  }

  // 启动结果轮询
  const startResultsPolling = () => {
    console.log("启动结果轮询")

    // 清除可能存在的旧轮询
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
      pollIntervalRef.current = null
    }

    // 设置新的轮询，每3秒获取一次最新结果
    pollIntervalRef.current = setInterval(() => {
      // 直接调用函数，让函数内部判断状态
      fetchCrawlResults()
    }, 3000)
  }

  // 生成真实的标题
  const generateRealisticTitle = (source: DataSourceType) => {
    if (!source) return "未知数据"

    // 使用MOCK_TITLES中的标题作为基础
    const titleIndex = Math.floor(Math.random() * MOCK_TITLES.length)
    const baseTitle = MOCK_TITLES[titleIndex]

    // 根据不同数据源添加特定前缀或后缀
    let prefix = ""
    let suffix = ""
    const currentYear = new Date().getFullYear()
    const randomYear = Math.max(
      currentYear - 5,
      Math.floor(Math.random() * 6) + (currentYear - 5)
    )

    switch (source) {
      case "academic":
        prefix = ["研究论文：", "学术研究：", "科学报告："][
          Math.floor(Math.random() * 3)
        ]
        suffix = `（${randomYear}年发表）`
        break
      case "report":
        prefix = ["行业报告：", "调研报告：", "分析报告："][
          Math.floor(Math.random() * 3)
        ]
        suffix = `（${randomYear}年第${Math.floor(Math.random() * 4) + 1}季度）`
        break
      case "book":
        prefix = ["著作：", "专著：", "教材："][Math.floor(Math.random() * 3)]
        suffix = `（${randomYear}年版）`
        break
      case "policy":
        prefix = ["政策文件：", "指导意见：", "规划纲要："][
          Math.floor(Math.random() * 3)
        ]
        suffix = `（${randomYear}年第${Math.floor(Math.random() * 100) + 1}号）`
        break
      case "standard":
        prefix = ["技术标准：", "行业规范：", "国家标准："][
          Math.floor(Math.random() * 3)
        ]
        suffix = `（${randomYear}年 ${String.fromCharCode(
          65 + Math.floor(Math.random() * 26)
        )}${Math.floor(Math.random() * 1000)}）`
        break
    }

    return `${prefix}${baseTitle}${suffix}`
  }

  // 生成真实的来源
  const generateRealisticSource = (source: DataSourceType) => {
    if (!source || !MOCK_SOURCES[source]) return "未知来源"

    const sourceArray = MOCK_SOURCES[source]
    const randomSource =
      sourceArray[Math.floor(Math.random() * sourceArray.length)]

    // 添加更多细节
    const details = ["", "主站", "数据库", "专题库", "官方网站"][
      Math.floor(Math.random() * 5)
    ]
    return details ? `${randomSource}·${details}` : randomSource
  }

  // 模拟获取爬取数据
  const fetchData = () => {
    if (!isCrawling) return

    // 定义递归爬取函数
    function crawlNext() {
      if (!isCrawling || !selectedSource) return

      // 创建新的爬取结果
      const newResult = {
        title: generateRealisticTitle(selectedSource),
        source: generateRealisticSource(selectedSource),
        time: new Date().toLocaleTimeString(),
      }

      // 更新结果列表，保持最新的结果在顶部
      setResults((prev) => {
        const newResults = [newResult, ...prev]
        if (newResults.length > 50) {
          return newResults.slice(0, 50)
        }
        return newResults
      })

      // 加快自动滚动频率，使滚动更流畅
      const delay = Math.floor(Math.random() * 200) + 80

      // 继续下一次爬取
      setTimeout(crawlNext, delay)
    }

    // 开始爬取过程
    crawlNext()
  }

  // 停止爬取数据处理函数
  const handleStopCrawling = async () => {
    try {
      // 调用停止爬取API
      await dataCollectionApi.stopCrawling()

      setIsCrawling(false)

      // 清除定时器
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      // 取消动画帧
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    } catch (error) {
      console.error("停止爬取失败:", error)
    }
  }

  // 获取爬取结果
  const fetchCrawlResults = async () => {
    // 在函数内部获取最新状态
    const currentIsCrawling = isCrawling
    const currentSource = selectedSource

    console.log("尝试获取爬取结果...", currentSource, currentIsCrawling)

    if (!currentSource || !currentIsCrawling) {
      console.log("条件不满足，跳过获取")

      // 如果已停止爬取，清除轮询
      if (!currentIsCrawling && pollIntervalRef.current) {
        console.log("已停止爬取，清除轮询")
        clearInterval(pollIntervalRef.current)
        pollIntervalRef.current = null
      }
      return
    }

    try {
      console.log("发送API请求获取结果")
      const response = await dataCollectionApi.getCrawlResults({
        sourceType: currentSource,
        page: 1,
        pageSize: 50,
      })

      console.log("获取结果成功:", response?.data?.results?.length || 0)
      if (response && response.data && response.data.results) {
        setResults(response.data.results)
      }
    } catch (error) {
      console.error("获取爬取结果失败:", error)
    }
  }

  // 更新统计数据
  const updateStats = () => {
    // 随机生成每秒爬取数量(5-15之间的随机数)，模拟真实波动
    const speedIncrement = Math.floor(Math.random() * 10) + 5

    // 更新统计数据
    setTotalCount((prev) => prev + speedCounter)
    setSpeedCounter(speedIncrement)

    // 更新趋势图表数据
    updateTrendData()

    // 更新左侧各类型数据统计
    if (selectedSource) {
      setCounts((prev) => {
        // 创建新的统计对象
        const newCounts = { ...prev }
        // 更新选中的数据源
        newCounts[selectedSource as keyof typeof newCounts] += speedIncrement
        return newCounts
      })
    }
  }

  // 更新趋势图表数据
  const updateTrendData = () => {
    const hour = new Date().getHours()

    if (hour !== currentHour) {
      // 如果小时变更，数据整体左移
      setTrendData((prev) => [...prev.slice(1), 0])
      setCurrentHour(hour)
    } else {
      // 随机波动，偶尔有较大增长
      setTrendData((prev) => {
        const newData = [...prev]
        // 基础增长
        let increment = speedCounter

        // 有10%的概率出现突发增长，增加图表波动性
        if (Math.random() < 0.1) {
          increment += Math.floor(Math.random() * 20)
        }

        newData[23] += increment
        return newData
      })
    }
  }

  // 获取数据源名称
  const getSourceName = (type: string) => {
    // 直接返回原始类别名称，不进行映射
    return type
  }

  // 定义卡片样式
  const cardStyle = {
    backgroundColor: "rgba(0, 30, 60, 0.5)",
    border: "1px solid rgba(0, 255, 255, 0.2)",
    boxShadow: "0 0 15px rgba(0, 200, 255, 0.1)",
    borderRadius: "8px",
  }

  // 定义标题样式
  const titleStyle = {
    color: themeColor,
    textShadow: `0 0 10px ${themeColor}80`,
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    marginBottom: "16px",
    paddingBottom: "8px",
    borderBottom: `1px solid ${themeColor}40`,
  }

  // 标题前装饰
  const titleDecoration = {
    display: "inline-block",
    width: "3px",
    height: "16px",
    background: `linear-gradient(to bottom, ${themeColor}, ${secondaryColor})`,
    marginRight: "8px",
    borderRadius: "2px",
  }

  return (
    <div className="data-collection-container">
      {/* 主容器 */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* 左侧数据源选择和统计 */}
        <div className="w-full lg:w-1/4 flex flex-col gap-4">
          {/* 数据统计卡片 */}
          <Card
            style={cardStyle}
            bodyStyle={{ padding: "16px", color: "#e6f7ff" }}
          >
            <h3 style={titleStyle}>
              <span style={titleDecoration}></span>
              数据统计
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-3">
              {Object.entries(counts).map(([type, count]) => (
                <Card
                  key={type}
                  size="small"
                  style={{
                    background: "rgba(0, 40, 80, 0.4)",
                    border: "1px solid rgba(0, 200, 255, 0.3)",
                  }}
                  bodyStyle={{ padding: "10px" }}
                >
                  <Statistic
                    title={
                      <span style={{ color: secondaryColor, fontSize: "12px" }}>
                        {type}
                      </span>
                    }
                    value={count}
                    valueStyle={{ color: themeColor, fontSize: "1.1rem" }}
                  />
                </Card>
              ))}
            </div>
          </Card>

          {/* 数据源选择卡片 */}
          <Card
            style={cardStyle}
            bodyStyle={{ padding: "16px", color: "#e6f7ff" }}
          >
            <h3 style={titleStyle}>
              <span style={titleDecoration}></span>
              数据源选择
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {Object.keys(counts).map((source) => (
                <Button
                  key={source}
                  type={selectedSource === source ? "primary" : "default"}
                  onClick={() => handleSelectSource(source)}
                  style={
                    selectedSource === source
                      ? {
                          backgroundColor: `${themeColor}90`,
                          borderColor: secondaryColor,
                          boxShadow: `0 0 10px ${themeColor}80`,
                          color: "#ffffff",
                        }
                      : {
                          borderColor: `${secondaryColor}80`,
                          color: "#e6f7ff",
                          background: "rgba(0, 60, 120, 0.2)",
                        }
                  }
                  className="text-left"
                  block
                >
                  {getSourceName(source)}
                </Button>
              ))}
            </div>

            <Divider
              style={{ borderColor: `${secondaryColor}40`, margin: "16px 0" }}
            />

            <div className="flex justify-between">
              <Button
                type="primary"
                disabled={isCrawling}
                onClick={handleStartCrawling}
                style={{
                  backgroundColor: !isCrawling
                    ? `${themeColor}e0`
                    : "rgba(0, 0, 0, 0.2)",
                  borderColor: !isCrawling
                    ? themeColor
                    : "rgba(120, 120, 120, 0.3)",
                  boxShadow: !isCrawling ? `0 0 10px ${themeColor}80` : "none",
                }}
              >
                开始爬取
              </Button>
              <Button
                danger
                disabled={!isCrawling}
                onClick={handleStopCrawling}
                style={{
                  opacity: isCrawling ? 1 : 0.5,
                  boxShadow: isCrawling
                    ? "0 0 10px rgba(255, 77, 79, 0.5)"
                    : "none",
                }}
              >
                停止爬取
              </Button>
            </div>
          </Card>

          {/* 接入说明卡片 - 只在大屏显示 */}
          <Card
            style={{ ...cardStyle, display: "none" }}
            className="hidden lg:block"
            bodyStyle={{ padding: "16px", color: "#e6f7ff" }}
          >
            <h3 style={titleStyle}>
              <span style={titleDecoration}></span>
              接入说明
            </h3>
            <p className="text-sm opacity-80 mb-2">支持多种数据源接入：</p>
            <ul className="list-disc pl-5 text-sm opacity-80">
              <li>各类工业设备连接</li>
              <li>API接口数据</li>
              <li>数据库导入</li>
              <li>文件导入</li>
              <li>实时流数据</li>
            </ul>
          </Card>
        </div>

        {/* 右侧内容区域 */}
        <div className="w-full lg:w-3/4 flex flex-col gap-4">
          {/* 顶部统计卡片 */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* 实时数据统计 */}
            <Card
              style={cardStyle}
              className="w-full md:w-1/3"
              bodyStyle={{ padding: "16px", color: "#e6f7ff" }}
            >
              <h3 style={titleStyle}>
                <span style={titleDecoration}></span>
                实时数据统计
              </h3>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title={
                      <span style={{ color: `${secondaryColor}cc` }}>
                        爬取速度
                      </span>
                    }
                    value={speedCounter}
                    suffix="条/秒"
                    valueStyle={{ color: themeColor, fontSize: "1.4rem" }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title={
                      <span style={{ color: `${secondaryColor}cc` }}>
                        总数据量
                      </span>
                    }
                    value={totalCount}
                    suffix="条"
                    valueStyle={{ color: themeColor, fontSize: "1.4rem" }}
                  />
                </Col>
              </Row>
            </Card>

            {/* 24小时趋势图 */}
            <Card
              style={cardStyle}
              className="w-full md:w-2/3"
              bodyStyle={{ padding: "16px", color: "#e6f7ff" }}
            >
              <h3 style={titleStyle}>
                <span style={titleDecoration}></span>
                24小时爬取趋势
              </h3>
              <div
                ref={chartRef}
                className="w-full"
                style={{ height: "200px" }}
              />
            </Card>
          </div>

          {/* 实时爬取结果 */}
          <Card
            style={cardStyle}
            bodyStyle={{ padding: "16px", color: "#e6f7ff" }}
          >
            <h3 style={titleStyle}>
              <span style={titleDecoration}></span>
              实时爬取结果
            </h3>
            <div
              className="max-h-[380px] overflow-y-auto pr-2"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: `${themeColor}40 transparent`,
              }}
            >
              {results.length > 0 ? (
                results.map((result, index) => (
                  <div
                    key={index}
                    className="p-3 mb-2"
                    style={{
                      animation: "fadeIn 0.5s ease-out",
                      opacity: 1,
                      transform: "translateY(0)",
                      backgroundColor: "rgba(0, 40, 100, 0.3)",
                      borderLeft: `2px solid ${themeColor}`,
                      borderRadius: "4px",
                      marginBottom: "8px",
                    }}
                  >
                    <div className="font-medium">{result.title}</div>
                    <div className="text-xs opacity-70 flex justify-between mt-1">
                      <span>{result.source}</span>
                      <span>{result.time}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  className="text-center py-8 opacity-50"
                  style={{
                    border: "1px dashed rgba(0, 200, 255, 0.3)",
                    borderRadius: "4px",
                  }}
                >
                  尚无爬取结果，请选择数据源并开始爬取
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* 底部接入说明 - 只在小屏显示 */}
      <Card
        style={{ ...cardStyle, marginTop: "16px" }}
        className="lg:hidden mt-4"
        bodyStyle={{ padding: "16px", color: "#e6f7ff" }}
      >
        <div className="flex items-center justify-between">
          <h3
            style={{
              ...titleStyle,
              marginBottom: 0,
              paddingBottom: 0,
              border: "none",
            }}
          >
            <span style={titleDecoration}></span>
            接入说明
          </h3>
          <div className="flex space-x-2">
            <span
              className="text-xs px-2 py-1 rounded"
              style={{
                backgroundColor: "rgba(0, 255, 255, 0.1)",
                color: themeColor,
              }}
            >
              采集频率配置
            </span>
            <span
              className="text-xs px-2 py-1 rounded"
              style={{
                backgroundColor: "rgba(0, 255, 255, 0.1)",
                color: themeColor,
              }}
            >
              过滤规则
            </span>
            <span
              className="text-xs px-2 py-1 rounded"
              style={{
                backgroundColor: "rgba(0, 255, 255, 0.1)",
                color: themeColor,
              }}
            >
              数据校验
            </span>
          </div>
        </div>
        <Divider
          style={{ borderColor: `${secondaryColor}40`, margin: "12px 0" }}
        />
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/2 md:pr-4">
            <p className="text-sm opacity-80 mb-2">支持多种数据源接入：</p>
            <ul className="list-disc pl-5 text-sm opacity-80">
              <li>各类工业设备连接</li>
              <li>API接口数据</li>
              <li>数据库导入</li>
              <li>文件导入</li>
              <li>实时流数据</li>
            </ul>
          </div>
          <div className="w-full md:w-1/2 mt-3 md:mt-0">
            <p className="text-sm opacity-80 mb-2">运行监控功能：</p>
            <ul className="list-disc pl-5 text-sm opacity-80">
              <li>运行状态实时查看</li>
              <li>数据质量监控</li>
              <li>异常告警</li>
              <li>数据流量统计</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* 自定义CSS */}
      <style>{`
        /* 自定义滚动条样式 */
        div::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        div::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb {
          background: ${themeColor}60;
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: ${themeColor};
        }

        /* 淡入动画 */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default DataCollectionModal
