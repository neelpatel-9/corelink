"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

interface MountainLandscapeBackgroundProps {
  blur?: number
}

const MountainLandscapeBackground: React.FC<MountainLandscapeBackgroundProps> = ({ blur = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const updateCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    // Initial setup
    updateCanvasDimensions()
    window.addEventListener("resize", updateCanvasDimensions)

    // Create images
    const skyImage = new Image()
    skyImage.crossOrigin = "anonymous"
    skyImage.src = "/placeholder.svg?height=1080&width=1920"

    const mountainsImage = new Image()
    mountainsImage.crossOrigin = "anonymous"
    mountainsImage.src = "/placeholder.svg?height=1080&width=1920"

    const treesImage = new Image()
    treesImage.crossOrigin = "anonymous"
    treesImage.src = "/placeholder.svg?height=1080&width=1920"

    const riverImage = new Image()
    riverImage.crossOrigin = "anonymous"
    riverImage.src = "/placeholder.svg?height=1080&width=1920"

    // Bird class
    class Bird {
      x: number
      y: number
      size: number
      speed: number
      wingPosition: number
      wingDirection: number
      wingSpeed: number

      constructor() {
        this.size = Math.random() * 10 + 5
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height * 0.5
        this.speed = Math.random() * 1 + 0.5
        this.wingPosition = 0
        this.wingDirection = 1
        this.wingSpeed = Math.random() * 0.1 + 0.05
      }

      update() {
        this.x += this.speed
        if (this.x > canvas.width + this.size) {
          this.x = -this.size * 2
          this.y = Math.random() * canvas.height * 0.5
        }

        // Wing flapping animation
        this.wingPosition += this.wingSpeed * this.wingDirection
        if (this.wingPosition > 0.5 || this.wingPosition < -0.5) {
          this.wingDirection *= -1
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
        ctx.beginPath()

        // Bird body
        ctx.ellipse(this.x, this.y, this.size, this.size / 2, 0, 0, Math.PI * 2)

        // Wings
        ctx.moveTo(this.x - this.size, this.y)
        ctx.quadraticCurveTo(
          this.x - this.size * 2,
          this.y - this.size * this.wingPosition,
          this.x - this.size * 3,
          this.y,
        )

        ctx.moveTo(this.x + this.size, this.y)
        ctx.quadraticCurveTo(
          this.x + this.size * 2,
          this.y - this.size * this.wingPosition,
          this.x + this.size * 3,
          this.y,
        )

        ctx.fill()
      }
    }

    // River animation variables
    let riverOffset = 0
    const riverSpeed = 0.5

    // Cloud animation variables
    let cloudOffset = 0
    const cloudSpeed = 0.2

    // Sun rays animation variables
    let sunAngle = 0
    const sunSpeed = 0.005

    // Create birds
    const birds: Bird[] = []
    const birdCount = 8
    for (let i = 0; i < birdCount; i++) {
      birds.push(new Bird())
    }

    // Animation function
    const animate = () => {
      if (!ctx || !canvas) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw sky gradient
      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      skyGradient.addColorStop(0, "#4A90E2") // Sky blue at top
      skyGradient.addColorStop(1, "#C4E0F9") // Lighter blue at horizon
      ctx.fillStyle = skyGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw sun
      const sunX = canvas.width * 0.2
      const sunY = canvas.height * 0.2
      const sunRadius = canvas.width * 0.05

      // Sun glow
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 2)
      sunGlow.addColorStop(0, "rgba(255, 255, 255, 1)")
      sunGlow.addColorStop(0.2, "rgba(255, 240, 196, 0.8)")
      sunGlow.addColorStop(1, "rgba(255, 240, 196, 0)")

      ctx.fillStyle = sunGlow
      ctx.beginPath()
      ctx.arc(sunX, sunY, sunRadius * 2, 0, Math.PI * 2)
      ctx.fill()

      // Sun core
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
      ctx.beginPath()
      ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2)
      ctx.fill()

      // Sun rays
      ctx.save()
      ctx.translate(sunX, sunY)
      ctx.rotate(sunAngle)

      for (let i = 0; i < 12; i++) {
        ctx.rotate(Math.PI / 6)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(sunRadius, 0)
        ctx.lineTo(sunRadius * 3, 0)
        ctx.stroke()
      }

      ctx.restore()

      if (!prefersReducedMotion) {
        sunAngle += sunSpeed
      }

      // Draw clouds
      const drawCloud = (x: number, y: number, size: number) => {
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.arc(x + size * 0.5, y - size * 0.4, size * 0.8, 0, Math.PI * 2)
        ctx.arc(x + size * 1.1, y, size * 0.9, 0, Math.PI * 2)
        ctx.arc(x + size * 0.6, y + size * 0.4, size * 0.7, 0, Math.PI * 2)
        ctx.arc(x - size * 0.3, y + size * 0.2, size * 0.6, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw multiple clouds with animation
      const cloudPositions = [
        { x: canvas.width * 0.1, y: canvas.height * 0.15, size: canvas.width * 0.03 },
        { x: canvas.width * 0.3, y: canvas.height * 0.1, size: canvas.width * 0.02 },
        { x: canvas.width * 0.5, y: canvas.height * 0.2, size: canvas.width * 0.025 },
        { x: canvas.width * 0.7, y: canvas.height * 0.15, size: canvas.width * 0.03 },
        { x: canvas.width * 0.9, y: canvas.height * 0.1, size: canvas.width * 0.02 },
      ]

      cloudPositions.forEach((cloud) => {
        if (!prefersReducedMotion) {
          drawCloud(((cloud.x + cloudOffset) % (canvas.width + cloud.size * 4)) - cloud.size * 2, cloud.y, cloud.size)
        } else {
          drawCloud(cloud.x, cloud.y, cloud.size)
        }
      })

      if (!prefersReducedMotion) {
        cloudOffset -= cloudSpeed
      }

      // Draw mountains
      const mountainGradient = ctx.createLinearGradient(0, canvas.height * 0.3, 0, canvas.height * 0.7)
      mountainGradient.addColorStop(0, "#6A8CAF") // Distant mountains (bluish)
      mountainGradient.addColorStop(1, "#2E5E3F") // Closer mountains (greenish)

      ctx.fillStyle = mountainGradient

      // Left mountain
      ctx.beginPath()
      ctx.moveTo(0, canvas.height * 0.7)
      ctx.lineTo(0, canvas.height * 0.4)
      ctx.lineTo(canvas.width * 0.3, canvas.height * 0.3)
      ctx.lineTo(canvas.width * 0.5, canvas.height * 0.7)
      ctx.fill()

      // Right mountain
      ctx.beginPath()
      ctx.moveTo(canvas.width, canvas.height * 0.7)
      ctx.lineTo(canvas.width, canvas.height * 0.4)
      ctx.lineTo(canvas.width * 0.7, canvas.height * 0.25)
      ctx.lineTo(canvas.width * 0.5, canvas.height * 0.7)
      ctx.fill()

      // Center distant mountains
      ctx.fillStyle = "#8AA9C7"
      ctx.beginPath()
      ctx.moveTo(canvas.width * 0.3, canvas.height * 0.7)
      ctx.lineTo(canvas.width * 0.3, canvas.height * 0.45)
      ctx.lineTo(canvas.width * 0.5, canvas.height * 0.4)
      ctx.lineTo(canvas.width * 0.7, canvas.height * 0.45)
      ctx.lineTo(canvas.width * 0.7, canvas.height * 0.7)
      ctx.fill()

      // Draw trees on the sides
      const drawTree = (x: number, y: number, height: number, width: number, color: string) => {
        // Tree trunk
        ctx.fillStyle = "#5D4037"
        ctx.fillRect(x - width * 0.1, y, width * 0.2, height * 0.2)

        // Tree foliage
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.moveTo(x, y - height * 0.8)
        ctx.lineTo(x + width * 0.5, y)
        ctx.lineTo(x - width * 0.5, y)
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(x, y - height)
        ctx.lineTo(x + width * 0.4, y - height * 0.4)
        ctx.lineTo(x - width * 0.4, y - height * 0.4)
        ctx.fill()
      }

      // Draw forest on both sides
      for (let i = 0; i < 30; i++) {
        const x =
          Math.random() < 0.5 ? Math.random() * canvas.width * 0.3 : canvas.width - Math.random() * canvas.width * 0.3
        const y = canvas.height * 0.7 - Math.random() * canvas.height * 0.1
        const height = canvas.height * (0.1 + Math.random() * 0.1)
        const width = height * 0.6
        const color = Math.random() < 0.3 ? "#DAA520" : "#2E5E3F" // Mix of green and yellow trees

        drawTree(x, y, height, width, color)
      }

      // Draw river
      const riverWidth = canvas.width * 0.3
      const riverY = canvas.height * 0.7
      const riverHeight = canvas.height * 0.3

      // River base
      const riverGradient = ctx.createLinearGradient(
        canvas.width / 2 - riverWidth / 2,
        riverY,
        canvas.width / 2 + riverWidth / 2,
        riverY,
      )
      riverGradient.addColorStop(0, "#2874A6")
      riverGradient.addColorStop(0.5, "#5DADE2")
      riverGradient.addColorStop(1, "#2874A6")

      ctx.fillStyle = riverGradient
      ctx.beginPath()
      ctx.moveTo(canvas.width / 2 - riverWidth / 2, riverY)
      ctx.quadraticCurveTo(canvas.width / 2, riverY + riverHeight * 0.5, canvas.width / 2 + riverWidth / 2, riverY)
      ctx.lineTo(canvas.width / 2 + riverWidth / 2, riverY + riverHeight)
      ctx.lineTo(canvas.width / 2 - riverWidth / 2, riverY + riverHeight)
      ctx.closePath()
      ctx.fill()

      // River sparkles
      if (!prefersReducedMotion) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
        for (let i = 0; i < 20; i++) {
          const sparkleX = canvas.width / 2 - riverWidth / 4 + (Math.random() * riverWidth) / 2
          const sparkleY = riverY + Math.random() * riverHeight
          const sparkleSize = Math.random() * 2 + 1

          ctx.beginPath()
          ctx.arc(sparkleX, sparkleY + Math.sin(sparkleX / 10 + riverOffset) * 5, sparkleSize, 0, Math.PI * 2)
          ctx.fill()
        }

        // River flow animation
        riverOffset += riverSpeed
      }

      // Draw grass on riverbanks
      const drawGrass = (x: number, y: number) => {
        const grassHeight = Math.random() * 5 + 3
        const grassWidth = 1
        const grassColor = Math.random() < 0.3 ? "#DAA520" : "#2E7D32" // Mix of green and yellow grass

        ctx.fillStyle = grassColor
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x - grassWidth, y - grassHeight)
        ctx.lineTo(x + grassWidth, y)
        ctx.fill()
      }

      // Left riverbank grass
      for (let i = 0; i < 100; i++) {
        const x = canvas.width / 2 - riverWidth / 2 - Math.random() * 20
        const y = riverY + Math.random() * 20
        drawGrass(x, y)
      }

      // Right riverbank grass
      for (let i = 0; i < 100; i++) {
        const x = canvas.width / 2 + riverWidth / 2 + Math.random() * 20
        const y = riverY + Math.random() * 20
        drawGrass(x, y)
      }

      // Update and draw birds
      if (!prefersReducedMotion) {
        birds.forEach((bird) => {
          bird.update()
          bird.draw(ctx)
        })
      } else {
        // Draw static birds for reduced motion
        birds.forEach((bird) => {
          bird.draw(ctx)
        })
      }

      requestAnimationFrame(animate)
    }

    // Start animation when images are loaded
    Promise.all([
      new Promise((resolve) => {
        skyImage.onload = resolve
      }),
      new Promise((resolve) => {
        mountainsImage.onload = resolve
      }),
      new Promise((resolve) => {
        treesImage.onload = resolve
      }),
      new Promise((resolve) => {
        riverImage.onload = resolve
      }),
    ]).then(() => {
      animate()
    })

    return () => {
      window.removeEventListener("resize", updateCanvasDimensions)
    }
  }, [prefersReducedMotion])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0"
      style={{
        filter: `blur(${blur}px)`,
        WebkitFilter: `blur(${blur}px)`,
      }}
    />
  )
}

export default MountainLandscapeBackground
