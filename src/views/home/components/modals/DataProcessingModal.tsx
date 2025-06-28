import React, { useState, useEffect, useCallback } from "react"
import { Empty, message } from "antd"
import EChart from "../../../../components/EChart"
import { EChartsOption } from "echarts"
import { dataProcessingModalApi } from "../../../../api/dataProcessingModal"

interface DataProcessingModalProps {
  themeColor?: string
  secondaryColor?: string
}

// 使用API中定义的类型
type PaperData = API.DataProcessing.PaperData
type FormulaData = API.DataProcessing.FormulaData
type TrashData = API.DataProcessing.TrashData
type DataItem = API.DataProcessing.DataItem

const DataProcessingModal: React.FC<DataProcessingModalProps> = ({
  themeColor = "#ffaa00",
  secondaryColor = "#cc8800",
}) => {
  // 状态定义
  const [validPapers, setValidPapers] = useState<PaperData[]>([])
  const [formulaImages, setFormulaImages] = useState<FormulaData[]>([])
  const [trashData, setTrashData] = useState<TrashData[]>([])
  const [currentTab, setCurrentTab] = useState<string>("valid")
  const [currentFilter, setCurrentFilter] = useState<string>("all")
  const [processSpeed, setProcessSpeed] = useState<number>(0)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [chartData, setChartData] = useState<number[]>(Array(24).fill(0))

  // 加载状态
  const [statsLoading, setStatsLoading] = useState<boolean>(false)
  const [papersLoading, setPapersLoading] = useState<boolean>(false)
  const [formulasLoading, setFormulasLoading] = useState<boolean>(false)
  const [trashLoading, setTrashLoading] = useState<boolean>(false)

  // API调用函数
  const fetchRealTimeStats = useCallback(async () => {
    try {
      setStatsLoading(true)
      const response = await dataProcessingModalApi.getRealTimeStats()
      const stats = response.data
      setProcessSpeed(stats.processSpeed)
      setTotalCount(stats.totalCount)
    } catch (error) {
      console.error("获取实时统计数据失败:", error)
      message.error("获取实时统计数据失败")
    } finally {
      setStatsLoading(false)
    }
  }, [])

  const fetchTrendData = useCallback(async () => {
    try {
      const response = await dataProcessingModalApi.getTrendData()
      const trendData = response.data
      setChartData(trendData.hourlyData)
    } catch (error) {
      console.error("获取趋势数据失败:", error)
      message.error("获取趋势数据失败")
    }
  }, [])

  const fetchValidPapers = useCallback(
    async (page: number = 1, pageSize: number = 10) => {
      try {
        setPapersLoading(true)
        const response = await dataProcessingModalApi.getValidPapers({
          page,
          pageSize,
          sortBy: "timestamp",
          sortOrder: "desc",
        })
        const papers = response.data
        setValidPapers(papers.data)
      } catch (error) {
        console.error("获取有效论文列表失败:", error)
        message.error("获取有效论文列表失败")
      } finally {
        setPapersLoading(false)
      }
    },
    []
  )

  const fetchFormulaImages = useCallback(
    async (page: number = 1, pageSize: number = 20) => {
      try {
        setFormulasLoading(true)
        const response = await dataProcessingModalApi.getFormulaImages({
          page,
          pageSize,
          type: "formula",
        })
        const formulas = response?.data
        setFormulaImages(formulas?.data ?? [])
      } catch (error) {
        console.error("获取公式图片列表失败:", error)
        message.error("获取公式图片列表失败")
      } finally {
        setFormulasLoading(false)
      }
    },
    []
  )

  const fetchTrashData = useCallback(
    async (page: number = 1, pageSize: number = 10) => {
      try {
        setTrashLoading(true)
        const response = await dataProcessingModalApi.getTrashData({
          page,
          pageSize,
          type: "trash",
        })
        const trashData = response.data
        setTrashData(trashData?.data ?? [])
        // setTrashPagination({
        //   page: trashData.page,
        //   pageSize: trashData.pageSize,
        //   total: trashData.total,
        // })
      } catch (error) {
        console.error("获取垃圾数据列表失败:", error)
        message.error("获取垃圾数据列表失败")
      } finally {
        setTrashLoading(false)
      }
    },
    []
  )

  // 渐变色生成函数
  const createGradient = (
    color: string,
    opacity1: number = 0.7,
    opacity2: number = 0.1
  ) => {
    return {
      type: "linear" as const,
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        {
          offset: 0,
          color: color
            ? `${color}${Math.floor(opacity1 * 255)
                .toString(16)
                .padStart(2, "0")}`
            : "rgba(24, 144, 255, 0.7)", // 顶部颜色
        },
        {
          offset: 1,
          color: color
            ? `${color}${Math.floor(opacity2 * 255)
                .toString(16)
                .padStart(2, "0")}`
            : "rgba(24, 144, 255, 0.1)", // 底部颜色
        },
      ],
    }
  }

  // ECharts 趋势图配置
  const getTrendChartOption = useCallback((): EChartsOption => {
    return {
      tooltip: {
        trigger: "axis",
        formatter: "{b}: {c} 篇",
      },
      grid: {
        top: "15%",
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: Array.from({ length: 24 }, (_, i) => `${i}:00`),
        axisLine: {
          lineStyle: {
            color: `${secondaryColor}40`,
          },
        },
        axisLabel: {
          color: `${secondaryColor}CC`,
          fontSize: 10,
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
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
        axisLabel: {
          color: `${secondaryColor}CC`,
          fontSize: 10,
        },
      },
      series: [
        {
          name: "处理数量",
          type: "line",
          smooth: true,
          symbol: "none",
          lineStyle: {
            width: 3,
            color: themeColor,
          },
          areaStyle: {
            color: createGradient(themeColor),
          },
          emphasis: {
            focus: "series",
            itemStyle: {
              color: themeColor,
            },
          },
          data: chartData,
        },
      ],
      backgroundColor: "transparent",
    }
  }, [themeColor, secondaryColor, chartData])

  // 清空垃圾箱
  const clearTrash = useCallback(async () => {
    if (window.confirm("确定要清空垃圾箱吗？此操作不可恢复。")) {
      try {
        setTrashLoading(true)
        const response = await dataProcessingModalApi.clearTrash()
        if (response.data.success) {
          setTrashData([])
          // setTrashPagination((prev) => ({ ...prev, total: 0 }))
          message.success("垃圾箱已清空")
        } else {
          message.error(response.data.message || "清空垃圾箱失败")
        }
      } catch (error) {
        console.error("清空垃圾箱失败:", error)
        message.error("清空垃圾箱失败")
      } finally {
        setTrashLoading(false)
      }
    }
  }, [])

  // 下载论文
  const handleDownloadPaper = useCallback(async (paperId: string) => {
    try {
      // 创建下载链接并触发下载
      const downloadUrl = `/api/processing/papers/${paperId}/download?format=pdf`

      // 创建一个临时的 a 标签来触发下载
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = `paper_${paperId}.pdf`
      link.style.display = "none"

      // 添加到 DOM，点击，然后移除
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      message.success("论文下载已开始")
    } catch (error) {
      console.error("论文下载失败:", error)
      message.error("论文下载失败")
    }
  }, [])

  // 初始化数据
  useEffect(() => {
    const initializeData = async () => {
      try {
        // 并行获取初始数据
        await Promise.all([
          fetchRealTimeStats(),
          fetchTrendData(),
          fetchValidPapers(1, 10),
          fetchFormulaImages(1, 20),
          fetchTrashData(1, 10),
        ])
      } catch (error) {
        console.error("初始化数据失败:", error)
      }
    }

    initializeData()
  }, [
    fetchRealTimeStats,
    fetchTrendData,
    fetchValidPapers,
    fetchFormulaImages,
    fetchTrashData,
  ])

  // 定时更新实时数据
  useEffect(() => {
    const updateRealTimeData = () => {
      fetchRealTimeStats()
      fetchTrendData()
    }

    // 每5秒更新一次实时数据
    const intervalId = setInterval(updateRealTimeData, 5000)

    return () => clearInterval(intervalId)
  }, [fetchRealTimeStats, fetchTrendData])

  // 过滤显示结果
  const filteredResults = useCallback(() => {
    const results: DataItem[] = []

    if (currentFilter === "all" || currentFilter === "valid") {
      results.push(...validPapers)
    }
    if (currentFilter === "all" || currentFilter === "formula") {
      results.push(...formulaImages)
    }
    if (currentFilter === "all" || currentFilter === "trash") {
      results.push(...trashData)
    }

    // 按时间排序，最新的在前面
    return results.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  }, [currentFilter, validPapers, formulaImages, trashData])

  return (
    <div className="w-full h-full bg-[rgba(0,21,41,0.8)] text-white p-4 overflow-auto">
      {/* <header className="mb-6 pb-4 border-b border-[rgba(32,128,192,0.5)]">
        <h1 className="text-2xl font-bold" style={{color: themeColor}}>论文数据处理系统</h1>
      </header> */}

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-1 bg-[rgba(0,21,41,0.6)] rounded-md p-4 shadow-lg border border-[rgba(32,128,192,0.6)]">
          <h2
            className="text-lg font-semibold mb-3"
            style={{ color: themeColor }}
          >
            实时数据统计
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[rgba(0,21,41,0.8)] rounded p-3 text-center border border-[rgba(32,128,192,0.4)]">
              <div className="text-sm text-gray-400">处理速度</div>
              <div className="text-2xl font-bold" style={{ color: themeColor }}>
                {processSpeed}
              </div>
              <div className="text-xs text-gray-400">篇/秒</div>
            </div>
            <div className="bg-[rgba(0,21,41,0.8)] rounded p-3 text-center border border-[rgba(32,128,192,0.4)]">
              <div className="text-sm text-gray-400">总论文量</div>
              <div className="text-2xl font-bold" style={{ color: themeColor }}>
                {totalCount}
              </div>
              <div className="text-xs text-gray-400">篇</div>
            </div>
          </div>
        </div>

        <div className="col-span-2 bg-[rgba(0,21,41,0.6)] rounded-md p-4 shadow-lg border border-[rgba(32,128,192,0.6)]">
          <h2
            className="text-lg font-semibold mb-3"
            style={{ color: themeColor }}
          >
            24小时处理趋势
          </h2>
          <div className="h-40">
            <EChart
              option={getTrendChartOption()}
              height="100%"
              width="100%"
              autoResize={true}
            />
          </div>
        </div>
      </div>

      <div className="bg-[rgba(0,21,41,0.6)] rounded-md mb-6 overflow-hidden shadow-lg border border-[rgba(32,128,192,0.6)]">
        <div className="flex border-b border-[rgba(32,128,192,0.5)]">
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              currentTab === "valid"
                ? "border-b-2 text-white"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setCurrentTab("valid")}
            style={
              currentTab === "valid"
                ? { borderColor: themeColor, color: themeColor }
                : {}
            }
          >
            可用论文
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              currentTab === "formula"
                ? "border-b-2 text-white"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setCurrentTab("formula")}
            style={
              currentTab === "formula"
                ? { borderColor: themeColor, color: themeColor }
                : {}
            }
          >
            公式图片
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              currentTab === "trash"
                ? "border-b-2 text-white"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setCurrentTab("trash")}
            style={
              currentTab === "trash"
                ? { borderColor: themeColor, color: themeColor }
                : {}
            }
          >
            垃圾数据
          </button>
        </div>

        <div className="p-4">
          {currentTab === "valid" && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2
                  className="text-lg font-semibold"
                  style={{ color: themeColor }}
                >
                  可用论文数据
                </h2>
                <div>
                  <span
                    className="px-2 py-1 text-xs rounded"
                    style={{
                      backgroundColor: `${themeColor}30`,
                      color: themeColor,
                    }}
                  >
                    {validPapers.length} 篇
                  </span>
                </div>
              </div>

              {validPapers.length > 0 ? (
                <div className="space-y-3">
                  {validPapers.map((paper, index) => (
                    <div
                      key={index}
                      className="bg-[rgba(0,21,41,0.8)] rounded p-3 flex gap-3 border border-[rgba(32,128,192,0.4)] hover:border-[rgba(32,128,192,0.8)] transition"
                      style={{
                        animation: `fadeIn 0.3s ease-in-out forwards ${
                          index * 0.1
                        }s`,
                      }}
                    >
                      <div className="flex-grow">
                        <div className="flex justify-between mb-2">
                          <h3 className="font-medium">{paper.title}</h3>
                          <span className="text-xs text-gray-400">
                            {paper.source}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 mb-2">
                          <div>
                            <span className="text-xs text-gray-400">
                              发布时间
                            </span>
                            <div className="text-sm">{paper.timestamp}</div>
                          </div>
                          <div>
                            <span className="text-xs text-gray-400">
                              字数统计
                            </span>
                            <div className="text-sm">
                              {paper.wordCount.toLocaleString()} 字
                            </div>
                          </div>
                          <div>
                            <span className="text-xs text-gray-400">
                              图片数量
                            </span>
                            <div className="text-sm">{paper.imageCount} 张</div>
                          </div>
                          <div>
                            <span className="text-xs text-gray-400">
                              公式数量
                            </span>
                            <div className="text-sm">
                              {paper.formulaCount} 个
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">
                          {paper.abstract}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {paper.topics.map((topic, tIndex) => (
                            <span
                              key={tIndex}
                              className="px-2 py-0.5 text-xs rounded"
                              style={{
                                backgroundColor: `${themeColor}20`,
                                color: themeColor,
                                border: `1px solid ${themeColor}40`,
                              }}
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="w-28 flex flex-col items-center">
                        <div className="w-full h-28 bg-[rgba(0,21,41,0.9)] rounded mb-2 flex items-center justify-center border border-[rgba(32,128,192,0.4)]">
                          {paper.image ? (
                            <img
                              src={paper.image}
                              alt="预览图"
                              className="max-w-full max-h-full"
                            />
                          ) : (
                            <span className="text-xs text-gray-500">
                              暂无预览
                            </span>
                          )}
                        </div>
                        <div className="flex w-full gap-2">
                          <button
                            className="flex-1 px-2 py-1 text-xs rounded"
                            style={{
                              backgroundColor: themeColor,
                              color: "white",
                            }}
                          >
                            查看
                          </button>
                          <button
                            className="flex-1 px-2 py-1 bg-[rgba(32,128,192,0.4)] text-white text-xs rounded hover:bg-[rgba(32,128,192,0.6)]"
                            onClick={() =>
                              paper.id && handleDownloadPaper(paper.id)
                            }
                          >
                            下载
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <span className="text-gray-400">暂无可用论文数据</span>
                  }
                />
              )}
            </>
          )}

          {currentTab === "formula" && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2
                  className="text-lg font-semibold"
                  style={{ color: themeColor }}
                >
                  公式图片
                </h2>
                <div>
                  <span
                    className="px-2 py-1 text-xs rounded"
                    style={{
                      backgroundColor: `${themeColor}30`,
                      color: themeColor,
                    }}
                  >
                    {formulaImages.length} 个
                  </span>
                </div>
              </div>

              {formulaImages.length > 0 ? (
                <div className="grid grid-cols-4 gap-3">
                  {formulaImages.map((formula, index) => (
                    <div
                      key={index}
                      className="bg-[rgba(0,21,41,0.8)] rounded overflow-hidden border border-[rgba(32,128,192,0.4)] hover:border-[rgba(32,128,192,0.8)] transition"
                    >
                      <div className="aspect-square bg-[rgba(0,21,41,0.9)] p-2 flex items-center justify-center">
                        <img
                          src={formula.image}
                          alt="公式图片"
                          className="max-h-full max-w-full"
                        />
                      </div>
                      <div className="p-2">
                        <h3 className="font-medium text-sm">{formula.title}</h3>
                        <p className="text-xs text-gray-400 mt-1">
                          来自：{formula.paperTitle}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <span className="text-gray-400">暂无公式图片</span>
                  }
                />
              )}
            </>
          )}

          {currentTab === "trash" && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2
                  className="text-lg font-semibold"
                  style={{ color: themeColor }}
                >
                  垃圾数据
                </h2>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 text-xs bg-red-900 text-red-300 rounded border border-red-700">
                    {trashData.length} 项
                  </span>

                  <button
                    className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                    onClick={clearTrash}
                  >
                    清空垃圾箱
                  </button>
                </div>
              </div>

              {trashData.length > 0 ? (
                <div className="space-y-2">
                  {trashData.map((item, index) => (
                    <div
                      key={index}
                      className="bg-[rgba(0,21,41,0.8)] rounded p-3 border border-[rgba(32,128,192,0.4)]"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{item.title}</h3>
                          <div className="flex gap-2 text-xs text-gray-400 mt-1">
                            <span>{item.timestamp}</span>
                            <span>原因：{item.reason}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <span className="text-gray-400">垃圾箱为空</span>
                  }
                />
              )}
            </>
          )}
        </div>
      </div>

      <div className="bg-[rgba(0,21,41,0.6)] rounded-md shadow-lg border border-[rgba(32,128,192,0.6)]">
        <div className="flex justify-between items-center p-4 border-b border-[rgba(32,128,192,0.5)]">
          <h2 className="text-lg font-semibold" style={{ color: themeColor }}>
            实时处理结果
          </h2>
          <div className="flex items-center gap-2">
            <button
              className={`px-3 py-1 text-xs rounded transition-colors ${
                currentFilter === "all"
                  ? "text-white"
                  : "bg-[rgba(0,21,41,0.9)] text-gray-400 hover:text-white"
              }`}
              onClick={() => setCurrentFilter("all")}
              style={
                currentFilter === "all" ? { backgroundColor: themeColor } : {}
              }
            >
              全部
            </button>
            <button
              className={`px-3 py-1 text-xs rounded transition-colors ${
                currentFilter === "valid"
                  ? "text-white"
                  : "bg-[rgba(0,21,41,0.9)] text-gray-400 hover:text-white"
              }`}
              onClick={() => setCurrentFilter("valid")}
              style={
                currentFilter === "valid" ? { backgroundColor: themeColor } : {}
              }
            >
              可用
            </button>
            <button
              className={`px-3 py-1 text-xs rounded transition-colors ${
                currentFilter === "formula"
                  ? "text-white"
                  : "bg-[rgba(0,21,41,0.9)] text-gray-400 hover:text-white"
              }`}
              onClick={() => setCurrentFilter("formula")}
              style={
                currentFilter === "formula"
                  ? { backgroundColor: themeColor }
                  : {}
              }
            >
              公式
            </button>
            <button
              className={`px-3 py-1 text-xs rounded transition-colors ${
                currentFilter === "trash"
                  ? "text-white"
                  : "bg-[rgba(0,21,41,0.9)] text-gray-400 hover:text-white"
              }`}
              onClick={() => setCurrentFilter("trash")}
              style={
                currentFilter === "trash" ? { backgroundColor: themeColor } : {}
              }
            >
              垃圾
            </button>
          </div>
        </div>

        <div className="p-4 max-h-60 overflow-y-auto">
          {filteredResults().length > 0 ? (
            <div className="space-y-2">
              {filteredResults().map((item, index) => (
                <div
                  key={index}
                  className="bg-[rgba(0,21,41,0.8)] rounded p-3 flex justify-between items-center border border-[rgba(32,128,192,0.4)]"
                >
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-gray-400 flex gap-2">
                      <span>{item.timestamp}</span>
                      {"size" in item && <span>{item.size}KB</span>}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      item.type === "valid"
                        ? "bg-green-900 text-green-300 border border-green-700"
                        : item.type === "formula"
                        ? "bg-blue-900 text-blue-300 border border-blue-700"
                        : "bg-red-900 text-red-300 border border-red-700"
                    }`}
                  >
                    {item.type === "valid"
                      ? "可用"
                      : item.type === "formula"
                      ? "公式"
                      : "垃圾"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<span className="text-gray-400">暂无处理结果</span>}
            />
          )}
        </div>
      </div>

      <style>{`
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

export default DataProcessingModal
