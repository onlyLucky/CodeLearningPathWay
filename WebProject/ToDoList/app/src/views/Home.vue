<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToTodos = () => {
  router.push('/todos')
}

const goToDemo = () => {
  router.push('/demo')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
    <div class="container mx-auto px-4 py-16">
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold text-gray-900 mb-4">
          欢迎使用 Vue3 + TypeScript
        </h1>
        <p class="text-xl text-gray-600">
          集成了 Pinia、Vue Router、Element Plus、VueUse、Axios 和 Tailwind CSS
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div class="card hover:shadow-lg transition-shadow">
          <h2 class="text-2xl font-semibold mb-4 text-primary-600">待办事项</h2>
          <p class="text-gray-600 mb-6">
            使用 Pinia 状态管理实现的待办事项功能，支持添加、删除、完成状态切换
          </p>
          <button class="btn-primary w-full" @click="goToTodos">
            开始使用
          </button>
        </div>

        <div class="card hover:shadow-lg transition-shadow">
          <h2 class="text-2xl font-semibold mb-4 text-secondary-600">功能演示</h2>
          <p class="text-gray-600 mb-6">
            展示 VueUse、Element Plus、Axios 等各种功能的使用示例
          </p>
          <button class="btn-secondary w-full" @click="goToDemo">
            查看演示
          </button>
        </div>
      </div>

      <div class="mt-16 text-center">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          <div class="p-4">
            <div class="text-3xl font-bold text-primary-600">Pinia</div>
            <div class="text-sm text-gray-500">状态管理</div>
          </div>
          <div class="p-4">
            <div class="text-3xl font-bold text-secondary-600">Router</div>
            <div class="text-sm text-gray-500">路由管理</div>
          </div>
          <div class="p-4">
            <div class="text-3xl font-bold text-primary-600">VueUse</div>
            <div class="text-sm text-gray-500">组合式工具</div>
          </div>
          <div class="p-4">
            <div class="text-3xl font-bold text-secondary-600">Axios</div>
            <div class="text-sm text-gray-500">HTTP 请求</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
