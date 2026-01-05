# Vue3 + TypeScript 全栈项目

这是一个基于 Vue3 + TypeScript 的现代化前端项目，集成了多种主流技术栈。

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - JavaScript 的超集，提供类型安全
- **Vite** - 下一代前端构建工具
- **Pinia** - Vue 3 官方推荐的状态管理库
- **Vue Router** - Vue.js 官方路由管理器
- **Element Plus** - 基于 Vue 3 的组件库
- **VueUse** - Vue Composition API 工具集
- **Axios** - HTTP 客户端
- **Tailwind CSS** - 实用优先的 CSS 框架

## 项目结构

```
src/
├── api/                 # API 接口
│   ├── modules/        # API 模块
│   │   ├── user.ts     # 用户相关 API
│   │   └── todo.ts     # 待办事项 API
│   ├── types/          # TypeScript 类型定义
│   └── index.ts        # API 统一导出
├── assets/             # 静态资源
│   └── tailwind.css    # Tailwind CSS 配置
├── components/         # 组件
│   ├── ElementPlusDemo.vue
│   ├── AxiosDemo.vue
│   └── NavBar.vue
├── router/             # 路由配置
│   └── index.ts
├── stores/             # Pinia 状态管理
│   ├── user.ts         # 用户状态
│   ├── todo.ts         # 待办事项状态
│   ├── app.ts          # 应用状态
│   └── index.ts
├── utils/              # 工具函数
│   └── request/        # Axios 封装
│       ├── index.ts
│       └── types.ts
├── views/              # 页面视图
│   ├── Home.vue
│   ├── Todos.vue
│   ├── Demo.vue
│   ├── User.vue
│   └── NotFound.vue
├── App.vue             # 根组件
└── main.ts             # 入口文件
```

## 功能特性

### 1. 状态管理 (Pinia)
- 用户状态管理
- 待办事项状态管理
- 应用设置管理
- 持久化存储

### 2. 路由管理 (Vue Router)
- 动态路由加载
- 路由守卫
- 权限控制
- 404 页面处理

### 3. UI 组件 (Element Plus)
- 按需引入
- 丰富的表单组件
- 对话框和通知
- 主题定制

### 4. 组合式 API (VueUse)
- useMouse - 鼠标位置追踪
- useWindowSize - 窗口尺寸监听
- useStorage - 本地存储同步
- useToggle - 布尔值切换

### 5. HTTP 请求 (Axios)
- 请求/响应拦截器
- 自动添加 Token
- 统一错误处理
- TypeScript 类型支持

### 6. 样式方案 (Tailwind CSS)
- 实用类优先
- 响应式设计
- 自定义主题
- 组件样式封装

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 环境变量

项目支持不同环境的配置：

- `.env` - 默认环境变量
- `.env.development` - 开发环境
- `.env.production` - 生产环境

示例：

```env
VITE_API_BASE_URL=/api
```

## 使用示例

### Pinia Store 使用

```typescript
import { useUserStore } from '@/stores'

const userStore = useUserStore()
userStore.setUser({ id: 1, name: 'John', email: 'john@example.com' })
```

### Vue Router 使用

```typescript
import { useRouter } from 'vue-router'

const router = useRouter()
router.push('/todos')
```

### VueUse 使用

```typescript
import { useMouse, useStorage } from '@vueuse/core'

const { x, y } = useMouse()
const count = useStorage('count', 0)
```

### Axios 请求使用

```typescript
import { userApi } from '@/api'

const userInfo = await userApi.getUserInfo()
```

### Element Plus 组件使用

```vue
<template>
  <el-button type="primary">按钮</el-button>
  <el-input v-model="input" />
</template>
```

## 配置说明

### Tailwind CSS 配置

在 `tailwind.config.js` 中自定义主题：

```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: { /* 自定义颜色 */ }
      }
    }
  }
}
```

### Axios 配置

在 `src/utils/request/index.ts` 中配置：

```typescript
const request = new Request({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
})
```

### Element Plus 配置

在 `vite.config.ts` 中配置按需引入：

```typescript
AutoImport({
  resolvers: [ElementPlusResolver()],
})
Components({
  resolvers: [ElementPlusResolver()],
})
```

## 开发建议

1. **组件开发**：使用 Vue 3 Composition API 和 `<script setup>` 语法
2. **类型安全**：充分利用 TypeScript 的类型系统
3. **状态管理**：合理使用 Pinia 管理应用状态
4. **样式开发**：优先使用 Tailwind CSS 的实用类
5. **代码规范**：遵循项目既定的代码风格

## 浏览器支持

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## License

MIT

