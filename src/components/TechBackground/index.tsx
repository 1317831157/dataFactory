import React from "react"

/**
 * 科技风格网络背景动画组件
 */
const TechBackground: React.FC = () => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 定义渐变和滤镜 */}
      <defs>
        {/* 节点边框渐变 */}
        <linearGradient id="nodeStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#00a2ff" stopOpacity="0.8" />
        </linearGradient>

        {/* 发光效果 */}
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* 节点内部渐变 */}
        <linearGradient id="nodeFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#001529" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#003a70" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* 背景网格 - 使用pattern实现 */}
      <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
        <path
          d="M 80 0 L 0 0 0 80"
          fill="none"
          stroke="#1d4350"
          strokeWidth="1"
          opacity="0.3"
        />
      </pattern>
      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* 节点组 */}
      <g filter="url(#glow)">
        {/* 节点1 */}
        <rect
          x="200"
          y="200"
          width="160"
          height="160"
          rx="10"
          fill="url(#nodeFill)"
          stroke="url(#nodeStroke)"
          strokeWidth="2"
        >
          <animate
            attributeName="opacity"
            values="0.7;0.9;0.7"
            dur="3s"
            repeatCount="indefinite"
          />
        </rect>

        {/* 节点2 */}
        <rect
          x="600"
          y="300"
          width="160"
          height="160"
          rx="10"
          fill="url(#nodeFill)"
          stroke="url(#nodeStroke)"
          strokeWidth="2"
        >
          <animate
            attributeName="opacity"
            values="0.7;0.9;0.7"
            dur="4s"
            repeatCount="indefinite"
          />
        </rect>

        {/* 节点3 */}
        <rect
          x="1000"
          y="200"
          width="160"
          height="160"
          rx="10"
          fill="url(#nodeFill)"
          stroke="url(#nodeStroke)"
          strokeWidth="2"
        >
          <animate
            attributeName="opacity"
            values="0.7;0.9;0.7"
            dur="3.5s"
            repeatCount="indefinite"
          />
        </rect>

        {/* 节点4 */}
        <rect
          x="300"
          y="600"
          width="160"
          height="160"
          rx="10"
          fill="url(#nodeFill)"
          stroke="url(#nodeStroke)"
          strokeWidth="2"
        >
          <animate
            attributeName="opacity"
            values="0.7;0.9;0.7"
            dur="4.5s"
            repeatCount="indefinite"
          />
        </rect>

        {/* 节点5 */}
        <rect
          x="800"
          y="700"
          width="160"
          height="160"
          rx="10"
          fill="url(#nodeFill)"
          stroke="url(#nodeStroke)"
          strokeWidth="2"
        >
          <animate
            attributeName="opacity"
            values="0.7;0.9;0.7"
            dur="4s"
            repeatCount="indefinite"
          />
        </rect>
      </g>

      {/* 连接线动画 */}
      <g>
        {/* 蓝色数据流线 1 */}
        <path
          d="M 280 280 C 400 280, 500 320, 680 380"
          fill="none"
          stroke="#00e5ff"
          strokeWidth="2"
          opacity="0.6"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="1000"
            to="0"
            dur="4s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-dasharray"
            values="0,1000;1000,0"
            dur="4s"
            repeatCount="indefinite"
          />
        </path>

        {/* 橙色数据流线 1 */}
        <path
          d="M 360 280 C 480 300, 600 350, 780 380"
          fill="none"
          stroke="#ff6b00"
          strokeWidth="2"
          opacity="0.4"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="1000"
            to="0"
            dur="6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-dasharray"
            values="0,1000;1000,0"
            dur="6s"
            repeatCount="indefinite"
          />
        </path>

        {/* 蓝色数据流线 2 */}
        <path
          d="M 680 380 C 800 400, 900 350, 1080 280"
          fill="none"
          stroke="#00e5ff"
          strokeWidth="2"
          opacity="0.6"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="1000"
            to="0"
            dur="5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-dasharray"
            values="0,1000;1000,0"
            dur="5s"
            repeatCount="indefinite"
          />
        </path>

        {/* 连接到底部节点的线 */}
        <path
          d="M 380 360 C 380 460, 380 560, 380 680"
          fill="none"
          stroke="#00e5ff"
          strokeWidth="2"
          opacity="0.6"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="1000"
            to="0"
            dur="4s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-dasharray"
            values="0,1000;1000,0"
            dur="4s"
            repeatCount="indefinite"
          />
        </path>

        {/* 底部节点间的连接线 */}
        <path
          d="M 460 780 C 560 780, 660 780, 880 780"
          fill="none"
          stroke="#ff6b00"
          strokeWidth="2"
          opacity="0.4"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="1000"
            to="0"
            dur="6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-dasharray"
            values="0,1000;1000,0"
            dur="6s"
            repeatCount="indefinite"
          />
        </path>
      </g>

      {/* 发光点动画 */}
      <g>
        <circle cx="280" cy="280" r="4" fill="#00e5ff" opacity="0.8">
          <animate
            attributeName="opacity"
            values="0.4;0.8;0.4"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="680" cy="380" r="4" fill="#00e5ff" opacity="0.8">
          <animate
            attributeName="opacity"
            values="0.4;0.8;0.4"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="1080" cy="280" r="4" fill="#00e5ff" opacity="0.8">
          <animate
            attributeName="opacity"
            values="0.4;0.8;0.4"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="380" cy="680" r="4" fill="#00e5ff" opacity="0.8">
          <animate
            attributeName="opacity"
            values="0.4;0.8;0.4"
            dur="3.5s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="880" cy="780" r="4" fill="#00e5ff" opacity="0.8">
          <animate
            attributeName="opacity"
            values="0.4;0.8;0.4"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    </svg>
  )
}

export default TechBackground
