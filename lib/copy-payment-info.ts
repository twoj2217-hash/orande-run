// 입금 안내 클립보드 복사 유틸

const feeFormatter = new Intl.NumberFormat("ko-KR")

type PaymentCopyParams = {
  bank: string
  accountNumber: string
  accountHolder: string
  fee: number
  depositorName: string
}

/** 클립보드에 넣을 입금 안내 한 줄 텍스트 */
export function formatPaymentCopyText({
  bank,
  accountNumber,
  accountHolder,
  fee,
  depositorName
}: PaymentCopyParams): string {
  return `${bank} ${accountNumber} (${accountHolder}) ${feeFormatter.format(fee)}원 · 입금자명: ${depositorName}`
}

/** 입금 정보를 클립보드에 복사 */
export async function copyPaymentInfo(params: PaymentCopyParams): Promise<boolean> {
  const text = formatPaymentCopyText(params)

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // execCommand 폴백으로 이어감
  }

  try {
    const textarea = document.createElement("textarea")
    textarea.value = text
    textarea.style.position = "fixed"
    textarea.style.opacity = "0"
    document.body.appendChild(textarea)
    textarea.select()
    const ok = document.execCommand("copy")
    document.body.removeChild(textarea)
    return ok
  } catch {
    return false
  }
}
