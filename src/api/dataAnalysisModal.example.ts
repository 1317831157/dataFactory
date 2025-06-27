/**
 * DataAnalysisModal 接口使用示例
 * 展示如何在组件中使用 dataAnalysisModalApi
 */

import { dataAnalysisModalApi } from './dataAnalysisModal'

// ==================== 使用示例 ====================

/**
 * 示例1: 获取数据源列表
 * 用于初始化数据源选择界面
 */
export const fetchDataSources = async () => {
  try {
    const response = await dataAnalysisModalApi.getDataSources()
    const dataSources = response.data
    
    console.log('数据源列表:', dataSources)
    return dataSources
  } catch (error) {
    console.error('获取数据源列表失败:', error)
    throw error
  }
}

/**
 * 示例2: 获取数据源到分类类别的映射关系
 * 用于确定每个数据源支持哪些分类类别
 */
export const fetchSourceCategoryMapping = async () => {
  try {
    const response = await dataAnalysisModalApi.getSourceCategoryMapping()
    const mapping = response.data
    
    console.log('数据源分类映射:', mapping)
    return mapping
  } catch (error) {
    console.error('获取数据源分类映射失败:', error)
    throw error
  }
}

/**
 * 示例3: 开始关键词提取
 * 当用户点击数据源卡片时触发
 */
export const startKeywordExtraction = async (sourceType: string) => {
  try {
    const response = await dataAnalysisModalApi.startKeywordExtraction({
      sourceType,
      sampleSize: 1000
    })
    
    const taskId = response.data.taskId
    console.log('关键词提取任务已启动:', taskId)
    
    // 开始轮询进度
    return await pollKeywordExtractionProgress(taskId)
  } catch (error) {
    console.error('启动关键词提取失败:', error)
    throw error
  }
}

/**
 * 示例4: 轮询关键词提取进度
 * 实现关键词提取的动画效果
 */
export const pollKeywordExtractionProgress = async (taskId: string) => {
  return new Promise((resolve, reject) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await dataAnalysisModalApi.getKeywordExtractionProgress(taskId)
        const result = response.data
        
        // 更新进度显示
        console.log('关键词提取进度:', result.progress)
        
        if (result.progress >= 100) {
          clearInterval(pollInterval)
          resolve(result)
        }
      } catch (error) {
        clearInterval(pollInterval)
        reject(error)
      }
    }, 500) // 每500ms检查一次进度
  })
}

/**
 * 示例5: 开始数据预处理
 * 关键词提取完成后自动开始预处理
 */
export const startPreprocessing = async (sourceType: string) => {
  try {
    const response = await dataAnalysisModalApi.startPreprocessing({
      sourceType,
      steps: ['数据清洗', '格式标准化', '特征提取'],
      parameters: {
        cleaningThreshold: 0.8,
        standardFormat: 'json',
        featureCount: 100
      }
    })
    
    const taskId = response.data.taskId
    console.log('数据预处理任务已启动:', taskId)
    
    return await pollPreprocessingProgress(taskId)
  } catch (error) {
    console.error('启动数据预处理失败:', error)
    throw error
  }
}

/**
 * 示例6: 轮询预处理进度
 * 实现预处理步骤的动画效果
 */
export const pollPreprocessingProgress = async (taskId: string) => {
  return new Promise((resolve, reject) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await dataAnalysisModalApi.getPreprocessingProgress(taskId)
        const result = response.data
        
        // 更新预处理步骤显示
        console.log('预处理进度:', result.progress)
        console.log('当前步骤:', result.steps)
        
        if (result.status === 'completed') {
          clearInterval(pollInterval)
          resolve(result)
        } else if (result.status === 'failed') {
          clearInterval(pollInterval)
          reject(new Error('预处理失败'))
        }
      } catch (error) {
        clearInterval(pollInterval)
        reject(error)
      }
    }, 1000) // 每1秒检查一次进度
  })
}

/**
 * 示例7: 开始智能分类
 * 预处理完成后开始分类任务
 */
export const startClassification = async (sourceType: string) => {
  try {
    const response = await dataAnalysisModalApi.startClassification({
      sourceType,
      parameters: {
        batchSize: 32,
        threshold: 0.8,
        enablePreprocessing: false // 已经预处理过了
      }
    })
    
    const taskId = response.data.taskId
    console.log('智能分类任务已启动:', taskId)
    
    return await pollClassificationProgress(taskId)
  } catch (error) {
    console.error('启动智能分类失败:', error)
    throw error
  }
}

/**
 * 示例8: 轮询分类进度
 * 实时更新分类指标和混淆矩阵
 */
