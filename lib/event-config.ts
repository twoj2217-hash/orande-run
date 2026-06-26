// 회차 운영 정보는 이 파일에서만 수정하도록 분리합니다.

// 브랜드 카피 — 히어로 뱃지·푸터·메타 설명을 한곳에서 관리합니다.
export const brandCopy = {
  // 히어로 상단 뱃지
  heroBadge: "대전 로컬 · 제1회",
  // 전역 푸터 — 당근 모임 출처 안내
  footerOrigin: "당근 모임에서 시작된 버추얼 러닝",
  footerBrand: "OranDe Run · 오랜디런",
  // 카톡·SNS 링크 미리보기용
  metaDescription:
    "비대면 버추얼 런, 누구나 참여. 대전 제1회 오랜디런 — 대전 버추얼 런, 뻔한 메달 말고 특별한 선물",
  // 히어로 서브카피
  heroSubline: "비대면 버추얼 런 — 누구나, 내 페이스로",
  heroSublineMobile: "비대면 버추얼 런, 누구나 참여"
} as const

// 모집·참여 일정 — 회차별로 아래만 수정하세요
export const eventSchedule = {
  recruitment: {
    start: "2026. 6. 29",
    end: "2026. 7. 5"
  },
  runStart: "2026. 7. 13",
  runEnd: "2026. 8. 9",
  participationWeeks: 4,
  // 완주 인증 마감 (챌린지 종료 후 7일)
  verificationEnd: "2026. 8. 16"
}

// 일정 미확정 시 화면에 보여줄 대체 문구입니다.
export const SCHEDULE_TBD_LABEL = "곧 공지"

// TBD를 사용자 친화 문구로 바꿉니다.
export function formatScheduleDate(value: string): string {
  if (value === "TBD") return SCHEDULE_TBD_LABEL
  return value
}

// 모집 기간 한 줄 라벨 (How·Join 섹션 공통)
export function getRecruitmentPeriodLabel(): string {
  const start = formatScheduleDate(eventSchedule.recruitment.start)
  const end = formatScheduleDate(eventSchedule.recruitment.end)
  return `${start} ~ ${end}`
}

// 참여 시작일 라벨
export function getRunStartLabel(): string {
  return formatScheduleDate(eventSchedule.runStart)
}

// 참여 종료일 라벨 (runEnd 미설정 시 시작일 + participationWeeks 로 계산)
export function getRunEndLabel(): string {
  if (eventSchedule.runEnd && eventSchedule.runEnd !== "TBD") {
    return formatScheduleDate(eventSchedule.runEnd)
  }

  const startDate = parseScheduleDate(eventSchedule.runStart)
  if (!startDate) return SCHEDULE_TBD_LABEL

  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + eventSchedule.participationWeeks * 7 - 1)
  return `${endDate.getFullYear()}. ${endDate.getMonth() + 1}. ${endDate.getDate()}`
}

// 참여 기간 한 줄 라벨 (랜딩·신청 폼)
export function getRunPeriodLabel(): string {
  const start = getRunStartLabel()
  const end = getRunEndLabel()

  if (start === SCHEDULE_TBD_LABEL || end === SCHEDULE_TBD_LABEL) {
    return `${start} · ${eventSchedule.participationWeeks}주 챌린지`
  }

  return `${start} ~ ${end} · ${eventSchedule.participationWeeks}주`
}

// 완주 인증 마감일 라벨
export function getVerificationEndLabel(): string {
  return formatScheduleDate(eventSchedule.verificationEnd)
}

// 키캡키링 발송 예상 시점 안내
export const rewardDeliveryNote = "챌린지 종료 후 2주 이내 발송 예정"

/** 코스별 키캡키링 개수 라벨 (예: 키캡키링 2구) */
export function formatKeycapKeyringLabel(pieces: number): string {
  return `키캡키링 ${pieces}구`
}

// 완주 리워드 안내에 사용하는 원본 포스터 정보입니다.
export const keycapKeyringPoster = {
  src: "/images/keyring/poster.png",
  alt: "오랜디런 완주 리워드 키캡키링 포스터",
  width: 1024,
  height: 1536
} as const

// 4주 챌린지 코스/가격/굿즈 정보를 한곳에서 관리합니다.
export const runTiers = [
  {
    id: "50k",
    label: "50km",
    distanceKm: 50,
    fee: 5000,
    rewardPieces: 2,
    rewardGuide: "키캡키링 2구",
    weeklyGuide: "주 12~13km",
    recommended: false
  },
  {
    id: "70k",
    label: "70km",
    distanceKm: 70,
    fee: 7000,
    rewardPieces: 3,
    rewardGuide: "키캡키링 3구",
    weeklyGuide: "주 17~18km",
    recommended: true
  },
  {
    id: "100k",
    label: "100km",
    distanceKm: 100,
    fee: 10000,
    rewardPieces: 4,
    rewardGuide: "키캡키링 4구",
    weeklyGuide: "주 25km",
    recommended: false
  }
] as const

