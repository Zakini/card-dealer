import { SingletonAction, action } from '@elgato/streamdeck'
import logger from '../utils/logger'
import { cardMessage, createWebsocketServer } from '@card-dealer/utils'

interface DealCardSettings {}

const server = await createWebsocketServer(logger)

@action({ UUID: 'com.zakini.card-dealer.deal' })
export class DealCard extends SingletonAction<DealCardSettings> {
  onKeyDown(): void | Promise<void> {
    for (const client of server.clients) {
      // TODO client IDs
      logger.trace(`Sending ${cardMessage} to client`)
      client.send(cardMessage)
    }
  }
}
