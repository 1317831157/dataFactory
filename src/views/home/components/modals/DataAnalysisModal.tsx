import React, { useState, useCallback } from "react"
import { Row, Col, Radio, Card, Statistic } from "antd"
import EChart from "../../../../components/EChart"
import type { EChartsOption } from "echarts"

interface DataAnalysisModalProps {
  themeColor: string
  secondaryColor: string
}

const DataAnalysisModal: React.FC<DataAnalysisModalProps> = ({
  themeColor,
  secondaryColor,
}) => {
  // 当前选中的分析类型
  const [analysisType, setAnalysisType] = useState<string>("trend")
  // 当前选中的时间范围
  const [timeRange, setTimeRange] = useState<string>("week")
  
  // 创建渐变色的辅助函数
  const createGradient = useCallback((opacity1: number = 0.7, opacity2: number = 0.1) => {
    return {
      type: "linear" as const,
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        {
          offset: 0,
          color: `${themeColor}${Math.floor(opacity1 * 255).toString(16)}`,
        },
        {
          offset: 1,
          color: `${themeColor}${Math.floor(opacity2 * 255).toString(16)}`,
        },
      ],
    }
  }, [themeColor])
  
  // 模拟数据 - 趋势分析数据
  const trendData = {
    week: [120, 132, 101, 134, 90, 230, 210],
    month: [120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 90, 230],
    year: Array.from({ length: 12 }, () => Math.floor(Math.random() * 1000) + 100)
  }
  
  // 模拟数据 - 字段分布数据
  const fieldDistribution = [
    { value: 335, name: '字段A' },
    { value: 310, name: '字段B' },
    { value: 234, name: '字段C' },
    { value: 155, name: '字段D' },
    { value: 120, name: '字段E' }
  ]
  
  // 模拟数据 - 聚类分析数据
  const clusterData = [
    // 群集1
    ...Array.from({ length: 20 }, () => [
      Math.random() * 10 + 5,
      Math.random() * 10 + 5,
      0
    ]),
    // 群集2
    ...Array.from({ length: 20 }, () => [
      Math.random() * 10 + 20,
      Math.random() * 10 + 5,
      1
    ]),
    // 群集3
    ...Array.from({ length: 20 }, () => [
      Math.random() * 10 + 5,
      Math.random() * 10 + 20,
      2
    ])
  ]
  
  // 时间标签映射
  const timeLabels = {
    week: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    month: Array.from({ length: 30 }, (_, i) => `${i + 1}日`),
    year: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  }
  
  // 趋势分析图表配置
  const getTrendChartOption = useCallback((): EChartsOption => {
    return {
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c} 个',
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
        data: timeLabels[timeRange as keyof typeof timeLabels],
        axisLine: {
          lineStyle: {
            color: `${secondaryColor}40`,
          },
        },
        axisLabel: {
          color: `${secondaryColor}CC`,
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
        },
      },
      series: [
        {
          name: '数据量',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 3,
            color: themeColor,
          },
          areaStyle: {
            color: createGradient(),
          },
          emphasis: {
            focus: 'series',
          },
          data: trendData[timeRange as keyof typeof trendData],
        },
      ],
      backgroundColor: 'transparent',
    }
  }, [themeColor, secondaryColor, timeRange, createGradient])
  
  // 饼图配置 - 字段分布
  const getPieChartOption = useCallback((): EChartsOption => {
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        right: '5%',
        top: 'center',
        textStyle: {
          color: '#fff',
        },
      },
      series: [
        {
          name: '字段分布',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 6,
            borderColor: 'rgba(0, 0, 0, 0.2)',
            borderWidth: 2,
          },
          label: {
            show: true,
            position: 'outside',
            formatter: '{b}: {c}',
            color: '#fff',
          },
          labelLine: {
            length: 15,
            length2: 10,
            lineStyle: { color: `${secondaryColor}80` },
          },
          emphasis: {
            focus: 'series',
            scaleSize: 10,
          },
          data: fieldDistribution.map((item, index) => ({
            ...item,
            itemStyle: {
              color: index === 0 ? themeColor : undefined,
            },
          })),
        },
      ],
      backgroundColor: 'transparent',
    }
  }, [themeColor, secondaryColor])
  
  // 散点图配置 - 聚类分析
  const getScatterChartOption = useCallback((): EChartsOption => {
    const clusterColors = [themeColor, '#00ff7f', '#ffaa00'];
    
    return {
      tooltip: {
        trigger: 'item',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: function(params: any) {
          return `(${params.value[0].toFixed(2)}, ${params.value[1].toFixed(2)})<br/>类别: ${params.value[2] + 1}`;
        }
      },
      grid: {
        top: '10%',
        left: '3%',
        right: '5%',
        bottom: '5%',
        containLabel: true,
      },
      xAxis: {
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
        },
      },
      series: [
        {
          type: 'scatter',
          symbolSize: 12,
          itemStyle: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            color: (params: any) => {
              return clusterColors[params.value[2]];
            },
            borderColor: 'rgba(255, 255, 255, 0.3)',
            borderWidth: 1,
            opacity: 0.8,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(255, 255, 255, 0.5)',
            },
          },
          data: clusterData,
        },
      ],
      backgroundColor: 'transparent',
    }
  }, [themeColor, secondaryColor])
  
  // 根据选中的分析类型返回相应的图表配置
  const getChartOption = useCallback(() => {
    switch (analysisType) {
      case 'trend':
        return getTrendChartOption()
      case 'field':
        return getPieChartOption()
      case 'cluster':
        return getScatterChartOption()
      default:
        return getTrendChartOption()
    }
  }, [analysisType, getTrendChartOption, getPieChartOption, getScatterChartOption])
  
  // 统计指标
  const statisticsData = {
    trend: [
      { title: '总数据量', value: 12580, precision: 0, suffix: '条', color: themeColor },
      { title: '平均增长率', value: 12.7, precision: 1, suffix: '%', color: '#00ff7f' },
      { title: '峰值数据', value: 1253, precision: 0, suffix: '条', color: '#ffaa00' },
      { title: '数据预测', value: 15800, precision: 0, suffix: '条', color: '#ff6b00' },
    ],
    field: [
      { title: '字段数量', value: 28, precision: 0, suffix: '个', color: themeColor },
      { title: '主要字段占比', value: 68.5, precision: 1, suffix: '%', color: '#00ff7f' },
      { title: '最大字段量', value: 335, precision: 0, suffix: '条', color: '#ffaa00' },
      { title: '平均分布', value: 230.8, precision: 1, suffix: '条', color: '#ff6b00' },
    ],
    cluster: [
      { title: '类别数量', value: 3, precision: 0, suffix: '个', color: themeColor },
      { title: '聚类质量', value: 85.6, precision: 1, suffix: '%', color: '#00ff7f' },
      { title: '样本数量', value: 60, precision: 0, suffix: '个', color: '#ffaa00' },
      { title: '特征维度', value: 2, precision: 0, suffix: '维', color: '#ff6b00' },
    ],
  }
  
  // 时间范围选择器（仅在趋势分析中显示）
  const TimeRangeSelector = () => (
    <div className="mb-4">
      <Radio.Group 
        value={timeRange} 
        onChange={(e) => setTimeRange(e.target.value)}
        buttonStyle="solid"
        size="middle"
        className="custom-radio-group"
      >
        <Radio.Button 
          value="week"
          style={{ 
            backgroundColor: timeRange === "week" ? themeColor : 'rgba(0,21,41,0.6)',
            borderColor: `${themeColor}80`,
            color: timeRange === "week" ? "#fff" : `${secondaryColor}D9`,
          }}
        >
          周
        </Radio.Button>
        <Radio.Button 
          value="month"
          style={{ 
            backgroundColor: timeRange === "month" ? themeColor : 'rgba(0,21,41,0.6)',
            borderColor: `${themeColor}80`,
            color: timeRange === "month" ? "#fff" : `${secondaryColor}D9`,
          }}
        >
          月
        </Radio.Button>
        <Radio.Button 
          value="year"
          style={{ 
            backgroundColor: timeRange === "year" ? themeColor : 'rgba(0,21,41,0.6)',
            borderColor: `${themeColor}80`,
            color: timeRange === "year" ? "#fff" : `${secondaryColor}D9`,
          }}
        >
          年
        </Radio.Button>
      </Radio.Group>
    </div>
  )

  return (
    <div className="w-full h-full bg-[rgba(0,21,41,0.8)] p-4 text-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold" style={{ color: themeColor }}>
          数据分析
        </h3>
        <div className="flex items-center gap-3">
          <Radio.Group 
            value={analysisType} 
            onChange={(e) => setAnalysisType(e.target.value)}
            buttonStyle="solid"
            size="middle"
            className="custom-radio-group"
          >
            <Radio.Button 
              value="trend"
              style={{ 
                backgroundColor: analysisType === "trend" ? themeColor : 'rgba(0,21,41,0.6)',
                borderColor: `${themeColor}80`,
                color: analysisType === "trend" ? "#fff" : `${secondaryColor}D9`,
              }}
            >
              趋势分析
            </Radio.Button>
            <Radio.Button 
              value="field"
              style={{ 
                backgroundColor: analysisType === "field" ? themeColor : 'rgba(0,21,41,0.6)',
                borderColor: `${themeColor}80`,
                color: analysisType === "field" ? "#fff" : `${secondaryColor}D9`,
              }}
            >
              字段分布
            </Radio.Button>
            <Radio.Button 
              value="cluster"
              style={{ 
                backgroundColor: analysisType === "cluster" ? themeColor : 'rgba(0,21,41,0.6)',
                borderColor: `${themeColor}80`,
                color: analysisType === "cluster" ? "#fff" : `${secondaryColor}D9`,
              }}
            >
              聚类分析
            </Radio.Button>
          </Radio.Group>
        </div>
      </div>
      
      {analysisType === 'trend' && <TimeRangeSelector />}
      
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="mb-4">
        {statisticsData[analysisType as keyof typeof statisticsData].map((stat, index) => (
          <Col span={6} key={index}>
            <Card 
              className="h-full" 
              style={{ 
                backgroundColor: 'rgba(0,21,41,0.6)', 
                borderColor: `${stat.color}50`,
                boxShadow: `0 0 10px ${stat.color}30`
              }}
            >
              <Statistic
                title={<span style={{ color: '#e6f7ff' }}>{stat.title}</span>}
                value={stat.value}
                precision={stat.precision}
                valueStyle={{ color: stat.color, fontWeight: 'bold' }}
                suffix={stat.suffix}
              />
            </Card>
          </Col>
        ))}
      </Row>
      
      {/* 图表区域 */}
      <div className="bg-[rgba(0,21,41,0.6)] rounded-md p-4 border border-[rgba(32,128,192,0.6)] shadow-lg" style={{ height: '400px' }}>
        <EChart 
          option={getChartOption()} 
          height="100%" 
          width="100%"
          autoResize={true}
        />
      </div>
      
      {/* 分析结论 */}
      <div className="mt-4 p-3 rounded-md bg-[rgba(0,21,41,0.6)] border-l-4" style={{ borderColor: themeColor }}>
        <h4 className="font-bold mb-2" style={{ color: themeColor }}>分析结论</h4>
        {analysisType === 'trend' && (
          <p className="text-sm text-gray-300">
            数据呈现明显的周期性波动，在{timeRange === 'week' ? '周中' : timeRange === 'month' ? '月中' : '年中'}达到峰值。总体趋势呈上升态势，
            环比增长12.7%。预测未来数据量将继续保持稳定增长，建议适当增加存储容量和处理能力。
          </p>
        )}
        {analysisType === 'field' && (
          <p className="text-sm text-gray-300">
            数据字段分布不均匀，主要集中在字段A和字段B，两者占比超过总体的68.5%。
            建议优化数据结构，减少数据偏斜，提高查询效率。可考虑对主要字段进行索引优化。
          </p>
        )}
        {analysisType === 'cluster' && (
          <p className="text-sm text-gray-300">
            通过无监督学习聚类算法，数据可明显分为3个类别，聚类质量评分为85.6%。
            各类别边界清晰，内部凝聚性高。这表明数据具有良好的结构特性，适合进一步的分类预测分析。
          </p>
        )}
      </div>
    </div>
  )
}

export default DataAnalysisModal
