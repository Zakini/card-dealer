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
    <Card cardName={card} faceUp={faceUp} onClick={() => { setFaceUp(s => !s) }} />
  )
}

export default App
