// 신청 완료 모달 payload — sessionStorage 보관 (새로고침 대비)

const STORAGE_KEY = "orande-apply-success"

export type ApplySuccessPayload = {
  name: string
  tierLabel: string
  fee: number
  locationLabel: string | null
}

export function saveSuccessPayload(payload: ApplySuccessPayload): void {
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // storage 불가 환경은 무시
  }
}

export function readSuccessPayload(options?: { consume?: boolean }): ApplySuccessPayload | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ApplySuccessPayload
    // 기본 동작은 consume=true로 두어 이전 성공 모달 payload가 다음 신청에 섞이지 않게 합니다.
    if (options?.consume !== false) {
      sessionStorage.removeItem(STORAGE_KEY)
    }
    return parsed
  } catch {
    return null
  }
}

export function clearSuccessPayload(): void {
  if (typeof window === "undefined") return
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // 무시
  }
}
