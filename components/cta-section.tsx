"use client"

import { Button } from "@/components/ui/liquid-glass-button"
import { BalancedText } from "@/components/ui/balanced-text"
import { eventSchedule, runTiers } from "@/lib/event-config"
import { motion, useReducedMotion } from "framer-motion"
import Link from "next/link"

// 가입 유도 CTA — 통계 3칸, blur 장식 없음
export default function CTASection() {
  const prefersReducedMotion = useReducedMotion()
  const minFee = Math.min(...runTiers.map((tier) => tier.fee))
  const maxFee = Math.max(...runTiers.map((tier) => tier.fee))

  const stats = [
    { value: "3", label: "코스 선택" },
    { value: `${Math.floor(minFee / 1000)}천~${Math.floor(maxFee / 1000)}천원`, label: "참가비" },
    { value: `${eventSchedule.participationWeeks}주`, label: "비대면 챌린지" }
  ]

  const motionProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
        viewport: { once: true }
      }

  return (
    <section id="join" className="relative py-32 bg-orange-50/80 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div {...motionProps} className="text-center max-w-4xl mx-auto">
          <BalancedText
            as="h2"
            lines={[
              "이번엔 내 페이스로,",
              <span key="challenge" className="text-orange-600">
                {eventSchedule.participationWeeks}주 버추얼 런
              </span>
            ]}
            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-wider mb-4 sm:mb-6 text-foreground leading-none"
          />

          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 sm:mb-12 leading-relaxed font-medium text-ko-balance">
            코스를 골랐다면 지금 신청하고, 4주 뒤 키캡키링을 받아 보세요.
          </p>

          <div className="grid grid-cols-3 gap-4 md:gap-8 mb-16 max-w-2xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center border-b-2 border-orange-300 pb-3">
                <div className="text-xl sm:text-2xl md:text-3xl font-black text-foreground mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              asChild
              size="lg"
              className="font-bold text-lg tracking-wide px-10 bg-orange-500 hover:bg-orange-600 active:bg-orange-600/95 text-white border-2 border-orange-600 shadow-sm"
            >
              <Link href="/apply" aria-label="참가 신청 페이지로 이동">
                오랜디런 참여하기
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
