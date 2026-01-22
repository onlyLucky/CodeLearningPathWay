import axios from 'axios'
import config from '@/config'

const request = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

request.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data.code === 200) {
      return data.data
    }
    return Promise.reject(new Error(data.message || '请求失败'))
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

export default request
