import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface AppSettings {
  theme: 'light' | 'dark'
  language: 'zh-CN' | 'en-US'
  sidebarCollapsed: boolean
}

export const useAppStore = defineStore('app', () => {
  const settings = ref<AppSettings>({
    theme: 'light',
    language: 'zh-CN',
    sidebarCollapsed: false,
  })

  const isLoading = ref(false)
  const notification = ref<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  function updateSettings(newSettings: Partial<AppSettings>) {
    settings.value = { ...settings.value, ...newSettings }
    localStorage.setItem('appSettings', JSON.stringify(settings.value))
  }

  function toggleTheme() {
    const newTheme = settings.value.theme === 'light' ? 'dark' : 'light'
    updateSettings({ theme: newTheme })
  }

  function toggleSidebar() {
    updateSettings({ sidebarCollapsed: !settings.value.sidebarCollapsed })
  }

  function showNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
    notification.value = { message, type }
    setTimeout(() => {
      notification.value = null
    }, 3000)
  }

  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  function loadSettings() {
    const saved = localStorage.getItem('appSettings')
    if (saved) {
      settings.value = JSON.parse(saved)
    }
  }

  return {
    settings,
    isLoading,
    notification,
    updateSettings,
    toggleTheme,
    toggleSidebar,
    showNotification,
    setLoading,
    loadSettings,
  }
})
