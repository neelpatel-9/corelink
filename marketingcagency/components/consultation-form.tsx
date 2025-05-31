"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useTheme } from "next-themes"
import ButtonWithBurst from "@/components/button-with-burst"
import OTPVerification from "@/components/otp-verification"
import CelebrationAnimation from "@/components/celebration-animation"

interface ConsultationFormProps {
  onSubmit: (e: React.FormEvent) => void
}

export default function ConsultationForm({ onSubmit }: ConsultationFormProps) {
  const { theme } = useTheme()
  const isLightTheme = theme === "light"
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [formStep, setFormStep] = useState<"form" | "otp" | "success">("form")
  const [showCelebration, setShowCelebration] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormState((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // If phone number is entered, proceed to OTP verification
    if (formState.phone) {
      setFormStep("otp")
    } else {
      handleFormSuccess()
    }
  }

  const handleOTPVerified = () => {
    handleFormSuccess()
  }

  const handleFormSuccess = () => {
    setFormStep("success")
    setShowCelebration(true)

    // Call the parent onSubmit handler
    onSubmit(new Event("submit") as unknown as React.FormEvent)

    // Reset form after a delay
    setTimeout(() => {
      setFormState({
        name: "",
        email: "",
        phone: "",
        message: "",
      })
      setFormStep("form")
      setShowCelebration(false)
    }, 5000)
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {formStep === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className={`text-sm font-medium ${isLightTheme ? "text-gray-700" : "text-white"}`}
                  >
                    Your Name
                  </label>
                  <Input
                    id="name"
                    value={formState.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className={
                      isLightTheme
                        ? "border-gray-300 bg-white/80 text-gray-800 focus-visible:ring-purple-500"
                        : "border-white/20 bg-white/5 text-white focus-visible:ring-cosmic"
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className={`text-sm font-medium ${isLightTheme ? "text-gray-700" : "text-white"}`}
                  >
                    Your Email
                  </label>
                  <Input
                    id="email"
                    value={formState.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="john@example.com"
                    required
                    className={
                      isLightTheme
                        ? "border-gray-300 bg-white/80 text-gray-800 focus-visible:ring-purple-500"
                        : "border-white/20 bg-white/5 text-white focus-visible:ring-cosmic"
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className={`text-sm font-medium ${isLightTheme ? "text-gray-700" : "text-white"}`}
                >
                  Phone Number
                </label>
                <Input
                  id="phone"
                  value={formState.phone}
                  onChange={handleChange}
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  required
                  className={
                    isLightTheme
                      ? "border-gray-300 bg-white/80 text-gray-800 focus-visible:ring-purple-500"
                      : "border-white/20 bg-white/5 text-white focus-visible:ring-cosmic"
                  }
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className={`text-sm font-medium ${isLightTheme ? "text-gray-700" : "text-white"}`}
                >
                  What would you like to discuss?
                </label>
                <Textarea
                  id="message"
                  value={formState.message}
                  onChange={handleChange}
                  placeholder="Tell us about your marketing goals and challenges..."
                  rows={4}
                  className={
                    isLightTheme
                      ? "border-gray-300 bg-white/80 text-gray-800 focus-visible:ring-purple-500"
                      : "border-white/20 bg-white/5 text-white focus-visible:ring-cosmic"
                  }
                />
              </div>

              <ButtonWithBurst
                type="submit"
                className={`w-full ${
                  isLightTheme
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-cosmic hover:bg-cosmic-light text-white"
                }`}
              >
                Request Free Consultation
                <Calendar className="ml-2 h-5 w-5" />
              </ButtonWithBurst>
            </form>
          </motion.div>
        )}

        {formStep === "otp" && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <OTPVerification
              phoneNumber={formState.phone}
              onVerified={handleOTPVerified}
              onCancel={() => setFormStep("form")}
            />
          </motion.div>
        )}

        {formStep === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`p-8 rounded-xl text-center ${
              isLightTheme ? "bg-white/90 border border-gray-200" : "bg-[#0a0a1a]/80 border border-white/10"
            }`}
          >
            <div className="mb-4">
              <div
                className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                  isLightTheme ? "bg-green-100" : "bg-green-900/30"
                }`}
              >
                <svg
                  className={`h-8 w-8 ${isLightTheme ? "text-green-500" : "text-green-400"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className={`text-xl font-bold mb-2 ${isLightTheme ? "text-gray-800" : "text-white"}`}>Thank You!</h3>
            <p className={`${isLightTheme ? "text-gray-600" : "text-white/70"}`}>
              Your consultation request has been received. We'll contact you shortly to schedule your free session.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration animation */}
      <CelebrationAnimation isVisible={showCelebration} />
    </div>
  )
}
