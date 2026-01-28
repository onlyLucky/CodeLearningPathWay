<template>
  <div class="segmented-progress">
    <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
      <!-- 进度条段 -->
      <!-- :rx="bar.width / 2" -->
      <rect
        v-for="bar in bars"
        :key="bar.id"
        :x="bar.x"
        :y="bar.y"
        :width="bar.width"
        :height="bar.height"
        :fill="bar.color"
        :transform="bar.transform"
        class="progress-bar"
      />
    </svg>
    
    <!-- 中间内容插槽 -->
    <div v-if="$slots.default" class="center-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue';

const props = defineProps({
  // 进度值 0-100
  progress: {
    type: Number,
    default: 50,
    validator: (val) => val >= 0 && val <= 100
  },
  // 总段数
  segments: {
    type: Number,
    default: 30
  },
  // 圆环半径（相对于200x200 viewBox的坐标系）
  radius: {
    type: Number,
    default: 85
  },
  // 每段宽度
  strokeWidth: {
    type: Number,
    default: 10
  },
  // 每段长度
  strokeLength: {
    type: Number,
    default: 30
  },
  // 激活颜色
  activeColor: {
    type: String,
    default: '#22d3ee'
  },
  // 未激活颜色
  inactiveColor: {
    type: String,
    default: '#1e293b'
  },
  // 动画时长（秒）
  duration: {
    type: Number,
    default: 0.3
  }
});

const center = 100; // viewBox中心点 (200/2)

const activeSegments = computed(() => {
  return Math.round((props.progress / 100) * props.segments);
});

// 生成每一段的数据
const bars = computed(() => {
  const anglePerSegment = 360 / props.segments;
  const bars = [];
  
  for (let i = 0; i < props.segments; i++) {
    const angle = i * anglePerSegment - 90; // -90度从12点方向开始
    const isActive = i < activeSegments.value;
    
    // 增加微小间隙
    const actualLength = props.strokeLength * 0.85;
    
    bars.push({
      id: i,
      color: isActive ? props.activeColor : props.inactiveColor,
      x: center - props.strokeWidth / 2,
      y: center - props.radius,
      width: props.strokeWidth,
      height: actualLength,
      transform: `rotate(${angle}, ${center}, ${center})`
    });
  }
  return bars;
});
</script>

<style scoped lang="scss">
.segmented-progress {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.segmented-progress svg {
  width: 100%;
  height: 100%;
  overflow: visible;
  transform: rotate(90deg);
}

.progress-bar {
  transition: fill 2s ease;
  border-radius: 0;
}

.center-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

/* 确保插槽内容可见 */
.center-content :deep(*) {
  pointer-events: auto;
}
</style>