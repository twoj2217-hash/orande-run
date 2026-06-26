/** Google Apps Script 웹앱 POST — 리다이렉트·HTML 응답 처리 */
export type GoogleSheetsWebhookResult = {
  ok: boolean
  error?: string
}

export async function postToGoogleSheetsWebhook(
  url: string,
  payload: Record<string, unknown>
): Promise<GoogleSheetsWebhookResult> {
  const body = JSON.stringify(payload)

  // #region agent log
  fetch("http://127.0.0.1:7475/ingest/eae9ac5d-46fd-4526-8a41-f537c0585955", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "587d6a" },
    body: JSON.stringify({
      sessionId: "587d6a",
      runId: "pre-fix",
      hypothesisId: "H2",
      location: "lib/google-sheets-webhook.ts:entry",
      message: "webhook request start",
      data: {
        urlHost: (() => {
          try {
            const u = new URL(url)
            return { host: u.host, pathnameEndsWithExec: u.pathname.endsWith("/exec") }
          } catch {
            return { invalidUrl: true }
          }
        })()
      },
      timestamp: Date.now()
    })
  }).catch(() => {})
  // #endregion

  // GAS /exec URL에 POST 1회 — redirect:follow가 302를 따라가며 doPost까지 도달함
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    redirect: "follow"
  })

  const firstStatus = response.status
  const redirectLocation: string | null = null
  const didSecondPost = false

  const text = await response.text()

  // #region agent log
  fetch("http://127.0.0.1:7475/ingest/eae9ac5d-46fd-4526-8a41-f537c0585955", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "587d6a" },
    body: JSON.stringify({
      sessionId: "587d6a",
      runId: "pre-fix",
      hypothesisId: "H1,H3,H4,H5",
      location: "lib/google-sheets-webhook.ts:after-final-response",
      message: "final webhook response",
      data: {
        firstStatus,
        didSecondPost,
        finalStatus: response.status,
        isHtml: text.trimStart().startsWith("<!DOCTYPE") || text.trimStart().startsWith("<html"),
        bodyPreview: text.slice(0, 80)
      },
      timestamp: Date.now()
    })
  }).catch(() => {})
  // #endregion

  try {
    const parsed = JSON.parse(text) as { ok?: boolean; error?: string }

    // #region agent log
    fetch("http://127.0.0.1:7475/ingest/eae9ac5d-46fd-4526-8a41-f537c0585955", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "587d6a" },
      body: JSON.stringify({
        sessionId: "587d6a",
        runId: "post-fix",
        hypothesisId: "H1,H5",
        location: "lib/google-sheets-webhook.ts:parsed-json",
        message: "parsed GAS JSON response",
        data: {
          finalStatus: response.status,
          parsedOk: parsed.ok,
          parsedError: parsed.error ?? null
        },
        timestamp: Date.now()
      })
    }).catch(() => {})
    // #endregion

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
