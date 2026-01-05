export interface User {
  id: number
  name: string
  email: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface LoginParams {
  email: string
  password: string
}

export interface RegisterParams {
  name: string
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface UpdateUserParams {
  name?: string
  email?: string
  avatar?: string
}
