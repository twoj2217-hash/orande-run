import { verificationConfig } from "@/lib/event-config"

type VerificationGuideProps = {
  /** compact: 신청 완료 화면용 짧은 버전 */
  variant?: "default" | "compact"
  className?: string
}

// 완주 인증 방법 A(SNS) / B(메일) 안내 블록
export function VerificationGuide({ variant = "default", className = "" }: VerificationGuideProps) {
  const hashtags = verificationConfig.hashtags.join(" ")

  if (variant === "compact") {
    return (
      <div className={`rounded-2xl border border-orange-200 bg-orange-50/50 p-5 text-left text-sm ${className}`}>
        <p className="font-bold text-foreground mb-2">완주 인증 (둘 중 하나)</p>
        <ul className="space-y-2 text-muted-foreground list-disc pl-4">
          <li>
            인스타 피드·스토리에 {hashtags} + 완주 기록 캡처 업로드
          </li>
          <li>
            <a href={`mailto:${verificationConfig.email}`} className="text-orange-600 underline">
              {verificationConfig.email}
            </a>
            로 기록 캡처 메일 발송
          </li>
        </ul>
        <p className="text-xs text-muted-foreground mt-3">마감: {verificationConfig.deadlineNote}</p>
      </div>
    )
  }

  return (
    <div className={`rounded-3xl border border-orange-200 bg-white p-6 md:p-8 ${className}`}>
      <h3 className="text-xl md:text-2xl font-black text-foreground mb-2">완주 인증 방법</h3>
      <p className="text-sm text-muted-foreground mb-6">
        4주 챌린지 완주 후, 아래 방법 중 하나로 인증해 주세요. ({verificationConfig.deadlineNote})
      </p>

      <div className="space-y-5">
        <div className="rounded-2xl border border-orange-100 bg-orange-50/40 p-5">
          <p className="text-sm font-bold text-orange-600 mb-2">방법 A · SNS 인증</p>
          <p className="text-sm text-foreground mb-2">
            인스타그램 피드 또는 스토리에 아래 해시태그와 함께 완주 기록을 올려 주세요.
          </p>
          <p className="text-base font-bold text-foreground mb-2">{hashtags}</p>
          <p className="text-xs text-muted-foreground">
            권장 포함: 코스명(50/70/100km), 러닝 앱 거리 캡처, 챌린지명
          </p>
        </div>

        <div className="rounded-2xl border border-orange-100 bg-orange-50/40 p-5">
          <p className="text-sm font-bold text-orange-600 mb-2">방법 B · 메일 인증</p>
          <p className="text-sm text-foreground mb-2">
            SNS가 부담스럽거나 비공개 계정이면, 운영진 메일로 기록 캡처를 보내 주세요.
          </p>
          <p className="text-sm font-semibold text-foreground">
            <a href={`mailto:${verificationConfig.email}`} className="text-orange-600 underline">
              {verificationConfig.email}
            </a>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            제목 예: {verificationConfig.emailSubjectTemplate.replace("{name}", "홍길동").replace("{tier}", "50km").replace("{date}", "2026-07-01")}
          </p>
        </div>

        <p className="text-xs text-muted-foreground">
          비공개 계정은 방법 B를 권장합니다. 스토리만 올린 경우, 운영진이 확인할 수 있도록 메일로 스크린샷을 추가로
          보내 주세요.
        </p>
      </div>
    </div>
  )
}
