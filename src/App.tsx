import { useEffect, useState } from 'react'
import './App.css'

const cardImports = Object.values(
  import.meta.glob<string>(
    './assets/cards/default/*.svg',
    { eager: true, import: 'default' },
  ),
)

function App() {
  const [card, setCard] = useState<string | undefined>(undefined)

  useEffect(() => {
    setCard(cardImports[Math.floor(Math.random() * cardImports.length)])
  }, [])

  return (
    <img src={card} />
  )
}

export default App
