import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios'
import type { RequestConfig, ResponseData, RequestError } from './types'

class Request {
  private instance: AxiosInstance
  private baseURL: string
  private timeout: number

  constructor(config: { baseURL: string; timeout?: number }) {
    this.baseURL = config.baseURL
    this.timeout = config.timeout || 10000

    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error: AxiosError) => {
        console.error('Request error:', error)
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response: AxiosResponse<ResponseData>) => {
        const { code, message, data } = response.data

        if (code === 200 || code === 0) {
          return data
        } else {
          const error: RequestError = {
            message: message || '请求失败',
            code,
            response: response.data,
          }
          return Promise.reject(error)
        }
      },
      (error: AxiosError) => {
        let errorMessage = '网络错误，请稍后重试'

        if (error.response) {
          const { status, data } = error.response

          switch (status) {
            case 400:
              errorMessage = '请求参数错误'
              break
            case 401:
              errorMessage = '未授权，请重新登录'
              localStorage.removeItem('token')
              window.location.href = '/'
              break
            case 403:
              errorMessage = '拒绝访问'
              break
            case 404:
              errorMessage = '请求资源不存在'
              break
            case 500:
              errorMessage = '服务器内部错误'
              break
            case 502:
              errorMessage = '网关错误'
              break
            case 503:
              errorMessage = '服务不可用'
              break
            case 504:
              errorMessage = '网关超时'
              break
            default:
              errorMessage = (data as any)?.message || '请求失败'
          }
        } else if (error.request) {
          errorMessage = '网络连接失败，请检查网络'
        }

        const requestError: RequestError = {
          message: errorMessage,
          code: error.response?.status,
          response: error.response?.data,
        }

        console.error('Response error:', requestError)
        return Promise.reject(requestError)
      }
    )
  }

  public request<T = any>(config: RequestConfig): Promise<T> {
    return this.instance.request(config)
  }

  public get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, { params, ...config })
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config)
  }

  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put(url, data, config)
  }

  public delete<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, { params, ...config })
  }

  public patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.patch(url, data, config)
  }
}

const request = new Request({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
})

export default request
