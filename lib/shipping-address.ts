// 키캡키링 발송지 주소 타입·포맷 헬퍼

/** 다음(카카오) 우편번호 API로 채워지는 기본 주소 */
export type ShippingAddressBase = {
  zipcode: string
  address: string
}

/** 신청 폼에서 수집하는 발송지 전체 */
export type ShippingAddressInput = ShippingAddressBase & {
  addressDetail: string
}

/** 시트·API용 한 줄 발송지 라벨 (예: [12345] 대전 서구 ... 101호) */
export function formatShippingAddressLabel(input: ShippingAddressInput): string {
  const detail = input.addressDetail.trim()
  const base = `[${input.zipcode}] ${input.address}`
  return detail ? `${base} ${detail}` : base
}
