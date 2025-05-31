"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { useTheme } from "next-themes"

interface CelebrationAnimationProps {
  isVisible: boolean
  onComplete?: () => void
}

export default function CelebrationAnimation({ isVisible, onComplete }: CelebrationAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const { theme } = useTheme()
  const isLightTheme = theme === "light"

  useEffect(() => {
    if (isVisible && !isAnimating) {
      setIsAnimating(true)

      // Trigger confetti
      const duration = 3000
      const end = Date.now() + duration

      const colors = isLightTheme
        ? ["#9333ea", "#a855f7", "#c084fc", "#38bdf8", "#0ea5e9"]
        : ["#8A4FFF", "#A67DFF", "#6B3AD1", "#00CFFD", "#38bdf8"]

      // First burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors,
        disableForReducedMotion: true,
      })

      // Continuous confetti
      const interval = setInterval(() => {
        if (Date.now() > end) {
          clearInterval(interval)
          setTimeout(() => {
            setIsAnimating(false)
            if (onComplete) onComplete()
          }, 1000)
          return
        }

        confetti({
          particleCount: 50,
          angle: Math.random() * 60 + 60,
          spread: 80,
          origin: { x: Math.random(), y: Math.random() - 0.2 },
          colors,
          disableForReducedMotion: true,
        })

        confetti({
          particleCount: 50,
          angle: Math.random() * 60 + 240,
          spread: 80,
          origin: { x: Math.random(), y: Math.random() - 0.2 },
          colors,
          disableForReducedMotion: true,
        })
      }, 250)

      return () => clearInterval(interval)
    }
  }, [isVisible, isAnimating, isLightTheme, onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="relative"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{
              scale: [0.5, 1.2, 1],
              opacity: [0, 1, 1],
            }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{
              duration: 0.8,
              times: [0, 0.6, 1],
            }}
          >
            <div
              className={`text-center p-8 rounded-full ${
                isLightTheme
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                  : "bg-gradient-to-r from-cosmic to-[#00CFFD] text-white"
              }`}
            >
              <motion.div
                initial={{ rotate: 0, scale: 1 }}
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 0.9, 1],
                }}
                transition={{
                  duration: 0.6,
                  repeat: 2,
                  ease: "easeInOut",
                }}
                className="text-5xl md:text-7xl font-bold"
              >
                🎉
              </motion.div>
              <motion.h2
                className="text-2xl md:text-4xl font-bold mt-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Thank You!
              </motion.h2>
              <motion.p
                className="text-lg md:text-xl mt-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                We'll contact you soon!
              </motion.p>
            </div>

            {/* Animated rings */}
            <motion.div
              className={`absolute inset-0 rounded-full ${
                isLightTheme ? "border-purple-500" : "border-cosmic"
              } border-4`}
              initial={{ scale: 1, opacity: 1 }}
              animate={{
                scale: [1, 1.5, 2],
                opacity: [1, 0.5, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: 2,
                repeatType: "loop",
              }}
            />

            {/* Animated stars */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-4 h-4 rounded-full ${isLightTheme ? "bg-yellow-400" : "bg-yellow-300"}`}
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  x: Math.cos((i * Math.PI) / 4) * 150,
                  y: Math.sin((i * Math.PI) / 4) * 150,
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  repeat: 1,
                  repeatDelay: 1,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
