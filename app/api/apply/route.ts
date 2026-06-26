import { applyRequestSchema, getTierById } from "@/lib/apply-schema"
import { getRecruitmentStatus } from "@/lib/event-config"
import { postToGoogleSheetsWebhook } from "@/lib/google-sheets-webhook"
import { NextResponse } from "next/server"

/** Google Sheets Apps Script 웹훅으로 신청 데이터 전달 */
export async function POST(request: Request) {
  if (getRecruitmentStatus() === "closed") {
    return NextResponse.json({ ok: false, error: "현재 모집이 마감되었습니다." }, { status: 403 })
  }

  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL
  const webhookSecret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET

  if (!webhookUrl || !webhookSecret) {
    return NextResponse.json(
      { ok: false, error: "서버 설정이 완료되지 않았습니다. 관리자에게 문의해 주세요." },
      { status: 500 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: "잘못된 요청입니다." }, { status: 400 })
  }

  const parsed = applyRequestSchema.safeParse(body)
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message ?? "입력값을 확인해 주세요."
    return NextResponse.json({ ok: false, error: firstError }, { status: 400 })
  }

  const data = parsed.data
  const tier = getTierById(data.tierId)
  if (!tier) {
    return NextResponse.json({ ok: false, error: "유효하지 않은 코스입니다." }, { status: 400 })
  }

  const sheetsResult = await postToGoogleSheetsWebhook(webhookUrl, {
    secret: webhookSecret,
    submittedAt: new Date().toISOString(),
    name: data.name,
    phone: data.phone,
    email: data.email,
    tierLabel: tier.label,
    fee: tier.fee,
    locationLabel: data.locationLabel,
    runningDaysLabel: data.runningDaysLabel,
    runningTimePreference: data.runningTimePreferenceLabel,
    privacyConsent: "Y"
  })

  if (!sheetsResult.ok) {
    console.error("Google Sheets webhook failed:", sheetsResult)

    if (sheetsResult.error === "secret_mismatch") {
      return NextResponse.json(
        {
          ok: false,
          error:
            "시트 연동 시크릿이 일치하지 않습니다. Apps Script의 WEBHOOK_SECRET과 .env.local을 확인해 주세요."
        },
        { status: 502 }
      )
    }

    if (sheetsResult.error === "webapp_access_denied") {
      return NextResponse.json(
        {
          ok: false,
          error:
            "시트 연동 설정을 확인해 주세요. (Apps Script 배포 → 액세스: 모든 사용자, 시크릿 일치)"
        },
        { status: 502 }
      )
    }

    return NextResponse.json(
      { ok: false, error: "신청 접수에 실패했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 502 }
    )
  }

  return NextResponse.json({
    ok: true,
    tier: { id: tier.id, label: tier.label, fee: tier.fee }
  })
}
