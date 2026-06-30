"use client"

import {
  depositPolicy,
  participationPolicyBullets,
  participationSteps,
  policyLinks,
  supportContact
} from "@/lib/event-config"
import { cn } from "@/lib/utils"
import Link from "next/link"

type ParticipationGuideSectionProps = {
  className?: string
}

// 랜딩 하단 안내를 한 카드로 합쳐 정보 탐색 흐름을 단순화합니다.
export function ParticipationGuideSection({ className }: ParticipationGuideSectionProps) {
  return (
    <aside
      className={cn("rounded-2xl border border-orange-200 bg-white p-5 md:p-7 text-ko-balance", className)}
      aria-labelledby="participation-guide-heading"
    >
      <h3
        id="participation-guide-heading"
        className="text-2xl md:text-3xl font-black text-foreground mb-6 text-center md:text-left"
      >
        이렇게 참여해요
      </h3>

      {/* 단계는 모바일 1열 / 데스크톱 2열로 보여 가독성을 유지합니다. */}
      <ol className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 text-muted-foreground">
        {participationSteps.map((step, index) => (
          <li key={step} className="flex items-center gap-3">
            <span className="inline-flex w-7 h-7 rounded-full bg-orange-100 text-orange-700 items-center justify-center text-sm font-bold">
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>

      {/* 정책/문의는 구분선을 두어 단계 정보와 시각적으로 분리합니다. */}
      <div className="border-t border-orange-100 mt-6 pt-6">
        {/* 신청/확정 오해를 줄이기 위해 입금 확인 기준을 바로 노출합니다. */}
        <p className="rounded-xl border border-orange-200 bg-orange-50/70 px-4 py-3 text-sm text-muted-foreground mb-4">
          <strong className="text-foreground">신청 접수</strong>와 <strong className="text-foreground">참가 확정</strong>은
          달라요. {depositPolicy.confirmationSla}
        </p>
        <p className="font-black text-foreground mb-3">참가 안내</p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {participationPolicyBullets.map((note) => (
            <li key={note} className="flex gap-2">
              <span className="text-orange-500 shrink-0" aria-hidden>
                ·
              </span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted-foreground border-t border-orange-100 pt-3">
          문의: {supportContact.label}{" "}
          <a
            href={supportContact.openChatUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-orange-600 underline underline-offset-2 hover:text-orange-700"
          >
            {supportContact.displayName}
          </a>
          {" · "}
          {supportContact.responseSla}
        </p>
        {/* 랜딩에서 정책 문서 접근 경로를 고정해 정보 분산을 줄입니다. */}
        <p className="mt-2 text-sm text-muted-foreground">
          {policyLinks.map((link, index) => (
            <span key={link.href}>
              {index > 0 && " · "}
              <Link href={link.href} className="underline underline-offset-2 hover:text-orange-600">
                {link.label}
              </Link>
            </span>
          ))}
        </p>
      </div>
    </aside>
  )
}
