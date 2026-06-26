"use client"

import type * as React from "react"
import { useRef } from "react"
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion"
import { LiquidButton } from "@/components/ui/liquid-glass-button"
import { BalancedText } from "@/components/ui/balanced-text"
import { MapPin, Users, Calendar, Trophy } from "lucide-react"

interface SmoothScrollHeroProps {
  scrollHeight?: number
  desktopImage: string
  mobileImage: string
  initialClipPercentage?: number
  finalClipPercentage?: number
}

// 스크롤 진행도에 따라 배경 클리핑과 CTA 오버레이를 연동하는 섹션입니다.
const SmoothScrollHero: React.FC<SmoothScrollHeroProps> = ({
  scrollHeight = 1875,
  desktopImage,
  mobileImage,
  initialClipPercentage = 25,
  finalClipPercentage = 75
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const clipStart = useTransform(scrollYProgress, [0, 0.7], [initialClipPercentage, 0])
  const clipEnd = useTransform(scrollYProgress, [0, 0.7], [finalClipPercentage, 100])
  const clipPath = useMotionTemplate`polygon(${clipStart}% ${clipStart}%, ${clipEnd}% ${clipStart}%, ${clipEnd}% ${clipEnd}%, ${clipStart}% ${clipEnd}%)`
  const backgroundSize = useTransform(scrollYProgress, [0, 0.7], ["170%", "100%"])
  const scale = useTransform(scrollYProgress, [0, 0.7], [1.2, 1])
  const ctaOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1])
  const ctaY = useTransform(scrollYProgress, [0.3, 0.5], [50, 0])

  return (
    <div ref={containerRef} style={{ height: `${scrollHeight}px` }} className="relative w-full">
      <motion.div
        className="sticky top-0 h-screen w-full bg-black overflow-hidden"
        style={{
          clipPath,
          willChange: "transform"
        }}
      >
        <motion.div
          className="absolute inset-0 hidden md:block"
          style={{
            backgroundImage: `url(${desktopImage})`,
            backgroundSize,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            scale
          }}
        />
        <motion.div
          className="absolute inset-0 md:hidden"
          style={{
            backgroundImage: `url(${mobileImage})`,
            backgroundSize,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            scale
          }}
        />

        <div className="absolute inset-0 bg-black/40" />

        <motion.div
          className="absolute inset-0 flex items-center justify-center z-20"
          style={{
            opacity: ctaOpacity,
            y: ctaY
          }}
        >
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <BalancedText
              as="h2"
              lines={[
                "READY TO",
                <span
                  key="run"
                  className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent"
                >
                  RUN WITH US?
                </span>
              ]}
              className="text-4xl md:text-6xl lg:text-7xl font-black tracking-wider mb-6 leading-none"
            />

            <p className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 leading-relaxed font-medium text-ko-balance">
              Join thousands of runners worldwide who&apos;ve found their tribe, pushed their limits, and discovered
              what they&apos;re truly capable of.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-black text-white mb-1">50K+</div>
                <div className="text-xs md:text-sm text-gray-300 font-medium">Global Runners</div>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-black text-white mb-1">120+</div>
                <div className="text-xs md:text-sm text-gray-300 font-medium">Cities Worldwide</div>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-black text-white mb-1">365</div>
                <div className="text-xs md:text-sm text-gray-300 font-medium">Days of Running</div>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-black text-white mb-1">10K+</div>
                <div className="text-xs md:text-sm text-gray-300 font-medium">Goals Achieved</div>
              </div>
            </div>

            <LiquidButton
              size="xxl"
              className="font-bold text-xl tracking-wide px-12 py-4 bg-gray-900 hover:bg-gray-800 text-white border-2 border-gray-900 hover:scale-105 transition-all duration-300"
            >
              JOIN WADADA NOW
            </LiquidButton>

            <div className="mt-12 pt-6 border-t border-white/20">
              <p className="text-xs text-gray-400 mb-3 font-medium">TRUSTED BY RUNNERS WORLDWIDE</p>
              <div className="flex flex-wrap justify-center items-center gap-4 text-gray-300">
                <span className="text-xs font-semibold">BEGINNER FRIENDLY</span>
                <span className="text-xs font-semibold">GLOBAL COMMUNITY</span>
                <span className="text-xs font-semibold">PROVEN RESULTS</span>
                <span className="text-xs font-semibold">FREE TO JOIN</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default SmoothScrollHero
