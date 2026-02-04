interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_PORT: string
  readonly VITE_APP_ENV: string
  readonly MODE: string
  readonly BASE_URL: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly SSR: boolean
  readonly FLV_URL: string
  readonly YUN_DESK_PATH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'echarts' {
  export * from 'echarts/core'
}

declare module '*.geojson' {
  const value: any
  export default value
}

declare module '*.jpg' {
  const value: any
  export default value
}

declare module '*.png' {
  const value: any
  export default value
}
