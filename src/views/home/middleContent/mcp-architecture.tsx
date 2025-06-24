import React from "react"
import rightBottom from "@/assets/home_svg/rightBottom.svg"
interface MCPArchitectureProps {
  title?: string
  themeColor?: string
  secondaryColor?: string
}

export default function MCPArchitecture({
  title = "架构图",
  themeColor = "#ff6b00",
  secondaryColor = "#b94b00",
}: MCPArchitectureProps) {
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
          src={rightBottom}
          alt=""
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  )
}
