import React from "react"
import { Tabs } from "antd"

interface DataAnalysisModalProps {
  themeColor: string
  secondaryColor: string
}

const DataAnalysisModal: React.FC<DataAnalysisModalProps> = ({
  themeColor,
  secondaryColor,
}) => {
  const items = [
    {
      key: "1",
      label: "统计分析",
      children: (
        <div className="p-4">
          <h3 className="text-lg font-bold mb-3" style={{ color: themeColor }}>
            统计分析
          </h3>
          <p className="mb-2">数据统计分析能力：</p>
          <ul className="list-disc pl-5">
            <li>描述性统计</li>
            <li>相关性分析</li>
            <li>回归分析</li>
            <li>假设检验</li>
            <li>方差分析</li>
            <li>时间序列分析</li>
          </ul>
        </div>
      ),
    },
    {
      key: "2",
      label: "智能分析",
      children: (
        <div className="p-4">
          <h3 className="text-lg font-bold mb-3" style={{ color: themeColor }}>
            智能分析
          </h3>
          <p className="mb-2">高级分析能力：</p>
          <ul className="list-disc pl-5">
            <li>预测分析</li>
            <li>聚类分析</li>
            <li>异常检测</li>
            <li>模式识别</li>
            <li>因果分析</li>
            <li>关联规则挖掘</li>
          </ul>
        </div>
      ),
    },
    {
      key: "3",
      label: "分析工具",
      children: (
        <div className="p-4">
          <h3 className="text-lg font-bold mb-3" style={{ color: themeColor }}>
            分析工具
          </h3>
          <p className="mb-2">分析支持工具：</p>
          <ul className="list-disc pl-5">
            <li>可视化分析</li>
            <li>交互式探索</li>
            <li>SQL分析</li>
            <li>报表生成</li>
            <li>结果导出</li>
            <li>分析模板</li>
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

export default DataAnalysisModal
