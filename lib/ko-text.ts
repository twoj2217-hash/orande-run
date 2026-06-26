// 한글 줄바꿈 공통 클래스 — 컴포넌트에서 재사용합니다.
export const KO_TEXT_CLASS = "break-keep [overflow-wrap:anywhere]"
export const KO_TEXT_BALANCE_CLASS = `${KO_TEXT_CLASS} text-balance`

/** \n으로 의도한 줄 나눔을 배열로 변환합니다. */
export function splitKoLines(text: string): string[] {
  return text.split("\n").filter((line) => line.length > 0)
}
