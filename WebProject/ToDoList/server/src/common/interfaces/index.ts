export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  timestamp: string;
}

export interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  error?: string;
  timestamp: string;
  path?: string;
  method?: string;
}

export interface UserPayload {
  sub: number;
  username: string;
  email: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

export interface JwtPayload {
  sub: number;
  username: string;
  email: string;
  roles: string[];
}
