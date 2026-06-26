import { brandCopy } from "@/lib/event-config"

// 전역 푸터 — 홈·신청 페이지 공통으로 브랜드 출처를 표시합니다.
export function SiteFooter() {
  return (
    <footer className="border-t border-orange-200 bg-orange-50/50 py-8">
      <div className="container mx-auto px-6 text-center">
        <p className="text-sm text-muted-foreground font-medium text-ko-balance">{brandCopy.footerOrigin}</p>
        <p className="text-xs text-muted-foreground/80 mt-2">{brandCopy.footerBrand}</p>
      </div>
    </footer>
  )
}
