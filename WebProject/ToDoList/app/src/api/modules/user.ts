import { request } from '@/utils/request'
import type {
  LoginParams,
  RegisterParams,
  LoginResponse,
  UpdateUserParams,
  User,
} from '../types/user'

export const userApi = {
  login(params: LoginParams): Promise<LoginResponse> {
    return request.post('/user/login', params)
  },

  register(params: RegisterParams): Promise<LoginResponse> {
    return request.post('/user/register', params)
  },

  getUserInfo(): Promise<User> {
    return request.get('/user/info')
  },

  updateUser(params: UpdateUserParams): Promise<User> {
    return request.put('/user/info', params)
  },

  logout(): Promise<void> {
    return request.post('/user/logout')
  },
}
