import streamDeck from '@elgato/streamdeck'
import { WebSocket, WebSocketServer } from 'ws'

type Logger = typeof streamDeck.logger
interface Options {
  logger: Logger
}

interface WebSocketClient extends WebSocket {
  isAlive?: boolean
}

// TODO share this across packages
const pingDelay = 30_000
const detectBrokenConnections = (server: WebSocketServer, logger: Logger): void => {
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

const log = (server: WebSocketServer, logger: Logger): void => {
  server.on('listening', () => {
    logger.debug(`Websocket server listening on port ${server.options.port}`)
  })
  server.on('connection', () => {
    logger.debug('Websocket connection started')
  })
  server.on('error', (e) => {
    logger.error(`Websocket error: ${e.message}`)
  })
}

const createServer = ({ logger }: Options): WebSocketServer => {
  // TODO is this port ok?
  // See: https://dev.to/richardeschloss/nodejs-portfinding-three-approaches-compared-f1g
  const port = 4246
  const server = new WebSocketServer({ port })

  detectBrokenConnections(server, logger)
  log(server, logger)

  return server
}

export default createServer
