import type {
  WebSocketConfig,
  WebSocketInstance,
  WebSocketOptions,
  WebSocketEventHandlers,
  WebSocketEventCallback,
} from './types'
import { WebSocketState } from './types'

/*发送命令类型*/
const _dispatch_comm = {
  Connect: 1,
  CallBack: 2,
  Send: 3,
  Replace: 4,
  Prompt: 5,
  Receive: 6,
  Storage: 7,
  Multimedia: 8,
  Ping: 9,
  Pong: 10,
  Send_Storage: 103007,
  Receive_Storage: 106007,
}

const TemplateMsg = {
  CommandHeader: {
    Visitor: {
      Rooms: [],
      Meeting: '',
      Node: 0,
      User: 0,
      ClientType: 1,
      VisitTime: new Date().getTime(),
      Mac: '',
      LeastUnit: true,
    },
    CommandType: {
      Dispatch: 9,
    },
  },
  CommandData: {
    Data: {
      DataMarking: '',
      DataContent: '',
    },
    Target: {
      Limit: [],
    },
  },
}

class WebSocketClient implements WebSocketInstance {
  private ws: WebSocket | null = null
  private config: Required<WebSocketConfig>
  private reconnectAttempts: number = 0
  private reconnectTimer: number | null = null
  private heartbeatTimer: number | null = null
  private eventHandlers: WebSocketEventHandlers = {}
  private manualClose: boolean = false

  constructor(options: WebSocketOptions) {
    this.config = {
      url: options.url,
      // protocols: options.protocols || '',
      reconnectInterval: options.reconnectInterval || 3000,
      maxReconnectAttempts: options.maxReconnectAttempts || Infinity,
      heartbeatInterval: options.heartbeatInterval || 30000,
      heartbeatMessage: options.heartbeatMessage || 'ping',
      serializer: options.serializer || JSON.stringify,
      deserializer: options.deserializer || JSON.parse,
      onOpen: options.onOpen || (() => {}),
      onMessage: options.onMessage || (() => {}),
      onError: options.onError || (() => {}),
      onClose: options.onClose || (() => {}),
      onReconnecting: options.onReconnecting || (() => {}),
      onReconnectFailed: options.onReconnectFailed || (() => {}),
    }
    if (options?.meetingId) {
      TemplateMsg.CommandHeader.Visitor.Meeting = options.meetingId
    }
    if (options?.mac) {
      TemplateMsg.CommandHeader.Visitor.Mac = options.mac
    }

    this.initializeEventHandlers()
  }

  private initializeEventHandlers(): void {
    this.eventHandlers = {
      open: [],
      message: [],
      error: [],
      close: [],
      reconnecting: [],
      reconnectFailed: [],
    }
  }

