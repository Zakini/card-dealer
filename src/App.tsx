import { useState } from 'react'
import Card from './components/Card'
import { motion, AnimatePresence } from 'framer-motion'

function App() {
  const [cardDealt, setCardDealt] = useState(false)

  return (
    // z-0 starts a new stacking context here (I think?)
    <div className="relative z-0 bg-black" onClick={() => { setCardDealt(true) }}>
      <div className="h-screen overflow-hidden z-10 flex items-center justify-center">
        {cardDealt && <Card className="h-1/2" initialY="calc(100vh - 50%)" />}
      </div>

      <AnimatePresence>
        {!cardDealt && (
          <motion.div
            className="absolute inset-0 -z-10 flex items-center justify-center"
            exit={{ opacity: 0, transition: { duration: 1 } }}
          >
            <span className="text-gray-900 text-9xl uppercase font-bold select-none">
              Click to Deal
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
