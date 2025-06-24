import React, { ReactNode } from "react"

interface ChartCardProps {
  /**
   * 卡片标题
   */
  title?: string
  /**
   * 卡片内容
   */
  children: ReactNode
  /**
   * 额外的样式类
   */
  className?: string
  /**
   * 标题右侧额外内容
   */
  extra?: ReactNode
  /**
   * 背景颜色，默认使用CSS变量 --chart-bg-color
   */
  bgColor?: string
}

/**
 * 图表卡片组件
 * 用于展示各种数据图表的容器组件
 */
const ChartCard: React.FC<ChartCardProps> = ({
  title,
  children,
  className = "",
  extra,
  bgColor = "var(--chart-bg-color)",
}) => {
  return (
    <div
      className={`data-card ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {/* 标题区域，如果提供了标题 */}
      {title && (
        <div className="card-title flex justify-between items-center">
          <div className="text-base font-medium">{title}</div>
          {/* 额外内容区域，如果提供了额外内容 */}
          {extra && <div className="extra">{extra}</div>}
        </div>
      )}

      {/* 内容区域 */}
      <div className="p-3 h-[calc(100%-2.5rem)]">{children}</div>
    </div>
  )
}

export default ChartCard
