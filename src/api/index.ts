import request from "../utils/request"

/**
 * API接口封装
 */

export const analysisApi = {
  // 获取分析数据
  getFileData: (params?: any) => {
    return request.get<any>("/api/output", params)
  },

  /**
   * 提交数据进行异步分析
   * @param data 分析数据
   * @returns 任务ID
   */
  submitAnalysisTask: (data: API.AnalysisParams) => {
    return request.post<any>("/analyze", data)
  },

  /**
   * 获取分析任务进度
   * @param taskId 任务ID
   * @returns 任务状态信息
   */
  getTaskProgress: (taskId: string) => {
    return request.get<any>(`/analyze/progress/${taskId}`)
  },
}

export default {
  analysisApi,
}
