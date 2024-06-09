interface WebSocketClient extends WebSocket {
  pingTimeout?: number
}

export type WsEventListener<K extends keyof WebSocketEventMap> =
  (this: WebSocket, ev: WebSocketEventMap[K]) => unknown

const isWebSocket = (v: unknown): v is WebSocket => typeof v === 'object'
  && v !== null
  && 'url' in v
  && 'close' in v

const log = (socket: WebSocket) => {
  socket.addEventListener('open', (e) => {
    // The type def doesn't mark this as a websocket for some reason
    const target = isWebSocket(e.target) ? e.target : null
    if (!target) console.error('Huh? e.target is not a WebSocket??')
    console.info(`Connected to websocket server at ${target?.url ?? 'UNKNOWN'}`)
  })
  socket.addEventListener('message', (message) => {
    console.info(`Received websocket message: ${message.data}`)
  })
  socket.addEventListener('close', (e) => {
    // The type def doesn't mark this as a websocket for some reason
    const target = isWebSocket(e.target) ? e.target : null
    if (!target) console.error('Huh? e.target is not a WebSocket??')
    console.warn(`Lost websocket connection to ${target?.url ?? 'UNKNOWN'}`)
  })
}

const detectBrokenConnections = (socket: WebSocket) => {
  socket.addEventListener('open', function (this: WebSocketClient) {
    if (this.pingTimeout) clearTimeout(this.pingTimeout)

    this.pingTimeout = window.setTimeout(() => {
      // TODO using close could be problematic here, since this will attempt to gracefully close the
      // connection, but we know that won't work and need to close the connection immediately
      // See: https://www.npmjs.com/package/ws#how-to-detect-and-close-broken-connections
      // TODO reconnect somehow?
      this.close()
    }, 30_000 + 1000)
  })
}

const connectToWebsocket = (): WebSocket => {
  const port = 4246
  const url = `ws://localhost:${port}`
  const socket = new WebSocket(url)

  log(socket)
  detectBrokenConnections(socket)

  return socket
}

export default connectToWebsocket
