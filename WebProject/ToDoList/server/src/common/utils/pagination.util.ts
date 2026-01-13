import { PaginationParams, PaginatedResponse } from '../interfaces';
import { PAGINATION } from '../constants';

export const getPaginationParams = (query: any): PaginationParams => {
  const page = Math.max(1, parseInt(query.page) || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(1, parseInt(query.limit) || PAGINATION.DEFAULT_LIMIT),
  );
  const sortBy = query.sortBy || 'createdAt';
  const sortOrder = (query.sortOrder || 'DESC').toUpperCase() as 'ASC' | 'DESC';

  return { page, limit, sortBy, sortOrder };
};

export const createPaginatedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResponse<T> => {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    total,
    page,
    limit,
    totalPages,
  };
};

export const calculateOffset = (page: number, limit: number): number => {
  return (page - 1) * limit;
};

export const calculateTotalPages = (total: number, limit: number): number => {
  return Math.ceil(total / limit);
};

export const hasNextPage = (page: number, totalPages: number): boolean => {
  return page < totalPages;
};

export const hasPreviousPage = (page: number): boolean => {
  return page > 1;
};
