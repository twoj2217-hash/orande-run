import { participationPolicyBullets, supportContact } from "@/lib/event-config"
import { cn } from "@/lib/utils"

type ParticipationPolicyNotesProps = {
  className?: string
  /** compact: 모달 등 좁은 영역 */
  variant?: "default" | "compact"
}

// 중복 참여·취소·코스 변경 안내 — 문의처 포함
export function ParticipationPolicyNotes({ className, variant = "default" }: ParticipationPolicyNotesProps) {
  const isCompact = variant === "compact"

  return (
    <aside
      className={cn(
        "rounded-2xl border border-orange-200 bg-white text-left text-ko-balance",
        isCompact ? "p-4 text-xs" : "p-5 text-sm",
        className
      )}
      aria-label="참가 운영 안내"
    >
      <p className={cn("font-black text-foreground", isCompact ? "mb-2 text-sm" : "mb-3")}>참가 안내</p>
      <ul className={cn("space-y-1.5 text-muted-foreground", isCompact ? "space-y-1" : "space-y-2")}>
        {participationPolicyBullets.map((note) => (
          <li key={note} className="flex gap-2">
            <span className="text-orange-500 shrink-0" aria-hidden>
              ·
            </span>
            <span>{note}</span>
          </li>
        ))}
      </ul>
      <p className={cn("mt-3 text-muted-foreground border-t border-orange-100 pt-3", isCompact && "mt-2 pt-2")}>
        문의: {supportContact.label}{" "}
        <strong className="text-foreground font-semibold">{supportContact.kakaoId}</strong>
      </p>
    </aside>
  )
}
