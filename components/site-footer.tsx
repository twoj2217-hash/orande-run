import { brandCopy, policyLinks } from "@/lib/event-config"
import Link from "next/link"

// 전역 푸터 — 홈·신청 페이지 공통으로 브랜드 출처를 표시합니다.
export function SiteFooter() {
  return (
    <footer className="border-t border-orange-200 bg-orange-50/50 py-8">
      <div className="container mx-auto px-6 text-center">
        <p className="text-sm text-muted-foreground font-medium text-ko-balance">{brandCopy.footerOrigin}</p>
        <p className="text-xs text-muted-foreground mt-2">{brandCopy.officialApplyNotice}</p>
        {/* 푸터에서 FAQ/법적 문서로 바로 이동할 수 있게 고정 링크를 제공합니다. */}
        <p className="mt-2 text-xs text-muted-foreground">
          {policyLinks.map((link, index) => (
            <span key={link.href}>
              {index > 0 && " · "}
              <Link href={link.href} className="underline underline-offset-2 hover:text-orange-600">
                {link.label}
              </Link>
            </span>
          ))}
        </p>
        <p className="text-xs text-muted-foreground/80 mt-2">{brandCopy.footerBrand}</p>
      </div>
    </footer>
  )
}
