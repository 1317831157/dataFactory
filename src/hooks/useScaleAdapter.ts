import { useState, useEffect, CSSProperties, useCallback } from "react"

interface ScaleAdapterOptions {
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
   * 是否铺满屏幕宽度，默认false
   */
  fillWidth?: boolean
}

/**
 * 原生scale实现的大屏适配Hook
 * @param options 适配选项
 * @returns 适配相关数据和样式
 */
export const useScaleAdapter = (options: ScaleAdapterOptions = {}) => {
  const {
    width = 1920,
    height = 1080,
    autoScale = true,
    scaleX = true,
    scaleY = true,
    origin = "center",
    fillWidth = true, // 默认铺满宽度
  } = options

  // 缩放比例状态
  const [scale, setScale] = useState({
    x: 1,
    y: 1,
  })

  // 视口尺寸状态
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  // 计算缩放比例
  const calculateScale = useCallback(() => {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    // 更新视口尺寸
    setViewport({
      width: windowWidth,
      height: windowHeight,
    })

    let scaleX = windowWidth / width
    let scaleY = windowHeight / height

    // 如果需要铺满宽度，则优先使用宽度比例
    if (fillWidth) {
      scaleX = windowWidth / width
      scaleY = scaleX // 保持等比例
    }
    // 如果是自动缩放模式，则取最小的缩放比例
    else if (autoScale) {
      const minScale = Math.min(scaleX, scaleY)
      scaleX = minScale
      scaleY = minScale
    }

    // 根据配置决定是否缩放X轴和Y轴
    const newScaleX = scaleX ? scaleX : 1
    const newScaleY = scaleY ? scaleY : 1

    return { x: newScaleX, y: newScaleY }
  }, [width, height, autoScale, scaleX, scaleY, fillWidth])

  // 获取transform-origin
  const getTransformOrigin = useCallback(() => {
    switch (origin) {
      case "top":
        return "top center"
      case "bottom":
        return "bottom center"
      case "left":
        return "center left"
      case "right":
        return "center right"
      case "top-left":
        return "top left"
      case "top-right":
        return "top right"
      case "bottom-left":
        return "bottom left"
      case "bottom-right":
        return "bottom right"
      case "center":
      default:
        return "center"
    }
  }, [origin])

  // 更新缩放比例
  const updateScale = useCallback(() => {
    const newScale = calculateScale()
    setScale(newScale)
    return newScale
  }, [calculateScale])

  // 获取容器外层样式
  const getWrapperStyle = useCallback((): CSSProperties => {
    return {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      overflow: "hidden",
    }
  }, [])

  // 获取容器内层样式
  const getContainerStyle = useCallback((): CSSProperties => {
    // 计算缩放后的尺寸
    const scaledWidth = width * scale.x
    const scaledHeight = height * scale.y

    // 计算水平和垂直居中的位置
    const left = (viewport.width - scaledWidth) / 2
    const top = (viewport.height - scaledHeight) / 2

    let positionStyle: CSSProperties = {}
    const transformStr = `scale(${scale.x}, ${scale.y})`

    // 如果需要铺满宽度，优先考虑水平铺满
    if (fillWidth) {
      positionStyle = {
        position: "absolute",
        left: 0,
        top: "50%",
        transform: `translateY(-50%) ${transformStr}`,
        transformOrigin: "left center",
      }
    } else if (origin === "center") {
      positionStyle = {
        position: "absolute",
        left: "50%",
        top: "50%",
        marginLeft: `-${width / 2}px`,
        marginTop: `-${height / 2}px`,
        transform: transformStr,
        transformOrigin: "center",
      }
    } else if (origin === "top-left") {
      positionStyle = {
        position: "absolute",
        left: 0,
        top: 0,
        transform: transformStr,
        transformOrigin: "top left",
      }
    } else if (origin === "top-right") {
      positionStyle = {
        position: "absolute",
        right: 0,
        top: 0,
        transform: transformStr,
        transformOrigin: "top right",
      }
    } else if (origin === "bottom-left") {
      positionStyle = {
        position: "absolute",
        left: 0,
        bottom: 0,
        transform: transformStr,
        transformOrigin: "bottom left",
      }
    } else if (origin === "bottom-right") {
      positionStyle = {
        position: "absolute",
        right: 0,
        bottom: 0,
        transform: transformStr,
        transformOrigin: "bottom right",
      }
    } else if (origin === "top") {
      positionStyle = {
        position: "absolute",
        left: left,
        top: 0,
        transform: transformStr,
        transformOrigin: "top center",
      }
    } else if (origin === "bottom") {
      positionStyle = {
        position: "absolute",
        left: left,
        bottom: 0,
        transform: transformStr,
        transformOrigin: "bottom center",
      }
    } else if (origin === "left") {
      positionStyle = {
        position: "absolute",
        left: 0,
        top: top,
        transform: transformStr,
        transformOrigin: "center left",
      }
    } else if (origin === "right") {
      positionStyle = {
        position: "absolute",
        right: 0,
        top: top,
        transform: transformStr,
        transformOrigin: "center right",
      }
    }

    return {
      width: `${width}px`,
      height: `${height}px`,
      ...positionStyle,
    }
  }, [width, height, scale, origin, viewport, fillWidth])

  // 监听窗口大小变化
  useEffect(() => {
    // 初始化缩放
    updateScale()

    // 窗口大小变化时重新计算缩放比例
    const handleResize = () => {
      updateScale()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [updateScale])

  return {
    scale,
    getContainerStyle,
    getWrapperStyle,
    updateScale,
  }
}
