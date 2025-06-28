import React, { useState, useCallback, useMemo, useEffect } from "react"
import { Select, DatePicker, Button, Table, Tag, message, Spin } from "antd"
import type { ColumnsType } from "antd/es/table"
import type { EChartsOption } from "echarts"
import type { RangePickerProps } from "antd/es/date-picker"
import EChart from "../../../../components/EChart"
import { dataDisplayModalApi } from "../../../../api/dataDisplayModal"
import type { API } from "../../../../api/types"
import "./DataDisplayModal.css"

interface DataDisplayModalProps {
  themeColor: string
  secondaryColor: string
}

// 定义数据类型
interface LatestDataType {
  title: string
  type: string
  dataSize: number
  updateDate: string
}

const DataDisplayModal: React.FC<DataDisplayModalProps> = ({
  themeColor,
  secondaryColor,
}) => {
  // 加载状态
  const [loading, setLoading] = useState<boolean>(true)
  const [updating, setUpdating] = useState<boolean>(false)
  const [exporting, setExporting] = useState<boolean>(false)

  // 数据源选择状态
  const [dataSource, setDataSource] = useState<string>("academic_papers")
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date("2023-01-01"),
    new Date("2023-12-31"),
  ])
  const [selectedFields, setSelectedFields] = useState<string[]>([
    "计算机科学",
    "人工智能",
    "数据科学",
  ])
  const [subTypeOptions, setSubTypeOptions] = useState<string[]>([
    "期刊论文",
    "会议论文",
    "学位论文",
    "预印本",
  ])
  const [selectedSubTypes, setSelectedSubTypes] = useState<string[]>([
    "期刊论文",
  ])

  // API数据状态
  const [dataSourceOptions, setDataSourceOptions] = useState<
    API.DataDisplay.DataSourceOption[]
  >([])
  const [fieldOptions, setFieldOptions] = useState<string[]>([])
  const [exportOptions, setExportOptions] = useState<string[]>([])
  const [metricData, setMetricData] = useState<API.DataDisplay.MetricData[]>([])
  const [chartData, setChartData] = useState<API.DataDisplay.ChartData>({
    categories: [],
    values: [],
  })
  const [latestData, setLatestData] = useState<
    API.DataDisplay.LatestDataItem[]
  >([])

  // 初始化数据加载
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true)

        // 1. 获取数据源配置
        const configResponse = await dataDisplayModalApi.getDataSourceConfig()
        const config = configResponse.data

        setDataSourceOptions(config.dataSourceOptions)
        setFieldOptions(config.fieldOptions)
        setExportOptions(config.exportOptions)

        // 2. 获取初始数据统计
        const statsResponse = await dataDisplayModalApi.getDataStats()
        const stats = statsResponse.data

        setMetricData(stats.metricData)
        setChartData(stats.chartData)
        setLatestData(stats.latestData)

        // 3. 获取默认数据源的子类型选项
        const subTypesResponse = await dataDisplayModalApi.getSubTypeOptions(
          dataSource
        )
        setSubTypeOptions(subTypesResponse.data.subTypes)

        message.success("数据加载完成")
      } catch (error) {
        console.error("初始化数据失败:", error)
        message.error("数据加载失败，请刷新页面重试")
      } finally {
        setLoading(false)
      }
    }

    initializeData()
  }, [dataSource])

  // 表格列定义
  const columns = useMemo<ColumnsType<LatestDataType>>(
    () => [
      {
        title: "标题",
        dataIndex: "title",
        key: "title",
        align: "center",
      },
      {
        title: "类型",
        dataIndex: "type",
        key: "type",
        align: "center",
        render: (text: string) => {
          const colorMap: Record<string, string> = {
            调查报告: "#FF5252",
            法规标准: "#9C27B0",
            学术论文: "#4CAF50",
          }
          return <Tag color={colorMap[text] || themeColor}>{text}</Tag>
        },
      },
      {
        title: "数据量",
        dataIndex: "dataSize",
        key: "dataSize",
        align: "center",
        render: (text: number) => `${text.toLocaleString()} 条`,
      },
      {
        title: "更新日期",
        dataIndex: "updateDate",
        key: "updateDate",
        align: "center",
      },
    ],
    [themeColor]
  )

  // 只保留柱状图配置
  const getBarChartOption = useCallback((): EChartsOption => {
    return {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        show: true,
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
        data: chartData.categories,
        axisLine: {
          lineStyle: {
            color: `${secondaryColor}40`,
          },
        },
        axisLabel: {
          color: `${secondaryColor}CC`,
          interval: 0,
          rotate: 30,
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
        },
      },
      series: [
        {
          name: "数据量",
          type: "bar",
          barWidth: "50%",
          emphasis: {
            focus: "series",
          },
          itemStyle: {
            color: (params: { dataIndex: number }) => {
              const colorList = [
                "#4CAF50",
                "#FF5252",
                "#2196F3",
                "#FFC107",
                "#9C27B0",
              ]
              return colorList[params.dataIndex % colorList.length]
            },
            borderRadius: [4, 4, 0, 0],
          },
          data: chartData.values,
        },
      ],
    }
  }, [chartData, secondaryColor])

  // 处理数据源变更
  const handleDataSourceChange = useCallback(async (value: string) => {
    try {
      setDataSource(value)

      // 获取对应的子类型选项
      const subTypesResponse = await dataDisplayModalApi.getSubTypeOptions(
        value
      )
      const subTypes = subTypesResponse.data.subTypes

      setSubTypeOptions(subTypes)
      setSelectedSubTypes(subTypes.length > 0 ? [subTypes[0]] : [])

      // 重新获取图表数据
      const chartResponse = await dataDisplayModalApi.getChartData({
        dataSource: value,
      })
      setChartData(chartResponse.data)
    } catch (error) {
      console.error("处理数据源变更失败:", error)
      message.error("获取数据源信息失败")
    }
  }, [])

  // 处理日期范围变更
  const handleDateChange = useCallback((dates: RangePickerProps["value"]) => {
    if (
      dates &&
      Array.isArray(dates) &&
      dates.length === 2 &&
      dates[0] &&
      dates[1]
    ) {
      setDateRange([new Date(dates[0].valueOf()), new Date(dates[1].valueOf())])
    }
  }, [])

  // 处理数据更新
  const handleUpdateData = useCallback(async () => {
    try {
      setUpdating(true)

      const updateParams: API.DataDisplay.DataUpdateParams = {
        dataSource,
        selectedSubTypes,
        dateRange: [
          dateRange[0].toISOString().split("T")[0],
          dateRange[1].toISOString().split("T")[0],
        ],
        selectedFields,
      }

      const response = await dataDisplayModalApi.updateData(updateParams)
      const { taskId } = response.data

      if (!taskId) {
        message.error("获取任务ID失败")
        setUpdating(false)
        return
      }

      message.success("数据更新请求已提交")

      // 轮询检查更新进度
      const checkProgress = async () => {
        try {
          const progressResponse = await dataDisplayModalApi.getUpdateProgress(
            taskId
          )
          const progress = progressResponse.data.data

          if (progress.status === "completed") {
            message.success("数据更新完成")
            // 重新获取数据统计
            const statsResponse = await dataDisplayModalApi.getDataStats()
            const stats = statsResponse.data.data

            setMetricData(stats.metricData)
            setChartData(stats.chartData)
            setLatestData(stats.latestData)
            setUpdating(false)
          } else if (progress.status === "failed") {
            message.error("数据更新失败")
            setUpdating(false)
          } else {
            // 继续轮询
            setTimeout(checkProgress, 2000)
          }
        } catch (error) {
          console.error("检查更新进度失败:", error)
          setUpdating(false)
        }
      }

      setTimeout(checkProgress, 1000)
    } catch (error) {
      console.error("更新数据失败:", error)
      message.error("数据更新失败")
      setUpdating(false)
    }
  }, [dataSource, selectedSubTypes, dateRange, selectedFields])

  // 处理数据导出
  const handleExportData = useCallback(
    async (format: string) => {
      try {
        setExporting(true)

        const exportParams: API.DataDisplay.DataExportParams = {
          format,
          dataSource,
          dateRange: [
            dateRange[0].toISOString().split("T")[0],
            dateRange[1].toISOString().split("T")[0],
          ],
          fields: selectedFields,
        }

        const response = await dataDisplayModalApi.exportData(exportParams)
        const { taskId } = response.data.data

        message.success("数据导出请求已提交")

        // 检查导出状态
        const checkStatus = async () => {
          try {
            const statusResponse = await dataDisplayModalApi.getExportStatus(
              taskId
            )
            const status = statusResponse.data.data

            if (status.status === "completed") {
              message.success("数据导出完成")

              if (status.downloadUrl) {
                // 触发下载
                const link = document.createElement("a")
                link.href = status.downloadUrl
                link.download = `export_${Date.now()}.${format.toLowerCase()}`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              }
              setExporting(false)
            } else if (status.status === "failed") {
              message.error("数据导出失败")
              setExporting(false)
            } else {
              // 继续检查
              setTimeout(checkStatus, 2000)
            }
          } catch (error) {
            console.error("检查导出状态失败:", error)
            setExporting(false)
          }
        }

        setTimeout(checkStatus, 1000)
      } catch (error) {
        console.error("导出数据失败:", error)
        message.error("数据导出失败")
        setExporting(false)
      }
    },
    [dataSource, dateRange, selectedFields]
  )

  return (
    <Spin spinning={loading} tip="加载数据中...">
      <div className="w-full h-full flex overflow-hidden data-display-container">
        {/* 侧边栏 */}
        <div className="w-64 h-full p-4 overflow-y-auto bg-[#1a1f3c] border-r border-[rgba(32,128,192,0.3)]">
          <div className="mb-6 text-center">
            <h2
              className="text-xl font-bold mb-4"
              style={{ color: themeColor }}
            >
              数据源配置
            </h2>

            <div className="text-center mb-4">
              <div className="mx-auto w-24 h-24 mb-2 rounded-full bg-gradient-to-br from-[rgba(32,128,192,0.3)] to-[rgba(32,128,192,0.1)] flex items-center justify-center">
                <span className="text-4xl">📊</span>
              </div>
              <p className="text-xs text-[#8b8fa3]">学术数据分析平台 v1.0.0</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-[#8b8fa3] mb-2">选择数据来源</p>
            <Select
              className="w-full custom-select"
              value={dataSource}
              onChange={handleDataSourceChange}
              options={dataSourceOptions}
              dropdownStyle={{ backgroundColor: "#1e2343" }}
              popupClassName={"custom-select-dropdown"}
            />
          </div>

          <div className="mb-4">
            <p className="text-sm text-[#8b8fa3] mb-2">数据类型</p>
            <Select
              className="w-full custom-select"
              mode="multiple"
              value={selectedSubTypes}
              onChange={setSelectedSubTypes}
              options={subTypeOptions.map((item) => ({
                label: item,
                value: item,
              }))}
              popupClassName={"custom-select-dropdown"}
              dropdownStyle={{ backgroundColor: "#1e2343" }}
            />
          </div>

          <div className="mb-4 custom-date-picker">
            <p className="text-sm text-[#8b8fa3] mb-2">时间范围</p>
            <DatePicker.RangePicker
              className="w-full"
              onChange={handleDateChange}
              defaultValue={[null, null]}
              placeholder={["开始日期", "结束日期"]}
            />
          </div>

          <div className="mb-4">
            <p className="text-sm text-[#8b8fa3] mb-2">研究领域</p>
            <Select
              className="w-full custom-select"
              mode="multiple"
              value={selectedFields}
              onChange={setSelectedFields}
              options={fieldOptions.map((item) => ({
                label: item,
                value: item,
              }))}
              dropdownStyle={{ backgroundColor: "#1e2343" }}
              popupClassName={"custom-select-dropdown"}
            />
          </div>

          <div className="mb-6">
            <Button
              type="primary"
              className="w-full mb-3 data-button"
              style={{ backgroundColor: themeColor, borderColor: themeColor }}
              onClick={handleUpdateData}
              loading={updating}
              disabled={loading}
            >
              {updating ? "更新中..." : "更新数据"}
            </Button>

            <div className="export-section">
              <p className="text-sm text-[#8b8fa3] mb-2">导出选项</p>
              <Select
                className="w-full custom-select mb-4"
                defaultValue="CSV"
                options={exportOptions.map((item) => ({
                  label: item,
                  value: item,
                }))}
                dropdownStyle={{ backgroundColor: "#1e2343" }}
              />
              <Button
                className="w-full data-button mt-3"
                style={{ backgroundColor: themeColor, borderColor: themeColor }}
                onClick={() => handleExportData("CSV")}
                loading={exporting}
                disabled={loading}
              >
                {exporting ? "导出中..." : "导出数据"}
              </Button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-[#8b8fa3]">© 2024 学术数据分析平台</p>
          </div>
        </div>

        {/* 主内容区 */}
        <div className="flex-1 h-full overflow-y-auto p-4">
          <div className="flex justify-center items-center mb-6">
            <div
              className="text-2xl font-bold text-center tracking-wide"
              style={{ color: themeColor }}
            >
              学术研究数据分析
            </div>
          </div>

          {/* 指标卡片 */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {metricData.map((metric, index) => (
              <div key={`metric-${index}`} className="metric-card">
                <div
                  className="text-2xl font-semibold"
                  style={{ color: "#ffffff" }}
                >
                  {metric.value}
                </div>
                <div className="text-sm" style={{ color: "#8b8fa3" }}>
                  {metric.title}
                </div>
                <div className="text-sm text-[#4CAF50]">{metric.trend}</div>
              </div>
            ))}
          </div>

          {/* 图表展示区域 - 只保留柱状图 */}
          <div className="chart-container p-4 mb-6">
            <div className="flex justify-center items-center mb-3">
              <h3 className="text-lg font-bold" style={{ color: themeColor }}>
                各类型数据分布
              </h3>
            </div>
            <div className="h-[400px]">
              <EChart
                option={getBarChartOption()}
                height="100%"
                width="100%"
                autoResize={true}
              />
            </div>
          </div>

          {/* 最新数据列表 */}
          <div className="chart-container p-4">
            <h3
              className="text-lg font-bold mb-4 text-center"
              style={{ color: themeColor }}
            >
              最新数据列表
            </h3>
            <Table
              dataSource={latestData}
              columns={columns}
              pagination={false}
              rowKey="title"
              className="custom-table"
            />
          </div>
        </div>
      </div>
    </Spin>
  )
}

export default DataDisplayModal
