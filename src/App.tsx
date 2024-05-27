import { useEffect, useState } from 'react'
import { cardMap } from './utils/cards'
import Card from './components/Card'

const possibleCardNames = Object.keys(cardMap)

function App() {
  const [card, setCard] = useState<string | null>(null)
  const [faceUp, setFaceUp] = useState(false)

  useEffect(() => {
    setCard(possibleCardNames[Math.floor(Math.random() * possibleCardNames.length)])
  }, [])

  return (
    <div className="h-screen flex items-center justify-center">
      <Card cardName={card} faceUp={faceUp} className="h-1/2" onClick={() => { setFaceUp(s => !s) }} />
    </div>
  )
}

export default App
