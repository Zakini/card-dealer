import { motion, AnimatePresence, CustomValueType } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { DealCardSettings } from '@card-dealer/utils'
import { shuffle } from 'radash'

interface Props {
  settings: DealCardSettings
  deal: boolean
  flip: boolean
  className?: string
  initialY: string | number | CustomValueType

  onDealEnd: () => void
  onFlipEnd: () => void
}

const useDeck = (cards: string[]) => {
  const [deck, setDeck] = useState<string[]>([])
  const [index, setIndex] = useState<number | null>(null)

  useEffect(() => {
    setDeck(shuffle(cards))
    setIndex(cards.length > 0 ? 0 : null)
  }, [cards])

  const card = index === null ? null : deck[index]

  const drawCard = useCallback(() => {
    setIndex((i) => {
      if (i === null) return null
      return (i + 1) % cards.length
    })
  }, [cards])

  // Reshuffle deck when fully drawn
  useEffect(() => {
    if (index !== 0) return

    setDeck(shuffle(cards))
  }, [index, cards])

  return [card, drawCard] as const
}

// This can't be defined in the component, since it'll change on each render and cause chaos
const empty: string[] = []

const Card = ({
  settings: { cardBack, cardFaces },
  deal,
  flip: flipping,
  className: inputClassName = '',
  initialY,
  onDealEnd,
  onFlipEnd,
}: Props) => {
  const className = `${inputClassName} aspect-auto`

  const [card, drawCard] = useDeck(cardFaces ?? empty)
  const [faceUp, setFaceUp] = useState(false)

  // Reset state on discard
  useEffect(() => {
    if (deal) return

    drawCard()
    setFaceUp(false)
  }, [deal, drawCard])

  return (
    <AnimatePresence>
      {deal && !flipping && !faceUp && (
        <motion.div
          initial={{ y: initialY }}
          variants={{
            deal: { y: '0vh', transition: { duration: 2, ease: 'easeOut' } },
            flip: { scaleX: 0, transition: { ease: 'easeOut' } },
          }}
          animate="deal"
          exit="flip"
          onAnimationComplete={(def) => {
            if (def === 'deal') onDealEnd()
            else if (def === 'flip') setFaceUp(true)
          }}
        >
          <img className={className} src={cardBack ?? undefined} />
        </motion.div>
      )}
      {deal && faceUp && (
        <motion.div
          initial={{ scaleX: 0 }}
          variants={{
            flip: { scaleX: 1, transition: { ease: 'easeIn' } },
            leave: { y: initialY, transition: { duration: 0.75, ease: 'easeOut' } },
          }}
          animate="flip"
          exit="leave"
          onAnimationComplete={(def) => {
            if (def === 'flip') onFlipEnd()
          }}
        >
          <img className={className} src={card ?? undefined} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Card
