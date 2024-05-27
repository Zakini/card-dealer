import { cardMap } from '../utils/cards'
import cardBack from '../assets/cards/default/back.svg'

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  cardName: string | null
  faceUp: boolean
  onClick?: () => void
}

export default function Card({ cardName, faceUp, onClick }: Props) {
  let card

  if (faceUp) {
    // TODO show unknown face if null?
    if (cardName === null) return
    card = cardMap[cardName]
  } else {
    card = cardBack
  }

  return (
    <img src={card} onClick={onClick} />
  )
}
