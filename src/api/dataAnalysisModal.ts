import request from "../utils/request"

/**
 * 数据分析模态框相关接口
 * 用于支持 DataAnalysisModal 组件的所有功能
 */

export const dataAnalysisModalApi = {
  // ==================== 数据源管理相关接口 ====================
  
  /**
   * 获取可用的数据源列表
   * 返回所有可用的数据源类型及其统计信息
   */
  getDataSources: () => {
    return request.get<API.DataAnalysis.DataSource[]>("/api/analysis/data-sources")
  },

  /**
   * 获取数据源详情
   * 包括数据源的详细信息和支持的分类类别
   */
  getDataSourceDetail: (sourceId: string) => {
    return request.get<API.DataAnalysis.DataSource>(`/api/analysis/data-sources/${sourceId}`)
  },

  /**
   * 获取数据源到分类类别的映射关系
   * 用于确定每个数据源支持哪些分类类别
   */
  getSourceCategoryMapping: () => {
    return request.get<Record<string, string[]>>("/api/analysis/source-category-mapping")
  },

  // ==================== 分类类别管理相关接口 ====================

  /**
   * 获取所有分类类别
   * 返回系统支持的所有分类类别信息
   */
  getCategories: () => {
    return request.get<API.DataAnalysis.Category[]>("/api/analysis/categories")
  },

  /**
   * 获取分类类别详情
   */
  getCategoryDetail: (categoryId: string) => {
    return request.get<API.DataAnalysis.Category>(`/api/analysis/categories/${categoryId}`)
  },

  // ==================== 数据预处理相关接口 ====================

  /**
   * 开始关键词提取
   * 从指定数据源中提取关键词
   */
  startKeywordExtraction: (params: { sourceType: string; sampleSize?: number }) => {
    return request.post<{ taskId: string }>("/api/analysis/keyword-extraction/start", params)
  },

  /**
   * 获取关键词提取进度
   */
  getKeywordExtractionProgress: (taskId: string) => {
    return request.get<API.DataAnalysis.KeywordExtractionResult>(
      `/api/analysis/keyword-extraction/progress/${taskId}`
    )
  },

  /**
   * 获取提取的关键词结果
   */
  getExtractedKeywords: (taskId: string) => {
    return request.get<{ keywords: string[]; confidence: number }>(
      `/api/analysis/keyword-extraction/result/${taskId}`
    )
  },

  /**
   * 开始数据预处理
   * 执行数据清洗、格式标准化、特征提取等步骤
   */
  startPreprocessing: (params: {
    sourceType: string;
    steps: string[];
    parameters?: Record<string, any>;
  }) => {
    return request.post<{ taskId: string }>("/api/analysis/preprocessing/start", params)
  },

  /**
   * 获取预处理进度
   */
  getPreprocessingProgress: (taskId: string) => {
    return request.get<API.DataAnalysis.PreprocessResult>(
      `/api/analysis/preprocessing/progress/${taskId}`
    )
  },

  /**
   * 获取预处理结果
   */
  getPreprocessingResult: (taskId: string) => {
    return request.get<API.DataAnalysis.PreprocessResult>(
      `/api/analysis/preprocessing/result/${taskId}`
    )
  },

  // ==================== 智能分类相关接口 ====================

  /**
   * 获取可用的分类模型
   */
  getAvailableModels: () => {
    return request.get<API.DataAnalysis.ModelInfo[]>("/api/analysis/models")
  },

  /**
   * 开始智能分类任务
   */
  startClassification: (params: API.DataAnalysis.AnalysisRequest) => {
    return request.post<{ taskId: string }>("/api/analysis/classification/start", params)
  },

  /**
   * 获取分类任务进度
   */
  getClassificationProgress: (taskId: string) => {
    return request.get<API.DataAnalysis.ClassificationTask>(
      `/api/analysis/classification/progress/${taskId}`
    )
  },

  /**
   * 获取分类结果
   */
  getClassificationResult: (taskId: string) => {
    return request.get<{
      metrics: API.DataAnalysis.ClassificationMetrics;
      categoryStats: API.DataAnalysis.CategoryStats;
      confusionMatrix: API.DataAnalysis.ConfusionMatrixData;
    }>(`/api/analysis/classification/result/${taskId}`)
  },

  /**
   * 获取分类指标
   * 实时获取当前分类任务的性能指标
   */
  getClassificationMetrics: (taskId: string) => {
    return request.get<API.DataAnalysis.ClassificationMetrics>(
      `/api/analysis/classification/metrics/${taskId}`
    )
  },

  // ==================== 混淆矩阵相关接口 ====================

  /**
   * 获取混淆矩阵数据
   * 用于生成混淆矩阵热力图
   */
  getConfusionMatrixData: (taskId: string) => {
    return request.get<API.DataAnalysis.ConfusionMatrixData>(
      `/api/analysis/confusion-matrix/${taskId}`
    )
  },

  /**
   * 生成混淆矩阵图表配置
   * 返回ECharts配置对象
   */
  generateConfusionMatrixChart: (taskId: string) => {
    return request.get<any>(`/api/analysis/confusion-matrix/chart/${taskId}`)
  },

  // ==================== 分类结果统计相关接口 ====================

  /**
   * 获取分类结果统计
   * 返回各类别的计数、置信度等统计信息
   */
  getCategoryStats: (taskId: string) => {
    return request.get<API.DataAnalysis.CategoryStats>(
      `/api/analysis/category-stats/${taskId}`
    )
  },

  /**
   * 实时更新分类结果统计
   * 用于动态更新分类结果显示
   */
  updateCategoryStats: (params: {
    taskId: string;
    sourceType: string;
    categories: string[];
  }) => {
    return request.post<API.DataAnalysis.CategoryStats>(
      "/api/analysis/category-stats/update",
      params
    )
  },

  // ==================== 实时分析状态相关接口 ====================

  /**
   * 获取实时分析状态
   * 返回当前分析任务的运行状态
   */
  getRealTimeAnalysisStatus: () => {
    return request.get<API.DataAnalysis.RealTimeAnalysisStatus>("/api/analysis/status/realtime")
  },

  /**
   * 停止当前分析任务
   */
  stopAnalysisTask: (taskId: string) => {
    return request.post<{ success: boolean; message: string }>(
      `/api/analysis/tasks/${taskId}/stop`
    )
  },

  /**
   * 重启分析任务
   */
  restartAnalysisTask: (taskId: string) => {
    return request.post<{ taskId: string }>(`/api/analysis/tasks/${taskId}/restart`)
  },

  // ==================== 历史记录和报告相关接口 ====================

  /**
   * 获取分析历史记录
   */
  getAnalysisHistory: (params: {
    page: number;
    pageSize: number;
    sourceType?: string;
    status?: string;
  }) => {
    return request.get<{
      data: API.DataAnalysis.AnalysisHistory[];
      total: number;
      page: number;
      pageSize: number;
    }>("/api/analysis/history", params)
  },

  /**
   * 生成分析报告
   */
  generateAnalysisReport: (taskId: string) => {
    return request.post<{ reportId: string }>(`/api/analysis/reports/generate/${taskId}`)
  },

  /**
   * 获取分析报告
   */
  getAnalysisReport: (reportId: string) => {
    return request.get<API.DataAnalysis.AnalysisReport>(`/api/analysis/reports/${reportId}`)
  },

  /**
   * 导出分析结果
   */
  exportAnalysisResult: (params: API.DataAnalysis.ExportParams) => {
    return request.post("/api/analysis/export", params, { responseType: 'blob' })
  },

  // ==================== 配置和设置相关接口 ====================

  /**
   * 获取分析配置
   */
  getAnalysisConfig: () => {
    return request.get<{
      defaultModel: string;
      batchSize: number;
      threshold: number;
      enableAutoPreprocessing: boolean;
      maxConcurrentTasks: number;
    }>("/api/analysis/config")
  },

  /**
   * 更新分析配置
   */
  updateAnalysisConfig: (config: {
    defaultModel?: string;
    batchSize?: number;
    threshold?: number;
    enableAutoPreprocessing?: boolean;
    maxConcurrentTasks?: number;
  }) => {
    return request.put<{ success: boolean; message: string }>("/api/analysis/config", config)
  },

  // ==================== 模型管理相关接口 ====================

  /**
   * 训练新模型
   */
  trainModel: (params: {
    name: string;
    type: string;
    trainingData: string;
    parameters: Record<string, any>;
  }) => {
    return request.post<{ taskId: string }>("/api/analysis/models/train", params)
  },

  /**
   * 获取模型训练进度
   */
  getModelTrainingProgress: (taskId: string) => {
    return request.get<{
      progress: number;
      status: string;
      currentEpoch: number;
      totalEpochs: number;
      loss: number;
      accuracy: number;
    }>(`/api/analysis/models/training/progress/${taskId}`)
  },

  /**
   * 评估模型性能
   */
  evaluateModel: (modelId: string, testDataId: string) => {
    return request.post<API.DataAnalysis.ClassificationMetrics>(
      `/api/analysis/models/${modelId}/evaluate`,
      { testDataId }
    )
  },

  // ==================== 数据流动画相关接口 ====================

  /**
   * 获取数据流状态
   * 用于数据流动画的状态更新
   */
  getDataFlowStatus: () => {
    return request.get<{
      currentStep: string;
      steps: Array<{
        name: string;
        status: 'pending' | 'active' | 'completed';
        progress: number;
      }>;
    }>("/api/analysis/data-flow/status")
  },

  /**
   * 更新数据流状态
   */
  updateDataFlowStatus: (step: string) => {
    return request.post<{ success: boolean }>("/api/analysis/data-flow/update", { step })
  }
}

export default dataAnalysisModalApi
