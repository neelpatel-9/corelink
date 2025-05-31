"use client"

import type React from "react"

import { useRef, useCallback, useMemo, useState } from "react"
import { motion, useInView, useScroll } from "framer-motion"
import { ArrowRight, CheckCircle, ChevronDown, Calendar, Clock, Star, Shield, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import dynamic from "next/dynamic"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import ThemeToggle from "@/components/theme-toggle"
import { useTheme } from "next-themes"
import ButtonWithBurst from "@/components/button-with-burst"
import ConsultationForm from "@/components/consultation-form"

// Dynamically import heavy components
const TabletDisplay = dynamic(() => import("@/components/tablet-display"), {
  ssr: false,
  loading: () => <div className="w-full h-[400px] md:h-[500px] opacity-0" />,
})

export default function Home() {
  const { scrollYProgress } = useScroll()
  const { toast } = useToast()
  const prefersReducedMotion = useReducedMotion()
  const { theme } = useTheme()
  const isLightTheme = theme === "light"

  // Form state
  const [phoneNumber, setPhoneNumber] = useState("")
  const [showOtpVerification, setShowOtpVerification] = useState(false)
  const [isPhoneVerified, setIsPhoneVerified] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  // Refs for sections
  const heroRef = useRef(null)
  const servicesRef = useRef(null)
  const aboutRef = useRef(null)
  const contactRef = useRef(null)
  const tabletRef = useRef(null)
  const consultancyRef = useRef(null)

  // Use InView with threshold to optimize rendering
  const heroInView = useInView(heroRef, { once: false, amount: 0.3 })
  const servicesInView = useInView(servicesRef, { once: false, amount: 0.2 })
  const aboutInView = useInView(aboutRef, { once: false, amount: 0.2 })
  const contactInView = useInView(contactRef, { once: false, amount: 0.2 })
  const tabletInView = useInView(tabletRef, { once: false, amount: 0.5 })
  const consultancyInView = useInView(consultancyRef, { once: false, amount: 0.3 })

  // Data - Memoize to prevent unnecessary re-renders
  const services = useMemo(
    () => [
      {
        title: "Digital Marketing",
        description: "Strategic digital marketing campaigns that drive traffic, engagement, and conversions.",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
            />
          </svg>
        ),
        image: "/services/digital-marketing.jpg",
      },
      {
        title: "Brand Strategy",
        description: "Comprehensive brand strategy services to help you stand out in a crowded market.",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        ),
        image: "/services/brand-strategy.jpg",
      },
      {
        title: "Web Development",
        description: "Custom website development that combines stunning design with powerful functionality.",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
        ),
        image: "/services/web-development.jpg",
      },
      {
        title: "Content Creation",
        description: "Compelling content that tells your brand story and connects with your audience.",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2V6a2 2 0 00-2-2h-2v4l.586-.586z"
            />
          </svg>
        ),
        image: "/services/content-creation.jpg",
      },
      {
        title: "Social Media Management",
        description: "Strategic social media management to build your brand and engage your audience.",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2H11a2 2 0 01-2-2V6a2 2 0 00-2-2h2v4l.586-.586z"
            />
          </svg>
        ),
        image: "/services/social-media.jpg",
      },
    ],
    [],
  )

  const testimonials = useMemo(
    () => [
      {
        name: "Emily Thompson",
        position: "Marketing Director",
        company: "GreenTech Solutions",
        quote:
          "Working with Corelink transformed our digital presence. Their strategic approach and creative execution exceeded our expectations.",
        photo: "/testimonials/emily.png",
        rating: 5,
      },
      {
        name: "Robert Chen",
        position: "CEO",
        company: "Innovate Labs",
        quote:
          "Corelink helped us launch our new product with a comprehensive digital campaign that drove incredible results. Highly recommended!",
        photo: "/testimonials/robert.jpg",
        rating: 5,
      },
      {
        name: "Sophia Martinez",
        position: "Brand Manager",
        company: "Urban Style Co.",
        quote:
          "The team at Corelink truly understands our brand and has helped us connect with our audience in meaningful ways. They're an extension of our team.",
        photo: "/testimonials/sophia.jpg",
        rating: 5,
      },
    ],
    [],
  )

  // Memoize handlers to prevent unnecessary re-renders
  const scrollToSection = useCallback(
    (ref: React.RefObject<HTMLElement>) => {
      ref.current?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" })
    },
    [prefersReducedMotion],
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      })
    },
    [toast],
  )

  const handleConsultationSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      // Show celebration animation
      setShowCelebration(true)

      // Hide celebration after a few seconds
      setTimeout(() => {
        setShowCelebration(false)

        // Reset form
        setPhoneNumber("")
        setIsPhoneVerified(false)

        // Show toast
        toast({
          title: "Consultation Request Received!",
          description: "We'll contact you shortly to schedule your free consultation.",
        })
      }, 5000)
    },
    [toast],
  )

  // Phone verification handlers
  const handleSendOtp = useCallback(() => {
    if (phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      })
      return
    }

    setShowOtpVerification(true)
    toast({
      title: "OTP Sent!",
      description: "A verification code has been sent to your phone",
    })
  }, [phoneNumber, toast])

  const handleOtpVerified = useCallback(() => {
    setIsPhoneVerified(true)
    setShowOtpVerification(false)
    toast({
      title: "Phone Verified!",
      description: "Your phone number has been verified successfully",
    })
  }, [toast])

  const handleCancelOtp = useCallback(() => {
    setShowOtpVerification(false)
  }, [])

  // Simplified animation variants based on reduced motion preference
  const fadeInVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
      visible: { opacity: 1, y: 0 },
    }),
    [prefersReducedMotion],
  )

  return (
    <main className={`relative overflow-hidden min-h-screen ${isLightTheme ? "text-foreground" : "text-white"}`}>
      {/* Theme Toggle Button */}
      <ThemeToggle />

      {/* Progress bar - simplified for performance */}
      <motion.div
        className={`fixed top-0 left-0 right-0 h-1 z-50 origin-left ${
          isLightTheme ? "bg-gradient-to-r from-primary to-secondary" : "bg-gradient-to-r from-cosmic to-[#00CFFD]"
        }`}
        style={{ scaleX: scrollYProgress }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      />

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-md border-b ${
          isLightTheme ? "bg-white/80 border-gray-200" : "bg-[#0a0a1a]/80 border-white/10"
        }`}
      >
        <div className="container flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <Image
              src="/placeholder.svg?height=40&width=120"
              alt="Corelink Logo"
              width={120}
              height={40}
              className={`h-8 w-auto ${isLightTheme ? "" : "brightness-150"}`}
              priority
            />
            <span
              className={`font-bold text-xl hidden sm:inline-block ${isLightTheme ? "text-primary" : "text-white"}`}
            >
              Corelink
            </span>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`hidden md:flex items-center gap-8 ${isLightTheme ? "text-[#87CEEB] font-medium" : "text-white"}`}
          >
            <li className={cn("cursor-pointer relative", heroInView && "font-bold")}>
              <span onClick={() => scrollToSection(heroRef)}>Home</span>
              {heroInView && (
                <motion.div
                  layoutId="navIndicator"
                  className={`absolute -bottom-1 left-0 right-0 h-0.5 ${isLightTheme ? "bg-[#e74c3c]" : "bg-cosmic"}`}
                />
              )}
            </li>
            <li className={cn("cursor-pointer relative", aboutInView && "font-bold")}>
              <span onClick={() => scrollToSection(aboutRef)}>About</span>
              {aboutInView && (
                <motion.div
                  layoutId="navIndicator"
                  className={`absolute -bottom-1 left-0 right-0 h-0.5 ${isLightTheme ? "bg-primary" : "bg-cosmic"}`}
                />
              )}
            </li>
            <li className={cn("cursor-pointer relative", servicesInView && "font-bold")}>
              <span onClick={() => scrollToSection(servicesRef)}>Services</span>
              {servicesInView && (
                <motion.div
                  layoutId="navIndicator"
                  className={`absolute -bottom-1 left-0 right-0 h-0.5 ${isLightTheme ? "bg-primary" : "bg-cosmic"}`}
                />
              )}
            </li>
            <li className={cn("cursor-pointer relative", consultancyInView && "font-bold")}>
              <span onClick={() => scrollToSection(consultancyRef)}>Free Consultation</span>
              {consultancyInView && (
                <motion.div
                  layoutId="navIndicator"
                  className={`absolute -bottom-1 left-0 right-0 h-0.5 ${isLightTheme ? "bg-primary" : "bg-cosmic"}`}
                />
              )}
            </li>
            <li className={cn("cursor-pointer relative", contactInView && "font-bold")}>
              <span onClick={() => scrollToSection(contactRef)}>Contact</span>
              {contactInView && (
                <motion.div
                  layoutId="navIndicator"
                  className={`absolute -bottom-1 left-0 right-0 h-0.5 ${isLightTheme ? "bg-primary" : "bg-cosmic"}`}
                />
              )}
            </li>
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ButtonWithBurst
              onClick={() => scrollToSection(consultancyRef)}
              variant="oval"
              size="oval"
              className={
                isLightTheme
                  ? "bg-primary hover:bg-primary/90 text-white"
                  : "bg-cosmic hover:bg-cosmic-light text-white"
              }
            >
              Free Consultation
            </ButtonWithBurst>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen pt-24 flex items-center relative overflow-hidden">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={fadeInVariants}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.9 }}
              animate={heroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5 }}
              className={`inline-block px-4 py-1 rounded-full ${
                isLightTheme ? "bg-[#1E3A8A]/10 text-[#1E3A8A] font-bold" : "bg-cosmic/10 text-cosmic-light"
              } text-sm`}
            >
              Award-winning marketing agency
            </motion.div>

            <motion.h1
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
              variants={fadeInVariants}
              transition={{ duration: 0.7, delay: 0.3 }}
              className={`text-4xl md:text-6xl font-extrabold leading-tight space-y-2 ${
                isLightTheme ? "text-[#333333]" : "text-white"
              }`}
            >
              <div>
                <span
                  className={
                    isLightTheme
                      ? "bg-gradient-to-r from-[#1E3A8A] via-black to-[#1E3A8A] text-transparent bg-clip-text bg-size-200 animate-gradient-x font-black"
                      : "bg-gradient-to-r from-cosmic-light via-white to-cosmic-light text-transparent bg-clip-text bg-size-200 animate-gradient-x"
                  }
                >
                  Corelink
                </span>{" "}
                creates
              </div>
              <div>
                <motion.span
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10, scale: prefersReducedMotion ? 1 : 0.9 }}
                  animate={
                    heroInView
                      ? {
                          opacity: 1,
                          y: 0,
                          scale: 1,
                        }
                      : {}
                  }
                  transition={
                    prefersReducedMotion
                      ? { duration: 0.5 }
                      : {
                          type: "spring",
                          stiffness: 200,
                          delay: 0.5,
                        }
                  }
                  className={
                    isLightTheme
                      ? "bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#1E3A8A] text-transparent bg-clip-text bg-size-200 animate-gradient-x font-black"
                      : "bg-gradient-to-r from-purple-500 via-blue-500 to-purple-400 text-transparent bg-clip-text bg-size-200 animate-gradient-x"
                  }
                >
                  digital experiences
                </motion.span>
              </div>
              <div className={isLightTheme ? "text-[#333333] font-extrabold" : ""}>that matter</div>
            </motion.h1>
            <motion.p
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
              variants={fadeInVariants}
              transition={{ duration: 0.7, delay: 0.4 }}
              className={`text-lg font-bold ${isLightTheme ? "text-[#4B5563]" : "text-white/70"}`}
            >
              Helping brands thrive in the digital world with strategic marketing solutions that drive results.
            </motion.p>
            <motion.div
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
              variants={fadeInVariants}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <ButtonWithBurst
                onClick={() => scrollToSection(servicesRef)}
                size="lg"
                className={
                  isLightTheme
                    ? "bg-[#DCDCDC] hover:bg-[#E5E4E2] text-[#333333]"
                    : "bg-cosmic hover:bg-cosmic-light text-white"
                }
              >
                Explore Our Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </ButtonWithBurst>
              <ButtonWithBurst
                onClick={() => scrollToSection(consultancyRef)}
                size="lg"
                variant="outline"
                className={
                  isLightTheme
                    ? "border-white text-white hover:bg-white/10"
                    : "border-cosmic-light text-cosmic-light hover:bg-cosmic/10"
                }
              >
                Request Free Consultation
                <Calendar className="ml-2 h-4 w-4" />
              </ButtonWithBurst>
            </motion.div>
          </motion.div>

          <div ref={tabletRef} className="relative">
            {tabletInView && <TabletDisplay />}

            {tabletInView && (
              <>
                <motion.div
                  initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 20, y: prefersReducedMotion ? 0 : 20 }}
                  animate={tabletInView ? { opacity: 1, x: 0, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.8 }}
                  className={`absolute -bottom-6 -left-6 backdrop-blur-md rounded-lg shadow-lg p-4 z-20 ${
                    isLightTheme ? "bg-white/90 border border-gray-200" : "bg-[#0f1028]/80 border border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isLightTheme ? "bg-green-100" : "bg-green-900/30"
                      }`}
                    >
                      <CheckCircle className={`h-6 w-6 ${isLightTheme ? "text-green-600" : "text-green-500"}`} />
                    </div>
                    <div>
                      <p className={`font-bold ${isLightTheme ? "text-[#87CEEB]" : "text-white"}`}>98% Success Rate</p>
                      <p className={`text-sm ${isLightTheme ? "text-[#C0C0C0]" : "text-white/60"}`}>For our clients</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -20, y: prefersReducedMotion ? 0 : -20 }}
                  animate={tabletInView ? { opacity: 1, x: 0, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.9 }}
                  className={`absolute -top-6 -right-6 backdrop-blur-md rounded-lg shadow-lg p-4 z-20 ${
                    isLightTheme ? "bg-white/90 border border-gray-200" : "bg-[#0f1028]/80 border border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isLightTheme ? "bg-primary/20" : "bg-cosmic/20"
                      }`}
                    >
                      <CheckCircle className={`h-6 w-6 ${isLightTheme ? "text-green-600" : "text-green-500"}`} />
                    </div>
                    <div>
                      <p className={`font-bold ${isLightTheme ? "text-[#87CEEB]" : "text-white"}`}>250+ Clients</p>
                      <p className={`text-sm ${isLightTheme ? "text-[#C0C0C0]" : "text-white/60"}`}>Worldwide</p>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>

        {!prefersReducedMotion && (
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer"
            onClick={() => scrollToSection(servicesRef)}
          >
            <ChevronDown className={`h-10 w-10 ${isLightTheme ? "text-primary/50" : "text-white/50"}`} />
          </motion.div>
        )}
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="py-24 bg-transparent">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -50 }}
              animate={aboutInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Our team"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
              <motion.div
                initial="hidden"
                animate={aboutInView ? "visible" : "hidden"}
                variants={fadeInVariants}
                transition={{ duration: 0.7, delay: 0.3 }}
                className={`absolute -bottom-6 -right-6 backdrop-blur-md rounded-lg shadow-lg p-6 max-w-xs ${
                  isLightTheme ? "bg-white/90 border border-gray-200" : "bg-[#0a0a1a]/80 border border-white/10"
                }`}
              >
                <p className={`text-4xl font-bold mb-2 ${isLightTheme ? "text-[#87CEEB]" : "text-cosmic-light"}`}>5+</p>
                <p className={`text-lg font-medium ${isLightTheme ? "text-[#C0C0C0]" : "text-white"}`}>
                  Years of experience in digital marketing
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 50 }}
              animate={aboutInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <h2
                className={`text-3xl md:text-5xl font-bold ${
                  isLightTheme
                    ? "bg-gradient-to-r from-purple-700 via-black to-[#87CEEB] text-transparent bg-clip-text"
                    : "bg-gradient-to-r from-purple-400 via-white to-[#87CEEB] text-transparent bg-clip-text"
                }`}
              >
                About Corelink
              </h2>
              <p className={`text-lg font-medium ${isLightTheme ? "text-purple-800" : "text-purple-300"}`}>
                We're a team of passionate marketers, designers, and developers dedicated to helping brands thrive in
                the digital landscape.
              </p>
              <p className={`font-medium ${isLightTheme ? "text-black/80" : "text-white/80"}`}>
                Corelink has grown from a small startup to a full-service marketing agency with clients worldwide. Our
                mission is to create meaningful digital experiences that connect brands with their audiences and drive
                measurable results.
              </p>
              <p className={`font-medium ${isLightTheme ? "text-[#87CEEB]" : "text-[#87CEEB]/80"}`}>
                What sets us apart is our strategic approach, creative thinking, and commitment to excellence. We don't
                just execute campaigns; we build long-term partnerships with our clients to help them achieve their
                business goals.
              </p>
              <div className="pt-4">
                <ButtonWithBurst
                  onClick={() => scrollToSection(consultancyRef)}
                  size="lg"
                  className={
                    isLightTheme
                      ? "bg-gradient-to-r from-purple-700 to-[#87CEEB] hover:from-purple-800 hover:to-[#5F9EA0] text-white"
                      : "bg-gradient-to-r from-purple-600 to-[#87CEEB]/70 hover:from-purple-500 hover:to-[#87CEEB] text-white"
                  }
                >
                  Request a Free Consultation
                  <Calendar className="ml-2 h-4 w-4" />
                </ButtonWithBurst>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesRef} className="py-24 bg-transparent">
        <div className="container">
          <motion.div
            initial="hidden"
            animate={servicesInView ? "visible" : "hidden"}
            variants={fadeInVariants}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto mb-16 space-y-4"
          >
            <div
              className={`py-4 px-6 rounded-xl backdrop-blur-sm mb-8 ${
                isLightTheme
                  ? "bg-white/90 border border-gray-200"
                  : "bg-gradient-to-r from-[#0066ff]/20 via-[#0099ff]/30 to-[#0066ff]/20 border border-blue-500/30"
              }`}
            >
              <h2
                className={`text-3xl md:text-5xl font-bold text-shadow-md ${isLightTheme ? "text-[#87CEEB]" : "text-white"}`}
              >
                Our Services
              </h2>
              <p className={`text-lg mt-2 font-medium ${isLightTheme ? "text-foreground" : "text-white/70"}`}>
                We offer a comprehensive range of marketing services to help your business grow
              </p>
            </div>
          </motion.div>

          <div className="space-y-12">
            {/* Featured Service - Digital Marketing */}
            <motion.div
              initial="hidden"
              animate={servicesInView ? "visible" : "hidden"}
              variants={fadeInVariants}
              transition={{ duration: 0.5 }}
              className={`backdrop-blur-md p-8 rounded-xl shadow-lg transition-all duration-300 group ${
                isLightTheme
                  ? "bg-white/90 border border-gray-200 hover:bg-white hover:border-primary/20 hover:shadow-primary/20"
                  : "bg-[#0a0a1a]/60 border border-white/10 hover:bg-gradient-to-r hover:from-[#0066ff]/10 hover:to-[#0099ff]/5 hover:border-blue-500/30 hover:shadow-blue-500/20"
              } hover:shadow-xl`}
            >
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div
                    className={`w-16 h-16 rounded-lg flex items-center justify-center mb-6 text-white ${
                      isLightTheme ? "bg-primary group-hover:bg-primary/90" : "bg-cosmic group-hover:bg-blue-600"
                    } transition-colors duration-300`}
                  >
                    {services[0].icon}
                  </div>
                  <h3
                    className={`text-2xl font-bold mb-3 ${
                      isLightTheme
                        ? "text-[#87CEEB] group-hover:text-[#4682B4]"
                        : "text-white group-hover:text-blue-300"
                    } transition-colors duration-300`}
                  >
                    {services[0].title}
                  </h3>
                  <p
                    className={`mb-6 text-lg font-medium ${
                      isLightTheme
                        ? "text-[#C0C0C0] group-hover:text-[#D3D3D3]"
                        : "text-white/70 group-hover:text-white/90"
                    } transition-colors duration-300`}
                  >
                    {services[0].description}
                  </p>
                  <ButtonWithBurst
                    variant="default"
                    className={
                      isLightTheme
                        ? "bg-[#DCDCDC] hover:bg-[#E5E4E2] text-[#333333]"
                        : "bg-cosmic hover:bg-cosmic-light text-white"
                    }
                  >
                    Learn more <ArrowRight className="ml-2 h-4 w-4" />
                  </ButtonWithBurst>
                </div>
                <div className="rounded-lg overflow-hidden">
                  <div className="relative">
                    <Image
                      src="/placeholder.svg?height=300&width=600"
                      alt="Digital Marketing"
                      width={600}
                      height={300}
                      className="w-full h-64 object-cover brightness-[0.95] saturate-[0.9]"
                    />
                    <div
                      className={`absolute inset-0 opacity-50 group-hover:opacity-70 transition-opacity duration-300 ${
                        isLightTheme
                          ? "bg-gradient-to-t from-primary/10 to-transparent"
                          : "bg-gradient-to-t from-[#0066ff]/10 to-transparent"
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Other Services - Grid Layout */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.slice(1).map((service, index) => (
                <motion.div
                  key={service.title}
                  initial="hidden"
                  animate={servicesInView ? "visible" : "hidden"}
                  variants={fadeInVariants}
                  transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : index * 0.3 }}
                  className={`backdrop-blur-md p-8 rounded-xl shadow-lg transition-all duration-300 group ${
                    isLightTheme
                      ? "bg-white/90 border border-gray-200 hover:bg-white hover:border-primary/20 hover:shadow-primary/20"
                      : "bg-[#0a0a1a]/60 border border-white/10 hover:bg-gradient-to-b hover:from-[#0066ff]/10 hover:to-[#0099ff]/5 hover:border-blue-500/30 hover:shadow-blue-500/20"
                  } hover:shadow-xl`}
                >
                  <div
                    className={`w-14 h-14 rounded-lg flex items-center justify-center text-white mb-6 ${
                      isLightTheme ? "bg-primary group-hover:bg-primary/90" : "bg-cosmic group-hover:bg-blue-600"
                    } transition-colors duration-300`}
                  >
                    {service.icon}
                  </div>
                  <h3
                    className={`text-xl font-bold mb-3 ${
                      isLightTheme
                        ? "text-[#87CEEB] group-hover:text-[#4682B4]"
                        : "text-white group-hover:text-blue-300"
                    } transition-colors duration-300`}
                  >
                    {service.title}
                  </h3>
                  <p
                    className={`mb-6 font-medium ${
                      isLightTheme
                        ? "text-[#C0C0C0] group-hover:text-[#D3D3D3]"
                        : "text-white/70 group-hover:text-white/90"
                    } transition-colors duration-300`}
                  >
                    {service.description}
                  </p>
                  <div className="mb-6 rounded-lg overflow-hidden">
                    <div className="relative">
                      <Image
                        src="/placeholder.svg?height=200&width=400"
                        alt={service.title}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover brightness-[0.95] saturate-[0.9]"
                      />
                      <div
                        className={`absolute inset-0 opacity-50 group-hover:opacity-70 transition-opacity duration-300 ${
                          isLightTheme
                            ? "bg-gradient-to-t from-primary/10 to-transparent"
                            : "bg-gradient-to-t from-[#0066ff]/10 to-transparent"
                        }`}
                      ></div>
                    </div>
                  </div>
                  <ButtonWithBurst
                    variant="link"
                    className={`p-0 h-auto font-medium ${
                      isLightTheme
                        ? "text-primary group-hover:text-primary/90"
                        : "text-cosmic-light group-hover:text-blue-400"
                    } transition-colors duration-300`}
                  >
                    Learn more <ArrowRight className="ml-2 h-4 w-4" />
                  </ButtonWithBurst>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Free Consultation Section */}
      <section ref={consultancyRef} className="py-24 bg-transparent relative overflow-hidden">
        <div className="container relative z-10">
          <motion.div
            initial="hidden"
            animate={consultancyInView ? "visible" : "hidden"}
            variants={fadeInVariants}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto mb-16 space-y-4"
          >
            <div
              className={`py-4 px-6 rounded-xl backdrop-blur-sm mb-8 ${
                isLightTheme
                  ? "bg-white/90 border border-gray-200"
                  : "bg-gradient-to-r from-[#8A4FFF]/20 via-[#A67DFF]/30 to-[#8A4FFF]/20 border border-purple-500/30"
              }`}
            >
              <h2
                className={`text-3xl md:text-5xl font-bold text-shadow-md ${isLightTheme ? "text-[#87CEEB]" : "text-white"}`}
              >
                Book a Free Consultation
              </h2>
              <p className={`text-lg mt-2 font-medium ${isLightTheme ? "text-[#C0C0C0]" : "text-white/70"}`}>
                Get expert advice on how to improve your digital marketing strategy
              </p>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -50 }}
              animate={consultancyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="space-y-8"
            >
              <div
                className={`p-8 rounded-xl backdrop-blur-md ${
                  isLightTheme
                    ? "bg-white/90 border border-gray-200 shadow-lg"
                    : "bg-[#0a0a1a]/80 border border-white/10 shadow-lg shadow-purple-900/10"
                }`}
              >
                <h3 className={`text-2xl font-bold mb-6 ${isLightTheme ? "text-[#87CEEB]" : "text-white"}`}>
                  Why Book a Free Consultation?
                </h3>

                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isLightTheme ? "bg-primary/20" : "bg-cosmic/20"
                      }`}
                    >
                      <Users className={isLightTheme ? "h-6 w-6 text-primary" : "h-6 w-6 text-cosmic-light"} />
                    </div>
                    <div>
                      <h4 className={`text-lg font-bold mb-1 ${isLightTheme ? "text-[#87CEEB]" : "text-white"}`}>
                        Expert Advice
                      </h4>
                      <p className={`font-medium ${isLightTheme ? "text-[#C0C0C0]" : "text-white/70"}`}>
                        Get personalized recommendations from our team of marketing experts with years of experience.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isLightTheme ? "bg-primary/20" : "bg-cosmic/20"
                      }`}
                    >
                      <Shield className={isLightTheme ? "h-6 w-6 text-primary" : "h-6 w-6 text-cosmic-light"} />
                    </div>
                    <div>
                      <h4 className={`text-lg font-bold mb-1 ${isLightTheme ? "text-[#87CEEB]" : "text-white"}`}>
                        No Obligation
                      </h4>
                      <p className={`font-medium ${isLightTheme ? "text-[#C0C0C0]" : "text-white/70"}`}>
                        Our consultation is completely free with no strings attached. We're here to help you succeed.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isLightTheme ? "bg-primary/20" : "bg-cosmic/20"
                      }`}
                    >
                      <Clock className={isLightTheme ? "h-6 w-6 text-primary" : "h-6 w-6 text-cosmic-light"} />
                    </div>
                    <div>
                      <h4 className={`text-lg font-bold mb-1 ${isLightTheme ? "text-[#87CEEB]" : "text-white"}`}>
                        Quick Results
                      </h4>
                      <p className={`font-medium ${isLightTheme ? "text-[#C0C0C0]" : "text-white/70"}`}>
                        Walk away with actionable insights you can implement immediately to improve your marketing.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <ButtonWithBurst
                    onClick={() => scrollToSection(consultancyRef)}
                    size="lg"
                    className={`w-full ${
                      isLightTheme
                        ? "bg-primary hover:bg-primary/90 text-white"
                        : "bg-cosmic hover:bg-cosmic-light text-white"
                    }`}
                  >
                    Request Your Free Consultation
                    <Calendar className="ml-2 h-5 w-5" />
                  </ButtonWithBurst>
                </div>
              </div>

              {/* Testimonials */}
              <div className="space-y-6">
                <h3 className={`text-2xl font-bold ${isLightTheme ? "text-[#87CEEB]" : "text-white"}`}>
                  What Our Clients Say
                </h3>

                <div className="grid gap-6">
                  {testimonials.slice(0, 2).map((testimonial, index) => (
                    <motion.div
                      key={testimonial.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={consultancyInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                      className={`p-6 rounded-xl backdrop-blur-md ${
                        isLightTheme
                          ? "bg-white/90 border border-gray-200 shadow-md"
                          : "bg-[#0a0a1a]/60 border border-white/10 shadow-md shadow-purple-900/10"
                      }`}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <Image
                            src="/placeholder.svg?height=100&width=100"
                            alt={testimonial.name}
                            width={100}
                            height={100}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className={`font-bold ${isLightTheme ? "text-[#87CEEB]" : "text-white"}`}>
                            {testimonial.name}
                          </h4>
                          <p className={`text-sm ${isLightTheme ? "text-secondary" : "text-white/70"}`}>
                            {testimonial.position}, {testimonial.company}
                          </p>
                        </div>
                      </div>
                      <div className="flex mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${isLightTheme ? "text-secondary" : "text-yellow-400"}`} />
                        ))}
                      </div>
                      <p className={`text-lg font-medium ${isLightTheme ? "text-[#C0C0C0]" : "text-white/70"}`}>
                        {testimonial.quote}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 50 }}
              animate={consultancyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div
                className={`p-8 rounded-xl backdrop-blur-md ${
                  isLightTheme
                    ? "bg-white/90 border border-gray-200 shadow-lg"
                    : "bg-[#0a0a1a]/80 border border-white/10 shadow-lg shadow-purple-900/10"
                }`}
              >
                <h3 className={`text-2xl font-bold mb-6 ${isLightTheme ? "text-[#87CEEB]" : "text-white"}`}>
                  Schedule Your Call
                </h3>

                {/* Replace this form with the ConsultationForm component */}
                <ConsultationForm onSubmit={handleConsultationSubmit} />
              </div>

              {/* Keep the floating elements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={consultancyInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
                className={`absolute -top-6 -right-6 p-4 rounded-lg shadow-lg z-10 ${
                  isLightTheme
                    ? "bg-green-50 border border-green-200"
                    : "bg-green-900/20 backdrop-blur-md border border-green-700/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle
                    className={`h-5 w-5 ${isLightTheme ? "text-green-600" : "text-green-400"}`}
                    strokeWidth={2.5}
                  />
                  <p className={`text-sm font-bold ${isLightTheme ? "text-green-700" : "text-green-400"}`}>
                    100% Free, No Obligation
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={consultancyInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
                className={`absolute -bottom-6 -left-6 p-4 rounded-lg shadow-lg z-10 ${
                  isLightTheme
                    ? "bg-blue-50 border border-blue-200"
                    : "bg-blue-900/20 backdrop-blur-md border border-blue-700/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className={`h-5 w-5 ${isLightTheme ? "text-blue-600" : "text-blue-400"}`} strokeWidth={2.5} />
                  <p className={`text-sm font-bold ${isLightTheme ? "text-blue-700" : "text-blue-400"}`}>
                    30-Minute Strategy Session
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
}
