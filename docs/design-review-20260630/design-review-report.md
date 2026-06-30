# Design Review Report (2026-06-30)

대상 URL: `http://localhost:3000`, `http://localhost:3000/apply`

## 캡처 결과

- 홈(데스크톱): `docs/design-review-20260630/home-desktop-after.png`
- 홈(모바일): `docs/design-review-20260630/home-mobile-final.png`
- 신청(데스크톱): `docs/design-review-20260630/apply-desktop-after.png`
- 신청(모바일): `docs/design-review-20260630/apply-mobile-after.png`

## 주요 진단

1. 히어로에서 주/보조 CTA 강도가 비슷해, 첫 행동 선택이 분산될 수 있음.
2. 히어로 텍스트가 밝은 배경 이미지 위에서 일부 구간 대비가 약함.
3. CTA 섹션 문구가 운영 설정(`eventSchedule.participationWeeks`)과 분리된 하드코딩 문구를 사용.
4. iPhone 노치/홈 인디케이터 환경에서 히어로 상하단 인터랙션 요소가 안전 영역에 걸릴 위험.

## 반영한 Quick Wins

1. 히어로 CTA 위계 조정
   - 주 CTA: `오랜디런 참여하기`만 강한 버튼으로 유지
   - 보조 CTA: `참여 방식 먼저 보기` 텍스트 버튼으로 변경

2. 히어로 대비 개선
   - 단일 오버레이를 더 명확한 그라데이션으로 조정해 헤드라인/CTA 가독성 향상

3. CTA 문구/수치 동기화
   - 참여 주차 텍스트를 `eventSchedule.participationWeeks` 기반으로 동적화
   - 참가비 범위를 `runTiers` 기반으로 동적화
   - 모바일 통계 레이아웃을 1열로 조정해 수치 가독성 개선

4. 접근성/레이아웃 보강
   - 히어로 상단 네비와 하단 스크롤 버튼에 `safe-area` 반영
   - 히어로 하단 정책 링크에 키보드 포커스 링 추가

## 보조 가이드 점검(web-interface-guidelines)

점검 파일:
- `components/hero-section.tsx`
- `components/cta-section.tsx`

핵심 체크:
- 아이콘 버튼 `aria-label` 존재
- 상호작용 요소 `focus-visible` 존재
- `button`/`Link` 시맨틱 사용
- `prefers-reduced-motion` 대응(CTA 섹션)
- 노치 대응(`env(safe-area-inset-*)`) 반영

