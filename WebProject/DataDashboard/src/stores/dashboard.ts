import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { DashboardData } from '@/types'

export const useDashboardStore = defineStore('dashboard', () => {
  const dashboardData = ref<DashboardData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const totalSales = computed(() => dashboardData.value?.totalSales ?? 0)
  const totalOrders = computed(() => dashboardData.value?.totalOrders ?? 0)
  const totalUsers = computed(() => dashboardData.value?.totalUsers ?? 0)
  const conversionRate = computed(() => dashboardData.value?.conversionRate ?? 0)

  function setData(data: DashboardData) {
    dashboardData.value = data
  }

  function setLoading(status: boolean) {
    loading.value = status
  }

  function setError(message: string | null) {
    error.value = message
  }

  function $reset() {
    dashboardData.value = null
    loading.value = false
    error.value = null
  }

  return {
    dashboardData,
    loading,
    error,
    totalSales,
    totalOrders,
    totalUsers,
    conversionRate,
    setData,
    setLoading,
    setError,
    $reset
  }
})
