import React, { useState, useEffect } from "react"
import EChart from "../../../components/EChart"
import type { EChartsOption } from "echarts"
import * as echarts from "echarts"
import { analysisApi } from "@/api/index"

/**
 * 右侧内容组件
 * 展示访问数据统计和图表
 */
const RightContent: React.FC = () => {
  // 状态管理
  const [visitCount, setVisitCount] = useState(0)
  const [visitData, setVisitData] = useState<any[]>([])
  const [hourlyData, setHourlyData] = useState<number[]>([])
  const [alertMessages, setAlertMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // 创建渐变色
  const createGradient = (topColor: string, bottomColor: string) => {
    return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: topColor },
      { offset: 1, color: bottomColor },
    ])
  }

  // 获取访问统计数据
  const getVisitStatistics = async () => {
    try {
      const result = await analysisApi.getVisitStatistics()
      if (result.code === 200) {
        // 处理数据并添加渐变色
        const colors = [
          ["#36a4ff", "#1a82ff"],
          ["#ff9f43", "#ff7e00"],
          ["#0084ff", "#0055ff"],
          ["#007aff", "#0055ff"],
        ]

        const enhancedData = result.data.map((item: any, index: number) => ({
          name: item.name,
          value: item.value,
          itemStyle: {
            color: createGradient(
              colors[index % colors.length][0],
              colors[index % colors.length][1]
            ),
          },
        }))

        setVisitData(enhancedData)
        setVisitCount(
          result.data.reduce((sum: number, item: any) => sum + item.value, 0)
        )
      }
    } catch (error) {
      console.error("获取访问统计数据失败:", error)
    }
  }

  // 获取每小时数据提取量
  const getHourlyDataVolume = async () => {
    try {
      const result = await analysisApi.getHourlyDataVolume()
      if (result.code === 200) {
        setHourlyData(result.data)
      }
    } catch (error) {
      console.error("获取每小时数据提取量失败:", error)
    }
  }

  // 获取告警信息
  const getAlertMessages = async () => {
    try {
      const result = await analysisApi.getAlertMessages()
      if (result.code === 200) {
        setAlertMessages(result.data)
      }
    } catch (error) {
      console.error("获取告警信息失败:", error)
    }
  }

  // 组件挂载时获取数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await Promise.all([
        getVisitStatistics(),
        getHourlyDataVolume(),
        getAlertMessages(),
      ])
      setLoading(false)
    }

    fetchData()
  }, [])

  // 每小时数据提取量折线图配置
  const lineOption: EChartsOption = {
    tooltip: {
      trigger: "axis",
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
      data: ["0点", "3点", "6点", "9点", "12点", "15点", "18点", "21点"],
      axisLine: {
        lineStyle: {
          color: "rgba(255, 255, 255, 0.3)",
        },
      },
      axisLabel: {
        color: "rgba(255, 255, 255, 0.7)",
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "rgba(255, 255, 255, 0.3)",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      axisLabel: {
        color: "rgba(255, 255, 255, 0.7)",
      },
    },
    series: [
      {
        name: "数据提取量",
        type: "line",
        stack: "Total",
        smooth: true,
        lineStyle: {
          width: 2,
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.2,
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(24, 144, 255, 0.8)",
              },
              {
                offset: 1,
                color: "rgba(24, 144, 255, 0)",
              },
            ],
          },
        },
        emphasis: {
          focus: "series",
        },
        data: [360, 280, 180, 580, 860, 1140, 920, 680],
      },
    ],
    backgroundColor: "transparent",
  }

  // 访问统计饼图配置
  const pieOption: EChartsOption = {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      right: 10,
      top: "center",
      textStyle: {
        color: "rgba(255, 255, 255, 0.7)",
      },
    },
    series: [
      {
        name: "访问来源",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["40%", "50%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "rgba(0, 0, 0, 0.2)",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: "bold",
            color: "#fff",
          },
        },
        labelLine: {
          show: false,
        },
        data:
          visitData.length > 0
            ? visitData
            : [
                {
                  value: 1048,
                  name: "搜索引擎",
                  itemStyle: { color: createGradient("#36a4ff", "#1a82ff") },
                },
                {
                  value: 735,
                  name: "直接访问",
                  itemStyle: { color: createGradient("#ff9f43", "#ff7e00") },
                },
                {
                  value: 580,
                  name: "邮件营销",
                  itemStyle: { color: createGradient("#0084ff", "#0055ff") },
                },
                {
                  value: 484,
                  name: "联盟广告",
                  itemStyle: { color: createGradient("#007aff", "#0055ff") },
                },
              ],
      },
    ],
    backgroundColor: "transparent",
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* 访问总量统计 */}
      <div className="h-[35%] flex flex-col bg-[rgba(0,21,41,0.5)] rounded-md border border-[rgba(32,128,192,0.6)]">
        <div className="p-2 border-b border-[rgba(32,128,192,0.6)]">
          <h3 className="text-lg font-medium text-white">数据集统计</h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <EChart
                option={pieOption}
                height="100%"
                width="100%"
                loading={loading}
              />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="text-5xl font-bold text-[#1890ff]">
                {visitCount.toLocaleString()}
              </div>
              <div className="text-sm text-gray-300 mt-2">过去24h访问次数</div>
            </div>
          </div>
        </div>
      </div>

      {/* 每小时数据提取量 */}
      <div className="h-[35%] bg-[rgba(0,21,41,0.5)] rounded-md border border-[rgba(32,128,192,0.6)]">
        <div className="p-2 border-b border-[rgba(32,128,192,0.6)]">
          <h3 className="text-lg font-medium text-white">每小时提取数据量</h3>
        </div>
        <div className="h-[calc(100%-36px)]">
          <EChart
            option={lineOption}
            height="100%"
            width="100%"
            loading={loading}
          />
        </div>
      </div>

      {/* 告警信息 */}
      <div className="h-[30%] bg-[rgba(0,21,41,0.5)] rounded-md border border-[rgba(32,128,192,0.6)] overflow-hidden">
        <div className="p-2 border-b border-[rgba(32,128,192,0.6)]">
          <h3 className="text-lg font-medium text-white">告警信息</h3>
        </div>
        <div className="p-2 h-[calc(100%-36px)] overflow-y-auto">
          <div className="space-y-2">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="text-gray-400">加载中...</div>
              </div>
            ) : alertMessages.length > 0 ? (
              alertMessages.map((alert, index) => (
                <div
                  key={index}
                  className={`p-2 bg-[rgba(${
                    alert.type === "error" ? "245,34,45" : "250,173,20"
                  },0.1)] border-l-2 border-[var(--${
                    alert.type === "error" ? "error" : "warning"
                  }-color)] rounded`}
                >
                  <div
                    className={`text-[var(--${
                      alert.type === "error" ? "error" : "warning"
                    }-color)]`}
                  >
                    {alert.message}
                  </div>
                  <div className="text-xs text-gray-400">{alert.time}</div>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center h-full">
                <div className="text-gray-400">暂无告警信息</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RightContent
