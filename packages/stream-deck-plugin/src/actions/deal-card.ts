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
      void streamDeck.actions.createController(ev.action.id)
        .getSettings()
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
    logger.debug(JSON.stringify(ev.action.id))
    logger.debug(JSON.stringify(streamDeck.info))
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
