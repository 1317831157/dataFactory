import { useState } from "react"

/**
 * 自定义Hook用于管理弹窗状态
 * @returns 弹窗状态和控制函数
 */
const useModal = () => {
  const [open, setOpen] = useState(false)

  // 打开弹窗
  const handleOpen = () => {
    setOpen(true)
  }

  // 关闭弹窗
  const handleClose = () => {
    setOpen(false)
  }

  return {
    open,
    handleOpen,
    handleClose,
  }
}

export default useModal
