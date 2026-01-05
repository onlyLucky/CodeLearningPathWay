export interface RequestConfig {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: any
  params?: any
  headers?: Record<string, string>
  timeout?: number
}

export interface ResponseData<T = any> {
  code: number
  message: string
  data: T
}

export interface RequestError {
  message: string
  code?: number
  response?: any
}
