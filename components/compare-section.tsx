import type { LucideIcon } from "lucide-react"
import { CalendarDays, Coins, Dumbbell, Gift, Users } from "lucide-react"

const feeFormatter = new Intl.NumberFormat("ko-KR")

// OranDe 셀 핵심 키워드 강조 — 밑줄 대신 볼드로 링크 느낌 제거
function CompareHighlight({ children }: { children: React.ReactNode }) {
  return <span className="font-black text-orange-600">{children}</span>
}

type CompareRow = {
  id: string
  label: string
  icon: LucideIcon
  general: string
  renderOranDe: (ctx: { minFee: number; maxFee: number }) => React.ReactNode
}

// 비교표 행 데이터
const compareRows: CompareRow[] = [
  {
    id: "schedule",
    label: "일정",
    icon: CalendarDays,
    general: "정해진 날짜/시간 중심",
    renderOranDe: () => (
      <>
        <CompareHighlight>4주</CompareHighlight> 동안 내가 원할 때{" "}
        <CompareHighlight>언제든지</CompareHighlight>
      </>
    )
  },
  {
    id: "place",
    label: "장소",
    icon: Dumbbell,
    general: "대회 코스/현장 중심",
    renderOranDe: () => (
      <>
        집 앞 <CompareHighlight>공원</CompareHighlight>도, 헬스장 <CompareHighlight>런닝머신</CompareHighlight>도 OK
      </>
    )
  },
  {
    id: "fee",
    label: "참가비",
    icon: Coins,
    general: "3만원 이상 + 이동 비용",
    renderOranDe: ({ minFee, maxFee }) => (
      <>
        코스별 <CompareHighlight>{feeFormatter.format(minFee)}원</CompareHighlight> ~{" "}
        <CompareHighlight>{feeFormatter.format(maxFee)}원</CompareHighlight>
      </>
    )
  },
  {
    id: "reward",
    label: "기념품",
    icon: Gift,
    general: "메달/티셔츠 중심",
    renderOranDe: () => (
      <>
        어디서도 못 구하는 &apos;<CompareHighlight>한정판 키캡키링</CompareHighlight>&apos;
      </>
    )
  },
  {
    id: "vibe",
    label: "분위기",
    icon: Users,
    general: "현장 몰입감 중심",
    renderOranDe: () => (
      <>
        따로 또 같이! <CompareHighlight>랜선</CompareHighlight>으로 주고받는 <CompareHighlight>응원</CompareHighlight>
      </>
    )
  }
]

type CompareSectionProps = {
  minFee: number
  maxFee: number
}

// PC 표 + 모바일 카드 비교 섹션
export default function CompareSection({ minFee, maxFee }: CompareSectionProps) {
  const feeContext = { minFee, maxFee }

  return (
    <section id="compare" className="relative py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="text-4xl md:text-6xl font-black tracking-wider mb-5 text-foreground text-ko-balance">
            기존 대회와 뭐가 다를까?
          </h2>
          <p className="text-lg md:text-2xl text-muted-foreground text-ko-balance">
            뻔한 대회 말고, 내 페이스에 맞는 레이스
          </p>
        </div>

        {/* PC: 가운데 정렬 표 — OranDe 열 강조 */}
        <div className="hidden md:block rounded-3xl border border-orange-200 bg-white overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="text-foreground">
              <tr>
                <th className="text-center align-middle p-4 font-bold bg-white text-ko w-[22%]">항목</th>
                <th className="text-center align-middle p-4 font-bold bg-muted/50 text-muted-foreground text-ko w-[34%]">
                  일반 대회
                </th>
                <th className="text-center align-middle p-4 font-black bg-orange-50 text-orange-900 text-ko w-[44%]">
                  OranDe Run
                </th>
              </tr>
            </thead>
            <tbody className="text-sm md:text-base">
              {compareRows.map((row) => {
                const Icon = row.icon
                return (
                  <tr key={row.id} className="border-t border-orange-100">
                    <td className="p-4 font-semibold text-foreground text-ko text-center align-middle">
                      <span className="flex items-center justify-center gap-2">
                        <Icon className="w-4 h-4 text-orange-500 shrink-0" aria-hidden />
                        {row.label}
                      </span>
                    </td>
                    <td className="p-4 bg-muted/30 text-muted-foreground/70 text-ko text-center align-middle">
                      {row.general}
                    </td>
                    <td className="p-4 bg-orange-50 font-semibold text-foreground text-ko text-center align-middle shadow-[inset_0_0_0_2px_rgba(251,146,60,0.25)]">
                      {row.renderOranDe(feeContext)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* 모바일: 행별 카드 스택 */}
        <div className="md:hidden space-y-4">
          {compareRows.map((row) => {
            const Icon = row.icon
            return (
              <article
                key={row.id}
                className="rounded-2xl border border-orange-200 bg-white overflow-hidden shadow-sm"
              >
                <header className="flex items-center justify-center gap-2 p-4 border-b border-orange-100 bg-white">
                  <Icon className="w-5 h-5 text-orange-500 shrink-0" aria-hidden />
                  <h3 className="font-black text-foreground text-lg">{row.label}</h3>
                </header>

                <div className="p-4 bg-muted/30 text-center">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">일반 대회</p>
                  <p className="text-sm text-muted-foreground/80 text-ko-balance">{row.general}</p>
                </div>

                <div className="p-4 bg-orange-50 text-center border-t border-orange-200">
                  <p className="text-xs font-black text-orange-700 mb-2">OranDe Run</p>
                  <p className="text-sm font-semibold text-foreground text-ko-balance">
                    {row.renderOranDe(feeContext)}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
