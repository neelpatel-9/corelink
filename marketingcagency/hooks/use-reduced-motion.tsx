"use client"

import { useEffect, useState } from "react"

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check if the browser supports the matchMedia API
    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")

      // Set initial value
      setPrefersReducedMotion(mediaQuery.matches)

      // Create event listener function
      const handleChange = (event: MediaQueryListEvent) => {
        setPrefersReducedMotion(event.matches)
      }

      // Add event listener
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleChange)
      } else {
        // For older browsers
        mediaQuery.addListener(handleChange)
      }

      // Clean up
      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener("change", handleChange)
        } else {
          // For older browsers
          mediaQuery.removeListener(handleChange)
        }
      }
    }

    return undefined
  }, [])

  return prefersReducedMotion
}
