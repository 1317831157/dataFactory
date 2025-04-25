import React from "react"
import EChart from "../../../components/EChart"
import type { EChartsOption } from "echarts"
import * as echarts from "echarts"
import { analysisApi } from "@/api/index"
/**
 * 右侧内容组件
 * 展示访问数据统计和图表
 */
const RightContent: React.FC = () => {
  // 访问统计饼图配置

  const visitCount = 125
  // 创建渐变色
  const createGradient = (topColor: string, bottomColor: string) => {
    return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: topColor },
      { offset: 1, color: bottomColor },
    ])
  }

  // 增强数据，添加渐变色
  const enhancedData = [
    {
      name: "访问权限",
      value: 35,
      itemStyle: {
        color: createGradient("#36a4ff", "#1a82ff"),
      },
    },
    {
      name: "安全访问",
      value: 25,
      itemStyle: {
        color: createGradient("#ff9f43", "#ff7e00"),
      },
    },
    {
      name: "历史记录",
      value: 20,
      itemStyle: {
        color: createGradient("#0084ff", "#0055ff"),
      },
    },
    {
      name: "Web应用访问",
      value: 20,
      itemStyle: {
        color: createGradient("#007aff", "#0055ff"),
      },
    },
  ]
  const pieOption: EChartsOption = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      show: false,
    },
    series: [
      // 底部阴影 - 增强3D效果
      {
        name: "底部阴影",
        type: "pie",
        silent: true,
        z: 1,
        radius: ["38%", "72%"],
        center: ["50%", "54%"],
        startAngle: 90,
        label: { show: false },
        labelLine: { show: false },
        itemStyle: {
          color: "rgba(0, 0, 0, 0.5)",
          borderWidth: 0,
        },
        data: [{ value: 100 }],
      },
      // 底层 - 深色基础
      {
        name: "底层",
        type: "pie",
        silent: true,
        z: 2,
        radius: ["40%", "70%"],
        center: ["50%", "52%"], // 稍微向下偏移
        startAngle: 90,
        label: { show: false },
        labelLine: { show: false },
        itemStyle: {
          color: "#001a33",
          borderWidth: 0,
        },
        data: enhancedData.map((item) => ({
          value: item.value,
          itemStyle: {
            color: "#001a33",
          },
        })),
      },
      // 主要数据层
      {
        name: "访问统计",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["50%", "50%"],
        startAngle: 90, // 调整起始角度
        clockwise: true,
        avoidLabelOverlap: true,
        z: 10,
        itemStyle: {
          borderWidth: 2,
          borderColor: "#000",
          borderRadius: 4, // 添加圆角
        },
        label: {
          show: true,
          position: "outside",
          formatter: "{b}",
          fontSize: 14,
          color: "#0ff",
          lineHeight: 20,
        },
        labelLine: {
          length: 20,
          length2: 10,
          maxSurfaceAngle: 80,
          lineStyle: {
            width: 1,
            color: "#0ff",
          },
        },
        data: enhancedData,
        // 添加间隙
        gapWidth: 4,
        gapRadius: 4,
      },
      // 高光层 - 增强3D效果
      {
        name: "高光",
        type: "pie",
        silent: true,
        z: 20,
        radius: ["40%", "70%"],
        center: ["50%", "48%"], // 向上偏移
        startAngle: 90,
        label: { show: false },
        labelLine: { show: false },
        itemStyle: {
          color: "rgba(255, 255, 255, 0.2)",
          borderWidth: 0,
        },
        data: enhancedData,
      },
      // 内环 - 深色
      {
        name: "内环",
        type: "pie",
        silent: true,
        z: 5,
        radius: ["25%", "40%"],
        center: ["50%", "50%"],
        startAngle: 90,
        label: { show: false },
        labelLine: { show: false },
        itemStyle: {
          color: "#000",
          borderWidth: 0,
        },
        data: [{ value: 100 }],
      },
      // 内环高光 - 上部
      {
        name: "内环高光上",
        type: "pie",
        silent: true,
        z: 6,
        radius: ["25%", "40%"],
        center: ["50%", "48%"], // 向上偏移
        startAngle: 90,
        endAngle: 270,
        label: { show: false },
        labelLine: { show: false },
        itemStyle: {
          color: "rgba(255, 255, 255, 0.15)",
          borderWidth: 0,
        },
        data: [{ value: 100 }],
      },
      // 内环阴影 - 下部
      {
        name: "内环阴影下",
        type: "pie",
        silent: true,
        z: 6,
        radius: ["25%", "40%"],
        center: ["50%", "52%"], // 向下偏移
        startAngle: 270,
        endAngle: 450,
        label: { show: false },
        labelLine: { show: false },
        itemStyle: {
          color: "rgba(0, 0, 0, 0.3)",
          borderWidth: 0,
        },
        data: [{ value: 100 }],
      },
      // 中心圆孔
      {
        name: "中心",
        type: "pie",
        silent: true,
        z: 7,
        radius: ["0%", "25%"],
        center: ["50%", "50%"],
        label: { show: false },
        labelLine: { show: false },
        itemStyle: {
          color: "#000",
          borderWidth: 0,
        },
        data: [{ value: 100 }],
      },
    ],
    graphic: [
      // 右侧访问次数显示
      {
        type: "group",
        right: "0%",
        top: "middle",
        children: [
          // {
          //   type: "text",
          //   style: {
          //     text: visitCount.toString(),
          //     font: "bold 36px Arial",
          //     fill: "#0ff",
          //   },
          //   right: 30,
          //   top: 15,
          // },
          // {
          //   type: "text",
          //   style: {
          //     text: "次",
          //     font: "20px Arial",
          //     fill: "#0ff",
          //   },
          //   right: 0,
          //   top: 15,
          // },
          // {
          //   type: "text",
          //   style: {
          //     text: "近24小时访问次数",
          //     font: "14px Arial",
          //     fill: "#fff",
          //   },
          //   right: 0,
          //   top: 70,
          // },
        ],
      },
    ],
  }

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
              <EChart option={pieOption} height="100%" width="100%" />
            </div>
            {/* <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="text-5xl font-bold text-[#1890ff]">125,484</div>
              <div className="text-sm text-gray-300 mt-2">过去24h访问次数</div>
            </div> */}
          </div>
        </div>
      </div>

      {/* 每小时数据提取量 */}
      <div className="h-[35%] bg-[rgba(0,21,41,0.5)] rounded-md border border-[rgba(32,128,192,0.6)]">
        <div className="p-2 border-b border-[rgba(32,128,192,0.6)]">
          <h3 className="text-lg font-medium text-white">每小时提取数据量</h3>
        </div>
        <div className="h-[calc(100%-36px)]">
          <EChart option={lineOption} height="100%" width="100%" />
        </div>
      </div>

      {/* 告警信息 */}
      <div className="h-[30%] bg-[rgba(0,21,41,0.5)] rounded-md border border-[rgba(32,128,192,0.6)] overflow-hidden">
        <div className="p-2 border-b border-[rgba(32,128,192,0.6)]">
          <h3 className="text-lg font-medium text-white">告警信息</h3>
        </div>
        <div className="p-2 h-[calc(100%-36px)] overflow-y-auto">
          <div className="space-y-2">
            <div className="p-2 bg-[rgba(245,34,45,0.1)] border-l-2 border-[var(--error-color)] rounded">
              <div className="text-[var(--error-color)]">爬虫失效</div>
              <div className="text-xs text-gray-400">2023-04-18 12:22</div>
            </div>
            <div className="p-2 bg-[rgba(250,173,20,0.1)] border-l-2 border-[var(--warning-color)] rounded">
              <div className="text-[var(--warning-color)]">保留级别降低</div>
              <div className="text-xs text-gray-400">2023-04-18 12:22</div>
            </div>
            <div className="p-2 bg-[rgba(245,34,45,0.1)] border-l-2 border-[var(--error-color)] rounded">
              <div className="text-[var(--error-color)]">提取数据失效</div>
              <div className="text-xs text-gray-400">2023-04-18 12:22</div>
            </div>
            <div className="p-2 bg-[rgba(245,34,45,0.1)] border-l-2 border-[var(--error-color)] rounded">
              <div className="text-[var(--error-color)]">数据集生产异常</div>
              <div className="text-xs text-gray-400">2023-04-18 12:22</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RightContent
