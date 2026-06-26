import {
  daejeonDistricts,
  formatLocationLabel,
  runningDayOptions,
  runTiers,
  type DaejeonDistrict,
  type LocationCityId,
  type RunTierId
} from "@/lib/event-config"
import { formatShippingAddressLabel } from "@/lib/shipping-address"
import { z } from "zod"

const runningDaySchema = z.enum(runningDayOptions)
const districtSchema = z.enum(daejeonDistricts)
const cityIdSchema = z.enum(["daejeon", "outside"] as const satisfies readonly LocationCityId[])

// 참가 신청 API 요청 스키마
export const applyRequestSchema = z
  .object({
    name: z.string().trim().min(1, "이름을 입력해 주세요."),
    phone: z
      .string()
      .trim()
      .refine((value) => /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/.test(value.replace(/\s/g, "")), {
        message: "올바른 휴대폰 번호를 입력해 주세요."
      }),
    email: z
      .string()
      .trim()
      .optional()
      .transform((value) => value || "")
      .refine((value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
        message: "올바른 이메일을 입력해 주세요."
      }),
    tierId: z.enum(["50k", "70k", "100k"] as const satisfies readonly RunTierId[]),
    cityId: cityIdSchema,
    district: districtSchema.optional(),
    outsideRegion: z
      .string()
      .trim()
      .optional()
      .transform((v) => v || ""),
    // 러닝 계획 — 선택 사항 (빈 배열·빈 문자열 허용)
    runningDays: z.array(runningDaySchema).default([]),
    runningTimePreference: z
      .string()
      .trim()
      .optional()
      .transform((v) => v || ""),
    // 키캡키링 발송지 — 우편번호 검색 + 상세주소 직접 입력
    shippingZipcode: z
      .string()
      .trim()
      .min(1, "발송지 우편번호를 입력해 주세요.")
      .refine((value) => /^\d{5}$/.test(value), {
        message: "주소 검색 버튼으로 우편번호를 입력해 주세요."
      }),
    shippingAddress: z.string().trim().min(1, "발송지 기본 주소를 입력해 주세요."),
    shippingAddressDetail: z
      .string()
      .trim()
      .min(1, "상세 주소를 입력해 주세요.")
      .max(100, "상세 주소는 100자 이하로 입력해 주세요."),
    privacyConsent: z.literal(true, {
      errorMap: () => ({ message: "개인정보 수집·이용에 동의해 주세요." })
    })
  })
  .superRefine((data, ctx) => {
    if (data.cityId === "daejeon") {
      if (!data.district) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "대전 거주 시 구를 선택해 주세요.",
          path: ["district"]
        })
      }
      if (data.outsideRegion) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "대전 선택 시 대전 외 지역을 입력할 수 없습니다.",
          path: ["outsideRegion"]
        })
      }
    } else {
      if (data.district) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "대전 외 선택 시 구를 입력할 수 없습니다.",
          path: ["district"]
        })
      }
      // 대전 외일 때는 상세 지역 입력을 필수로 받습니다.
      if (!data.outsideRegion) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "거주 지역을 입력해 주세요.",
          path: ["outsideRegion"]
        })
      } else if (data.outsideRegion.length > 50) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "거주 지역은 50자 이하로 입력해 주세요.",
          path: ["outsideRegion"]
        })
      }
    }
  })
  .transform((data) => {
    const locationLabel = formatLocationLabel(
      data.cityId,
      data.cityId === "daejeon" ? data.district : undefined,
      data.cityId === "outside" ? data.outsideRegion : undefined
    )

    const shippingAddressLabel = formatShippingAddressLabel({
      zipcode: data.shippingZipcode,
      address: data.shippingAddress,
      addressDetail: data.shippingAddressDetail
    })

    return {
      ...data,
      locationLabel,
      runningDaysLabel: data.runningDays.length > 0 ? data.runningDays.join(", ") : "(미입력)",
      runningTimePreferenceLabel: data.runningTimePreference || "(미입력)",
      shippingAddressLabel
    }
  })

export type ApplyRequest = z.infer<typeof applyRequestSchema>

/** tierId로 코스 정보 조회 */
export function getTierById(tierId: RunTierId) {
  return runTiers.find((tier) => tier.id === tierId) ?? null
}

/** 클라이언트 폼 district 타입 */
export type { DaejeonDistrict, LocationCityId }
