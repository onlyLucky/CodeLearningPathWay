# 数据可视化大屏项目

基于 Vue3 + TypeScript + Pinia + ECharts 的自适应数据大屏项目。

## 技术栈

- **Vue 3** - 采用 Composition API 开发
- **TypeScript** - 类型安全
- **Pinia** - 状态管理
- **Vue Router** - 路由管理
- **ECharts** - 数据可视化
- **Vite** - 构建工具
- **pnpm** - 包管理器

## 项目结构

```
DataDashboard/
├── src/
│   ├── api/              # API 请求模块
│   │   └── dashboard.ts  # 数据大屏相关 API
│   ├── assets/           # 静态资源
│   │   ├── data/        # 静态数据文件
│   │   │   ├── mock/    # 模拟数据
│   │   │   └── config/  # 配置数据
│   │   ├── fonts/       # 字体文件
│   │   │   └── custom/  # 自定义字体
│   │   ├── icons/       # SVG 图标
│   │   │   └── components/ # 组件图标
│   │   ├── images/      # 图片资源
│   │   │   ├── common/  # 通用图片
│   │   │   ├── icons/   # 图标图片
│   │   │   └── backgrounds/ # 背景图片
│   │   ├── 3d/         # 3D 模型文件
│   │   │   ├── models/   # 模型文件
│   │   │   └── textures/ # 纹理贴图
│   │   └── styles/     # 静态样式文件
│   │       └── themes/   # 主题样式
│   ├── components/       # 公共组件
│   │   ├── DataCard/    # 数据卡片组件
│   │   ├── EChart/      # ECharts 图表组件
│   │   └── StatCard/    # 统计卡片组件
│   ├── config/          # 环境配置
│   │   └── index.ts     # 配置文件
│   ├── router/          # 路由配置
│   │   └── index.ts
│   ├── stores/          # Pinia 状态管理
│   │   ├── app.ts       # 应用全局状态
│   │   └── dashboard.ts # 数据大屏状态
│   ├── styles/          # 样式文件
│   │   ├── index.scss   # 全局样式
│   │   ├── rem.scss     # rem 自适应样式
│   │   └── variables.scss # SCSS 变量
│   ├── types/           # TypeScript 类型定义
│   │   └── index.ts
│   ├── utils/           # 工具函数
│   │   ├── index.ts     # 通用工具函数
│   │   ├── rem.ts       # rem 自适应工具
│   │   └── request.ts   # Axios 封装
│   ├── views/           # 页面组件
│   │   └── Dashboard/   # 数据大屏页面
│   ├── App.vue          # 根组件
│   ├── main.ts          # 入口文件
│   └── env.d.ts         # 环境变量类型定义
├── .env.development     # 开发环境变量
├── .env.test            # 测试环境变量
├── .env.production      # 生产环境变量
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## 核心功能

### 1. 自适应布局
- 基于 rem 的自适应方案
- 支持多种屏幕尺寸（1920px、1600px、1440px、1366px、1280px、1024px）
- 动态计算根元素字体大小

### 2. 状态管理
- **App Store**: 应用全局状态（侧边栏、主题、刷新间隔）
- **Dashboard Store**: 数据大屏状态（统计数据、加载状态、错误信息）

### 3. THREE.js 3D 地图

参考资料
- [THREE.js 3D 地图实现](https://juejin.cn/post/7247027696822304827?searchId=2026012217085492DD1AF8287F06213E58)
- [THREE.js 3D 地图实现（2）](https://juejin.cn/post/7256047142540017720#heading-7)
- [THREE.js 3D 地图实现（3）](https://chemistwang.github.io/post/threejs/3dmap/)
- [THREE.js 3D 地图实现（4）](https://juejin.cn/post/7369478484370374666)
- [阿里云数据可视化地理信息数据](https://datav.aliyun.com/portal/school/atlas/area_selector)

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
# 开发环境
pnpm run dev

# 测试环境
pnpm run dev:test
```

