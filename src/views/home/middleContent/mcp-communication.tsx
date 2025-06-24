import React from "react"
import rightTop from "@/assets/home_svg/rightTop.svg"
interface MCPCommunicationProps {
  title?: string
  themeColor?: string
  secondaryColor?: string
}

export default function MCPCommunication({
  title = "通信流程",
  themeColor = "#00ff7f",
  secondaryColor = "#008060",
}: MCPCommunicationProps) {
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
          src={rightTop}
          alt=""
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  )
}
