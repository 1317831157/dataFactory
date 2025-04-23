import React from "react"

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
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 800 700"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 背景 */}
        <rect
          x="10"
          y="10"
          width="780"
          height="680"
          rx="40"
          ry="40"
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
          fontSize="30"
          fontWeight="bold"
          fill="white"
          textAnchor="middle"
        >
          {title}
        </text>

        {/* 中心 MCP 框 */}
        <g transform="translate(400, 350)">
          <rect
            x="-100"
            y="-50"
            width="200"
            height="100"
            rx="10"
            ry="10"
            fill={secondaryColor}
            opacity="0.7"
            stroke={themeColor}
            strokeWidth="2"
          />
          <text
            x="0"
            y="15"
            fontFamily="Arial"
            fontSize="28"
            fontWeight="bold"
            fill="white"
            textAnchor="middle"
          >
            MCP Core
          </text>
        </g>

        {/* MCP Client */}
        <g transform="translate(150, 150)">
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
          <path
            d="M-10,-10 A14,14 0 0,1 10,-10"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M-10,10 A14,14 0 0,1 10,10"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
          <text
            x="0"
            y="50"
            fontFamily="Arial"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
            fill="white"
          >
            MCP Client
          </text>
        </g>

        {/* MCP Server */}
        <g transform="translate(650, 150)">
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
          <line
            x1="-5"
            y1="-10"
            x2="15"
            y2="-10"
            stroke="white"
            strokeWidth="1"
          />
          <line x1="-5" y1="0" x2="15" y2="0" stroke="white" strokeWidth="1" />
          <line
            x1="-5"
            y1="10"
            x2="15"
            y2="10"
            stroke="white"
            strokeWidth="1"
          />
          <text
            x="0"
            y="50"
            fontFamily="Arial"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
            fill="white"
          >
            MCP Server
          </text>
        </g>

        {/* Transport Layers */}
        <line
          x1="200"
          y1="150"
          x2="600"
          y2="150"
          stroke={themeColor}
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        <text
          x="400"
          y="135"
          fontFamily="Arial"
          fontSize="14"
          fontWeight="bold"
          textAnchor="middle"
          fill="white"
        >
          Transport Layers
        </text>

        {/* 底部模块 */}
        {/* Notification */}
        <g transform="translate(100, 500)">
          <rect
            x="-40"
            y="-40"
            width="80"
            height="80"
            rx="5"
            ry="5"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <circle
            cx="0"
            cy="-10"
            r="15"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <rect
            x="-10"
            y="5"
            width="20"
            height="25"
            rx="2"
            ry="2"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <path
            d="M-15,5 L-10,0 L10,0 L15,5"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <text
            x="0"
            y="50"
            fontFamily="Arial"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
            fill="white"
          >
            Notification
          </text>
        </g>

        {/* Sampling */}
        <g transform="translate(220, 500)">
          <rect
            x="-40"
            y="-40"
            width="80"
            height="80"
            rx="5"
            ry="5"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <circle
            cx="0"
            cy="0"
            r="20"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          <circle
            cx="0"
            cy="0"
            r="15"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          <circle
            cx="0"
            cy="0"
            r="10"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          <circle cx="0" cy="0" r="5" fill={themeColor} />
          <text
            x="0"
            y="50"
            fontFamily="Arial"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
            fill="white"
          >
            Sampling
          </text>
        </g>

        {/* Tools */}
        <g transform="translate(550, 500)">
          <rect
            x="-40"
            y="-40"
            width="80"
            height="80"
            rx="5"
            ry="5"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <path
            d="M-15,-15 L0,-5 L15,-15 L5,0 L15,15 L0,5 L-15,15 L-5,0 Z"
            fill="none"
            stroke={themeColor}
            strokeWidth="2"
          />
          <text
            x="0"
            y="50"
            fontFamily="Arial"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
            fill="white"
          >
            Tools
          </text>
        </g>

        {/* Resources */}
        <g transform="translate(670, 500)">
          <rect
            x="-40"
            y="-40"
            width="80"
            height="80"
            rx="5"
            ry="5"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <rect
            x="-20"
            y="-15"
            width="35"
            height="25"
            fill="none"
            stroke={themeColor}
            strokeWidth="1"
          />
          <rect
            x="-15"
            y="-10"
            width="35"
            height="25"
            fill="none"
            stroke={themeColor}
            strokeWidth="1"
          />
          <rect
            x="-10"
            y="-5"
            width="35"
            height="25"
            fill="none"
            stroke={themeColor}
            strokeWidth="1"
          />
          <text
            x="0"
            y="50"
            fontFamily="Arial"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
            fill="white"
          >
            Resources
          </text>
        </g>

        {/* 连接线 */}
        {/* Client 到 Notification 和 Sampling */}
        <path
          d="M150,190 L150,300 L100,300 L100,460"
          stroke={themeColor}
          strokeWidth="1"
          strokeDasharray="5,5"
          fill="none"
        />
        <path
          d="M150,190 L150,300 L220,300 L220,460"
          stroke={themeColor}
          strokeWidth="1"
          strokeDasharray="5,5"
          fill="none"
        />

        {/* Server 到 Tools, Resources 和 Protocols */}
        <path
          d="M650,190 L650,300 L550,300 L550,460"
          stroke={themeColor}
          strokeWidth="1"
          strokeDasharray="5,5"
          fill="none"
        />
        <path
          d="M650,190 L650,300 L670,300 L670,460"
          stroke={themeColor}
          strokeWidth="1"
          strokeDasharray="5,5"
          fill="none"
        />
      </svg>
    </div>
  )
}
