import { useEffect, useState } from 'react'
import Card from './components/Card'
import { motion, AnimatePresence } from 'framer-motion'
import { config as tailwind } from './utils/tailwind'
import connectToWebsocket, { WsEventListener } from './utils/websocket'
import { cardMessage } from '@card-dealer/utils'

function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [cardDealt, setCardDealt] = useState(false)
  const [cardRevealed, setCardRevealed] = useState(false)
  const [allowRedeal, setAllowRedeal] = useState(false)

  // Handle stream deck input
  useEffect(() => {
    const promise = connectToWebsocket()

    const effect = async () => {
      try {
        setSocket(await promise)
        // TODO report successful connection to user
      } catch (e) {
        // TODO report this to the user
        console.error(e)
      }
    }

    void effect()

    return () => {
      const cleanup = async () => {
        let socket = null
        try {
          socket = await promise
        } catch (e) {
          // Socket isn't open, nothing to do
        }

        socket?.close()

        setSocket(null)
      }

      void cleanup()
    }
  }, [])
  useEffect(() => {
    if (!socket) return

    const dealListener: WsEventListener<'message'> = (message) => {
      if (message.data !== cardMessage) {
        console.warn(`Unexpected websocket message: ${message.data}`)
        return
      }

      setCardDealt(true)
    }
    socket.addEventListener('message', dealListener)

    return () => {
      socket.removeEventListener('message', dealListener)
    }
  }, [socket])

  useEffect(() => {
    if (!cardRevealed) return

    // eslint-disable-next-line @stylistic/max-statements-per-line
    const timeoutId = setTimeout(() => { setAllowRedeal(true) }, 1000)

    // eslint-disable-next-line @stylistic/max-statements-per-line
    return () => { clearTimeout(timeoutId) }
  }, [cardRevealed])

  // Reset state on redeal
  useEffect(() => {
    if (cardDealt) return

    setCardRevealed(false)
    setAllowRedeal(false)
  }, [cardDealt])

  return (
    // z-0 starts a new stacking context here (I think?)
    <div className="relative z-0 overflow-hidden bg-black">
      <div
        className="h-screen overflow-hidden z-10 flex items-center justify-center"
        onClick={() => { setCardDealt(true) }}
      >
        <Card
          deal={cardDealt}
          className="h-1/2"
          // NOTE we use 100vh since the container fills the screen, and 50% since that's the
          // height of the card. Update this if either of those changes!
          initialY="calc(100vh - 50%)"
          onFlip={({ faceUp }) => {
            if (faceUp) setCardRevealed(true)
          }}
        />
      </div>

      <AnimatePresence>
        {!cardDealt && (
          <motion.div
            className="absolute inset-0 -z-10 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1 } }}
            exit={{ opacity: 0, transition: { duration: 1 } }}
          >
            <span className="text-gray-900 text-9xl uppercase font-bold select-none">
              Click to Deal
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {allowRedeal && (
          <motion.button
            onClick={() => { setCardDealt(false) }}
            className="absolute right-0 bottom-0 p-10 text-xl lowercase"
            initial={{
              opacity: 0,
              y: tailwind.theme.translate[5],
              color: tailwind.theme.colors.gray[700],
            }}
            animate={{ opacity: 1 }}
            whileHover={{
              y: tailwind.theme.translate[0],
              color: tailwind.theme.colors.gray[500],
            }}
            transition={{ duration: 2 }}
          >
            Again?
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
