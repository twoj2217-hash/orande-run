import { ApplyPageContent } from "@/app/apply/apply-page-content"
import { Suspense } from "react"

// useSearchParams를 쓰는 폼 본문 로딩 전 스켈레톤
function ApplyPageSkeleton() {
  return (
    <div className="min-h-screen bg-orange-50/80">
      <div className="container mx-auto px-6 py-10 max-w-2xl animate-pulse">
        <div className="h-4 w-32 bg-orange-100 rounded mb-6" />
        <div className="h-10 w-64 bg-orange-100 rounded mb-2" />
        <div className="h-4 w-48 bg-orange-100 rounded mb-8" />
        <div className="space-y-6">
          <div className="h-32 bg-orange-100 rounded-2xl" />
          <div className="h-48 bg-orange-100 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

// 참가 신청 페이지 — Suspense로 searchParams 분리
export default function ApplyPage() {
  return (
    <Suspense fallback={<ApplyPageSkeleton />}>
      <ApplyPageContent />
    </Suspense>
  )
}
