import streamDeck from '@elgato/streamdeck'
import {
  DidReceiveSettingsEvent,
  SingletonAction,
  WillAppearEvent,
  action,
} from '@elgato/streamdeck'
import logger from '../utils/logger'
import {
  DealCardSettings,
  cardMessage,
  createWebsocketServer,
  sendMessage,
  settingsMessage,
} from '@card-dealer/utils'
import datauri from 'datauri'

const server = await createWebsocketServer(logger)

let hasAppeared = false

@action({ UUID: 'com.zakini.card-dealer.deal' })
export class DealCard extends SingletonAction<DealCardSettings> {
  onWillAppear(ev: WillAppearEvent<DealCardSettings>): void | Promise<void> {
    // Prevent event listener from being bound multiple times
    if (hasAppeared) return
    hasAppeared = true

    server.on('connection', () => {
      // Calling getSettings() triggers onDidReceiveSettings()
      // HACK React running useEffect()s results in this listener running twice quickly which
      // something doesn't like. Delay by 1 second to avoid this
      setTimeout(() => {
        void streamDeck.actions.createController(ev.action.id)
          .getSettings()
      }, 1000)
    })
  }

  onKeyDown(): void | Promise<void> {
    for (const client of server.clients) {
      // TODO client IDs
      logger.trace(`Sending ${cardMessage} to client`)
      sendMessage(client, { message: cardMessage })
    }
  }

  async onDidReceiveSettings(ev: DidReceiveSettingsEvent<DealCardSettings>): Promise<void> {
    logger.trace(`Settings changed: ${JSON.stringify(ev.payload.settings)}`)

    const data: DealCardSettings = {
      cardBack: ev.payload.settings.cardBack
        ? await datauri(ev.payload.settings.cardBack).catch(() => null)
        : null,
      cardFaces: ev.payload.settings.cardFaces
        ? (await Promise.all(ev.payload.settings.cardFaces.map(
            async v => await datauri(v).catch(() => null),
          ))).filter((v): v is string => typeof v === 'string')
        : [],
    }

    for (const client of server.clients) {
      // TODO client IDs
      logger.trace('Updating settings on client')
      sendMessage(client, { message: settingsMessage, data })
    }
  }
}
