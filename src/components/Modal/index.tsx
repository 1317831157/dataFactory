import React, { ReactNode, useEffect } from "react"
import { Modal as AntdModal } from "antd"
import "./index.css"
interface ModalProps {
  title: string
  open: boolean
  onClose: () => void
  width?: number | string
  themeColor?: string
  secondaryColor?: string
  children: ReactNode
}

const Modal: React.FC<ModalProps> = ({
  title,
  open,
  onClose,
  width = 1200, // 增加默认宽度
  themeColor = "#00ffff",
  secondaryColor = "#0066ff",
  children,
}) => {
  // 弹窗打开时添加特殊样式
  useEffect(() => {
    // 为modal元素添加自定义样式的函数
    const addModalStyles = () => {
      const modalElements = document.querySelectorAll(
        ".ant-modal, .ant-modal-content"
      )
      modalElements.forEach((elem) => {
        if (elem instanceof HTMLElement) {
          elem.style.backgroundColor = "rgba(0, 14, 23, 0.95)"
          elem.style.borderRadius = "8px"
          elem.style.boxShadow = `0 0 20px ${themeColor}40, 0 0 40px ${secondaryColor}20`
        }
      })

      // 添加网格背景到弹窗内容
      const modalContent = document.querySelector(".ant-modal-body")
      if (modalContent instanceof HTMLElement) {
        modalContent.style.backgroundImage =
          "linear-gradient(rgba(24, 144, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(24, 144, 255, 0.05) 1px, transparent 1px)"
        modalContent.style.backgroundSize = "20px 20px"
        modalContent.style.backgroundPosition = "center center"
      }
    }

    if (open) {
      // 等待弹窗渲染后添加样式
      setTimeout(addModalStyles, 100)
    }
  }, [open, themeColor, secondaryColor])

  return (
    <AntdModal
      classNames={{
        header: "modal-header",
      }}
      title={
        <div
          style={{
            color: themeColor,
            borderBottom: `2px solid ${secondaryColor}`,
            paddingBottom: "8px",
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* 添加标题左侧装饰 */}
          <span
            style={{
              display: "inline-block",
              width: "4px",
              height: "20px",
              background: `linear-gradient(to bottom, ${themeColor}, ${secondaryColor})`,
              marginRight: "10px",
              borderRadius: "2px",
            }}
          />
          {title}
          {/* 添加右侧装饰线 */}
          <div
            style={{
              position: "absolute",
              right: "0",
              top: "50%",
              transform: "translateY(-50%)",
              width: "80px",
              height: "2px",
              background: `linear-gradient(to right, transparent, ${themeColor})`,
            }}
          />
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={width}
      destroyOnClose
      maskClosable={false}
      centered
      bodyStyle={{
        padding: "24px",
        maxHeight: "80vh", // 增加高度
        overflow: "auto",
        color: "#e6f7ff",
      }}
      // 添加更多样式
      style={{
        top: "10px", // 调整弹窗位置
      }}
      className="tech-modal" // 添加自定义类名
      // 自定义关闭按钮样式
      closeIcon={
        <div
          style={{
            color: themeColor,
            fontSize: "16px",
            transition: "all 0.3s",
            transform: "scale(1.2)",
          }}
        >
          ✕
        </div>
      }
    >
      {/* 弹窗内容容器 */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* 左上角装饰 */}
        <div
          style={{
            position: "absolute",
            top: "-8px",
            left: "-8px",
            width: "20px",
            height: "20px",
            borderTop: `2px solid ${themeColor}`,
            borderLeft: `2px solid ${themeColor}`,
            opacity: 0.8,
          }}
        />

        {/* 右上角装饰 */}
        <div
          style={{
            position: "absolute",
            top: "-8px",
            right: "-8px",
            width: "20px",
            height: "20px",
            borderTop: `2px solid ${themeColor}`,
            borderRight: `2px solid ${themeColor}`,
            opacity: 0.8,
          }}
        />

        {/* 左下角装饰 */}
        <div
          style={{
            position: "absolute",
            bottom: "-8px",
            left: "-8px",
            width: "20px",
            height: "20px",
            borderBottom: `2px solid ${themeColor}`,
            borderLeft: `2px solid ${themeColor}`,
            opacity: 0.8,
          }}
        />

        {/* 右下角装饰 */}
        <div
          style={{
            position: "absolute",
            bottom: "-8px",
            right: "-8px",
            width: "20px",
            height: "20px",
            borderBottom: `2px solid ${themeColor}`,
            borderRight: `2px solid ${themeColor}`,
            opacity: 0.8,
          }}
        />

        {children}
      </div>
    </AntdModal>
  )
}

export default Modal
