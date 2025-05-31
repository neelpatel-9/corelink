"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function NatureBackground() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Only show in light/day mode
  if (theme === "dark") return null

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-blue-100" />

      {/* Distant mountains */}
      <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-emerald-700/30 to-transparent rounded-t-[100%] translate-y-[40%]" />
      <div className="absolute bottom-0 left-0 right-0 h-[25%] bg-gradient-to-t from-emerald-800/20 to-transparent rounded-t-[120%] translate-y-[30%] translate-x-[-10%]" />

      {/* Closer hills and ground */}
      <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-gradient-to-t from-green-600 to-green-500/80 rounded-t-[50%]" />
      <div className="absolute bottom-0 left-0 right-0 h-[15%] bg-gradient-to-t from-green-700 to-green-600/90 rounded-t-[70%] translate-x-[15%]" />

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-[10%] bg-gradient-to-t from-green-800 to-green-700" />

      {/* Clouds */}
      <div className="absolute top-[15%] left-[10%] w-[30%] h-[8%] bg-white/80 rounded-full blur-md" />
      <div className="absolute top-[12%] left-[15%] w-[20%] h-[6%] bg-white/90 rounded-full blur-md" />
      <div className="absolute top-[10%] left-[25%] w-[15%] h-[7%] bg-white rounded-full blur-md" />

      <div className="absolute top-[20%] right-[20%] w-[25%] h-[5%] bg-white/80 rounded-full blur-md" />
      <div className="absolute top-[18%] right-[25%] w-[15%] h-[4%] bg-white/90 rounded-full blur-md" />
      <div className="absolute top-[22%] right-[30%] w-[10%] h-[3%] bg-white rounded-full blur-md" />
    </div>
  )
}
