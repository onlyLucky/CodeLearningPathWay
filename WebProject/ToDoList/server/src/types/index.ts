export interface UserResponse {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  createdTime: Date;
  updatedTime: Date;
}

export interface TodoResponse {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: Date | null;
  userId: number;
  createdTime: Date;
  updatedTime: Date;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
