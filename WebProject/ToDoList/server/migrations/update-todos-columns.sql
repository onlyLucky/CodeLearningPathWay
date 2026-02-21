-- 更新 todos 表的 priority 字段类型
-- 将字符串类型 'low', 'medium', 'high' 改为数字类型 '0', '1', '2'

-- 1. 先添加新的临时列
ALTER TABLE todos ADD COLUMN priority_new ENUM('0', '1', '2') DEFAULT '1';

-- 2. 将旧数据映射到新列
UPDATE todos SET priority_new = CASE
  WHEN priority = 'low' THEN '0'
  WHEN priority = 'medium' THEN '1'
  WHEN priority = 'high' THEN '2'
  ELSE '1'
END;

-- 3. 删除旧列
ALTER TABLE todos DROP COLUMN priority;

-- 4. 重命名新列
ALTER TABLE todos CHANGE COLUMN priority_new priority ENUM('0', '1', '2') DEFAULT '1';

-- 更新 todos 表的 status 字段类型
-- 将字符串类型 'pending', 'in_progress', 'completed' 改为数字类型 '0', '1', '2'

-- 1. 先添加新的临时列
ALTER TABLE todos ADD COLUMN status_new ENUM('0', '1', '2') DEFAULT '0';

-- 2. 将旧数据映射到新列
UPDATE todos SET status_new = CASE
  WHEN status = 'pending' THEN '0'
  WHEN status = 'in_progress' THEN '1'
  WHEN status = 'completed' THEN '2'
  ELSE '0'
END;

-- 3. 删除旧列
ALTER TABLE todos DROP COLUMN status;

-- 4. 重命名新列
ALTER TABLE todos CHANGE COLUMN status_new status ENUM('0', '1', '2') DEFAULT '0';
