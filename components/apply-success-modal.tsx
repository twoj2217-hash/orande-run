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
import { copyPaymentInfo } from "@/lib/copy-payment-info"
import { paymentInfo } from "@/lib/event-config"
import { CheckCircle2, Copy, Home, Loader2, Wallet } from "lucide-react"
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

  // payload 없이 본문을 렌더하면 payload.name 접근 시 TypeError 발생
  if (!payload) {
    return null
  }

  return (
    <Dialog
      open={open && !!payload}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
    >
      <DialogContent
        className="max-w-md border-orange-200 max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="text-center sm:text-center">
          <CheckCircle2 className="w-12 h-12 text-orange-500 mx-auto mb-2" aria-hidden />
          <DialogTitle className="text-2xl font-black">신청 접수 완료!</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            {payload.name}님 · {payload.tierLabel}
            {payload.locationLabel && <> · {payload.locationLabel}</>}
          </DialogDescription>
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

          <Button
            type="button"
            onClick={handleCopy}
            disabled={copyState === "copying"}
            className="mt-4 w-full bg-white hover:bg-orange-50 text-orange-700 border border-orange-300 font-semibold"
          >
            {copyState === "copying" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                복사 중...
              </>
            ) : copyState === "copied" ? (
              "복사됨"
            ) : copyState === "error" ? (
              "복사 실패 — 다시 시도해 주세요"
            ) : (
              <>
                <Copy className="w-4 h-4" aria-hidden />
                계좌 복사
              </>
            )}
          </Button>
        </div>

        <ParticipationPolicyNotes variant="compact" />

        {/* 앞으로 진행 방식 안내 (신청 완료 후에만 노출) */}
        <ParticipantGuide variant="compact" />

        {/* 챌린지 종료 후 참고용 완주 인증 안내 */}
        <VerificationGuide variant="compact" />

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            type="button"
            onClick={handleCopy}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold"
          >
            <Wallet className="w-4 h-4" aria-hidden />
            입금 정보 복사
          </Button>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
