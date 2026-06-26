import { participantGuide } from "@/lib/event-config"
import { cn } from "@/lib/utils"

type ParticipantGuideProps = {
  /** compact: 완료 모달용 짧은 버전 */
  variant?: "default" | "compact"
  className?: string
}

// 신청 완료자 전용 오랜디런 진행 안내 타임라인
export function ParticipantGuide({ variant = "default", className }: ParticipantGuideProps) {
  const isCompact = variant === "compact"

  return (
    <div
      className={cn(
        "rounded-2xl border border-orange-200 bg-white text-left",
        isCompact ? "p-5" : "p-6 md:p-8",
        className
      )}
    >
      <h3 className={cn("font-black text-foreground mb-1", isCompact ? "text-base" : "text-xl md:text-2xl")}>
        {participantGuide.title}
      </h3>
      <p className={cn("text-muted-foreground mb-4", isCompact ? "text-xs" : "text-sm")}>
        {participantGuide.intro}
      </p>

      <ol className="space-y-4">
        {participantGuide.steps.map((step) => {
          // Phase 3은 compact에서 bodyCompact 사용
          const body =
            isCompact && "bodyCompact" in step && step.bodyCompact ? step.bodyCompact : step.body

          return (
            <li key={step.phase} className="flex gap-3">
              <span
                className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-sm font-bold"
                aria-hidden
              >
                {step.phase}
              </span>
              <div className="min-w-0">
                <p className={cn("font-semibold text-foreground", isCompact ? "text-sm" : "text-base")}>
                  {step.title}
                </p>
                <p className={cn("text-muted-foreground mt-0.5", isCompact ? "text-xs" : "text-sm")}>
                  {body}
                </p>
              </div>
            </li>
          )
        })}
      </ol>

      <p className={cn("text-muted-foreground mt-4 pt-3 border-t border-orange-100", isCompact ? "text-xs" : "text-sm")}>
        {participantGuide.togetherNote}
      </p>
    </div>
  )
}
