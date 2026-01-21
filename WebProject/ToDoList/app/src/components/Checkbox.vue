<template>
  <view class="checkbox-container">
    <view
      :class="['checkbox', checked ? 'checkbox-checked' : 'checkbox-unchecked']"
      @click="toggle"
    >
      <text v-if="checked" class="checkbox-icon">✓</text>
    </view>
    <text class="checkbox-label">
      <slot />
    </text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const checked = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

function toggle() {
  checked.value = !checked.value
}
</script>

<style scoped>
.checkbox-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkbox {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 2px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  cursor: pointer;
}

.checkbox-unchecked {
  border-color: #d1d5db;
  background: #ffffff;
}

.checkbox-checked {
  background: #667eea;
  border-color: #667eea;
}

.checkbox-icon {
  color: #ffffff;
  font-size: 12px;
}

.checkbox-label {
  color: #374151;
}
</style>
