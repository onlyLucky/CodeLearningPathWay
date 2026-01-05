<script setup lang="ts">
import { useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const { user, isLoggedIn } = storeToRefs(userStore)
const router = useRouter()

const logout = () => {
  userStore.logout()
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-2xl">
      <div v-if="isLoggedIn && user" class="card">
        <h1 class="text-3xl font-bold mb-6 text-gray-900">用户中心</h1>
        
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <span class="text-2xl text-primary-600">{{ user.name.charAt(0) }}</span>
            </div>
            <div>
              <div class="text-xl font-semibold">{{ user.name }}</div>
              <div class="text-gray-600">{{ user.email }}</div>
            </div>
          </div>

          <div class="border-t pt-4">
            <div class="text-sm text-gray-500 mb-2">用户 ID</div>
            <div class="font-mono">{{ user.id }}</div>
          </div>

          <button class="btn-primary w-full mt-6" @click="logout">
            退出登录
          </button>
        </div>
      </div>

      <div v-else class="card text-center">
        <h1 class="text-3xl font-bold mb-6 text-gray-900">未登录</h1>
        <p class="text-gray-600 mb-6">请先登录以访问用户中心</p>
        <button class="btn-primary" @click="router.push('/')">
          返回首页
        </button>
      </div>
    </div>
  </div>
</template>
