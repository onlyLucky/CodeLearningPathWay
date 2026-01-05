<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
    <div class="card text-center max-w-md">
      <div class="text-6xl mb-4">😕</div>
      <h1 class="text-4xl font-bold mb-4 text-gray-900 dark:text-white">404</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-6">页面未找到</p>
      <button class="btn-primary" @click="goHome">
        返回首页
      </button>
    </div>
  </div>
</template>
