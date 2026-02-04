interface EnvConfig {
  title: string
  apiBaseUrl: string
  port: number
  env: string
  flvUrl: string
  yunDeskPath: string
}

const envConfigs: Record<string, EnvConfig> = {
  development: {
    title: import.meta.env.VITE_APP_TITLE || '数据大屏',
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
    port: Number(import.meta.env.VITE_APP_PORT) || 3000,
    env: import.meta.env.VITE_APP_ENV || 'development',
    flvUrl: import.meta.env.FLV_URL || 'http://192.168.19.127:8080/live/live200.flv',
    yunDeskPath: import.meta.env.YUN_DESK_PATH || 'http://192.168.19.127:6802/index.html?RemoteUserCode=dm1&RemotePwd=Dm123456&RemoteIp=192.168.19.17:3389'
  },
  test: {
    title: import.meta.env.VITE_APP_TITLE || '数据大屏测试',
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://test-api.example.com',
    port: Number(import.meta.env.VITE_APP_PORT) || 3000,
    env: import.meta.env.VITE_APP_ENV || 'test',
    flvUrl: import.meta.env.FLV_URL || 'http://192.168.19.127:8080/live/live200.flv',
    yunDeskPath: import.meta.env.YUN_DESK_PATH || 'http://192.168.19.127:6802/index.html?RemoteUserCode=dm1&RemotePwd=Dm123456&RemoteIp=192.168.19.17:3389'
  },
  production: {
    title: import.meta.env.VITE_APP_TITLE || '数据大屏',
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
    port: Number(import.meta.env.VITE_APP_PORT) || 3000,
    env: import.meta.env.VITE_APP_ENV || 'production',
    flvUrl: import.meta.env.FLV_URL || 'http://192.168.16.162:8080/live/live206.flv',
    yunDeskPath: import.meta.env.YUN_DESK_PATH || 'https://meet.bjxmxx.com:3443/remote/index.html?RemoteUserCode=administrator&RemotePwd=xm123123&RemoteIp=192.168.16.163:3389'
  }
}

const currentEnv = import.meta.env.MODE || 'development'

export const config = envConfigs[currentEnv] || envConfigs.development

export const isDevelopment = config.env === 'development'
export const isTest = config.env === 'test'
export const isProduction = config.env === 'production'

export const flvUrl = config.flvUrl
export const yunDeskPath = config.yunDeskPath

export default config
