"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

interface ImageBackgroundProps {
  blur: number
  imageUrl: string
}

export default function ImageBackground({ blur = 0, imageUrl }: ImageBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const prefersReducedMotion = useReducedMotion()
  const isLightTheme = theme === "light"

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = imageUrl

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      drawImage()
    }

    const drawImage = () => {
      if (!ctx || !img.complete) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Calculate dimensions to cover the entire canvas while maintaining aspect ratio
      const canvasRatio = canvas.width / canvas.height
      const imgRatio = img.width / img.height

      let drawWidth, drawHeight, offsetX, offsetY

      if (canvasRatio > imgRatio) {
        drawWidth = canvas.width
        drawHeight = canvas.width / imgRatio
        offsetX = 0
        offsetY = (canvas.height - drawHeight) / 2
      } else {
        drawHeight = canvas.height
        drawWidth = canvas.height * imgRatio
        offsetX = (canvas.width - drawWidth) / 2
        offsetY = 0
      }

      // Scale up slightly to prevent edges from showing during blur
      const scale = 1.1
      drawWidth *= scale
      drawHeight *= scale
      offsetX -= (drawWidth * (scale - 1)) / 2
      offsetY -= (drawHeight * (scale - 1)) / 2

      // Draw the image
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)

      // Apply blur if specified
      if (blur > 0) {
        ctx.filter = `blur(${blur}px)`
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
        ctx.filter = "none"
      }

      // Add a subtle overlay to improve text contrast
      ctx.globalCompositeOperation = "source-over"
      ctx.fillStyle = isLightTheme ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.2)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Reset composite operation
      ctx.globalCompositeOperation = "source-over"
    }

    // Initial setup
    img.onload = () => {
      resizeCanvas()
    }

    // Handle window resize
    window.addEventListener("resize", resizeCanvas)

    // Animate subtle movement if reduced motion is not preferred
    let animationFrame: number
    let offset = 0

    const animate = () => {
      if (prefersReducedMotion) return

      offset += 0.0005
      const translateY = Math.sin(offset) * 5

      if (ctx && img.complete) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Save the current state
        ctx.save()

        // Apply subtle movement
        ctx.translate(0, translateY)

        // Draw the image with the current transformation
        drawImage()

        // Restore the state
        ctx.restore()
      }

      animationFrame = requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrame)
    }
  }, [blur, imageUrl, theme, prefersReducedMotion, isLightTheme])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full object-cover -z-10"
      style={{ filter: `blur(${blur}px)` }}
    />
  )
}
