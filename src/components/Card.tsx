import { motion, AnimatePresence, CustomValueType } from 'framer-motion'
import cardBack from '../assets/cards/default/back.svg'
import { useState } from 'react'

interface Props {
  className?: string
  initialY: string | number | CustomValueType
}

const deck = Object.values(import.meta.glob<string>(
  '../assets/cards/default/faces/*.svg',
  { eager: true, import: 'default' },
))

export default function Card({ className: inputClassName = '', initialY }: Props) {
  const className = `${inputClassName} aspect-auto`

  // useState so that the chosen card doesn't change on render
  const [card] = useState(deck[Math.floor(Math.random() * deck.length)])
  const [flipping, setFlipping] = useState(false)
  const [faceUp, setFaceUp] = useState(false)
  const [cardDealt, setCardDealt] = useState(false)

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
