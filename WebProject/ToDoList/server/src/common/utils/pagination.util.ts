import { PaginationParams, PaginatedResponse } from '../interfaces';
import { PAGINATION } from '../constants';

/**
 * 从请求查询参数中提取并标准化分页参数
 * @param query - 请求查询对象，可能包含 page、limit、sortBy、sortOrder
 * @returns 标准化后的分页参数对象
 */
export const getPaginationParams = (query: any): PaginationParams => {
  // 确保页码至少为 1，若未提供则使用默认值
  const pageNum = Math.max(
    1,
    parseInt(query.pageNum) || PAGINATION.DEFAULT_PAGE,
  );
  // 限制每页数量在 1 到 MAX_LIMIT 之间，若未提供则使用默认值
  const pageSize = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(1, parseInt(query.pageSize) || PAGINATION.DEFAULT_LIMIT),
  );
  // 默认按 createdAt 字段排序
  const sortBy = query.sortBy || 'createdAt';
  // 排序方式默认为 DESC，仅接受 ASC 或 DESC
  const sortOrder = (query.sortOrder || 'DESC').toUpperCase() as 'ASC' | 'DESC';

  return { pageNum, pageSize, sortBy, sortOrder };
};

/**
 * 根据数据数组及分页信息构建统一的分页响应结构
 * @param data - 当前页的数据数组
 * @param total - 总记录数
 * @param page - 当前页码
 * @param limit - 每页数量
 * @returns 符合 PaginatedResponse 接口的分页响应对象
 */
export const createPaginatedResponse = <T>(
  data: T[],
  total: number,
  pageNum: number,
  pageSize: number,
): PaginatedResponse<T> => {
  // 计算总页数
  const totalPages = Math.ceil(total / pageSize);

  return {
    data,
    total,
    pageNum,
    pageSize,
    totalPages,
  };
};

/**
 * 根据页码和每页数量计算数据库查询偏移量
 * @param page - 当前页码
 * @param limit - 每页数量
 * @returns 偏移量，用于 SQL 的 OFFSET 子句
 */
export const calculateOffset = (page: number, limit: number): number => {
  return (page - 1) * limit;
};

/**
 * 根据总记录数和每页数量计算总页数
 * @param total - 总记录数
 * @param limit - 每页数量
 * @returns 总页数
 */
export const calculateTotalPages = (total: number, limit: number): number => {
  return Math.ceil(total / limit);
};

/**
 * 判断是否存在下一页
 * @param page - 当前页码
 * @param totalPages - 总页数
 * @returns 若当前页小于总页数则返回 true，否则返回 false
 */
export const hasNextPage = (page: number, totalPages: number): boolean => {
  return page < totalPages;
};

/**
 * 判断是否存在上一页
 * @param page - 当前页码
 * @returns 若当前页大于 1 则返回 true，否则返回 false
 */
export const hasPreviousPage = (page: number): boolean => {
  return page > 1;
};
