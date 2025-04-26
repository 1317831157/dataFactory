import React, { useState, useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { HeatmapChart } from "echarts/charts"
import {
  GridComponent,
  TooltipComponent,
  VisualMapComponent,
  TitleComponent,
} from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"
import {
  FileTextOutlined,
  DatabaseOutlined,
  ApiOutlined,
  BookOutlined,
  FileExcelOutlined,
  FolderOutlined,
  EnvironmentOutlined,
  ExperimentOutlined,
  AlertOutlined,
  SafetyOutlined,
  AuditOutlined,
  BulbOutlined,
  CloudOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  LineChartOutlined,
  SearchOutlined,
  RobotOutlined,
  ScissorOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons"

// 注册必要的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  HeatmapChart,
  CanvasRenderer,
  VisualMapComponent,
])

interface DataAnalysisModalProps {
  themeColor?: string
  secondaryColor?: string
}

/**
 * 数据分析模态框组件
 * 用于展示数据处理和分析流程
 */
const DataAnalysisModal: React.FC<DataAnalysisModalProps> = () => {
  // 数据源到目标分类的映射
  const sourceToTargetMap = {
    法规标准: ["环境政策", "技术规范", "行业标准", "法律法规"],
    学术论文: ["理论研究", "实验方法", "案例分析", "综述"],
    调查报告: ["数据统计", "调研结果", "问题分析", "建议措施"],
  }

  // 状态管理
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>({})
  const [activeSource, setActiveSource] = useState<string>("法规标准")
  const [preprocessingProgress, setPreprocessingProgress] = useState(0)
  const [preprocessingStep, setPreprocessingStep] = useState(0)
  const [metrics, setMetrics] = useState<Record<string, number>>({
    accuracy: 0,
    precision: 0,
    recall: 0,
    f1: 0,
  })

  // 混淆矩阵图表的引用
  const chartRef = useRef<HTMLDivElement>(null)
  const myChart = useRef<echarts.ECharts | null>(null)

  // 处理数据源选择
  const handleSourceSelect = (source: string) => {
    setActiveSource(source)
    // 重置处理进度
    setPreprocessingProgress(0)
    setPreprocessingStep(0)
    // 更新分类统计数据
    updateCategoryStats(source)
  }

  // 根据数据源类型获取对应的图标
  const getSourceIcon = (source: string) => {
    const iconClasses = "mr-2 text-lg"

    switch (source) {
      case "法规标准":
        return <FileTextOutlined className={iconClasses} />
      case "监测数据":
        return <DatabaseOutlined className={iconClasses} />
      case "API接口":
        return <ApiOutlined className={iconClasses} />
      case "科研文献":
        return <BookOutlined className={iconClasses} />
      case "数据报表":
        return <FileExcelOutlined className={iconClasses} />
      default:
        return <FolderOutlined className={iconClasses} />
    }
  }

  // 根据分类名称获取结果图标
  const getCategoryIcon = (category: string) => {
    const iconClasses = "text-lg"

    if (category.includes("环境")) {
      return <EnvironmentOutlined className={iconClasses} />
    } else if (category.includes("监测")) {
      return <ExperimentOutlined className={iconClasses} />
    } else if (category.includes("污染") || category.includes("排放")) {
      return <AlertOutlined className={iconClasses} />
    } else if (category.includes("标准") || category.includes("规范")) {
      return <SafetyOutlined className={iconClasses} />
    } else if (category.includes("评价") || category.includes("审核")) {
      return <AuditOutlined className={iconClasses} />
    } else if (category.includes("技术") || category.includes("方法")) {
      return <BulbOutlined className={iconClasses} />
    } else if (category.includes("质量") || category.includes("保护")) {
      return <CloudOutlined className={iconClasses} />
    } else {
      return <FolderOutlined className={iconClasses} />
    }
  }

  // 提取关键词
  const extractKeywords = () => {
    return [
      "环境保护",
      "可持续发展",
      "碳排放",
      "生态系统",
      "污染防治",
      "资源利用",
      "能源效率",
      "废物处理",
      "环境监测",
      "绿色技术",
      "环境评估",
      "气候变化",
    ]
  }

  // 预处理步骤
  const preprocessingSteps = [
    {
      name: "数据清洗",
      icon: <ScissorOutlined className="text-cyan-400 text-lg" />,
    },
    {
      name: "文本预处理",
      icon: <ThunderboltOutlined className="text-cyan-400 text-lg" />,
    },
    {
      name: "特征提取",
      icon: <SearchOutlined className="text-cyan-400 text-lg" />,
    },
    {
      name: "智能分类",
      icon: <RobotOutlined className="text-cyan-400 text-lg" />,
    },
    {
      name: "性能评估",
      icon: <LineChartOutlined className="text-cyan-400 text-lg" />,
    },
  ]

  // 初始化分类
  const initClassification = () => {
    // 模拟分类过程
    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      setPreprocessingProgress(progress)

      // 更新当前步骤
      if (progress === 25) {
        setPreprocessingStep(1)
      } else if (progress === 65) {
        setPreprocessingStep(2)
      }

      // 更新指标
      if (progress >= 50) {
        setMetrics({
          accuracy: Math.min(0.95, (metrics.accuracy || 0) + 0.05),
          precision: Math.min(0.93, (metrics.precision || 0) + 0.04),
          recall: Math.min(0.91, (metrics.recall || 0) + 0.03),
          f1: Math.min(0.92, (metrics.f1 || 0) + 0.045),
        })
      }

      // 创建混淆矩阵
      if (progress === 80 && chartRef.current) {
        createConfusionMatrix()
      }

      if (progress >= 100) {
        clearInterval(interval)
      }
    }, 100)
  }

  // 更新分类统计
  const updateCategoryStats = (source: string) => {
    const targetCategories =
      sourceToTargetMap[source as keyof typeof sourceToTargetMap] || []
    const stats: Record<string, number> = {}

    targetCategories.forEach((category) => {
      stats[category] = Math.floor(Math.random() * 50) + 20
    })

    setCategoryStats(stats)
  }

  // 创建混淆矩阵
  const createConfusionMatrix = () => {
    if (!chartRef.current) return

    const categories = Object.keys(categoryStats)

    if (categories.length === 0) return

    // 生成混淆矩阵数据
    const data: [number, number, number][] = []
    const matrixSize = categories.length

    for (let i = 0; i < matrixSize; i++) {
      for (let j = 0; j < matrixSize; j++) {
        // 对角线上的值较大，表示分类正确
        const value =
          i === j
            ? Math.floor(Math.random() * 30) + 70
            : Math.floor(Math.random() * 15)
        data.push([i, j, value])
      }
    }

    // 初始化图表
    if (!myChart.current) {
      myChart.current = echarts.init(chartRef.current)
    }

    // 配置图表选项
    const option = {
      tooltip: {
        position: "top",
      },
      grid: {
        left: "3%",
        right: "7%",
        bottom: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: categories,
        splitArea: {
          show: true,
        },
        axisLabel: {
          color: "#e2e8f0",
          rotate: 45,
          fontSize: 10,
        },
      },
      yAxis: {
        type: "category",
        data: categories,
        splitArea: {
          show: true,
        },
        axisLabel: {
          color: "#e2e8f0",
          fontSize: 10,
        },
      },
      visualMap: {
        min: 0,
        max: 100,
        calculable: true,
        orient: "horizontal",
        left: "center",
        bottom: "0%",
        textStyle: {
          color: "#e2e8f0",
        },
        inRange: {
          color: [
            "#313695",
            "#4575b4",
            "#74add1",
            "#abd9e9",
            "#e0f3f8",
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

    // 设置图表
    myChart.current.setOption(option)
  }

  // 初始化默认的分类统计
  useEffect(() => {
    updateCategoryStats(activeSource)
    // 自动启动分类过程
    initClassification()

    // 组件卸载时清理图表
    return () => {
      if (myChart.current) {
        myChart.current.dispose()
      }
    }
  }, [])

  // 窗口大小变化时调整图表
  useEffect(() => {
    const handleResize = () => {
      if (myChart.current) {
        myChart.current.resize()
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // 结果卡标签映射
  const resultCardLabelMap: Record<string, string> = {
    accuracy: "准确率",
    precision: "精确率",
    recall: "召回率",
    f1: "F1值",
  }

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-xl w-full">
      <div className="text-3xl font-bold mb-6 text-center text-cyan-400">
        数据分析与分类
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 输入部分 - 数据源选择 */}
        <div className="col-span-1 bg-gray-800 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-cyan-300 border-b border-gray-700 pb-2">
            输入数据源
          </h3>

          <div className="space-y-3">
            {Object.keys(sourceToTargetMap).map((source) => (
              <div
                key={source}
                className={`cursor-pointer p-3 rounded-md flex items-center transition-all ${
                  activeSource === source
                    ? "bg-cyan-900 text-cyan-300"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
                onClick={() => handleSourceSelect(source)}
              >
                {getSourceIcon(source)}
                <span>{source}</span>
                {activeSource === source && (
                  <CheckOutlined className="ml-auto text-cyan-300" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-medium mb-2 text-cyan-300">
              关键词提取
            </h4>
            <div className="flex flex-wrap gap-2">
              {extractKeywords().map((keyword, index) => (
                <span
                  key={index}
                  className="bg-gray-700 text-sm px-2 py-1 rounded-md inline-block"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 处理部分 - 显示处理步骤和进度 */}
        <div className="col-span-1 bg-gray-800 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-cyan-300 border-b border-gray-700 pb-2">
            处理流程
          </h3>

          <div className="space-y-6">
            {preprocessingSteps.map((step, index) => (
              <div key={index} className="relative">
                <div
                  className={`
                  flex items-center p-3 rounded-md
                  ${
                    preprocessingStep === index
                      ? "bg-cyan-900 text-cyan-300"
                      : preprocessingStep > index
                      ? "bg-green-900 text-green-300"
                      : "bg-gray-700"
                  }
                `}
                >
                  <div className="mr-3">
                    {preprocessingStep > index ? (
                      <CheckCircleOutlined className="text-green-400 text-lg" />
                    ) : preprocessingStep === index ? (
                      step.icon
                    ) : (
                      <ClockCircleOutlined className="text-gray-400 text-lg" />
                    )}
                  </div>
                  <span
                    className={`${
                      step.name === "智能分类" ? "whitespace-nowrap" : ""
                    }`}
                  >
                    {step.name}
                  </span>

                  {preprocessingStep === index && (
                    <span className="ml-auto text-cyan-300">
                      {preprocessingProgress}%
                    </span>
                  )}

                  {preprocessingStep > index && (
                    <CheckOutlined className="ml-auto text-green-400" />
                  )}
                </div>

                {/* 连接线 */}
                {index < preprocessingSteps.length - 1 && (
                  <div className="h-6 w-0.5 bg-gray-600 ml-4 my-1"></div>
                )}
              </div>
            ))}
          </div>

          {/* 总进度条 */}
          <div className="mt-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm">总进度</span>
              <span className="text-sm text-cyan-300">
                {preprocessingProgress}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-cyan-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${preprocessingProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 输出部分 - 分类结果与评估指标 */}
        <div className="col-span-1 bg-gray-800 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-cyan-300 border-b border-gray-700 pb-2">
            分类结果
          </h3>

          <div className="space-y-3 mb-6">
            {Object.entries(categoryStats).map(([category, count]) => (
              <div
                key={category}
                className="bg-gray-700 p-3 rounded-md flex items-center justify-between"
              >
                <div className="flex items-center">
                  {getCategoryIcon(category)}
                  <span className="ml-2">{category}</span>
                </div>
                <span className="bg-gray-600 px-2 py-1 rounded-md text-sm">
                  {count} 文档
                </span>
              </div>
            ))}
          </div>

          {/* 评估指标 */}
          <h4 className="text-lg font-medium mb-2 text-cyan-300">性能指标</h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(metrics).map(([key, value]) => (
              <div
                key={key}
                className="bg-gray-700 p-3 rounded-md flex flex-col"
              >
                <span className="text-sm text-gray-300 whitespace-nowrap">
                  {resultCardLabelMap[key]}
                </span>
                <span className="text-xl font-bold text-cyan-300 mt-1">
                  {(value * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>

          {/* 混淆矩阵 */}
          <h4 className="text-lg font-medium my-3 text-cyan-300">混淆矩阵</h4>
          <div
            ref={chartRef}
            className="w-full h-60 mt-2 bg-gray-700 rounded-md"
          ></div>
        </div>
      </div>
    </div>
  )
}

export default DataAnalysisModal
