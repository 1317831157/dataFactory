import React from "react"
import EChart from "../../../components/EChart"
import type { EChartsOption } from "echarts"
import MCPDiagram from "./mcp-diagram"
import MCPCommunication from "./mcp-communication"
import MCPArchitecture from "./mcp-architecture"
import MCPProtocolDiagram from "./mcp-protocol-diagram"
import TechBackground from "../../../components/TechBackground"
import Modal from "../../../components/Modal"
import DataCollectionModal from "../components/modals/DataCollectionModal"
import DataProcessingModal from "../components/modals/DataProcessingModal"
import DataDisplayModal from "../components/modals/DataDisplayModal"
import DataAnalysisModal from "../components/modals/DataAnalysisModal"
import useModal from "../../../hooks/useModal"

/**
 * 中间内容组件
 * 展示中央数据流动和数据处理节点
 */
const MiddleContent: React.FC = () => {
  // 使用自定义hook管理各个模块的弹窗状态
  const collectionModal = useModal()
  const processingModal = useModal()
  const displayModal = useModal()
  const analysisModal = useModal()

  // 中央数据流动图配置
  const dataFlowOption: EChartsOption = {
    backgroundColor: "transparent",
    xAxis: { show: false },
    yAxis: { show: false },
    grid: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    legend: { show: false },
    series: [
      {
        type: "graph",
        layout: "force",
        force: {
          repulsion: 100,
          gravity: 0.1,
          edgeLength: 50,
        },
        roam: true,
        lineStyle: {
          width: 1.5,
          color: "rgba(24, 144, 255, 0.6)",
          curveness: 0.3,
        },
        itemStyle: {
          opacity: 0.8,
          color: "#1890ff",
        },
        data: Array.from({ length: 25 }, (_, i) => ({
          name: `节点${i}`,
          value: Math.random() * 10,
          symbolSize: Math.random() * 8 + 4,
        })),
        links: Array.from({ length: 35 }, () => ({
          source: Math.floor(Math.random() * 25).toString(),
          target: Math.floor(Math.random() * 25).toString(),
          value: Math.random(),
        })),
      },
    ],
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 科技风格背景 - 最底层 */}
      <div className="absolute inset-0 z-0">
        <TechBackground />
      </div>

      {/* 暗色背景 */}
      <div className="absolute inset-0 z-[0] bg-[#000e17] opacity-70"></div>

      {/* 数据流动可视化 - 底层背景 */}
      <div className="absolute inset-0 z-[1] opacity-40">
        <EChart option={dataFlowOption} height="100%" width="100%" />
      </div>

      {/* 连接曲线层 */}
      <div className="absolute inset-0 z-[4] pointer-events-none">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
        >
          <defs>
            {/* 流线渐变 */}
            <linearGradient id="blueGreen" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00ffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00ff7f" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="orangeYellow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff6b00" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffaa00" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="blueOrange" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00ffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ff6b00" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="greenYellow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00ff7f" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffaa00" stopOpacity="0.8" />
            </linearGradient>

            {/* 箭头标记 */}
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#ffffff" />
            </marker>
          </defs>

          {/* 上方横向连接线 - 从左上到右上 */}
          <path
            d="M 320 200 Q 500 140, 680 200"
            fill="none"
            stroke="url(#blueGreen)"
            strokeWidth="2"
            strokeDasharray="5,3"
            markerEnd="url(#arrow)"
          />

          {/* 下方横向连接线 - 从右下到左下 */}
          <path
            d="M 680 800 Q 500 860, 320 800"
            fill="none"
            stroke="url(#orangeYellow)"
            strokeWidth="2"
            strokeDasharray="5,3"
            markerEnd="url(#arrow)"
          />

          {/* 左侧纵向连接线 - 从左下到左上 */}
          <path
            d="M 200 680 Q 140 500, 200 320"
            fill="none"
            stroke="url(#blueOrange)"
            strokeWidth="2"
            strokeDasharray="5,3"
            markerEnd="url(#arrow)"
          />

          {/* 右侧纵向连接线 - 从右上到右下 */}
          <path
            d="M 800 320 Q 860 500, 800 680"
            fill="none"
            stroke="url(#greenYellow)"
            strokeWidth="2"
            strokeDasharray="5,3"
            markerEnd="url(#arrow)"
          />

          {/* 对角线 - 右上到左下（虚线） */}
          <path
            d="M 680 320 C 600 450, 400 550, 320 680"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeDasharray="10,10"
            strokeOpacity="0.4"
          />

          {/* 对角线 - 左上到右下（虚线） */}
          <path
            d="M 320 320 C 400 450, 600 550, 680 680"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeDasharray="10,10"
            strokeOpacity="0.4"
          />

          {/* 四个交汇点 */}
          <circle cx="320" cy="200" r="4" fill="#00ffff" />
          <circle cx="680" cy="200" r="4" fill="#00ff7f" />
          <circle cx="320" cy="800" r="4" fill="#ff6b00" />
          <circle cx="680" cy="800" r="4" fill="#ffaa00" />

          {/* 中心交汇点 */}
          <circle cx="500" cy="500" r="8" fill="#ffffff" />
        </svg>
      </div>

      {/* MCP图表区域 - 2x2网格布局 */}
      <div className="absolute inset-0 z-[5] grid grid-cols-2 grid-rows-2 gap-10 p-8">
        {/* 左上 */}
        <div className="relative flex items-center justify-center">
          <div
            className="w-full h-full max-w-[500px] max-h-[280px] cursor-pointer"
            onClick={collectionModal.handleOpen}
          >
            <MCPDiagram
              title="数据采集"
              themeColor="#00ffff"
              secondaryColor="#0066ff"
            />
          </div>
        </div>

        {/* 右上 */}
        <div className="relative flex items-center justify-center">
          <div
            className="w-full h-full max-w-[500px] max-h-[280px] cursor-pointer"
            onClick={processingModal.handleOpen}
          >
            <MCPCommunication
              title="数据处理"
              themeColor="#00ff7f"
              secondaryColor="#008060"
            />
          </div>
        </div>

        {/* 左下 */}
        <div className="relative flex items-center justify-center">
          <div
            className="w-full h-full max-w-[500px] max-h-[280px] cursor-pointer"
            onClick={displayModal.handleOpen}
          >
            <MCPProtocolDiagram
              title="数据展示"
              themeColor="#ffaa00"
              secondaryColor="#cc8800"
            />
          </div>
        </div>

        {/* 右下 */}
        <div className="relative flex items-center justify-center">
          <div
            className="w-full h-full max-w-[500px] max-h-[280px] cursor-pointer"
            onClick={analysisModal.handleOpen}
          >
            <MCPArchitecture
              title="数据分析"
              themeColor="#ff6b00"
              secondaryColor="#b94b00"
            />
          </div>
        </div>
      </div>

      {/* 装饰连接线 */}
      <div className="absolute inset-0 z-[8] flex items-center justify-center pointer-events-none">
        <div className="relative w-[90%] h-[90%]">
          {/* 中心连接点 */}
          <div className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full bg-[#00ffff] transform -translate-x-1/2 -translate-y-1/2"></div>

          {/* 黄色连接线 */}
          <div className="absolute top-[10%] right-[20%] w-[20%] h-[1px] bg-gradient-to-r from-transparent to-[#ffaa00] rotate-45 origin-right"></div>
          <div className="absolute bottom-[10%] left-[20%] w-[20%] h-[1px] bg-gradient-to-l from-transparent to-[#ffaa00] rotate-45 origin-left"></div>
          <div className="absolute top-[50%] right-[10%] w-[30%] h-[1px] bg-gradient-to-r from-transparent to-[#ffaa00]"></div>
          <div className="absolute bottom-[30%] right-[10%] w-[20%] h-[1px] bg-gradient-to-r from-transparent to-[#ffaa00] rotate-[-45deg] origin-right"></div>

          {/* 蓝色连接线 */}
          <div className="absolute top-[30%] left-[20%] w-[15%] h-[1px] bg-gradient-to-l from-transparent to-[#1890ff] rotate-[-20deg] origin-left"></div>
          <div className="absolute bottom-[40%] right-[30%] w-[25%] h-[1px] bg-gradient-to-r from-transparent to-[#1890ff] rotate-[30deg] origin-right"></div>
          <div className="absolute top-[50%] left-[10%] w-[30%] h-[1px] bg-gradient-to-l from-transparent to-[#1890ff]"></div>
          <div className="absolute top-[25%] left-[50%] w-[20%] h-[1px] bg-gradient-to-b from-transparent to-[#1890ff] rotate-[90deg] origin-left"></div>
        </div>
      </div>

      {/* 弹窗组件 */}
      <Modal
        title="数据采集"
        open={collectionModal.open}
        onClose={collectionModal.handleClose}
        themeColor="#00ffff"
        secondaryColor="#0066ff"
      >
        <DataCollectionModal themeColor="#00ffff" secondaryColor="#0066ff" />
      </Modal>

      <Modal
        title="数据处理"
        open={processingModal.open}
        onClose={processingModal.handleClose}
        themeColor="#00ff7f"
        secondaryColor="#008060"
      >
        <DataProcessingModal themeColor="#00ff7f" secondaryColor="#008060" />
      </Modal>

      <Modal
        title="数据展示"
        open={displayModal.open}
        onClose={displayModal.handleClose}
        themeColor="#ffaa00"
        secondaryColor="#cc8800"
      >
        <DataDisplayModal themeColor="#ffaa00" secondaryColor="#cc8800" />
      </Modal>

      <Modal
        title="数据分析"
        open={analysisModal.open}
        onClose={analysisModal.handleClose}
        themeColor="#ff6b00"
        secondaryColor="#b94b00"
      >
        <DataAnalysisModal themeColor="#ff6b00" secondaryColor="#b94b00" />
      </Modal>
    </div>
  )
}

export default MiddleContent
