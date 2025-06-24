import request from "../utils/request"

// 数据采集相关接口
export const dataCollectionApi = {
  // 获取数据源统计信息
  getSourceStatistics: () => {
    return request.get<any>("/api/collection/statistics")
  },

  // 开始数据爬取
  startCrawling: (params: { sourceType: string; limit?: number }) => {
    return request.post<any>("/api/collection/crawl", params)
  },

  // 停止数据爬取
  stopCrawling: () => {
    return request.post<any>("/api/collection/crawl/stop")
  },

  // 获取爬取结果
  getCrawlResults: (params: {
    sourceType: string
    page: number
    pageSize: number
  }) => {
    return request.get<any>("/api/collection/results", params)
  },
}

// 数据处理相关接口
export const dataProcessingApi = {
  // 获取处理统计数据
  getProcessingStatistics: () => {
    return request.get<any>("/api/processing/statistics")
  },

  // 获取有效论文数据
  getValidPapers: (params: { page: number; pageSize: number }) => {
    return request.get<any>("/api/processing/papers/valid", params)
  },

  // 获取公式数据
  getFormulas: (params: { page: number; pageSize: number }) => {
    return request.get<any>("/api/processing/formulas", params)
  },

  // 获取废弃数据
  getTrashData: (params: { page: number; pageSize: number }) => {
    return request.get<any>("/api/processing/trash", params)
  },

  // 获取处理趋势数据
  getProcessingTrend: (params: { timeRange: string }) => {
    return request.get<any>("/api/processing/trend", params)
  },
}

// 数据展示相关接口
export const dataDisplayApi = {
  // 获取数据源列表
  getDataSources: () => {
    return request.get<any>("/api/display/sources")
  },

  // 获取数据子类型
  getSubTypes: (params: { sourceType: string }) => {
    return request.get<any>("/api/display/subtypes", params)
  },

  // 获取字段列表
  getFields: (params: { sourceType: string }) => {
    return request.get<any>("/api/display/fields", params)
  },

  // 获取数据统计指标
  getMetrics: () => {
    return request.get<any>("/api/display/metrics")
  },

  // 获取最新数据列表
  getLatestData: (params: { limit: number }) => {
    return request.get<any>("/api/display/latest", params)
  },

  // 更新数据
  updateData: (params: {
    dataSource: string
    selectedSubTypes: string[]
    dateRange: [Date, Date]
    selectedFields: string[]
  }) => {
    return request.post<any>("/api/display/update", params)
  },

  // 导出数据
  exportData: (params: { format: string; filters?: any }) => {
    return request.post<any>("/api/display/export", params, {
      responseType: "blob",
    })
  },
}

// 数据分析相关接口
export const dataAnalysisApi = {
  // 获取分析模型列表
  getAnalysisModels: () => {
    return request.get<any>("/api/analysis/models")
  },

  // 获取分析任务列表
  getAnalysisTasks: (params: {
    status?: string
    page: number
    pageSize: number
  }) => {
    return request.get<any>("/api/analysis/tasks", params)
  },

  // 创建分析任务
  createAnalysisTask: (params: {
    name: string
    modelId: string
    dataSource: string
    parameters: any
  }) => {
    return request.post<any>("/api/analysis/tasks", params)
  },

  // 获取分析结果
  getAnalysisResult: (params: { taskId: string }) => {
    return request.get<any>("/api/analysis/results", params)
  },

  // 获取分析指标
  getAnalysisMetrics: () => {
    return request.get<any>("/api/analysis/metrics")
  },
}
