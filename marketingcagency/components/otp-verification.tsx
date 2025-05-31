"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Check, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

interface OTPVerificationProps {
  phoneNumber: string
  onVerified: () => void
  onCancel: () => void
}

export default function OTPVerification({ phoneNumber, onVerified, onCancel }: OTPVerificationProps) {
  const [otp, setOtp] = useState<string[]>(Array(4).fill(""))
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState("")
  const [timeLeft, setTimeLeft] = useState(30)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const { theme } = useTheme()
  const isLightTheme = theme === "light"

  // Timer for resend OTP
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  // Handle OTP input change
  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(0, 1)
    setOtp(newOtp)
    setError("")

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle key down for backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    if (!/^\d+$/.test(pastedData)) return

    const digits = pastedData.slice(0, 4).split("")
    const newOtp = [...otp]

    digits.forEach((digit, index) => {
      if (index < 4) newOtp[index] = digit
    })

    setOtp(newOtp)

    if (digits.length > 0) {
      const focusIndex = Math.min(digits.length, 3)
      inputRefs.current[focusIndex]?.focus()
    }
  }

  // Verify OTP
  const verifyOtp = () => {
    const otpValue = otp.join("")

    if (otpValue.length !== 4) {
      setError("Please enter all 4 digits")
      return
    }

    setIsVerifying(true)

    // Simulate OTP verification (in a real app, this would be an API call)
    setTimeout(() => {
      // For demo purposes, any 4-digit OTP is considered valid
      setIsVerified(true)
      setIsVerifying(false)

      // Notify parent component after a brief delay to show the success state
      setTimeout(() => {
        onVerified()
      }, 1000)
    }, 1500)
  }

  // Resend OTP
  const resendOtp = () => {
    setTimeLeft(30)
    // In a real app, this would trigger an API call to resend the OTP
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`p-6 rounded-xl backdrop-blur-md ${
        isLightTheme
          ? "bg-white/90 border border-gray-200 shadow-lg"
          : "bg-[#0a0a1a]/80 border border-white/10 shadow-lg shadow-purple-900/10"
      }`}
    >
      <div className="text-center mb-6">
        <h3 className={`text-xl font-bold ${isLightTheme ? "text-gray-800" : "text-white"}`}>
          Verify Your Phone Number
        </h3>
        <p className={`mt-2 ${isLightTheme ? "text-gray-600" : "text-white/70"}`}>
          We've sent a 4-digit code to {phoneNumber}
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        {otp.map((digit, index) => (
          <Input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            className={`w-12 h-12 text-center text-lg font-bold ${
              isLightTheme
                ? "border-gray-300 bg-white/80 text-gray-800 focus-visible:ring-purple-500"
                : "border-white/20 bg-white/5 text-white focus-visible:ring-cosmic"
            }`}
            disabled={isVerifying || isVerified}
          />
        ))}
      </div>

      {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

      <div className="flex flex-col gap-3">
        <Button
          onClick={verifyOtp}
          disabled={otp.join("").length !== 4 || isVerifying || isVerified}
          className={`w-full ${
            isLightTheme ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-cosmic hover:bg-cosmic-light text-white"
          }`}
        >
          {isVerifying ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : isVerified ? (
            <Check className="h-4 w-4 mr-2" />
          ) : null}
          {isVerifying ? "Verifying..." : isVerified ? "Verified!" : "Verify OTP"}
        </Button>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={onCancel}
            className={`text-sm ${
              isLightTheme ? "text-gray-600 hover:text-gray-800" : "text-white/70 hover:text-white"
            }`}
          >
            Change Number
          </button>

          <button
            type="button"
            onClick={resendOtp}
            disabled={timeLeft > 0 || isVerified}
            className={`text-sm ${
              timeLeft > 0 || isVerified
                ? isLightTheme
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-white/40 cursor-not-allowed"
                : isLightTheme
                  ? "text-purple-600 hover:text-purple-700"
                  : "text-cosmic-light hover:text-cosmic"
            }`}
          >
            {timeLeft > 0 ? `Resend in ${timeLeft}s` : "Resend OTP"}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
