import React, { useState, useEffect, useCallback, useRef } from "react"
import { Empty } from "antd"
import * as echarts from "echarts"
import EChart from "../../../../components/EChart"
import { EChartsOption } from "echarts"

interface DataProcessingModalProps {
  themeColor?: string
  secondaryColor?: string
}

// 论文来源列表
const sources = [
  'arXiv',
  'IEEE Xplore',
  'ScienceDirect',
  'Springer',
  'ACM Digital Library'
]

// 论文主题标签
const topics = [
  '机器学习',
  '深度学习',
  '计算机视觉',
  '自然语言处理',
  '数据挖掘',
  '人工智能',
  '神经网络',
  '强化学习'
]

// 数据接口定义
interface PaperData {
  title: string
  abstract: string
  source: string
  authors: string[]
  timestamp: string
  wordCount: number
  imageCount: number
  formulaCount: number
  topics: string[]
  type: 'valid'
  size: number
  image?: string
}

interface FormulaData {
  title: string
  paperTitle: string
  image: string
  timestamp: string
  type: 'formula'
  size: number
}

interface TrashData {
  title: string
  content: string
  timestamp: string
  type: 'trash'
  reason: string
}

type DataItem = PaperData | FormulaData | TrashData

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
  const chartInstanceRef = useRef<echarts.ECharts | null>(null)
  const chartContainerRef = useRef<HTMLDivElement>(null)

  // CSS变量
  const cssVars = {
    "--bg-primary": "#0d1117",
    "--bg-secondary": "#161b22",
    "--text-primary": "#c9d1d9",
    "--text-secondary": "#8b949e",
    "--accent-blue": "#58a6ff",
    "--accent-green": "#3fb950",
    "--accent-red": "#f85149",
    "--border-color": "#30363d",
    "--shadow-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.5)",
    "--shadow-md": "0 4px 6px -1px rgba(0, 0, 0, 0.5)",
    "--gradient-blue": "linear-gradient(135deg, #0d1117, #161b22)",
  } as React.CSSProperties

  // 渐变色生成函数
  const createGradient = (color: string, opacity1: number = 0.7, opacity2: number = 0.1) => {
    return {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        {
          offset: 0,
          color: color ? `${color}${Math.floor(opacity1 * 255).toString(16)}` : 'rgba(24, 144, 255, 0.7)', // 顶部颜色
        },
        {
          offset: 1,
          color: color ? `${color}${Math.floor(opacity2 * 255).toString(16)}` : 'rgba(24, 144, 255, 0.1)', // 底部颜色
        },
      ],
    }
  }

  // ECharts 趋势图配置
  const getTrendChartOption = useCallback((): EChartsOption => {
    return {
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c} 篇',
      },
      grid: {
        top: '15%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
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
        type: 'value',
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
          name: '处理数量',
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: 3,
            color: themeColor,
          },
          areaStyle: {
            color: createGradient(themeColor),
          },
          emphasis: {
            focus: 'series',
            itemStyle: {
              color: themeColor,
            },
          },
          data: chartData,
        },
      ],
      backgroundColor: 'transparent',
    }
  }, [themeColor, secondaryColor, chartData])

  // 模拟数据生成函数
  const generateMockPaper = useCallback(() => {
    const wordCount = Math.floor(Math.random() * 5000) + 2000
    const imageCount = Math.floor(Math.random() * 10) + 1
    const formulaCount = Math.floor(Math.random() * 15) + 1
    const size = Math.floor(Math.random() * 1000) + 500
    
    // 随机选择2-4个主题标签
    const paperTopics = [...topics]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 3) + 2)
    
    return {
      title: `基于深度学习的${topics[Math.floor(Math.random() * topics.length)]}研究`,
      abstract: '本文提出了一种新的方法来解决在实际应用中常见的问题。通过实验证明，该方法在多个数据集上都取得了良好的效果。实验结果表明，与现有方法相比，本文提出的方法在准确率和效率上都有显著提升。',
      content: '模拟论文内容'.repeat(100),
      source: sources[Math.floor(Math.random() * sources.length)],
      authors: ['作者A', '作者B', '作者C'],
      wordCount,
      imageCount,
      formulaCount,
      topics: paperTopics,
      size,
      image: Math.random() > 0.5 ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' : undefined
    }
  }, [])

  // 判断数据分类的工具函数
  const isValidPaper = useCallback((data: any): boolean => {
    // 判断是否为有效论文
    return data.content && data.content.length > 100 && !isTrash(data)
  }, [])

  const hasFormulaImage = useCallback((data: any): boolean => {
    // 判断是否包含公式图片
    return data.image && data.image.includes('formula')
  }, [])

  const isTrash = useCallback((data: any): boolean => {
    // 判断是否为垃圾数据
    return !data.content || data.content.length < 100
  }, [])

  const getTrashReason = useCallback((data: any): string => {
    if (!data.content) return '空内容'
    if (data.content.length < 100) return '内容过短'
    return '无效数据'
  }, [])

  // 处理数据的函数
  const processData = useCallback((data: any) => {
    if (isValidPaper(data)) {
      setValidPapers(prev => [...prev, {
        title: data.title,
        abstract: data.abstract,
        source: data.source,
        authors: data.authors,
        timestamp: new Date().toLocaleString(),
        wordCount: data.wordCount,
        imageCount: data.imageCount,
        formulaCount: data.formulaCount,
        topics: data.topics,
        type: 'valid',
        size: data.size
      }])
    } else if (hasFormulaImage(data)) {
      setFormulaImages(prev => [...prev, {
        title: `公式图片 ${prev.length + 1}`,
        paperTitle: data.title,
        image: data.image,
        timestamp: new Date().toLocaleString(),
        type: 'formula',
        size: data.size
      }])
    } else {
      setTrashData(prev => [...prev, {
        title: data.title,
        content: data.content,
        timestamp: new Date().toLocaleString(),
        type: 'trash',
        reason: getTrashReason(data)
      }])
    }
  }, [isValidPaper, hasFormulaImage, getTrashReason])

  // 清空垃圾箱
  const clearTrash = useCallback(() => {
    if (window.confirm('确定要清空垃圾箱吗？此操作不可恢复。')) {
      setTrashData([])
    }
  }, [])

  // 模拟数据更新
  useEffect(() => {
    const updateStats = () => {
      // 更新处理速度
      const speed = Math.floor(Math.random() * 5)
      setProcessSpeed(speed)
  
      // 更新总数据量
      setTotalCount(prev => prev + speed)
  
      // 更新图表数据
      const currentHour = new Date().getHours()
      setChartData(prevData => {
        const newData = [...prevData]
        newData[currentHour] += speed
        return newData
      })
  
      if (speed > 0) {
        for (let i = 0; i < speed; i++) {
          processData(generateMockPaper())
        }
      }
    }

    // 启动定时更新
    const intervalId = setInterval(updateStats, 1000)
    
    return () => clearInterval(intervalId)
  }, [processData, generateMockPaper])

  // 过滤显示结果
  const filteredResults = useCallback(() => {
    const results: DataItem[] = []
    
    if (currentFilter === 'all' || currentFilter === 'valid') {
      results.push(...validPapers)
    }
    if (currentFilter === 'all' || currentFilter === 'formula') {
      results.push(...formulaImages)
    }
    if (currentFilter === 'all' || currentFilter === 'trash') {
      results.push(...trashData)
    }
    
    // 按时间排序，最新的在前面
    return results.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  }, [currentFilter, validPapers, formulaImages, trashData])

  return (
    <div className="w-full h-full bg-[rgba(0,21,41,0.8)] text-white p-4 overflow-auto">
      <header className="mb-6 pb-4 border-b border-[rgba(32,128,192,0.5)]">
        <h1 className="text-2xl font-bold" style={{color: themeColor}}>论文数据处理系统</h1>
      </header>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-1 bg-[rgba(0,21,41,0.6)] rounded-md p-4 shadow-lg border border-[rgba(32,128,192,0.6)]">
          <h2 className="text-lg font-semibold mb-3" style={{color: themeColor}}>实时数据统计</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[rgba(0,21,41,0.8)] rounded p-3 text-center border border-[rgba(32,128,192,0.4)]">
              <div className="text-sm text-gray-400">处理速度</div>
              <div className="text-2xl font-bold" style={{color: themeColor}}>{processSpeed}</div>
              <div className="text-xs text-gray-400">篇/秒</div>
            </div>
            <div className="bg-[rgba(0,21,41,0.8)] rounded p-3 text-center border border-[rgba(32,128,192,0.4)]">
              <div className="text-sm text-gray-400">总论文量</div>
              <div className="text-2xl font-bold" style={{color: themeColor}}>{totalCount}</div>
              <div className="text-xs text-gray-400">篇</div>
            </div>
          </div>
        </div>
        
        <div className="col-span-2 bg-[rgba(0,21,41,0.6)] rounded-md p-4 shadow-lg border border-[rgba(32,128,192,0.6)]">
          <h2 className="text-lg font-semibold mb-3" style={{color: themeColor}}>24小时处理趋势</h2>
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
              currentTab === 'valid' ? 'border-b-2 text-white' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setCurrentTab('valid')}
            style={currentTab === 'valid' ? {borderColor: themeColor, color: themeColor} : {}}
          >
            可用论文
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              currentTab === 'formula' ? 'border-b-2 text-white' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setCurrentTab('formula')}
            style={currentTab === 'formula' ? {borderColor: themeColor, color: themeColor} : {}}
          >
            公式图片
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              currentTab === 'trash' ? 'border-b-2 text-white' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setCurrentTab('trash')}
            style={currentTab === 'trash' ? {borderColor: themeColor, color: themeColor} : {}}
          >
            垃圾数据
          </button>
        </div>
        
        <div className="p-4">
          {currentTab === 'valid' && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold" style={{color: themeColor}}>可用论文数据</h2>
                <div>
                  <span className="px-2 py-1 text-xs rounded" style={{backgroundColor: `${themeColor}30`, color: themeColor}}>
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
                      style={{animation: `fadeIn 0.3s ease-in-out forwards ${index * 0.1}s`}}
                    >
                      <div className="flex-grow">
                        <div className="flex justify-between mb-2">
                          <h3 className="font-medium">{paper.title}</h3>
                          <span className="text-xs text-gray-400">{paper.source}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 mb-2">
                          <div>
                            <span className="text-xs text-gray-400">发布时间</span>
                            <div className="text-sm">{paper.timestamp}</div>
                          </div>
                          <div>
                            <span className="text-xs text-gray-400">字数统计</span>
                            <div className="text-sm">{paper.wordCount.toLocaleString()} 字</div>
                          </div>
                          <div>
                            <span className="text-xs text-gray-400">图片数量</span>
                            <div className="text-sm">{paper.imageCount} 张</div>
                          </div>
                          <div>
                            <span className="text-xs text-gray-400">公式数量</span>
                            <div className="text-sm">{paper.formulaCount} 个</div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{paper.abstract}</p>
                        <div className="flex flex-wrap gap-1">
                          {paper.topics.map((topic, tIndex) => (
                            <span 
                              key={tIndex} 
                              className="px-2 py-0.5 text-xs rounded" 
                              style={{
                                backgroundColor: `${themeColor}20`, 
                                color: themeColor,
                                border: `1px solid ${themeColor}40`
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
                            <img src={paper.image} alt="预览图" className="max-w-full max-h-full" />
                          ) : (
                            <span className="text-xs text-gray-500">暂无预览</span>
                          )}
                        </div>
                        <div className="flex w-full gap-2">
                          <button 
                            className="flex-1 px-2 py-1 text-xs rounded" 
                            style={{backgroundColor: themeColor, color: 'white'}}
                          >
                            查看
                          </button>
                          <button className="flex-1 px-2 py-1 bg-[rgba(32,128,192,0.4)] text-white text-xs rounded hover:bg-[rgba(32,128,192,0.6)]">
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
                  description={<span className="text-gray-400">暂无可用论文数据</span>}
                />
              )}
            </>
          )}
          
          {currentTab === 'formula' && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold" style={{color: themeColor}}>公式图片</h2>
                <div>
                  <span className="px-2 py-1 text-xs rounded" style={{backgroundColor: `${themeColor}30`, color: themeColor}}>
                    {formulaImages.length} 个
                  </span>
                </div>
              </div>
              
              {formulaImages.length > 0 ? (
                <div className="grid grid-cols-4 gap-3">
                  {formulaImages.map((formula, index) => (
                    <div key={index} className="bg-[rgba(0,21,41,0.8)] rounded overflow-hidden border border-[rgba(32,128,192,0.4)] hover:border-[rgba(32,128,192,0.8)] transition">
                      <div className="aspect-square bg-[rgba(0,21,41,0.9)] p-2 flex items-center justify-center">
                        <img src={formula.image} alt="公式图片" className="max-h-full max-w-full" />
                      </div>
                      <div className="p-2">
                        <h3 className="font-medium text-sm">{formula.title}</h3>
                        <p className="text-xs text-gray-400 mt-1">来自：{formula.paperTitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={<span className="text-gray-400">暂无公式图片</span>}
                />
              )}
            </>
          )}
          
          {currentTab === 'trash' && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold" style={{color: themeColor}}>垃圾数据</h2>
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
                    <div key={index} className="bg-[rgba(0,21,41,0.8)] rounded p-3 border border-[rgba(32,128,192,0.4)]">
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
                  description={<span className="text-gray-400">垃圾箱为空</span>}
                />
              )}
            </>
          )}
        </div>
      </div>

      <div className="bg-[rgba(0,21,41,0.6)] rounded-md shadow-lg border border-[rgba(32,128,192,0.6)]">
        <div className="flex justify-between items-center p-4 border-b border-[rgba(32,128,192,0.5)]">
          <h2 className="text-lg font-semibold" style={{color: themeColor}}>实时处理结果</h2>
          <div className="flex items-center gap-2">
            <button 
              className={`px-3 py-1 text-xs rounded transition-colors ${
                currentFilter === 'all' ? 'text-white' : 'bg-[rgba(0,21,41,0.9)] text-gray-400 hover:text-white'
              }`}
              onClick={() => setCurrentFilter('all')}
              style={currentFilter === 'all' ? {backgroundColor: themeColor} : {}}
            >
              全部
            </button>
            <button 
              className={`px-3 py-1 text-xs rounded transition-colors ${
                currentFilter === 'valid' ? 'text-white' : 'bg-[rgba(0,21,41,0.9)] text-gray-400 hover:text-white'
              }`}
              onClick={() => setCurrentFilter('valid')}
              style={currentFilter === 'valid' ? {backgroundColor: themeColor} : {}}
            >
              可用
            </button>
            <button 
              className={`px-3 py-1 text-xs rounded transition-colors ${
                currentFilter === 'formula' ? 'text-white' : 'bg-[rgba(0,21,41,0.9)] text-gray-400 hover:text-white'
              }`}
              onClick={() => setCurrentFilter('formula')}
              style={currentFilter === 'formula' ? {backgroundColor: themeColor} : {}}
            >
              公式
            </button>
            <button 
              className={`px-3 py-1 text-xs rounded transition-colors ${
                currentFilter === 'trash' ? 'text-white' : 'bg-[rgba(0,21,41,0.9)] text-gray-400 hover:text-white'
              }`}
              onClick={() => setCurrentFilter('trash')}
              style={currentFilter === 'trash' ? {backgroundColor: themeColor} : {}}
            >
              垃圾
            </button>
          </div>
        </div>
        
        <div className="p-4 max-h-60 overflow-y-auto">
          {filteredResults().length > 0 ? (
            <div className="space-y-2">
              {filteredResults().map((item, index) => (
                <div key={index} className="bg-[rgba(0,21,41,0.8)] rounded p-3 flex justify-between items-center border border-[rgba(32,128,192,0.4)]">
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-gray-400 flex gap-2">
                      <span>{item.timestamp}</span>
                      {'size' in item && <span>{item.size}KB</span>}
                    </div>
                  </div>
                  <span 
                    className={`px-2 py-1 text-xs rounded ${
                      item.type === 'valid' ? 'bg-green-900 text-green-300 border border-green-700' : 
                      item.type === 'formula' ? 'bg-blue-900 text-blue-300 border border-blue-700' : 
                      'bg-red-900 text-red-300 border border-red-700'
                    }`}
                  >
                    {item.type === 'valid' ? '可用' : 
                     item.type === 'formula' ? '公式' : '垃圾'}
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
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default DataProcessingModal