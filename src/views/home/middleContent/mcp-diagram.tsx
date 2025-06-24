import React from "react"
import leftTop from "@/assets/home_svg/leftTop.svg"
interface MCPDiagramProps {
  themeColor?: string
  secondaryColor?: string
  title?: string
}

export default function MCPDiagram({
  themeColor = "#7fbca4",
  secondaryColor = "#6b7db3",
  title = "数据采集",
}: MCPDiagramProps) {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <div
        className="overflow-hidden rounded-md flex justify-center items-center"
        style={{
          border: `2px solid ${themeColor}`,
          width: "360px",
          height: "240px",
        }}
      >
        <img
          src={leftTop}
          alt=""
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  )
}
