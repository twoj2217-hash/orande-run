"use client"

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type ApplyFormStepProps = {
  id: string
  headingId: string
  title: string
  stepNumber: number
  /** 완료 시 모바일에서 접힐 때 보여줄 한 줄 요약 */
  summary?: string | null
  isComplete: boolean
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
  children
}: ApplyFormStepProps) {
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
      {/* 모바일 — 완료 단계 접기 */}
      <div className="md:hidden">
        {isComplete && summary ? (
          <details id={id} className="rounded-2xl border border-orange-200 bg-white overflow-hidden group">
            <summary className="px-5 py-4 cursor-pointer list-none flex items-center justify-between gap-2 font-semibold text-foreground">
              <span>
                <span className="text-orange-600 mr-2">{stepNumber}.</span>
                {title}
              </span>
              <span className="text-sm font-normal text-muted-foreground truncate">{summary}</span>
            </summary>
            <div className="px-5 pb-5 border-t border-orange-100">{children}</div>
          </details>
        ) : (
          <section id={id} aria-labelledby={headingId}>
            {sectionContent}
          </section>
        )}
      </div>

      {/* 데스크톱 — 항상 펼침 */}
      <section id={id} aria-labelledby={headingId} className="hidden md:block">
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
