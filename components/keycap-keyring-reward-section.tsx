"use client"

import { KeycapKeyringVisual } from "@/components/keycap-keyring-visual"
import { cn } from "@/lib/utils"

type KeycapKeyringRewardSectionProps = {
  className?: string
}

// 완주 리워드 사진을 코스 신청 정보와 분리해 먼저 보여주는 전용 섹션입니다.
export function KeycapKeyringRewardSection({ className }: KeycapKeyringRewardSectionProps) {
  return (
    <section
      aria-labelledby="keycap-keyring-reward-heading"
      className={cn("max-w-2xl mx-auto mb-12", className)}
    >
      <div className="text-center mb-4">
        <h3
          id="keycap-keyring-reward-heading"
          className="text-2xl md:text-3xl font-black text-foreground mb-2 text-ko-balance"
        >
          완주 리워드
        </h3>
        <p className="text-sm md:text-base text-muted-foreground text-ko-balance">
          사진을 누르면 확대해서 디테일을 확인할 수 있어요.
        </p>
      </div>

      {/* 포스터 원본 1장을 사용해 FRONT/SIDE/IN USE와 코스별 구성을 한 번에 보여줍니다. */}
      <KeycapKeyringVisual priority />
    </section>
  )
}
