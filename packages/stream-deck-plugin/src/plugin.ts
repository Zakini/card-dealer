import streamDeck, { LogLevel } from '@elgato/streamdeck'
import { DealCard } from './actions/deal-card'

// TODO set this lower? based on NODE_ENV?
streamDeck.logger.setLevel(LogLevel.TRACE)
streamDeck.actions.registerAction(new DealCard())
void streamDeck.connect()
