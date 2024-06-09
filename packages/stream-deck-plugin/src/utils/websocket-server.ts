import { WebSocket, WebSocketServer } from 'ws'
import logger from './logger'
import { findOpenPort, pingDelay } from '@card-dealer/utils'

interface WebSocketClient extends WebSocket {
  isAlive?: boolean
}

const isErrnoException = (v: unknown): v is NodeJS.ErrnoException => typeof v === 'object'
  && v !== null
  && 'code' in v
  && typeof v.code === 'string'

const waitForServerStart = async (server: WebSocketServer) =>
  new Promise<void>((resolve, reject) => {
    const onSuccess = () => {
      server.off('error', onError)
      logger.debug(`Websocket server listening on port ${server.options.port}`)
      resolve()
    }
    const onError = (e: Error) => {
      server.off('connection', onSuccess)
      reject(e)
    }

    server.once('listening', onSuccess)
    server.once('error', onError)
  })

const detectBrokenConnections = (server: WebSocketServer): void => {
  server.on('connection', (client: WebSocketClient) => {
    client.isAlive = true
    client.on('pong', function (this: WebSocketClient) {
      this.isAlive = true
    })
  })

  const intervalId = setInterval(() => {
    const clients: Set<WebSocketClient> = server.clients
    for (const client of clients) {
      if (client.isAlive === false) {
        logger.debug('Terminating unresponsive client connection')
        client.terminate()
        return
      }

      client.isAlive = false
      client.ping()
    }
  }, pingDelay)

  server.on('close', () => {
    clearInterval(intervalId)
  })
}

const log = (server: WebSocketServer): void => {
  server.on('listening', () => {
    logger.debug(`Websocket server listening on port ${server.options.port}`)
  })
  server.on('error', (e) => {
    logger.error(`Websocket server error: ${e.message}`)
  })

  server.on('connection', (client) => {
    logger.debug('Websocket connection started')
    client.on('close', () => {
      logger.debug('Websocket connection closed')
    })
  })
}

const createServer = async (): Promise<WebSocketServer> => {
  const server = await findOpenPort({
    attemptPort: async (port) => {
      logger.trace(`Attempting to start websocket server on port ${port}`)
      const server = new WebSocketServer({ port })
      await waitForServerStart(server)
      return server
    },
    isUnavailablePortError: e => isErrnoException(e) && e.code === 'EADDRINUSE',
  })

  detectBrokenConnections(server)
  log(server)

  return server
}

export default createServer
