import type { Metadata } from "next"
import { SiteFooter } from "@/components/site-footer"
import { brandCopy } from "@/lib/event-config"
import "./globals.css"

export const metadata: Metadata = {
  title: "OranDe Run | 오랜디런",
  description: brandCopy.metaDescription,
  generator: "v0.dev"
}

// 전역 폰트/스타일을 적용하는 루트 레이아웃입니다.
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
      </head>
      <body className="font-sans text-ko">
        {/* 본문으로 건너뛰기 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-orange-500 focus:text-white focus:rounded-lg focus:font-semibold"
        >
          본문으로 건너뛰기
        </a>
        <main id="main-content" className="min-h-screen bg-background">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}
