"use client"

import { getRecruitmentBannerContent } from "@/lib/event-config"
import { cn } from "@/lib/utils"
import Link from "next/link"

type RecruitmentBannerProps = {
  className?: string
  /** apply 컨텍스트에서는 중복 안내를 줄이기 위해 일부 요소를 숨깁니다. */
  context?: "landing" | "apply"
}

const toneStyles = {
  info: "border-orange-200 bg-orange-50 text-orange-900",
  warm: "border-amber-200 bg-amber-50 text-amber-950",
  closed: "border-stone-200 bg-stone-50 text-stone-800"
}

// 모집 상태별 안내 배너 (tbd / upcoming / closed)
export function RecruitmentBanner({ className, context = "landing" }: RecruitmentBannerProps) {
  const content = getRecruitmentBannerContent()
  if (!content) return null
  if (context === "apply" && content.tone === "closed") return null

  return (
    <div
      role="status"
      className={cn("rounded-2xl border px-5 py-4 text-left", toneStyles[content.tone], className)}
    >
      <p className="font-black text-base mb-1">{content.title}</p>
      <p className="text-sm leading-relaxed opacity-90">{content.body}</p>
      {context === "landing" && content.tone !== "closed" && (
        <Link
          href="/apply"
          className="inline-flex mt-3 text-sm font-semibold underline underline-offset-2 hover:opacity-80"
        >
          신청 페이지 미리 보기
        </Link>
      )}
    </div>
  )
}
