"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export default function LightEffects() {
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

    // Light spot class
    class LightSpot {
      x: number
      y: number
      radius: number
      maxRadius: number
      growSpeed: number
      alpha: number
      color: string
      growing: boolean

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.maxRadius = Math.random() * 150 + 50
        this.radius = Math.random() * this.maxRadius
        this.growSpeed = Math.random() * 0.2 + 0.1
        this.alpha = Math.random() * 0.05 + 0.02
        this.growing = Math.random() > 0.5

        // Colors that match the website theme
        const colors = [
          "rgba(147, 51, 234, alpha)", // Purple
          "rgba(79, 70, 229, alpha)", // Indigo
          "rgba(59, 130, 246, alpha)", // Blue
        ]

        this.color = colors[Math.floor(Math.random() * colors.length)].replace("alpha", this.alpha.toString())
      }

      update() {
        if (this.growing) {
          this.radius += this.growSpeed
          if (this.radius >= this.maxRadius) {
            this.growing = false
          }
        } else {
          this.radius -= this.growSpeed
          if (this.radius <= 0) {
            this.radius = 0 // Ensure radius never goes below 0
            this.growing = true
            this.x = Math.random() * canvas.width
            this.y = Math.random() * canvas.height
          }
        }
      }

      draw() {
        if (!ctx) return

        // Ensure radius is at least 0.1 to avoid the "r1 provided is less than 0" error
        const safeRadius = Math.max(0.1, this.radius)

        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, safeRadius)

        gradient.addColorStop(0, this.color)
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

        ctx.beginPath()
        ctx.arc(this.x, this.y, safeRadius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }
    }

    // Create light spots
    const lightSpots: LightSpot[] = []
    const spotCount = 10 // Not too many to avoid performance issues

    for (let i = 0; i < spotCount; i++) {
      lightSpots.push(new LightSpot())
    }

    // Animation loop
    const animate = () => {
      // Clear canvas with transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw light spots
      for (const spot of lightSpots) {
        spot.update()
        spot.draw()
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
