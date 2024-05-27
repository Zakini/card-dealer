import cardBack from '../assets/cards/default/back.svg'
import { useState } from 'react'

interface Props {
  faceUp: boolean

  className?: string
  onClick?: () => void
}

const deck = Object.values(import.meta.glob<string>(
  '../assets/cards/default/faces/*.svg',
  { eager: true, import: 'default' },
))

export default function Card({ faceUp, className = '', onClick }: Props) {
  // useState so that the chosen card doesn't change on render
  const [card] = useState(deck[Math.floor(Math.random() * deck.length)])

  return (
    <img src={faceUp ? card : cardBack} className={`${className} aspect-auto`} onClick={onClick} />
  )
}
