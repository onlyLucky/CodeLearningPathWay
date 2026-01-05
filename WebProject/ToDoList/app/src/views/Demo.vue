<script setup lang="ts">
import { ref } from 'vue'
import { useMouse, useWindowSize, useStorage, useToggle } from '@vueuse/core'
import { useAppStore } from '@/stores'

const appStore = useAppStore()
const { x, y } = useMouse()
const { width, height } = useWindowSize()

const count = useStorage('demo-count', 0)
const [darkMode, toggleDarkMode] = useToggle(false)

const increment = () => {
  count.value++
}

const decrement = () => {
  count.value--
}

const reset = () => {
  count.value = 0
}

const message = ref('')
const showMessage = (msg: string) => {
  message.value = msg
  appStore.showNotification(msg, 'success')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-4xl">
      <h1 class="text-3xl font-bold mb-8 text-center text-gray-900">功能演示</h1>

      <div class="grid md:grid-cols-2 gap-6">
        <div class="card">
          <h2 class="text-xl font-semibold mb-4 text-primary-600">VueUse - useMouse</h2>
          <div class="space-y-2">
            <div class="text-gray-600">鼠标位置:</div>
            <div class="font-mono text-lg">
              X: {{ Math.round(x) }}, Y: {{ Math.round(y) }}
            </div>
          </div>
        </div>

        <div class="card">
          <h2 class="text-xl font-semibold mb-4 text-secondary-600">VueUse - useWindowSize</h2>
          <div class="space-y-2">
            <div class="text-gray-600">窗口尺寸:</div>
            <div class="font-mono text-lg">
              宽: {{ width }}px, 高: {{ height }}px
            </div>
          </div>
        </div>

        <div class="card">
          <h2 class="text-xl font-semibold mb-4 text-primary-600">VueUse - useStorage</h2>
          <div class="space-y-4">
            <div class="text-gray-600">计数器 (持久化到 localStorage):</div>
            <div class="text-4xl font-bold text-center">{{ count }}</div>
            <div class="flex gap-2 justify-center">
              <button class="btn-secondary" @click="decrement">-</button>
              <button class="btn-primary" @click="increment">+</button>
              <button class="btn-primary" @click="reset">重置</button>
            </div>
          </div>
        </div>

        <div class="card">
          <h2 class="text-xl font-semibold mb-4 text-secondary-600">VueUse - useToggle</h2>
          <div class="space-y-4">
            <div class="text-gray-600">暗黑模式切换:</div>
            <button
              class="btn-primary w-full"
              :class="{ 'bg-gray-800': darkMode }"
              @click="() => toggleDarkMode()"
            >
              {{ darkMode ? '关闭暗黑模式' : '开启暗黑模式' }}
            </button>
            <div v-if="darkMode" class="text-center text-sm text-gray-500">
              当前处于暗黑模式
            </div>
          </div>
        </div>

        <div class="card md:col-span-2">
          <h2 class="text-xl font-semibold mb-4 text-primary-600">通知系统</h2>
          <div class="space-y-4">
            <div class="flex gap-2 flex-wrap">
              <button class="btn-primary" @click="showMessage('操作成功！')">
                成功通知
              </button>
              <button class="btn-secondary" @click="showMessage('这是一条信息')">
                信息通知
              </button>
            </div>
            <div v-if="appStore.notification" class="p-4 rounded-lg" :class="{
              'bg-green-100 text-green-800': appStore.notification.type === 'success',
              'bg-blue-100 text-blue-800': appStore.notification.type === 'info',
              'bg-red-100 text-red-800': appStore.notification.type === 'error',
            }">
              {{ appStore.notification.message }}
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 text-center text-sm text-gray-500">
        以上演示了 VueUse 库中常用的组合式 API
      </div>

      <div class="mt-12">
        <ElementPlusDemo />
      </div>

      <div class="mt-12">
        <AxiosDemo />
      </div>
    </div>
  </div>
</template>
