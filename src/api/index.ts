import request from "../utils/request"

/**
 * API接口封装
 */

export const analysisApi = {
  // 获取分析数据，添加重试逻辑
  getFileData: async (params?: any) => {
    const maxRetries = 3
    let retries = 0
    return request.get<any>("/api/output", params)
    // while (retries < maxRetries) {
    //   try {
    //     return await request.get<any>("/api/output", params)
    //   } catch (error: any) {
    //     retries++

    //     // 如果是超时错误且未达到最大重试次数，则等待后重试
    //     if (
    //       error.message &&
    //       error.message.includes("timeout") &&
    //       retries < maxRetries
    //     ) {
    //       console.log(
    //         `Request timed out, retrying (${retries}/${maxRetries})...`
    //       )
    //       // 等待一段时间后重试
    //       await new Promise((resolve) => setTimeout(resolve, 2000))
    //     } else {
    //       // 其他错误或已达到最大重试次数，则抛出错误
    //       throw error
    //     }
    //   }
    // }
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
