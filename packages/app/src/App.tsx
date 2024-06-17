import { useCallback, useEffect, useState } from 'react'
import Card from './components/Card'
import connectToWebsocket, { WsEventListener } from './utils/websocket'
import { DealCardSettings, cardMessage, receiveMessage } from '@card-dealer/utils'

interface UseStreamDeckInputOptions {
  onMessage: () => void
  onSettings: (newSettings: DealCardSettings) => void
}

const useStreamDeckInput = ({ onMessage, onSettings }: UseStreamDeckInputOptions) => {
  const [socket, setSocket] = useState<WebSocket | null>(null)

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

    const messageListener: WsEventListener<'message'> = (e: MessageEvent<unknown>) => {
      const m = receiveMessage(e)

      if (m.message === cardMessage) {
        onMessage()
      } else {
        onSettings(m.data)
      }
    }
    socket.addEventListener('message', messageListener)

    return () => {
      socket.removeEventListener('message', messageListener)
    }
  }, [socket, onMessage, onSettings])
}

const App = () => {
  const [settings, setSettings] = useState<DealCardSettings>({})

  const [dealCard, setDealCard] = useState(false)
  const [cardDealt, setCardDealt] = useState(false)
  const [flipCard, setFlipCard] = useState(false)
  const [cardFaceUp, setCardFaceUp] = useState(false)

  useStreamDeckInput({
    onMessage: useCallback(() => {
      if (!dealCard) setDealCard(true)
      else if (cardDealt && !flipCard) setFlipCard(true)
      else if (cardFaceUp) setDealCard(false)
    }, [dealCard, cardDealt, flipCard, cardFaceUp]),
    onSettings: setSettings,
  })

  // Reset state on redeal
  useEffect(() => {
    if (dealCard) return

    setDealCard(false)
    setCardDealt(false)
    setFlipCard(false)
    setCardFaceUp(false)
  }, [dealCard])

  return (
    // z-0 starts a new stacking context here (I think?)
    <div className="relative z-0 overflow-hidden">
      <div className="h-screen overflow-hidden z-10 flex items-center justify-center">
        <Card
          settings={settings}
          deal={dealCard}
          flip={flipCard}
          className="h-1/2"
          // NOTE we use 100vh since the container fills the screen, and 50% since that's the
          // height of the card. Update this if either of those changes!
          initialY="calc(100vh - 50%)"
          onDealEnd={() => {
            setCardDealt(true)
          }}
          onFlipEnd={() => {
            setCardFaceUp(true)
          }}
        />
      </div>
    </div>
  )
}

export default App
