<template>
  <view
    :class="['button', disabled ? 'button-disabled' : 'button-enabled', `button-${variant}`]"
    @click="handleClick"
  >
    <slot />
  </view>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline'
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  disabled: false,
})

const emit = defineEmits<{
  click: []
}>()

function handleClick() {
  emit('click')
}
</script>

<style scoped>
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.button-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button-enabled {
  cursor: pointer;
}

.button-primary {
  background: #667eea;
  color: #ffffff;
}

.button-primary:hover {
  background: #5568d3;
}

.button-secondary {
  background: #e5e7eb;
  color: #1f2937;
}

.button-secondary:hover {
  background: #d1d5db;
}

.button-danger {
  background: #ef4444;
  color: #ffffff;
}

.button-danger:hover {
  background: #dc2626;
}

.button-outline {
  background: #ffffff;
  color: #374151;
  border: 1px solid #d1d5db;
}

.button-outline:hover {
  background: #f9fafb;
}
</style>
