import { request } from '@/utils/request'
import type {
  CreateTodoParams,
  UpdateTodoParams,
  TodoListParams,
  TodoListResponse,
  Todo,
} from '../types/todo'

export const todoApi = {
  getTodoList(params?: TodoListParams): Promise<TodoListResponse> {
    return request.get('/todo/list', params)
  },

  getTodoDetail(id: number): Promise<Todo> {
    return request.get(`/todo/${id}`)
  },

  createTodo(params: CreateTodoParams): Promise<Todo> {
    return request.post('/todo', params)
  },

  updateTodo(id: number, params: UpdateTodoParams): Promise<Todo> {
    return request.put(`/todo/${id}`, params)
  },

  deleteTodo(id: number): Promise<void> {
    return request.delete(`/todo/${id}`)
  },

  toggleTodo(id: number, completed: boolean): Promise<Todo> {
    return request.patch(`/todo/${id}`, { completed })
  },
}
