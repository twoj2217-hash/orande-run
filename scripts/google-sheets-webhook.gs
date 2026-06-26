/**
 * 오랜디런 참가 신청 → Google Sheets 연동용 Apps Script
 *
 * 설정 방법:
 * 1. Google 스프레드시트 새로 만들기
 * 2. 확장 프로그램 > Apps Script 열기
 * 3. 이 파일 내용 붙여넣기
 * 4. WEBHOOK_SECRET 값을 임의 문자열로 변경 (API .env와 동일하게)
 * 5. 배포 > 새 배포 > 유형: 웹 앱
 *    - 실행: 나
 *    - 액세스: 모든 사용자  ← 반드시 「모든 사용자」(Anyone)
 * 6. 배포 URL을 .env.local 의 GOOGLE_SHEETS_WEBHOOK_URL 에 넣기
 */

// API 서버와 동일한 시크릿 (스팸 방지)
var WEBHOOK_SECRET = "여기에-임의-시크릿-문자열";

// 시트 첫 행 헤더 (14열)
var HEADERS = [
  "제출시각",
  "이름",
  "휴대폰",
  "이메일",
  "코스",
  "참가비",
  "지역",
  "선호요일",
  "선호시간",
  "개인정보동의",
  "입금확인",
  "톡방연결",
  "인증확인",
  "발송완료"
];

/** 스프레드시트 열 때 헤더가 없으면 자동 생성 */
function onOpen() {
  ensureHeaders_();
}

/** 참가 신청 POST 수신 */
function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);

    // 시크릿 검증
    if (payload.secret !== WEBHOOK_SECRET) {
      return jsonResponse_({ ok: false, error: "unauthorized" });
    }

    ensureHeaders_();

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      payload.submittedAt || new Date().toISOString(),
      payload.name || "",
      payload.phone || "",
      payload.email || "",
      payload.tierLabel || "",
      payload.fee || "",
      payload.locationLabel || "",
      payload.runningDaysLabel || "",
      payload.runningTimePreference || "",
      payload.privacyConsent || "Y",
      "", // 입금확인 — 운영자 수동
      "", // 톡방연결 — 운영자 수동
      "", // 인증확인 — 운영자 수동
      ""  // 발송완료 — 운영자 수동
    ]);

    return jsonResponse_({ ok: true });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  }
}

/** 헤더 행이 없으면 추가 */
function ensureHeaders_() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }
}

/** JSON 응답 헬퍼 */
function jsonResponse_(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON
  );
}
