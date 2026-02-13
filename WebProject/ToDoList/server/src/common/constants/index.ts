/**
 * 错误码常量
 * 用于统一标识各类业务异常
 */
export const ERROR_CODES = {
  /** 参数校验失败 */
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  /** 资源不存在 */
  NOT_FOUND: 'NOT_FOUND',
  /** 未认证/未登录 */
  UNAUTHORIZED: 'UNAUTHORIZED',
  /** 权限不足 */
  FORBIDDEN: 'FORBIDDEN',
  /** 服务器内部错误 */
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  /** 请求格式错误 */
  BAD_REQUEST: 'BAD_REQUEST',
  /** 资源冲突，如唯一索引冲突 */
  CONFLICT: 'CONFLICT',
} as const;

/**
 * 成功状态码常量
 * 用于统一标识各类操作成功结果
 */
export const SUCCESS_CODES = {
  /** 资源创建成功 */
  CREATED: 'CREATED',
  /** 资源更新成功 */
  UPDATED: 'UPDATED',
  /** 资源删除成功 */
  DELETED: 'DELETED',
  /** 请求处理成功且无内容返回 */
  OK: 'OK',
} as const;

/**
 * 用户角色常量
 * 定义系统中所有可用的角色标识
 */
export const USER_ROLES = {
  /** 管理员，拥有最高权限 */
  ADMIN: 'admin',
  /** 普通注册用户 */
  USER: 'user',
  /** 游客/未登录用户 */
  GUEST: 'guest',
} as const;

/**
 * HTTP 状态码常量
 * 与 RESTful 接口规范对应的状态码
 */
export const HTTP_STATUS = {
  /** 请求成功 */
  OK: 200,
  /** 资源创建成功 */
  CREATED: 201,
  /** 请求成功但无内容返回 */
  NO_CONTENT: 204,
  /** 请求参数错误 */
  BAD_REQUEST: 400,
  /** 未认证/未登录 */
  UNAUTHORIZED: 401,
  /** 权限不足 */
  FORBIDDEN: 403,
  /** 资源不存在 */
  NOT_FOUND: 404,
  /** 资源冲突 */
  CONFLICT: 409,
  /** 服务器内部错误 */
  INTERNAL_SERVER_ERROR: 500,
  /** 服务不可用 */
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * 分页默认参数
 * 用于列表接口的统一分页行为
 */
export const PAGINATION = {
  /** 默认页码，从 1 开始 */
  DEFAULT_PAGE: 1,
  /** 默认每页数量 */
  DEFAULT_LIMIT: 10,
  /** 每页数量上限，防止一次性请求过多数据 */
  MAX_LIMIT: 100,
} as const;

/**
 * 缓存过期时间（秒）
 * 用于统一控制各类缓存的生命周期
 */
export const CACHE_TTL = {
  /** 短缓存：1 分钟 */
  SHORT: 60,
  /** 中缓存：5 分钟 */
  MEDIUM: 300,
  /** 长缓存：1 小时 */
  LONG: 3600,
} as const;
