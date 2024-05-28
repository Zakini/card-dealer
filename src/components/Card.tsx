import { motion, AnimatePresence, CustomValueType } from 'framer-motion'
import cardBack from '../assets/cards/default/back.svg'
import { useEffect, useState } from 'react'

interface Props {
  className?: string
  initialY: string | number | CustomValueType

  onFlip: (info: { faceUp: boolean }) => void
}

const deck = Object.values(import.meta.glob<string>(
  '../assets/cards/default/faces/*.svg',
  { eager: true, import: 'default' },
))

const usePrevious = <T,>(value: T, initial: T | null = null) => {
  const [current, setCurrent] = useState<T>(value)
  const [previous, setPrevious] = useState<T | null>(initial)

  if (value !== current) {
    setPrevious(current)
    setCurrent(value)
  }

  return previous
}

export default function Card({ className: inputClassName = '', initialY, onFlip }: Props) {
  const className = `${inputClassName} aspect-auto`

  // useState so that the chosen card doesn't change on render
  const [card] = useState(deck[Math.floor(Math.random() * deck.length)])
  const [flipping, setFlipping] = useState(false)
  const [faceUp, setFaceUp] = useState(false)
  const wasFaceUp = usePrevious(faceUp, false)
  const [cardDealt, setCardDealt] = useState(false)

  useEffect(() => {
    if (faceUp === (wasFaceUp)) return

    onFlip({ faceUp })
  }, [faceUp, wasFaceUp, onFlip])

  return (
    <AnimatePresence>
      {/*
        NOTE we use 100vh since the container fills the screen, and 50% since that's the
        height of the card. Update this if either of those changes!
      */}
      {!flipping && !faceUp && (
        <motion.div
          initial={{ y: initialY }}
          variants={{
            deal: { y: '0vh', transition: { duration: 2, ease: 'easeOut' } },
            flip: { scaleX: 0, transition: { ease: 'easeOut' } },
          }}
          animate="deal"
          exit="flip"
          onAnimationComplete={(def) => {
            if (def === 'deal') setCardDealt(true)
            else if (def === 'flip') setFaceUp(true)
          }}
        >
          <img
            className={className}
            src={cardBack}
            onClick={() => {
              if (cardDealt) setFlipping(true)
            }}
          />
        </motion.div>
      )}
      {faceUp && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1, transition: { ease: 'easeIn' } }}
          onAnimationComplete={() => { setCardDealt(true) }}
        >
          <img
            className={className}
            src={card}
            onClick={() => {
              if (cardDealt) setFaceUp(true)
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
