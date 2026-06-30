# OranDe Run 이미지 텍스트 오버레이 가이드

AI 배경 이미지 위에 한글 텍스트를 얹을 때 사용하는 실무 가이드입니다.

## 1) 공통 스타일

- 폰트: Pretendard
- 제목: Bold 88~108px (스토리), 64~76px (피드)
- 본문: Medium 40~52px (스토리), 30~38px (피드)
- 컬러:
  - 메인 오렌지: `#F97316`
  - 텍스트 차콜: `#2D2A26`
  - 보조 크림: `#FDF9F5`
- 줄간격:
  - 제목 1.2
  - 본문 1.4

## 2) 배치 원칙

- 상단 15% 영역: 배지/소제목
- 중앙 40% 영역: 핵심 타이틀
- 하단 20% 영역: 일정/CTA/해시태그
- 이미지 중앙에는 텍스트가 겹치지 않도록 여백을 유지합니다.
- AI 이미지에는 한글을 직접 넣지 않고, 후처리로 텍스트를 올립니다.

## 3) 선언문 카드뉴스 오버레이

대상 폴더: `public/images/social/declaration`

- 캔버스: 1080 x 1350
- 카드 공통:
  - 상단 왼쪽: `대전 로컬 · 제1회`
  - 하단 오른쪽: `OranDe Run` + `n/7`

### 카드별 파일/카피 매칭

| 파일 | 타이틀 | 본문 시작 위치(권장) |
|---|---|---|
| `01-cover.png` | 오랜디런 선언문 | x=96, y=330 |
| `02-why-virtual.png` | 왜 버추얼 런일까 | x=96, y=330 |
| `03-everyone-pace.png` | 누구나, 내 페이스로 | x=96, y=330 |
| `04-together.png` | 혼자도 함께도 | x=96, y=330 |
| `05-reward-keycap.png` | 완주의 증거, 키캡키링 | x=96, y=330 |
| `06-schedule.png` | 일정 안내 | x=96, y=330 |
| `07-cta.png` | 참가 신청 오픈 | x=96, y=330 |

### 카드 하단 공통 요소

- 왼쪽 하단: `@oranderun` (또는 확정 아이디)
- 오른쪽 하단: `n/7`
- 하단 안전 여백: 최소 72px

## 4) 공지 이미지 오버레이

대상 폴더: `public/images/social/announce`

기본 파일명:

- `announce-recruitment-open-feed.png`
- `announce-recruitment-open-story.png`
- `announce-recruitment-d3-feed.png`
- `announce-recruitment-d3-story.png`
- `announce-run-start-feed.png`
- `announce-run-start-story.png`
- `announce-verification-feed.png`
- `announce-verification-story.png`

### 텍스트 예시 (붙여넣기용)

모집 오픈:

```text
모집 시작
7.1 ~ 7.5
50km · 70km · 100km
```

모집 마감 D-3:

```text
모집 마감 D-3
참가 코스를 지금 선택해요
```

챌린지 시작:

```text
4주 버추얼 런 시작
7.13 ~ 8.9
누구나, 내 페이스로
```

완주 인증:

```text
완주 인증 안내
#오랜디런 #OranDeRun
마감 8.16
```

## 5) 공지별 권장 배치 좌표

피드(1080x1080):

- 제목: x=84, y=170
- 본문: x=84, y=320
- 하단 CTA: x=84, y=900

스토리(1080x1920):

- 제목: x=84, y=260
- 본문: x=84, y=470
- 하단 CTA/해시태그: x=84, y=1640

## 6) 생성 스크립트

배경 이미지는 아래 스크립트로 재생성할 수 있습니다.

```bash
python "c:/Users/micro/Desktop/run/scripts/generate_social_assets.py"
```
