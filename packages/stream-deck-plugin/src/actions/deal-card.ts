import streamDeck, { SingletonAction, action } from '@elgato/streamdeck'
import { WebSocketServer } from 'ws'

interface DealCardSettings {}

const logger = streamDeck.logger.createScope('DealCard')

// TODO is this port ok?
const port = 4246
const server = new WebSocketServer({ port })
// TODO check for broken connections
// See: https://www.npmjs.com/package/ws#how-to-detect-and-close-broken-connections

server.on('listening', () => logger.debug(`Web socket server listening on port ${port}`))
server.on('connection', () => logger.debug('Connection started'))
server.on('close', () => logger.debug('Connection lost'))
server.on('error', e => logger.error(`Web socket error: ${e.message}`))

// TODO share this across packages
const message = 'deal-card-next'

@action({ UUID: 'com.zakini.card-dealer.deal' })
export class DealCard extends SingletonAction<DealCardSettings> {
  onKeyDown(): void | Promise<void> {
    for (const client of server.clients) {
      // TODO client IDs
      logger.trace(`Sending ${message} to client`)
      client.send(message)
    }
  }
}
