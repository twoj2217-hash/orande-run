"use client"

import { ApplyFormStep, ApplyStickySubmit } from "@/components/apply-form-step"
import { AddressSearchInput } from "@/components/address-search-input"
import { ApplyProgress } from "@/components/apply-progress"
import { ApplySuccessModal } from "@/components/apply-success-modal"
import { ParticipationPolicyNotes } from "@/components/participation-policy-notes"
import { RecruitmentBanner } from "@/components/recruitment-banner"
import { Button } from "@/components/ui/liquid-glass-button"
import type { ApplySuccessPayload } from "@/lib/apply-success-storage"
import {
  clearSuccessPayload,
  readSuccessPayload,
  saveSuccessPayload
} from "@/lib/apply-success-storage"
import type { DaejeonDistrict, LocationCityId } from "@/lib/apply-schema"
import {
  daejeonDistricts,
  depositPolicy,
  formatPolicyValue,
  formatLocationLabel,
  getRecruitmentPeriodLabel,
  getRecruitmentStatus,
  getRunPeriodLabel,
  isRecruitmentOpen,
  locationCities,
  outsideRegionCopy,
  paymentInfo,
  policyLinks,
  privacyConsentSummary,
  runningDayOptions,
  runningPreferenceCopy,
  runningTimeSuggestions,
  runTiers,
  shippingAddressCopy,
  type RunTierId,
  type RunningDay
} from "@/lib/event-config"
import { formatPhoneInput, isValidPhone, normalizePhone } from "@/lib/phone-format"
import { cn } from "@/lib/utils"
import { formatShippingAddressLabel } from "@/lib/shipping-address"
import { scrollToFirstFormError, type FormErrors } from "@/lib/scroll-to-form-error"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

const feeFormatter = new Intl.NumberFormat("ko-KR")

type FormState = {
  name: string
  phone: string
  email: string
}

const VALID_TIER_IDS = new Set(runTiers.map((t) => t.id))

function getInitialTierFromParams(searchParams: URLSearchParams): RunTierId | null {
  const tier = searchParams.get("tier")
  if (tier && VALID_TIER_IDS.has(tier as RunTierId)) return tier as RunTierId
  return null
}

