import React from "react"
import leftBottom from "@/assets/home_svg/leftBottom.svg"
interface MCPProtocolDiagramProps {
  title?: string
  themeColor?: string
  secondaryColor?: string
}

export default function MCPProtocolDiagram({
  title = "数据处理",
  themeColor = "#ffaa00",
  secondaryColor = "#cc8800",
}: MCPProtocolDiagramProps) {
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
          src={leftBottom}
          alt=""
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  )
}