export type RunTierId = (typeof runTiers)[number]["id"]

// 랜딩페이지 참여 절차 안내 텍스트입니다.
export const participationSteps = [
  "모집 기간에 코스 선택 후 참가비 결제",
  "참여 시작일 안내 후 4주 동안 거리 채우기",
  "완주 기록 인증 (인스타 해시태그 또는 운영진 메일)",
  "인증 확인 뒤 티어별 키캡키링 발송"
] as const

// 지역 — UI는 2단 선택, 저장·시트 표기는 "대전/서구" 형식
export const locationCities = [
  { id: "daejeon", label: "대전" },
  { id: "outside", label: "대전 외" }
] as const

export type LocationCityId = (typeof locationCities)[number]["id"]

// 대전 5개 구
export const daejeonDistricts = ["동구", "중구", "서구", "유성구", "대덕구"] as const

export type DaejeonDistrict = (typeof daejeonDistricts)[number]

/** 시·구를 "대전/서구" 문자열로 조합 */
export function formatLocationLabel(
  cityId: LocationCityId,
  district?: string,
  outsideRegion?: string
): string {
  if (cityId === "outside") {
    const normalizedOutsideRegion = outsideRegion?.trim()
    // 대전 외 선택 시에는 "대전 외/부산" 형태로 저장합니다.
    return normalizedOutsideRegion ? `대전 외/${normalizedOutsideRegion}` : "대전 외"
  }
  return district ? `대전/${district}` : ""
}

// 대전 외 직접 입력란 카피
export const outsideRegionCopy = {
  label: "어느 지역에 사세요?",
  placeholder: "예: 부산, 경기 수원, 서울 마포구"
} as const

// 러닝 선호 요일·시간 (신청 폼 — 모두 선택 사항)
export const runningDayOptions = ["월", "화", "수", "목", "금", "토", "일"] as const

export type RunningDay = (typeof runningDayOptions)[number]

// 참고용 시간 칩 — 클릭 시 입력란에 붙여 넣기만 함 (필수 아님)
export const runningTimeSuggestions = [
  "19시 이후",
  "19~21시",
  "21시 이후",
  "주말 오전",
  "새벽 러닝"
] as const

// 러닝 계획 섹션 카피
export const runningPreferenceCopy = {
  sectionTitle: "러닝 계획",
  sectionHint:
    "참가 안내에 참고해요. 안 적어도 참가에 문제없고, 정해진 시간에 뛰실 필요는 없어요.",
  daysLabel: "선호 요일",
  daysOptional: "(선택)",
  timeLabel: "선호 시간",
  timeOptional: "(선택)",
  timePlaceholder: "예: 평일 퇴근 후 8시, 주말 오전",
  suggestionsLabel: "참고 예시 — 눌러서 입력란에 추가"
} as const

// 완주 인증 안내 — 배포 전 email을 실제 운영진 메일로 교체하세요
export const verificationConfig = {
  hashtags: ["#오랜디런", "#OranDeRun"],
  email: "운영진@example.com",
  emailSubjectTemplate: "[오랜디런 인증] {name}_{tier}_{date}",
  deadlineNote: "챌린지 종료 후 7일 이내 (8/16까지)",
  // 인증 기간(8/10~8/16)에 추가로 달린 기록도 완주로 인정
  graceNote:
    "8/9까지 코스 거리를 채우지 못했다면, 8/16까지 남은 거리를 달린 뒤 그 기록을 인증해 주세요. 인증 기간 안에 제출된 기록은 완주로 인정합니다."
} as const

// 키캡키링 발송지 입력 섹션 카피
export const shippingAddressCopy = {
  sectionTitle: "키캡키링 발송지",
  sectionHint:
    "완주 리워드 키캡키링을 받을 주소예요. 거주 지역과 다르면 실제 수령 주소를 입력해 주세요.",
  detailPlaceholder: "동·호수, 공동현관 비밀번호 등"
} as const

// 개인정보 동의 요약 (체크박스 보조 문구)
export const privacyConsentSummary =
  "이름, 연락처, 지역, 발송지 주소, 러닝 계획(선택) 수집·참가 안내·리워드 발송·운영 목적, 챌린지 종료 후 1년 보관"

