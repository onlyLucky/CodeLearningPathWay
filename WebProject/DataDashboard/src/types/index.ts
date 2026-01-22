export interface ChartData {
  name: string
  value: number
  [key: string]: any
}

export interface DashboardData {
  totalSales: number
  totalOrders: number
  totalUsers: number
  conversionRate: number
  salesTrend: ChartData[]
  categoryDistribution: ChartData[]
  regionalData: ChartData[]
  realtimeData: ChartData[]
}

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}
