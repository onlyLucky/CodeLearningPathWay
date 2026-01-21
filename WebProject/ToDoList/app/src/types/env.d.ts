declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}

declare global {
  const uni: UniApp.Uni
  const wx: WechatMiniprogram.Wx
  const getCurrentPages: () => any[]
  const App: any
  const Page: any
  const Component: any
  const Behavior: any
  const getApp: () => any
}

declare module 'pinia' {
  import type { App } from 'vue'
  import type { Plugin } from 'vue'
  export function createPinia(): Plugin
  export function defineStore<T extends (...args: any[]) => any>(
    id: string,
    setup: T,
    options?: unknown
  ): () => ReturnType<T>
  export interface DefineStoreOptionsBase {
    persist?: boolean | unknown
  }
}

declare module 'pinia-plugin-persistedstate' {
  import { PiniaPluginContext } from 'pinia'
  export interface PersistOptions {
    enabled?: boolean
    strategies?: Array<{
      key?: string
      storage?: {
        getItem: (key: string) => unknown
        setItem: (key: string, value: unknown) => void
        removeItem?: (key: string) => void
      }
    }>
  }
  export function createPersistedState(
    options?: PersistOptions
  ): (context: PiniaPluginContext) => void
}
