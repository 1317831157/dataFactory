import { useState, useEffect } from "react"

/**
 * 窗口大小
 */
interface WindowSize {
  width: number
  height: number
  aspectRatio: number
  isWide: boolean
}

/**
 * 监听窗口大小变化的Hook
 * @returns 窗口尺寸信息
 */
export const useWindowSize = (): WindowSize => {
  // 初始窗口大小
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight,
    isWide: window.innerWidth / window.innerHeight >= 16 / 9,
  })

  useEffect(() => {
    // 处理窗口大小变化
    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const aspectRatio = width / height

      setWindowSize({
        width,
        height,
        aspectRatio,
        isWide: aspectRatio >= 16 / 9, // 16:9的宽高比
      })
    }

    // 监听窗口大小变化
    window.addEventListener("resize", handleResize)

    // 清理函数
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return windowSize
}