  connect(): void {
    if (
      this.ws &&
      (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN)
    ) {
      return
    }

    this.manualClose = false
    this.ws = new WebSocket(this.config.url) //, this.config.protocols

    this.ws.onopen = (event: Event) => {
      this.reconnectAttempts = 0
      this.startHeartbeat()
      this.trigger('open', event)
      this.config.onOpen?.(event)
      // 发送连接 接收
      const msgSend = TemplateMsg
      msgSend.CommandHeader.CommandType.Dispatch = _dispatch_comm.Connect
      this.send(msgSend)
      msgSend.CommandHeader.CommandType.Dispatch = _dispatch_comm.Receive
      this.send(msgSend)
    }

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        this.config.deserializer(event.data)
        const msgObj = JSON.parse(event.data)
        if (msgObj.CommandData.Data.DataMarking) {
          // msgObj.CommandData.Data
          this.trigger('message', msgObj.CommandData.Data) // event
          this.config.onMessage?.(msgObj.CommandData.Data) // event
        }
      } catch (error) {
        console.error('WebSocket message deserialization error:', error)
      }
    }

    this.ws.onerror = (event: Event) => {
      this.trigger('error', event)
      this.config.onError?.(event)
    }

    this.ws.onclose = (event: CloseEvent) => {
      this.stopHeartbeat()
      this.trigger('close', event)
      this.config.onClose?.(event)

      if (!this.manualClose && this.shouldReconnect()) {
        this.scheduleReconnect()
      }
    }
  }

  send(data: any): void {
    if (!this.isConnected()) {
      console.warn('WebSocket is not connected. Message not sent:', data)
      return
    }
    try {
      const serializedData = this.config.serializer(data)
      this.ws?.send(serializedData)
    } catch (error) {
      console.error('WebSocket send error:', error)
      this.trigger('error', new Event('error'))
    }
  }

  sendTypeData(type?: string, data?: any): void {
    if (!this.isConnected()) {
      console.warn('WebSocket is not connected. Message not sent:', data)
      return
    }
    const sendObj = TemplateMsg
    if (type) {
      sendObj.CommandData.Data.DataMarking = type
    }
    if (data) {
      sendObj.CommandData.Data.DataContent = data
    }
    try {
      const serializedData = this.config.serializer(sendObj)
      this.ws?.send(serializedData)
    } catch (error) {
      console.error('WebSocket send error:', error)
      this.trigger('error', new Event('error'))
    }
  }

  close(code?: number, reason?: string): void {
    this.manualClose = true
    this.stopHeartbeat()
    this.clearReconnectTimer()

    if (this.ws) {
      this.ws.close(code, reason)
      this.ws = null
    }
  }

  getState(): WebSocketState {
    if (!this.ws) {
      return WebSocketState.CLOSED
    }
    return this.ws.readyState as WebSocketState
  }

  isConnected(): boolean {
    return this.getState() === WebSocketState.OPEN
  }

  on(event: string, callback: (...args: unknown[]) => void): void {
    const eventType = event as keyof WebSocketEventHandlers
    if (this.eventHandlers[eventType]) {
      this.eventHandlers[eventType]!.push(callback as WebSocketEventCallback)
    }
  }

  off(event: string, callback: (...args: unknown[]) => void): void {
    const eventType = event as keyof WebSocketEventHandlers
    if (this.eventHandlers[eventType]) {
      const index = this.eventHandlers[eventType]!.indexOf(callback as WebSocketEventCallback)
      if (index > -1) {
        this.eventHandlers[eventType]!.splice(index, 1)
      }
    }
  }

  once(event: string, callback: (...args: unknown[]) => void): void {
    const wrapper = (...args: unknown[]) => {
      callback(...args)
      this.off(event, wrapper)
    }
    this.on(event, wrapper)
  }

  private trigger(event: string, data?: Event | MessageEvent | CloseEvent | number): void {
    const eventType = event as keyof WebSocketEventHandlers
    const handlers = this.eventHandlers[eventType]
    if (handlers) {
      handlers.forEach((handler) => handler(data))
    }
  }

  private shouldReconnect(): boolean {
    return this.reconnectAttempts < this.config.maxReconnectAttempts
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++

    if (this.reconnectAttempts <= this.config.maxReconnectAttempts) {
      this.trigger('reconnecting', this.reconnectAttempts)
      this.config.onReconnecting?.(this.reconnectAttempts)

      this.reconnectTimer = setTimeout(() => {
        this.connect()
      }, this.config.reconnectInterval)
    } else {
      this.trigger('reconnectFailed')
      this.config.onReconnectFailed?.()
    }
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  private startHeartbeat(): void {
    if (this.config.heartbeatInterval > 0) {
      this.heartbeatTimer = setInterval(() => {
        if (this.isConnected()) {
          const msgPing = TemplateMsg
          msgPing.CommandHeader.CommandType.Dispatch = _dispatch_comm.Ping
          this.send(msgPing)
        }
      }, this.config.heartbeatInterval)
    }
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }
}

export function createWebSocket(options: WebSocketOptions): WebSocketInstance {
  return new WebSocketClient(options)
}

export { WebSocketClient }
export { WebSocketState } from './types'
export type { WebSocketConfig, WebSocketInstance, WebSocketOptions } from './types'
