import { FaqSection } from "@/components/faq-section"
import Link from "next/link"

// 참가자 FAQ 페이지
export default function FaqPage() {
  return (
    <div className="min-h-screen bg-orange-50/60 py-10 md:py-14">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6">
        <Link href="/" className="text-sm text-muted-foreground underline underline-offset-2 hover:text-orange-600">
          랜딩으로 돌아가기
        </Link>
        <FaqSection className="mt-4" />
      </div>
    </div>
  )
}
