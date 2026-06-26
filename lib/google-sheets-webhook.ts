/** Google Apps Script 웹앱 POST — 리다이렉트·HTML 응답 처리 */
export type GoogleSheetsWebhookResult = {
  ok: boolean
  error?: string
}

export async function postToGoogleSheetsWebhook(
  url: string,
  payload: Record<string, unknown>
): Promise<GoogleSheetsWebhookResult> {
  // /dev URL은 로그인한 개발자 브라우저 테스트용 — API 서버 POST는 /exec 만 동작
  if (url.includes("/dev")) {
    return { ok: false, error: "webapp_dev_url" }
  }

  const body = JSON.stringify(payload)

  // GAS /exec URL에 POST 1회 — redirect:follow가 302를 따라가며 doPost까지 도달함
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    redirect: "follow"
  })

  const text = await response.text()

  try {
    const parsed = JSON.parse(text) as { ok?: boolean; error?: string }

    if (!parsed.ok && parsed.error === "unauthorized") {
      return { ok: false, error: "secret_mismatch" }
    }

    return {
      ok: Boolean(parsed.ok),
      error: parsed.error
    }
  } catch {
    console.error(
      "Google Sheets webhook non-JSON response:",
      response.status,
      text.slice(0, 400)
    )

    // 배포 액세스가 「모든 사용자」가 아니면 서버 요청이 401 HTML로 막힘
    if (response.status === 401) {
      return {
        ok: false,
        error: "webapp_access_denied"
      }
    }

    return { ok: false, error: "invalid_response" }
  }
}
