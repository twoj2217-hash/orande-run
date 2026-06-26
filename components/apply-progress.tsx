"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

// 폼 6단계 — IntersectionObserver로 현재 단계 감지
export const APPLY_STEPS = ["코스", "지역", "계획", "정보", "동의", "입금"] as const

export const APPLY_STEP_IDS = [
  "step-tier",
  "step-location",
  "step-schedule",
  "step-info",
  "step-consent",
  "step-payment"
] as const

type ApplyProgressProps = {
  className?: string
}

export function ApplyProgress({ className }: ApplyProgressProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const sections = APPLY_STEP_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible.length > 0) {
          const id = visible[0].target.id
          const idx = APPLY_STEP_IDS.indexOf(id as (typeof APPLY_STEP_IDS)[number])
          if (idx >= 0) setActiveIndex(idx)
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    )

    sections.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const currentStep = activeIndex + 1
  const progressPercent = (currentStep / APPLY_STEPS.length) * 100

  return (
    <div
      className={cn(
        "sticky top-0 z-20 -mx-6 px-6 py-3 mb-6 bg-gradient-to-b from-orange-50 via-orange-50/95 to-transparent backdrop-blur-sm",
        className
      )}
    >
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="font-semibold text-foreground">
          {currentStep} / {APPLY_STEPS.length} {APPLY_STEPS[activeIndex]}
        </span>
      </div>
      <ol className="sr-only" aria-label="신청 단계">
        {APPLY_STEPS.map((step, index) => (
          <li key={step} aria-current={index === activeIndex ? "step" : undefined}>
            {step}
          </li>
        ))}
      </ol>
      <div className="h-1.5 w-full rounded-full bg-orange-100 overflow-hidden" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={APPLY_STEPS.length}>
        <div
          className="h-full rounded-full bg-orange-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  )
}
