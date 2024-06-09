import streamDeck, { SingletonAction, action } from '@elgato/streamdeck'
import createServer from '../utils/websocket-server'

interface DealCardSettings {}

const logger = streamDeck.logger.createScope('DealCard')
const server = createServer({ logger })

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