export const pollClassificationProgress = async (taskId: string) => {
  return new Promise((resolve, reject) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await dataAnalysisModalApi.getClassificationProgress(taskId)
        const task = response.data
        
        // 更新分类进度
        console.log('分类进度:', task.progress)
        
        if (task.metrics) {
          // 更新分类指标
          console.log('分类指标:', task.metrics)
        }
        
        if (task.status === 'completed') {
          clearInterval(pollInterval)
          resolve(task)
        } else if (task.status === 'failed') {
          clearInterval(pollInterval)
          reject(new Error(task.error || '分类失败'))
        }
      } catch (error) {
        clearInterval(pollInterval)
        reject(error)
      }
    }, 100) // 每100ms检查一次进度，实现平滑的指标更新
  })
}

/**
 * 示例9: 获取混淆矩阵数据
 * 用于生成混淆矩阵热力图
 */
export const fetchConfusionMatrixData = async (taskId: string) => {
  try {
    const response = await dataAnalysisModalApi.getConfusionMatrixData(taskId)
    const matrixData = response.data
    
    console.log('混淆矩阵数据:', matrixData)
    return matrixData
  } catch (error) {
    console.error('获取混淆矩阵数据失败:', error)
    throw error
  }
}

/**
 * 示例10: 获取分类结果统计
 * 用于更新分类结果卡片显示
 */
export const fetchCategoryStats = async (taskId: string) => {
  try {
    const response = await dataAnalysisModalApi.getCategoryStats(taskId)
    const categoryStats = response.data
    
    console.log('分类结果统计:', categoryStats)
    return categoryStats
  } catch (error) {
    console.error('获取分类结果统计失败:', error)
    throw error
  }
}

/**
 * 示例11: 处理卡片点击事件
 * 完整的数据分析流程
 */
export const handleCardClick = async (sourceType: string) => {
  try {
    console.log('开始分析数据源:', sourceType)
    
    // 1. 开始关键词提取
    const keywordResult = await startKeywordExtraction(sourceType)
    console.log('关键词提取完成:', keywordResult)
    
    // 2. 开始数据预处理
    const preprocessResult = await startPreprocessing(sourceType)
    console.log('数据预处理完成:', preprocessResult)
    
    // 3. 开始智能分类
    const classificationResult = await startClassification(sourceType)
    console.log('智能分类完成:', classificationResult)
    
    // 4. 获取最终结果
    const [confusionMatrix, categoryStats] = await Promise.all([
      fetchConfusionMatrixData(classificationResult.taskId),
      fetchCategoryStats(classificationResult.taskId)
    ])
    
    return {
      taskId: classificationResult.taskId,
      metrics: classificationResult.metrics,
      confusionMatrix,
      categoryStats
    }
  } catch (error) {
    console.error('数据分析流程失败:', error)
    throw error
  }
}

/**
 * 示例12: 获取实时分析状态
 * 用于显示当前分析任务的状态
 */
export const fetchRealTimeAnalysisStatus = async () => {
  try {
    const response = await dataAnalysisModalApi.getRealTimeAnalysisStatus()
    const status = response.data
    
    console.log('实时分析状态:', status)
    return status
  } catch (error) {
    console.error('获取实时分析状态失败:', error)
    throw error
  }
}

/**
 * 示例13: 导出分析结果
 */
export const exportAnalysisResult = async (taskId: string, format: 'json' | 'csv' | 'excel' | 'pdf' = 'excel') => {
  try {
    const response = await dataAnalysisModalApi.exportAnalysisResult({
      taskId,
      format,
      includeMetrics: true,
      includeCategoryStats: true,
      includeConfusionMatrix: true,
      includeRawData: false
    })
    
    // 创建下载链接
    const blob = new Blob([response.data])
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `analysis_result_${taskId}.${format}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    console.log('分析结果导出成功')
  } catch (error) {
    console.error('导出分析结果失败:', error)
    throw error
  }
}

// ==================== 组合使用示例 ====================

/**
 * 组合示例: 初始化组件数据
 * 在组件挂载时调用，获取所有必要的初始数据
 */
export const initializeComponentData = async () => {
  try {
    // 并行获取初始数据
    const [dataSources, categories, mapping, models] = await Promise.all([
      fetchDataSources(),
      dataAnalysisModalApi.getCategories(),
      fetchSourceCategoryMapping(),
      dataAnalysisModalApi.getAvailableModels()
    ])
    
    return {
      dataSources,
      categories: categories.data,
      mapping,
      models: models.data
    }
  } catch (error) {
    console.error('初始化组件数据失败:', error)
    throw error
  }
}

/**
 * 组合示例: 设置实时状态更新
 * 用于实现数据流动画和状态更新
 */
export const setupRealTimeUpdates = (updateInterval: number = 2000) => {
  const intervalId = setInterval(async () => {
    try {
      // 更新实时分析状态
      const status = await fetchRealTimeAnalysisStatus()
      
      // 更新数据流状态
      const flowStatus = await dataAnalysisModalApi.getDataFlowStatus()
      
      // 这里可以调用组件的状态更新函数
      console.log('实时状态已更新')
    } catch (error) {
      console.error('实时状态更新失败:', error)
    }
  }, updateInterval)
  
  // 返回清理函数
  return () => clearInterval(intervalId)
}
