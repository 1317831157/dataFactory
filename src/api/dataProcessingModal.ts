import request from "../utils/request"

/**
 * 数据处理模态框相关接口
 * 用于支持 DataProcessingModal 组件的所有功能
 */

export const dataProcessingModalApi = {
  // ==================== 实时统计相关接口 ====================

  /**
   * 获取实时统计数据
   * 包括处理速度、总论文量、各类型数据数量等
   */
  getRealTimeStats: () => {
    return request.get<API.DataProcessing.RealTimeStats>(
      "/api/processing/realtime-stats"
    )
  },

  /**
   * 获取24小时处理趋势数据
   * 用于绘制趋势图表
   */
  getTrendData: (params?: { timeRange?: string }) => {
    return request.get<API.DataProcessing.TrendData>(
      "/api/processing/trend-data",
      params
    )
  },

  // ==================== 论文数据相关接口 ====================

  /**
   * 获取有效论文列表
   * 支持分页、排序、过滤
   */
  getValidPapers: (
    params: API.DataProcessing.PaginationParams &
      API.DataProcessing.FilterParams
  ) => {
    return request.get<
      API.DataProcessing.PaginatedResponse<API.DataProcessing.PaperData>
    >("/api/processing/papers/valid", params)
  },

  /**
   * 获取单个论文详情
   */
  getPaperDetail: (paperId: string) => {
    return request.get<API.DataProcessing.PaperData>(
      `/api/processing/papers/${paperId}`
    )
  },

  /**
   * 下载论文文件
   */
  downloadPaper: (paperId: string, format?: "pdf" | "txt" | "json") => {
    return request.get(
      `/api/processing/papers/${paperId}/download`,
      { format },
      { responseType: "blob" }
    )
  },

  /**
   * 批量操作论文
   * 支持删除、移动到垃圾箱、导出等操作
   */
  batchOperatePapers: (params: API.DataProcessing.BatchOperationParams) => {
    return request.post<API.DataProcessing.ProcessingResult>(
      "/api/processing/papers/batch",
      params
    )
  },

  // ==================== 公式图片相关接口 ====================

  /**
   * 获取公式图片列表
   * 支持分页和过滤
   */
  getFormulaImages: (
    params: API.DataProcessing.PaginationParams &
      API.DataProcessing.FilterParams
  ) => {
    return request.get<
      API.DataProcessing.PaginatedResponse<API.DataProcessing.FormulaData>
    >("/api/processing/formulas", params)
  },

  /**
   * 获取公式图片详情
   */
  getFormulaDetail: (formulaId: string) => {
    return request.get<API.DataProcessing.FormulaData>(
      `/api/processing/formulas/${formulaId}`
    )
  },

  /**
   * 下载公式图片
   */
  downloadFormula: (formulaId: string, format?: "png" | "jpg" | "svg") => {
    return request.get(
      `/api/processing/formulas/${formulaId}/download`,
      { format },
      { responseType: "blob" }
    )
  },

  /**
   * 批量操作公式图片
   */
  batchOperateFormulas: (params: API.DataProcessing.BatchOperationParams) => {
    return request.post<API.DataProcessing.ProcessingResult>(
      "/api/processing/formulas/batch",
      params
    )
  },

  // ==================== 垃圾数据相关接口 ====================

  /**
   * 获取垃圾数据列表
   * 支持分页和过滤
   */
  getTrashData: (
    params: API.DataProcessing.PaginationParams &
      API.DataProcessing.FilterParams
  ) => {
    return request.get<
      API.DataProcessing.PaginatedResponse<API.DataProcessing.TrashData>
    >("/api/processing/trash", params)
  },

  /**
   * 清空垃圾箱
   * 永久删除所有垃圾数据
   */
  clearTrash: () => {
    return request.delete<API.DataProcessing.ProcessingResult>(
      "/api/processing/trash/clear"
    )
  },

  /**
   * 恢复垃圾数据
   * 将垃圾数据重新分类为有效数据或公式数据
   */
  restoreTrashData: (params: {
    ids: string[]
    targetType: "valid" | "formula"
  }) => {
    return request.post<API.DataProcessing.ProcessingResult>(
      "/api/processing/trash/restore",
      params
    )
  },

  /**
   * 批量删除垃圾数据
   */
  batchDeleteTrash: (params: { ids: string[] }) => {
    return request.post<API.DataProcessing.ProcessingResult>(
      "/api/processing/trash/batch-delete",
      params
    )
  },

  // ==================== 实时处理结果相关接口 ====================

  /**
   * 获取最新处理结果
   * 用于实时显示最新处理的数据
   */
  getLatestProcessingResults: (params: {
    limit?: number
    type?: "all" | "valid" | "formula" | "trash"
  }) => {
    return request.get<API.DataProcessing.DataItem[]>(
      "/api/processing/latest-results",
      params
    )
  },

  /**
   * 获取处理队列状态
   * 显示当前正在处理的任务状态
   */
  getProcessingQueueStatus: () => {
    return request.get<{
      queueLength: number
      processing: boolean
      currentTask?: string
      estimatedTime?: number
    }>("/api/processing/queue-status")
  },

  // ==================== 搜索和过滤相关接口 ====================

  /**
   * 搜索数据
   * 支持全文搜索和高级搜索
   */
  searchData: (
    params: API.DataProcessing.SearchParams &
      API.DataProcessing.PaginationParams
  ) => {
    return request.post<
      API.DataProcessing.PaginatedResponse<API.DataProcessing.DataItem>
    >("/api/processing/search", params)
  },

  /**
   * 获取可用的过滤选项
   * 返回所有可用的数据源、主题标签等
   */
  getFilterOptions: () => {
    return request.get<{
      sources: string[]
      topics: string[]
      authors: string[]
      dateRange: [string, string]
    }>("/api/processing/filter-options")
  },

  // ==================== 导出相关接口 ====================

  /**
   * 导出数据
   * 支持多种格式和自定义过滤条件
   */
  exportData: (params: API.DataProcessing.ExportParams) => {
    return request.post("/api/processing/export", params, {
      responseType: "blob",
    })
  },

  /**
   * 获取导出任务状态
   * 用于大数据量导出的进度跟踪
   */
  getExportTaskStatus: (taskId: string) => {
    return request.get<{
      status: "pending" | "processing" | "completed" | "failed"
      progress: number
      downloadUrl?: string
      error?: string
    }>(`/api/processing/export/status/${taskId}`)
  },

  // ==================== 配置和设置相关接口 ====================

  /**
   * 获取处理配置
   * 返回当前的数据处理配置参数
   */
  getProcessingConfig: () => {
    return request.get<{
      autoProcessing: boolean
      processingSpeed: number
      qualityThreshold: number
      retentionDays: number
    }>("/api/processing/config")
  },

  /**
   * 更新处理配置
   */
  updateProcessingConfig: (config: {
    autoProcessing?: boolean
    processingSpeed?: number
    qualityThreshold?: number
    retentionDays?: number
  }) => {
    return request.put<API.DataProcessing.ProcessingResult>(
      "/api/processing/config",
      config
    )
  },

  // ==================== 统计和分析相关接口 ====================

  /**
   * 获取数据质量分析
   * 返回数据质量相关的统计信息
   */
  getDataQualityAnalysis: () => {
    return request.get<{
      totalProcessed: number
      validRate: number
      commonIssues: Array<{ issue: string; count: number }>
      qualityTrend: number[]
    }>("/api/processing/quality-analysis")
  },

  /**
   * 获取处理性能统计
   * 返回处理性能相关的指标
   */
  getPerformanceStats: () => {
    return request.get<{
      averageProcessingTime: number
      throughput: number
      errorRate: number
      resourceUsage: {
        cpu: number
        memory: number
        disk: number
      }
    }>("/api/processing/performance-stats")
  },
}

export default dataProcessingModalApi
