import axios from "axios"
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios"
// import { toast } from 'vue-sonner'

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "", // 设置统一的请求前缀
  timeout: 30000, // 设置统一的超时时长
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
})

// 请求拦截
service.interceptors.request.use(
  (config: any) => {
    // 从localStorage获取token
    const token = localStorage.getItem("token")
    if (token) {
      // 设置token到请求头
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 创建提示函数
const showToast = (
  message: string,
  type: "default" | "destructive" = "default"
) => {
  if (type === "destructive") {
    // toast.error(message, { duration: 3000 })
  } else {
    // toast.success(message, { duration: 3000 })
  }
}

// 响应拦截
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response
    // 根据自定义code判断请求是否成功
    if (data.code === 200) {
      // 请求成功
      return data
    } else {
      // 显示错误消息
      const errorMsg = data.message || "操作失败"
      showToast(errorMsg, "destructive")
      // 返回更详细的错误信息
      return Promise.reject(new Error(errorMsg))
    }
  },
  (error) => {
    // 处理HTTP错误状态码
    let message = ""

    if (error.response) {
      // 服务器返回了错误状态码
      const status = error.response.status
      switch (status) {
        case 400:
          message = "请求错误"
          break
        case 401:
          message = "未授权，请重新登录"
          // 可以在此处理登出逻辑
          break
        case 403:
          message = "拒绝访问"
          break
        case 404:
          message = "请求地址出错"
          break
        case 500:
          message = "服务器内部错误"
          break
        default:
          message = `请求失败(${status})`
      }

      // 优先使用服务器返回的错误信息
      message = error.response.data?.message || message
    } else if (error.request) {
      // 请求已发出但没有收到响应
      message = "服务器无响应"
    } else {
      // 请求设置时触发的错误
      message = error.message || "请求失败"
    }

    // 处理网络错误
    if (error.message && error.message.includes("Network Error")) {
      message = "网络连接异常，请检查网络设置"
    }

    // 处理超时错误
    if (error.message && error.message.includes("timeout")) {
      message = "请求超时，请稍后重试"
    }

    showToast(message, "destructive")

    // 返回明确的错误对象，包含详细信息
    const enhancedError = new Error(message)
    enhancedError.name = "RequestError"
    // 使用自定义属性存储原始错误
    ;(enhancedError as any).originalError = error

    return Promise.reject(enhancedError)
  }
)

// 封装请求方法
interface RequestOptions extends AxiosRequestConfig {
  loading?: boolean
}

// 分别封装GET、POST、PUT、DELETE方法
const request = {
  get<T = any>(
    url: string,
    params?: object,
    options?: RequestOptions
  ): Promise<T> {
    return service.get(url, { params, ...options })
  },

  post<T = any>(
    url: string,
    data?: object,
    options?: RequestOptions
  ): Promise<T> {
    return service.post(url, data, options)
  },

  put<T = any>(
    url: string,
    data?: object,
    options?: RequestOptions
  ): Promise<T> {
    return service.put(url, data, options)
  },

  delete<T = any>(
    url: string,
    params?: object,
    options?: RequestOptions
  ): Promise<T> {
    return service.delete(url, { params, ...options })
  },
}

export default request
