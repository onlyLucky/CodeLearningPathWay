export enum WebSocketState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

export interface WebSocketConfig {
  url: string
  // protocols?: string | string[]
  reconnectInterval?: number
  maxReconnectAttempts?: number
  heartbeatInterval?: number
  heartbeatMessage?: string
  serializer?: (data: unknown) => string
  deserializer?: (data: string) => unknown
  onOpen?: (event: Event) => void
  onMessage?: (event: MessageEvent) => void
  onError?: (event: Event) => void
  onClose?: (event: CloseEvent) => void
  onReconnecting?: (attempt: number) => void
  onReconnectFailed?: () => void
}

export interface WebSocketInstance {
  connect: () => void
  send: (type?: string, data?: any) => void
  close: (code?: number, reason?: string) => void
  getState: () => WebSocketState
  isConnected: () => boolean
  on: (event: string, callback: (...args: unknown[]) => void) => void
  off: (event: string, callback: (...args: unknown[]) => void) => void
  once: (event: string, callback: (...args: unknown[]) => void) => void
}

export interface WebSocketOptions extends Partial<WebSocketConfig> {
  url: string
  meetingId: string
  mac: string
}

export type WebSocketEventCallback = (...args: any[]) => void

export interface WebSocketEventHandlers {
  open?: WebSocketEventCallback[]
  message?: WebSocketEventCallback[]
  error?: WebSocketEventCallback[]
  close?: WebSocketEventCallback[]
  reconnecting?: WebSocketEventCallback[]
  reconnectFailed?: WebSocketEventCallback[]
}
