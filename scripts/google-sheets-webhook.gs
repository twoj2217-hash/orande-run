/**
 * 오랜디런 참가 신청 → Google Sheets 연동용 Apps Script
 *
 * [배포 체크리스트]
 * 1. 이 파일 내용을 Apps Script 편집기 Code.gs 에 전부 붙여넣기 (기존 코드 삭제)
 * 2. 저장 (Ctrl+S)
 * 3. 배포 → 배포 관리 → 기존 웹앱 ✏️ → 버전「새 버전」→ 배포
 * 4. .env.local 의 URL 과 배포 URL 이 같은지 확인
 * 5. 브라우저에서 배포 URL 열기 → version: 2026-06-26-shipping-v2 확인
 */

// 배포 버전 확인용
var SCRIPT_VERSION = "2026-06-26-shipping-v2";

// API 서버와 동일한 시크릿 (.env.local 과 맞출 것)
var WEBHOOK_SECRET = "orande-run-2026-js2js2"

// 시트 헤더 (18열)
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
  "배송우편번호",
  "배송주소",
  "배송상세주소",
  "발송지전체",
  "개인정보동의",
  "입금확인",
  "톡방연결",
  "인증확인",
  "발송완료"
];

var SHIPPING_HEADERS = ["배송우편번호", "배송주소", "배송상세주소", "발송지전체"];

/** 배포 확인 — 브라우저에서 웹앱 URL 을 열면 JSON 이 보여야 함 */
function doGet() {
  return jsonResponse_({
    ok: true,
    version: SCRIPT_VERSION,
    headers: HEADERS
  });
}

function onOpen() {
  ensureHeaders_();
}

/** 참가 신청 POST 수신 */
function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);

    if (payload.secret !== WEBHOOK_SECRET) {
      return jsonResponse_({ ok: false, error: "unauthorized" });
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    ensureHeaders_(sheet);
    appendPayloadRow_(sheet, payload);

    return jsonResponse_({
      ok: true,
      version: SCRIPT_VERSION,
      receivedShipping: Boolean(
        payload.shippingZipcode || payload.shippingAddress || payload.shippingAddressDetail
      )
    });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  }
}

function buildFieldMap_(payload) {
  return {
    제출시각: payload.submittedAt || new Date().toISOString(),
    이름: payload.name || "",
    휴대폰: payload.phone || "",
    이메일: payload.email || "",
    코스: payload.tierLabel || "",
    참가비: payload.fee || "",
    지역: payload.locationLabel || "",
    선호요일: payload.runningDaysLabel || "",
    선호시간: payload.runningTimePreference || "",
    배송우편번호: payload.shippingZipcode || "",
    배송주소: payload.shippingAddress || "",
    배송상세주소: payload.shippingAddressDetail || "",
    발송지전체: payload.shippingAddressLabel || buildShippingLabel_(payload),
    개인정보동의: payload.privacyConsent || "Y",
    입금확인: "",
    톡방연결: "",
    인증확인: "",
    발송완료: ""
  };
}

function buildShippingLabel_(payload) {
  var zipcode = payload.shippingZipcode || "";
  var address = payload.shippingAddress || "";
  var detail = payload.shippingAddressDetail || "";
  if (!zipcode && !address && !detail) return "";
  var base = zipcode ? "[" + zipcode + "] " + address : address;
  return detail ? base + " " + detail : base;
}

function readHeaderRow_(sheet) {
  var lastCol = Math.max(sheet.getLastColumn(), 1);
  return sheet.getRange(1, 1, 1, lastCol).getValues()[0];
}

function ensureHeaders_(sheet) {
  sheet = sheet || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    return readHeaderRow_(sheet);
  }

  var headerRow = readHeaderRow_(sheet);

  if (!headerRow[0]) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    return HEADERS.slice();
  }

  if (headerRow.indexOf("배송우편번호") === -1) {
    var timeColIndex = headerRow.indexOf("선호시간");
    if (timeColIndex !== -1) {
      sheet.insertColumnsAfter(timeColIndex + 1, SHIPPING_HEADERS.length);
      sheet
        .getRange(1, timeColIndex + 2, 1, SHIPPING_HEADERS.length)
        .setValues([SHIPPING_HEADERS]);
    } else {
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    }
    headerRow = readHeaderRow_(sheet);
  }

  return headerRow;
}

function appendPayloadRow_(sheet, payload) {
  var headerRow = ensureHeaders_(sheet);
  var fieldMap = buildFieldMap_(payload);

  var rowValues = headerRow.map(function (headerName) {
    if (!headerName) return "";
    return Object.prototype.hasOwnProperty.call(fieldMap, headerName)
      ? fieldMap[headerName]
      : "";
  });

  sheet.appendRow(rowValues);
}

function jsonResponse_(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON
  );
}