// 참가 신청 폼 본문 — useSearchParams 사용
export function ApplyPageContent() {
  const searchParams = useSearchParams()
  const recruitmentStatus = getRecruitmentStatus()
  // 클라이언트에서도 서버와 동일하게 open 상태에서만 제출을 허용합니다.
  const isRecruitmentOpenNow = isRecruitmentOpen()
  const isRecruitmentBlocked = !isRecruitmentOpenNow

  const [selectedTierId, setSelectedTierId] = useState<RunTierId | null>(() =>
    getInitialTierFromParams(searchParams)
  )
  const [cityId, setCityId] = useState<LocationCityId | null>(null)
  const [district, setDistrict] = useState<DaejeonDistrict | null>(null)
  const [outsideRegion, setOutsideRegion] = useState("")
  const [runningDays, setRunningDays] = useState<RunningDay[]>([])
  const [runningTimePreference, setRunningTimePreference] = useState("")
  const [privacyConsent, setPrivacyConsent] = useState(false)
  const [form, setForm] = useState<FormState>({ name: "", phone: "", email: "" })
  const [shippingZipcode, setShippingZipcode] = useState("")
  const [shippingAddress, setShippingAddress] = useState("")
  const [shippingAddressDetail, setShippingAddressDetail] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successPayload, setSuccessPayload] = useState<ApplySuccessPayload | null>(null)
  const [isAddressSearchActive, setIsAddressSearchActive] = useState(false)

  const selectedTier = useMemo(() => runTiers.find((tier) => tier.id === selectedTierId) ?? null, [selectedTierId])

  const locationPreview = useMemo(() => {
    if (!cityId) return null
    // 대전 외는 상세 지역 입력 후에만 미리보기를 표시합니다.
    if (cityId === "outside") {
      const trimmedOutsideRegion = outsideRegion.trim()
      if (!trimmedOutsideRegion) return null
      return formatLocationLabel("outside", undefined, trimmedOutsideRegion)
    }
    if (!district) return null
    return formatLocationLabel("daejeon", district)
  }, [cityId, district, outsideRegion])

  const shippingPreview = useMemo(() => {
    if (!shippingZipcode || !shippingAddress) return null
    return formatShippingAddressLabel({
      zipcode: shippingZipcode,
      address: shippingAddress,
      addressDetail: shippingAddressDetail
    })
  }, [shippingAddress, shippingAddressDetail, shippingZipcode])

  // 새로고침 시 sessionStorage에서 완료 모달 복원
  useEffect(() => {
    const stored = readSuccessPayload()
    if (stored) {
      setSuccessPayload(stored)
      setShowSuccessModal(true)
    }
  }, [])

  const toggleRunningDay = (day: RunningDay) => {
    setRunningDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  // 참고 칩 클릭 시 입력란에 텍스트 추가
  const appendTimeSuggestion = (suggestion: string) => {
    setRunningTimePreference((prev) => {
      const trimmed = prev.trim()
      if (!trimmed) return suggestion
      if (trimmed.includes(suggestion)) return prev
      return `${trimmed}, ${suggestion}`
    })
  }

  const validate = (): FormErrors => {
    const next: FormErrors = {}
    if (!selectedTierId) next.tier = "참여할 코스를 선택해 주세요."
    if (!cityId) next.cityId = "거주 지역을 선택해 주세요."
    if (cityId === "daejeon" && !district) next.district = "구를 선택해 주세요."
    if (cityId === "outside" && !outsideRegion.trim()) {
      next.outsideRegion = "거주 지역을 입력해 주세요."
    } else if (cityId === "outside" && outsideRegion.trim().length > 50) {
      next.outsideRegion = "거주 지역은 50자 이하로 입력해 주세요."
    }
    if (!form.name.trim()) next.name = "이름을 입력해 주세요."
    if (!isValidPhone(form.phone)) {
      next.phone = "올바른 휴대폰 번호를 입력해 주세요."
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "올바른 이메일을 입력해 주세요."
    }
    if (!/^\d{5}$/.test(shippingZipcode)) {
      next.shippingZipcode = "주소 검색 버튼으로 우편번호를 입력해 주세요."
    }
    if (!shippingAddress.trim()) {
      next.shippingAddress = "주소 검색으로 기본 주소를 입력해 주세요."
    }
    if (!shippingAddressDetail.trim()) {
      next.shippingAddressDetail = "상세 주소를 입력해 주세요."
    } else if (shippingAddressDetail.trim().length > 100) {
      next.shippingAddressDetail = "상세 주소는 100자 이하로 입력해 주세요."
    }
    if (!privacyConsent) next.privacyConsent = "개인정보 수집·이용에 동의해 주세요."
    return next
  }

  const handleModalClose = () => {
    setShowSuccessModal(false)
    setSuccessPayload(null)
    clearSuccessPayload()
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    // 모집 상태가 open이 아니면 클라이언트에서 즉시 제출을 막습니다.
    if (isRecruitmentBlocked) return

    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      scrollToFirstFormError(nextErrors)
      return
    }
    if (!selectedTierId || !cityId || !selectedTier) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          // API 전송 전 하이픈 포함 형태로 정규화합니다.
          phone: normalizePhone(form.phone),
          email: form.email.trim(),
          tierId: selectedTierId,
          cityId,
          district: cityId === "daejeon" ? district ?? undefined : undefined,
          outsideRegion: cityId === "outside" ? outsideRegion.trim() : undefined,
          runningDays,
          runningTimePreference: runningTimePreference.trim(),
          shippingZipcode,
          shippingAddress: shippingAddress.trim(),
          shippingAddressDetail: shippingAddressDetail.trim(),
          privacyConsent: true
        })
      })

      const result = (await response.json()) as { ok?: boolean; error?: string }

      if (!response.ok || !result.ok) {
        setSubmitError(result.error ?? "신청 접수에 실패했습니다. 잠시 후 다시 시도해 주세요.")
        return
      }

      const payload: ApplySuccessPayload = {
        name: form.name.trim(),
        tierLabel: selectedTier.label,
        fee: selectedTier.fee,
        locationLabel: locationPreview
      }
      saveSuccessPayload(payload)
      setSuccessPayload(payload)
      setShowSuccessModal(true)
    } catch {
      setSubmitError("네트워크 오류가 발생했습니다. 연결을 확인한 뒤 다시 시도해 주세요.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const tierSummary = selectedTier ? `${selectedTier.label} · ${selectedTier.rewardGuide}` : null
  const locationSummary = locationPreview
  const scheduleSummary =
    runningDays.length > 0 || runningTimePreference.trim()
      ? [runningDays.join("·"), runningTimePreference.trim()].filter(Boolean).join(" / ")
      : null
  const phoneLast4 = normalizePhone(form.phone).replace(/\D/g, "").slice(-4)
  const infoSummary = form.name.trim() ? [form.name.trim(), phoneLast4].filter(Boolean).join(" · ") : null
  const shippingSummary = shippingPreview

  const submitButton = (
    <Button
      type="submit"
      form="apply-form"
      disabled={isSubmitting || isRecruitmentBlocked}
      className="w-full h-[52px] bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg disabled:opacity-70"
    >
      {isSubmitting ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" aria-hidden />
          접수 중...
        </>
      ) : isRecruitmentBlocked ? (
        recruitmentStatus === "upcoming"
          ? "모집 오픈 전"
          : recruitmentStatus === "tbd"
            ? "일정 공지 대기"
            : "모집 마감"
      ) : (
        "신청 완료하기"
      )}
    </Button>
  )

  return (
    <div className="min-h-screen bg-orange-50/80 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-10">
      <ApplySuccessModal open={showSuccessModal} payload={successPayload} onClose={handleModalClose} />

      <div className="container mx-auto max-w-2xl px-4 py-6 sm:px-6 md:py-10">
        <Link
          href="/#join"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-orange-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden />
          랜딩으로 돌아가기
        </Link>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-2">오랜디런 참가 신청</h1>
        <p className="text-muted-foreground mb-4">
          모집 {getRecruitmentPeriodLabel()} · 참여 {getRunPeriodLabel()}
        </p>
        {/* 정책 확인 시 현재 폼 입력값 이탈을 줄이기 위해 새 탭으로 링크를 엽니다. */}
        <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {policyLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-orange-600"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <RecruitmentBanner className="mb-6" context="apply" />

        {isRecruitmentBlocked && (
          <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 px-4 py-3 text-sm mb-6" role="alert">
            {recruitmentStatus === "upcoming" && "아직 모집 시작 전이에요. 오픈 일정에 다시 신청해 주세요."}
            {recruitmentStatus === "tbd" && "모집 일정이 아직 확정되지 않았어요. 공지 후 신청이 열립니다."}
            {recruitmentStatus === "closed" && "현재 모집이 마감되어 신청을 받지 않습니다."}
          </div>
        )}

        <ApplyProgress />

        <form id="apply-form" onSubmit={handleSubmit} className="space-y-6 md:space-y-10" noValidate>
          <ApplyFormStep
            id="step-tier"
            headingId="tier-heading"
            title="코스 선택"
            stepNumber={1}
            summary={tierSummary}
            isComplete={!!selectedTierId}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {runTiers.map((tier) => {
                const isSelected = selectedTierId === tier.id
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => {
                      setSelectedTierId(tier.id)
                      setErrors((prev) => ({ ...prev, tier: undefined }))
                    }}
                    className={cn(
                      "interactive-card interactive-chip rounded-2xl border p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 min-h-[44px]",
                      isSelected
                        ? "interactive-chip-selected border-orange-500 bg-orange-50 ring-1 ring-orange-500"
                        : "border-orange-200 bg-white hover:border-orange-300"
                    )}
                    aria-pressed={isSelected}
                  >
                    <p className="text-sm text-orange-600 font-semibold mb-1">{tier.weeklyGuide}</p>
                    <p className="text-2xl font-black text-foreground">{tier.label}</p>
                    <p className="text-lg font-bold text-orange-600 mt-1">{feeFormatter.format(tier.fee)}원</p>
                    <p className="text-xs text-muted-foreground mt-2">{tier.rewardGuide}</p>
                  </button>
                )
              })}
            </div>
            {errors.tier && (
              <p className="text-sm text-red-600 mt-2" role="alert">
                {errors.tier}
              </p>
            )}
          </ApplyFormStep>

          <ApplyFormStep
            id="step-location"
            headingId="location-heading"
            title="거주 지역"
            stepNumber={2}
            summary={locationSummary}
            isComplete={!!locationPreview}
          >
            <div className="rounded-2xl border border-orange-200 bg-white p-4 sm:p-6 space-y-5">
              <fieldset>
                <legend className="text-sm font-semibold text-foreground mb-3">
                  지역 선택 <span className="text-red-500">*</span>
                </legend>
                <div className="flex flex-wrap gap-3">
                  {locationCities.map((city) => (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => {
                        setCityId(city.id)
                        if (city.id === "outside") {
                          setDistrict(null)
                        } else {
                          setOutsideRegion("")
                        }
                        setErrors((prev) => ({
                          ...prev,
                          cityId: undefined,
                          district: undefined,
                          outsideRegion: undefined
                        }))
                      }}
                      className={cn(
                        "interactive-chip h-11 px-5 rounded-[10px] border font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500",
                        cityId === city.id
                          ? "interactive-chip-selected border-orange-500 bg-orange-50 text-orange-700"
                          : "border-orange-200 bg-white hover:border-orange-300"
                      )}
                      aria-pressed={cityId === city.id}
                    >
                      {city.label}
                    </button>
                  ))}
                </div>
                {errors.cityId && (
                  <p className="text-sm text-red-600 mt-2" role="alert">
                    {errors.cityId}
                  </p>
                )}
              </fieldset>

              {cityId === "daejeon" && (
                <fieldset>
                  <legend className="text-sm font-semibold text-foreground mb-3">
                    어느 구에 사세요? <span className="text-red-500">*</span>
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {daejeonDistricts.map((gu) => (
                      <button
                        key={gu}
                        type="button"
                        onClick={() => {
                          setDistrict(gu)
                          setErrors((prev) => ({ ...prev, district: undefined }))
                        }}
                        className={cn(
                          "interactive-chip h-11 px-4 rounded-[10px] border font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500",
                          district === gu
                            ? "interactive-chip-selected border-orange-500 bg-orange-50 text-orange-700"
                            : "border-orange-200 bg-white hover:border-orange-300"
                        )}
                        aria-pressed={district === gu}
                      >
                        {gu}
                      </button>
                    ))}
                  </div>
                  {errors.district && (
                    <p className="text-sm text-red-600 mt-2" role="alert">
                      {errors.district}
                    </p>
                  )}
                </fieldset>
              )}

              {cityId === "outside" && (
                <fieldset>
                  <legend className="text-sm font-semibold text-foreground mb-3">
                    {outsideRegionCopy.label} <span className="text-red-500">*</span>
                  </legend>
                  <input
                    id="outsideRegion"
                    type="text"
                    value={outsideRegion}
                    onChange={(e) => {
                      setOutsideRegion(e.target.value)
                      setErrors((prev) => ({ ...prev, outsideRegion: undefined }))
                    }}
                    className="w-full h-11 rounded-[10px] border border-orange-200 px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                    placeholder={outsideRegionCopy.placeholder}
                    maxLength={50}
                    autoComplete="address-level2"
                    aria-invalid={Boolean(errors.outsideRegion)}
                  />
                  {errors.outsideRegion && (
                    <p className="text-sm text-red-600 mt-2" role="alert">
                      {errors.outsideRegion}
                    </p>
                  )}
                </fieldset>
              )}

              {locationPreview && (
                <p className="text-sm text-muted-foreground">
                  선택: <strong className="text-foreground">{locationPreview}</strong>
                </p>
              )}
            </div>
          </ApplyFormStep>

          <ApplyFormStep
            id="step-schedule"
            headingId="schedule-heading"
            title={`${runningPreferenceCopy.sectionTitle} (선택)`}
            stepNumber={3}
            summary={scheduleSummary}
            isComplete={!!scheduleSummary}
            collapseWhenComplete={false}
          >
            <p className="text-sm text-muted-foreground mb-4 text-ko-balance">{runningPreferenceCopy.sectionHint}</p>
            <div className="rounded-2xl border border-orange-200 bg-white p-4 sm:p-6 space-y-5">
              <fieldset>
                <legend className="text-sm font-semibold text-foreground mb-3">
                  {runningPreferenceCopy.daysLabel}{" "}
                  <span className="text-muted-foreground font-normal">{runningPreferenceCopy.daysOptional}</span>
                </legend>
                <div className="flex flex-wrap gap-2">
                  {runningDayOptions.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleRunningDay(day)}
                      className={cn(
                        "interactive-chip h-11 min-w-[44px] px-4 rounded-[10px] border font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500",
                        runningDays.includes(day)
                          ? "interactive-chip-selected border-orange-500 bg-orange-50 text-orange-700"
                          : "border-orange-200 bg-white hover:border-orange-300"
                      )}
                      aria-pressed={runningDays.includes(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-sm font-semibold text-foreground mb-3">
                  {runningPreferenceCopy.timeLabel}{" "}
                  <span className="text-muted-foreground font-normal">{runningPreferenceCopy.timeOptional}</span>
                </legend>
                <input
                  id="runningTimePreference"
                  type="text"
                  value={runningTimePreference}
                  onChange={(e) => setRunningTimePreference(e.target.value)}
                  className="w-full h-11 rounded-[10px] border border-orange-200 px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  placeholder={runningPreferenceCopy.timePlaceholder}
                />
                <p className="text-xs text-muted-foreground mt-2">{runningPreferenceCopy.suggestionsLabel}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {runningTimeSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => appendTimeSuggestion(suggestion)}
                      className="interactive-chip h-9 px-3 rounded-[10px] border border-dashed border-orange-200 bg-orange-50/50 text-sm text-orange-700 hover:border-orange-300 hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                      aria-label={`참고: ${suggestion} — 입력란에 추가`}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          </ApplyFormStep>

          <ApplyFormStep
            id="step-info"
            headingId="info-heading"
            title="참가자 정보"
            stepNumber={4}
            summary={infoSummary}
            isComplete={!!form.name.trim() && isValidPhone(form.phone)}
            collapseWhenComplete={false}
          >
            <div className="space-y-4 rounded-2xl border border-orange-200 bg-white p-4 sm:p-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-1">
                  이름 <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full h-11 rounded-[10px] border border-orange-200 px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  placeholder="홍길동"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-foreground mb-1">
                  휴대폰 번호 <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  // 숫자만 입력해도 자동으로 하이픈을 넣어 표시합니다.
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: formatPhoneInput(e.target.value) }))}
                  className="w-full h-11 rounded-[10px] border border-orange-200 px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  placeholder="010-1234-5678"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={13}
                  aria-invalid={Boolean(errors.phone)}
                />
                {errors.phone && (
                  <p className="text-sm text-red-600 mt-1" role="alert">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-1">
                  이메일 <span className="text-muted-foreground font-normal">(선택)</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full h-11 rounded-[10px] border border-orange-200 px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  placeholder="hello@example.com"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>
          </ApplyFormStep>

          <ApplyFormStep
            id="step-shipping"
            headingId="shipping-heading"
            title={shippingAddressCopy.sectionTitle}
            stepNumber={5}
            summary={shippingSummary}
            isComplete={Boolean(shippingZipcode && shippingAddress && shippingAddressDetail.trim())}
            collapseWhenComplete={false}
          >
            <p className="text-sm text-muted-foreground mb-4 text-ko-balance">{shippingAddressCopy.sectionHint}</p>
            <div className="rounded-2xl border border-orange-200 bg-white p-4 sm:p-6 space-y-4">
              <AddressSearchInput
                zipcode={shippingZipcode}
                address={shippingAddress}
                addressDetail={shippingAddressDetail}
                onZipcodeChange={(value) => {
                  setShippingZipcode(value)
                  setErrors((prev) => ({ ...prev, shippingZipcode: undefined, shippingAddress: undefined }))
                }}
                onAddressChange={(value) => {
                  setShippingAddress(value)
                  setErrors((prev) => ({ ...prev, shippingAddress: undefined }))
                }}
                onAddressDetailChange={(value) => {
                  setShippingAddressDetail(value)
                  setErrors((prev) => ({ ...prev, shippingAddressDetail: undefined }))
                }}
                zipcodeError={errors.shippingZipcode}
                addressError={errors.shippingAddress}
                addressDetailError={errors.shippingAddressDetail}
                disabled={isRecruitmentBlocked}
                // 주소 검색 팝업이 열린 동안 하단 고정 제출바 터치 충돌을 줄입니다.
                onSearchStateChange={setIsAddressSearchActive}
              />

              {shippingPreview && (
                <p className="text-sm text-muted-foreground">
                  발송지: <strong className="text-foreground">{shippingPreview}</strong>
                </p>
              )}
            </div>
          </ApplyFormStep>

          <section id="step-consent" data-apply-step="step-consent" aria-labelledby="consent-heading">
            <h2 id="consent-heading" className="text-xl font-black text-foreground mb-4">
              6. 동의
            </h2>
            <div className="rounded-2xl border border-orange-200 bg-white p-4 sm:p-6 space-y-4">
              <label className="flex items-start gap-3 cursor-pointer min-h-[44px]">
                <input
                  id="privacyConsent"
                  type="checkbox"
                  checked={privacyConsent}
                  onChange={(e) => {
                    setPrivacyConsent(e.target.checked)
                    setErrors((prev) => ({ ...prev, privacyConsent: undefined }))
                  }}
                  className="mt-1 h-5 w-5 rounded border-orange-300 text-orange-500 focus-visible:ring-orange-500"
                  aria-invalid={Boolean(errors.privacyConsent)}
                />
                <span className="text-sm text-foreground">
                  <span className="font-semibold">개인정보 수집·이용에 동의합니다</span>{" "}
                  <span className="text-red-500">*</span>
                  <span className="block text-xs text-muted-foreground mt-1">{privacyConsentSummary}</span>
                  {/* 동의 문서 확인 후 폼으로 쉽게 돌아오도록 새 탭 링크를 사용합니다. */}
                  <span className="mt-1 block text-xs text-muted-foreground">
                    자세히 보기:{" "}
                    <Link
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-orange-600"
                    >
                      개인정보 처리방침
                    </Link>
                    {" · "}
                    <Link
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-orange-600"
                    >
                      참가 약관
                    </Link>
                  </span>
                </span>
              </label>
              {errors.privacyConsent && (
                <p className="text-sm text-red-600" role="alert">
                  {errors.privacyConsent}
                </p>
              )}
            </div>
          </section>

          <ParticipationPolicyNotes className="bg-orange-50/40" />

          {/* 7. 입금 안내 */}
          <section id="step-payment" data-apply-step="step-payment" aria-labelledby="payment-heading">
            <h2 id="payment-heading" className="text-xl font-black text-foreground mb-4">
              7. 참가비 입금
            </h2>
            <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-6 text-sm text-muted-foreground">
              <p>
                신청 완료 후 <strong className="text-foreground">{paymentInfo.bank}</strong> 계좌로 코스별 참가비를
                입금해 주세요. 입금 확인 후 참가가 확정됩니다.
              </p>
              <p className="mt-2 text-xs">{depositPolicy.confirmationSla}</p>
              <p className="mt-1 text-xs">입금 기한: {formatPolicyValue(depositPolicy.paymentDeadline)}</p>
              {selectedTier && (
                <p className="mt-2 font-bold text-orange-600">
                  선택 코스 참가비: {feeFormatter.format(selectedTier.fee)}원
                </p>
              )}
            </div>
          </section>

          {submitError && (
            <p className="text-sm text-red-600 text-center hidden md:block" role="alert">
              {submitError}
            </p>
          )}

          <div className="hidden md:block">{submitButton}</div>
        </form>
      </div>

      <ApplyStickySubmit className={cn(isAddressSearchActive && "pointer-events-none opacity-70")}>
        {submitError && (
          <p className="text-sm text-red-600 text-center mb-2" role="alert">
            {submitError}
          </p>
        )}
        {submitButton}
      </ApplyStickySubmit>
    </div>
  )
}
