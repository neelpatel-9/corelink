"use client"

import { useRef, useState, useEffect, useMemo } from "react"
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion"
import { useInView } from "framer-motion"
import { PieChart, TrendingUp, Activity } from "lucide-react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useTheme } from "next-themes"

export default function TabletDisplay() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.3 })
  const [isActive, setIsActive] = useState(false)
  const [currentChart, setCurrentChart] = useState(0)
  const prefersReducedMotion = useReducedMotion()
  const { theme } = useTheme()
  const isLightTheme = theme === "light"

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  // Create motion values for the tablet's rotation - simplified for performance
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [0, 3, -10])
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [0, -3, 3])
  const rotateZ = useTransform(scrollYProgress, [0, 0.5, 1], [0, -1, 1])

  // Add spring physics with lighter settings
  const springRotateX = useSpring(rotateX, { stiffness: 80, damping: 25 })
  const springRotateY = useSpring(rotateY, { stiffness: 80, damping: 25 })
  const springRotateZ = useSpring(rotateZ, { stiffness: 80, damping: 25 })

  // Motion values for floating animation
  const y = useMotionValue(0)

  // Charts data - memoized to prevent unnecessary re-renders
  const charts = useMemo(
    () => [
      {
        title: "Revenue Growth",
        icon: <TrendingUp className="h-5 w-5 text-gray-200" />,
        component: (
          <div className="flex-1 flex items-end space-x-1">
            {[40, 65, 45, 80, 75, 90, 85].map((height, i) => (
              <div key={i} className="flex-1 flex items-end">
                <div
                  className={`w-full rounded-sm ${
                    isLightTheme
                      ? "bg-gradient-to-t from-blue-500 to-sky-400"
                      : "bg-gradient-to-t from-cosmic to-cosmic-light"
                  }`}
                  style={{ height: `${height}%` }}
                ></div>
              </div>
            ))}
          </div>
        ),
      },
      {
        title: "User Engagement",
        icon: <Activity className="h-5 w-5 text-gray-200" />,
        component: (
          <div className="flex-1 flex flex-col justify-center space-y-3">
            <div className="h-4 w-full bg-gray-700 rounded-sm relative overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full rounded-sm ${
                  isLightTheme
                    ? "bg-gradient-to-r from-blue-500 to-sky-400"
                    : "bg-gradient-to-r from-cosmic to-[#00CFFD]"
                }`}
                style={{ width: "65%" }}
              ></div>
            </div>
            <div className="h-4 w-full bg-gray-700 rounded-sm relative overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full rounded-sm ${
                  isLightTheme
                    ? "bg-gradient-to-r from-blue-500 to-sky-400"
                    : "bg-gradient-to-r from-cosmic to-[#00CFFD]"
                }`}
                style={{ width: "85%" }}
              ></div>
            </div>
            <div className="h-4 w-full bg-gray-700 rounded-sm relative overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full rounded-sm ${
                  isLightTheme
                    ? "bg-gradient-to-r from-blue-500 to-sky-400"
                    : "bg-gradient-to-r from-cosmic to-[#00CFFD]"
                }`}
                style={{ width: "45%" }}
              ></div>
            </div>
            <div className="h-4 w-full bg-gray-700 rounded-sm relative overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full rounded-sm ${
                  isLightTheme
                    ? "bg-gradient-to-r from-blue-500 to-sky-400"
                    : "bg-gradient-to-r from-cosmic to-[#00CFFD]"
                }`}
                style={{ width: "70%" }}
              ></div>
            </div>
          </div>
        ),
      },
      {
        title: "Traffic Sources",
        icon: <PieChart className="h-5 w-5 text-gray-200" />,
        component: (
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#4b5563" strokeWidth="20" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke={isLightTheme ? "#0ea5e9" : "#00CFFD"}
                  strokeWidth="20"
                  strokeDasharray="251.2"
                  strokeDashoffset="188.4"
                  transform="rotate(-90 50 50)"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke={isLightTheme ? "#3b82f6" : "#8A4FFF"}
                  strokeWidth="20"
                  strokeDasharray="251.2"
                  strokeDashoffset="125.6"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-gray-200 text-sm font-bold">45%</div>
              </div>
            </div>
          </div>
        ),
      },
    ],
    [isLightTheme],
  )

  // Auto-cycle through charts - simplified for performance
  useEffect(() => {
    if (!isInView || prefersReducedMotion) return

    // First activate the tablet
    const activateTimeout = setTimeout(() => {
      setIsActive(true)
    }, 800)

    // Cycle through charts
    const interval = setInterval(() => {
      setCurrentChart((prev) => (prev + 1) % charts.length)
    }, 4000)

    return () => {
      clearTimeout(activateTimeout)
      clearInterval(interval)
    }
  }, [isInView, charts.length, prefersReducedMotion])

  // Update date at midnight
  useEffect(() => {
    // Function to calculate milliseconds until midnight
    const getMsUntilMidnight = () => {
      const now = new Date()
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0)
      return midnight.getTime() - now.getTime()
    }

    // Set up timer to force re-render at midnight
    const timeoutId = setTimeout(() => {
      // This will trigger a re-render, updating the date
      setCurrentChart(currentChart) // Just using this state update to force re-render
    }, getMsUntilMidnight())

    return () => clearTimeout(timeoutId)
  }, [currentChart])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden"
      style={{ perspective: "1500px" }}
    >
      {/* Sunlight rays effect for light theme */}
      {isLightTheme && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%]">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 h-full w-4 bg-gradient-to-t from-yellow-300/0 via-yellow-300/20 to-yellow-300/0 origin-bottom"
                style={{
                  rotate: i * 30,
                  translateX: "-50%",
                }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 3 + (i % 3),
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          y,
          rotateX: springRotateX,
          rotateY: springRotateY,
          rotateZ: springRotateZ,
          transformOrigin: "center center",
        }}
        className="relative w-[90%] max-w-[500px]"
      >
        <motion.div
          className="tablet relative"
          style={{
            transformStyle: "preserve-3d",
            transformOrigin: "center center",
          }}
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {/* Tablet Frame - Silver/Black color based on theme */}
          <div
            className={`relative rounded-3xl overflow-hidden ${
              isLightTheme
                ? "bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a] border-8 border-[#0a0a0a]"
                : "bg-gradient-to-b from-[#e0e0e0] to-[#c0c0c0] border-8 border-[#d8d8d8]"
            } shadow-xl`}
          >
            {/* Edge details */}
            <div
              className={`absolute inset-0 ${
                isLightTheme
                  ? "bg-gradient-to-r from-[#222] via-[#333] to-[#222]"
                  : "bg-gradient-to-r from-[#f5f5f5] via-[#e0e0e0] to-[#f5f5f5]"
              } opacity-50 pointer-events-none`}
            ></div>
            <div
              className={`absolute inset-0 ${
                isLightTheme ? "border border-gray-700" : "border border-white/30"
              } rounded-2xl pointer-events-none`}
            ></div>

            {/* Screen */}
            <div className="aspect-[4/3] w-full bg-black">
              {/* Screen Content - Interface that matches theme */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className={`w-full h-full ${isLightTheme ? "bg-[#f8f9fa]" : "bg-[#151825]"} p-4`}
              >
                {/* Dashboard UI */}
                <div className="h-full flex flex-col">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`font-medium ${isLightTheme ? "text-gray-800" : "text-gray-200"}`}>
                      Analytics Dashboard
                    </div>
                    <div className={`text-sm ${isLightTheme ? "text-gray-600" : "text-gray-400"}`}>
                      {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex space-x-2 mb-4">
                    {charts.map((chart, index) => (
                      <motion.button
                        key={index}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                          currentChart === index
                            ? isLightTheme
                              ? "bg-blue-100 text-blue-800"
                              : "bg-[#2a2d3a] text-gray-200"
                            : isLightTheme
                              ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              : "bg-[#1e2130] text-gray-400 hover:bg-[#252836]"
                        }`}
                        onClick={() => setCurrentChart(index)}
                        whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                        whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                      >
                        {chart.icon}
                        <span className="hidden md:inline">{chart.title}</span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Chart Area */}
                  <div
                    className={`flex-1 rounded-lg p-4 flex flex-col ${
                      isLightTheme ? "bg-white border border-gray-200" : "bg-[#1a1d2a] border border-[#2a2d3a]"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className={`text-lg font-medium ${isLightTheme ? "text-gray-800" : "text-gray-200"}`}>
                        {charts[currentChart].title}
                      </div>
                      <div className="flex space-x-2">
                        <div
                          className={`px-2 py-1 rounded text-xs ${
                            isLightTheme ? "bg-gray-100 text-gray-600" : "bg-[#252836] text-gray-400"
                          }`}
                        >
                          Last 7 days
                        </div>
                        <div
                          className={`px-2 py-1 rounded text-xs ${
                            isLightTheme ? "bg-gray-100 text-gray-600" : "bg-[#252836] text-gray-400"
                          }`}
                        >
                          +24%
                        </div>
                      </div>
                    </div>

                    {/* Current Chart */}
                    <motion.div
                      key={currentChart}
                      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-1"
                    >
                      {charts[currentChart].component}
                    </motion.div>
                  </div>

                  {/* Bottom Stats */}
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div
                      className={`p-3 rounded-lg ${
                        isLightTheme ? "bg-white border border-gray-200" : "bg-[#1a1d2a] border border-[#2a2d3a]"
                      }`}
                    >
                      <div className={`text-xs mb-1 ${isLightTheme ? "text-gray-600" : "text-gray-400"}`}>Users</div>
                      <div className={`font-medium ${isLightTheme ? "text-gray-800" : "text-gray-200"}`}>24.5k</div>
                    </div>
                    <div
                      className={`p-3 rounded-lg ${
                        isLightTheme ? "bg-white border border-gray-200" : "bg-[#1a1d2a] border border-[#2a2d3a]"
                      }`}
                    >
                      <div className={`text-xs mb-1 ${isLightTheme ? "text-gray-600" : "text-gray-400"}`}>Revenue</div>
                      <div className={`font-medium ${isLightTheme ? "text-gray-800" : "text-gray-200"}`}>$48.2k</div>
                    </div>
                    <div
                      className={`p-3 rounded-lg ${
                        isLightTheme ? "bg-white border border-gray-200" : "bg-[#1a1d2a] border border-[#2a2d3a]"
                      }`}
                    >
                      <div className={`text-xs mb-1 ${isLightTheme ? "text-gray-600" : "text-gray-400"}`}>
                        Conversion
                      </div>
                      <div className={`font-medium ${isLightTheme ? "text-gray-800" : "text-gray-200"}`}>3.42%</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Reflection */}
          <div
            className={`absolute top-0 left-0 right-0 h-1/2 ${
              isLightTheme
                ? "bg-gradient-to-b from-white/10 to-transparent"
                : "bg-gradient-to-b from-white/20 to-transparent"
            } pointer-events-none`}
          ></div>

          {/* Screen reflection */}
          <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-2xl"></div>

          {/* Shadow beneath the Tablet */}
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-4/5 h-4 bg-black opacity-20 blur-xl rounded-full"></div>
        </motion.div>
      </motion.div>

      {/* Initial focus overlay - fades out */}
      <motion.div
        className={`absolute inset-0 ${isLightTheme ? "bg-[#f8f9fa]" : "bg-[#0a0a1a]"} z-20 pointer-events-none`}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />
    </div>
  )
}
