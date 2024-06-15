import { emitKeypressEvents } from 'readline'
import { cardMessage, createWebsocketServer } from '@card-dealer/utils'

emitKeypressEvents(process.stdin)
if (process.stdin.isTTY) process.stdin.setRawMode(true)

console.info('Starting...')
const server = await createWebsocketServer({
  trace: console.info,
  debug: console.info,
  error: console.info,
})

process.stdin.on('keypress', (char, { ctrl, name }) => {
  if (ctrl && name === 'c') {
    console.info('Stopping...')
    server.close()
    process.exit()
  }

  if (name !== 'space') {
    console.warn(`Ignoring unhandled input: ${char}`)
    return
  }

  if (server.clients.size <= 0) console.warn('Cannot send message: no connected clients')

  for (const client of server.clients) {
    // TODO client IDs
    console.info(`Sending ${cardMessage} to client`)
    client.send(cardMessage)
  }
})
