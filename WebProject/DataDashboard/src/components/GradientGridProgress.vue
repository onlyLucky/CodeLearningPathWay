<template>
  <div class="gradient-grid-progress" :class="{ 'is-vertical': direction === 'vertical' }">
    <div class="grid-track" :style="trackStyle">
      <div
        v-for="i in segments"
        :key="i"
        class="grid-cell"
        :class="{ 'is-active': i <= activeCount }"
        :style="getCellStyle(i)"
      />
    </div>
    
    <!-- 内容插槽 -->
    <div v-if="$slots.default" class="content-layer">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  // 当前进度 0-100
  progress: {
    type: Number,
    default: 65
  },
  // 栅格数量
  segments: {
    type: Number,
    default: 32
  },
  // 方向：horizontal | vertical
  direction: {
    type: String,
    default: 'horizontal'
  },
  // 渐变起始颜色（高进度端）
  startColor: {
    type: String,
    default: '#22d3ee' // 青色
  },
  // 渐变结束颜色（低进度端）
  endColor: {
    type: String,
    default: '#3b82f6' // 蓝色
  },
  // 背景色（未激活）
  bgColor: {
    type: String,
    default: '#1e293b' // 深蓝灰
  },
  // 栅格间隙（px）
  gap: {
    type: Number,
    default: 4
  },
  // 圆角（px）
  radius: {
    type: Number,
    default: 0
  },
  // 是否启用发光效果
  glow: {
    type: Boolean,
    default: true
  },
  // 动画时长（秒）
  duration: {
    type: Number,
    default: 0.3
  }
});

// 计算激活的格子数（向上取整确保进度可见）
const activeCount = computed(() => {
  return Math.ceil((props.progress / 100) * props.segments);
});

// 轨道样式
const trackStyle = computed(() => ({
  flexDirection: props.direction === 'vertical' ? 'column' : 'row',
  gap: `${props.gap}px`
}));

// 十六进制颜色插值
const interpolateColor = (color1, color2, factor) => {
  const hex = (c) => parseInt(c.slice(1), 16);
  const r1 = (hex(color1) >> 16) & 255, g1 = (hex(color1) >> 8) & 255, b1 = hex(color1) & 255;
  const r2 = (hex(color2) >> 16) & 255, g2 = (hex(color2) >> 8) & 255, b2 = hex(color2) & 255;
  
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);
  
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
};

// 单个格子样式
const getCellStyle = (index) => {
  const isActive = index <= activeCount.value;
  const ratio = (index - 1) / Math.max(props.segments - 1, 1);
  const color = interpolateColor(props.startColor, props.endColor, ratio);
  
  return {
    backgroundColor: isActive ? color : props.bgColor,
    borderRadius: `${props.radius}px`,
    transition: `all ${props.duration}s ease`,
    boxShadow: isActive && props.glow ? `0 0 8px ${color}66` : 'none',
    opacity: isActive ? 1 : 0.4
  };
};
</script>

<style scoped>
.gradient-grid-progress {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.grid-track {
  display: flex;
  width: 100%;
  height: 100%;
}

.grid-cell {
  flex: 1;
  position: relative;
}

/* 垂直方向适配 */
.is-vertical .grid-track {
  flex-direction: column;
}

.is-vertical .grid-cell {
  width: 100%;
}

/* 内容层居中 */
.content-layer {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.content-layer :deep(*) {
  pointer-events: auto;
}
</style>