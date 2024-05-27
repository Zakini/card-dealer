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

export default function Card({ className = '', initialY }: Props) {
  // useState so that the chosen card doesn't change on render
  const [card] = useState(deck[Math.floor(Math.random() * deck.length)])
  const [faceUp, setFaceUp] = useState(false)
  const [cardDealt, setCardDealt] = useState(false)

  return (
    <AnimatePresence>
      {/*
        NOTE we use 100vh since the container fills the screen, and 50% since that's the
        height of the card. Update this if either of those changes!
      */}
      <motion.div
        initial={{ y: initialY }}
        animate={{ y: '0vh', transition: { duration: 2, ease: 'easeOut' } }}
        onAnimationComplete={() => { setCardDealt(true) }}
      >
        <img
          className={`${className} aspect-auto`}
          src={faceUp ? card : cardBack}
          onClick={() => {
            if (cardDealt) setFaceUp(true)
          }}
        />
      </motion.div>
    </AnimatePresence>
  )
}
