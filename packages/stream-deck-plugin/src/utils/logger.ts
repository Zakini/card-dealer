import streamDeck, { LogLevel } from '@elgato/streamdeck'

const logger = streamDeck.logger.createScope('DealCard')
// TODO set this lower? based on NODE_ENV?
logger.setLevel(LogLevel.TRACE)

export default logger
