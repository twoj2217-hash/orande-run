"use client"

import { Button } from "@/components/ui/liquid-glass-button"
import { BalancedText } from "@/components/ui/balanced-text"
import { eventSchedule, runTiers } from "@/lib/event-config"
import { motion, useReducedMotion } from "framer-motion"
import Link from "next/link"

// 가입 유도 CTA — 통계 3칸, blur 장식 없음
export default function CTASection() {
  const prefersReducedMotion = useReducedMotion()
  const feeFormatter = new Intl.NumberFormat("ko-KR")
  const minFee = Math.min(...runTiers.map((tier) => tier.fee))
  const maxFee = Math.max(...runTiers.map((tier) => tier.fee))

  // 운영 설정 변경 시 CTA 숫자도 자동으로 맞춰지도록 동적 값으로 계산합니다.
  const stats = [
    { value: "3", label: "코스 선택" },
    { value: `${feeFormatter.format(minFee)}~${feeFormatter.format(maxFee)}원`, label: "참가비" },
    { value: `${eventSchedule.participationWeeks}주`, label: "버추얼 런" }
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
            원하는 코스를 선택하고 {eventSchedule.participationWeeks}주 동안 달려보세요. 완주 인증 후 코스별
            키캡키링을 보내드립니다.
          </p>

          {/* 모바일에서는 1열로 바꿔 수치 텍스트가 눌려 보이지 않게 읽기 흐름을 정리합니다. */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 mb-16 max-w-2xl mx-auto">
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
