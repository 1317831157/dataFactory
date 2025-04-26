import React, { useState, useCallback, useMemo } from "react"
import { Select, DatePicker, Button, Table, Tag } from "antd"
import type { ColumnsType } from "antd/es/table"
import type { EChartsOption } from "echarts"
import type { RangePickerProps } from "antd/es/date-picker"
import EChart from "../../../../components/EChart"
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

  const barData = useMemo(() => {
    return {
      categories: ["学术论文", "调查报告", "专业书籍", "政策文件", "法规标准"],
      values: [25000, 12000, 8000, 4500, 3000],
    }
  }, [])

  // 指标卡数据
  const metricData = useMemo(
    () => [
      { title: "文献总量", value: "52,489", trend: "+12.5%" },
      { title: "图文数据集", value: "15,932", trend: "+8.3%" },
      { title: "数据覆盖率", value: "25.8%", trend: "+2.1%" },
      { title: "数据源类型", value: "8", trend: "+1" },
    ],
    []
  )

  // 最新数据列表
  const latestData = useMemo(
    () => [
      {
        title: "人工智能发展白皮书",
        type: "调查报告",
        dataSize: 1250,
        updateDate: "2024-01-15",
      },
      {
        title: "数据安全标准规范",
        type: "法规标准",
        dataSize: 856,
        updateDate: "2024-01-14",
      },
      {
        title: "机器学习最新进展",
        type: "学术论文",
        dataSize: 2103,
        updateDate: "2024-01-13",
      },
      {
        title: "知识图谱应用研究",
        type: "学术论文",
        dataSize: 1587,
        updateDate: "2024-01-12",
      },
      {
        title: "行业数字化转型报告",
        type: "调查报告",
        dataSize: 945,
        updateDate: "2024-01-10",
      },
    ],
    []
  )

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

  // 研究领域选项
  const fieldOptions = useMemo(
    () => [
      "计算机科学",
      "人工智能",
      "数据科学",
      "机器学习",
      "深度学习",
      "自然语言处理",
      "计算机视觉",
      "知识图谱",
    ],
    []
  )

  // 数据源选项
  const dataSourceOptions = useMemo(
    () => [
      { label: "📚 学术论文", value: "academic_papers" },
      { label: "📊 调查报告", value: "survey_reports" },
      { label: "📖 专业书籍", value: "professional_books" },
      { label: "📜 政策文件", value: "policy_documents" },
      { label: "⚖️ 法规标准", value: "regulations" },
    ],
    []
  )

  // 导出格式选项
  const exportOptions = useMemo(() => ["CSV", "Excel", "PDF", "JSON"], [])

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
        data: barData.categories,
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
          data: barData.values,
        },
      ],
    }
  }, [barData, secondaryColor])

  // 处理数据源变更
  const handleDataSourceChange = useCallback((value: string) => {
    setDataSource(value)
    switch (value) {
      case "academic_papers":
        setSubTypeOptions(["期刊论文", "会议论文", "学位论文", "预印本"])
        setSelectedSubTypes(["期刊论文"])
        break
      case "survey_reports":
        setSubTypeOptions(["行业报告", "市场调研", "用户研究", "技术评估"])
        setSelectedSubTypes(["行业报告"])
        break
      case "professional_books":
        setSubTypeOptions(["教材", "专著", "参考书", "技术手册"])
        setSelectedSubTypes(["专著"])
        break
      case "policy_documents":
        setSubTypeOptions(["国家政策", "行业政策", "地方政策", "国际政策"])
        setSelectedSubTypes(["国家政策"])
        break
      case "regulations":
        setSubTypeOptions(["国家标准", "行业标准", "企业标准", "国际标准"])
        setSelectedSubTypes(["国家标准"])
        break
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
  const handleUpdateData = useCallback(() => {
    // 实际项目中这里应该调用API更新数据
    console.log("更新数据", {
      dataSource,
      selectedSubTypes,
      dateRange,
      selectedFields,
    })
  }, [dataSource, selectedSubTypes, dateRange, selectedFields])

  // 处理数据导出
  const handleExportData = useCallback((format: string) => {
    // 实际项目中这里应该调用API导出数据
    console.log("导出数据", { format })
  }, [])

  return (
    <div className="w-full h-full flex overflow-hidden data-display-container">
      {/* 侧边栏 */}
      <div className="w-64 h-full p-4 overflow-y-auto bg-[#1a1f3c] border-r border-[rgba(32,128,192,0.3)]">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold mb-4" style={{ color: themeColor }}>
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
            options={fieldOptions.map((item) => ({ label: item, value: item }))}
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
          >
            更新数据
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
            >
              导出数据
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
  )
}

export default DataDisplayModal
