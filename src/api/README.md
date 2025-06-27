# 数据工厂 API 接口文档

## 概述

本文档描述了数据工厂系统的所有 API 接口，包括数据处理模态框和数据分析模态框的接口。这些接口支持完整的数据处理和分析流程。

## 文件结构

```
src/api/
├── dataProcessingModal.ts          # 数据处理模态框接口
├── dataProcessingModal.example.ts  # 数据处理使用示例
├── dataAnalysisModal.ts            # 数据分析模态框接口
├── dataAnalysisModal.example.ts    # 数据分析使用示例
├── dataCollectModal.ts             # 数据采集相关接口
├── types.d.ts                      # TypeScript 类型定义
├── index.ts                        # API 导出入口
└── README.md                       # 本文档
```

## 主要功能模块

### 1. 实时统计模块

#### `getRealTimeStats()`

获取实时统计数据，包括：

- 处理速度（篇/秒）
- 总论文量
- 各类型数据数量

```typescript
const stats = await dataProcessingModalApi.getRealTimeStats()
console.log(stats.data.processSpeed) // 处理速度
console.log(stats.data.totalCount) // 总论文量
```

#### `getTrendData()`

获取 24 小时处理趋势数据，用于绘制趋势图表：

```typescript
const trendData = await dataProcessingModalApi.getTrendData()
console.log(trendData.data.hourlyData) // 24小时数据数组
```

### 2. 论文数据管理模块

#### `getValidPapers(params)`

获取有效论文列表，支持分页、排序、过滤：

```typescript
const papers = await dataProcessingModalApi.getValidPapers({
  page: 1,
  pageSize: 10,
  sortBy: "timestamp",
  sortOrder: "desc",
})
```

#### `getPaperDetail(paperId)`

获取单个论文的详细信息：

```typescript
const paper = await dataProcessingModalApi.getPaperDetail("paper-id-123")
```

#### `downloadPaper(paperId, format)`

下载论文文件，支持多种格式：

```typescript
await dataProcessingModalApi.downloadPaper("paper-id-123", "pdf")
```

#### `batchOperatePapers(params)`

批量操作论文（删除、移动、导出等）：

```typescript
await dataProcessingModalApi.batchOperatePapers({
  ids: ["paper1", "paper2"],
  operation: "delete",
})
```

### 3. 公式图片管理模块

#### `getFormulaImages(params)`

获取公式图片列表：

```typescript
const formulas = await dataProcessingModalApi.getFormulaImages({
  page: 1,
  pageSize: 20,
})
```

#### `downloadFormula(formulaId, format)`

下载公式图片：

```typescript
await dataProcessingModalApi.downloadFormula("formula-id-123", "png")
```

### 4. 垃圾数据管理模块

#### `getTrashData(params)`

获取垃圾数据列表：

```typescript
const trashData = await dataProcessingModalApi.getTrashData({
  page: 1,
  pageSize: 10,
})
```

#### `clearTrash()`

清空垃圾箱：

```typescript
await dataProcessingModalApi.clearTrash()
```

#### `restoreTrashData(params)`

恢复垃圾数据：

```typescript
await dataProcessingModalApi.restoreTrashData({
  ids: ["trash1", "trash2"],
  targetType: "valid",
})
```

### 5. 实时处理结果模块

#### `getLatestProcessingResults(params)`

获取最新处理结果：

```typescript
const latestResults = await dataProcessingModalApi.getLatestProcessingResults({
  limit: 50,
  type: "all",
})
```

#### `getProcessingQueueStatus()`

获取处理队列状态：

```typescript
const queueStatus = await dataProcessingModalApi.getProcessingQueueStatus()
console.log(queueStatus.data.queueLength) // 队列长度
```

### 6. 搜索和过滤模块

#### `searchData(params)`

搜索数据：

```typescript
const searchResults = await dataProcessingModalApi.searchData({
  keyword: "机器学习",
  searchIn: ["title", "abstract"],
  type: "valid",
  page: 1,
  pageSize: 20,
})
```

#### `getFilterOptions()`

获取可用的过滤选项：

```typescript
const options = await dataProcessingModalApi.getFilterOptions()
console.log(options.data.sources) // 可用数据源
console.log(options.data.topics) // 可用主题标签
```

### 7. 导出模块

