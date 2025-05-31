"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import type { ButtonProps } from "@/components/ui/button"

interface ButtonWithBurstProps extends ButtonProps {
  children: React.ReactNode
}

export default function ButtonWithBurst({ children, className, ...props }: ButtonWithBurstProps) {
  const [isClicked, setIsClicked] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { theme } = useTheme()
  const isLightTheme = theme === "light"

  // Reset the click state after animation completes
  useEffect(() => {
    if (isClicked) {
      const timer = setTimeout(() => {
        setIsClicked(false)
      }, 700)
      return () => clearTimeout(timer)
    }
  }, [isClicked])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsClicked(true)
    if (props.onClick) {
      props.onClick(e)
    }
  }

  return (
    <div className="relative inline-flex">
      <Button ref={buttonRef} className={className} {...props} onClick={handleClick}>
        {children}
      </Button>

      <AnimatePresence>
        {isClicked && (
          <>
            {/* Burst rays */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`ray-${i}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: 1.5 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute top-1/2 left-1/2 w-1 h-10 origin-center"
                style={{
                  rotate: `${i * 45}deg`,
                  translateX: "-50%",
                  translateY: "-50%",
                  background: isLightTheme
                    ? "linear-gradient(to top, rgba(147, 51, 234, 0), rgba(147, 51, 234, 0.7), rgba(147, 51, 234, 0))"
                    : "linear-gradient(to top, rgba(138, 79, 255, 0), rgba(138, 79, 255, 0.7), rgba(138, 79, 255, 0))",
                }}
              />
            ))}

            {/* Circular pulse */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 0.5, 0], scale: 2 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`absolute inset-0 rounded-full ${isLightTheme ? "bg-purple-400/20" : "bg-cosmic/20"}`}
            />

            {/* Sparkles */}
            {[...Array(6)].map((_, i) => {
              const angle = Math.random() * 360
              const distance = 30 + Math.random() * 40
              const x = Math.cos((angle * Math.PI) / 180) * distance
              const y = Math.sin((angle * Math.PI) / 180) * distance
              const size = 3 + Math.random() * 4

              return (
                <motion.div
                  key={`sparkle-${i}`}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    x,
                    y,
                    scale: [0, 1, 0],
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`absolute top-1/2 left-1/2 rounded-full ${
                    isLightTheme ? "bg-purple-500" : "bg-cosmic-light"
                  }`}
                  style={{
                    width: size,
                    height: size,
                    translateX: "-50%",
                    translateY: "-50%",
                  }}
                />
              )
            })}
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
