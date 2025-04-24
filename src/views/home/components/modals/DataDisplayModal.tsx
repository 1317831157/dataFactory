import React from "react"
import { Tabs } from "antd"

interface DataDisplayModalProps {
  themeColor: string
  secondaryColor: string
}

const DataDisplayModal: React.FC<DataDisplayModalProps> = ({
  themeColor,
  secondaryColor,
}) => {
  const items = [
    {
      key: "1",
      label: "图表类型",
      children: (
        <div className="p-4">
          <h3 className="text-lg font-bold mb-3" style={{ color: themeColor }}>
            图表类型
          </h3>
          <p className="mb-2">支持多种图表类型：</p>
          <ul className="list-disc pl-5">
            <li>折线图/曲线图</li>
            <li>柱状图/条形图</li>
            <li>饼图/环形图</li>
            <li>散点图/气泡图</li>
            <li>仪表盘/指标卡</li>
            <li>热力图/地图</li>
          </ul>
        </div>
      ),
    },
    {
      key: "2",
      label: "大屏配置",
      children: (
        <div className="p-4">
          <h3 className="text-lg font-bold mb-3" style={{ color: themeColor }}>
            大屏配置
          </h3>
          <p className="mb-2">数据大屏功能：</p>
          <ul className="list-disc pl-5">
            <li>布局设计</li>
            <li>主题配置</li>
            <li>组件拖拽</li>
            <li>数据绑定</li>
            <li>刷新策略</li>
            <li>展示模式</li>
          </ul>
        </div>
      ),
    },
    {
      key: "3",
      label: "交互功能",
      children: (
        <div className="p-4">
          <h3 className="text-lg font-bold mb-3" style={{ color: themeColor }}>
            交互功能
          </h3>
          <p className="mb-2">丰富的交互能力：</p>
          <ul className="list-disc pl-5">
            <li>钻取分析</li>
            <li>联动筛选</li>
            <li>悬浮提示</li>
            <li>缩放平移</li>
            <li>点击事件</li>
            <li>导出分享</li>
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

export default DataDisplayModal
