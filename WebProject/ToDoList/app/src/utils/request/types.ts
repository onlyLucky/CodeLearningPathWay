import type { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface RequestConfig extends AxiosRequestConfig {
  showLoading?: boolean
  showError?: boolean
  // cancelToken?: string
}

export interface ResponseData<T = any> {
  authCode?: string
  code: number
  data?: T
  msg: string
}

export interface RequestInterceptors {
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
  requestInterceptorCatch?: (error: any) => any
  responseInterceptor?: (response: AxiosResponse) => AxiosResponse
  responseInterceptorCatch?: (error: any) => any
}

export interface RequestConfigWithInterceptors extends RequestConfig {
  interceptors?: RequestInterceptors
}

export interface RequestInstance {
  get<T = any>(url: string, config?: RequestConfig): Promise<ResponseData<T>>
  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ResponseData<T>>
  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ResponseData<T>>
  delete<T = any>(url: string, config?: RequestConfig): Promise<ResponseData<T>>
  patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ResponseData<T>>
  request<T = any>(config: RequestConfig): Promise<ResponseData<T>>
  cancelRequest: (url: string) => void
  cancelAllRequest: () => void
}
