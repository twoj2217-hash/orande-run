"use client"

import { ParticipantGuide } from "@/components/participant-guide"
import { ParticipationPolicyNotes } from "@/components/participation-policy-notes"
import { VerificationGuide } from "@/components/verification-guide"
import { Button } from "@/components/ui/liquid-glass-button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import type { ApplySuccessPayload } from "@/lib/apply-success-storage"
import { copyPaymentInfo, formatPaymentCopyText } from "@/lib/copy-payment-info"
import { depositPolicy, formatPolicyValue, paymentInfo } from "@/lib/event-config"
import { cn } from "@/lib/utils"
import { Check, CheckCircle2, Copy, Home, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"

const feeFormatter = new Intl.NumberFormat("ko-KR")

type ApplySuccessModalProps = {
  open: boolean
  payload: ApplySuccessPayload | null
  onClose: () => void
}

// 신청 완료 후 입금 안내·진행 안내 모달
export function ApplySuccessModal({ open, payload, onClose }: ApplySuccessModalProps) {
  const router = useRouter()
  const [copyState, setCopyState] = useState<"idle" | "copying" | "copied" | "error">("idle")

  const handleCopy = useCallback(async () => {
    if (!payload) return
    setCopyState("copying")
    const ok = await copyPaymentInfo({
      bank: paymentInfo.bank,
      accountNumber: paymentInfo.accountNumber,
      accountHolder: paymentInfo.accountHolder,
      fee: payload.fee,
      depositorName: payload.name
    })
    if (ok) {
      setCopyState("copied")
      window.setTimeout(() => setCopyState("idle"), 2000)
    } else {
      setCopyState("error")
      window.setTimeout(() => setCopyState("idle"), 2000)
    }
  }, [payload])

  // 복사 버튼 공통 스타일 — 성공/실패 시 색상 피드백
  const copyButtonClass = cn(
    "mt-4 w-full font-semibold border transition-[color,background-color,border-color,transform] duration-200",
    copyState === "copied" && "copy-success-flash",
    copyState === "error" && "copy-error-flash",
    copyState !== "copied" && copyState !== "error" && "bg-white hover:bg-orange-50 text-orange-700 border-orange-300"
  )

  // payload 없이 본문을 렌더하면 payload.name 접근 시 TypeError 발생
  if (!payload) {
    return null
  }

  return (
    <Dialog
      open={open && !!payload}
      // Dialog 열림 상태 변경 — 바깥 클릭·ESC로 닫힐 때 onClose 호출
      onOpenChange={(next: boolean) => {
        if (!next) onClose()
      }}
    >
      <DialogContent
        className="max-w-md border-orange-200 max-h-[90dvh] overflow-y-auto overscroll-contain"
        // 오버레이·바깥 클릭으로 모달이 닫히지 않게 막음
        onPointerDownOutside={(e: Event) => e.preventDefault()}
      >
        <DialogHeader className="text-center sm:text-center">
          <CheckCircle2 className="w-12 h-12 text-orange-500 mx-auto mb-2" aria-hidden />
          <DialogTitle className="text-2xl font-black">신청 접수 완료</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            {payload.name}님 · {payload.tierLabel}
            {payload.locationLabel && <> · {payload.locationLabel}</>}
          </DialogDescription>
          {/* 신청 완료와 참가 확정의 차이를 첫 화면에서 바로 안내합니다. */}
          <p className="text-sm font-bold text-orange-700">입금 확인 후 참가가 확정됩니다.</p>
        </DialogHeader>

        {/* 지금 당장 할 일: 참가비 입금 */}
        <div className="rounded-2xl bg-orange-50 border border-orange-200 p-5 text-left">
          <p className="text-sm text-orange-600 font-semibold mb-2">1. 참가비 입금</p>
          <p className="text-foreground font-bold">
            {paymentInfo.bank} {paymentInfo.accountNumber}
          </p>
          <p className="text-sm text-muted-foreground">예금주: {paymentInfo.accountHolder}</p>
          <p className="text-lg font-black text-orange-600 mt-2">{feeFormatter.format(payload.fee)}원</p>
          <p className="text-xs text-muted-foreground mt-2">입금자명: {payload.name}</p>
          <p className="text-xs text-muted-foreground mt-2">{depositPolicy.confirmationSla}</p>
          <p className="text-xs text-muted-foreground mt-1">
            입금 기한: {formatPolicyValue(depositPolicy.paymentDeadline)}
          </p>

          <Button
            type="button"
            onClick={handleCopy}
            disabled={copyState === "copying"}
            className={copyButtonClass}
          >
            {copyState === "copying" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                복사 중...
              </>
            ) : copyState === "copied" ? (
              <>
                <Check className="w-4 h-4" aria-hidden />
                복사됨
              </>
            ) : copyState === "error" ? (
              "복사 실패 — 다시 시도해 주세요"
            ) : (
              <>
                <Copy className="w-4 h-4" aria-hidden />
                계좌 복사
              </>
            )}
          </Button>
          {copyState === "error" && (
            <p className="mt-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs text-red-700 select-all break-all">
              {/* 복사가 막힌 환경에서도 수동 복사가 가능하도록 원문을 노출합니다. */}
              {formatPaymentCopyText({
                bank: paymentInfo.bank,
                accountNumber: paymentInfo.accountNumber,
                accountHolder: paymentInfo.accountHolder,
                fee: payload.fee,
                depositorName: payload.name
              })}
            </p>
          )}
        </div>

        {/* 입금 외 안내는 기본 접기로 제공해 첫 화면 집중도를 높입니다. */}
        <details className="rounded-2xl border border-orange-200 bg-white overflow-hidden group">
          <summary className="px-5 py-4 cursor-pointer list-none font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset">
            앞으로 진행 안내 (펼쳐보기)
          </summary>
          <div className="px-5 pb-5 space-y-4 border-t border-orange-100">
            <ParticipationPolicyNotes variant="compact" />

            {/* 앞으로 진행 방식 안내 (신청 완료 후에만 노출) */}
            <ParticipantGuide variant="compact" />

            {/* 챌린지 종료 후 참고용 완주 인증 안내 */}
            <VerificationGuide variant="compact" />
          </div>
        </details>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onClose()
              router.push("/")
            }}
            className="w-full border-orange-200 text-orange-700 font-semibold"
          >
            <Home className="w-4 h-4" aria-hidden />
            홈으로 돌아가기
          </Button>
          <Link
            href="/#how-to-join"
            onClick={onClose}
            className="text-center text-sm text-muted-foreground underline underline-offset-2 hover:text-orange-600"
          >
            참여 방법 다시 보기
          </Link>
          <Link
            href="/faq"
            onClick={onClose}
            className="text-center text-sm text-muted-foreground underline underline-offset-2 hover:text-orange-600"
          >
            FAQ 확인하기
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
