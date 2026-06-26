/** 폼 검증 오류 키 — apply-page-content와 동일한 순서·필드명 */
export type FormErrors = {
  tier?: string
  cityId?: string
  district?: string
  outsideRegion?: string
  name?: string
  phone?: string
  email?: string
  shippingZipcode?: string
  shippingAddress?: string
  shippingAddressDetail?: string
  privacyConsent?: string
}

/** 오류 키 우선순위 — 위에서부터 첫 오류로 스크롤 */
const ERROR_PRIORITY: (keyof FormErrors)[] = [
  "tier",
  "cityId",
  "district",
  "outsideRegion",
  "name",
  "phone",
  "email",
  "shippingZipcode",
  "shippingAddress",
  "shippingAddressDetail",
  "privacyConsent"
]

/** 오류 키 → 신청 단계 ID */
const ERROR_STEP_MAP: Record<keyof FormErrors, string> = {
  tier: "step-tier",
  cityId: "step-location",
  district: "step-location",
  outsideRegion: "step-location",
  name: "step-info",
  phone: "step-info",
  email: "step-info",
  shippingZipcode: "step-shipping",
  shippingAddress: "step-shipping",
  shippingAddressDetail: "step-shipping",
  privacyConsent: "step-consent"
}

/** 오류 키 → 포커스할 입력 요소 선택자 (없으면 단계만 스크롤) */
const ERROR_FOCUS_SELECTOR: Partial<Record<keyof FormErrors, string>> = {
  outsideRegion: "#outsideRegion",
  name: "#name",
  phone: "#phone",
  email: "#email",
  shippingZipcode: "#shipping-zipcode",
  shippingAddress: "#shipping-address",
  shippingAddressDetail: "#shipping-address-detail",
  privacyConsent: "#privacyConsent"
}

/** 모바일 details 강제 펼침 — apply-form-step에서 수신 */
export const APPLY_FORCE_OPEN_EVENT = "apply-force-open-step"

/** 현재 뷰포트에서 보이는 단계 요소 (모바일 details / 데스크톱 section) */
function getVisibleStepElement(stepId: string): HTMLElement | null {
  const candidates = [
    document.getElementById(stepId),
    document.getElementById(`${stepId}-desktop`)
  ].filter(Boolean) as HTMLElement[]

  for (const element of candidates) {
    if (element.offsetParent !== null) return element
  }

  return document.getElementById(stepId)
}

/** 모바일 accordion(details) 단계를 펼칩니다 — React 제어 open과 동기화 */
function forceOpenApplyStep(stepId: string) {
  document.dispatchEvent(
    new CustomEvent(APPLY_FORCE_OPEN_EVENT, { detail: { stepId } })
  )
}

/** 첫 검증 오류 위치로 스크롤하고 해당 입력에 포커스 */
export function scrollToFirstFormError(errors: FormErrors) {
  const firstKey = ERROR_PRIORITY.find((key) => errors[key])
  if (!firstKey) return

  const stepId = ERROR_STEP_MAP[firstKey]
  forceOpenApplyStep(stepId)

  // details open 상태가 React에 반영된 뒤 스크롤 (이중 rAF)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const stepEl = getVisibleStepElement(stepId)
      if (stepEl) {
        stepEl.scrollIntoView({ behavior: "smooth", block: "center" })
      }

      const focusSelector = ERROR_FOCUS_SELECTOR[firstKey]
      if (focusSelector) {
        requestAnimationFrame(() => {
          const input = document.querySelector<HTMLElement>(focusSelector)
          input?.focus({ preventScroll: true })
        })
      } else if (firstKey === "tier") {
        // 코스 카드 버튼 중 첫 번째에 포커스
        const tierBtn = stepEl?.querySelector<HTMLElement>("button[type='button']")
        tierBtn?.focus({ preventScroll: true })
      }
    })
  })
}
