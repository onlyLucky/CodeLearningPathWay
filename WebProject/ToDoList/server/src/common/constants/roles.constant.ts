/**
 * 用户角色枚举
 */
export enum UserRole {
  /** 管理员角色，拥有最高权限 */
  ADMIN = 'admin',
  /** 普通用户角色，具备基本权限 */
  USER = 'user',
  /** 访客角色，仅具备只读权限 */
  GUEST = 'guest',
}
