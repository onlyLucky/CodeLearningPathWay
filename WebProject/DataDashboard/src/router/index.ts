import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),// 路由模式为hash模式 createWebHistory
  routes
})

export default router
