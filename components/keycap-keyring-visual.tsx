"use client"

import Image from "next/image"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { keycapKeyringPoster } from "@/lib/event-config"
import { cn } from "@/lib/utils"

type KeycapKeyringVisualProps = {
  /** 랜딩에서 첫 화면 품질 확보가 필요할 때 사용합니다. */
  className?: string
  priority?: boolean
}

/** 완주 리워드 포스터 원본을 표시하고 탭하면 크게 볼 수 있게 합니다. */
export function KeycapKeyringVisual({ className, priority = false }: KeycapKeyringVisualProps) {
  return (
    <Dialog>
      {/* 포스터 전체 정보를 유지하기 위해 크롭 없이 원본 비율로 렌더링합니다. */}
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            // 섹션 배경과 이어지게 — 테두리·흰 박스 없이 상품만 강조
            "interactive-card group block w-full cursor-pointer bg-transparent",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2",
            className
          )}
          aria-label="완주 리워드 키캡키링 포스터 확대 보기"
        >
          <Image
            src={keycapKeyringPoster.src}
            alt={keycapKeyringPoster.alt}
            width={keycapKeyringPoster.width}
            height={keycapKeyringPoster.height}
            priority={priority}
            className="h-auto w-full object-contain transition-[transform,filter] duration-200 motion-safe:group-hover:scale-[1.01] motion-safe:group-hover:drop-shadow-lg"
          />
        </button>
      </DialogTrigger>

      {/* 동일 원본 포스터를 다이얼로그에서도 재사용해 정보 불일치를 막습니다. */}
      <DialogContent className="max-w-3xl p-4 sm:p-5">
        <DialogTitle className="text-xl font-black text-foreground">완주 리워드 키캡키링 포스터</DialogTitle>
        <DialogDescription className="text-sm">
          키캡키링은 하나의 제품이며, 코스별 구성(2구/3구/4구)이 달라집니다.
        </DialogDescription>
        <div className="overflow-hidden rounded-lg border border-orange-100">
          <Image
            src={keycapKeyringPoster.src}
            alt={keycapKeyringPoster.alt}
            width={keycapKeyringPoster.width}
            height={keycapKeyringPoster.height}
            className="h-auto w-full object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
