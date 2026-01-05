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
    applyTheme()
  }

  function toggleTheme() {
    const newTheme = settings.value.theme === 'light' ? 'dark' : 'light'
    console.log('Toggling theme from', settings.value.theme, 'to', newTheme)
    settings.value.theme = newTheme
    localStorage.setItem('appSettings', JSON.stringify(settings.value))
    applyTheme()
  }

  function applyTheme() {
    console.log('Applying theme:', settings.value.theme)
    if (settings.value.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    console.log('Current dark class:', document.documentElement.classList.contains('dark'))
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
    applyTheme()
  }

  loadSettings()

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
