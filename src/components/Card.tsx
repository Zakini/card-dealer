import { cardMap } from '../utils/cards'

interface Props {
  cardName: string | null
}

export default function Card({ cardName }: Props) {
  // TODO show unknown face if null?
  if (cardName === null) return

  const card = cardMap[cardName]

  return (
    <img src={card} />
  )
}
