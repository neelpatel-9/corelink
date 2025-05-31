"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  // After mounting, we can safely show the toggle
  useEffect(() => {
    setMounted(true)

    // Function to handle scroll events
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Show toggle when at top of page
      if (currentScrollY < 100) {
        setIsVisible(true)
      }
      // Hide when scrolling down, show when scrolling up
      else {
        if (currentScrollY > lastScrollY) {
          setIsVisible(false) // Scrolling down
        } else {
          setIsVisible(true) // Scrolling up
        }
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [lastScrollY])

  if (!mounted) {
    return null
  }

  const isLight = theme === "light"

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : -20,
      }}
      transition={{ duration: 0.3 }}
      className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
    >
      <motion.div
        className={`relative h-12 w-28 rounded-full p-1 shadow-lg ${
          isLight
            ? "bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 border border-blue-200"
            : "bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 border border-indigo-700"
        }`}
      >
        {/* Track */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          {/* Sky/Space Background */}
          <div className={`absolute inset-0 transition-opacity duration-500 ${isLight ? "opacity-100" : "opacity-0"}`}>
            {/* Day sky gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-300 to-blue-100"></div>
            {/* Sun rays */}
            <div className="absolute inset-0 opacity-40">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 h-10 w-[1px] bg-yellow-300 origin-bottom"
                  style={{
                    transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
                  }}
                ></div>
              ))}
            </div>
          </div>

          <div className={`absolute inset-0 transition-opacity duration-500 ${isLight ? "opacity-0" : "opacity-100"}`}>
            {/* Night sky gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 to-purple-900"></div>

            {/* Stars */}
            {[...Array(20)].map((_, i) => {
              const size = Math.random() * 2 + 0.5
              return (
                <div
                  key={i}
                  className="absolute bg-white rounded-full"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.7 + 0.3,
                  }}
                ></div>
              )
            })}
          </div>
        </div>

        {/* Slider thumb */}
        <motion.button
          layout
          initial={false}
          animate={{
            x: isLight ? 0 : 56,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
          onClick={() => setTheme(isLight ? "dark" : "light")}
          className={`relative flex items-center justify-center h-10 w-10 rounded-full focus:outline-none ${
            isLight
              ? "bg-gradient-to-r from-yellow-400 to-yellow-300"
              : "bg-gradient-to-r from-indigo-400 to-purple-500"
          }`}
          aria-label="Toggle theme"
        >
          <span className="sr-only">Toggle theme</span>

          {/* Sun/Moon Icon with transition */}
          <div className="relative w-full h-full">
            {/* Sun */}
            <motion.div
              animate={{
                opacity: isLight ? 1 : 0,
                scale: isLight ? 1 : 0.5,
                rotate: isLight ? 0 : 180,
              }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Sun className="h-6 w-6 text-yellow-800" />
            </motion.div>

            {/* Moon */}
            <motion.div
              animate={{
                opacity: isLight ? 0 : 1,
                scale: isLight ? 0.5 : 1,
                rotate: isLight ? -180 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Moon className="h-6 w-6 text-white" />
            </motion.div>
          </div>
        </motion.button>

        {/* Labels */}
        <div className="absolute -bottom-6 left-0 right-0 text-center">
          <span className={`text-xs font-medium ${isLight ? "text-gray-800" : "text-white"}`}>
            {isLight ? "Light Mode" : "Dark Mode"}
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}
