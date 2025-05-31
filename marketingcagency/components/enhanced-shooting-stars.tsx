"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export default function EnhancedShootingStars() {
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

    // Shooting star class
    class ShootingStar {
      x: number
      y: number
      length: number
      speed: number
      angle: number
      width: number
      trail: Array<{ x: number; y: number; alpha: number }>
      color: string
      active: boolean

      constructor() {
        // Start from top half of screen
        this.x = Math.random() * canvas.width
        this.y = Math.random() * (canvas.height * 0.6)
        this.length = Math.random() * 150 + 100
        this.speed = Math.random() * 10 + 5
        this.angle = Math.PI / 4 + (Math.random() * Math.PI) / 4 // Angle between 45-90 degrees
        this.width = Math.random() * 2 + 1
        this.trail = []
        this.color = "rgba(0, 0, 0, 0.8)" // Black color for stars
        this.active = true
      }

      update() {
        // Move shooting star
        this.x += Math.cos(this.angle) * this.speed
        this.y += Math.sin(this.angle) * this.speed

        // Add current position to trail
        this.trail.push({
          x: this.x,
          y: this.y,
          alpha: 1,
        })

        // Fade out trail
        for (let i = 0; i < this.trail.length; i++) {
          this.trail[i].alpha -= 0.02
          if (this.trail[i].alpha <= 0) {
            this.trail.splice(i, 1)
            i--
          }
        }

        // Check if shooting star is out of bounds
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height || this.trail.length === 0) {
          this.active = false
        }
      }

      draw() {
        if (!ctx) return

        // Draw trail
        for (let i = 0; i < this.trail.length; i++) {
          const point = this.trail[i]
          ctx.beginPath()
          ctx.arc(point.x, point.y, this.width, 0, Math.PI * 2)
          ctx.fillStyle = this.color.replace("0.8", `${point.alpha}`)
          ctx.fill()
        }
      }
    }

    const shootingStars: ShootingStar[] = []
    const maxShootingStars = 3 // Maximum number of simultaneous shooting stars

    // Animation loop
    const animate = () => {
      // Clear canvas with transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw shooting stars
      for (let i = 0; i < shootingStars.length; i++) {
        shootingStars[i].update()
        shootingStars[i].draw()

        // Remove inactive shooting stars
        if (!shootingStars[i].active) {
          shootingStars.splice(i, 1)
          i--
        }
      }

      // Add new shooting star randomly
      if (shootingStars.length < maxShootingStars && Math.random() < 0.01) {
        shootingStars.push(new ShootingStar())
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [isLightTheme, prefersReducedMotion])

  if (!isLightTheme || prefersReducedMotion) return null

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" style={{ opacity: 0.8 }} />
}
