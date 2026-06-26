"use client"

import { cn } from "@/lib/utils"
import { Search } from "lucide-react"
import { useState } from "react"

// 다음(카카오) 우편번호 API 스크립트 URL
const DAUM_POSTCODE_SCRIPT_URL =
  "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"

/** 다음 우편번호 검색 결과 */
export type DaumPostcodeResult = {
  zonecode: string
  roadAddress: string
  jibunAddress: string
}

type DaumPostcodeConstructor = new (options: {
  oncomplete: (data: {
    zonecode: string
    roadAddress: string
    jibunAddress: string
    userSelectedType: "R" | "J"
    address: string
  }) => void
  onclose?: (state: "FORCE_CLOSE" | "COMPLETE_CLOSE") => void
  width?: string
  height?: string
}) => {
  open: () => void
  embed: (element: HTMLElement) => void
}

declare global {
  interface Window {
    daum?: {
      Postcode: DaumPostcodeConstructor
    }
  }
}

let postcodeScriptPromise: Promise<void> | null = null

/** 스크립트 로드 완료까지 짧게 대기합니다. */
function waitForDaumPostcode(timeoutMs = 5000): Promise<void> {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now()

    const check = () => {
      if (window.daum?.Postcode) {
        resolve()
        return
      }

      if (Date.now() - startedAt >= timeoutMs) {
        reject(new Error("주소 검색 스크립트 준비 시간 초과"))
        return
      }

      window.setTimeout(check, 50)
    }

    check()
  })
}

/** 다음 우편번호 스크립트를 한 번만 로드합니다. */
function loadDaumPostcodeScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("브라우저에서만 주소 검색을 사용할 수 있습니다."))
  }

  if (window.daum?.Postcode) return Promise.resolve()

  if (!postcodeScriptPromise) {
    postcodeScriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(
        `script[src="${DAUM_POSTCODE_SCRIPT_URL}"]`
      )

      const finish = () => {
        waitForDaumPostcode()
          .then(resolve)
          .catch(reject)
      }

      if (existing) {
        // 이미 로드된 스크립트면 load 이벤트가 다시 발생하지 않으므로 폴링으로 확인합니다.
        if (existing.dataset.loaded === "true") {
          finish()
          return
        }

        existing.addEventListener(
          "load",
          () => {
            existing.dataset.loaded = "true"
            finish()
          },
          { once: true }
        )
        existing.addEventListener("error", () => reject(new Error("주소 검색 스크립트 로드 실패")), {
          once: true
        })
        return
      }

      const script = document.createElement("script")
      script.src = DAUM_POSTCODE_SCRIPT_URL
      script.async = true
      script.onload = () => {
        script.dataset.loaded = "true"
        finish()
      }
      script.onerror = () => reject(new Error("주소 검색 스크립트 로드 실패"))
      document.head.appendChild(script)
    })
  }

  return postcodeScriptPromise
}

type AddressSearchInputProps = {
  zipcode: string
  address: string
  addressDetail: string
  onZipcodeChange: (value: string) => void
  onAddressChange: (value: string) => void
  onAddressDetailChange: (value: string) => void
  zipcodeError?: string
  addressError?: string
  addressDetailError?: string
  disabled?: boolean
}

/** 우편번호 검색 + 상세주소 입력 UI */
export function AddressSearchInput({
  zipcode,
  address,
  addressDetail,
  onZipcodeChange,
  onAddressChange,
  onAddressDetailChange,
  zipcodeError,
  addressError,
  addressDetailError,
  disabled = false
}: AddressSearchInputProps) {
  const [searchError, setSearchError] = useState<string | null>(null)
  const [isLoadingScript, setIsLoadingScript] = useState(false)

  const openPostcodeSearch = async () => {
    if (disabled) return

    setSearchError(null)
    setIsLoadingScript(true)

    try {
      await loadDaumPostcodeScript()

      if (!window.daum?.Postcode) {
        throw new Error("주소 검색을 불러오지 못했습니다.")
      }

      // embed 대신 open()을 사용합니다. React 렌더 타이밍과 무관하게 동작합니다.
      new window.daum.Postcode({
        oncomplete: (data) => {
          onZipcodeChange(data.zonecode)
          // 도로명(R) 선택 시 roadAddress, 지번(J) 선택 시 jibunAddress를 우선 사용합니다.
          const selectedAddress =
            data.userSelectedType === "R"
              ? data.roadAddress || data.address
              : data.jibunAddress || data.address
          onAddressChange(selectedAddress)
        }
      }).open()
    } catch {
      setSearchError("주소 검색을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.")
    } finally {
      setIsLoadingScript(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="shipping-zipcode" className="block text-sm font-semibold text-foreground mb-1">
          우편번호 <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="shipping-zipcode"
            type="text"
            inputMode="numeric"
            value={zipcode}
            readOnly
            className={cn(
              // sm 이상 가로 배치에서도 버튼이 밀리지 않게 수축을 허용합니다.
              "min-w-0 flex-1 h-11 rounded-[10px] border border-orange-200 px-3 bg-orange-50/40 text-base text-foreground",
              zipcodeError && "border-red-400"
            )}
            placeholder="주소 검색 시 자동 입력"
            aria-invalid={Boolean(zipcodeError)}
          />
          <button
            type="button"
            onClick={openPostcodeSearch}
            disabled={disabled || isLoadingScript}
            className="h-11 w-full shrink-0 justify-center px-4 rounded-[10px] border border-orange-500 bg-orange-500 text-white font-semibold inline-flex items-center gap-1.5 hover:bg-orange-600 transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 sm:w-auto"
          >
            <Search className="w-4 h-4" aria-hidden />
            {isLoadingScript ? "불러오는 중..." : "주소 검색"}
          </button>
        </div>
        {zipcodeError && (
          <p className="text-sm text-red-600 mt-1" role="alert">
            {zipcodeError}
          </p>
        )}
        {searchError && (
          <p className="text-sm text-red-600 mt-1" role="alert">
            {searchError}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="shipping-address" className="block text-sm font-semibold text-foreground mb-1">
          기본 주소 <span className="text-red-500">*</span>
        </label>
        <input
          id="shipping-address"
          type="text"
          value={address}
          readOnly
          className={cn(
            "w-full h-11 rounded-[10px] border border-orange-200 px-3 bg-orange-50/40 text-base text-foreground",
            addressError && "border-red-400"
          )}
          placeholder="주소 검색 후 자동 입력됩니다"
          aria-invalid={Boolean(addressError)}
        />
        {addressError && (
          <p className="text-sm text-red-600 mt-1" role="alert">
            {addressError}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="shipping-address-detail" className="block text-sm font-semibold text-foreground mb-1">
          상세 주소 <span className="text-red-500">*</span>
        </label>
        <input
          id="shipping-address-detail"
          type="text"
          value={addressDetail}
          onChange={(event) => onAddressDetailChange(event.target.value)}
          disabled={disabled}
          className={cn(
            "w-full h-11 rounded-[10px] border border-orange-200 px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500",
            addressDetailError && "border-red-400"
          )}
          placeholder="동·호수, 공동현관 비밀번호 등"
          autoComplete="address-line2"
          aria-invalid={Boolean(addressDetailError)}
        />
        {addressDetailError && (
          <p className="text-sm text-red-600 mt-1" role="alert">
            {addressDetailError}
          </p>
        )}
      </div>
    </div>
  )
}
