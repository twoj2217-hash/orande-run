import HeroSection from "@/components/hero-section"
import CompareSection from "@/components/compare-section"
import { KeycapKeyringRewardSection } from "@/components/keycap-keyring-reward-section"
import { Timeline } from "@/components/ui/timeline"
import CTASection from "@/components/cta-section"
import { ParticipationGuideSection } from "@/components/participation-guide-section"
import { RecruitmentBanner } from "@/components/recruitment-banner"
import {
  getRecruitmentPeriodLabel,
  getRunEndLabel,
  getRunPeriodLabel,
  getRunStartLabel,
  rewardDeliveryNote,
  runTiers,
  SCHEDULE_TBD_LABEL,
  eventSchedule
} from "@/lib/event-config"
import { cn } from "@/lib/utils"
import Link from "next/link"

const feeFormatter = new Intl.NumberFormat("ko-KR")

// 홈페이지 섹션을 한 페이지로 구성하는 메인 진입 컴포넌트입니다.
export default function Page() {
  const minFee = Math.min(...runTiers.map((tier) => tier.fee))
  const maxFee = Math.max(...runTiers.map((tier) => tier.fee))
  const runPeriodLabel =
    getRunStartLabel() === SCHEDULE_TBD_LABEL || getRunEndLabel() === SCHEDULE_TBD_LABEL
      ? getRunPeriodLabel()
      : `${getRunStartLabel()} ~ ${getRunEndLabel()} · ${eventSchedule.participationWeeks}주 챌린지`

  const timelineEntries = [
    {
      id: 1,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-RJ3iTXUn5SUexF6nHMZYhMoQLNCboK.png",
      alt: "실내 러닝머신으로 달리는 러너",
      title: "날씨 걱정 없이,\n실내에서도 똑같이",
      description: "비 오는 날도, 한낮 폭염도 러닝을 미루지 않아도 돼요. 누구나 어디서든 달릴 수 있어요.",
      layout: "left" as const
    },
    {
      id: 2,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-LN9OPh9hw0b9rwSPRSslHoejcfoKHe.png",
      alt: "자신만의 페이스로 달리는 러너",
      title: "내 스케줄에 맞춰,\n원하는 시간에",
      description:
        "출퇴근 전후 언제든 상관없어요. 4주 동안 원하는 만큼 나누어 달릴 수 있습니다.",
      layout: "right" as const
    },
    {
      id: 3,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-1FdGyjVpWQANGzsDWpoPIvF5SVI2za.png",
      alt: "랜선으로 함께 달리는 러너",
      title: "외롭지 않게,\n랜선으로 달리기",
      description: "SNS 인증으로 서로 응원을 주고받으며, 이웃들과 함께 달려요.",
      layout: "left" as const
    }
  ]

  return (
    <>
      <HeroSection />

      <div className="container mx-auto px-6 pt-6 max-w-4xl">
        <RecruitmentBanner />
      </div>

      <section
        id="community"
        aria-labelledby="community-heading"
        className="relative py-20 bg-orange-50/50"
      >
        <div className="relative z-10">
          <div className="container mx-auto px-6 mb-16">
            <div className="text-center">
              <h2
                id="community-heading"
                className="text-4xl md:text-6xl font-black tracking-wider mb-6 text-foreground text-ko-balance"
              >
                왜 버추얼 런일까?
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-ko-balance break-keep">
                내 일정에 맞게 뛸 수 있어요.
              </p>
            </div>
          </div>
          <Timeline entries={timelineEntries} />
        </div>
      </section>

      <CompareSection minFee={minFee} maxFee={maxFee} />

      <section
        id="how-to-join"
        aria-labelledby="how-to-join-heading"
        className="relative py-20 bg-background"
      >
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <h2
              id="how-to-join-heading"
              className="text-4xl md:text-6xl font-black tracking-wider mb-10 text-foreground text-ko-balance"
            >
              참여 방식
            </h2>
          </div>

          {/* 모집·참여 기간 — CTA 통계와 같은 타이포 스트립 (테두리 카드 없음) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12 max-w-4xl mx-auto text-center">
            <div>
              <p className="text-sm text-orange-600 font-semibold mb-2">모집 기간</p>
              {/* 두 칸 밑줄이 어긋나지 않게 동일 높이를 맞춥니다. */}
              <div className="border-b-2 border-orange-300 pb-3 min-h-[56px] flex items-center justify-center">
                <p className="text-xl md:text-2xl font-black text-foreground text-ko-balance break-keep">
                  {getRecruitmentPeriodLabel()}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-orange-600 font-semibold mb-2">참여 기간</p>
              <div className="border-b-2 border-orange-300 pb-3 min-h-[56px] flex items-center justify-center">
                <p className="text-xl md:text-2xl font-black text-foreground text-ko-balance break-keep">
                  {runPeriodLabel}
                </p>
              </div>
            </div>
          </div>

          {/* 완주 리워드 사진을 먼저 보여줘서 참여자가 결과물을 한눈에 확인할 수 있게 합니다. */}
          <KeycapKeyringRewardSection />

          <div className="max-w-4xl mx-auto text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-black text-foreground mb-3 text-ko-balance">
              코스 신청
            </h3>
          </div>

          {/* 모바일: 가로 스크롤 / 데스크톱: 3열 (70km 추천 강조) */}
          <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 mb-6 overflow-x-auto snap-x snap-mandatory pb-2 md:pb-0 md:overflow-visible -mx-6 px-6 md:mx-0 md:px-0">
            {runTiers.map((tier) => (
              <article
                key={tier.id}
                className={cn(
                  "interactive-card flex-shrink-0 w-[85vw] sm:w-[320px] md:w-auto snap-center rounded-2xl border bg-white p-6 shadow-sm",
                  tier.recommended
                    ? "border-orange-400 ring-2 ring-orange-400/40 md:scale-[1.03] md:z-10"
                    : "border-orange-200"
                )}
              >
                {tier.recommended && (
                  <span className="inline-block mb-2 text-xs font-bold px-2 py-0.5 rounded-full bg-orange-500 text-white">
                    추천
                  </span>
                )}
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-orange-600 font-semibold">{tier.weeklyGuide}</p>
                  {/* 신청 카드에서는 텍스트 뱃지로 코스별 구성을 빠르게 비교하게 합니다. */}
                  <span className="text-sm font-semibold px-3 py-1 rounded-full bg-orange-100 text-orange-700">
                    {tier.rewardGuide}
                  </span>
                </div>
                <h3 className="text-3xl font-black text-foreground mb-2">{tier.label}</h3>
                <p className="text-xl font-bold text-orange-600 mb-4">{feeFormatter.format(tier.fee)}원</p>
                <Link
                  href={`/apply?tier=${tier.id}`}
                  className="inline-flex items-center justify-center w-full h-11 rounded-[10px] border border-orange-300 bg-white text-orange-700 font-semibold text-sm transition-colors hover:border-orange-400 hover:bg-orange-50"
                >
                  이 코스로 신청
                </Link>
              </article>
            ))}
          </div>
          {/* 발송 안내는 코스 카드별 중복 대신 섹션에서 한 번만 표시합니다. */}
          <p className="text-xs text-muted-foreground text-center mb-10 max-w-4xl mx-auto">
            {rewardDeliveryNote}
          </p>

          {/* 단계/정책/문의를 한 카드로 통합해 읽기 흐름을 단순화합니다. */}
          <ParticipationGuideSection className="max-w-4xl mx-auto mt-4" />
        </div>
      </section>

      <CTASection />
    </>
  )
}
