"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export default function FloatingShapes() {
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

    // Shape class
    class Shape {
      x: number
      y: number
      size: number
      type: "circle" | "square" | "triangle"
      rotation: number
      rotationSpeed: number
      speedX: number
      speedY: number
      color: string
      alpha: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 40 + 20
        this.type = ["circle", "square", "triangle"][Math.floor(Math.random() * 3)] as "circle" | "square" | "triangle"
        this.rotation = Math.random() * Math.PI * 2
        this.rotationSpeed = Math.random() * 0.002 - 0.001
        this.speedX = Math.random() * 0.2 - 0.1
        this.speedY = Math.random() * 0.2 - 0.1
        this.alpha = Math.random() * 0.05 + 0.02

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
        this.rotation += this.rotationSpeed

        // Wrap around edges
        if (this.x < -this.size) this.x = canvas.width + this.size
        if (this.x > canvas.width + this.size) this.x = -this.size
        if (this.y < -this.size) this.y = canvas.height + this.size
        if (this.y > canvas.height + this.size) this.y = -this.size
      }

      draw() {
        if (!ctx) return

        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)
        ctx.fillStyle = this.color

        if (this.type === "circle") {
          ctx.beginPath()
          ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2)
          ctx.fill()
        } else if (this.type === "square") {
          ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size)
        } else if (this.type === "triangle") {
          ctx.beginPath()
          ctx.moveTo(0, -this.size / 2)
          ctx.lineTo(-this.size / 2, this.size / 2)
          ctx.lineTo(this.size / 2, this.size / 2)
          ctx.closePath()
          ctx.fill()
        }

        ctx.restore()
      }
    }

    // Create shapes
    const shapes: Shape[] = []
    const shapeCount = 15 // Not too many to avoid performance issues

    for (let i = 0; i < shapeCount; i++) {
      shapes.push(new Shape())
    }

    // Animation loop
    const animate = () => {
      // Clear canvas with transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw shapes
      for (const shape of shapes) {
        shape.update()
        shape.draw()
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
