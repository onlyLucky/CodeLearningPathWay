import request from '@/utils/request'
import type { DashboardData } from '@/types'

export const getDashboardData = (): Promise<DashboardData> => {
  return request.get('/dashboard/data')
}

export const getRealtimeData = () => {
  return request.get('/dashboard/realtime')
}

export const getSalesTrend = (params: { startDate: string; endDate: string }) => {
  return request.get('/dashboard/sales-trend', { params })
}

export const getCategoryDistribution = () => {
  return request.get('/dashboard/category-distribution')
}

export const getRegionalData = () => {
  return request.get('/dashboard/regional-data')
}
