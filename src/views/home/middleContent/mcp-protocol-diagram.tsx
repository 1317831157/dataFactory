import React from "react"

interface MCPProtocolDiagramProps {
  title?: string
  themeColor?: string
  secondaryColor?: string
}

export default function MCPProtocolDiagram({
  title = "协议图",
  themeColor = "#ffaa00",
  secondaryColor = "#cc8800",
}: MCPProtocolDiagramProps) {
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
          y="40"
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
          y="30"
          fontFamily="Arial"
          fontSize="24"
          fontWeight="bold"
          fill="white"
          textAnchor="middle"
        >
          {title}
        </text>

        {/* MCP Host 标签 */}
        <text
          x="35"
          y="70"
          fontFamily="Arial"
          fontSize="18"
          fontWeight="bold"
          fill={themeColor}
        >
          MCP Host
        </text>

        {/* 黄色背景区域 */}
        <rect
          x="35"
          y="90"
          width="730"
          height="380"
          rx="15"
          ry="15"
          fill={secondaryColor}
          stroke={themeColor}
          strokeWidth="1"
          fillOpacity="0.2"
        />

        {/* 第一行 - Claude */}
        <g transform="translate(100, 150)">
          {/* Claude 图标和文本 */}
          <text
            x="0"
            y="0"
            fontFamily="Arial"
            fontSize="16"
            fontWeight="bold"
            fill="white"
          >
            ✨ Claude
          </text>
          <text x="0" y="20" fontFamily="Arial" fontSize="12" fill="#bbb">
            Claude Desktop
          </text>

          {/* MCP Client */}
          <rect
            x="120"
            y="-20"
            width="80"
            height="40"
            rx="5"
            ry="5"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <text
            x="160"
            y="5"
            fontFamily="Arial"
            fontSize="12"
            textAnchor="middle"
            fill="white"
          >
            MCP
          </text>
          <text
            x="160"
            y="20"
            fontFamily="Arial"
            fontSize="12"
            textAnchor="middle"
            fill="white"
          >
            Client
          </text>

          {/* 箭头 */}
          <line
            x1="200"
            y1="0"
            x2="250"
            y2="0"
            stroke={themeColor}
            strokeWidth="1"
          />
          <polygon points="250,0 245,-5 245,5" fill={themeColor} />
          <text
            x="225"
            y="-10"
            fontFamily="Arial"
            fontSize="12"
            textAnchor="middle"
            fill={themeColor}
          >
            MCP
          </text>

          {/* MCP Server */}
          <rect
            x="250"
            y="-20"
            width="80"
            height="40"
            rx="5"
            ry="5"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <text
            x="290"
            y="5"
            fontFamily="Arial"
            fontSize="12"
            textAnchor="middle"
            fill="white"
          >
            MCP Server
          </text>

          {/* 箭头到文件系统 */}
          <line
            x1="330"
            y1="0"
            x2="380"
            y2="0"
            stroke={themeColor}
            strokeWidth="1"
          />
          <polygon points="380,0 375,-5 375,5" fill={themeColor} />

          {/* 本地文件系统 */}
          <g transform="translate(420, 0)">
            <rect
              x="-30"
              y="-25"
              width="50"
              height="50"
              fill="none"
              stroke={themeColor}
              strokeWidth="1"
            />
            <rect
              x="-20"
              y="-15"
              width="40"
              height="30"
              fill="none"
              stroke="white"
              strokeWidth="1"
            />
            <rect
              x="-15"
              y="-10"
              width="10"
              height="5"
              fill="white"
              stroke="none"
            />
            <rect
              x="-15"
              y="0"
              width="10"
              height="5"
              fill="white"
              stroke="none"
            />
            <rect
              x="-15"
              y="10"
              width="10"
              height="5"
              fill="white"
              stroke="none"
            />
            <text
              x="0"
              y="40"
              fontFamily="Arial"
              fontSize="12"
              textAnchor="middle"
              fill="white"
            >
              Local Filesystem
            </text>
          </g>
        </g>

        {/* 第二行 - JIT */}
        <g transform="translate(100, 250)">
          {/* JIT 图标和文本 */}
          <rect
            x="20"
            y="-20"
            width="40"
            height="40"
            rx="5"
            ry="5"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <text
            x="40"
            y="5"
            fontFamily="Courier New"
            fontSize="14"
            textAnchor="middle"
            fill="white"
          >
            &lt;/&gt;
          </text>
          <text
            x="40"
            y="30"
            fontFamily="Arial"
            fontSize="12"
            textAnchor="middle"
            fill="white"
          >
            JIT
          </text>

          {/* MCP Client */}
          <rect
            x="120"
            y="-20"
            width="80"
            height="40"
            rx="5"
            ry="5"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <text
            x="160"
            y="5"
            fontFamily="Arial"
            fontSize="12"
            textAnchor="middle"
            fill="white"
          >
            MCP
          </text>
          <text
            x="160"
            y="20"
            fontFamily="Arial"
            fontSize="12"
            textAnchor="middle"
            fill="white"
          >
            Client
          </text>

          {/* 箭头 */}
          <line
            x1="200"
            y1="0"
            x2="250"
            y2="0"
            stroke={themeColor}
            strokeWidth="1"
          />
          <polygon points="250,0 245,-5 245,5" fill={themeColor} />
          <text
            x="225"
            y="-10"
            fontFamily="Arial"
            fontSize="12"
            textAnchor="middle"
            fill={themeColor}
          >
            MCP
          </text>

          {/* MCP Server */}
          <rect
            x="250"
            y="-20"
            width="80"
            height="40"
            rx="5"
            ry="5"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <text
            x="290"
            y="5"
            fontFamily="Arial"
            fontSize="12"
            textAnchor="middle"
            fill="white"
          >
            MCP Server
          </text>

          {/* 虚线箭头到数据库 */}
          <line
            x1="330"
            y1="0"
            x2="380"
            y2="0"
            stroke={themeColor}
            strokeWidth="1"
            strokeDasharray="5,5"
          />
          <polygon points="380,0 375,-5 375,5" fill={themeColor} />

          {/* 数据库 */}
          <g transform="translate(420, 0)">
            <ellipse
              cx="0"
              cy="-15"
              rx="25"
              ry="10"
              fill="none"
              stroke="white"
              strokeWidth="1"
            />
            <rect
              x="-25"
              y="-15"
              width="50"
              height="40"
              fill="none"
              stroke="white"
              strokeWidth="1"
            />
            <ellipse
              cx="0"
              cy="25"
              rx="25"
              ry="10"
              fill="none"
              stroke="white"
              strokeWidth="1"
            />
            <line
              x1="-25"
              y1="0"
              x2="25"
              y2="0"
              stroke="white"
              strokeWidth="1"
            />
            <line
              x1="-25"
              y1="15"
              x2="25"
              y2="15"
              stroke="white"
              strokeWidth="1"
            />
            <text
              x="0"
              y="50"
              fontFamily="Arial"
              fontSize="12"
              textAnchor="middle"
              fill="white"
            >
              Database
            </text>
          </g>
        </g>

        {/* 第三行 - AI Think */}
        <g transform="translate(100, 350)">
          {/* AI Think 图标和文本 */}
          <rect
            x="20"
            y="-25"
            width="40"
            height="50"
            rx="5"
            ry="5"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <rect
            x="25"
            y="-20"
            width="30"
            height="40"
            rx="2"
            ry="2"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <rect
            x="30"
            y="-15"
            width="20"
            height="30"
            rx="1"
            ry="1"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <text
            x="40"
            y="40"
            fontFamily="Arial"
            fontSize="12"
            textAnchor="middle"
            fill="white"
          >
            AI Think
          </text>

          {/* MCP Client */}
          <rect
            x="120"
            y="-20"
            width="80"
            height="40"
            rx="5"
            ry="5"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <text
            x="160"
            y="5"
            fontFamily="Arial"
            fontSize="12"
            textAnchor="middle"
            fill="white"
          >
            MCP
          </text>
          <text
            x="160"
            y="20"
            fontFamily="Arial"
            fontSize="12"
            textAnchor="middle"
            fill="white"
          >
            Client
          </text>

          {/* 箭头 */}
          <line
            x1="200"
            y1="0"
            x2="250"
            y2="0"
            stroke={themeColor}
            strokeWidth="1"
          />
          <polygon points="250,0 245,-5 245,5" fill={themeColor} />
          <text
            x="225"
            y="-10"
            fontFamily="Arial"
            fontSize="12"
            textAnchor="middle"
            fill={themeColor}
          >
            MCP
          </text>

          {/* MCP Server */}
          <rect
            x="250"
            y="-20"
            width="80"
            height="40"
            rx="5"
            ry="5"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <text
            x="290"
            y="5"
            fontFamily="Arial"
            fontSize="12"
            textAnchor="middle"
            fill="white"
          >
            MCP Server
          </text>

          {/* 箭头到 Web APIs */}
          <line
            x1="330"
            y1="0"
            x2="380"
            y2="0"
            stroke={themeColor}
            strokeWidth="1"
          />
          <polygon points="380,0 375,-5 375,5" fill={themeColor} />

          {/* Web APIs 和图标 */}
          <g transform="translate(420, 0)">
            <text
              x="0"
              y="5"
              fontFamily="Arial"
              fontSize="14"
              textAnchor="middle"
              fill="white"
            >
              Web APIs
            </text>

            {/* 地球图标 */}
            <circle
              cx="-40"
              cy="-15"
              r="15"
              fill="none"
              stroke="white"
              strokeWidth="1"
            />
            <ellipse
              cx="-40"
              cy="-15"
              rx="15"
              ry="8"
              fill="none"
              stroke={themeColor}
              strokeWidth="1"
            />
            <line
              x1="-55"
              y1="-15"
              x2="-25"
              y2="-15"
              stroke={themeColor}
              strokeWidth="1"
            />
            <line
              x1="-40"
              y1="-30"
              x2="-40"
              y2="0"
              stroke={themeColor}
              strokeWidth="1"
            />

            {/* GitHub 图标 */}
            <circle
              cx="0"
              cy="-15"
              r="12"
              fill="none"
              stroke="white"
              strokeWidth="1"
            />
            <path
              d="M0,-23 C-6,-23 -11,-18 -11,-12 C-11,-7 -9,-3 -5,-1 C-4,-1 -4,-2 -4,-2 L-4,-5 C-7,-4 -8,-6 -8,-6 C-9,-7 -9,-7 -9,-7 C-10,-8 -9,-8 -9,-8 C-8,-8 -7,-7 -7,-7 C-6,-5 -4,-6 -4,-6 C-4,-7 -3,-8 -3,-8 C-6,-9 -9,-11 -9,-15 C-9,-17 -8,-18 -7,-19 C-7,-19 -8,-21 -7,-23 C-7,-23 -6,-23 -4,-22 C-3,-22 -2,-22 0,-22 C2,-22 3,-22 4,-22 C6,-23 7,-23 7,-23 C8,-21 7,-19 7,-19 C8,-18 9,-17 9,-15 C9,-11 6,-9 3,-8 C3,-8 4,-7 4,-6 C4,-4 4,-2 4,-2 C4,-2 4,-1 5,-1 C9,-3 11,-7 11,-12 C11,-18 6,-23 0,-23 Z"
              fill="none"
              stroke="white"
              strokeWidth="1"
            />

            {/* 另一个服务图标 */}
            <rect
              x="30"
              y="-25"
              width="20"
              height="20"
              rx="3"
              ry="3"
              fill="none"
              stroke={themeColor}
              strokeWidth="1"
            />
            <circle
              cx="40"
              cy="-15"
              r="5"
              fill="none"
              stroke="white"
              strokeWidth="1"
            />
          </g>
        </g>

        {/* 服务器图标细节 */}
        <g transform="translate(390, 150)">
          <rect
            x="-15"
            y="-10"
            width="30"
            height="6"
            rx="1"
            ry="1"
            fill="none"
            stroke={themeColor}
            strokeWidth="0.5"
          />
          <rect
            x="-15"
            y="-2"
            width="30"
            height="6"
            rx="1"
            ry="1"
            fill="none"
            stroke={themeColor}
            strokeWidth="0.5"
          />
          <rect
            x="-15"
            y="6"
            width="30"
            height="6"
            rx="1"
            ry="1"
            fill="none"
            stroke={themeColor}
            strokeWidth="0.5"
          />
        </g>

        <g transform="translate(390, 250)">
          <rect
            x="-15"
            y="-10"
            width="30"
            height="6"
            rx="1"
            ry="1"
            fill="none"
            stroke={themeColor}
            strokeWidth="0.5"
          />
          <rect
            x="-15"
            y="-2"
            width="30"
            height="6"
            rx="1"
            ry="1"
            fill="none"
            stroke={themeColor}
            strokeWidth="0.5"
          />
          <rect
            x="-15"
            y="6"
            width="30"
            height="6"
            rx="1"
            ry="1"
            fill="none"
            stroke={themeColor}
            strokeWidth="0.5"
          />
        </g>

        <g transform="translate(390, 350)">
          <rect
            x="-15"
            y="-10"
            width="30"
            height="6"
            rx="1"
            ry="1"
            fill="none"
            stroke={themeColor}
            strokeWidth="0.5"
          />
          <rect
            x="-15"
            y="-2"
            width="30"
            height="6"
            rx="1"
            ry="1"
            fill="none"
            stroke={themeColor}
            strokeWidth="0.5"
          />
          <rect
            x="-15"
            y="6"
            width="30"
            height="6"
            rx="1"
            ry="1"
            fill="none"
            stroke={themeColor}
            strokeWidth="0.5"
          />
        </g>

        {/* 底部注释 */}
        <text
          x="400"
          y="460"
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