#### `exportData(params)`

导出数据：

```typescript
await dataProcessingModalApi.exportData({
  type: "valid",
  format: "excel",
  filters: { source: "arXiv" },
})
```

#### `getExportTaskStatus(taskId)`

获取导出任务状态（用于大数据量导出）：

```typescript
const status = await dataProcessingModalApi.getExportTaskStatus("task-123")
console.log(status.data.progress) // 导出进度
```

## 类型定义

所有接口的类型定义都在 `types.d.ts` 文件中的 `API.DataProcessing` 命名空间下：

```typescript
// 论文数据类型
API.DataProcessing.PaperData

// 公式数据类型
API.DataProcessing.FormulaData

// 垃圾数据类型
API.DataProcessing.TrashData

// 实时统计数据类型
API.DataProcessing.RealTimeStats

// 趋势数据类型
API.DataProcessing.TrendData

// 分页参数类型
API.DataProcessing.PaginationParams

// 过滤参数类型
API.DataProcessing.FilterParams
```

## 使用示例

详细的使用示例请参考 `dataProcessingModal.example.ts` 文件，其中包含：

1. 基本接口调用示例
2. 错误处理示例
3. 组合使用示例
4. 实时数据更新示例

## 错误处理

所有接口都应该进行适当的错误处理：

```typescript
try {
  const result = await dataProcessingModalApi.getRealTimeStats()
  // 处理成功结果
} catch (error) {
  console.error("接口调用失败:", error)
  // 处理错误情况
}
```

## 注意事项

1. **分页**: 大部分列表接口都支持分页，建议合理设置 `pageSize` 以优化性能
2. **过滤**: 使用过滤参数可以减少数据传输量，提高响应速度
3. **缓存**: 对于不经常变化的数据（如过滤选项），建议在客户端进行缓存
4. **实时更新**: 使用定时器或 WebSocket 来实现实时数据更新
5. **错误处理**: 所有接口调用都应该包含错误处理逻辑

## 后端接口规范

后端需要实现以下 REST API 端点：

```
GET    /api/processing/realtime-stats
GET    /api/processing/trend-data
GET    /api/processing/papers/valid
GET    /api/processing/papers/:id
GET    /api/processing/papers/:id/download
POST   /api/processing/papers/batch
GET    /api/processing/formulas
GET    /api/processing/formulas/:id/download
GET    /api/processing/trash
DELETE /api/processing/trash/clear
POST   /api/processing/trash/restore
GET    /api/processing/latest-results
GET    /api/processing/queue-status
POST   /api/processing/search
GET    /api/processing/filter-options
POST   /api/processing/export
GET    /api/processing/export/status/:taskId
```

每个端点都应该返回统一的响应格式，包含适当的状态码和错误信息。

---

# 数据分析模态框 API 接口文档

## 概述

数据分析模态框接口支持智能数据分析和分类功能，包括数据源管理、预处理、机器学习分类、结果可视化等。

## 主要功能模块

### 1. 数据源管理模块

#### `getDataSources()`

获取可用的数据源列表：

```typescript
const dataSources = await dataAnalysisModalApi.getDataSources()
console.log(dataSources.data) // 数据源列表
```

#### `getSourceCategoryMapping()`

获取数据源到分类类别的映射关系：

```typescript
const mapping = await dataAnalysisModalApi.getSourceCategoryMapping()
console.log(mapping.data) // { law: ['robot', 'vision'], ... }
```

### 2. 数据预处理模块

#### `startKeywordExtraction(sourceType)`

开始关键词提取：

```typescript
const response = await dataAnalysisModalApi.startKeywordExtraction({
  sourceType: "paper",
  sampleSize: 1000,
})
const taskId = response.data.taskId
```

#### `getKeywordExtractionProgress(taskId)`

获取关键词提取进度：

```typescript
const progress = await dataAnalysisModalApi.getKeywordExtractionProgress(taskId)
console.log(progress.data.progress) // 进度百分比
```

#### `startPreprocessing(params)`

开始数据预处理：

```typescript
const response = await dataAnalysisModalApi.startPreprocessing({
  sourceType: "paper",
  steps: ["数据清洗", "格式标准化", "特征提取"],
})
```

### 3. 智能分类模块

#### `startClassification(params)`

开始智能分类任务：