访问 http://localhost:3000

### 构建生产版本

```bash
# 生产环境构建
pnpm run build

# 测试环境构建
pnpm run build:test
```

### 类型检查

```bash
pnpm run typecheck
```

## 多环境配置

项目支持多环境配置，通过 `.env` 文件管理不同环境的配置：

### 环境文件

- `.env.development` - 开发环境配置
- `.env.test` - 测试环境配置
- `.env.production` - 生产环境配置

### 环境变量

- `VITE_APP_TITLE` - 应用标题
- `VITE_API_BASE_URL` - API 基础地址
- `VITE_APP_PORT` - 应用端口
- `VITE_APP_ENV` - 环境标识

### 使用方式

在代码中通过 `import.meta.env` 访问环境变量：

```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL
const appTitle = import.meta.env.VITE_APP_TITLE
```

或使用配置文件：

```typescript
import config from '@/config'
import { isDevelopment, isProduction } from '@/config'

console.log(config.title)
console.log(isDevelopment)
```

## 自适应方案说明

项目采用基于 rem 的自适应布局方案：

1. **设计稿基准**: 1920px
2. **根元素字体**: 100px（对应 1920px）
3. **换算公式**: `rem = px / 1920 * 10`

### 支持的屏幕尺寸

在不同屏幕尺寸下，根元素字体大小会自动调整：

| 分辨率 | 屏幕类型 | 根元素字体大小 |
|--------|----------|----------------|
| ≥ 3840px | 4K | 200px |
| 2560px - 3839px | 2K | 133.33px |
| 1920px - 2559px | FHD | 100px |
| 1600px - 1919px | - | 83.33px |
| 1440px - 1599px | - | 75px |
| 1366px - 1439px | - | 71.15px |
| 1280px - 1365px | - | 66.67px |
| 1024px - 1279px | - | 53.33px |
| < 1024px | 移动端/平板 | 50px |

### Rem 工具函数

项目提供了便捷的 rem 工具函数：

```typescript
import { setRem, initRem, getCurrentRem, pxToRem, remToPx } from '@/utils/rem'

// 初始化 rem 适配
initRem()

// 手动设置 rem
setRem()

// 获取当前 rem 值
const currentRem = getCurrentRem()

// px 转 rem
const remValue = pxToRem(192) // 1920px 设计稿下的 192px

// rem 转 px
const pxValue = remToPx(1.92)
```

## API 接口

项目已封装 Axios 请求库，接口定义在 `src/api/dashboard.ts`：


## 工具函数

常用工具函数定义在 `src/utils/index.ts`：

- `formatNumber()` - 数字格式化
- `formatPercent()` - 百分比格式化
- `formatDate()` - 日期格式化
- `debounce()` - 防抖函数
- `throttle()` - 节流函数

## 开发规范

### 组件开发
- 使用 Composition API
- 使用 `<script setup>` 语法
- 使用 TypeScript 类型注解
- Props 使用 `defineProps` 和 `withDefaults`

### 样式规范
- 使用 SCSS 预处理器
- 使用 rem 单位
- 遵循 BEM 命名规范

### 类型定义
- 所有数据结构定义在 `src/types/index.ts`
- 使用 TypeScript 接口定义数据类型
- 导出类型供其他模块使用

## 扩展开发

### 添加新页面

1. 在 `src/views` 下创建新页面组件
2. 在 `src/router/index.ts` 添加路由配置
3. 根据需要创建对应的 Store

### 添加新图表

1. 使用 `EChart` 组件
2. 配置 ECharts option
3. 在页面中引入并使用

### 添加新 API

1. 在 `src/api` 下创建或修改 API 文件
2. 使用封装的 `request` 实例
3. 定义返回数据类型

## 注意事项

1. 使用 pnpm 作为包管理器
2. 所有样式使用 rem 单位确保自适应
3. 组件 Props 必须定义类型
4. API 请求需要定义返回类型
5. 状态管理使用 Pinia Composition API 风格

## License
