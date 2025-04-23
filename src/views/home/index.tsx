import React from "react"
import LeftContent from "./leftContent"
import MiddleContent from "./middleContent"
import RightContent from "./rightContent"
import ScaleScreenAdapter from "../../components/ScaleScreenAdapter"
import "../../../src/styles/screen.css"

/**
 * 数据可视化大屏首页
 */
const Home: React.FC = () => {
  return (
    <div className="w-full h-full">
      {/* 顶部标题栏 - 蓝绿色渐变背景，固定在页面顶部 */}
      <div className="fixed-header-title">
        {/* 技术风格装饰线 - 右侧 */}
        <div className="header-tech-decoration-right"></div>

        <div className="flex items-center h-full">
          {/* 使用内联SVG作为Logo */}
          <div className="w-12 h-12 ml-2 mr-4 flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16,2 L30,16 L16,30 L2,16 L16,2 Z"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <path
                d="M8,16 L24,16 M16,8 L16,24"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </svg>
          </div>
          <span className="text-2xl font-bold text-white tracking-wide">
            LLM-Ready数据集工厂
          </span>
        </div>

        {/* 右下角技术装饰 */}
        <div className="absolute right-[-150px] bottom-0 w-64 h-16">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 256 64"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,64 L90,64 L110,44 L256,44 L256,64"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1"
            />
            <path
              d="M80,64 L100,44"
              fill="none"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="1"
            />
          </svg>
        </div>
      </div>

      <ScaleScreenAdapter
        width={1920}
        height={1080}
        origin="center"
        className="bg-[#000c17]"
        fillWidth={true}
      >
        <div className="tech-grid-bg">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="#1890ff"
                  strokeWidth="0.5"
                  opacity="0.2"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="tech-lines">
          <svg
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
          >
            <path
              d="M0,50 Q100,100 200,50 T400,50 T600,50 T800,50 T1000,50 T1200,50 T1400,50 T1600,50 T1800,50 T2000,50"
              stroke="#1890ff"
              strokeWidth="1"
              fill="none"
              opacity="0.3"
            />
            <path
              d="M0,150 Q100,200 200,150 T400,150 T600,150 T800,150 T1000,150 T1200,150 T1400,150 T1600,150 T1800,150 T2000,150"
              stroke="#1890ff"
              strokeWidth="1"
              fill="none"
              opacity="0.3"
            />
            <path
              d="M100,0 Q150,100 100,200 T100,400 T100,600 T100,800 T100,1000"
              stroke="#1890ff"
              strokeWidth="1"
              fill="none"
              opacity="0.3"
            />
            <path
              d="M300,0 Q350,100 300,200 T300,400 T300,600 T300,800 T300,1000"
              stroke="#1890ff"
              strokeWidth="1"
              fill="none"
              opacity="0.3"
            />
          </svg>
        </div>

        <div className="flex h-full w-full pt-16">
          {/* 左侧内容区 - 占25% */}
          <div className="w-[25%] h-full p-4">
            <LeftContent />
          </div>

          {/* 中间内容区 - 占50%，添加背景图 */}
          <div className="w-[50%] h-full p-4 relative">
            {/* 中间内容背景图 */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
              style={{
                backgroundImage: "url('/src/assets/bg.png')",
                backgroundColor: "rgba(0, 21, 41, 0.5)",
                backgroundSize: "100% 450px",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                opacity: 0.7,
              }}
            ></div>

            {/* 内容在背景上方 */}
            <div className="relative z-10 h-full">
              <MiddleContent />
            </div>
          </div>

          {/* 右侧内容区 - 占25% */}
          <div className="w-[25%] h-full p-4">
            <RightContent />
          </div>
        </div>
      </ScaleScreenAdapter>
    </div>
  )
}

export default Home
