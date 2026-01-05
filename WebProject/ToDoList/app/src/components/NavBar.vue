<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAppStore, useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()
const { settings } = storeToRefs(appStore)

const menuItems = [
  { name: 'Home', path: '/', label: '首页' },
  { name: 'Todos', path: '/todos', label: '待办事项' },
  { name: 'Demo', path: '/demo', label: '功能演示' },
  { name: 'User', path: '/user', label: '用户中心' },
]

const navigateTo = (path: string) => {
  router.push(path)
}

const toggleTheme = () => {
  appStore.toggleTheme()
}
</script>

<template>
  <nav class="bg-white dark:bg-gray-800 shadow-md transition-colors duration-300">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center space-x-8">
          <div class="text-xl font-bold text-primary-600 dark:text-primary-400 cursor-pointer" @click="navigateTo('/')">
            TodoList
          </div>
          <div class="hidden md:flex space-x-4">
            <button
              v-for="item in menuItems"
              :key="item.path"
              @click="navigateTo(item.path)"
              class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="[
                route.path === item.path
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              ]"
            >
              {{ item.label }}
            </button>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <button
            @click="toggleTheme"
            class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="切换主题"
          >
            <span v-if="settings.theme === 'light'">🌙</span>
            <span v-else>☀️</span>
          </button>

          <div v-if="userStore.isLoggedIn" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <span class="text-primary-600 dark:text-primary-400 font-medium">
                {{ userStore.user?.name?.charAt(0) || 'U' }}
              </span>
            </div>
            <span class="text-sm text-gray-700 dark:text-gray-300 hidden md:block">
              {{ userStore.userName }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
