import React, { useState, useEffect, useRef } from "react"
import * as echarts from "echarts"
import {
  BookOutlined,
  FileTextOutlined,
  AreaChartOutlined,
  ReadOutlined,
  SolutionOutlined,
  RobotOutlined,
  EyeOutlined,
  BranchesOutlined,
  ExperimentOutlined,
  RocketOutlined,
  StarOutlined,
  FilterOutlined,
  BankOutlined,
  DatabaseOutlined,
  CheckCircleOutlined,
  PieChartOutlined,
  NumberOutlined,
  PercentageOutlined,
} from "@ant-design/icons"

// 定义组件的props类型
interface DataAnalysisModalProps {
  themeColor?: string
  secondaryColor?: string
}

const DataAnalysisModal: React.FC<DataAnalysisModalProps> = () => {
  // 数据源到目标的映射关系
  const sourceToCategories = {
    law: ["robot", "vision"],
    paper: ["microscope", "satellite"],
    report: ["agriculture", "landslide"],
    policy: ["robot", "agriculture"],
    book: ["star", "satellite"],
  }

  // 分类结果统计状态
  const [categoryStats, setCategoryStats] = useState({
    robot: { count: 0, confidence: 0 },
    agriculture: { count: 0, confidence: 0 },
    landslide: { count: 0, confidence: 0 },
    vision: { count: 0, confidence: 0 },
    microscope: { count: 0, confidence: 0 },
    satellite: { count: 0, confidence: 0 },
    star: { count: 0, confidence: 0 },
  })

  // 激活的数据源
  const [activeSource, setActiveSource] = useState<string | null>(null)

  // 进度状态
  const [preprocessProgress, setPreprocessProgress] = useState(0)
  const [preprocessSteps, setPreprocessSteps] = useState<string[]>([])

  // 指标状态
  const [metrics, setMetrics] = useState({
    accuracy: 0,
    precision: 0,
    recall: 0,
  })

  // Refs
  const confusionMatrixRef = useRef<HTMLDivElement>(null)
  const flowIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // 获取类别图标
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      robot: <RobotOutlined className="text-2xl" />,
      agriculture: <BranchesOutlined className="text-2xl" />,
      landslide: <AreaChartOutlined className="text-2xl" />,
      vision: <EyeOutlined className="text-2xl" />,
      microscope: <ExperimentOutlined className="text-2xl" />,
      satellite: <RocketOutlined className="text-2xl" />,
      star: <StarOutlined className="text-2xl" />,
    }
    return icons[category]
  }

  // 初始化数据流动画
  useEffect(() => {
    const flowItems = document.querySelectorAll(".flow-item")
    let currentIndex = 0

    const highlightNext = () => {
      flowItems.forEach((item) => item.classList.remove("active"))
      flowItems[currentIndex].classList.add("active")
      currentIndex = (currentIndex + 1) % flowItems.length
    }

    highlightNext()
    flowIntervalRef.current = setInterval(highlightNext, 2000)

    return () => {
      if (flowIntervalRef.current) {
        clearInterval(flowIntervalRef.current)
      }
    }
  }, [])

  // 关键词提取动画
  const initKeywordExtraction = () => {
    const keywords = [
      "机器学习",
      "深度学习",
      "神经网络",
      "数据挖掘",
      "自然语言处理",
      "计算机视觉",
      "图像识别",
      "模式识别",
      "特征提取",
      "分类算法",
      "回归分析",
      "聚类分析",
    ]

    setPreprocessSteps([])
    let extractedKeywords: string[] = []
    let progress = 0

    const extractInterval = setInterval(() => {
      if (extractedKeywords.length < keywords.length) {
        extractedKeywords = [
          ...extractedKeywords,
          keywords[extractedKeywords.length],
        ]
        progress = (extractedKeywords.length / keywords.length) * 100
        setPreprocessProgress(progress)
      } else {
        clearInterval(extractInterval)
        initPreprocessing()
      }
    }, 500)

    return () => clearInterval(extractInterval)
  }

  // 预处理步骤动画
  const initPreprocessing = () => {
    const steps = ["数据清洗", "格式标准化", "特征提取"]
    let currentStep = 0

    const processNextStep = () => {
      if (currentStep < steps.length) {
        setPreprocessSteps((prev) => [...prev, steps[currentStep]])
        currentStep++
        setTimeout(processNextStep, 1000)
      } else {
        initClassification()
      }
    }

    processNextStep()
  }

  // 分类初始化
  const initClassification = () => {
    // 更新分类指标
    const updateMetricsInterval = setInterval(() => {
      setMetrics((prev) => {
        if (prev.accuracy < 0.95) {
          return {
            accuracy: prev.accuracy + 0.01,
            precision: prev.precision + 0.01,
            recall: prev.recall + 0.01,
          }
        } else {
          clearInterval(updateMetricsInterval)
          return prev
        }
      })
    }, 100)

    // 创建混淆矩阵图表
    if (confusionMatrixRef.current) {
      const chart = echarts.init(confusionMatrixRef.current)

      const categories = [
        "robot",
        "agriculture",
        "landslide",
        "vision",
        "microscope",
        "satellite",
        "star",
      ]
      const data: [number, number, number][] = []

      categories.forEach((source, i) => {
        categories.forEach((target, j) => {
          // 对角线上的值较大，表示分类正确的比例高
          const value =
            i === j
              ? Math.floor(Math.random() * 5) + 5
              : Math.floor(Math.random() * 3)
          data.push([i, j, value])
        })
      })

      const option = {
        tooltip: {
          position: "top",
        },
        grid: {
          left: "3%",
          right: "7%",
          bottom: "7%",
          top: "7%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: categories.map((cat) => cat.substring(0, 3)),
          splitArea: {
            show: true,
          },
          axisLabel: {
            color: "#fff",
          },
        },
        yAxis: {
          type: "category",
          data: categories.map((cat) => cat.substring(0, 3)),
          splitArea: {
            show: true,
          },
          axisLabel: {
            color: "#fff",
          },
        },
        visualMap: {
          min: 0,
          max: 10,
          calculable: true,
          orient: "horizontal",
          left: "center",
          bottom: "0%",
          textStyle: {
            color: "#fff",
          },
          inRange: {
            color: [
              "#313695",
              "#4575b4",
              "#74add1",
              "#abd9e9",
              "#e0f3f8",
              "#ffffbf",
              "#fee090",
              "#fdae61",
              "#f46d43",
              "#d73027",
              "#a50026",
            ],
          },
        },
        series: [
          {
            name: "分类结果",
            type: "heatmap",
            data: data,
            label: {
              show: true,
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      }

      chart.setOption(option)

      // 窗口大小变化时重新调整图表大小
      window.addEventListener("resize", () => {
        chart.resize()
      })
    }

    // 更新分类结果
    updateCategoryStats()
  }

  // 更新分类结果
  const updateCategoryStats = () => {
    if (!activeSource) return

    const categories = Object.keys(categoryStats)
    let currentIndex = 0

    function updateNextCategory() {
      if (currentIndex < categories.length) {
        const category = categories[currentIndex]

        setCategoryStats((prev) => {
          const newStats = { ...prev }

          // 如果是活动数据源映射的类别，增加更多计数和置信度
          if (
            sourceToCategories[
              activeSource as keyof typeof sourceToCategories
            ]?.includes(category)
          ) {
            newStats[category as keyof typeof categoryStats] = {
              count:
                prev[category as keyof typeof categoryStats].count +
                Math.floor(Math.random() * 5) +
                5,
              confidence: Math.min(
                0.95,
                prev[category as keyof typeof categoryStats].confidence + 0.1
              ),
            }
          } else {
            // 其他类别增加少量计数
            newStats[category as keyof typeof categoryStats] = {
              count:
                prev[category as keyof typeof categoryStats].count +
                Math.floor(Math.random() * 2),
              confidence: Math.min(
                0.4,
                prev[category as keyof typeof categoryStats].confidence + 0.02
              ),
            }
          }

          return newStats
        })

        currentIndex++
        setTimeout(updateNextCategory, 500)
      }
    }

    updateNextCategory()
  }

  // 处理卡片点击
  const handleCardClick = (source: string) => {
    // 重置所有状态
    setCategoryStats({
      robot: { count: 0, confidence: 0 },
      agriculture: { count: 0, confidence: 0 },
      landslide: { count: 0, confidence: 0 },
      vision: { count: 0, confidence: 0 },
      microscope: { count: 0, confidence: 0 },
      satellite: { count: 0, confidence: 0 },
      star: { count: 0, confidence: 0 },
    })
    setActiveSource(source)
    setPreprocessProgress(0)
    setPreprocessSteps([])
    setMetrics({
      accuracy: 0,
      precision: 0,
      recall: 0,
    })

    // 开始关键词提取
    setTimeout(initKeywordExtraction, 500)
  }

  // 数据源图标映射
  const getSourceIcon = (source: string) => {
    const icons: Record<string, React.ReactNode> = {
      law: <SolutionOutlined className="text-2xl" />,
      paper: <FileTextOutlined className="text-2xl" />,
      report: <AreaChartOutlined className="text-2xl" />,
      policy: <ReadOutlined className="text-2xl" />,
      book: <BookOutlined className="text-2xl" />,
    }
    return icons[source]
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-900/30 backdrop-blur-md rounded-3xl shadow-2xl border border-cyan-500/10 text-white">
      {/* <h2 className="text-3xl text-center mb-8 text-cyan-400 font-bold relative">
        数据分析
        <span className="block w-20 h-1 mx-auto mt-3 bg-gradient-to-r from-cyan-400 to-transparent rounded"></span>
      </h2> */}

      <div className="flex flex-col gap-8">
        {/* 数据输入部分 */}
        <div className="bg-gray-800/50 p-6 rounded-2xl shadow-md backdrop-blur-md border border-cyan-500/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
          <h2 className="text-xl font-bold mb-4 text-cyan-400 flex items-center">
            <DatabaseOutlined className="mr-2" /> 数据源选择
          </h2>
          <div className="grid grid-cols-5 gap-5 p-2">
            {Object.keys(sourceToCategories).map((source) => (
              <div
                key={source}
                className={`flex flex-col items-center p-4 bg-gray-800/60 rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-cyan-500/10 hover:shadow-cyan-500/20 ${
                  activeSource === source
                    ? "bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/30"
                    : ""
                }`}
                onClick={() => handleCardClick(source)}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 border transition-all duration-300 ${
                    activeSource === source
                      ? "bg-cyan-500 border-cyan-300 text-white"
                      : "bg-gray-800 border-cyan-500/20 text-cyan-400"
                  }`}
                >
                  {getSourceIcon(source)}
                </div>
                <span
                  className={`text-sm text-center font-medium ${
                    activeSource === source ? "text-white" : "text-gray-200"
                  }`}
                >
                  {getSourceLabel(source)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 数据分类处理部分 */}
        <div className="bg-gray-800/50 p-6 rounded-2xl shadow-md backdrop-blur-md border border-cyan-500/10">
          <div className="flex flex-row gap-6">
            {/* 左侧：数据预处理和智能分类（上下排列） */}
            <div className="w-3/4 flex flex-col gap-6">
              <div className="bg-gray-800/60 rounded-xl p-4 shadow-md border border-cyan-500/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-500/20">
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-cyan-500/10">
                  <FilterOutlined className="text-lg text-cyan-400" />
                  <h3 className="text-lg text-white font-medium">数据预处理</h3>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="bg-gray-900/40 p-3 rounded-lg border border-cyan-500/10">
                    {["数据清洗", "格式标准化", "特征提取"].map(
                      (step, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-3 p-2 my-1 rounded-md transition-all duration-300 ${
                            preprocessSteps.includes(step)
                              ? "bg-cyan-500/20"
                              : "bg-cyan-500/5"
                          }`}
                        >
                          <CheckCircleOutlined
                            className={
                              preprocessSteps.includes(step)
                                ? "text-white"
                                : "text-cyan-400"
                            }
                          />
                          <span className="text-white text-sm">{step}</span>
                        </div>
                      )
                    )}
                  </div>
                  <div className="w-full h-2 bg-gray-900/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full transition-all duration-500"
                      style={{ width: `${preprocessProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/60 rounded-xl p-4 shadow-md border border-cyan-500/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-500/20">
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-cyan-500/10">
                  <BankOutlined className="text-lg text-cyan-400" />
                  <h3 className="text-lg text-white font-medium">智能分类</h3>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-3 gap-4 p-3 bg-gray-900/40 rounded-lg border border-cyan-500/10">
                    <div className="flex flex-col items-center gap-1 p-3 bg-cyan-500/10 rounded-lg transition-all duration-300 hover:bg-cyan-500/20 hover:-translate-y-1">
                      <span className="text-xs text-gray-300 whitespace-nowrap">
                        准确率
                      </span>
                      <span className="text-xl text-cyan-400 font-bold">
                        {Math.round(metrics.accuracy * 100)}%
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1 p-3 bg-cyan-500/10 rounded-lg transition-all duration-300 hover:bg-cyan-500/20 hover:-translate-y-1">
                      <span className="text-xs text-gray-300 whitespace-nowrap">
                        精确率
                      </span>
                      <span className="text-xl text-cyan-400 font-bold">
                        {Math.round(metrics.precision * 100)}%
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1 p-3 bg-cyan-500/10 rounded-lg transition-all duration-300 hover:bg-cyan-500/20 hover:-translate-y-1">
                      <span className="text-xs text-gray-300 whitespace-nowrap">
                        召回率
                      </span>
                      <span className="text-xl text-cyan-400 font-bold">
                        {Math.round(metrics.recall * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full p-3 bg-gray-900/40 rounded-lg border border-cyan-500/10">
                    <div ref={confusionMatrixRef} className="w-full h-48"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧：流程图（垂直排列） */}
            <div className="w-1/4 flex flex-col justify-center">
              <div className="flex flex-col items-center gap-4 bg-gray-900/30 p-4 rounded-lg">
                <div className="flow-item flex flex-col items-center p-3 rounded-lg bg-gray-800/40 border border-cyan-500/10 w-full">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 bg-gray-800 text-cyan-400 border border-cyan-500/20">
                    📊
                  </div>
                  <div className="text-xs text-gray-200 font-medium">
                    原始数据
                  </div>
                </div>
                <div className="text-xl text-cyan-400 opacity-60">↓</div>
                <div className="flow-item flex flex-col items-center p-3 rounded-lg bg-gray-800/40 border border-cyan-500/10 w-full">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 bg-gray-800 text-cyan-400 border border-cyan-500/20">
                    🔍
                  </div>
                  <div className="text-xs text-gray-200 font-medium">
                    数据预处理
                  </div>
                </div>
                <div className="text-xl text-cyan-400 opacity-60">↓</div>
                <div className="flow-item flex flex-col items-center p-3 rounded-lg bg-gray-800/40 border border-cyan-500/10 w-full">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 bg-gray-800 text-cyan-400 border border-cyan-500/20">
                    🧠
                  </div>
                  <div className="text-xs text-gray-200 font-medium">
                    智能分类
                  </div>
                </div>
                <div className="text-xl text-cyan-400 opacity-60">↓</div>
                <div className="flow-item flex flex-col items-center p-3 rounded-lg bg-gray-800/40 border border-cyan-500/10 w-full">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 bg-gray-800 text-cyan-400 border border-cyan-500/20">
                    📈
                  </div>
                  <div className="text-xs text-gray-200 font-medium">
                    结果验证
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 分类结果展示部分 */}
        <div className="bg-gray-800/50 p-6 rounded-2xl shadow-md backdrop-blur-md border border-cyan-500/10 relative">
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
          <h2 className="text-xl font-bold mb-4 text-cyan-400 flex items-center">
            <PieChartOutlined className="mr-2" /> 分类结果
          </h2>
          <div className="grid grid-cols-7 gap-4 p-2">
            {Object.keys(categoryStats).map((category) => (
              <div
                key={category}
                className={`flex flex-col items-center p-3 bg-gray-800/60 rounded-xl shadow-md transition-all duration-300 hover:scale-105 border ${
                  activeSource &&
                  sourceToCategories[
                    activeSource as keyof typeof sourceToCategories
                  ]?.includes(category)
                    ? "bg-cyan-500/20 border-cyan-400 opacity-100 scale-105 shadow-cyan-500/20"
                    : "border-cyan-500/10 opacity-70"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 border transition-all duration-300 ${
                    activeSource &&
                    sourceToCategories[
                      activeSource as keyof typeof sourceToCategories
                    ]?.includes(category)
                      ? "bg-cyan-500 border-cyan-300 text-white"
                      : "bg-gray-800 border-cyan-500/20 text-cyan-400"
                  }`}
                >
                  {getCategoryIcon(category)}
                </div>
                <span className="text-xs text-center font-medium text-white mb-2 truncate w-full">
                  {getResultCardLabel(category)}
                </span>
                <div className="w-full flex justify-between items-center p-2 bg-cyan-500/10 rounded-lg">
                  <div className="flex items-center gap-1">
                    {/* <NumberOutlined className="text-xs text-cyan-400" /> */}
                    <span className="text-xs font-semibold text-white">
                      {
                        categoryStats[category as keyof typeof categoryStats]
                          .count
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {/* <PercentageOutlined className="text-xs text-cyan-400" /> */}
                    <span className="text-xs font-semibold text-cyan-400">
                      {Math.round(
                        categoryStats[category as keyof typeof categoryStats]
                          .confidence * 100
                      )}
                      %
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// 数据源标签映射
const getSourceLabel = (source: string) => {
  const labels: Record<string, string> = {
    law: "法规标准",
    paper: "学术论文",
    report: "调查报告",
    policy: "政策文件",
    book: "专业书籍",
  }
  return labels[source] || source
}

// 结果卡片标签映射
const getResultCardLabel = (category: string) => {
  const labels: Record<string, string> = {
    robot: "工业机器人视觉",
    agriculture: "农业与环境监测",
    landslide: "地质勘探图像",
    vision: "机器人视觉",
    microscope: "微观结构图像",
    satellite: "高分辨率遥感影像",
    star: "天体观测图像",
  }
  return labels[category] || category
}

export default DataAnalysisModal
