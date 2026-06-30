"use client"

import { LiquidButton } from "@/components/ui/liquid-glass-button"
import { BalancedText } from "@/components/ui/balanced-text"
import { brandCopy } from "@/lib/event-config"
import { cn } from "@/lib/utils"
import { ChevronDown, Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"

// 히어로 배경 — 단일 컴포지션 (캐러셀 없음)
const HERO_IMAGE = {
  src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-j46TPXDHzpn3M65wMva3qHPNhwokYn.png",
  alt: "어디서든 달리는 러너 — 비대면 버추얼 런"
}

const navItems = [
  { name: "홈", href: "#hero" },
  { name: "이유", href: "#community" },
  { name: "비교", href: "#compare" },
  { name: "방법", href: "#how-to-join" },
  { name: "참여", href: "#join" }
] as const

// 스크롤 스파이용 섹션 ID 목록
const SECTION_IDS = navItems.map((item) => item.href.replace("#", ""))

type NavLinkProps = {
  item: (typeof navItems)[number]
  isActive: boolean
  variant: "hero" | "sticky"
  onNavigate: (href: string) => void
}

// 데스크톱 네비 링크 — 히어로/스티키 바에서 공통 사용
function NavLink({ item, isActive, variant, onNavigate }: NavLinkProps) {
  const isHero = variant === "hero"

  return (
    <button
      type="button"
      onClick={() => onNavigate(item.href)}
      aria-current={isActive ? "true" : undefined}
      className={cn(
        "relative font-medium tracking-wide pb-1 group focus-visible:outline-none focus-visible:ring-2 rounded-sm transition-colors duration-300",
        isHero
          ? "text-white hover:text-orange-50 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-500"
          : "text-sm text-muted-foreground hover:text-orange-600 focus-visible:ring-orange-500",
        isActive && isHero && "text-orange-50 font-bold",
        isActive && !isHero && "text-orange-600 font-bold"
      )}
    >
      {item.name}
      <span
        className={cn(
          "absolute bottom-0 left-0 h-0.5 transition-all duration-300 ease-out",
          isHero ? "bg-orange-100" : "bg-orange-500",
          isActive ? "w-full" : "w-0 group-hover:w-full"
        )}
      />
    </button>
  )
}

// 메인 히어로 — 단일 풀블리드 + 스크롤 힌트 + 스크롤 스파이 네비
export default function HeroSection() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>("#hero")
  const [showStickyNav, setShowStickyNav] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const scrollToSection = useCallback((href: string) => {
    const element = document.querySelector(href)
    if (element) element.scrollIntoView({ behavior: "smooth" })
    setIsMenuOpen(false)
  }, [])

  // 히어로 이탈 시 스티키 네비 표시 + 현재 섹션 하이라이트
  useEffect(() => {
    const heroEl = document.getElementById("hero")
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (sections.length === 0) return

    const heroObserver = new IntersectionObserver(
      ([entry]) => setShowStickyNav(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-72px 0px 0px 0px" }
    )
    if (heroEl) heroObserver.observe(heroEl)

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible.length > 0) {
          setActiveSection(`#${visible[0].target.id}`)
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    )

    sections.forEach((section) => sectionObserver.observe(section))

    return () => {
      heroObserver.disconnect()
      sectionObserver.disconnect()
    }
  }, [])

  // 모바일 메뉴: Esc 닫기 + body 스크롤 잠금
  useEffect(() => {
    if (!isMenuOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", handleKeyDown)
    menuRef.current?.querySelector<HTMLElement>("button")?.focus()

    return () => {
      document.body.style.overflow = ""
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isMenuOpen])

  return (
    <>
      {/* 히어로 밖으로 스크롤하면 나타나는 상단 네비 */}
      <nav
        aria-label="페이지 내비게이션"
        className={cn(
          "fixed top-0 left-0 right-0 z-50 border-b border-orange-200 bg-background/95 backdrop-blur-sm transition-transform duration-300 motion-safe:transition-transform",
          showStickyNav ? "translate-y-0" : "-translate-y-full pointer-events-none"
        )}
      >
        <div className="container mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <span className="font-black text-orange-600 tracking-wider shrink-0">OranDe Run</span>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                item={item}
                isActive={activeSection === item.href}
                variant="sticky"
                onNavigate={scrollToSection}
              />
            ))}
          </div>

          <Link
            href="/apply"
            className="shrink-0 inline-flex h-9 items-center rounded-[10px] bg-orange-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-orange-600 active:bg-orange-600/95"
          >
            참여하기
          </Link>
        </div>
      </nav>

      <div id="hero" className="relative h-screen w-full overflow-hidden bg-orange-500">
        {/* 배경 이미지 */}
        <Image
          src={HERO_IMAGE.src}
          alt={HERO_IMAGE.alt}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* 오렌지 오버레이 — 단일 그라데이션 */}
        <div className="absolute inset-0 bg-orange-500/50" aria-hidden />

        <nav className="relative z-20 flex items-center justify-between p-6 md:p-8" aria-label="주요 메뉴">
          <div className="text-white font-black text-xl tracking-wider drop-shadow-sm">OranDe Run</div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                item={item}
                isActive={activeSection === item.href}
                variant="hero"
                onNavigate={scrollToSection}
              />
            ))}
          </div>

          <button
            ref={menuButtonRef}
            className="md:hidden text-white hover:text-orange-50 transition-colors h-11 w-11 flex items-center justify-center rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {isMenuOpen && (
          <div
            ref={menuRef}
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="모바일 메뉴"
            className="absolute top-0 left-0 w-full h-full bg-orange-600/95 z-30 md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => scrollToSection(item.href)}
                  aria-current={activeSection === item.href ? "true" : undefined}
                  className={cn(
                    "text-2xl font-bold tracking-wider transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 rounded-sm",
                    activeSection === item.href ? "text-orange-100" : "text-white hover:text-orange-50"
                  )}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="relative z-10 flex h-full items-center justify-center px-6 pb-16">
          <div className="text-center text-white max-w-4xl">
            <p className="inline-block mb-4 md:mb-5 rounded-full border border-white/40 bg-white/15 px-4 py-1.5 text-sm font-semibold tracking-wide text-orange-50">
              {brandCopy.heroBadge}
            </p>

            <BalancedText
              as="h1"
              lines={["OranDe", "Run"]}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-wider mb-3 md:mb-4 leading-none drop-shadow-sm"
            />

            <p className="sm:hidden text-base font-semibold tracking-wide mb-6 text-orange-50 text-ko-balance">
              {brandCopy.heroSublineMobile}
            </p>
            <p className="hidden sm:block text-lg md:text-2xl font-semibold tracking-wide mb-6 md:mb-8 text-orange-50 text-ko-balance">
              {brandCopy.heroSubline}
            </p>

            <div className="flex flex-col gap-3 md:flex-row md:gap-4 items-center justify-center">
              <LiquidButton
                asChild
                size="xxl"
                className="font-semibold text-lg tracking-wide bg-orange-500 border border-orange-100/80 hover:bg-orange-600 active:bg-orange-600/95 text-white shadow-sm"
              >
                <Link href="/apply" aria-label="참가 신청 페이지로 이동">
                  오랜디런 참여하기
                </Link>
              </LiquidButton>
              <LiquidButton
                type="button"
                size="xxl"
                onClick={() => scrollToSection("#how-to-join")}
                className="font-semibold text-lg tracking-wide border border-white/60 bg-transparent hover:bg-white/10 active:bg-white/15 text-white"
                aria-label="참여 방식 안내 섹션으로 이동"
              >
                참여 방식 안내
              </LiquidButton>
            </div>
            {/* 정책 탐색 링크를 히어로에 바로 배치해 정보 접근 동선을 줄입니다. */}
            <p className="mt-4 text-sm text-orange-50/95">
              <Link href="/faq" className="underline underline-offset-2 hover:text-white">
                참가자 FAQ
              </Link>
              {" · "}
              <Link href="/terms" className="underline underline-offset-2 hover:text-white">
                참가 약관
              </Link>
            </p>
          </div>
        </div>

        {/* 다음 섹션 스크롤 힌트 */}
        <button
          type="button"
          onClick={() => scrollToSection("#community")}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-white/90 hover:text-white h-11 w-11 flex items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 motion-safe:animate-bounce"
          aria-label="다음 섹션으로 스크롤"
        >
          <ChevronDown size={28} aria-hidden />
        </button>
      </div>
    </>
  )
}
