import React, { useState, useCallback } from "react"
import { Radio, Switch } from "antd"
import EChart from "../../../../components/EChart"
import type { EChartsOption } from "echarts"
import * as echarts from "echarts"
import { Card } from "antd"
import { DatasetInfo, KVObject } from "../../../../types/dataService"

interface DataDisplayModalProps {
  themeColor: string
  secondaryColor: string
}

const DataDisplayModal: React.FC<DataDisplayModalProps> = ({
  themeColor,
  secondaryColor,
}) => {
  // 当前选中的图表类型
  const [chartType, setChartType] = useState<string>("line")
  // 是否启用黑暗模式
  const [darkMode, setDarkMode] = useState<boolean>(true)
  // 图表交互选项
  const [enableTooltip, setEnableTooltip] = useState<boolean>(true)
  
  // 创建渐变色
  const createGradient = useCallback(
    (color: string, opacity1: number = 0.7, opacity2: number = 0.1) => {
      return {
        type: "linear" as const, // 显式类型断言
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: color ? `${color}${Math.floor(opacity1 * 255).toString(16)}` : `${themeColor}B3`,
          },
          {
            offset: 1,
            color: color ? `${color}${Math.floor(opacity2 * 255).toString(16)}` : `${themeColor}1A`,
          },
        ],
      }
    },
    [themeColor]
  )

  // 模拟数据
  const months = ["1月", "2月", "3月", "4月", "5月", "6月"]
  const categories = ["产品A", "产品B", "产品C", "产品D"]
  const lineData = [
    [120, 132, 101, 134, 90, 230],
    [220, 182, 191, 234, 290, 330],
    [150, 232, 201, 154, 190, 330],
    [320, 332, 301, 334, 390, 330],
  ]
  const pieData = [
    { value: 1048, name: "产品A" },
    { value: 735, name: "产品B" },
    { value: 580, name: "产品C" },
    { value: 484, name: "产品D" },
  ]
  const barData = [
    [120, 200, 150, 80, 70, 110],
    [60, 70, 80, 120, 130, 110],
  ]
  const scatterData = [
    [10, 8.04],
    [8, 6.95],
    [13, 7.58],
    [9, 8.81],
    [11, 8.33],
    [14, 9.96],
    [6, 7.24],
    [4, 4.26],
    [12, 10.84],
    [7, 4.82],
  ]
  
  // 图表配置项
  const getLineChartOption = useCallback((): EChartsOption => {
    return {
      tooltip: {
        trigger: "axis",
        show: enableTooltip,
      },
      legend: {
        data: categories,
        textStyle: { color: darkMode ? "#fff" : "#333" },
        right: "5%",
      },
      grid: {
        left: "3%",
        right: "5%",
        bottom: "8%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: months,
        axisLine: {
          lineStyle: {
            color: darkMode ? `${secondaryColor}40` : "#ccc",
          },
        },
        axisLabel: {
          color: darkMode ? `${secondaryColor}CC` : "#666",
        },
      },
      yAxis: {
        type: "value",
        axisLine: {
          lineStyle: {
            color: darkMode ? `${secondaryColor}40` : "#ccc",
          },
        },
        splitLine: {
          lineStyle: {
            color: darkMode ? `${secondaryColor}20` : "#eee",
          },
        },
        axisLabel: {
          color: darkMode ? `${secondaryColor}CC` : "#666",
        },
      },
      series: categories.map((category, index) => ({
        name: category,
        type: "line",
        data: lineData[index],
        smooth: true,
        symbol: "circle",
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: index === 0 ? themeColor : undefined,
        },
        areaStyle: index === 0 ? { color: createGradient(themeColor) } : undefined,
        emphasis: {
          focus: "series",
        },
      })),
    }
  }, [themeColor, secondaryColor, categories, months, lineData, createGradient, darkMode, enableTooltip])
  
  const getPieChartOption = useCallback((): EChartsOption => {
    return {
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
        show: enableTooltip,
      },
      legend: {
        orient: "vertical",
        right: "5%",
        top: "middle",
        textStyle: { color: darkMode ? "#fff" : "#333" },
      },
      series: [
        {
          name: "销售数据",
          type: "pie",
          radius: ["40%", "70%"],
          center: ["40%", "50%"],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 6,
            borderColor: darkMode ? "#000" : "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "outside",
            formatter: "{b}: {c}",
            color: darkMode ? "#fff" : "#333",
          },
          labelLine: {
            length: 15,
            length2: 10,
            lineStyle: { color: darkMode ? `${secondaryColor}80` : "#aaa" },
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          data: pieData.map((item, index) => ({
            ...item,
            itemStyle: {
              color: index === 0 ? themeColor : undefined,
            },
          })),
        },
      ],
    }
  }, [themeColor, secondaryColor, pieData, darkMode, enableTooltip])
  
  const getBarChartOption = useCallback((): EChartsOption => {
    return {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        show: enableTooltip,
      },
      legend: {
        data: ["实际销量", "目标销量"],
        textStyle: { color: darkMode ? "#fff" : "#333" },
        right: "5%",
      },
      grid: {
        left: "3%",
        right: "5%",
        bottom: "8%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: months,
        axisLine: {
          lineStyle: {
            color: darkMode ? `${secondaryColor}40` : "#ccc",
          },
        },
        axisLabel: {
          color: darkMode ? `${secondaryColor}CC` : "#666",
        },
      },
      yAxis: {
        type: "value",
        axisLine: {
          lineStyle: {
            color: darkMode ? `${secondaryColor}40` : "#ccc",
          },
        },
        splitLine: {
          lineStyle: {
            color: darkMode ? `${secondaryColor}20` : "#eee",
          },
        },
        axisLabel: {
          color: darkMode ? `${secondaryColor}CC` : "#666",
        },
      },
      series: [
        {
          name: "实际销量",
          type: "bar",
          barWidth: "30%",
          emphasis: {
            focus: "series",
          },
          itemStyle: {
            color: themeColor,
            borderRadius: [4, 4, 0, 0],
          },
          data: barData[0],
        },
        {
          name: "目标销量",
          type: "bar",
          barWidth: "30%",
          emphasis: {
            focus: "series",
          },
          data: barData[1],
        },
      ],
    }
  }, [themeColor, secondaryColor, months, barData, darkMode, enableTooltip])
  
  const getScatterChartOption = useCallback((): EChartsOption => {
    return {
      tooltip: {
        trigger: "item",
        formatter: function (params: any) {
          return `(${params.value[0]}, ${params.value[1]})`
        },
        show: enableTooltip,
      },
      grid: {
        left: "3%",
        right: "5%",
        bottom: "8%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        min: 0,
        max: 20,
        axisLine: {
          lineStyle: {
            color: darkMode ? `${secondaryColor}40` : "#ccc",
          },
        },
        axisLabel: {
          color: darkMode ? `${secondaryColor}CC` : "#666",
        },
        splitLine: {
          lineStyle: {
            color: darkMode ? `${secondaryColor}20` : "#eee",
          },
        },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: 15,
        axisLine: {
          lineStyle: {
            color: darkMode ? `${secondaryColor}40` : "#ccc",
          },
        },
        axisLabel: {
          color: darkMode ? `${secondaryColor}CC` : "#666",
        },
        splitLine: {
          lineStyle: {
            color: darkMode ? `${secondaryColor}20` : "#eee",
          },
        },
      },
      series: [
        {
          type: "scatter",
          symbolSize: 15,
          itemStyle: {
            color: themeColor,
            borderColor: darkMode ? "#000" : "#fff",
            borderWidth: 1,
            opacity: 0.8,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: themeColor,
            },
          },
          data: scatterData,
        },
      ],
    }
  }, [themeColor, secondaryColor, scatterData, darkMode, enableTooltip])
  
  // 根据选中的图表类型返回相应的配置
  const getChartOption = useCallback(() => {
    switch (chartType) {
      case "line":
        return getLineChartOption()
      case "pie":
        return getPieChartOption()
      case "bar":
        return getBarChartOption()
      case "scatter":
        return getScatterChartOption()
      default:
        return getLineChartOption()
    }
  }, [chartType, getLineChartOption, getPieChartOption, getBarChartOption, getScatterChartOption])

  return (
    <div className="w-full h-full bg-[rgba(0,21,41,0.8)] p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold" style={{ color: themeColor }}>
          图表类型演示
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-300">主题:</span>
          <Switch
            checked={darkMode}
            onChange={setDarkMode}
            checkedChildren="暗色"
            unCheckedChildren="亮色"
            size="small"
            style={{ 
              backgroundColor: darkMode ? themeColor : 'rgba(32,128,192,0.3)',
              borderColor: darkMode ? themeColor : 'rgba(32,128,192,0.5)' 
            }}
          />
        </div>
      </div>
      
      <div className="mb-4">
        <Radio.Group 
          value={chartType} 
          onChange={(e) => setChartType(e.target.value)}
          buttonStyle="solid"
          size="middle"
          className="custom-radio-group"
        >
          <Radio.Button 
            value="line"
            className={chartType === "line" ? "active-radio" : "inactive-radio"}
            style={{ 
              backgroundColor: chartType === "line" ? themeColor : 'rgba(0,21,41,0.6)',
              borderColor: `${themeColor}80`,
              color: chartType === "line" ? "#fff" : `${secondaryColor}D9`,
            }}
          >
            折线图
          </Radio.Button>
          <Radio.Button 
            value="bar"
            className={chartType === "bar" ? "active-radio" : "inactive-radio"}
            style={{ 
              backgroundColor: chartType === "bar" ? themeColor : 'rgba(0,21,41,0.6)',
              borderColor: `${themeColor}80`,
              color: chartType === "bar" ? "#fff" : `${secondaryColor}D9`,
            }}
          >
            柱状图
          </Radio.Button>
          <Radio.Button 
            value="pie"
            className={chartType === "pie" ? "active-radio" : "inactive-radio"}
            style={{ 
              backgroundColor: chartType === "pie" ? themeColor : 'rgba(0,21,41,0.6)',
              borderColor: `${themeColor}80`,
              color: chartType === "pie" ? "#fff" : `${secondaryColor}D9`,
            }}
          >
            饼图
          </Radio.Button>
          <Radio.Button 
            value="scatter"
            className={chartType === "scatter" ? "active-radio" : "inactive-radio"}
            style={{ 
              backgroundColor: chartType === "scatter" ? themeColor : 'rgba(0,21,41,0.6)',
              borderColor: `${themeColor}80`,
              color: chartType === "scatter" ? "#fff" : `${secondaryColor}D9`,
            }}
          >
            散点图
          </Radio.Button>
        </Radio.Group>
      </div>
      
      <div className="bg-[rgba(0,21,41,0.6)] rounded-md p-4 h-[500px] border border-[rgba(32,128,192,0.6)] shadow-lg">
        <div className="flex justify-end mb-3">
          <div 
            className="text-xs px-2 py-1 rounded flex items-center gap-1"
            style={{ backgroundColor: 'rgba(0,21,41,0.8)', color: secondaryColor }}
          >
            <span>提示框:</span>
            <Switch
              checked={enableTooltip}
              onChange={setEnableTooltip}
              size="small"
              style={{ 
                backgroundColor: enableTooltip ? themeColor : 'rgba(32,128,192,0.3)',
                borderColor: enableTooltip ? themeColor : 'rgba(32,128,192,0.5)',
                scale: '0.8' 
              }}
            />
          </div>
        </div>
        <EChart 
          option={getChartOption()} 
          height="100%" 
          width="100%"
          autoResize={true}
        />
      </div>
    </div>
  )
}

export default DataDisplayModal
