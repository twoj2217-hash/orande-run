/**
 * 조건부 UI 마운트 등으로 레이아웃이 바뀔 때 모바일 scroll anchoring으로
 * 화면이 아래로 밀리는 현상을 완화합니다.
 */
export function runWithPreservedScroll(run: () => void) {
  if (typeof window === "undefined") {
    run()
    return
  }

  const scrollX = window.scrollX
  const scrollY = window.scrollY

  run()

  // React 커밋·브라우저 레이아웃 반영 후 스크롤 위치 복원
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.scrollTo(scrollX, scrollY)
    })
  })
}
