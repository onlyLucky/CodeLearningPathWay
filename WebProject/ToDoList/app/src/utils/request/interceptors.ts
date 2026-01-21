import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { RequestConfig } from './types'

const pendingMap = new Map<string, AbortController>()

export const getPendingUrl = (config: InternalAxiosRequestConfig): string => {
  return [config.method, config.url].join('&')
}

export const addPending = (config: InternalAxiosRequestConfig) => {
  const url = getPendingUrl(config)
  if (!pendingMap.has(url)) {
    const controller = new AbortController()
    config.signal = controller.signal
    pendingMap.set(url, controller)
  }
}

export const removePending = (config: InternalAxiosRequestConfig) => {
  const url = getPendingUrl(config)
  if (pendingMap.has(url)) {
    const controller = pendingMap.get(url)
    controller?.abort()
    pendingMap.delete(url)
  }
}

export const clearPending = () => {
  for (const controller of pendingMap.values()) {
    controller.abort()
  }
  pendingMap.clear()
}

export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  removePending(config)
  addPending(config)

  const token = uni.getStorageSync('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
}

export const requestInterceptorCatch = (error: any) => {
  return Promise.reject(error)
}

export const responseInterceptor = (response: AxiosResponse) => {
  const { data, config } = response

  removePending(config as InternalAxiosRequestConfig)

  if (data.code === 0) {
    return data
  } else {
    const showError = (config as RequestConfig).showError !== false
    if (showError) {
      uni.showToast({
        title: data.message || '请求失败',
        icon: 'none',
        duration: 2000,
      })
    }
    return Promise.reject(data)
  }
}

export const responseInterceptorCatch = (error: any) => {
  const { config, response } = error

  removePending(config)

  if (error.code === 'ERR_CANCELED') {
    return Promise.reject({ message: '请求已取消' })
  }

  const showError = config?.showError !== false

  if (response) {
    switch (response.status) {
      case 400:
        showError &&
          uni.showToast({
            title: '请求参数错误',
            icon: 'none',
            duration: 2000,
          })
        break
      case 401:
        showError &&
          uni.showToast({
            title: '未授权，请重新登录',
            icon: 'none',
            duration: 2000,
          })
        uni.removeStorageSync('token')
        uni.reLaunch({
          url: '/pages/index/index',
        })
        break
      case 403:
        showError &&
          uni.showToast({
            title: '拒绝访问',
            icon: 'none',
            duration: 2000,
          })
        break
      case 404:
        showError &&
          uni.showToast({
            title: '请求资源不存在',
            icon: 'none',
            duration: 2000,
          })
        break
      case 500:
        showError &&
          uni.showToast({
            title: '服务器错误',
            icon: 'none',
            duration: 2000,
          })
        break
      case 502:
        showError &&
          uni.showToast({
            title: '网关错误',
            icon: 'none',
            duration: 2000,
          })
        break
      case 503:
        showError &&
          uni.showToast({
            title: '服务不可用',
            icon: 'none',
            duration: 2000,
          })
        break
      case 504:
        showError &&
          uni.showToast({
            title: '网关超时',
            icon: 'none',
            duration: 2000,
          })
        break
      default:
        showError &&
          uni.showToast({
            title: response.data?.message || '请求失败',
            icon: 'none',
            duration: 2000,
          })
    }
  } else if (error.message.includes('timeout')) {
    showError &&
      uni.showToast({
        title: '请求超时',
        icon: 'none',
        duration: 2000,
      })
  } else if (error.message.includes('Network Error')) {
    showError &&
      uni.showToast({
        title: '网络错误',
        icon: 'none',
        duration: 2000,
      })
  } else {
    showError &&
      uni.showToast({
        title: error.message || '未知错误',
        icon: 'none',
        duration: 2000,
      })
  }

  return Promise.reject(error)
}