```typescript
const response = await dataAnalysisModalApi.startClassification({
  sourceType: "paper",
  parameters: {
    batchSize: 32,
    threshold: 0.8,
  },
})
```

#### `getClassificationMetrics(taskId)`

获取分类性能指标：

```typescript
const metrics = await dataAnalysisModalApi.getClassificationMetrics(taskId)
console.log(metrics.data.accuracy) // 准确率
console.log(metrics.data.precision) // 精确率
console.log(metrics.data.recall) // 召回率
```

### 4. 混淆矩阵模块

#### `getConfusionMatrixData(taskId)`

获取混淆矩阵数据：

```typescript
const matrixData = await dataAnalysisModalApi.getConfusionMatrixData(taskId)
console.log(matrixData.data.matrix) // 混淆矩阵数组
console.log(matrixData.data.categories) // 类别标签
```

### 5. 分类结果统计模块

#### `getCategoryStats(taskId)`

获取分类结果统计：

```typescript
const stats = await dataAnalysisModalApi.getCategoryStats(taskId)
console.log(stats.data) // { robot: { count: 10, confidence: 0.95 }, ... }
```

#### `updateCategoryStats(params)`

实时更新分类结果统计：

```typescript
const updatedStats = await dataAnalysisModalApi.updateCategoryStats({
  taskId,
  sourceType: "paper",
  categories: ["robot", "vision"],
})
```

## 完整的分析流程示例

```typescript
// 1. 初始化数据
const initData = await initializeComponentData()

// 2. 处理卡片点击事件
const handleCardClick = async (sourceType: string) => {
  try {
    // 开始关键词提取
    const keywordResult = await startKeywordExtraction(sourceType)

    // 开始数据预处理
    const preprocessResult = await startPreprocessing(sourceType)

    // 开始智能分类
    const classificationResult = await startClassification(sourceType)

    // 获取最终结果
    const [confusionMatrix, categoryStats] = await Promise.all([
      fetchConfusionMatrixData(classificationResult.taskId),
      fetchCategoryStats(classificationResult.taskId),
    ])

    return {
      metrics: classificationResult.metrics,
      confusionMatrix,
      categoryStats,
    }
  } catch (error) {
    console.error("分析流程失败:", error)
  }
}
```

## 类型定义

所有接口的类型定义都在 `types.d.ts` 文件中的 `API.DataAnalysis` 命名空间下：

```typescript
// 数据源类型
API.DataAnalysis.DataSource

// 分类类别类型
API.DataAnalysis.Category

// 预处理结果类型
API.DataAnalysis.PreprocessResult

// 分类指标类型
API.DataAnalysis.ClassificationMetrics

// 分类结果统计类型
API.DataAnalysis.CategoryStats

// 混淆矩阵数据类型
API.DataAnalysis.ConfusionMatrixData
```

## 后端接口规范

后端需要实现以下 REST API 端点：

```
GET    /api/analysis/data-sources
GET    /api/analysis/source-category-mapping
GET    /api/analysis/categories
POST   /api/analysis/keyword-extraction/start
GET    /api/analysis/keyword-extraction/progress/:taskId
POST   /api/analysis/preprocessing/start
GET    /api/analysis/preprocessing/progress/:taskId
GET    /api/analysis/models
POST   /api/analysis/classification/start
GET    /api/analysis/classification/progress/:taskId
GET    /api/analysis/classification/metrics/:taskId
GET    /api/analysis/confusion-matrix/:taskId
GET    /api/analysis/category-stats/:taskId
POST   /api/analysis/category-stats/update
GET    /api/analysis/status/realtime
POST   /api/analysis/export
```

## 实时更新机制

数据分析模态框支持实时更新，建议使用以下策略：

1. **轮询更新**: 对于进度监控，使用短间隔轮询（100-500ms）
2. **WebSocket**: 对于实时状态更新，可以考虑使用 WebSocket
3. **缓存策略**: 对于不经常变化的数据（如模型列表），进行客户端缓存

## 错误处理

所有接口都应该包含完善的错误处理：

```typescript
try {
  const result = await dataAnalysisModalApi.startClassification(params)
  // 处理成功结果
} catch (error) {
  console.error("分类任务启动失败:", error)
  // 显示错误提示
  message.error("分类任务启动失败，请重试")
}
```
