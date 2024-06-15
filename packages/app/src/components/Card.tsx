import { motion, AnimatePresence, CustomValueType } from 'framer-motion'
import cardBack from '../assets/cards/default/back.svg'
import { useEffect, useState } from 'react'

interface Props {
  deal: boolean
  flip: boolean
  className?: string
  initialY: string | number | CustomValueType

  onDealEnd: () => void
  onFlipEnd: () => void
}

const deck = Object.values(import.meta.glob<string>(
  '../assets/cards/default/faces/*.svg',
  { eager: true, import: 'default' },
))

const drawCard = () => deck[Math.floor(Math.random() * deck.length)]

export default function Card({
  deal,
  flip: flipping,
  className: inputClassName = '',
  initialY,
  onDealEnd,
  onFlipEnd,
}: Props) {
  const className = `${inputClassName} aspect-auto`

  const [card, setCard] = useState(drawCard())
  const [faceUp, setFaceUp] = useState(false)

  // Reset state on discard
  useEffect(() => {
    if (deal) return

    setCard(drawCard())
    setFaceUp(false)
  }, [deal])

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
          <img className={className} src={cardBack} />
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
          <img className={className} src={card} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
