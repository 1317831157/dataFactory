import React, { useState, useEffect, useRef, useCallback } from "react"
import { message } from "antd"
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
import { dataAnalysisModalApi } from "../../../../api/dataAnalysisModal"

// 定义组件的props类型
interface DataAnalysisModalProps {
  themeColor?: string
  secondaryColor?: string
}

const DataAnalysisModal: React.FC<DataAnalysisModalProps> = () => {
  // 数据源到目标的映射关系
  const [sourceToCategories, setSourceToCategories] = useState<
    Record<string, string[]>
  >({
    law: ["robot", "vision"],
    paper: ["microscope", "satellite"],
    report: ["agriculture", "landslide"],
    policy: ["robot", "agriculture"],
    book: ["star", "satellite"],
  })

  // 分类结果统计状态
  const [categoryStats, setCategoryStats] = useState<
    Record<
      string,
      {
        count: number
        confidence: number
        percentage?: number
        samples?: number
      }
    >
  >({
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

  // 任务状态
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // 加载状态
  const [loading, setLoading] = useState(false)
  const [keywordExtractionLoading, setKeywordExtractionLoading] =
    useState(false)
  const [preprocessingLoading, setPreprocessingLoading] = useState(false)
  const [classificationLoading, setClassificationLoading] = useState(false)

  // Refs
  const confusionMatrixRef = useRef<HTMLDivElement>(null)
  const flowIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const keywordIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const preprocessIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const classificationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // API调用函数
  const fetchSourceCategoryMapping = useCallback(async () => {
    try {
      const response = await dataAnalysisModalApi.getSourceCategoryMapping()
      setSourceToCategories(response.data)
    } catch (error) {
      console.error("获取数据源分类映射失败:", error)
      message.error("获取数据源分类映射失败")
    }
  }, [])

  const startKeywordExtraction = useCallback(async (sourceType: string) => {
    try {
      setKeywordExtractionLoading(true)
      const response = await dataAnalysisModalApi.startKeywordExtraction({
        sourceType,
        sampleSize: 1000,
      })

      const taskId = response.data.taskId
      setCurrentTaskId(taskId)

      // 开始轮询进度
      return await pollKeywordExtractionProgress(taskId)
    } catch (error) {
      console.error("启动关键词提取失败:", error)
      message.error("启动关键词提取失败")
      throw error
    } finally {
      setKeywordExtractionLoading(false)
    }
  }, [])

  const pollKeywordExtractionProgress = useCallback(async (taskId: string) => {
    return new Promise((resolve, reject) => {
      const pollInterval = setInterval(async () => {
        try {
          const response =
            await dataAnalysisModalApi.getKeywordExtractionProgress(taskId)
          const result = response.data

          // 更新进度显示
          setPreprocessProgress(result.progress)

          if (result.progress >= 100) {
            clearInterval(pollInterval)
            resolve(result)
          }
        } catch (error) {
          clearInterval(pollInterval)
          reject(error)
        }
      }, 500) // 每500ms检查一次进度

      keywordIntervalRef.current = pollInterval
    })
  }, [])

  const startPreprocessing = useCallback(async (sourceType: string) => {
    try {
      setPreprocessingLoading(true)
      const response = await dataAnalysisModalApi.startPreprocessing({
        sourceType,
        steps: ["数据清洗", "格式标准化", "特征提取"],
        parameters: {
          cleaningThreshold: 0.8,
          standardFormat: "json",
          featureCount: 100,
        },
      })

      const taskId = response.data.taskId
      setCurrentTaskId(taskId)

      return await pollPreprocessingProgress(taskId)
    } catch (error) {
      console.error("启动数据预处理失败:", error)
      message.error("启动数据预处理失败")
      throw error
    } finally {
      setPreprocessingLoading(false)
    }
  }, [])

  const pollPreprocessingProgress = useCallback(async (taskId: string) => {
    return new Promise((resolve, reject) => {
      const pollInterval = setInterval(async () => {
        try {
          const response = await dataAnalysisModalApi.getPreprocessingProgress(
            taskId
          )
          const result = response.data

          // 更新预处理步骤显示
          setPreprocessProgress(result.progress)
          setPreprocessSteps(
            result.steps
              .filter((step) => step.status === "completed")
              .map((step) => step.name)
          )

          if (result.status === "completed") {
            clearInterval(pollInterval)
            resolve(result)
          } else if (result.status === "failed") {
            clearInterval(pollInterval)
            reject(new Error("预处理失败"))
          }
        } catch (error) {
          clearInterval(pollInterval)
          reject(error)
        }
      }, 1000) // 每1秒检查一次进度

      preprocessIntervalRef.current = pollInterval
    })
  }, [])

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

  const startClassification = useCallback(async (sourceType: string) => {
    try {
      setClassificationLoading(true)
      const response = await dataAnalysisModalApi.startClassification({
        sourceType,
        parameters: {
          batchSize: 32,
          threshold: 0.8,
          enablePreprocessing: false, // 已经预处理过了
        },
      })

      const taskId = response.data.taskId
      setCurrentTaskId(taskId)

      return await pollClassificationProgress(taskId)
    } catch (error) {
      console.error("启动智能分类失败:", error)
      message.error("启动智能分类失败")
      throw error
    } finally {
      setClassificationLoading(false)
    }
  }, [])

  const pollClassificationProgress = useCallback(async (taskId: string) => {
    return new Promise((resolve, reject) => {
      const pollInterval = setInterval(async () => {
        try {
          const response = await dataAnalysisModalApi.getClassificationProgress(
            taskId
          )
          const task = response.data

          // 更新分类进度
          setIsProcessing(task.status === "classifying")

          if (task.metrics) {
            // 更新分类指标
            setMetrics({
              accuracy: task.metrics.accuracy,
              precision: task.metrics.precision,
              recall: task.metrics.recall,
            })
          }

          if (task.status === "completed") {
            clearInterval(pollInterval)
            resolve(task)
          } else if (task.status === "failed") {
            clearInterval(pollInterval)
            reject(new Error(task.error || "分类失败"))
          }
        } catch (error) {
          clearInterval(pollInterval)
          reject(error)
        }
      }, 100) // 每100ms检查一次进度，实现平滑的指标更新

      classificationIntervalRef.current = pollInterval
    })
  }, [])

  const fetchCategoryStats = useCallback(async (taskId: string) => {
    try {
      const response = await dataAnalysisModalApi.getCategoryStats(taskId)
      setCategoryStats(response.data)
    } catch (error) {
      console.error("获取分类结果统计失败:", error)
      message.error("获取分类结果统计失败")
    }
  }, [])

  const fetchConfusionMatrixData = useCallback(async (taskId: string) => {
    try {
      const response = await dataAnalysisModalApi.getConfusionMatrixData(taskId)
      return response.data
    } catch (error) {
      console.error("获取混淆矩阵数据失败:", error)
      message.error("获取混淆矩阵数据失败")
      throw error
    }
  }, [])

  // 初始化数据流动画
  useEffect(() => {
    const flowItems = document.querySelectorAll(".flow-item")
    let currentIndex = 0

    const highlightNext = () => {
      flowItems.forEach((item) => item.classList.remove("active"))
      if (flowItems[currentIndex]) {
        flowItems[currentIndex].classList.add("active")
      }
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

  // 初始化组件数据
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true)
        await fetchSourceCategoryMapping()
      } catch (error) {
        console.error("初始化数据失败:", error)
      } finally {
        setLoading(false)
      }
    }

    initializeData()
  }, [fetchSourceCategoryMapping])

  // 创建混淆矩阵图表
  const createConfusionMatrixChart = useCallback(
    (matrixData: API.DataAnalysis.ConfusionMatrixData) => {
      if (!confusionMatrixRef.current) return

      const chart = echarts.init(confusionMatrixRef.current)

      const option = {
        title: {
          text: "混淆矩阵",
          left: "center",
          textStyle: {
            color: "#c9d1d9",
            fontSize: 16,
          },
        },
        tooltip: {
          position: "top",
          formatter: function (params: any) {
            return `实际: ${matrixData.categories[params.data[1]]}<br/>预测: ${
              matrixData.categories[params.data[0]]
            }<br/>数量: ${params.data[2]}`
          },
        },
        grid: {
          height: "50%",
          top: "10%",
        },
        xAxis: {
          type: "category",
          data: matrixData.categories,
          splitArea: {
            show: true,
          },
          axisLabel: {
            color: "#c9d1d9",
          },
        },
        yAxis: {
          type: "category",
          data: matrixData.categories,
          splitArea: {
            show: true,
          },
          axisLabel: {
            color: "#c9d1d9",
          },
        },
        visualMap: {
          min: 0,
          max: Math.max(...matrixData.matrix.flat()),
          calculable: true,
          orient: "horizontal",
          left: "center",
          bottom: "15%",
          textStyle: {
            color: "#c9d1d9",
          },
        },
        series: [
          {
            name: "混淆矩阵",
            type: "heatmap",
            data: matrixData.matrix.flatMap((row, i) =>
              row.map((value, j) => [j, i, value])
            ),
            label: {
              show: true,
              color: "#c9d1d9",
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

      // 响应式处理
      const handleResize = () => chart.resize()
      window.addEventListener("resize", handleResize)

      return () => {
        window.removeEventListener("resize", handleResize)
        chart.dispose()
      }
    },
    []
  )

  // 处理卡片点击事件 - 完整的数据分析流程
  const handleCardClick = useCallback(
    async (source: string) => {
      try {
        console.log("开始分析数据源:", source)

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
        setIsProcessing(true)

        // 1. 开始关键词提取
        const keywordResult = await startKeywordExtraction(source)
        console.log("关键词提取完成:", keywordResult)

        // 2. 开始数据预处理
        const preprocessResult = await startPreprocessing(source)
        console.log("数据预处理完成:", preprocessResult)

        // 3. 开始智能分类
        const classificationResult = await startClassification(source)
        console.log("智能分类完成:", classificationResult)

        // 4. 获取最终结果
        if (currentTaskId) {
          const [confusionMatrix] = await Promise.all([
            fetchConfusionMatrixData(currentTaskId),
            fetchCategoryStats(currentTaskId),
          ])

          // 5. 创建混淆矩阵图表
          if (confusionMatrixRef.current && confusionMatrix) {
            createConfusionMatrixChart(confusionMatrix)
          }
        }

        setIsProcessing(false)
        message.success("数据分析完成")

        return {
          taskId: currentTaskId,
          metrics: classificationResult.metrics,
        }
      } catch (error) {
        console.error("数据分析流程失败:", error)
        setIsProcessing(false)
        message.error("数据分析失败，请重试")
      }
    },
    [
      startKeywordExtraction,
      startPreprocessing,
      startClassification,
      fetchConfusionMatrixData,
      fetchCategoryStats,
      currentTaskId,
      createConfusionMatrixChart,
    ]
  )

  // 清理函数
  useEffect(() => {
    return () => {
      // 清理所有定时器
      if (keywordIntervalRef.current) {
        clearInterval(keywordIntervalRef.current)
      }
      if (preprocessIntervalRef.current) {
        clearInterval(preprocessIntervalRef.current)
      }
      if (classificationIntervalRef.current) {
        clearInterval(classificationIntervalRef.current)
      }
    }
  }, [])

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
