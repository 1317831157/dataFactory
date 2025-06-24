import React, { ReactNode } from "react"
import { useScaleAdapter } from "../../hooks/useScaleAdapter"

interface ScaleScreenAdapterProps {
  /**
   * 子组件
   */
  children: ReactNode
  /**
   * 设计稿宽度，默认1920
   */
  width?: number
  /**
   * 设计稿高度，默认1080
   */
  height?: number
  /**
   * 是否根据宽高中较小的比例进行缩放，默认true
   */
  autoScale?: boolean
  /**
   * 是否开启X轴的缩放，默认true
   */
  scaleX?: boolean
  /**
   * 是否开启Y轴的缩放，默认true
   */
  scaleY?: boolean
  /**
   * 缩放的基准点，默认'center'
   */
  origin?:
    | "center"
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
  /**
   * 额外的样式类
   */
  className?: string
  /**
   * 容器背景
   */
  background?: string
  /**
   * 是否铺满屏幕宽度，默认true
   */
  fillWidth?: boolean
}

/**
 * 可视化大屏适配组件
 * 使用原生scale实现等比例缩放适配
 */
const ScaleScreenAdapter: React.FC<ScaleScreenAdapterProps> = ({
  children,
  width = 1920,
  height = 1080,
  autoScale = true,
  scaleX = true,
  scaleY = true,
  origin = "center",
  className = "",
  background,
  fillWidth = true,
}) => {
  // 使用自定义Hook实现适配
  const { getContainerStyle, getWrapperStyle } = useScaleAdapter({
    width,
    height,
    autoScale,
    scaleX,
    scaleY,
    origin,
    fillWidth,
  })

  // 背景样式
  const bgStyle = background
    ? {
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }
    : {}

  return (
    <div className={`screen-wrapper ${className}`} style={getWrapperStyle()}>
      <div
        className="screen-container"
        style={{
          ...getContainerStyle(),
          ...bgStyle,
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default ScaleScreenAdapter
