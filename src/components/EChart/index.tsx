import React, { useEffect, useRef } from "react"
import * as echarts from "echarts"
import { EChartsOption, EChartsCoreOption } from "echarts"

interface EChartProps {
  /**
   * ECharts 配置项
   */
  option: EChartsOption
  /**
   * 容器样式类
   */
  className?: string
  /**
   * 图表高度
   */
  height?: string | number
  /**
   * 图表宽度
   */
  width?: string | number
  /**
   * 是否监听窗口变化自动调整大小
   */
  autoResize?: boolean
  /**
   * 额外的配置项
   */
  settings?: {
    notMerge?: boolean
    lazyUpdate?: boolean
  }
  /**
   * 图表加载状态
   */
  loading?: boolean
  /**
   * 图表点击事件
   */
  onChartClick?: (params: echarts.ECElementEvent) => void
}

/**
 * ECharts图表组件
 * 用于渲染各种Echarts图表
 */
const EChart: React.FC<EChartProps> = ({
  option,
  className = "",
  height = "100%",
  width = "100%",
  autoResize = true,
  settings = {},
  loading = false,
  onChartClick,
}) => {
  // 图表容器引用
  const chartRef = useRef<HTMLDivElement>(null)
  // 图表实例引用
  const chartInstance = useRef<echarts.ECharts | null>(null)

  // 初始化图表
  useEffect(() => {
    if (!chartRef.current) return

    // 初始化图表实例
    const chart = echarts.init(chartRef.current)
    chartInstance.current = chart

    // 设置点击事件
    if (onChartClick) {
      chart.on("click", onChartClick)
    }

    // 清理函数
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose()
        chartInstance.current = null
      }
    }
  }, [])

  // 更新图表配置
  useEffect(() => {
    if (chartInstance.current) {
      // 设置加载状态
      if (loading) {
        chartInstance.current.showLoading()
      } else {
        chartInstance.current.hideLoading()
      }

      // 设置配置项
      chartInstance.current.setOption(option, settings)
    }
  }, [option, loading, settings])

  // 监听窗口变化
  useEffect(() => {
    if (!autoResize || !chartInstance.current) return

    const handleResize = () => {
      chartInstance.current?.resize()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [autoResize])

  return (
    <div
      ref={chartRef}
      className={`echart-container ${className}`}
      style={{ width, height }}
    />
  )
}

export default EChart
