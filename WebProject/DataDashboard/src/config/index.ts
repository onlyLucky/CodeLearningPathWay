interface EnvConfig {
  title: string
  apiBaseUrl: string
  port: number
  env: string
}

const envConfigs: Record<string, EnvConfig> = {
  development: {
    title: import.meta.env.VITE_APP_TITLE || '数据大屏',
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
    port: Number(import.meta.env.VITE_APP_PORT) || 3000,
    env: import.meta.env.VITE_APP_ENV || 'development'
  },
  test: {
    title: import.meta.env.VITE_APP_TITLE || '数据大屏测试',
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://test-api.example.com',
    port: Number(import.meta.env.VITE_APP_PORT) || 3000,
    env: import.meta.env.VITE_APP_ENV || 'test'
  },
  production: {
    title: import.meta.env.VITE_APP_TITLE || '数据大屏',
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
    port: Number(import.meta.env.VITE_APP_PORT) || 3000,
    env: import.meta.env.VITE_APP_ENV || 'production'
  }
}

const currentEnv = import.meta.env.MODE || 'development'

export const config = envConfigs[currentEnv] || envConfigs.development

export const isDevelopment = config.env === 'development'
export const isTest = config.env === 'test'
export const isProduction = config.env === 'production'

export default config
