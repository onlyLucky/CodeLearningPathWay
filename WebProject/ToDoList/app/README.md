# 语音录制移动端

### 技术选型

- Vue 3: 前端框架
- TypeScript: 静态类型检查
- Pinia: 状态管理
- uni-app: 跨平台开发框架
- husky: Git hooks 管理
- pnpm: 包管理工具
- node: 运行环境 >= 18.

### 项目结构

```text
asr-mobile/
├── src/
│   ├── components/          # 组件库
│   │   └── index.ts         # 组件导出
│   ├── pages/               # 页面
│   ├── stores/              # Pinia 状态管理
│   │   └── index.ts         # 状态导出
│   ├── styles/              # 样式文件
│   │   ├── index.scss       # 全局样式
│   │   └── variables.scss   # SCSS 变量
│   ├── types/               # TypeScript 类型定义
│   ├── App.vue              # 根组件
│   ├── main.ts              # 入口文件
│   ├── manifest.json        # 应用配置
│   └── pages.json           # 页面路由配置
├── static/                  # 静态资源
├── .husky/                  # Git hooks
│   ├── pre-commit           # 提交前检查
│   └── pre-push             # 推送前检查
├── .env.development         # 开发环境变量
├── .env.production          # 生产环境变量
├── .eslintrc.js             # ESLint 配置
├── .prettierrc              # Prettier 配置
├── .gitignore               # Git 忽略文件
├── tsconfig.json            # TypeScript 配置
├── vite.config.ts           # Vite 配置
└── package.json             # 项目依赖
```

### Git 提交规范

- feat 新功能（feature）
- fix 修复 bug
- docs 仅文档变更
- style 不影响代码逻辑的格式修改（空格、格式化、分号）
- refactor 代码重构，既不是新增也不是修复 bug
- perf 性能优化
- test 增加或修改测试
- build 构建系统或外部依赖变动（webpack、vite、npm）
- ci CI 配置文件变动（husky、github actions）
- chore 其他杂项（改 .gitignore、升级包管理器锁文件）
- revert 回滚到上一个版本
