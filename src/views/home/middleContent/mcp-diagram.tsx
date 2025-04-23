import React from "react"

interface MCPDiagramProps {
  themeColor?: string
  secondaryColor?: string
  title?: string
}

export default function MCPDiagram({
  themeColor = "#7fbca4",
  secondaryColor = "#6b7db3",
  title = "What is MCP?",
}: MCPDiagramProps) {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 800 700"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Rounded rectangle background */}
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

        {/* Title */}
        <text
          x="400"
          y="80"
          fontFamily="Arial"
          fontSize="40"
          fontWeight="bold"
          fill="white"
          textAnchor="middle"
        >
          {title.split(" ").slice(0, -1).join(" ")}{" "}
          <tspan fill={themeColor}>{title.split(" ").pop()}</tspan>
        </text>

        {/* Database */}
        <g transform="translate(400, 180)">
          <text
            x="-40"
            y="-50"
            fontFamily="Arial"
            fontSize="20"
            textAnchor="middle"
            fill="white"
          >
            Database
          </text>
          <ellipse
            cx="0"
            cy="-20"
            rx="40"
            ry="10"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          <rect
            x="-40"
            y="-20"
            width="80"
            height="60"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          <ellipse
            cx="0"
            cy="40"
            rx="40"
            ry="10"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          <line x1="-30" y1="0" x2="30" y2="0" stroke="white" strokeWidth="1" />
          <line
            x1="-30"
            y1="20"
            x2="30"
            y2="20"
            stroke="white"
            strokeWidth="1"
          />
          <text
            x="0"
            y="290"
            fontFamily="Arial"
            fontSize="20"
            textAnchor="middle"
            fill={themeColor}
          >
            MCP
          </text>
          <line
            x1="0"
            y1="60"
            x2="0"
            y2="320"
            stroke={themeColor}
            strokeDasharray="5,5"
            strokeWidth="2"
          />
        </g>

        {/* Web APIs */}
        <g transform="translate(100, 300)">
          <text
            x="0"
            y="-50"
            fontFamily="Arial"
            fontSize="20"
            textAnchor="middle"
            fill="white"
          >
            Web APIs
          </text>
          <circle cx="0" cy="0" r="40" fill="#2d7dd2" />
          <path
            d="M-25,-10 A30,30 0 0,1 25,-10"
            stroke="white"
            strokeWidth="4"
            fill="none"
          />
          <path
            d="M-25,0 A30,30 0 0,1 25,0"
            stroke="white"
            strokeWidth="4"
            fill="none"
          />
          <path
            d="M-25,10 A30,30 0 0,1 25,10"
            stroke="white"
            strokeWidth="4"
            fill="none"
          />
          <rect x="-20" y="-5" width="40" height="20" fill="#3a86c8" />
          <text
            x="0"
            y="0"
            fontFamily="Arial"
            fontSize="14"
            fill="white"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            WWW
          </text>
          <path d="M30,0 L40,10" stroke="#f7a41d" strokeWidth="4" />
          <text
            x="150"
            y="0"
            fontFamily="Arial"
            fontSize="20"
            textAnchor="middle"
            fill={themeColor}
          >
            MCP
          </text>
          <line
            x1="50"
            y1="0"
            x2="250"
            y2="0"
            stroke={themeColor}
            strokeDasharray="5,5"
            strokeWidth="2"
          />
        </g>

        {/* GitHub */}
        <g transform="translate(700, 300)">
          <text
            x="0"
            y="-50"
            fontFamily="Arial"
            fontSize="20"
            textAnchor="middle"
            fill="white"
          >
            GitHub
          </text>
          <rect
            x="-40"
            y="-40"
            width="80"
            height="80"
            rx="15"
            ry="15"
            fill="#333"
          />
          <path
            d="M0,-20 A20,20 0 0,1 0,20 A20,20 0 0,1 0,-20 Z"
            fill="none"
            stroke="white"
            strokeWidth="4"
          />
          <path d="M0,0 L-15,15 M0,0 L15,15" stroke="white" strokeWidth="4" />
          <text
            x="-150"
            y="0"
            fontFamily="Arial"
            fontSize="20"
            textAnchor="middle"
            fill={themeColor}
          >
            MCP
          </text>
          <line
            x1="-50"
            y1="0"
            x2="-250"
            y2="0"
            stroke={themeColor}
            strokeDasharray="5,5"
            strokeWidth="2"
          />
        </g>

        {/* AI Application */}
        <g transform="translate(400, 420)">
          <rect
            x="-100"
            y="-70"
            width="200"
            height="140"
            rx="20"
            ry="20"
            fill="#0c2336"
            stroke={secondaryColor}
            strokeWidth="2"
          />
          <rect
            x="-30"
            y="-50"
            width="60"
            height="100"
            rx="5"
            ry="5"
            fill="#112e47"
            stroke={secondaryColor}
            strokeWidth="2"
          />
          <rect
            x="-20"
            y="-40"
            width="40"
            height="60"
            fill="#153a5a"
            stroke={secondaryColor}
            strokeWidth="1"
          />
          <rect
            x="-15"
            y="-35"
            width="30"
            height="30"
            fill="#153a5a"
            stroke="#d12a2a"
            strokeWidth="1"
          />
          <text
            x="0"
            y="-20"
            fontFamily="Arial"
            fontSize="16"
            fill="#d12a2a"
            textAnchor="middle"
          >
            AI
          </text>
          <circle cx="0" cy="30" r="5" fill={secondaryColor} />
          <text
            x="0"
            y="70"
            fontFamily="Arial"
            fontSize="20"
            textAnchor="middle"
            fill="white"
          >
            AI Application
          </text>
        </g>

        {/* Slack */}
        <g transform="translate(100, 550)">
          <text
            x="0"
            y="70"
            fontFamily="Arial"
            fontSize="20"
            textAnchor="middle"
            fill="white"
          >
            Slack
          </text>
          <g transform="scale(0.8)">
            <rect
              x="-30"
              y="-30"
              width="20"
              height="20"
              rx="5"
              ry="5"
              fill="#e01e5a"
            />
            <rect
              x="10"
              y="-30"
              width="20"
              height="20"
              rx="5"
              ry="5"
              fill="#36c5f0"
            />
            <rect
              x="-30"
              y="10"
              width="20"
              height="20"
              rx="5"
              ry="5"
              fill="#ecb22e"
            />
            <rect
              x="10"
              y="10"
              width="20"
              height="20"
              rx="5"
              ry="5"
              fill="#2eb67d"
            />
          </g>
          <text
            x="150"
            y="0"
            fontFamily="Arial"
            fontSize="20"
            textAnchor="middle"
            fill={themeColor}
          >
            MCP
          </text>
          <line
            x1="50"
            y1="0"
            x2="250"
            y2="0"
            stroke={themeColor}
            strokeDasharray="5,5"
            strokeWidth="2"
          />
        </g>

        {/* Gmail */}
        <g transform="translate(700, 550)">
          <text
            x="0"
            y="70"
            fontFamily="Arial"
            fontSize="20"
            textAnchor="middle"
            fill="white"
          >
            Gmail
          </text>
          <g transform="scale(0.8)">
            <path d="M-30,-30 L30,-30 L30,30 L-30,30 Z" fill="#4285f4" />
            <path d="M-30,-30 L0,0 L30,-30 Z" fill="#ea4335" />
            <path d="M-30,30 L0,0 L-30,-30 Z" fill="#34a853" />
            <path d="M30,30 L0,0 L30,-30 Z" fill="#fbbc05" />
          </g>
          <text
            x="-150"
            y="0"
            fontFamily="Arial"
            fontSize="20"
            textAnchor="middle"
            fill={themeColor}
          >
            MCP
          </text>
          <line
            x1="-50"
            y1="0"
            x2="-250"
            y2="0"
            stroke={themeColor}
            strokeDasharray="5,5"
            strokeWidth="2"
          />
        </g>

        {/* Local Filesystem */}
        <g transform="translate(400, 600)">
          <text
            x="0"
            y="70"
            fontFamily="Arial"
            fontSize="20"
            textAnchor="middle"
            fill="white"
          >
            Local Filesystem
          </text>
          <rect
            x="-30"
            y="-40"
            width="60"
            height="50"
            fill="#4285f4"
            stroke="white"
            strokeWidth="1"
          />
          <rect
            x="-40"
            y="-50"
            width="80"
            height="15"
            fill="#fbbc05"
            stroke="white"
            strokeWidth="1"
          />
          <circle cx="0" cy="-42" r="5" fill="white" />
          <path
            d="M-10,-25 L10,-25 M-10,-15 L10,-15 M-10,-5 L10,-5"
            stroke="white"
            strokeWidth="2"
          />
          <text
            x="0"
            y="-100"
            fontFamily="Arial"
            fontSize="20"
            textAnchor="middle"
            fill={themeColor}
          >
            MCP
          </text>
          <line
            x1="0"
            y1="-50"
            x2="0"
            y2="-120"
            stroke={themeColor}
            strokeDasharray="5,5"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  )
}
