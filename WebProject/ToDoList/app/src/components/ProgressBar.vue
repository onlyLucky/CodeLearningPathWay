<template>
  <view class="progress-bar-container">
    <view class="progress-bar-track">
      <view class="progress-bar-fill" :style="{ width: `${percentage}%` }" />
    </view>
    <text class="progress-bar-label"> {{ percentage }}% </text>
  </view>
</template>

<script setup lang="ts">
interface Props {
  percentage: number
}

defineProps<Props>()
</script>

<style scoped>
.progress-bar-container {
  position: relative;
}

.progress-bar-track {
  width: 100%;
  height: 8px;
  border-radius: 9999px;
  background: #e5e7eb;
  transition: background-color 0.2s;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 9999px;
  background: #667eea;
  transition: all 0.3s;
}

.progress-bar-label {
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
  display: block;
}
</style>
