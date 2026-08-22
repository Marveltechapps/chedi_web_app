import { io } from 'socket.io-client'
import { resolveSocketBase } from './apiBase.js'

export const REALTIME_EVENTS = [
  'customer:created',
  'customer:updated',
  'customer:deleted',
  'customer:profile_updated',
  'customer:address:created',
  'customer:address:updated',
  'customer:address:deleted',
  'payment:created',
  'payment:updated',
  'subscription:created',
  'subscription:updated',
  'delivery:updated',
  'notification:created',
  'plot:updated',
  'crop:updated',
  'basket:updated',
  'ticket:updated',
  'cancellation:updated',
  'payment_method:updated',
]

function socketBaseUrl() {
  return resolveSocketBase()
}

let socket = null
let connectingKind = null

export function connectRealtime(opts) {
  if (socket && connectingKind === opts.kind) {
    if (!socket.connected) socket.connect()
    return socket
  }
  if (socket) {
    socket.removeAllListeners()
    socket.disconnect()
    socket = null
  }

  connectingKind = opts.kind
  let everConnected = false

  socket = io(socketBaseUrl(), {
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    withCredentials: true,
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 800,
    reconnectionDelayMax: 8000,
    timeout: 12000,
    auth: (cb) => cb({ token: opts.getToken() || '' }),
  })

  socket.on('connect', () => {
    if (everConnected) opts.onReconnect?.()
    everConnected = true
  })

  socket.on('disconnect', (reason) => {
    if (reason === 'io server disconnect') socket?.connect()
  })

  socket.on('connect_error', (err) => {
    const code = err?.data?.code || ''
    const message = err?.message || 'Socket connection failed'
    if (code === 'UNAUTHORIZED' || /unauthorized|expired|invalid/i.test(message)) {
      opts.onAuthError?.()
    }
    opts.onConnectError?.(message)
  })

  return socket
}

export function subscribeRealtime(events, handler) {
  if (!socket) return () => undefined
  const wrapped = []
  for (const event of events) {
    const fn = (payload) => {
      if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return
      handler(event, payload)
    }
    socket.on(event, fn)
    wrapped.push([event, fn])
  }
  return () => {
    for (const [event, fn] of wrapped) socket?.off(event, fn)
  }
}

export function disconnectRealtime() {
  if (!socket) return
  socket.removeAllListeners()
  socket.disconnect()
  socket = null
  connectingKind = null
}
