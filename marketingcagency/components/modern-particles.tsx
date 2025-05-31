"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export default function ModernParticles() {
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

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      alpha: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = Math.random() * 0.5 - 0.25
        this.speedY = Math.random() * 0.5 - 0.25
        this.alpha = Math.random() * 0.3 + 0.1

        // Colors that match the website theme
        const colors = [
          "rgba(147, 51, 234, alpha)", // Purple
          "rgba(79, 70, 229, alpha)", // Indigo
          "rgba(59, 130, 246, alpha)", // Blue
        ]

        this.color = colors[Math.floor(Math.random() * colors.length)].replace("alpha", this.alpha.toString())
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) {
          this.speedX = -this.speedX
        }

        if (this.y < 0 || this.y > canvas.height) {
          this.speedY = -this.speedY
        }
      }

      draw() {
        if (!ctx) return

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }
    }

    // Create particles
    const particles: Particle[] = []
    const particleCount = 100 // Moderate number of particles

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Connect particles with lines if they're close enough
    function connectParticles() {
      if (!ctx) return

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            // Connect if within 100px
            ctx.beginPath()
            ctx.strokeStyle = `rgba(147, 51, 234, ${0.05 * (1 - distance / 100)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    // Animation loop
    const animate = () => {
      // Clear canvas with transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      for (const particle of particles) {
        particle.update()
        particle.draw()
      }

      // Connect particles
      connectParticles()

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [isLightTheme, prefersReducedMotion])

  if (!isLightTheme || prefersReducedMotion) return null

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" style={{ opacity: 0.6 }} />
}
