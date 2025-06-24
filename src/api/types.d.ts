declare namespace API {
  // 分析参数
  interface AnalysisParams {
    directory: string;
    options?: {
      recursive?: boolean;
      [key: string]: any;
    };
  }

  // 分析任务状态
  interface TaskStatus {
    status: 'pending' | 'running' | 'completed' | 'failed' | 'not_found';
    progress: number;
    result?: any;
    error?: string;
    elapsed_time?: number;
  }

  // 资源项
  interface ResourceItem {
    id: number;
    name: string;
    count: number;
    icon: string;
    color: string;
    files?: any[];
  }
}