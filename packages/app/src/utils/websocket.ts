interface WebSocketClient extends WebSocket {
  pingTimeout?: number
}

export type WsEventListener<K extends keyof WebSocketEventMap> =
  (this: WebSocket, ev: WebSocketEventMap[K]) => unknown

const isWebSocket = (v: unknown): v is WebSocket => typeof v === 'object'
  && v !== null
  && 'url' in v
  && 'close' in v

const waitForSocketConnection = async (socket: WebSocket) =>
  new Promise<void>((resolve, reject) => {
    const onSuccess: WsEventListener<'open'> = (e) => {
      socket.removeEventListener('open', onSuccess)
      socket.removeEventListener('error', onError)

      // The type def doesn't mark this as a websocket for some reason
      const target = isWebSocket(e.target) ? e.target : null
      if (!target) console.error('Huh? e.target is not a WebSocket??')
      console.info(`Connected to websocket server at ${target?.url ?? 'UNKNOWN'}`)

      resolve()
    }
    const onError: WsEventListener<'error'> = (e) => {
      socket.removeEventListener('open', onSuccess)
      socket.removeEventListener('error', onError)

      // The type def doesn't mark this as a websocket for some reason
      const target = isWebSocket(e.target) ? e.target : null
      if (!target) console.error('Huh? e.target is not a WebSocket??')
      reject(new Error(`Failed websocket connection to ${target?.url ?? 'UNKNOWN'}`))
    }

    socket.addEventListener('open', onSuccess)
    socket.addEventListener('error', onError)
  })

// TODO share this across packages
interface FindOpenPortOptions<T> {
  attemptPort: (port: number) => T | Promise<T> | never
  isUnavailablePortError: (e: unknown) => boolean
}
const portRangeStart = 6660
const portRangeLength = 10
const findOpenPort = async <T>({ attemptPort, isUnavailablePortError }: FindOpenPortOptions<T>) => {
  for (let port = portRangeStart; port < portRangeStart + portRangeLength; port++) {
    try {
      return await attemptPort(port)
    } catch (e) {
      if (isUnavailablePortError(e)) continue
      throw e
    }
  }

  const portRangeString = `${portRangeStart} and ${portRangeStart + portRangeLength - 1}`
  throw new Error(`Failed to find open port between ${portRangeString}`)
}

const log = (socket: WebSocket) => {
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

const connectToWebsocket = async (): Promise<WebSocket> => {
  const socket = await findOpenPort({
    attemptPort: async (port) => {
      const url = `ws://localhost:${port}`
      const socket = new WebSocket(url)
      await waitForSocketConnection(socket)
      return socket
    },
    isUnavailablePortError: () => true,
  })

  log(socket)
  detectBrokenConnections(socket)

  return socket
}

export default connectToWebsocket
