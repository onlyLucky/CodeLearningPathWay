export interface Recording {
  id: string
  name: string
  duration: number
  filePath: string
  fileSize: number
  createdAt: string
  status: 'recording' | 'completed' | 'failed'
}

export interface AudioConfig {
  format: 'mp3' | 'aac' | 'wav'
  sampleRate: number
  numberOfChannels: number
  bitRate: number
}

export interface ThemeConfig {
  isDark: boolean
  theme: 'light' | 'dark'
}
