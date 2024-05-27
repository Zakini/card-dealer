import cardBack from '../assets/cards/default/back.svg'
import { useState } from 'react'

interface Props {
  className?: string
}

const deck = Object.values(import.meta.glob<string>(
  '../assets/cards/default/faces/*.svg',
  { eager: true, import: 'default' },
))

export default function Card({ className = '' }: Props) {
  // useState so that the chosen card doesn't change on render
  const [card] = useState(deck[Math.floor(Math.random() * deck.length)])
  const [faceUp, setFaceUp] = useState(false)
  // TODO set this to true when card deal animation ends
  const cardDealt = true

  return (
    <img
      className={`${className} aspect-auto`}
      src={faceUp ? card : cardBack}
      onClick={() => {
        if (cardDealt) setFaceUp(true)
      }}
    />
  )
}
