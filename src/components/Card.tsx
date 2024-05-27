import { cardMap } from '../utils/cards'
import cardBack from '../assets/cards/default/back.svg'

interface Props {
  cardName: string | null
  faceUp: boolean

  className?: string
  onClick?: () => void
}

export default function Card({ cardName, faceUp, className = '', onClick }: Props) {
  let card

  if (faceUp) {
    // TODO show unknown face if null?
    if (cardName === null) return
    card = cardMap[cardName]
  } else {
    card = cardBack
  }

  return (
    <img src={card} className={`${className} w-full`} onClick={onClick} />
  )
}
