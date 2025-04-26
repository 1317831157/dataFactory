import React from "react"

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
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 800 500"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 背景和标题 */}
        <rect
          x="0"
          y="20"
          width="800"
          height="460"
          rx="20"
          ry="20"
          fill="#000e17"
          stroke={themeColor}
          strokeWidth="2"
          fillOpacity="0.7"
        />

        {/* 标题 */}
        <text
          x="400"
          y="60"
          fontFamily="Arial"
          fontSize="22"
          fontWeight="bold"
          fill={themeColor}
          textAnchor="middle"
        >
          {title}
        </text>

        {/* 左上 MCP Client */}
        <g transform="translate(150, 130)">
          <rect
            x="-50"
            y="-40"
            width="100"
            height="80"
            rx="10"
            ry="10"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          <circle
            cx="0"
            cy="0"
            r="25"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          <path
            d="M0,-15 A15,15 0 0,1 0,15 A15,15 0 0,1 0,-15 Z"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          <path d="M-15,0 L15,0 M0,-15 L0,15" stroke="white" strokeWidth="2" />
          <text
            x="0"
            y="56"
            fontFamily="Arial"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
            fill="white"
          >
            MCP Client
          </text>
        </g>

        {/* 右上 MCP Server */}
        <g transform="translate(650, 130)">
          <rect
            x="-50"
            y="-40"
            width="100"
            height="80"
            rx="10"
            ry="10"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          <rect
            x="-25"
            y="-15"
            width="50"
            height="10"
            rx="2"
            ry="2"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <rect
            x="-25"
            y="-5"
            width="50"
            height="10"
            rx="2"
            ry="2"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <rect
            x="-25"
            y="5"
            width="50"
            height="10"
            rx="2"
            ry="2"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <circle cx="-15" cy="-10" r="2" fill={themeColor} />
          <circle cx="-15" cy="0" r="2" fill={themeColor} />
          <circle cx="-15" cy="10" r="2" fill={themeColor} />
          <text
            x="0"
            y="56"
            fontFamily="Arial"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
            fill="white"
          >
            MCP Server
          </text>
        </g>

        {/* 左下 MCP Client */}
        <g transform="translate(150, 330)">
          <rect
            x="-50"
            y="-40"
            width="100"
            height="80"
            rx="10"
            ry="10"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          <circle
            cx="0"
            cy="0"
            r="25"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          <path
            d="M0,-15 A15,15 0 0,1 0,15 A15,15 0 0,1 0,-15 Z"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          <path d="M-15,0 L15,0 M0,-15 L0,15" stroke="white" strokeWidth="2" />
          <text
            x="0"
            y="58"
            fontFamily="Arial"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
            fill="white"
          >
            MCP Client
          </text>
        </g>

        {/* 右下 MCP Server */}
        <g transform="translate(650, 330)">
          <rect
            x="-50"
            y="-40"
            width="100"
            height="80"
            rx="10"
            ry="10"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          <rect
            x="-25"
            y="-15"
            width="50"
            height="10"
            rx="2"
            ry="2"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <rect
            x="-25"
            y="-5"
            width="50"
            height="10"
            rx="2"
            ry="2"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <rect
            x="-25"
            y="5"
            width="50"
            height="10"
            rx="2"
            ry="2"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <circle cx="-15" cy="-10" r="2" fill={themeColor} />
          <circle cx="-15" cy="0" r="2" fill={themeColor} />
          <circle cx="-15" cy="10" r="2" fill={themeColor} />
          <text
            x="0"
            y="60"
            fontFamily="Arial"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
            fill="white"
          >
            MCP Server
          </text>
        </g>

        {/* 垂直连接线 */}
        <line
          x1="150"
          y1="170"
          x2="150"
          y2="290"
          stroke={themeColor}
          strokeWidth="1"
          strokeDasharray="5,5"
        />
        <line
          x1="650"
          y1="170"
          x2="650"
          y2="290"
          stroke={themeColor}
          strokeWidth="1"
          strokeDasharray="5,5"
        />

        {/* 箭头1：初始请求 */}
        <line
          x1="170"
          y1="130"
          x2="630"
          y2="130"
          stroke={themeColor}
          strokeWidth="1"
          strokeDasharray="5,5"
        />
        <polygon points="630,130 625,127 625,133" fill={themeColor} />
        <circle
          cx="300"
          cy="130"
          r="15"
          fill="none"
          stroke={themeColor}
          strokeWidth="1"
        />
        <text
          x="300"
          y="135"
          fontFamily="Arial"
          fontSize="14"
          fontWeight="bold"
          textAnchor="middle"
          fill="white"
        >
          1
        </text>
        <text
          x="400"
          y="115"
          fontFamily="Arial"
          fontSize="14"
          fontWeight="normal"
          textAnchor="middle"
          fill="white"
        >
          初始请求
        </text>

        {/* 箭头2：初始响应 */}
        <line
          x1="630"
          y1="180"
          x2="170"
          y2="180"
          stroke={themeColor}
          strokeWidth="1"
          strokeDasharray="5,5"
        />
        <polygon points="170,180 175,177 175,183" fill={themeColor} />
        <circle
          cx="300"
          cy="180"
          r="15"
          fill="none"
          stroke={themeColor}
          strokeWidth="1"
        />
        <text
          x="300"
          y="185"
          fontFamily="Arial"
          fontSize="14"
          fontWeight="bold"
          textAnchor="middle"
          fill="white"
        >
          2
        </text>
        <text
          x="400"
          y="165"
          fontFamily="Arial"
          fontSize="14"
          fontWeight="normal"
          textAnchor="middle"
          fill="white"
        >
          初始响应
        </text>

        {/* 箭头3：通知 */}
        <line
          x1="170"
          y1="230"
          x2="630"
          y2="230"
          stroke={themeColor}
          strokeWidth="1"
          strokeDasharray="5,5"
        />
        <polygon points="630,230 625,227 625,233" fill={themeColor} />
        <circle
          cx="300"
          cy="230"
          r="15"
          fill="none"
          stroke={themeColor}
          strokeWidth="1"
        />
        <text
          x="300"
          y="235"
          fontFamily="Arial"
          fontSize="14"
          fontWeight="bold"
          textAnchor="middle"
          fill="white"
        >
          3
        </text>
        <text
          x="400"
          y="215"
          fontFamily="Arial"
          fontSize="14"
          fontWeight="normal"
          textAnchor="middle"
          fill="white"
        >
          通知
        </text>

        {/* 准备消息交换 */}
        <rect
          x="200"
          y="280"
          width="400"
          height="40"
          rx="10"
          fill="none"
          stroke={themeColor}
          strokeWidth="1"
          strokeDasharray="5,5"
          fillOpacity="0.2"
        />
        <text
          x="400"
          y="305"
          fontFamily="Arial"
          fontSize="16"
          fontWeight="normal"
          textAnchor="middle"
          fill="white"
        >
          准备消息交换
        </text>

        {/* 底部注释 */}
        <text
          x="400"
          y="440"
          fontFamily="Arial"
          fontSize="16"
          fontWeight="bold"
          fill={themeColor}
          textAnchor="middle"
        >
          MCP - 通信流程
        </text>
      </svg>
    </div>
  )
}
