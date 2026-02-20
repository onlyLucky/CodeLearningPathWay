export interface PaginationParams {
  pageNum?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  pageNum: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  code: number;
  message: string;
  data?: T;
  timestamp: string;
}

export interface ErrorResponse {
  success: false;
  code: number;
  data: null;
  message: string;
  error?: string;
  timestamp: string;
}

export interface UserPayload {
  id: number;
  username: string;
  email: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

export interface JwtPayload {
  id: number;
  username: string;
  email: string;
  roles: string[];
}
