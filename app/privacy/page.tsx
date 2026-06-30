import { policyLinks, privacyPolicyContent } from "@/lib/event-config"
import Link from "next/link"

// 개인정보 처리방침 페이지 — 신청 폼 동의 항목과 동일한 기준을 노출합니다.
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-orange-50/60 py-10 md:py-14">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6">
        {/* 정책 확인 후 즉시 랜딩/신청으로 이동할 수 있는 상단 CTA */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-[10px] border border-orange-200 bg-white px-4 text-sm font-semibold text-muted-foreground hover:border-orange-300 hover:text-orange-600"
          >
            랜딩으로 돌아가기
          </Link>
          <Link
            href="/apply"
            className="inline-flex h-11 items-center justify-center rounded-[10px] border border-orange-500 bg-orange-500 px-4 text-sm font-semibold text-white hover:bg-orange-600 hover:border-orange-600"
          >
            신청 계속하기
          </Link>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-foreground text-ko-balance">개인정보 처리방침</h1>
        <p className="mt-2 text-sm text-muted-foreground">시행일: {privacyPolicyContent.effectiveDate}</p>

        <div className="mt-6 space-y-4">
          {privacyPolicyContent.sections.map((section) => (
            <section key={section.title} className="rounded-2xl border border-orange-200 bg-white p-4 md:p-6">
              <h2 className="text-lg font-black text-foreground mb-2">{section.title}</h2>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2">
                    <span aria-hidden>·</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          {policyLinks.map((link, index) => (
            <span key={link.href}>
              {index > 0 && " · "}
              <Link href={link.href} className="underline underline-offset-2 hover:text-orange-600">
                {link.label}
              </Link>
            </span>
          ))}
        </p>
      </div>
    </div>
  )
}
