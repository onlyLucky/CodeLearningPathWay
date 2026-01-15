# ThreeJS 官网文档学习笔记

## 一、快速开始

- 最开始的时候优先按照Demo代码实现，后续再加上自己的想法

### Start

**【目标】** 聚焦于最核心的几个组件的创建、组装和显示，让用户能快速看到效果，建立初步认知。帮助开发者从零开始，在浏览器中构建并运行起第一个 3D 场景。

- 三大核心组件：创建一个基本的 3D 场景，主要需要三个东西：场景（Scene）、相机（Camera） 和 渲染器（Renderer）。
- 场景（Scene）：这是 3D 世界的容器或舞台。你创建的所有物体（如立方体、球体）、光源等都需要添加到场景中，才能被渲染出来。
- 相机（Camera）：相当于观众的“眼睛”或一台“摄像机”。它定义了我们从哪个角度、以什么视野来观看这个 3D 舞台。最常见的是透视相机（PerspectiveCamera），它能模拟人眼看到的近大远小的效果。
- 渲染器（Renderer）：相当于“绘图引擎”。它的工作是获取场景和相机的信息，将 3D 画面计算并绘制到网页的一个 HTML canvas 元素上。
- 基本几何体与材质：为了在场景中看到东西，需要创建物体。一个物体通常由几何体（Geometry，决定形状） 和材质（Material，决定外观，如颜色） 组合而成。基础部分通常会用一个简单- 的立方体（BoxGeometry）和基础网格材质（MeshBasicMaterial）来演示。
- 动画循环：为了让画面动起来（如旋转立方体），需要使用 requestAnimationFrame 函数创建一个循环，在这个循环里不断更新物体状态并重新渲染画面。

**【代码示例】**
- [fastStart](./01/fastStart.html)
- [静态初始化使用场景](./01/fundamentals.html)
- [动画初始化使用](./01/fundamentals-with-animation.html)
- [光照初始化使用](./01/fundamentals-with-light.html)
- [多个立方体](./01/fundamentals-3-cubes.html)


### 响应式设计

1. 核心问题：当浏览器窗口大小改变时，3D画布（Canvas）会被拉伸或留白，导致画面变形或显示不全。
2. 解决方案：监听窗口的 resize 事件。
3. 关键步骤：
  - 更新渲染器尺寸：renderer.setSize(newWidth, newHeight)
  - 更新相机参数：对于PerspectiveCamera，需要更新其 aspect（纵横比）并调用 camera.updateProjectionMatrix()。
  - 可选：处理像素比（window.devicePixelRatio）以适应高清屏。

**【代码示例】**

## 二、基础

## 三、原理

## 四、使用技巧

## 五、优化方案

## 六、使用解决方案

## 七、WebXR

## 其他
### VS code 文件差异对比
  1、按下 Cmd + Shift + P（Windows/Linux为 Ctrl + Shift + P）打开命令面板。
  2、输入 "File: Compare Active File With..." 并回车。
  3、在弹出的文件选择列表中，点击目标对比文件。

## 参考资料