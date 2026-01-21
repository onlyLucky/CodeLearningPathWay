<template>
  <view :class="['card', hoverable ? 'card-hoverable' : '']">
    <slot />
  </view>
</template>

<script setup lang="ts">
interface Props {
  hoverable?: boolean
}

withDefaults(defineProps<Props>(), {
  hoverable: false,
})
</script>

<style scoped>
.card {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 16px;
  transition: box-shadow 0.2s;
}

.card-hoverable:hover {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}
</style>
