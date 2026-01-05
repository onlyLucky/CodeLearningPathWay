export interface Todo {
  id: number
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export interface CreateTodoParams {
  title: string
  description?: string
  priority?: 'low' | 'medium' | 'high'
  dueDate?: string
}

export interface UpdateTodoParams {
  title?: string
  description?: string
  completed?: boolean
  priority?: 'low' | 'medium' | 'high'
  dueDate?: string
}

export interface TodoListParams {
  page?: number
  pageSize?: number
  completed?: boolean
  priority?: 'low' | 'medium' | 'high'
}

export interface TodoListResponse {
  list: Todo[]
  total: number
  page: number
  pageSize: number
}
