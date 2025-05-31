"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const prefersReducedMotion = useReducedMotion()
  const isLightTheme = theme === "light"

  useEffect(() => {
    if (prefersReducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    // Performance optimization - use a separate canvas for stars and shooting stars
    // This allows us to redraw only what's necessary each frame
    const starsCanvas = document.createElement("canvas")
    const starsCtx = starsCanvas.getContext("2d", { alpha: true })
    if (!starsCtx) return

    // Flag to indicate when stars need to be redrawn - declare before using in resizeCanvas
    let needsStarsRedraw = true

    // Set canvas to full screen with device pixel ratio for sharper rendering
    const pixelRatio = window.devicePixelRatio || 1
    const resizeCanvas = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      // Main canvas
      canvas.width = width * pixelRatio
      canvas.height = height * pixelRatio
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.scale(pixelRatio, pixelRatio)

      // Stars canvas
      starsCanvas.width = width * pixelRatio
      starsCanvas.height = height * pixelRatio
      starsCtx.scale(pixelRatio, pixelRatio)

      // Force redraw of stars when resizing
      needsStarsRedraw = true
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Star class with staggered twinkling and subtle color variations
    class Star {
      x: number
      y: number
      size: number
      baseSize: number
      twinkleSpeed: number
      twinkleAmount: number
      phase: number
      baseColor: string
      opacity: number
      delay: number
      active: boolean
      fadeState: "in" | "visible" | "out" | "hidden"
      fadeProgress: number
      fadeSpeed: number
      visibleDuration: number
      hiddenDuration: number
      colorVariation: number

      constructor(index: number, total: number) {
        this.x = Math.random() * window.innerWidth
        this.y = Math.random() * window.innerHeight

        // Slightly larger stars in day mode for better visibility
        // But still keep them small for realism
        this.baseSize = isLightTheme
          ? Math.random() * 0.7 + 0.3 // Increased size in day mode
          : Math.random() * 0.7 + 0.2
        this.size = this.baseSize

        this.twinkleSpeed = Math.random() * 0.03 + 0.01
        this.twinkleAmount = Math.random() * 0.2 + 0.1
        this.phase = Math.random() * Math.PI * 2

        // Higher base opacity in day mode for better visibility
        this.opacity = isLightTheme
          ? Math.random() * 0.4 + 0.4 // Increased opacity in day mode
          : Math.random() * 0.4 + 0.4

        // Set base color with slight variations
        const colorValue = isLightTheme ? "0, 0, 0" : "255, 255, 255"
        this.baseColor = colorValue

        // Add subtle color variation
        this.colorVariation = Math.random() * 0.1 - 0.05 // -0.05 to +0.05

        // Staggered appearance
        // Create groups of stars that twinkle together
        const groupSize = 25 // Number of stars in each group
        const groupIndex = Math.floor(index / groupSize)
        const totalGroups = Math.ceil(total / groupSize)

        // Delay based on group
        this.delay = (groupIndex / totalGroups) * 10 // Spread groups over 10 seconds

        // Fade states
        this.active = false
        this.fadeState = "hidden"
        this.fadeProgress = 0
        this.fadeSpeed = Math.random() * 0.01 + 0.005 // How fast the star fades in/out
        this.visibleDuration = Math.random() * 3 + 2 // How long the star stays visible (2-5 seconds)
        this.hiddenDuration = Math.random() * 2 + 1 // How long the star stays hidden (1-3 seconds)

        // Randomize initial state
        if (Math.random() > 0.5) {
          // Increased initial visibility probability
          this.fadeState = "visible"
          this.fadeProgress = 1
          this.active = true
        }
      }

      update(time: number) {
        // Only start after delay
        if (time < this.delay) return

        // Handle fade states
        switch (this.fadeState) {
          case "hidden":
            this.fadeProgress += this.fadeSpeed
            if (this.fadeProgress >= this.hiddenDuration) {
              this.fadeProgress = 0
              this.fadeState = "in"
            }
            break

          case "in":
            this.fadeProgress += this.fadeSpeed
            if (this.fadeProgress >= 1) {
              this.fadeProgress = 0
              this.fadeState = "visible"
              this.active = true
            }
            break

          case "visible":
            this.fadeProgress += this.fadeSpeed
            if (this.fadeProgress >= this.visibleDuration) {
              this.fadeProgress = 0
              this.fadeState = "out"
            }
            // Twinkle effect while visible
            this.phase += this.twinkleSpeed
            const sizeVariation = Math.sin(this.phase) * this.twinkleAmount
            this.size = Math.max(0.05, this.baseSize + sizeVariation)
            break

          case "out":
            this.fadeProgress += this.fadeSpeed
            if (this.fadeProgress >= 1) {
              this.fadeProgress = 0
              this.fadeState = "hidden"
              this.active = false
            }
            break
        }

        // Any state change means we need to redraw the stars
        needsStarsRedraw = true
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (!this.active) return

        // Calculate current opacity based on fade state
        let currentOpacity = this.opacity

        if (this.fadeState === "in") {
          currentOpacity *= this.fadeProgress
        } else if (this.fadeState === "out") {
          currentOpacity *= 1 - this.fadeProgress
        } else if (this.fadeState === "hidden") {
          return // Don't draw if hidden
        }

        // Additional twinkle effect on opacity
        currentOpacity *= 0.7 + Math.sin(this.phase) * 0.3

        // Apply subtle color variation
        const colorBase = this.baseColor.split(",").map(Number)
        const r = Math.max(0, Math.min(255, colorBase[0] + colorBase[0] * this.colorVariation))
        const g = Math.max(0, Math.min(255, colorBase[1] + colorBase[1] * this.colorVariation))
        const b = Math.max(0, Math.min(255, colorBase[2] + colorBase[2] * this.colorVariation))

        const colorValue = `${r}, ${g}, ${b}`

        // Subtle glow effect
        const glowSize = isLightTheme ? 2 : 2.5 // Increased glow in day mode
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          Math.max(0.05, this.size * glowSize),
        )
        gradient.addColorStop(0, `rgba(${colorValue}, ${currentOpacity})`)
        gradient.addColorStop(1, `rgba(${colorValue}, 0)`)

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size * glowSize, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Star core
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${colorValue}, ${currentOpacity})`
        ctx.fill()
      }
    }

    // Enhanced shooting star class for more realism and smoother animation
    class ShootingStar {
      x: number
      y: number
      length: number
      speed: number
      angle: number
      active: boolean
      trail: Array<{ x: number; y: number; alpha: number; width: number }>
      maxTrail: number
      headSize: number
      baseColor: string
      colorVariation: number
      acceleration: number
      currentSpeed: number
      tailFadeSpeed: number
      flickerRate: number
      flickerAmount: number
      flickerPhase: number

      constructor() {
        // More realistic diagonal angle (20-70 degrees for more variation)
        this.angle = (Math.random() * Math.PI) / 3 + Math.PI / 9

        // Start position - more varied
        this.x = Math.random() * window.innerWidth * 0.8
        this.y = Math.random() * (window.innerHeight / 4) // Start in top quarter

        // Length and speed
        this.length = Math.random() * 120 + 100
        this.speed = Math.random() * 3 + 6 // Start faster for smoother appearance
        this.currentSpeed = this.speed
        this.acceleration = Math.random() * 0.15 + 0.08 // Increased acceleration

        this.active = true
        this.trail = []
        this.maxTrail = 30 // Longer trail for more realism
        this.headSize = Math.random() * 1.8 + 1.0 // Larger head

        // Set base color with subtle variations
        const colorBase = isLightTheme ? [0, 0, 0] : [255, 255, 255]
        this.baseColor = colorBase.join(", ")
        this.colorVariation = Math.random() * 0.1 - 0.05 // -0.05 to +0.05

        // How quickly the tail fades
        this.tailFadeSpeed = Math.random() * 0.05 + 0.1

        // Add subtle flickering effect
        this.flickerRate = Math.random() * 0.2 + 0.1
        this.flickerAmount = Math.random() * 0.2 + 0.1
        this.flickerPhase = Math.random() * Math.PI * 2
      }

      update() {
        // Accelerate as it falls
        this.currentSpeed += this.acceleration

        // Move shooting star
        this.x += Math.cos(this.angle) * this.currentSpeed
        this.y += Math.sin(this.angle) * this.currentSpeed

        // Update flicker
        this.flickerPhase += this.flickerRate
        const flicker = 1 + Math.sin(this.flickerPhase) * this.flickerAmount

        // Add current position to trail with current width
        this.trail.unshift({
          x: this.x,
          y: this.y,
          alpha: 1 * flicker, // Apply flicker to alpha
          width: this.headSize * (0.8 + Math.random() * 0.4) * flicker, // Apply flicker to width
        })

        // Limit trail length
        if (this.trail.length > this.maxTrail) {
          this.trail.pop()
        }

        // Fade trail with non-linear fading for more realism
        for (let i = 0; i < this.trail.length; i++) {
          // Non-linear fading - faster at the end
          const fadePosition = i / this.maxTrail
          this.trail[i].alpha = Math.max(0, 1 - Math.pow(fadePosition, 0.6) - this.tailFadeSpeed * i)

          // Trail gets thinner toward the end
          if (i > 0) {
            this.trail[i].width *= 0.97
          }
        }

        // Check if shooting star is out of bounds
        if (this.x < 0 || this.x > window.innerWidth || this.y < 0 || this.y > window.innerHeight) {
          this.active = false
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        // Apply subtle color variation
        const colorBase = this.baseColor.split(",").map(Number)
        const r = Math.max(0, Math.min(255, colorBase[0] + colorBase[0] * this.colorVariation))
        const g = Math.max(0, Math.min(255, colorBase[1] + colorBase[1] * this.colorVariation))
        const b = Math.max(0, Math.min(255, colorBase[2] + colorBase[2] * this.colorVariation))

        const colorValue = `${r}, ${g}, ${b}`

        // Draw trail with smoother gradient
        for (let i = 0; i < this.trail.length - 1; i++) {
          const point = this.trail[i]
          const nextPoint = this.trail[i + 1]

          // Skip if next point doesn't exist
          if (!nextPoint) continue

          // Skip drawing segments with very low alpha (performance optimization)
          if (point.alpha < 0.03) continue

          // Create gradient for trail segment
          const gradient = ctx.createLinearGradient(point.x, point.y, nextPoint.x, nextPoint.y)
          gradient.addColorStop(0, `rgba(${colorValue}, ${point.alpha})`)
          gradient.addColorStop(1, `rgba(${colorValue}, ${nextPoint.alpha})`)

          ctx.beginPath()
          ctx.moveTo(point.x, point.y)
          ctx.lineTo(nextPoint.x, nextPoint.y)
          ctx.lineWidth = point.width
          ctx.strokeStyle = gradient
          ctx.lineCap = "round" // Rounded ends for smoother appearance
          ctx.stroke()
        }

        // Draw head of shooting star with glow
        if (this.trail.length > 0) {
          const head = this.trail[0]

          // Outer glow
          const glowGradient = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, this.headSize * 4)
          glowGradient.addColorStop(0, `rgba(${colorValue}, 0.4)`)
          glowGradient.addColorStop(1, `rgba(${colorValue}, 0)`)

          ctx.beginPath()
          ctx.arc(head.x, head.y, this.headSize * 4, 0, Math.PI * 2)
          ctx.fillStyle = glowGradient
          ctx.fill()

          // Bright core
          ctx.beginPath()
          ctx.arc(head.x, head.y, this.headSize, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${colorValue}, 0.95)`
          ctx.fill()

          // Extra bright center
          ctx.beginPath()
          ctx.arc(head.x, head.y, this.headSize * 0.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${colorValue}, 1)`
          ctx.fill()
        }
      }
    }

    // Create stars - significantly more stars in day mode
    const stars: Star[] = []
    const starCount = isLightTheme ? 450 : 350 // Increased stars in day mode

    for (let i = 0; i < starCount; i++) {
      stars.push(new Star(i, starCount))
    }

    // Shooting stars array
    const shootingStars: ShootingStar[] = []
    let lastShootingStarTime = 0
    const shootingStarInterval = 5000 // 5 seconds between shooting stars

    // Animation variables
    let animationTime = 0
    let lastFrameTime = 0
    const startTime = performance.now()

    // For FPS calculation
    let frameCount = 0
    let lastFpsUpdateTime = 0
    let currentFps = 0

    // Draw all stars to the stars canvas
    const drawStars = () => {
      if (!starsCtx) return

      // Clear the stars canvas
      starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height)

      // Draw all stars
      for (const star of stars) {
        star.draw(starsCtx)
      }

      // Reset the flag
      needsStarsRedraw = false
    }

    // Animation loop with delta time for smooth animation
    const animate = (timestamp: number) => {
      // Calculate delta time for smooth animation
      const deltaTime = timestamp - lastFrameTime
      lastFrameTime = timestamp

      // Update animation time
      animationTime = (timestamp - startTime) / 1000 // Convert to seconds

      // FPS calculation
      frameCount++
      if (timestamp - lastFpsUpdateTime >= 1000) {
        currentFps = frameCount
        frameCount = 0
        lastFpsUpdateTime = timestamp
        // console.log(`FPS: ${currentFps}`) // Uncomment for debugging
      }

      // Clear main canvas
      ctx.clearRect(0, 0, canvas.width / pixelRatio, canvas.height / pixelRatio)

      // Update stars
      for (const star of stars) {
        star.update(animationTime)
      }

      // Only redraw stars when needed (performance optimization)
      if (needsStarsRedraw) {
        drawStars()
      }

      // Draw stars canvas to main canvas
      ctx.drawImage(
        starsCanvas,
        0,
        0,
        canvas.width,
        canvas.height,
        0,
        0,
        canvas.width / pixelRatio,
        canvas.height / pixelRatio,
      )

      // Check if it's time to add a new shooting star
      if (timestamp - lastShootingStarTime > shootingStarInterval) {
        // Only add if there are no active shooting stars
        if (shootingStars.length === 0) {
          shootingStars.push(new ShootingStar())
          lastShootingStarTime = timestamp
        }
      }

      // Update and draw shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const shootingStar = shootingStars[i]
        shootingStar.update()
        shootingStar.draw(ctx)

        // Remove inactive shooting stars
        if (!shootingStar.active) {
          shootingStars.splice(i, 1)
        }
      }

      requestAnimationFrame(animate)
    }

    // Initial stars draw
    drawStars()

    // Start animation
    animate(performance.now())

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [isLightTheme, prefersReducedMotion])

  if (prefersReducedMotion) return null

  return (
    <>
      {/* Background gradient based on theme */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: isLightTheme ? "linear-gradient(135deg, #ffffff 0%, #e5e5e5 50%, #d7d7d7 100%)" : "#000000", // Pure black for dark mode
        }}
      />
      {/* Twinkling stars overlay */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ opacity: isLightTheme ? 0.8 : 0.9 }} // Increased opacity in day mode
      />
    </>
  )
}
