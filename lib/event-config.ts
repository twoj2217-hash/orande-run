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
  heroSubline: "비대면 버추얼 런 — 대전 외 지역도, 내 페이스로",
  heroSublineMobile: "비대면 버추얼 런, 전국 어디서든 참여",
  // 사칭·외부 결제 링크 혼선을 줄이기 위한 신뢰 문구
  officialApplyNotice: "공식 신청은 이 페이지에서만 진행합니다."
} as const

// 모집·참여 일정 — 회차별로 아래만 수정하세요
export const eventSchedule = {
  recruitment: {
    start: "2026. 7. 1",
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

// 정책 미확정 값을 한곳에서 관리해 FAQ/랜딩/신청 문구를 일치시킵니다.
export const POLICY_TBD_VALUE = "TBD"
export const POLICY_TBD_LABEL = "운영 확정 후 공지"

/** 정책 문구가 TBD면 사용자 친화 라벨로 변환합니다. */
export function formatPolicyValue(value: string): string {
  if (value === POLICY_TBD_VALUE) return POLICY_TBD_LABEL
  return value
}

/** 정책 문구가 미확정 상태인지 확인합니다. */
export function isPolicyPending(value: string): boolean {
  return value === POLICY_TBD_VALUE
}

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
  "모집 기간에 코스 선택 후 참가비 입금",
  "참여 시작일 안내 후 4주 동안 거리 채우기",
  "완주 기록 인증 (인스타 해시태그 또는 인스타 DM)",
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

// 완주 인증 안내 — 보조 제출 경로는 인스타 DM 기준으로 안내합니다.
export const verificationConfig = {
  hashtags: ["#오랜디런", "#OranDeRun"],
  deadlineNote: "챌린지 종료 후 7일 이내 (8/16까지)",
  // 인증 기간(8/10~8/16)에 추가로 달린 기록도 완주로 인정
  graceNote:
    "8/9까지 코스 거리를 채우지 못했다면, 8/16까지 남은 거리를 달린 뒤 그 기록을 인증해 주세요. 인증 기간 안에 제출된 기록은 완주로 인정합니다."
} as const

// SNS 채널 — 인스타 계정 확정 시 여기만 교체하면 됩니다.
export const socialLinks = {
  instagram: "https://www.instagram.com/orande.run?utm_source=qr&igsh=MW9iY3czaG56Z2w0dA==",
  instagramHandle: "@orande.run",
  hashtags: ["#오랜디런", "#OranDeRun"]
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

// 문의처 — 카카오톡 오픈채팅
export const supportContact = {
  label: "카카오톡 오픈채팅",
  // 오픈채팅 방 표기와 동일한 이름으로 노출
  displayName: "OranDe Run 문의",
  // 문의 오픈채팅 링크 (운영 링크)
  openChatUrl: "https://open.kakao.com/o/s069CjBi",
  // 문의 응답시간 편차를 줄이기 위한 안내 기준
  responseSla: "기본 응답 목표 24시간 이내"
} as const

// 입금·확정 정책 — FAQ/랜딩/모달 공통으로 재사용합니다.
export const depositPolicy = {
  // 신청 접수 후 24시간 안에 입금이 없으면 자동으로 신청이 취소됩니다.
  confirmationSla: "신청 접수 후 24시간 이내에 입금하지 않으시면 자동으로 신청이 취소됩니다.",
  // 소규모 수동 운영 기준: 신청 후 24시간 내 입금
  paymentDeadline: "신청 후 24시간 이내 입금해 주세요.",
  // 24시간 미입금은 자동 취소하되 재신청은 허용
  autoCancelRule: "신청 후 24시간 내 미입금 시 자동 취소되며, 다시 신청할 수 있어요.",
  depositorNameMismatchGuide:
    "입금자명이 신청자명과 다르면 확인이 늦어질 수 있어요. 문의방에 신청자명/입금자명/코스를 남겨 주세요."
} as const

// 취소·환불 정책 — FAQ/약관/신청 안내에서 동일 기준으로 사용합니다.
export const refundPolicy = {
  // 환불은 입금 확인 시점과 모집 마감 시점을 기준으로 고정
  summary:
    "입금 확인 전에는 전액 취소 가능해요. 입금 확인 후에는 모집 마감 전까지만 환불 가능하며, 모집 마감 후에는 환불이 어려워요.",
  // 코스 변경은 입금 전 자유, 입금 후 모집 마감 전 1회만 허용
  courseChangeRule: "입금 확인 전에는 자유롭게 변경 가능하고, 입금 확인 후에는 모집 마감 전 1회 문의로 변경할 수 있어요.",
  beforePaymentGuide: "변경·취소 요청은 입금 확인 전에 문의해 주시면 가장 빠르게 처리돼요."
} as const

// 완주·미완주 정책 — FAQ와 인증 가이드에서 동일하게 안내합니다.
export const completionPolicy = {
  // 현재 운영 가이드에서 확정된 항목
  completionDeadlineRule: "인증 마감(8/16)까지 목표 거리를 채워 제출하면 완주로 인정해요.",
  // 장소 제약 없이 참여할 수 있도록 러닝머신 기록도 인정
  treadmillRule: "가능해요. 러닝 앱 또는 운동 기록 화면으로 누적 거리를 확인할 수 있으면 인정해요.",
  // 인증 마감일까지 거리 미달이면 완주 리워드는 지급하지 않음
  underTargetRule:
    "인증 마감일(8/16)까지 목표 거리를 채워 제출하면 완주로 인정해요. 마감일까지 거리 미달이면 완주 리워드는 지급되지 않아요.",
  appealGuide:
    "완주 판정 보류/반려 시, 오픈채팅으로 이의제기 후 24시간 내 재제출 경로를 안내해 드려요."
} as const

// 톡방 연결·문의 정책
export const talkRoomPolicy = {
  optional: true,
  // 톡방 매칭은 희망자 기반이며 운영 상황에 따라 미매칭 가능
  matchingRule: "희망자는 받아요. 다만 지역·시간대가 맞는 참가자가 있을 때만 연결되며, 운영 상황에 따라 미매칭일 수 있어요.",
  privacyNotice: "개인정보(주소/계좌/민감정보)는 채팅방에 올리지 말아 주세요."
} as const

// 리워드 발송 정책
export const rewardPolicy = {
  deliveryWindow: rewardDeliveryNote,
  delayNoticeRule: "발송 일정이 지연되면 오픈채팅 고정 공지로 먼저 안내해요."
} as const

// 완주 인증 체크리스트 — 랜딩/모달/FAQ에서 동일 사용
export const verificationChecklistItems = [
  "신청 코스(50/70/100km)가 보이는 화면",
  "러닝 앱 거리 기록 캡처 (누적 거리 확인 가능)",
  `인증 경로: 해시태그 게시물 또는 ${socialLinks.instagramHandle} DM`,
  "제출자 이름(또는 식별 가능한 닉네임)",
  "인증 마감일(8/16) 이전 제출"
] as const

export type FaqItem = {
  id: string
  question: string
  answerLines: readonly string[]
  pending?: boolean
}

export type FaqSection = {
  id: string
  title: string
  items: readonly FaqItem[]
}

// 참가자 FAQ — 페이지/앵커 어디서든 재사용 가능한 단일 데이터 소스
export const faqSections: readonly FaqSection[] = [
  {
    id: "apply",
    title: "신청·입금·참가 확정",
    items: [
      {
        id: "q1",
        question: "신청하면 바로 참가 확정인가요?",
        answerLines: ["아니에요. 신청 접수 후 입금이 확인되면 참가가 확정돼요."]
      },
      {
        id: "q2",
        question: "입금 확인은 얼마나 걸리나요?",
        answerLines: [depositPolicy.confirmationSla]
      },
      {
        id: "q3",
        question: "입금자명이 신청자명과 달라도 되나요?",
        answerLines: [depositPolicy.depositorNameMismatchGuide]
      },
      {
        id: "q4",
        question: "입금 기한이 있나요?",
        answerLines: [formatPolicyValue(depositPolicy.paymentDeadline)],
        pending: isPolicyPending(depositPolicy.paymentDeadline)
      },
      {
        id: "q5",
        question: "미입금이면 자동 취소되나요?",
        answerLines: [formatPolicyValue(depositPolicy.autoCancelRule)],
        pending: isPolicyPending(depositPolicy.autoCancelRule)
      }
    ]
  },
  {
    id: "refund",
    title: "코스 변경·취소·환불",
    items: [
      {
        id: "q6",
        question: "코스 변경이 가능한가요?",
        answerLines: [formatPolicyValue(refundPolicy.courseChangeRule), refundPolicy.beforePaymentGuide],
        pending: isPolicyPending(refundPolicy.courseChangeRule)
      },
      {
        id: "q7",
        question: "환불 규정이 있나요?",
        answerLines: [formatPolicyValue(refundPolicy.summary)],
        pending: isPolicyPending(refundPolicy.summary)
      },
      {
        id: "q8",
        question: "1인 1코스 규칙이 뭔가요?",
        answerLines: [
          "한 회차에 한 코스만 참여 가능해요. 같은 이름/연락처 중복 신청은 운영자가 확인 후 안내해요."
        ]
      }
    ]
  },
  {
    id: "challenge",
    title: "챌린지 진행·완주 기준",
    items: [
      {
        id: "q9",
        question: "러닝머신 기록도 인정되나요?",
        answerLines: [formatPolicyValue(completionPolicy.treadmillRule)],
        pending: isPolicyPending(completionPolicy.treadmillRule)
      },
      {
        id: "q10",
        question: "4주 안에 목표 거리를 못 채우면 어떻게 되나요?",
        answerLines: [completionPolicy.completionDeadlineRule]
      },
      {
        id: "q11",
        question: "50km 신청했는데 48km만 달렸어요. 리워드 받을 수 있나요?",
        answerLines: [formatPolicyValue(completionPolicy.underTargetRule), completionPolicy.appealGuide],
        pending: isPolicyPending(completionPolicy.underTargetRule)
      },
      {
        id: "q12",
        question: "완주 인증은 어디로 제출하나요?",
        answerLines: [
          `인스타 해시태그 인증 (${verificationConfig.hashtags.join(" ")}) 또는 ${socialLinks.instagramHandle} DM으로 제출해 주세요.`
        ]
      },
      {
        id: "q13",
        question: "인스타 비공개 계정인데 인증 가능한가요?",
        answerLines: [`가능해요. 비공개 계정은 ${socialLinks.instagramHandle} DM으로 기록 캡처를 보내 주시면 돼요.`]
      },
      {
        id: "q14",
        question: "인증 제출 마감은 언제인가요?",
        answerLines: [verificationConfig.deadlineNote]
      }
    ]
  },
  {
    id: "community",
    title: "톡방·커뮤니티·문의",
    items: [
      {
        id: "q15",
        question: "톡방 연결은 필수인가요?",
        answerLines: ["아니에요. 선택 사항이에요. 혼자 진행해도 문제없어요."]
      },
      {
        id: "q16",
        question: "톡방 연결을 신청하면 무조건 매칭되나요?",
        answerLines: [formatPolicyValue(talkRoomPolicy.matchingRule)],
        pending: isPolicyPending(talkRoomPolicy.matchingRule)
      },
      {
        id: "q17",
        question: "문의는 어디로 하면 되나요?",
        answerLines: [
          `${supportContact.displayName} 오픈채팅에서 받고 있어요. (${supportContact.responseSla})`
        ]
      },
      {
        id: "q18",
        question: "문의방에 입금 캡처/주소를 올려도 되나요?",
        answerLines: [talkRoomPolicy.privacyNotice]
      }
    ]
  },
  {
    id: "reward",
    title: "리워드·배송",
    items: [
      {
        id: "q19",
        question: "리워드는 언제 발송되나요?",
        answerLines: [
          rewardPolicy.deliveryWindow,
          // 사용자 FAQ에는 내부 운영 문서 경로를 노출하지 않습니다.
          rewardPolicy.delayNoticeRule
        ]
      },
      {
        id: "q20",
        question: "주소를 잘못 적었어요. 수정할 수 있나요?",
        answerLines: ["발송 전에는 문의로 수정 가능해요. 발송 후에는 재발송 정책에 따라 안내드려요."]
      },
      {
        id: "q21",
        question: "제주/해외 배송도 가능한가요?",
        answerLines: ["제주 배송은 가능해요(단, 추가요금 발생). 해외 배송은 현재 운영하지 않아요."]
      }
    ]
  }
] as const

// 오픈채팅 고정 메시지 — 운영자가 바로 복사해 붙여넣을 수 있는 텍스트
export const openChatPinnedMessage = [
  "안녕하세요, 오랜디런 문의방입니다.",
  `1) 신청 후 ${depositPolicy.paymentDeadline}`,
  `2) ${depositPolicy.confirmationSla}`,
  `3) ${depositPolicy.autoCancelRule}`,
  `4) 코스 변경/환불: ${refundPolicy.courseChangeRule} / ${refundPolicy.summary}`,
  `5) 인증은 ${verificationConfig.hashtags.join(" ")} 게시물 또는 ${socialLinks.instagramHandle} DM으로 제출해 주세요.`,
  `6) 비공개 계정이거나 해시태그 인증이 어렵다면 ${socialLinks.instagramHandle} DM을 이용해 주세요.`,
  `7) 톡방 연결: ${talkRoomPolicy.matchingRule}`,
  "8) 개인정보(주소/계좌/민감정보)는 채팅방에 올리지 말아 주세요."
].join("\n")

// 푸터/신청폼에서 공통으로 쓰는 정책 링크 목록
export const policyLinks = [
  { href: "/faq", label: "참가자 FAQ" },
  { href: "/privacy", label: "개인정보 처리방침" },
  { href: "/terms", label: "참가 약관" }
] as const

// 개인정보 처리방침 최소형 템플릿 — 수집 항목은 실제 폼과 동일하게 유지합니다.
export const privacyPolicyContent = {
  effectiveDate: "2026-07-01",
  sections: [
    {
      title: "수집 항목",
      bullets: [
        "이름, 휴대폰 번호, 이메일(선택), 거주 지역, 발송지 주소, 러닝 계획(선택)",
        "신청 시각, 코스 선택 정보, 개인정보 수집 동의 여부"
      ]
    },
    {
      title: "이용 목적",
      bullets: ["참가 접수 및 입금 확인 안내", "완주 인증 확인 및 리워드 발송", "운영 문의 대응 및 기록 보관"]
    },
    {
      title: "보관 기간",
      bullets: ["챌린지 종료 후 1년 보관 후 파기", "관계 법령상 보관 의무가 있는 경우 해당 기간 보관"]
    },
    {
      title: "제3자 제공 및 위탁",
      bullets: [
        "Google Sheets 기반 수동 운영을 위해 운영진이 접근할 수 있어요.",
        "법령에 근거한 요청이 있는 경우를 제외하고 외부에 판매/공유하지 않아요."
      ]
    },
    {
      title: "이용자 권리",
      bullets: ["정보 열람/정정/삭제/처리정지는 오픈채팅 문의로 요청할 수 있어요."]
    }
  ]
} as const

// 참가 약관 최소형 템플릿 — FAQ와 같은 정책 문구를 재사용합니다.
export const termsContent = {
  effectiveDate: "2026-07-01",
  sections: [
    {
      title: "참가 기본",
      bullets: [
        "한 회차에 1인 1코스만 참가할 수 있어요.",
        "신청 접수와 참가 확정은 달라요. 입금 확인 후 참가가 확정돼요.",
        // 신청 후 24시간 안에 입금이 없으면 자동으로 신청이 취소됩니다.
        "신청 접수 후 24시간 이내에 입금하지 않으시면 자동으로 신청이 취소됩니다."
      ]
    },
    {
      title: "취소·환불·코스 변경",
      bullets: [
        `환불 정책: ${formatPolicyValue(refundPolicy.summary)}`,
        `코스 변경 정책: ${formatPolicyValue(refundPolicy.courseChangeRule)}`,
        refundPolicy.beforePaymentGuide
      ]
    },
    {
      title: "완주 인증",
      bullets: [
        completionPolicy.completionDeadlineRule,
        `러닝머신 기록 인정: ${formatPolicyValue(completionPolicy.treadmillRule)}`,
        `거리 미달 처리: ${formatPolicyValue(completionPolicy.underTargetRule)}`
      ]
    },
    {
      title: "리워드 발송",
      bullets: [rewardPolicy.deliveryWindow, rewardPolicy.delayNoticeRule]
    },
    {
      title: "문의 및 분쟁 대응",
      bullets: [completionPolicy.appealGuide, talkRoomPolicy.privacyNotice]
    }
  ]
} as const

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
    { phase: "4", title: "완주 인증", body: `SNS 해시태그 게시물 또는 ${socialLinks.instagramHandle} DM으로 기록을 보내 주세요.` },
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

// 참가 운영 안내 (중복 참여·취소·코스 변경)
export const participationPolicyBullets = [
  "1인 1코스만 참여할 수 있어요. (예: 50km 신청 후 70km·100km 추가 신청 불가)",
  "입금은 신청 후 24시간 이내에 진행해 주세요. 24시간 내 미입금 시 자동 취소되며, 다시 신청할 수 있어요.",
  "코스 변경은 입금 확인 전에는 자유롭고, 입금 확인 후에는 모집 마감 전 1회 문의로 변경할 수 있어요.",
  "환불은 입금 확인 전에는 전액 가능하며, 입금 확인 후에는 모집 마감 전까지만 가능해요."
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

/** 신청 가능 여부 — API/클라이언트에서 동일 기준으로 사용합니다. */
export function isRecruitmentOpen(): boolean {
  return getRecruitmentStatus() === "open"
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
