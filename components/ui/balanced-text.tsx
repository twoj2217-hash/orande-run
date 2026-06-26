import { KO_TEXT_BALANCE_CLASS } from "@/lib/ko-text"
import { cn } from "@/lib/utils"
import type { ElementType, ReactNode } from "react"

type BalancedTextProps = {
  as?: ElementType
  className?: string
  /** 의도한 줄 나눔 — 각 항목이 block으로 렌더됩니다. */
  lines?: (string | ReactNode)[]
  children?: ReactNode
}

// 한글 줄바꿈 최적화 텍스트 — 고정 br 대신 사용합니다.
export function BalancedText({ as: Component = "span", className, lines, children }: BalancedTextProps) {
  if (lines && lines.length > 0) {
    return (
      <Component className={className}>
        {lines.map((line, index) => (
          <span key={index} className={cn("block", KO_TEXT_BALANCE_CLASS)}>
            {line}
          </span>
        ))}
      </Component>
    )
  }

  return <Component className={cn(KO_TEXT_BALANCE_CLASS, className)}>{children}</Component>
}
