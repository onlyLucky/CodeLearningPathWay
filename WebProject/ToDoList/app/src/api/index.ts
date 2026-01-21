import request from '@/utils/request/index'
import type { ResponseData } from '@/utils/request/types'

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  token: string
  userInfo: {
    id: string
    username: string
    avatar: string
  }
}

export interface RecordingParams {
  page: number
  pageSize: number
}

export interface RecordingItem {
  id: string
  name: string
  duration: number
  filePath: string
  fileSize: number
  createdAt: string
  status: 'recording' | 'completed' | 'failed'
}

export interface RecordingListResult {
  list: RecordingItem[]
  total: number
  page: number
  pageSize: number
}

export const authApi = {
  login: (params: LoginParams) => {
    return request.post<ResponseData<LoginResult>>('/auth/login', params)
  },
  logout: () => {
    return request.post<ResponseData<void>>('/auth/logout')
  },
  getUserInfo: () => {
    return request.get<ResponseData<LoginResult['userInfo']>>('/auth/userinfo')
  },
}

export const voiceApi = {
  // 获取会议列表
  getMeetingList: (params?: any) => {
    return request.post<ResponseData<any[]>>('/meeting/list', params)
  },
  // 获取语音转译段落列表
  getParagraphListByPaging: (params?: any) => {
    return request.post<ResponseData<any>>('/voice/paragraphListByPaging', params)
  },
  // 获取会议麦克风状态
  getMicStatus: (params?: any) => {
    return request.post<ResponseData<any>>('/voice/mikeStatus', params)
  },
  // 创建会议
  createMeeting: (params?: any) => {
    return request.post<ResponseData<any>>('/meeting/saveMeeting', params)
  },
  // 关闭所有设备
  closeAllDevices: (params?: any) => {
    return request.post<ResponseData<any>>('/voice/closeAll', params)
  },
  // 控制麦克风
  mikeContrl: (params?: any) => {
    return request.post<ResponseData<any>>('/voice/mikeContrl', params)
  },
  // 获取文档
  getDoc: (params?: any) => {
    return request.post<ResponseData<any>>('/voice/getDoc', params)
  },
  // 切换发言人
  changeSpeaker: (params?: any) => {
    return request.post<ResponseData<any>>('/voice/changeSpeaker', params)
  },
}

export const recordingApi = {
  getList: (params: RecordingParams) => {
    return request.get<ResponseData<RecordingListResult>>('/recording/list', { params })
  },
  getDetail: (id: string) => {
    return request.get<ResponseData<RecordingItem>>(`/recording/detail/${id}`)
  },
  create: (data: Partial<RecordingItem>) => {
    return request.post<ResponseData<RecordingItem>>('/recording/create', data)
  },
  update: (id: string, data: Partial<RecordingItem>) => {
    return request.put<ResponseData<RecordingItem>>(`/recording/update/${id}`, data)
  },
  delete: (id: string) => {
    return request.delete<ResponseData<void>>(`/recording/delete/${id}`)
  },
}

export const uploadApi = {
  uploadFile: (filePath: string, _onProgress?: (progress: number) => void) => {
    return new Promise<{ url: string }>((resolve, reject) => {
      uni.uploadFile({
        url: import.meta.env.VITE_BASE_API + '/upload',
        filePath,
        name: 'file',
        header: {
          Authorization: `Bearer ${uni.getStorageSync('token')}`,
        },
        success: (res) => {
          const data = JSON.parse(res.data)
          if (data.code === 200) {
            resolve(data)
          } else {
            reject(data)
          }
        },
        fail: (err) => {
          reject(err)
        },
      })
    })
  },
}
