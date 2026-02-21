# 数据库迁移说明

## 问题描述

由于实体定义更新，todos 表的 `priority` 和 `status` 字段需要从字符串类型改为数字类型：

- `priority`: 'low'/'medium'/'high' → '0'/'1'/'2'
- `status`: 'pending'/'in_progress'/'completed' → '0'/'1'/'2'

## 迁移步骤

### 1. 备份数据库

```bash
# 备份数据库
mysqldump -u root -p todolist > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 2. 连接到数据库

```bash
mysql -u root -p
```

### 3. 选择数据库

```sql
USE todolist;
```

### 4. 执行迁移脚本

```bash
# 在 MySQL 命令行中执行
mysql -u root -p todolist < migrations/update-todos-columns.sql
```

或者在 MySQL 客户端中逐条执行：

```sql
-- 更新 priority 字段
ALTER TABLE todos ADD COLUMN priority_new ENUM('0', '1', '2') DEFAULT '1';
UPDATE todos SET priority_new = CASE
  WHEN priority = 'low' THEN '0'
  WHEN priority = 'medium' THEN '1'
  WHEN priority = 'high' THEN '2'
  ELSE '1'
END;
ALTER TABLE todos DROP COLUMN priority;
ALTER TABLE todos CHANGE COLUMN priority_new priority ENUM('0', '1', '2') DEFAULT '1';

-- 更新 status 字段
ALTER TABLE todos ADD COLUMN status_new ENUM('0', '1', '2') DEFAULT '0';
UPDATE todos SET status_new = CASE
  WHEN status = 'pending' THEN '0'
  WHEN status = 'in_progress' THEN '1'
  WHEN status = 'completed' THEN '2'
  ELSE '0'
END;
ALTER TABLE todos DROP COLUMN status;
ALTER TABLE todos CHANGE COLUMN status_new status ENUM('0', '1', '2') DEFAULT '0';
```

### 5. 验证迁移结果

```sql
-- 检查 priority 字段
SELECT priority, COUNT(*) as count FROM todos GROUP BY priority;

-- 检查 status 字段
SELECT status, COUNT(*) as count FROM todos GROUP BY status;

-- 查看表结构
DESCRIBE todos;
```

### 6. 重启应用

```bash
# 重启 NestJS 应用
pnpm start:dev
```

## 字段映射说明

### Priority 字段

| 旧值 | 新值 | 含义 |
|--------|--------|------|
| 'low' | '0' | 低优先级 |
| 'medium' | '1' | 中优先级 |
| 'high' | '2' | 高优先级 |

### Status 字段

| 旧值 | 新值 | 含义 |
|--------|--------|------|
| 'pending' | '0' | 待处理 |
| 'in_progress' | '1' | 进行中 |
| 'completed' | '2' | 已完成 |

## 回滚方案

如果迁移出现问题，可以使用备份恢复：

```bash
# 恢复数据库
mysql -u root -p todolist < backup_YYYYMMDD_HHMMSS.sql
```

## 注意事项

1. **备份数据库**：在执行迁移前务必备份数据库
2. **测试环境先执行**：建议先在测试环境中执行迁移，确认无误后再在生产环境执行
3. **停机时间**：迁移期间可能需要短暂停机
4. **数据验证**：迁移完成后务必验证数据完整性

## 常见问题

### Q: 如果数据库中没有旧数据怎么办？

A: 迁移脚本中的 `ELSE` 子句会处理这种情况，设置默认值：
- priority 默认为 '1' (medium)
- status 默认为 '0' (pending)

### Q: 如果迁移失败怎么办？

A: 使用备份文件恢复数据库，然后检查错误原因。

### Q: 迁移后应用报错怎么办？

A: 检查实体定义是否与数据库结构一致，确保字段类型匹配。
