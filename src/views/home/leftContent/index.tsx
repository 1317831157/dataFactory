import React, { useEffect, useState } from "react"
import { analysisApi } from "@/api/index"
/**
 * 左侧内容组件
 */
const resourceData = [
  {
    id: 1,
    name: "学术论文1",
    count: 175,
    icon: "📄",
    color: "#1890ff",
  },
  {
    id: 2,
    name: "调查报告",
    count: 350,
    icon: "📊",
    color: "#52c41a",
  },
  {
    id: 3,
    name: "专业书籍",
    count: 245,
    icon: "📚",
    color: "#722ed1",
  },
  {
    id: 4,
    name: "政策文件",
    count: 32,
    icon: "📜",
    color: "#faad14",
  },
  {
    id: 5,
    name: "法规标准",
    count: 46,
    icon: "⚖️",
    color: "#13c2c2",
  },
]
const LeftContent: React.FC = () => {
  // 资源数据列表
  const [resourceList, setResourceList] = useState(resourceData)
  useEffect(() => {
    getResourceData()
  })
  const getResourceData = async () => {
    const result = await analysisApi.getFileData()
    if (result.code === 200) {
      setResourceList(result.data)
    }
  }
  return (
    <div
      className="flex flex-col h-full"
      style={{ paddingTop: "100px", paddingBottom: "100px" }}
    >
      {/* 资源列表 - 中间内容展示 */}
      <div className="flex flex-col h-full justify-evenly">
        {resourceList.map((item) => (
          <div key={item.id} className="relative group mb-4">
            {/* 卡片背景 - 渐变效果 */}
            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(24,144,255,0.1)] to-transparent rounded-md opacity-70 group-hover:opacity-90 transition-opacity"></div>

            {/* 卡片内容 */}
            <div
              className="relative flex items-center px-4 py-4 rounded-md border-l-2"
              style={{ borderColor: item.color }}
            >
              {/* 左侧图标 */}
              <div className="w-14 h-14 flex items-center justify-center mr-5 bg-[rgba(0,21,41,0.2)] rounded-md">
                <span className="text-2xl">{item.icon}</span>
              </div>

              {/* 右侧数据 */}
              <div className="flex flex-col">
                <div
                  className="text-3xl font-bold leading-tight"
                  style={{ color: item.color }}
                >
                  {item.count}
                </div>
                <div className="text-base text-gray-200 font-medium mt-1">
                  {item.name}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LeftContent
