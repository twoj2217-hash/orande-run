"use client"

import { SiteFooter } from "@/components/site-footer"
import { usePathname } from "next/navigation"

// 신청 페이지는 하단 고정 CTA와 겹치지 않도록 푸터를 숨깁니다.
export function LayoutFooter() {
  const pathname = usePathname()

  if (pathname === "/apply") return null

  return <SiteFooter />
}
