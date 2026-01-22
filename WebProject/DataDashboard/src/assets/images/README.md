# 图片资源说明

本目录用于存放项目中的图片资源。

## 子目录说明

### common/
通用图片，如 Logo、默认头像等。

### icons/
图标图片，如 PNG、JPG 格式的图标。

### backgrounds/
背景图片，如页面背景、卡片背景等。

## 图片格式建议

- **WebP** - 推荐使用，体积小、质量高
- **PNG** - 透明背景图片
- **JPG** - 不透明背景照片
- **SVG** - 矢量图标（推荐放在 icons 目录）

## 命名规范

- 使用小写字母和连字符
- 描述性命名，如 `logo-primary.png`
- 包含尺寸信息，如 `banner-1920x1080.jpg`

## 使用示例

```vue
<template>
  <img :src="logo" alt="Logo" />
</template>

<script setup lang="ts">
import logo from '@/assets/images/common/logo.png'
</script>
```

## 注意事项

1. 大图片建议进行压缩优化
2. 使用响应式图片技术（srcset）
3. 考虑使用懒加载（lazy loading）
4. 为图片添加适当的 alt 属性
