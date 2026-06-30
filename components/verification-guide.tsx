"use client"

import {
  completionPolicy,
  socialLinks,
  verificationChecklistItems,
  verificationConfig
} from "@/lib/event-config"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useState } from "react"

type VerificationGuideProps = {
  /** compact: 신청 완료 화면용 짧은 버전 */
  variant?: "default" | "compact"
  className?: string
}

// 완주 인증 방법 A(SNS) / B(DM) 안내 블록
export function VerificationGuide({ variant = "default", className = "" }: VerificationGuideProps) {
  const hashtags = verificationConfig.hashtags.join(" ")
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle")

  // 모바일에서도 계정명을 쉽게 복사해 DM 화면으로 이동할 수 있게 돕습니다.
  const handleCopyHandle = async () => {
    try {
      await navigator.clipboard.writeText(socialLinks.instagramHandle)
      setCopyState("copied")
      window.setTimeout(() => setCopyState("idle"), 1800)
    } catch {
      setCopyState("error")
      window.setTimeout(() => setCopyState("idle"), 1800)
    }
  }

  if (variant === "compact") {
    return (
      <div className={cn("rounded-2xl border border-orange-200 bg-orange-50/50 p-5 text-left text-sm", className)}>
        <p className="font-bold text-foreground mb-2">완주 인증 (둘 중 하나)</p>
        <ul className="space-y-2 text-muted-foreground list-disc pl-4">
          <li>
            인스타 피드·스토리에 {hashtags} + 완주 기록 캡처 업로드 ·{" "}
            <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="text-orange-600 underline">
              {socialLinks.instagramHandle}
            </a>{" "}
            태그 권장
          </li>
          <li>
            해시태그 인증이 어렵다면{" "}
            <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="text-orange-600 underline">
              {socialLinks.instagramHandle}
            </a>
            {" "}DM으로 기록 캡처 보내기
          </li>
        </ul>
        <p className="mt-3 rounded-lg border border-orange-200 bg-white px-3 py-2 text-xs text-muted-foreground">
          비공개 계정은 DM 인증을 기본 경로로 권장합니다.
        </p>
        <p className="text-xs text-muted-foreground mt-3">마감: {verificationConfig.deadlineNote}</p>
        <p className="text-xs text-muted-foreground mt-2">{verificationConfig.graceNote}</p>
      </div>
    )
  }

  return (
    <div className={cn("rounded-3xl border border-orange-200 bg-white p-6 md:p-8", className)}>
      <h3 className="text-xl md:text-2xl font-black text-foreground mb-2">완주 인증 방법</h3>
      <p className="text-sm text-muted-foreground mb-6">
        4주 챌린지 완주 후, 아래 방법 중 하나로 인증해 주세요. ({verificationConfig.deadlineNote})
      </p>

      <div className="space-y-5">
        <div className="rounded-2xl border border-orange-100 bg-orange-50/40 p-5">
          <p className="text-sm font-bold text-orange-600 mb-2">인증 체크리스트 (필수)</p>
          <ul className="space-y-1.5 text-sm text-muted-foreground list-disc pl-4">
            {verificationChecklistItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-orange-100 bg-orange-50/40 p-5">
          <p className="text-sm font-bold text-orange-600 mb-2">방법 A · SNS 인증</p>
          <p className="text-sm text-foreground mb-2">
            인스타그램 피드 또는 스토리에 아래 해시태그와 함께 완주 기록을 올려 주세요.
          </p>
          <p className="text-xs text-muted-foreground mb-2">
            공식 계정{" "}
            <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="text-orange-600 underline">
              {socialLinks.instagramHandle}
            </a>{" "}
            태그를 권장해요.
          </p>
          <p className="text-base font-bold text-foreground mb-2">{hashtags}</p>
          <p className="text-xs text-muted-foreground">
            비공개 계정이거나 스토리만 올린 경우에는 {socialLinks.instagramHandle} DM으로 기록 캡처를 보내 주세요.
          </p>
        </div>

        <div className="rounded-2xl border border-orange-100 bg-orange-50/40 p-5">
          <p className="text-sm font-bold text-orange-600 mb-2">방법 B · 인스타 DM 인증</p>
          <p className="text-sm text-foreground mb-2">
            해시태그 인증이 어렵거나 비공개 계정이면, 운영 인스타그램으로 기록 캡처를 보내 주세요.
          </p>
          <p className="text-sm font-semibold text-foreground">
            <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="text-orange-600 underline">
              {socialLinks.instagramHandle}
            </a>
          </p>
          <button
            type="button"
            onClick={handleCopyHandle}
            className="mt-2 h-10 px-3 rounded-[10px] border border-orange-300 text-sm font-semibold text-orange-700 hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            {copyState === "copied" ? "계정 복사됨" : copyState === "error" ? "복사 실패" : "인스타 계정 복사"}
          </button>
        </div>

        <p className="text-sm text-muted-foreground rounded-xl border border-orange-100 bg-orange-50/40 p-4">
          {completionPolicy.appealGuide}
        </p>
        <p className="text-sm text-muted-foreground rounded-xl border border-orange-100 bg-orange-50/40 p-4">
          {verificationConfig.graceNote}
        </p>
        <p className="text-xs text-muted-foreground">
          자세한 정책은{" "}
          <Link href="/faq" className="underline underline-offset-2 hover:text-orange-600">
            참가자 FAQ
          </Link>
          에서 확인해 주세요.
        </p>
      </div>
    </div>
  )
}
