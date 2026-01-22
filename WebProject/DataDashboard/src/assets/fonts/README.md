# 字体文件说明

本目录用于存放自定义字体文件。

## 支持的字体格式

- **WOFF2** - 现代浏览器，体积最小（推荐）
- **WOFF** - 兼容性较好
- **TTF** - 传统格式
- **EOT** - IE 浏览器（已过时）

## 字体引入方式

在 `src/styles/variables.scss` 中引入：

```scss
@font-face {
  font-family: 'CustomFont';
  src: url('@/assets/fonts/custom/CustomFont.woff2') format('woff2'),
       url('@/assets/fonts/custom/CustomFont.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

## 使用示例

```scss
.custom-text {
  font-family: 'CustomFont', sans-serif;
}
```

## 注意事项

1. 使用 `font-display: swap` 提升加载性能
2. 提供多种格式以确保兼容性
3. 考虑使用字体子集化减小文件大小
4. 注意字体文件的版权问题
