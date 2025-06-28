import request from "../utils/request"

/**
 * 数据展示模态框相关接口
 * 用于支持 DataDisplayModal 组件的所有功能
 */

export const dataDisplayModalApi = {
  // ==================== 数据源配置相关接口 ====================

  /**
   * 获取数据源配置信息
   * 包括数据源选项、研究领域选项、子类型选项和导出格式选项
   */
  getDataSourceConfig: () => {
    return request.get<{
      code: number
      message: string
      data: API.DataDisplay.DataSourceConfigResponse
    }>("/api/data-sources/config")
  },

  /**
   * 根据数据源类型获取子类型选项
   * @param dataSource 数据源类型
   */
  getSubTypeOptions: (dataSource: string) => {
    return request.get<{
      code: number
      message: string
      data: { subTypes: string[] }
    }>(`/api/data-sources/${dataSource}/sub-types`)
  },

  // ==================== 数据统计相关接口 ====================

  /**
   * 获取数据统计信息
   * 包括指标卡数据、图表数据和最新数据列表
   * 使用 get_auto_analysis_result 作为数据源
   */
  getDataStats: (params?: {
    dataSource?: string
    dateRange?: [string, string]
    fields?: string[]
  }) => {
    return request.get<{
      code: number
      message: string
      data: API.DataDisplay.DataStatsResponse
    }>("/api/data-sources/stats", params)
  },

  /**
   * 获取指标卡数据
   * 返回文献总量、图文数据集、数据覆盖率、数据源类型等指标
   */
  getMetricData: () => {
    return request.get<{
      code: number
      message: string
      data: { metrics: API.DataDisplay.MetricData[] }
    }>("/api/data-sources/metrics")
  },

  /**
   * 获取图表数据
   * 返回各类型数据分布的柱状图数据
   */
  getChartData: (params?: {
    dataSource?: string
    dateRange?: [string, string]
  }) => {
    return request.get<{
      code: number
      message: string
      data: API.DataDisplay.ChartData
    }>("/api/data-sources/chart-data", params)
  },

  /**
   * 获取最新数据列表
   * 返回最近更新的数据项列表
   */
  getLatestData: (params?: {
    limit?: number
    dataSource?: string
    type?: string
  }) => {
    return request.get<{
      code: number
      message: string
      data: { data: API.DataDisplay.LatestDataItem[] }
    }>("/api/data-sources/latest", params)
  },

  // ==================== 数据更新相关接口 ====================

  /**
   * 更新数据
   * 根据选择的参数重新获取和分析数据
   */
  updateData: (params: API.DataDisplay.DataUpdateParams) => {
    return request.post<{
      code: number
      message: string
      data: { success: boolean; message: string; taskId?: string }
    }>("/api/data-sources/update", params)
  },

  /**
   * 获取数据更新进度
   * @param taskId 更新任务ID
   */
  getUpdateProgress: (taskId: string) => {
    return request.get<{
      code: number
      message: string
      data: {
        progress: number
        status: "pending" | "running" | "completed" | "failed"
        message?: string
      }
    }>(`/api/data-sources/update/progress/${taskId}`)
  },

  // ==================== 数据导出相关接口 ====================

  /**
   * 导出数据
   * 根据指定格式和参数导出数据
   */
  exportData: (params: API.DataDisplay.DataExportParams) => {
    return request.post<{
      code: number
      message: string
      data: { taskId: string; status: string }
    }>("/api/data-sources/export", params)
  },

  /**
   * 获取导出任务状态
   * @param taskId 导出任务ID
   */
  getExportStatus: (taskId: string) => {
    return request.get<{
      code: number
      message: string
      data: {
        status: "pending" | "processing" | "completed" | "failed"
        progress: number
        downloadUrl?: string
        error?: string
      }
    }>(`/api/data-sources/export/status/${taskId}`)
  },

  // ==================== 数据筛选相关接口 ====================

  /**
   * 根据条件筛选数据
   * 支持按数据源、时间范围、研究领域等条件筛选
   */
  filterData: (params: {
    dataSource?: string
    subTypes?: string[]
    dateRange?: [string, string]
    fields?: string[]
    page?: number
    pageSize?: number
  }) => {
    return request.get<{
      data: API.DataDisplay.LatestDataItem[]
      total: number
      page: number
      pageSize: number
    }>("/api/data-sources/filter", params)
  },

  /**
   * 获取筛选选项
   * 返回可用的筛选条件选项
   */
  getFilterOptions: () => {
    return request.get<{
      dataSources: API.DataDisplay.DataSourceOption[]
      fields: string[]
      types: string[]
      dateRanges: Array<{ label: string; value: [string, string] }>
    }>("/api/data-sources/filter-options")
  },

  // ==================== 实时数据相关接口 ====================

  /**
   * 获取实时数据更新
   * 用于实时刷新页面数据
   */
  getRealTimeUpdates: () => {
    return request.get<{
      lastUpdate: string
      hasNewData: boolean
      newDataCount: number
      metrics: API.DataDisplay.MetricData[]
    }>("/api/data-sources/realtime")
  },

  /**
   * 订阅数据更新通知
   * 用于WebSocket连接或Server-Sent Events
   */
  subscribeUpdates: (callback: (data: any) => void) => {
    // 这里可以实现WebSocket连接或SSE
    // 暂时返回一个取消订阅的函数
    return () => {
      // 取消订阅逻辑
    }
  },
}

export default dataDisplayModalApi
