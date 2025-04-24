import React from "react"
import { Tabs } from "antd"

interface DataProcessingModalProps {
  themeColor: string
  secondaryColor: string
}

const DataProcessingModal: React.FC<DataProcessingModalProps> = ({
  themeColor,
  secondaryColor,
}) => {
  const items = [
    {
      key: "1",
      label: "数据清洗",
      children: (
        <div className="p-4">
          <h3 className="text-lg font-bold mb-3" style={{ color: themeColor }}>
            数据清洗
          </h3>
          <p className="mb-2">数据预处理功能：</p>
          <ul className="list-disc pl-5">
            <li>异常值处理</li>
            <li>缺失值填充</li>
            <li>重复数据去除</li>
            <li>数据格式转换</li>
            <li>噪声过滤</li>
          </ul>
        </div>
      ),
    },
    {
      key: "2",
      label: "数据转换",
      children: (
        <div className="p-4">
          <h3 className="text-lg font-bold mb-3" style={{ color: themeColor }}>
            数据转换
          </h3>
          <p className="mb-2">数据转换处理：</p>
          <ul className="list-disc pl-5">
            <li>数据聚合计算</li>
            <li>特征提取</li>
            <li>时间序列处理</li>
            <li>数据标准化/归一化</li>
            <li>数据分箱</li>
          </ul>
        </div>
      ),
    },
    {
      key: "3",
      label: "任务配置",
      children: (
        <div className="p-4">
          <h3 className="text-lg font-bold mb-3" style={{ color: themeColor }}>
            任务配置
          </h3>
          <p className="mb-2">数据处理任务配置：</p>
          <ul className="list-disc pl-5">
            <li>处理流程配置</li>
            <li>规则设置</li>
            <li>调度配置</li>
            <li>资源配置</li>
            <li>任务监控</li>
          </ul>
        </div>
      ),
    },
  ]

  return (
    <div>
      <Tabs
        items={items}
        type="card"
        tabBarStyle={{
          color: secondaryColor,
          borderBottom: `1px solid ${secondaryColor}`,
        }}
      />
    </div>
  )
}

export default DataProcessingModal
