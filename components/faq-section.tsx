"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { faqSections, policyLinks } from "@/lib/event-config"
import { cn } from "@/lib/utils"
import Link from "next/link"

type FaqSectionProps = {
  className?: string
}

// 참가자 FAQ 본문
export function FaqSection({ className }: FaqSectionProps) {
  return (
    <section className={cn("space-y-8", className)} aria-labelledby="faq-heading">
      <div>
        <h1 id="faq-heading" className="text-3xl md:text-4xl font-black text-foreground text-ko-balance">
          참가자 FAQ
        </h1>
        <p className="mt-3 text-sm text-muted-foreground text-ko-balance">
          신청·입금·환불·완주 인증 기준을 한곳에서 확인할 수 있어요.
        </p>
      </div>

      {faqSections.map((section) => (
        <div key={section.id} className="rounded-2xl border border-orange-200 bg-white p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-black text-foreground mb-3">{section.title}</h2>
          {/* 모바일에서 긴 답변도 읽기 쉽도록 아코디언으로 펼침/접힘을 제공합니다. */}
          <Accordion type="single" collapsible className="w-full">
            {section.items.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="border-orange-100">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="flex flex-wrap items-center gap-2 pr-3">
                    <span className="font-semibold text-foreground">{item.question}</span>
                    {item.pending && (
                      <span className="rounded-full border border-orange-300 bg-orange-50 px-2 py-0.5 text-[11px] font-semibold text-orange-700">
                        운영 확정 후 공지
                      </span>
                    )}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm text-muted-foreground break-keep">
                  {item.answerLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}

      <p className="text-sm text-muted-foreground">
        추가 정책은{" "}
        {policyLinks.map((link, index) => (
          <span key={link.href}>
            {index > 0 && " · "}
            <Link href={link.href} className="underline underline-offset-2 hover:text-orange-600">
              {link.label}
            </Link>
          </span>
        ))}
        에서 확인할 수 있어요.
      </p>

      {/* FAQ 확인 직후 바로 신청 단계로 넘어갈 수 있도록 CTA를 제공합니다. */}
      <Link
        href="/apply"
        className="inline-flex h-11 w-full items-center justify-center rounded-[10px] border border-orange-500 bg-orange-500 px-4 text-sm font-semibold text-white hover:border-orange-600 hover:bg-orange-600 sm:w-auto"
      >
        참가 신청하기
      </Link>
    </section>
  )
}
