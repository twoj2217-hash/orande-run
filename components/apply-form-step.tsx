"use client"

import { APPLY_FORCE_OPEN_EVENT } from "@/lib/scroll-to-form-error"
import { cn } from "@/lib/utils"
import { useCallback, useEffect, useState, type ReactNode } from "react"

type ApplyFormStepProps = {
  id: string
  headingId: string
  title: string
  stepNumber: number
  /** 완료 시 모바일에서 접힐 때 보여줄 한 줄 요약 */
  summary?: string | null
  isComplete: boolean
  /** false이면 모바일에서 완료되어도 자동 접힘 안 함 (텍스트 입력 단계) */
  collapseWhenComplete?: boolean
  children: ReactNode
}

// 모바일: 완료된 단계는 접고 요약만 표시 / 데스크톱: 항상 펼침
export function ApplyFormStep({
  id,
  headingId,
  title,
  stepNumber,
  summary,
  isComplete,
  collapseWhenComplete = true,
  children
}: ApplyFormStepProps) {
  // 입력 중에는 접히지 않도록 포커스 상태를 추적합니다.
  const [hasFocus, setHasFocus] = useState(false)
  // 사용자가 summary를 탭해 단계를 다시 펼친 경우입니다.
  const [userOpened, setUserOpened] = useState(false)

  const shouldCollapse = Boolean(
    isComplete && summary && collapseWhenComplete && !hasFocus && !userOpened
  )

  // 단계가 미완료로 돌아가면 수동 펼침 상태를 초기화합니다.
  useEffect(() => {
    if (!isComplete) setUserOpened(false)
  }, [isComplete])

  // 검증 실패 시 scrollToFirstFormError가 보내는 이벤트로 모바일 details를 펼칩니다.
  useEffect(() => {
    const handleForceOpen = (event: Event) => {
      const custom = event as CustomEvent<{ stepId: string }>
      if (custom.detail?.stepId === id) {
        setUserOpened(true)
        setHasFocus(true)
      }
    }
    document.addEventListener(APPLY_FORCE_OPEN_EVENT, handleForceOpen)
    return () => document.removeEventListener(APPLY_FORCE_OPEN_EVENT, handleForceOpen)
  }, [id])

  const handleBlurCapture = useCallback((event: React.FocusEvent<HTMLElement>) => {
    const container = event.currentTarget
    // 포커스가 단계 밖으로 나갔을 때만 입력 중 상태를 해제합니다.
    window.requestAnimationFrame(() => {
      if (!container.contains(document.activeElement)) {
        setHasFocus(false)
      }
    })
  }, [])

  const sectionContent = (
    <>
      <h2 id={headingId} className="text-xl font-black text-foreground mb-4">
        {stepNumber}. {title}
      </h2>
      {children}
    </>
  )

  return (
    <>
      {/* 모바일 — section/details 분기 없이 details DOM을 유지하고 open만 제어 */}
      <div
        className="md:hidden"
        onFocusCapture={() => setHasFocus(true)}
        onBlurCapture={handleBlurCapture}
      >
        <details
          id={id}
          data-apply-step={id}
          open={!shouldCollapse}
          onToggle={(event) => {
            const details = event.currentTarget
            setUserOpened(details.open)
          }}
          className={cn(
            "group",
            shouldCollapse
              ? "overflow-hidden rounded-2xl border border-orange-200 bg-white"
              : "overflow-visible border-transparent bg-transparent"
          )}
        >
          <summary
            className={cn(
              "px-5 py-4 cursor-pointer list-none flex items-center justify-between gap-2 font-semibold text-foreground",
              "[&::-webkit-details-marker]:hidden",
              !shouldCollapse && "hidden"
            )}
            aria-label={`${stepNumber}. ${title} — 탭하여 수정`}
          >
            <span>
              <span className="text-orange-600 mr-2">{stepNumber}.</span>
              {title}
            </span>
            <span className="text-sm font-normal text-muted-foreground truncate">{summary}</span>
          </summary>
          <div className={cn(shouldCollapse && "px-5 pb-5 border-t border-orange-100")}>
            {sectionContent}
          </div>
        </details>
      </div>

      {/* 데스크톱 — 항상 펼침 (id 중복 방지용 -desktop 접미사) */}
      <section
        id={`${id}-desktop`}
        data-apply-step={id}
        aria-labelledby={headingId}
        className="hidden md:block"
      >
        {sectionContent}
      </section>
    </>
  )
}

/** 모바일 하단 고정 신청 버튼 영역 */
export function ApplyStickySubmit({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 z-30 p-4 bg-background/95 border-t border-orange-200 backdrop-blur-sm safe-area-pb",
        className
      )}
    >
      {children}
    </div>
  )
}
