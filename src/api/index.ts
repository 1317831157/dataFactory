import request from "../utils/request"

/**
 * API接口封装
 */

// 导入各模块的API
export {
  dataCollectionApi,
  dataProcessingApi,
  dataDisplayApi,
  dataAnalysisApi,
} from "./dataCollectModal"
export { dataProcessingModalApi } from "./dataProcessingModal"
export { dataAnalysisModalApi } from "./dataAnalysisModal"
export { dataDisplayModalApi } from "./dataDisplayModal"

export const analysisApi = {
  // 获取分析数据，添加重试逻辑
  getFileData: async (params?: any) => {
    return request.get<any>("/api/output", params)
  },
  // 获取自动分析结果
  getAutoAnalysisResult: async () => {
    return request.get<any>("/api/auto-analysis")
  },
  /**
   * 提交数据进行异步分析
   * @param data 分析数据
   * @returns 任务ID
   */
  submitAnalysisTask: (data: API.AnalysisParams) => {
    return request.post<{ task_id: string; status: string }>(
      "/api/analyze",
      data
    )
  },

  /**
   * 获取分析任务进度
   * @param taskId 任务ID
   * @returns 任务状态信息
   */
  getTaskProgress: (taskId: string) => {
    return request.get<API.TaskStatus>(`/api/analyze/progress/${taskId}`)
  },

  // Get visit statistics data for pie chart
  getVisitStatistics: () => {
    return request.get<any>("/api/analysis/visit-statistics")
  },

  // Get hourly data extraction volume
  getHourlyDataVolume: () => {
    return request.get<any>("/api/analysis/hourly-data-volume")
  },

  // Get alert messages
  getAlertMessages: () => {
    return request.get<any>("/api/analysis/alerts")
  },
}

export default {
  analysisApi,
}
