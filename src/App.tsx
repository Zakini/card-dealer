import { useEffect, useState } from 'react'
import { cardMap } from './utils/cards'
import Card from './components/Card'

const possibleCardNames = Object.keys(cardMap)

function App() {
  const [cardDealt, setCardDealt] = useState(false)
  const [card, setCard] = useState<string | null>(null)
  const [faceUp, setFaceUp] = useState(false)

  useEffect(() => {
    setCard(possibleCardNames[Math.floor(Math.random() * possibleCardNames.length)])
  }, [])

  return (
    // z-0 starts a new stacking context here (I think?)
    <div className="relative z-0 bg-black" onClick={() => { setCardDealt(true) }}>
      <div className="h-screen z-10 flex items-center justify-center">
        {cardDealt && (
          <Card
            cardName={card}
            faceUp={faceUp}
            className="h-1/2"
            onClick={() => { setFaceUp(true) }}
          />
        )}
      </div>
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <span className="text-gray-900 text-9xl uppercase font-bold select-none">
          Click to Deal
        </span>
      </div>
    </div>
  )
}

export default App
