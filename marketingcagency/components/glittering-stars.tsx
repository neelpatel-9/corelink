"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export default function GlitteringStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const isLightTheme = theme === "light"
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion || !isLightTheme) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Star class
    class Star {
      x: number
      y: number
      size: number
      baseSize: number
      twinkleSpeed: number
      twinkleAmount: number
      phase: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * (canvas.height * 0.6) // Only in top 60% of screen
        this.baseSize = Math.random() * 1.5 + 0.5
        this.size = this.baseSize
        this.twinkleSpeed = Math.random() * 0.05 + 0.01
        this.twinkleAmount = Math.random() * 0.5 + 0.5
        this.phase = Math.random() * Math.PI * 2
        this.color = "rgba(0, 0, 0, 0.8)" // Black color for stars
      }

      update() {
        // Twinkle effect - size and opacity variation
        this.phase += this.twinkleSpeed
        const sizeVariation = Math.sin(this.phase) * this.twinkleAmount
        this.size = Math.max(0.1, this.baseSize + sizeVariation)
      }

      draw() {
        if (!ctx) return

        // Draw star with glow effect
        const opacity = 0.3 + Math.sin(this.phase) * 0.5

        // Glow effect
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, Math.max(0.1, this.size * 2))
        gradient.addColorStop(0, `rgba(0, 0, 0, ${opacity})`)
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Star core
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }
    }

    // Create stars
    const stars: Star[] = []
    const starCount = 300 // Increased number of stars

    for (let i = 0; i < starCount; i++) {
      stars.push(new Star())
    }

    // Animation loop
    const animate = () => {
      // Clear canvas with transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw stars
      for (const star of stars) {
        star.update()
        star.draw()
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [isLightTheme, prefersReducedMotion])

  if (!isLightTheme || prefersReducedMotion) return null

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" style={{ opacity: 0.7 }} />
}
