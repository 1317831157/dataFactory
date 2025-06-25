import React, { useEffect, useState, useCallback } from "react"
import { analysisApi } from "@/api/index"
import { Button, Progress, Spin, message } from "antd"
import { FolderOpenOutlined, ReloadOutlined } from "@ant-design/icons"

/**
 * 左侧内容组件
 */
const resourceData = [
  {
    id: 1,
    name: "学术论文",
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
  // 分析状态
  const [analyzing, setAnalyzing] = useState(false)
  // 分析进度
  const [progress, setProgress] = useState(0)
  // 当前任务ID
  const [taskId, setTaskId] = useState<string | null>(null)
  // 轮询间隔ID
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null)

  // 获取资源数据
  // const getResourceData = useCallback(async () => {
  //   try {
  //     const result = await analysisApi.getFileData()
  //     if (result.code === 200) {
  //       setResourceList(result.data)
  //     }
  //   } catch (error) {
  //     console.error("获取资源数据失败:", error)
  //   }
  // }, [])
  // 获取资源数据
  const getResourceData = async () => {
    try {
      console.log("getResourceData")

      const result = await analysisApi.getFileData()
      console.log("result:", result)

      if (result.code === 200) {
        // 分析完成，更新数据
        setResourceList(result.data)
        setAnalyzing(false)
        if (pollInterval) {
          clearInterval(pollInterval)
          setPollInterval(null)
        }
      } else if (result.code === 202) {
        // 分析已启动，开始轮询
        console.log("Analysis started, polling for results...")
        setAnalyzing(true)
        setProgress(0)

        // 清除之前的轮询
        if (pollInterval) {
          clearInterval(pollInterval)
        }

        // 创建轮询任务
        const interval = setInterval(async () => {
          try {
            const pollResult = await analysisApi.getAutoAnalysisResult()
            if (
              pollResult.code === 200 &&
              pollResult.data &&
              pollResult.data.length > 0
            ) {
              // 分析完成，更新数据
              setResourceList(pollResult.data)
              setAnalyzing(false)
              clearInterval(interval)
              setPollInterval(null)
              message.success("文件分析完成")
            } else {
              // 更新进度（模拟进度）
              setProgress((prev) => Math.min(prev + 5, 95))
            }
          } catch (error) {
            console.error("轮询分析结果失败:", error)
          }
        }, 3000) // 每3秒轮询一次

        // 保存轮询间隔ID以便清理
        setPollInterval(interval)
      }
    } catch (error) {
      console.error("获取资源数据失败:", error)
      setAnalyzing(false)
    }
  }

  // 组件挂载时获取数据
  useEffect(() => {
    console.log("LeftContent")

    getResourceData()
    // 清理函数
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval)
      }
    }
  }, [])

  // 开始分析文件
  const startAnalysis = async (directory = "", fileList = []) => {
    try {
      // 设置分析状态
      setAnalyzing(true)
      setProgress(0)

      // 调用API开始分析任务
      const result = await analysisApi.submitAnalysisTask({
        directory: directory,
        options: {
          recursive: true,
          fileList: fileList, // 传递文件列表
        },
      })
      console.log("result:", result)

      if (result.data.task_id) {
        // 保存任务ID
        setTaskId(result.data.task_id)
        // 开始轮询任务进度
        startPolling(result.data.task_id)
      } else {
        message.error("启动分析任务失败")
        setAnalyzing(false)
      }
    } catch (error) {
      console.error("启动分析任务失败:", error)
      message.error("启动分析任务失败")
      setAnalyzing(false)
    }
  }

  // 开始轮询任务进度
  const startPolling = (id: string) => {
    console.log("开始轮询任务进度:", id)

    // 清除之前的轮询
    if (pollInterval) {
      clearInterval(pollInterval)
    }

    // 设置新的轮询
    const interval = setInterval(async () => {
      try {
        console.log("轮询任务进度:", id)
        const res = await analysisApi.getTaskProgress(id)
        console.log("任务状态:", res)

        // 更新进度
        setProgress(res.data.progress || 0)

        // 检查任务状态
        if (res.data.status === "completed") {
          console.log("任务完成")
          // 任务完成，停止轮询
          clearInterval(interval)
          setPollInterval(null)
          setAnalyzing(false)
          setTaskId(null)

          // 获取最新数据
          // getResourceData()
          message.success("文件分析完成")
        } else if (res.data.status === "failed") {
          console.log("任务失败:", res.data.error)
          // 任务失败，停止轮询
          clearInterval(interval)
          setPollInterval(null)
          setAnalyzing(false)
          setTaskId(null)
          message.error(`分析失败: ${res.data.error || "未知错误"}`)
        } else {
          console.log("任务进行中:", res.data.status, stares.datatus.progress)
        }
        // 如果状态是pending或running，继续轮询
      } catch (error) {
        console.error("获取任务进度失败:", error)
        // 出错时也停止轮询
        clearInterval(interval)
        setPollInterval(null)
        setAnalyzing(false)
        setTaskId(null)
        message.error("获取任务进度失败")
      }
    }, 1000) // 每秒轮询一次

    setPollInterval(interval)
  }

  // 选择目录
  const selectDirectory = async () => {
    try {
      // 检查浏览器是否支持File System Access API
      if ("showDirectoryPicker" in window) {
        // 打开目录选择器
        const directoryHandle = await window.showDirectoryPicker()

        // 获取目录路径（注意：这只会返回目录名，不是完整路径）
        const directoryName = directoryHandle.name

        // 收集目录中的文件信息
        const fileList = []

        // 递归函数，用于遍历目录
        async function collectFiles(handle, path = "") {
          // 遍历目录中的所有条目
          for await (const [name, entry] of handle.entries()) {
            const entryPath = path ? `${path}/${name}` : name

            if (entry.kind === "file") {
              // 如果是文件，添加到列表
              fileList.push({
                name: name,
                path: entryPath,
                type: "file",
              })
            } else if (entry.kind === "directory") {
              // 如果是目录，递归处理
              await collectFiles(entry, entryPath)
            }
          }
        }

        // 开始收集文件
        await collectFiles(directoryHandle)

        // 调用API开始分析任务，传入目录名和文件列表
        startAnalysis(directoryName, fileList)
      } else {
        // 浏览器不支持File System Access API
        message.warning(
          "您的浏览器不支持目录选择功能，请使用Chrome或Edge浏览器"
        )

        // 使用默认目录
        startAnalysis("默认目录")
      }
    } catch (error) {
      console.error("选择目录失败:", error)
      message.error("选择目录失败")
    }
  }

  return (
    <div
      className="flex flex-col h-full"
      style={{ paddingTop: "20px", paddingBottom: "20px" }}
    >
      {/* 操作按钮 */}
      <div className="flex justify-between mt-8 px-4">
        {/* <Button
          type="primary"
          icon={<FolderOpenOutlined />}
          onClick={selectDirectory}
          disabled={analyzing}
        >
          分析文件
        </Button>
        <Button
          icon={<ReloadOutlined />}
          onClick={getResourceData}
          disabled={analyzing}
        >
          刷新
        </Button> */}
      </div>

      {/* 进度条 */}
      {analyzing && (
        <div className="mb-6 px-4">
          <div className="mb-2 text-gray-300">正在分析文件...</div>
          <Progress percent={progress} status="active" />
        </div>
      )}

      {/* 资源列表 - 中间内容展示 */}
      <div className="flex flex-col h-full justify-evenly">
        {analyzing && resourceList.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <Spin size="large" tip="正在加载资源数据..." />
          </div>
        ) : (
          resourceList?.map((item) => (
            <div key={item.id} className="relative group mb-4 px-4">
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
          ))
        )}
      </div>
    </div>
  )
}

export default LeftContent