// 신청 완료자 전용 진행 안내 카피
export const participantGuide = {
  title: "오랜디런 진행 안내",
  intro: "신청해 주셔서 감사해요. 앞으로 이렇게 진행됩니다.",
  steps: [
    { phase: "1", title: "참가비 입금", body: "안내 계좌로 입금해 주세요. 확인 후 참가가 확정돼요." },
    { phase: "2", title: "4주 버추얼 런", body: "각자 페이스로 달리면 돼요. 러닝머신·공원 어디서든 OK." },
    {
      phase: "3",
      title: "혼자도 좋고, 함께도 좋아요",
      body: "혼자 편하게 달려도 괜찮아요. 원하시면 비슷한 동네·시간대 참가자와 소규모 톡방 연결을 안내해 드려요. 참여는 선택 사항이에요.",
      // compact 모달용 짧은 요약
      bodyCompact:
        "원하시면 비슷한 동네·시간대 참가자 소규모 톡방 연결을 안내해 드려요. (선택)"
    },
    { phase: "4", title: "완주 인증", body: "SNS 해시태그 또는 메일로 기록을 보내 주세요." },
    { phase: "5", title: "키캡키링 발송", body: "인증 확인 후 코스별 키캡키링을 보내 드려요." }
  ],
  togetherNote: "위 안내는 모두 선택 사항이에요. 편한 방식으로만 참여해 주세요."
} as const

// 수동 입금 안내
export const paymentInfo = {
  bank: "카카오뱅크",
  accountNumber: "3333-3779-35707",
  accountHolder: "오랜디런"
} as const

// 문의처 — 카카오톡 오픈채팅
export const supportContact = {
  label: "카카오톡 오픈채팅",
  // 오픈채팅 방 표기와 동일한 이름으로 노출
  displayName: "OranDe Run 문의",
  // 문의 오픈채팅 링크 (운영 링크)
  openChatUrl: "https://open.kakao.com/o/s069CjBi"
} as const

// 참가 운영 안내 (중복 참여·취소·코스 변경)
export const participationPolicyBullets = [
  "1인 1코스만 참여할 수 있어요. (예: 50km 신청 후 70km·100km 추가 신청 불가)",
  "신청 후 취소·코스 변경은 카카오톡으로 문의해 주세요.",
  "입금 확인 전 문의 시 변경·취소가 수월합니다."
] as const

// 모집 상태 — false로 두면 신청 차단 (운영자 수동 스위치)
export const recruitmentManualOpen = true

export type RecruitmentStatus = "open" | "upcoming" | "closed" | "tbd"

/** 일정 문자열을 Date로 파싱 (예: "2026. 7. 1", "2026-07-01") */
function parseScheduleDate(value: string): Date | null {
  if (value === "TBD") return null
  const normalized = value.replace(/\./g, "-").replace(/\s+/g, "").replace(/-+/g, "-")
  const parsed = new Date(normalized)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

/** 오늘 0시 기준 Date */
function startOfToday(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

/** 현재 모집 상태 판정 */
export function getRecruitmentStatus(): RecruitmentStatus {
  if (!recruitmentManualOpen) return "closed"

  const { start, end } = eventSchedule.recruitment
  if (start === "TBD" || end === "TBD") return "tbd"

  const startDate = parseScheduleDate(start)
  const endDate = parseScheduleDate(end)
  if (!startDate || !endDate) return "tbd"

  const today = startOfToday()
  if (today < startDate) return "upcoming"
  if (today > endDate) return "closed"
  return "open"
}

/** 배너에 쓸 제목·본문·톤 (open이면 null) */
export type RecruitmentBannerContent = {
  title: string
  body: string
  tone: "info" | "warm" | "closed"
}

/** 랜딩·신청 폼 상단 배너 (open이면 숨김) */
export function getRecruitmentBannerContent(): RecruitmentBannerContent | null {
  const status = getRecruitmentStatus()
  switch (status) {
    case "tbd":
      return {
        title: "모집 일정 곧 공지",
        body: "일정이 확정되면 이 페이지에서 바로 신청할 수 있어요. 미리 둘러보고 코스만 골라 두셔도 좋아요.",
        tone: "info"
      }
    case "upcoming":
      return {
        title: "모집이 곧 열려요",
        body: `${getRecruitmentPeriodLabel()} 예정이에요. 미리 신청해 두시면 시작일에 안내드릴게요.`,
        tone: "warm"
      }
    case "closed":
      return {
        title: "이번 회차 모집 마감",
        body: "다음 오랜디런 소식은 이 페이지에서 공지할 예정이에요. 조금만 기다려 주세요.",
        tone: "closed"
      }
    case "open":
      return null
  }
}

/** @deprecated getRecruitmentBannerContent 사용 */
export function getRecruitmentBannerMessage(): string | null {
  const content = getRecruitmentBannerContent()
  return content ? `${content.title}. ${content.body}` : null
}
