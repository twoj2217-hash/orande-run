/**
 * 휴대폰 번호 유효성 검사 정규식입니다.
 * - 01012345678
 * - 010-1234-5678
 */
const PHONE_REGEX = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/

/** 숫자만 남기고 최대 11자리(국내 휴대폰)까지만 사용합니다. */
function toPhoneDigits(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 11)
}

/**
 * 입력 중 UX를 위해 자동 하이픈 포맷을 적용합니다.
 * 01012345678 -> 010-1234-5678
 */
export function formatPhoneInput(raw: string): string {
  const digits = toPhoneDigits(raw)

  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`

  const middleLength = digits.length === 10 ? 3 : 4
  const middleEnd = 3 + middleLength
  return `${digits.slice(0, 3)}-${digits.slice(3, middleEnd)}-${digits.slice(middleEnd)}`
}

/** 화면/서버 어디서든 동일한 규칙으로 휴대폰 번호를 검사합니다. */
export function isValidPhone(phone: string): boolean {
  return PHONE_REGEX.test(phone.replace(/\s/g, ""))
}

/** 서버 전송 전 항상 하이픈 포함 형태로 정규화합니다. */
export function normalizePhone(phone: string): string {
  return formatPhoneInput(phone).trim()
}
