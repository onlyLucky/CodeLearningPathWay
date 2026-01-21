import axios, {
  CreateAxiosDefaults,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios'
import type { RequestConfig, RequestConfigWithInterceptors, RequestInstance } from './types'
import config from './config'
import {
  requestInterceptor,
  requestInterceptorCatch,
  responseInterceptor,
  responseInterceptorCatch,
  clearPending,
} from './interceptors'

class Request {
  instance: AxiosInstance
  interceptors?: RequestConfigWithInterceptors['interceptors']
  showLoading?: boolean
  showError?: boolean

  constructor(options: RequestConfigWithInterceptors) {
    this.instance = axios.create(options as CreateAxiosDefaults<any>)
    this.interceptors = options.interceptors
    this.showLoading = options.showLoading
    this.showError = options.showError

    this.setupInterceptors()
  }

  setupInterceptors() {
    this.instance.interceptors.request.use(
      (config) => {
        const interceptors = this.interceptors?.requestInterceptor
        const result = interceptors ? interceptors(config) : config
        return requestInterceptor(result as InternalAxiosRequestConfig)
      },
      (error) => {
        const interceptorsCatch = this.interceptors?.requestInterceptorCatch
        const result = interceptorsCatch ? interceptorsCatch(error) : error
        return requestInterceptorCatch(result)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        const interceptors = this.interceptors?.responseInterceptor
        const result = interceptors ? interceptors(response) : response
        return responseInterceptor(result)
      },
      (error) => {
        const interceptorsCatch = this.interceptors?.responseInterceptorCatch
        const result = interceptorsCatch ? interceptorsCatch(error) : error
        return responseInterceptorCatch(result)
      }
    )
  }

  request<T = any>(config: RequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      this.instance
        .request<any, T>(config as any)
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  get<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url })
  }

  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data })
  }

  postForm<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const headerForm = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
    const tempConfig = { ...config, ...headerForm }
    return this.request<T>({ ...tempConfig, method: 'POST', url, data })
  }

  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT', url, data })
  }

  delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url })
  }

  patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH', url, data })
  }

  cancelRequest(url: string) {
    const pendingMap = (this.instance.defaults as any).pendingMap
    if (pendingMap && pendingMap.has(url)) {
      const controller = pendingMap.get(url)
      controller?.abort()
      pendingMap.delete(url)
    }
  }

  cancelAllRequest() {
    clearPending()
  }
}

const request = new Request({
  ...config,
  interceptors: {
    requestInterceptor: (config) => {
      return config
    },
    requestInterceptorCatch: (error) => {
      return error
    },
    responseInterceptor: (response) => {
      return response
    },
    responseInterceptorCatch: (error) => {
      return error
    },
  },
}) as RequestInstance

export default request
