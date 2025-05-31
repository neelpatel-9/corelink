"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useTheme } from "next-themes"

interface FloatingElement {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  blur: number
  rotation: number
  duration: number
  delay: number
  type: "circle" | "square" | "triangle" | "dot"
}

interface LightRay {
  id: number
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
  delay: number
}

export default function SparklingStarsBackground() {
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([])
  const [lightRays, setLightRays] = useState<LightRay[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const { theme } = useTheme()
  const isLightTheme = theme === "light"

  const { scrollY } = useScroll()
  const parallax1 = useTransform(scrollY, [0, 1000], [0, -50])
  const parallax2 = useTransform(scrollY, [0, 1000], [0, -30])
  const parallax3 = useTransform(scrollY, [0, 1000], [0, -15])

  // Generate floating elements
  const generateFloatingElements = useMemo(
    () => (count: number) => {
      return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100, // % of container width
        y: Math.random() * 100, // % of container height
        size: Math.random() * 60 + 20, // Size between 20-80px
        opacity: Math.random() * 0.15 + 0.05, // Low opacity
        blur: Math.random() * 20 + 10, // Blur between 10-30px
        rotation: Math.random() * 360, // Random rotation
        duration: Math.random() * 20 + 30, // Duration of animation
        delay: Math.random() * 10, // Random delay
        type: ["circle", "square", "triangle", "dot"][Math.floor(Math.random() * 4)] as
          | "circle"
          | "square"
          | "triangle"
          | "dot",
      }))
    },
    [],
  )

  // Generate light rays
  const generateLightRays = useMemo(
    () => (count: number) => {
      return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100, // % of container width
        y: Math.random() * 50, // % of container height (top half)
        width: Math.random() * 1 + 0.5, // Width between 0.5-1.5%
        height: Math.random() * 30 + 20, // Height between 20-50%
        rotation: Math.random() * 60 - 30, // Rotation between -30 and 30 degrees
        opacity: Math.random() * 0.1 + 0.05, // Low opacity
        delay: Math.random() * 5, // Random delay
      }))
    },
    [],
  )

  // Initialize elements
  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion) return

    // Generate elements - fewer for better performance
    const elementCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 50000), 15)
    setFloatingElements(generateFloatingElements(elementCount))

    // Generate light rays
    setLightRays(generateLightRays(8))

    // Clean up function
    return () => {
      setFloatingElements([])
      setLightRays([])
    }
  }, [generateFloatingElements, generateLightRays, prefersReducedMotion])

  // Light theme background
  if (isLightTheme) {
    return (
      <div
        ref={containerRef}
        className="fixed inset-0 z-[-1] overflow-hidden will-change-transform"
        style={{
          willChange: "transform",
          transform: "translateZ(0)",
          height: "100vh",
          width: "100vw",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      >
        {/* White gradient background */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white"
          style={{
            backgroundSize: "100% 100%",
          }}
        />

        {/* Subtle color overlay */}
        <div className="absolute inset-0 opacity-5 bg-gradient-to-tr from-purple-200 via-transparent to-blue-100" />

        {/* Light rays */}
        {!prefersReducedMotion &&
          lightRays.map((ray) => (
            <motion.div
              key={`ray-${ray.id}`}
              className="absolute origin-top"
              style={{
                left: `${ray.x}%`,
                top: 0,
                width: `${ray.width}%`,
                height: `${ray.height}%`,
                background: `linear-gradient(to bottom, rgba(147, 51, 234, ${ray.opacity}), transparent)`,
                transform: `rotate(${ray.rotation}deg)`,
                transformOrigin: "top center",
                opacity: 0,
              }}
              animate={{
                opacity: [0, ray.opacity, 0],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: ray.delay,
                repeatDelay: Math.random() * 5 + 5,
              }}
            />
          ))}

        {/* Floating elements */}
        {!prefersReducedMotion &&
          floatingElements.map((element) => {
            // Different shapes based on type
            let shape
            if (element.type === "circle") {
              shape = "rounded-full"
            } else if (element.type === "square") {
              shape = "rounded-lg"
            } else if (element.type === "triangle") {
              // Triangle is a bit special, we'll use a pseudo-element for it
              shape = "triangle"
            } else {
              shape = "rounded-full" // Dot is just a small circle
            }

            // Different colors based on position
            let bgColor
            if (element.y < 33) {
              bgColor = "bg-purple-500" // Top section
            } else if (element.y < 66) {
              bgColor = "bg-blue-500" // Middle section
            } else {
              bgColor = "bg-indigo-500" // Bottom section
            }

            return (
              <motion.div
                key={`element-${element.id}`}
                className={`absolute ${element.type !== "triangle" ? shape : ""} ${bgColor}`}
                style={{
                  left: `${element.x}%`,
                  top: `${element.y}%`,
                  width: element.type === "dot" ? element.size / 4 : element.size,
                  height: element.type === "dot" ? element.size / 4 : element.size,
                  opacity: element.opacity,
                  filter: `blur(${element.blur}px)`,
                  transform: `rotate(${element.rotation}deg)`,
                  clipPath: element.type === "triangle" ? "polygon(50% 0%, 0% 100%, 100% 100%)" : "none",
                }}
                animate={{
                  x: [0, Math.random() * 50 - 25],
                  y: [0, Math.random() * 50 - 25],
                  rotate: [element.rotation, element.rotation + (Math.random() * 40 - 20)],
                }}
                transition={{
                  duration: element.duration,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  repeatType: "reverse",
                  delay: element.delay,
                }}
              />
            )
          })}

        {/* Subtle particles */}
        {!prefersReducedMotion &&
          Array.from({ length: 50 }).map((_, i) => {
            const size = 0.5 + Math.random() * 1
            const x = Math.random() * 100
            const y = Math.random() * 100
            const delay = Math.random() * 10
            const duration = 15 + Math.random() * 25

            // Subtle colors
            const colorTypes = [
              `rgba(147, 51, 234, ${0.05 + Math.random() * 0.1})`, // Purple
              `rgba(59, 130, 246, ${0.05 + Math.random() * 0.1})`, // Blue
              `rgba(99, 102, 241, ${0.05 + Math.random() * 0.1})`, // Indigo
            ]

            const color = colorTypes[Math.floor(Math.random() * colorTypes.length)]

            return (
              <motion.div
                key={`particle-${i}`}
                className="absolute rounded-full"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: size,
                  height: size,
                  background: color,
                }}
                animate={{
                  x: [0, Math.random() * 30 - 15],
                  y: [0, Math.random() * 30 - 15],
                  opacity: [0, 0.2 + Math.random() * 0.3, 0],
                }}
                transition={{
                  duration: duration,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: delay,
                }}
              />
            )
          })}

        {/* Gradient orbs */}
        {!prefersReducedMotion &&
          Array.from({ length: 5 }).map((_, i) => {
            const size = 150 + Math.random() * 100
            const x = Math.random() * 100
            const y = Math.random() * 100
            const delay = Math.random() * 5

            return (
              <motion.div
                key={`orb-${i}`}
                className="absolute rounded-full"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: size,
                  height: size,
                  background: "radial-gradient(circle, rgba(147, 51, 234, 0.05) 0%, rgba(147, 51, 234, 0) 70%)",
                  filter: "blur(20px)",
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 10 + Math.random() * 10,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: delay,
                }}
              />
            )
          })}

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #9333ea 1px, transparent 1px), 
                             linear-gradient(to bottom, #9333ea 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />

        {/* Radial gradient for vignette effect */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: "radial-gradient(circle at center, transparent 50%, rgba(0, 0, 0, 0.1) 100%)",
          }}
        />
      </div>
    )
  }

  // Night theme background (original)
  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 bg-gradient-to-b from-[#0a0a1a] via-[#0f102d] to-[#0a0a1a] overflow-hidden will-change-transform"
      style={{ transform: "translateZ(0)" }}
    >
      {/* Stars - only render if not preferring reduced motion */}
      {!prefersReducedMotion &&
        Array.from({ length: 100 }).map((_, i) => {
          const size = Math.random() * 1.5 + 0.5
          const x = Math.random() * 100
          const y = Math.random() * 100
          const delay = Math.random() * 5
          const duration = Math.random() * 2 + 1

          return (
            <div
              key={`star-${i}`}
              className="absolute rounded-full bg-white will-change-transform"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: size,
                height: size,
                opacity: 0,
                animation: `starTwinkle ${duration}s ease-in-out ${delay}s infinite alternate`,
                transform: "translateZ(0)",
              }}
            />
          )
        })}

      {/* Simplified nebula effects - fewer and less intensive */}
      {!prefersReducedMotion &&
        Array.from({ length: 2 }).map((_, i) => {
          const size = Math.random() * 20 + 15
          const x = Math.random() * 100
          const y = Math.random() * 100
          const colors = [
            "rgba(138, 79, 255, 0.03)", // Purple (reduced opacity)
            "rgba(0, 207, 253, 0.03)", // Cyan (reduced opacity)
          ]

          return (
            <div
              key={`nebula-${i}`}
              className="absolute rounded-full blur-3xl will-change-transform"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${size}%`,
                height: `${size}%`,
                background: colors[i % colors.length],
                opacity: 0,
                animation: `nebulaGlow 15s ease-in-out ${i * 5}s infinite alternate`,
                transform: "translateZ(0)",
              }}
            />
          )
        })}
    </div>
  )
}
