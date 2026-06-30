"use client"

import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

// 폼 7단계 — IntersectionObserver로 현재 단계 감지
export const APPLY_STEPS = ["코스", "지역", "계획", "정보", "발송지", "동의", "입금"] as const

export const APPLY_STEP_IDS = [
  "step-tier",
  "step-location",
  "step-schedule",
  "step-info",
  "step-shipping",
  "step-consent",
  "step-payment"
] as const

type ApplyProgressProps = {
  className?: string
}

/** 레이아웃 시프트 직후 IO가 다음 단계로 튀지 않도록 잠시 무시합니다. */
const LAYOUT_SHIFT_IGNORE_MS = 250
/** 폼 높이 변화 시 observer 재등록 디바운스 */
const RESIZE_DEBOUNCE_MS = 100

/** 현재 뷰포트에서 보이는 단계 요소를 찾습니다 (모바일/데스크톱 id 중복 해결). */
function getVisibleStepElement(stepId: string): HTMLElement | null {
  const candidates = [
    document.getElementById(stepId),
    document.getElementById(`${stepId}-desktop`)
  ].filter(Boolean) as HTMLElement[]

  for (const element of candidates) {
    // offsetParent가 null이면 display:none 등으로 숨겨진 요소입니다.
    if (element.offsetParent !== null) return element
  }

  return document.getElementById(stepId)
}

export function ApplyProgress({ className }: ApplyProgressProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const layoutShiftingRef = useRef(false)
  const layoutShiftEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const resizeDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const markLayoutShift = () => {
      layoutShiftingRef.current = true
      if (layoutShiftEndTimerRef.current) clearTimeout(layoutShiftEndTimerRef.current)
      layoutShiftEndTimerRef.current = setTimeout(() => {
        layoutShiftingRef.current = false
      }, LAYOUT_SHIFT_IGNORE_MS)
    }

    const observeSteps = () => {
      const sections = APPLY_STEP_IDS.map((id) => getVisibleStepElement(id)).filter(
        Boolean
      ) as HTMLElement[]

      if (sections.length === 0) return null

      const observer = new IntersectionObserver(
        (entries) => {
          // fieldset 마운트 등으로 높이가 바뀌는 순간 진행바가 다음 단계로 점프하는 것을 방지
          if (layoutShiftingRef.current) return

          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
          if (visible.length > 0) {
            const target = visible[0].target as HTMLElement
            const stepId = target.dataset.applyStep ?? target.id.replace(/-desktop$/, "")
            const idx = APPLY_STEP_IDS.indexOf(stepId as (typeof APPLY_STEP_IDS)[number])
            if (idx >= 0) setActiveIndex(idx)
          }
        },
        { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
      )

      sections.forEach((el) => observer.observe(el))
      return observer
    }

    let observer = observeSteps()

    // 단계 접힘/펼침으로 높이가 바뀌면 관찰 대상을 다시 등록합니다.
    const resizeObserver = new ResizeObserver(() => {
      markLayoutShift()
      if (resizeDebounceRef.current) clearTimeout(resizeDebounceRef.current)
      resizeDebounceRef.current = setTimeout(() => {
        observer?.disconnect()
        observer = observeSteps()
      }, RESIZE_DEBOUNCE_MS)
    })

    const form = document.getElementById("apply-form")
    if (form) resizeObserver.observe(form)

    return () => {
      observer?.disconnect()
      resizeObserver.disconnect()
      if (layoutShiftEndTimerRef.current) clearTimeout(layoutShiftEndTimerRef.current)
      if (resizeDebounceRef.current) clearTimeout(resizeDebounceRef.current)
    }
  }, [])

  const currentStep = activeIndex + 1
  const progressPercent = (currentStep / APPLY_STEPS.length) * 100

  return (
    <div
      className={cn(
        "sticky top-0 z-20 -mx-4 px-4 py-3 mb-6 bg-gradient-to-b from-orange-50 via-orange-50/95 to-transparent backdrop-blur-sm sm:-mx-6 sm:px-6",
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
      <div
        className="h-1.5 w-full rounded-full bg-orange-100 overflow-hidden"
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={APPLY_STEPS.length}
      >
        <div
          className="h-full rounded-full bg-orange-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  )
}
