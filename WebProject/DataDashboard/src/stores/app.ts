import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref(false)
  const theme = ref('dark')
  const refreshInterval = ref(30000)

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function setTheme(newTheme: string) {
    theme.value = newTheme
  }

  function setRefreshInterval(interval: number) {
    refreshInterval.value = interval
  }

  return {
    sidebarCollapsed,
    theme,
    refreshInterval,
    toggleSidebar,
    setTheme,
    setRefreshInterval
  }
})
