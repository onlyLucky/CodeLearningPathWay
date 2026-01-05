<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import { useAppStore } from './stores'
import { storeToRefs } from 'pinia'

const appStore = useAppStore()
const { notification } = storeToRefs(appStore)
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <NavBar />
    
    <main>
      <router-view />
    </main>

    <Transition name="notification">
      <div
        v-if="notification"
        class="fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm"
        :class="{
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100': notification.type === 'success',
          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100': notification.type === 'info',
          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100': notification.type === 'error',
        }"
      >
        {{ notification.message }}
      </div>
    </Transition>
  </div>
</template>

<style>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>

