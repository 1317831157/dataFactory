declare namespace API {
  // 分析参数
  interface AnalysisParams {
    directory: string
    options?: {
      recursive?: boolean
      [key: string]: any
    }
  }

  // 分析任务状态
  interface TaskStatus {
    status: "pending" | "running" | "completed" | "failed" | "not_found"
    progress: number
    result?: any
    error?: string
    elapsed_time?: number
  }

  // 资源项
  interface ResourceItem {
    id: number
    name: string
    count: number
    icon: string
    color: string
    files?: any[]
  }

  // 数据处理相关类型定义
  namespace DataProcessing {
    // 论文数据接口
    interface PaperData {
      id?: string
      title: string
      abstract: string
      source: string
      authors: string[]
      timestamp: string
      wordCount: number
      imageCount: number
      formulaCount: number
      topics: string[]
      type: "valid"
      size: number
      image?: string
      content?: string
    }

    // 公式数据接口
    interface FormulaData {
      id?: string
      title: string
      paperTitle: string
      image: string
      timestamp: string
      type: "formula"
      size: number
    }

    // 垃圾数据接口
    interface TrashData {
      id?: string
      title: string
      content: string
      timestamp: string
      type: "trash"
      reason: string
    }

    // 数据项联合类型
    type DataItem = PaperData | FormulaData | TrashData

    // 实时统计数据
    interface RealTimeStats {
      processSpeed: number // 处理速度（篇/秒）
      totalCount: number // 总论文量
      validPapersCount: number // 有效论文数量
      formulaImagesCount: number // 公式图片数量
      trashDataCount: number // 垃圾数据数量
    }

    // 24小时趋势数据
    interface TrendData {
      hourlyData: number[] // 24小时数据，索引对应小时
      totalProcessed: number // 总处理量
      peakHour: number // 峰值小时
      averagePerHour: number // 每小时平均处理量
    }

    // 分页参数
    interface PaginationParams {
      page: number
      pageSize: number
      sortBy?: string
      sortOrder?: "asc" | "desc"
    }

    // 分页响应
    interface PaginatedResponse<T> {
      data: T[]
      total: number
      page: number
      pageSize: number
      totalPages: number
    }

    // 过滤参数
    interface FilterParams {
      type?: "all" | "valid" | "formula" | "trash"
      source?: string
      dateRange?: [string, string]
      topics?: string[]
      minWordCount?: number
      maxWordCount?: number
    }

    // 处理结果响应
    interface ProcessingResult {
      success: boolean
      message: string
      data?: any
      errors?: string[]
    }

    // 批量操作参数
    interface BatchOperationParams {
      ids: string[]
      operation: "delete" | "restore" | "export" | "move"
      targetType?: "valid" | "formula" | "trash"
    }

    // 导出参数
    interface ExportParams {
      type: "valid" | "formula" | "trash" | "all"
      format: "json" | "csv" | "excel"
      filters?: FilterParams
      fields?: string[]
    }

    // 搜索参数
    interface SearchParams {
      keyword: string
      searchIn: ("title" | "abstract" | "content" | "authors")[]
      type?: "all" | "valid" | "formula" | "trash"
    }
  }

  // 数据分析相关类型定义
  namespace DataAnalysis {
    // 数据源类型
    interface DataSource {
      id: string
      name: string
      type: "law" | "paper" | "report" | "policy" | "book"
      description: string
      count: number
      lastUpdated: string
      categories: string[]
    }

    // 分类类别
    interface Category {
      id: string
      name: string
      type:
        | "robot"
        | "agriculture"
        | "landslide"
        | "vision"
        | "microscope"
        | "satellite"
        | "star"
      description: string
      icon: string
      color: string
    }

    // 预处理步骤
    interface PreprocessStep {
      id: string
      name: string
      description: string
      status: "pending" | "running" | "completed" | "failed"
      progress: number
      startTime?: string
      endTime?: string
      duration?: number
    }

    // 关键词提取结果
    interface KeywordExtractionResult {
      keywords: string[]
      totalKeywords: number
      extractedCount: number
      progress: number
      confidence: number
    }

    // 预处理结果
    interface PreprocessResult {
      taskId: string
      status: "pending" | "running" | "completed" | "failed"
      progress: number
      steps: PreprocessStep[]
      totalSteps: number
      completedSteps: number
      startTime: string
      endTime?: string
      duration?: number
      result?: {
        cleanedDataCount: number
        standardizedDataCount: number
        extractedFeatures: number
        qualityScore: number
      }
    }

    // 分类指标
    interface ClassificationMetrics {
      accuracy: number
      precision: number
      recall: number
      f1Score: number
      support: number
      confusionMatrix: number[][]
      classificationReport: {
        [category: string]: {
          precision: number
          recall: number
          f1Score: number
          support: number
        }
      }
    }

    // 分类结果统计
    interface CategoryStats {
      [category: string]: {
        count: number
        confidence: number
        percentage: number
        samples: number
      }
    }

    // 混淆矩阵数据
    interface ConfusionMatrixData {
      categories: string[]
      matrix: number[][]
      labels: string[]
      totalSamples: number
    }

    // 分类任务
    interface ClassificationTask {
      taskId: string
      sourceType: string
      status:
        | "pending"
        | "preprocessing"
        | "training"
        | "classifying"
        | "completed"
        | "failed"
      progress: number
      startTime: string
      endTime?: string
      duration?: number
      modelType: string
      parameters: Record<string, any>
      metrics?: ClassificationMetrics
      categoryStats?: CategoryStats
      error?: string
    }

    // 模型信息
    interface ModelInfo {
      id: string
      name: string
      type: string
      version: string
      description: string
      accuracy: number
      trainedOn: string
      supportedCategories: string[]
      parameters: Record<string, any>
    }

    // 分析请求参数
    interface AnalysisRequest {
      sourceType: string
      modelId?: string
      categories?: string[]
      parameters?: {
        batchSize?: number
        threshold?: number
        enablePreprocessing?: boolean
        preprocessingSteps?: string[]
      }
    }

    // 实时分析状态
    interface RealTimeAnalysisStatus {
      isRunning: boolean
      currentTask?: string
      progress: number
      estimatedTimeRemaining?: number
      processedSamples: number
      totalSamples: number
      currentStep: string
      queueLength: number
    }

    // 历史分析记录
    interface AnalysisHistory {
      id: string
      sourceType: string
      modelType: string
      startTime: string
      endTime: string
      duration: number
      status: "completed" | "failed"
      metrics: ClassificationMetrics
      categoryStats: CategoryStats
      samplesProcessed: number
    }

    // 分析报告
    interface AnalysisReport {
      id: string
      title: string
      sourceType: string
      generatedAt: string
      summary: {
        totalSamples: number
        categoriesFound: number
        averageConfidence: number
        processingTime: number
      }
      metrics: ClassificationMetrics
      categoryStats: CategoryStats
      recommendations: string[]
      charts: {
        confusionMatrix: ConfusionMatrixData
        categoryDistribution: Array<{
          category: string
          count: number
          percentage: number
        }>
        confidenceDistribution: Array<{ range: string; count: number }>
      }
    }

    // 导出参数
    interface ExportParams {
      taskId: string
      format: "json" | "csv" | "excel" | "pdf"
      includeMetrics: boolean
      includeCategoryStats: boolean
      includeConfusionMatrix: boolean
      includeRawData: boolean
    }
  }

  // 数据展示相关类型定义
  namespace DataDisplay {
    // 数据源选项
    interface DataSourceOption {
      label: string
      value: string
    }

    // 指标数据
    interface MetricData {
      title: string
      value: string
      trend: string
    }

    // 最新数据项
    interface LatestDataItem {
      title: string
      type: string
      dataSize: number
      updateDate: string
    }

    // 图表数据
    interface ChartData {
      categories: string[]
      values: number[]
    }

    // 数据源统计
    interface DataSourceStats {
      totalDocuments: number
      imageDatasets: number
      coverageRate: string
      sourceTypes: number
    }

    // 数据更新参数
    interface DataUpdateParams {
      dataSource: string
      selectedSubTypes: string[]
      dateRange: [Date, Date]
      selectedFields: string[]
    }

    // 数据导出参数
    interface DataExportParams {
      format: string
      dataSource?: string
      dateRange?: [Date, Date]
      fields?: string[]
    }

    // 数据源配置响应
    interface DataSourceConfigResponse {
      dataSourceOptions: DataSourceOption[]
      fieldOptions: string[]
      subTypeOptions: Record<string, string[]>
      exportOptions: string[]
    }

    // 数据统计响应
    interface DataStatsResponse {
      metricData: MetricData[]
      chartData: ChartData
      latestData: LatestDataItem[]
    }
  }
}
