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
  status: '0' | '1' | '2';
  priority: '0' | '1' | '2';
  reminderType: '0' | '1' | '2' | '3' | '4';
  reminderTime: Date | null;
  deadlineTime: Date | null;
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
