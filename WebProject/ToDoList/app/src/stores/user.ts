import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: number
  name: string
  email: string
  avatar?: string
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string>('')

  const isLoggedIn = computed(() => !!token.value)
  const userName = computed(() => user.value?.name || '')

  function setUser(userData: User) {
    user.value = userData
  }

  function setToken(newToken: string) {
    token.value = newToken
  }

  function logout() {
    user.value = null
    token.value = ''
  }

  async function login(email: string, password: string) {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      setUser(data.user)
      setToken(data.token)
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  return {
    user,
    token,
    isLoggedIn,
    userName,
    setUser,
    setToken,
    logout,
    login,
  }
})
